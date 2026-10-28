// // // import React, { useState, useEffect, useMemo, useRef } from "react";
// // // import { backendUrl } from "./config";

// // // // --- SVG Icons ---
// // // const CommentIcon = ({ className = "h-4 w-4" }) => (
// // //   <svg
// // //     xmlns="http://www.w3.org/2000/svg"
// // //     className={className}
// // //     fill="none"
// // //     viewBox="0 0 24 24"
// // //     stroke="currentColor"
// // //   >
// // //     <path
// // //       strokeLinecap="round"
// // //       strokeLinejoin="round"
// // //       strokeWidth={2}
// // //       d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
// // //     />
// // //   </svg>
// // // );
// // // const PlusIcon = ({ className = "h-4 w-4" }) => (
// // //   <svg
// // //     xmlns="http://www.w3.org/2000/svg"
// // //     className={className}
// // //     fill="none"
// // //     viewBox="0 0 24 24"
// // //     stroke="currentColor"
// // //   >
// // //     {" "}
// // //     <path
// // //       strokeLinecap="round"
// // //       strokeLinejoin="round"
// // //       strokeWidth={2}
// // //       d="M12 6v6m0 0v6m0-6h6m-6 0H6"
// // //     />{" "}
// // //   </svg>
// // // );

// // // const CopyIcon = ({ className = "h-4 w-4" }) => (
// // //   <svg
// // //     xmlns="http://www.w3.org/2000/svg"
// // //     className={className}
// // //     fill="none"
// // //     viewBox="0 0 24 24"
// // //     stroke="currentColor"
// // //   >
// // //     {" "}
// // //     <path
// // //       strokeLinecap="round"
// // //       strokeLinejoin="round"
// // //       strokeWidth={2}
// // //       d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
// // //     />{" "}
// // //   </svg>
// // // );

// // // const TrashIcon = ({ className = "h-4 w-4" }) => (
// // //   <svg
// // //     xmlns="http://www.w3.org/2000/svg"
// // //     className={className}
// // //     fill="none"
// // //     viewBox="0 0 24 24"
// // //     stroke="currentColor"
// // //   >
// // //     {" "}
// // //     <path
// // //       strokeLinecap="round"
// // //       strokeLinejoin="round"
// // //       strokeWidth={2}
// // //       d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
// // //     />{" "}
// // //   </svg>
// // // );

// // // const EyeIcon = ({ className = "h-4 w-4" }) => (
// // //   <svg
// // //     xmlns="http://www.w3.org/2000/svg"
// // //     className={className}
// // //     fill="none"
// // //     viewBox="0 0 24 24"
// // //     stroke="currentColor"
// // //   >
// // //     {" "}
// // //     <path
// // //       strokeLinecap="round"
// // //       strokeLinejoin="round"
// // //       strokeWidth={2}
// // //       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
// // //     />{" "}
// // //     <path
// // //       strokeLinecap="round"
// // //       strokeLinejoin="round"
// // //       strokeWidth={2}
// // //       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
// // //     />{" "}
// // //   </svg>
// // // );

// // // const XIcon = ({ className = "h-4 w-4" }) => (
// // //   <svg
// // //     xmlns="http://www.w3.org/2000/svg"
// // //     className={className}
// // //     fill="none"
// // //     viewBox="0 0 24 24"
// // //     stroke="currentColor"
// // //   >
// // //     {" "}
// // //     <path
// // //       strokeLinecap="round"
// // //       strokeLinejoin="round"
// // //       strokeWidth={2}
// // //       d="M6 18L18 6M6 6l12 12"
// // //     />{" "}
// // //   </svg>
// // // );

// // // const MinusCircleIcon = ({ className = "h-4 w-4" }) => (
// // //   <svg
// // //     xmlns="http://www.w3.org/2000/svg"
// // //     className={className}
// // //     fill="none"
// // //     viewBox="0 0 24 24"
// // //     stroke="currentColor"
// // //   >
// // //     {" "}
// // //     <path
// // //       strokeLinecap="round"
// // //       strokeLinejoin="round"
// // //       strokeWidth={2}
// // //       d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
// // //     />{" "}
// // //   </svg>
// // // );

// // // // --- ActionButton Component ---

// // // const ActionButton = ({
// // //   children,
// // //   onClick,
// // //   icon,
// // //   className = "",
// // //   disabled = false,
// // // }) => {
// // //   const buttonStyle = disabled
// // //     ? "btn1 btn-inactive opacity-60 cursor-not-allowed"
// // //     : "btn1 btn-blue cursor-pointer";

// // //   return (
// // //     <button
// // //       onClick={onClick}
// // //       disabled={disabled}
// // //       className={`${buttonStyle} inline-flex items-center gap-1.5 text-xs font-semibold ${className}`}
// // //     >
// // //       {icon && <span>{icon}</span>}
// // //       {children}
// // //     </button>
// // //   );
// // // };

// // // // --- Toast Notification (Updated Duration) ---

// // // const showToast = (message, type = "info", duration = 3000) => {
// // //   const toast = document.createElement("div");

// // //   const typeClasses = {
// // //     success: "bg-green-500",
// // //     error: "bg-red-500",
// // //     warning: "bg-yellow-500 text-black",
// // //     info: "bg-blue-500",
// // //   };

// // //   toast.className = `fixed top-5 right-5 p-4 rounded-md text-white shadow-lg z-[10000] ${typeClasses[type] || typeClasses["info"]
// // //     }`;

// // //   toast.textContent = message;

// // //   document.body.appendChild(toast);

// // //   setTimeout(() => {
// // //     if (document.body.contains(toast)) {
// // //       document.body.removeChild(toast);
// // //     }
// // //   }, duration);
// // // };

// // // const createEmptyLine = (id, periodLength) => {
// // //   const emptyHours = {};
// // //   const emptyComments = {};

// // //   for (let i = 0; i < periodLength; i++) {
// // //     emptyHours[i] = 0;
// // //     emptyComments[i] = "";
// // //   }

// // //   return {
// // //     id,
// // //     description: "",
// // //     project: "",
// // //     plc: "",
// // //     workOrder: "",
// // //     wa_Code: "",
// // //     pmUserID: "",
// // //     payType: "SR",

// // //     poNumber: "",
// // //     rlseNumber: "",
// // //     poLineNumber: "",
// // //     hours: emptyHours,
// // //     hourIds: {},
// // //     comments: emptyComments,
// // //     isInvoiced: false,
// // //   };
// // // };

// // // const CascadingSelect = ({
// // //   label,
// // //   options,
// // //   value,
// // //   onChange,
// // //   disabled = false,
// // // }) => (
// // //   <select
// // //     value={value}
// // //     onChange={onChange}
// // //     disabled={disabled}
// // //     className={`w-full bg-white px-2 py-1 text-xs border border-gray-300 rounded shadow-inner text-black focus:outline-none focus:ring-1 focus:ring-blue-500 ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
// // //       }`}
// // //   >
// // //     <option value="">Select {label}</option>
// // //     {options.map((opt) => (
// // //       <option key={opt.value} value={opt.value}>
// // //         {opt.label}
// // //       </option>
// // //     ))}
// // //   </select>
// // // );

// // // const formatDate = (dateInput) => {
// // //   if (!dateInput) return "";

// // //   let date;

// // //   if (dateInput instanceof Date) {
// // //     date = dateInput;
// // //   } else {
// // //     const dateOnlyString = String(dateInput).split("T")[0];

// // //     const parts = dateOnlyString.split("-");

// // //     if (parts.length !== 3) return dateInput;

// // //     const year = parseInt(parts[0], 10);

// // //     const month = parseInt(parts[1], 10) - 1;

// // //     const day = parseInt(parts[2], 10);

// // //     date = new Date(Date.UTC(year, month, day));
// // //   }

// // //   if (isNaN(date.getTime())) return "";

// // //   return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(date);
// // // };

// // // const getPeriodData = (endDateStr, frequency) => {
// // //   // --- CRITICAL CHANGE: Parse MM/DD/YYYY format for endDateStr ---
// // //   const dateOnlyString = endDateStr.split("T")[0];
// // //   const parts = dateOnlyString.split(/[-\/]/).map(Number); // Handles both MM/DD/YYYY and YYYY-MM-DD formats more flexibly

// // //   let year, monthIndex, day;
// // //   if (parts.length === 3) {
// // //     // Determine format based on typical display order vs ISO order (heuristically, assuming YYYY is large)
// // //     if (parts[0] > 31 && parts[0] > 1900) {
// // //       // Assumes YYYY-MM-DD format (ISO)
// // //       year = parts[0];
// // //       monthIndex = parts[1] - 1;
// // //       day = parts[2];
// // //     } else {
// // //       // Assumes MM/DD/YYYY format (Display)
// // //       monthIndex = parts[0] - 1;
// // //       day = parts[1];
// // //       year = parts[2];
// // //     }
// // //   } else {
// // //     // Fallback or handle invalid input
// // //     return [];
// // //   } // Construct the Date object explicitly in UTC to ensure no local timezone offset

// // //   const end = new Date(Date.UTC(year, monthIndex, day)); // --- Rest of the logic remains UTC-safe ---
// // //   const dates = [];
// // //   const freq = frequency ? frequency.toLowerCase() : "weekly";

// // //   const numOpt = { month: "2-digit", day: "2-digit", timeZone: "UTC" };
// // //   const txtOpt = { month: "short", day: "2-digit", timeZone: "UTC" };

// // //   const getFmt = (d) => {
// // //     if (freq === "monthly" || freq === "semi-monthly")
// // //       return new Intl.DateTimeFormat("en-US", txtOpt).format(d);
// // //     return new Intl.DateTimeFormat("en-US", numOpt).format(d);
// // //   }; // This ensures the output date for API remains YYYY-MM-DD
// // //   const getApiFmt = (d) => d.toISOString().split("T")[0]; // Use 'end' date which is now correctly set to UTC midnight for the calendar date

// // //   let start = new Date(end); // start is also a UTC date for the end day

// // //   if (freq === "weekly") {
// // //     // Setting date on a UTC Date object is safe and keeps it in UTC context
// // //     start.setUTCDate(end.getUTCDate() - 6);
// // //   } else if (freq === "bi-weekly") {
// // //     start.setUTCDate(end.getUTCDate() - 13);
// // //   } else if (freq === "monthly") {
// // //     // Calculate start of month in UTC
// // //     start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));
// // //   } else if (freq === "semi-monthly") {
// // //     if (end.getUTCDate() <= 15) {
// // //       // Calculate start of 1st half of month in UTC
// // //       start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));
// // //     } else {
// // //       // Calculate start of 2nd half of month in UTC
// // //       start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 16));
// // //     }
// // //   } // Iterate using UTC date methods

// // //   for (
// // //     let d = new Date(start);
// // //     d.getTime() <= end.getTime();
// // //     d.setUTCDate(d.getUTCDate() + 1)
// // //   ) {
// // //     const currentDay = new Date(d); // Create a new object for each day
// // //     dates.push({
// // //       display: getFmt(currentDay),
// // //       apiDate: getApiFmt(currentDay),
// // //       obj: currentDay,
// // //     });
// // //   }

// // //   return dates;
// // // };

// // // const hideableColumns = [
// // //   "Work Order",
// // //   "Description",
// // //   "Project",
// // //   "PLC",
// // //   "Pay Type",

// // //   "PO Number",
// // //   "RLSE Number",
// // //   "PO Line Number",
// // //   "PO Remaining Hours",
// // // ];

// // // export default function TimesheetDetailModal({
// // //   timesheetData,
// // //   currentUser,
// // //   userId,
// // //   role,
// // //   onClose,

// // //   onSave,

// // //   isSaving,

// // //   isAdmin = false,
// // // }) {
// // //   const [lines, setLines] = useState([]);

// // //   const [selectedLines, setSelectedLines] = useState(new Set());

// // //   const [isLoading, setIsLoading] = useState(true);

// // //   const [purchaseOrderData, setPurchaseOrderData] = useState([]);
// // //   const [employeeProjects, setEmployeeProjects] = useState([]);

// // //   const [isEditable, setIsEditable] = useState(false);

// // //   const [initialLines, setInitialLines] = useState([]);

// // //   const [linesToDelete, setLinesToDelete] = useState([]);

// // //   const [isCurrentlySaving, setIsCurrentlySaving] = useState(false);

// // //   const [timesheetDetails, setTimesheetDetails] = useState(null);

// // //   // Comment Modal state for individual hour comments
// // //   const [commentModal, setCommentModal] = useState({
// // //     isOpen: false,
// // //     lineId: null,
// // //     dayIndex: null,
// // //     dateLabel: "",
// // //     comment: "",
// // //     isReadOnly: false,
// // //   });

// // //   const openCommentModal = (lineId, dayIndex, dateLabel, isReadOnly = false) => {
// // //     const line = lines.find((l) => l.id === lineId);
// // //     const existingComment = line?.comments?.[dayIndex] || "";
// // //     setCommentModal({
// // //       isOpen: true,
// // //       lineId,
// // //       dayIndex,
// // //       dateLabel: dateLabel || `Day ${dayIndex + 1}`,
// // //       comment: existingComment,
// // //       isReadOnly,
// // //     });
// // //   };

// // //   const closeCommentModal = () => {
// // //     setCommentModal((prev) => ({ ...prev, isOpen: false }));
// // //   };

// // //   const saveComment = (newComment) => {
// // //     if (commentModal.lineId == null || commentModal.dayIndex == null) return;
// // //     const { lineId, dayIndex } = commentModal;
// // //     setLines((prevLines) =>
// // //       prevLines.map((line) =>
// // //         line.id === lineId
// // //           ? {
// // //               ...line,
// // //               comments: {
// // //                 ...(line.comments || {}),
// // //                 [dayIndex]: newComment,
// // //               },
// // //             }
// // //           : line,
// // //       ),
// // //     );
// // //     closeCommentModal();
// // //   };

// // //   // const [hiddenColumns, setHiddenColumns] = useState({
// // //   //   "Work Order": false,
// // //   //   Description: false,
// // //   //   Project: false,
// // //   //   PLC: false,
// // //   //   "Pay Type": false,

// // //   //   "PO Number": false,
// // //   //   "RLSE Number": false,
// // //   //   "PO Line Number": false,
// // //   //   "PO Remaining Hours": false,
// // //   // }); // Config States

// // //   // const role = currentUser?.role?.toLowerCase(); // Default role, can be dynamically set based on user context

// // //   console.log(timesheetData?.status);

// // //   // Define hideable columns conditionally based on the role
// // //   // const hideableColumns =
// // //   //   role === "user"
// // //   //     ? ["Project", "PLC", "Pay Type"]
// // //   //     : [
// // //   //         "Work Order",
// // //   //         "Description",
// // //   //         "Project",
// // //   //         "PLC",
// // //   //         "Pay Type",
// // //   //         "PO Number",
// // //   //         "RLSE Number",
// // //   //         "PO Line Number",
// // //   //         "PO Remaining Hours",
// // //   //       ];
// // //   const hideableColumns =
// // //     role === "fbsdusbcsdnjsbhasbx"
// // //       ? [
// // //         "Work Order",
// // //         "Description",
// // //         "Project",
// // //         "PLC",
// // //         "Pay Type",
// // //         "PO Number",
// // //         "RLSE Number",
// // //         "PO Line Number",
// // //         "PO Remaining Hours",
// // //       ]
// // //       : ["Project", "Project Name", "PLC", "PLC Description", "Pay Type"];

// // //   const [hiddenColumns, setHiddenColumns] = useState(() => {
// // //     const initial = {};
// // //     hideableColumns.forEach((col) => {
// // //       initial[col] = false;
// // //     });
// // //     return initial;
// // //   });

// // //   const [periodType, setPeriodType] = useState("Weekly");

// // //   const [configWeekends, setConfigWeekends] = useState([]);

// // //   const [configHighlightColor, setConfigHighlightColor] = useState("");

// // //   const [maxDailyHours, setMaxDailyHours] = useState(24);

// // //   const [hardEdit, setHardEdit] = useState(false); // Dynamic Dates

// // //   const periodDates = useMemo(() => {
// // //     if (!timesheetData?.Date) return [];

// // //     return getPeriodData(timesheetData.Date, periodType);
// // //   }, [timesheetData, periodType]);

// // //   const [remainingPoHours, setRemainingPoHours] = useState({});

// // //   const [isLoadingRemainingHours, setIsLoadingRemainingHours] = useState(false);

// // //   const [showReasonPrompt, setShowReasonPrompt] = useState(false);

// // //   const [updateReason, setUpdateReason] = useState("");

// // //   const nextId = useRef(0); // Global 'today' variable for future date check, set to midnight UTC // We keep this as UTC midnight for correct date part comparison.

// // //   //   const today = useMemo(() => {

// // //   //     const d = new Date();

// // //   //     return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

// // //   //   }, []);

// // //   const today = useMemo(() => {
// // //     const d = new Date(); // Get the current UTC date components
// // //     const year = d.getUTCFullYear();
// // //     const month = d.getUTCMonth();
// // //     const date = d.getUTCDate(); // Create a new Date object representing the start of the current UTC calendar day
// // //     return new Date(Date.UTC(year, month, date));
// // //   }, []); // 1. Fetch Config (Updated)

// // //   useEffect(() => {
// // //     if (role !== "fbsdusbcsdnjsbhasbx") {
// // //       const fetchEmployeeProjects = async () => {
// // //         try {
// // //           const response = await fetch(
// // //             // `${backendUrl}/api/user-projects/projects/${userId}`,
// // //             // `${backendUrl}/api/ProjEmployeeLabcat/employee/${currentUser?.name}`,
// // //             `${backendUrl}/api/ProjEmployeeLabcat/employee/${userId}`,
// // //           );
// // //           if (!response.ok)
// // //             throw new Error("Failed to fetch employee projects");
// // //           const data = await response.json();
// // //           if (Array.isArray(data)) {
// // //             setEmployeeProjects(data);
// // //           }
// // //         } catch (err) {
// // //           console.error("Error fetching employee projects:", err);
// // //         }
// // //       };
// // //       fetchEmployeeProjects();
// // //     }
// // //   }, [role]);

// // //   useEffect(() => {
// // //     const fetchConfig = async () => {
// // //       try {
// // //         const response = await fetch(`${backendUrl}/api/ConfigValues`);

// // //         if (!response.ok) throw new Error("Failed to fetch config");

// // //         const data = await response.json();

// // //         const getConfigValue = (name) =>
// // //           data.find((item) => item.name?.toLowerCase() === name)?.value;

// // //         const periodConfig = getConfigValue("timesheet_period");

// // //         const weekendConfig = getConfigValue("weekend");

// // //         const colorConfig = getConfigValue("weekend_highlight_color");

// // //         const maxDailyHoursConfig = getConfigValue("max_daily_hours");

// // //         const hardEditConfig = getConfigValue("hard_edit");

// // //         if (periodConfig) setPeriodType(periodConfig);

// // //         if (weekendConfig) {
// // //           const days = weekendConfig
// // //             .split(",")
// // //             .map((d) => d.trim().toLowerCase());

// // //           setConfigWeekends(days);
// // //         }

// // //         if (colorConfig) setConfigHighlightColor(colorConfig);

// // //         if (maxDailyHoursConfig)
// // //           setMaxDailyHours(parseFloat(maxDailyHoursConfig) || 24);

// // //         if (hardEditConfig)
// // //           setHardEdit(hardEditConfig.toLowerCase() === "true");
// // //       } catch (error) {
// // //         console.error("Config fetch error:", error);

// // //         setPeriodType("Weekly"); // Fallback

// // //         setConfigWeekends(["saturday", "sunday"]); // Fallback

// // //         setConfigHighlightColor("#e5e7eb"); // Fallback

// // //         setMaxDailyHours(24); // Fallback

// // //         setHardEdit(false); // Fallback
// // //       }
// // //     };

// // //     fetchConfig();
// // //   }, []); // 2. Check Editability

// // //   useEffect(() => {
// // //     if (timesheetData) {
// // //       const status = timesheetData.Status?.toUpperCase();

// // //       setIsEditable(
// // //         status === "OPEN" || status === "REJECTED" || status === "CORRECTION",
// // //       );
// // //     }
// // //   }, [timesheetData]); // 3. Fetch PO Remaining Hours

// // //   useEffect(() => {
// // //     if (!timesheetData || !timesheetData["Employee ID"]) return;

// // //     const fetchRemainingHours = async () => {
// // //       setIsLoadingRemainingHours(true);

// // //       const API_URL = `${backendUrl}/api/SubkTimesheet/GetRemainingPoHours?resourceId=${timesheetData["Employee ID"]}`;

// // //       try {
// // //         const response = await fetch(API_URL);

// // //         if (!response.ok) throw new Error(`HTTP error!`);

// // //         const data = await response.json();

// // //         const hoursMap = {};

// // //         if (Array.isArray(data)) {
// // //           data.forEach((item) => {
// // //             const poLineNum = String(
// // //               item.poLineNumber || item.PoLineNumber || "",
// // //             ).trim();

// // //             if (poLineNum)
// // //               hoursMap[poLineNum] = parseFloat(
// // //                 item.remainingHours || item.RemainingHours || 0,
// // //               );
// // //           });
// // //         }

// // //         setRemainingPoHours(hoursMap);
// // //       } catch (error) {
// // //       } finally {
// // //         setIsLoadingRemainingHours(false);
// // //       }
// // //     };

// // //     fetchRemainingHours();
// // //   }, [timesheetData]); // 4. Fetch Details & Map to Dynamic Period

// // //   useEffect(() => {
// // //     // Only fetch details once we have the correct Period Type loaded

// // //     if (periodDates.length === 0) return;

// // //     fetchTimesheetDetails();
// // //   }, [periodDates]);

// // //   //   const fetchTimesheetDetails = async () => {

// // //   //     setIsLoading(true);

// // //   //     try {

// // //   //       const response = await fetch(`${backendUrl}/api/SubkTimesheet/ByResource/${timesheetData["Employee ID"]}`);

// // //   //       if (!response.ok) throw new Error("Failed to fetch timesheet details");

// // //   //       const data = await response.json();

// // //   //       const poResponse = await fetch(`${backendUrl}/api/PurchaseOrders/ByResourceDetails/${timesheetData["Employee ID"]}`);

// // //   //       if (!poResponse.ok) throw new Error("Failed to fetch purchase order details");

// // //   //       const poData = await poResponse.json();

// // //   //       const poDataArray = Array.isArray(poData) ? poData : [];

// // //   //       setPurchaseOrderData(poDataArray);

// // //   //       const dataArray = Array.isArray(data) ? data : [];

// // //   //       const filteredData = dataArray.filter((item) => formatDate(item.timesheet_Date) === timesheetData.Date);

// // //   //       if (filteredData.length > 0) {

// // //   //         setTimesheetDetails(filteredData[0]);

// // //   //       }

// // //   //       const mappedLines = filteredData.map((item) => {

// // //   //         const hoursData = {};

// // //   //         const hourIdsData = {};

// // //   //         periodDates.forEach((_, index) => { hoursData[index] = 0; });

// // //   //         let isLineInvoiced = false;

// // //   //         if (item.timesheetHours) {

// // //   //           item.timesheetHours.forEach((hourEntry) => {

// // //   //             if (hourEntry.invoiceGenerated === true) isLineInvoiced = true;

// // //   //             const entryDateStr = hourEntry.ts_Date.split("T")[0];

// // //   //             const dateIndex = periodDates.findIndex(d => d.apiDate === entryDateStr);

// // //   //             if (dateIndex !== -1) {

// // //   //               hoursData[dateIndex] = hourEntry.hours;

// // //   //               hourIdsData[dateIndex] = hourEntry.id;

// // //   //             }

// // //   //           });

// // //   //         }

// // //   //         let fullWorkOrderString = "";

// // //   //         const poEntry = poDataArray.find((po) => po.project?.includes(item.projId));

// // //   //         if (poEntry) {

// // //   //           const projectIndex = poEntry.project.indexOf(item.projId);

// // //   //           if (projectIndex > -1) {

// // //   //             fullWorkOrderString = `${poEntry.wa_Code} - ${poEntry.resourceDesc[projectIndex]}`;

// // //   //           }

// // //   //         }

// // //   //         return {

// // //   //           id: item.lineNo, description: item.description || "", project: item.projId || "",

// // //   //           plc: item.plc || "", payType: item.payType || "SR", workOrder: fullWorkOrderString,

// // //   //           wa_Code: poEntry?.wa_Code || "", pmUserID: poEntry?.pmUserId || "",

// // //   //           poNumber: item.poNumber || "", rlseNumber: item.rlseNumber || "",

// // //   //           poLineNumber: item.poLineNumber || "",

// // //   //           hours: hoursData, hourIds: hourIdsData, isInvoiced: isLineInvoiced,

// // //   //         };

// // //   //       });

// // //   //       setLines(mappedLines);

// // //   //       setInitialLines(JSON.parse(JSON.stringify(mappedLines)));

// // //   //     } catch (error) {

// // //   //       showToast(error.message, "error");

// // //   //     } finally {

// // //   //       setIsLoading(false);

// // //   //     }

// // //   //   };

// // //   const fetchTimesheetDetails = async () => {
// // //     setIsLoading(true);
// // //     try {
// // //       const response = await fetch(
// // //         `${backendUrl}/api/SubkTimesheet/ByResource/${timesheetData["Employee ID"]}`,
// // //       );
// // //       if (!response.ok) throw new Error("Failed to fetch timesheet details");
// // //       const data = await response.json();

// // //       const poResponse = await fetch(
// // //         `${backendUrl}/api/PurchaseOrders/ByResourceDetails/${timesheetData["Employee ID"]}`,
// // //       );
// // //       if (!poResponse.ok)
// // //         throw new Error("Failed to fetch purchase order details");
// // //       const poData = await poResponse.json();
// // //       const poDataArray = Array.isArray(poData) ? poData : [];
// // //       setPurchaseOrderData(poDataArray);

// // //       const dataArray = Array.isArray(data) ? data : []; // --- START: FIX FOR TIMEZONE-INDEPENDENT DATE COMPARISON ---

// // //       const normalizeTargetDate = (dateString) => {
// // //         // Assuming timesheetData.Date is in 'MM/DD/YYYY' format from the grid (based on formatDate output)
// // //         const parts = dateString.split("/");
// // //         if (parts.length === 3) {
// // //           // Converts MM/DD/YYYY to YYYY-MM-DD
// // //           return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(
// // //             2,
// // //             "0",
// // //           )}`;
// // //         } // Fallback for an ISO-like string
// // //         return dateString.split("T")[0];
// // //       };

// // //       const normalizedTimesheetDate = normalizeTargetDate(timesheetData.Date);

// // //       // const filteredData = dataArray.filter((item) => {
// // //       //   // item.timesheet_Date is typically an ISO string from the API (e.g., '2025-10-12T00:00:00')
// // //       //   const itemDateOnly = item.timesheet_Date.split("T")[0]; // Direct string comparison (YYYY-MM-DD) bypasses local timezone issues
// // //       //   return itemDateOnly === normalizedTimesheetDate;
// // //       // });
// // //       const filteredData = dataArray.filter((item) => {
// // //         const itemDateOnly = item.timesheet_Date.split("T")[0];
// // //         const matchesDate = itemDateOnly === normalizedTimesheetDate;

// // //         const isProjectManager =
// // //           currentUser?.role?.toUpperCase() === "PROJECT MANAGER" ||
// // //           currentUser?.role === "PM";

// // //         // Filter by userId if userId is provided/available
// // //         const matchesUser =
// // //           isProjectManager && userId
// // //             ? String(item.pm_User_Id || item.pm_User_Id || "") ===
// // //             String(currentUser?.name)
// // //             : true;

// // //         return matchesDate && matchesUser;
// // //       });

// // //       // --- END: FIX FOR TIMEZONE-INDEPENDENT DATE COMPARISON ---

// // //       if (filteredData.length > 0) {
// // //         setTimesheetDetails(filteredData[0]);
// // //       }

// // //       const mappedLines = filteredData.map((item) => {
// // //         const hoursData = {};

// // //         const hourIdsData = {};
// // //         const commentsData = {};

// // //         periodDates.forEach((_, index) => {
// // //           hoursData[index] = 0;
// // //           commentsData[index] = "";
// // //         });

// // //         let isLineInvoiced = false;

// // //         if (item.timesheetHours) {
// // //           item.timesheetHours.forEach((hourEntry) => {
// // //             if (hourEntry.invoiceGenerated === true) isLineInvoiced = true;

// // //             const entryDateStr = hourEntry.ts_Date.split("T")[0];

// // //             const dateIndex = periodDates.findIndex(
// // //               (d) => d.apiDate === entryDateStr,
// // //             );

// // //             if (dateIndex !== -1) {
// // //               hoursData[dateIndex] = hourEntry.hours;

// // //               hourIdsData[dateIndex] = hourEntry.id;

// // //               commentsData[dateIndex] =
// // //                 hourEntry.comment || hourEntry.Comment || "";
// // //             }
// // //           });
// // //         }

// // //         let fullWorkOrderString = "";

// // //         const poEntry = poDataArray.find((po) =>
// // //           po.project?.includes(item.projId),
// // //         );

// // //         if (poEntry) {
// // //           const projectIndex = poEntry.project.indexOf(item.projId);

// // //           if (projectIndex > -1) {
// // //             fullWorkOrderString = `${poEntry.wa_Code} - ${poEntry.resourceDesc[projectIndex]}`;
// // //           }
// // //         }

// // //         return {
// // //           id: item.lineNo,
// // //           description: item.description || "",
// // //           project: item.projId || "",
// // //           projectName: item?.projectName || "",
// // //           plc: item.plc || "",
// // //           plcDesc: item?.plcDesc || "",
// // //           payType: item.payType || "SR",
// // //           workOrder: fullWorkOrderString,

// // //           wa_Code: poEntry?.wa_Code || "",
// // //           pmUserID: poEntry?.pmUserId || "",

// // //           poNumber: item.poNumber || "",
// // //           rlseNumber: item.rlseNumber || "",

// // //           poLineNumber: item.poLineNumber || "",

// // //           hours: hoursData,
// // //           hourIds: hourIdsData,
// // //           comments: commentsData,
// // //           isInvoiced: isLineInvoiced,
// // //         };
// // //       });

// // //       setLines(mappedLines);

// // //       setInitialLines(JSON.parse(JSON.stringify(mappedLines)));
// // //     } catch (error) {
// // //       showToast(error.message, "error");
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const handleSelectChange = (id, fieldName, value) => {
// // //     setLines((currentLines) =>
// // //       currentLines.map((line) => {
// // //         if (line.id === id) {
// // //           let updatedLine = { ...line, [fieldName]: value };

// // //           if (fieldName === "workOrder") {
// // //             if (!value) {
// // //               const emptyLine = createEmptyLine(id, periodDates.length);

// // //               return { ...emptyLine, id: line.id };
// // //             }

// // //             const splitIndex = value.indexOf(" - ");

// // //             const waCode =
// // //               splitIndex > -1 ? value.substring(0, splitIndex) : value;

// // //             const desc = splitIndex > -1 ? value.substring(splitIndex + 3) : "";

// // //             const selectedWorkOrderData = purchaseOrderData.find(
// // //               (item) =>
// // //                 item.wa_Code === waCode &&
// // //                 (item.resourceDesc || []).includes(desc),
// // //             );

// // //             if (selectedWorkOrderData) {
// // //               updatedLine.wa_Code = selectedWorkOrderData.wa_Code || "";

// // //               updatedLine.pmUserID = selectedWorkOrderData.pmUserId || "";

// // //               const descIndex =
// // //                 selectedWorkOrderData.resourceDesc.indexOf(desc);

// // //               if (descIndex > -1) {
// // //                 updatedLine.description = desc || "";

// // //                 updatedLine.project =
// // //                   selectedWorkOrderData.project[descIndex] || "";

// // //                 updatedLine.plc = selectedWorkOrderData.plcCd[descIndex] || "";

// // //                 updatedLine.poNumber =
// // //                   selectedWorkOrderData.purchaseOrder[0] || "";

// // //                 updatedLine.rlseNumber =
// // //                   selectedWorkOrderData.purchaseOrderRelease[0] || "";

// // //                 updatedLine.poLineNumber =
// // //                   selectedWorkOrderData.poLineNumber[descIndex] || "";
// // //               }
// // //             } else {
// // //               const emptyLine = createEmptyLine(id, periodDates.length);

// // //               return { ...emptyLine, id: line.id };
// // //             }
// // //           }

// // //           return updatedLine;
// // //         }

// // //         return line;
// // //       }),
// // //     );
// // //   };

// // //   const handleHourChange = (id, dayIndex, value) => {
// // //     // FIX: Preserve current value as empty string or 0 in state if input is empty
// // //     if (value === "") {
// // //       setLines((currentLines) =>
// // //         currentLines.map((line) =>
// // //           line.id === id
// // //             ? { ...line, hours: { ...line.hours, [dayIndex]: "" } }
// // //             : line,
// // //         ),
// // //       );
// // //       return;
// // //     }

// // //     const numValue = parseFloat(value);
// // //     let isValid = true;
// // //     let toastMessage = "";
// // //     let toastType = "warning"; // Default for soft checks
// // //     let isPOExceeded = false;
// // //     let isMaxDailyExceeded = false;
// // //     const currentLine = lines.find((line) => line.id === id);

// // //     const status = timesheetData.Status?.toUpperCase();
// // //     const allowNegativeHours = status === "CORRECTION" || status === "REJECTED";

// // //     if (isNaN(numValue)) {
// // //       isValid = false;
// // //       toastType = "error";
// // //       toastMessage = "Hours must be a number.";
// // //     } else if (!allowNegativeHours && numValue < 0) {
// // //       // Block negative numbers ONLY if not in Correction/Rejected status
// // //       isValid = false;
// // //       toastType = "error";
// // //       toastMessage =
// // //         "Hours cannot be negative unless correcting a rejected timesheet.";
// // //     } else if (numValue % 0.5 !== 0) {
// // //       isValid = false;
// // //       toastType = "error";
// // //       toastMessage = "Hours must be in 0.5 increments.";
// // //     } else {
// // //       // Start complex checks only if base validation passed
// // //       // **VALIDATION 2: PO Remaining Hours (Conditional based on hardEdit) - CHECKED FIRST**
// // //       if (currentLine && currentLine.poLineNumber) {
// // //         const poLineNumber = String(currentLine.poLineNumber).trim();
// // //         const remainingHours = remainingPoHours[poLineNumber];

// // //         if (remainingHours !== undefined) {
// // //           // Calculate the impact of the new hour value (synchronized calculation)
// // //           const tempLines = lines.map((line) =>
// // //             line.id === id
// // //               ? { ...line, hours: { ...line.hours, [dayIndex]: numValue } }
// // //               : line,
// // //           );
// // //           const allLinesWithSamePO = tempLines.filter(
// // //             (l) => String(l.poLineNumber).trim() === poLineNumber,
// // //           );

// // //           const totalNewHoursForPO = allLinesWithSamePO.reduce((sum, l) => {
// // //             const initialLine = initialLines.find((init) => init.id === l.id);
// // //             const currentUITotal = Object.values(l.hours).reduce(
// // //               (s, h) => s + (parseFloat(h) || 0),
// // //               0,
// // //             );
// // //             const initialTotal = initialLine
// // //               ? Object.values(initialLine.hours).reduce(
// // //                 (s, h) => s + (parseFloat(h) || 0),
// // //                 0,
// // //               )
// // //               : 0;
// // //             return sum + (currentUITotal - initialTotal);
// // //           }, 0);

// // //           if (totalNewHoursForPO > remainingHours) {
// // //             isPOExceeded = true;

// // //             if (!hardEdit) {
// // //               // HARD STOP (Blocking entry)
// // //               isValid = false;
// // //               toastType = "error";
// // //               toastMessage = `Disabled: Cannot exceed remaining PO hours (${remainingHours.toFixed(
// // //                 2,
// // //               )} available for PO Line ${poLineNumber}).`;
// // //             } else {
// // //               // SOFT WARNING (Allowing entry)
// // //               // Set initial soft warning message
// // //               toastMessage = `PO hours exceeded. ${remainingHours.toFixed(
// // //                 2,
// // //               )} hours available for PO Line ${poLineNumber}.`;
// // //               toastType = "warning";
// // //             }
// // //           }
// // //         }
// // //       } // **VALIDATION 3: Max Daily Hours (Configurable) - CHECKED SECOND** // Check only if we haven't hit a hard stop already (isValid is still true from base/PO check)

// // //       if (isValid) {
// // //         const otherLinesTotal = lines
// // //           .filter((line) => line.id !== id)
// // //           .reduce(
// // //             (sum, line) => sum + (parseFloat(line.hours[dayIndex]) || 0),
// // //             0,
// // //           );

// // //         const newDailyTotal = otherLinesTotal + numValue;

// // //         if (newDailyTotal > maxDailyHours) {
// // //           isMaxDailyExceeded = true; // Max Daily limit is always a hard block
// // //           isValid = false;
// // //           toastType = "error"; // SYNCED MESSAGE LOGIC:
// // //           const maxDailyError = `Daily total hours exceed the maximum limit of ${maxDailyHours}.`;
// // //           if (isPOExceeded && hardEdit) {
// // //             // PO was soft-warned, but Max Daily is a hard fail. Use the Warning structure from Line component.
// // //             // The hard fail (isValid=false) means this message will be shown as an ERROR toast.
// // //             toastMessage = `${maxDailyError} Also, PO hours exceeded.`;
// // //           } else {
// // //             // Max Daily is the only issue, or PO was already a hard fail.
// // //             toastMessage = `Disabled: ${maxDailyError}`;
// // //           }
// // //         }
// // //       }
// // //     } // Determine toast duration (5 seconds for soft warnings, 3 seconds for blocks)

// // //     const toastDuration = isValid && isPOExceeded && hardEdit ? 5000 : 3000;

// // //     if (isValid) {
// // //       setLines((currentLines) =>
// // //         currentLines.map((line) =>
// // //           line.id === id
// // //             ? { ...line, hours: { ...line.hours, [dayIndex]: numValue } }
// // //             : line,
// // //         ),
// // //       ); // Show soft warning if an input was allowed but exceeded a soft limit (hardEdit=true PO limit)
// // //       if (isPOExceeded && hardEdit) {
// // //         showToast(toastMessage, toastType, toastDuration);
// // //       }
// // //     } else {
// // //       // Input blocked by a hard-error
// // //       showToast(toastMessage, toastType, toastDuration); // Revert value to the previous state
// // //       setLines((currentLines) =>
// // //         currentLines.map((line) =>
// // //           line.id === id
// // //             ? {
// // //               ...line,
// // //               hours: { ...line.hours, [dayIndex]: line.hours[dayIndex] },
// // //             }
// // //             : line,
// // //         ),
// // //       );
// // //     }
// // //   };

// // //   const getRemainingHoursForLine = (line) => {
// // //     if (!line.poLineNumber) return null;

// // //     const poLineNumStr = String(line.poLineNumber).trim();

// // //     const remaining = remainingPoHours[poLineNumStr];

// // //     if (remaining === undefined) return null;

// // //     const allLinesWithSamePO = lines.filter(
// // //       (l) => String(l.poLineNumber).trim() === poLineNumStr,
// // //     );

// // //     const totalNewHoursForPO = allLinesWithSamePO.reduce((sum, l) => {
// // //       const initialLine = initialLines.find((init) => init.id === l.id);

// // //       const currentUITotal = Object.values(l.hours).reduce(
// // //         (s, h) => s + (parseFloat(h) || 0),
// // //         0,
// // //       );

// // //       const initialTotal = initialLine
// // //         ? Object.values(initialLine.hours).reduce(
// // //           (s, h) => s + (parseFloat(h) || 0),
// // //           0,
// // //         )
// // //         : 0;

// // //       return sum + (currentUITotal - initialTotal);
// // //     }, 0);

// // //     return (remaining - totalNewHoursForPO).toFixed(2);
// // //   };

// // //   const addLine = () =>
// // //     setLines((prev) => [
// // //       ...prev,
// // //       createEmptyLine(`temp-${Date.now()}`, periodDates.length),
// // //     ]);

// // //   const handleSelectLine = (id) => {
// // //     const newSelection = new Set(selectedLines);

// // //     newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);

// // //     setSelectedLines(newSelection);
// // //   };

// // //   const deleteLines = () => {
// // //     if (selectedLines.size === 0) {
// // //       showToast("Please select lines to delete.", "warning");
// // //       return;
// // //     }

// // //     if (timesheetData.Status?.toUpperCase() === "REJECTED") {
// // //       showToast(
// // //         "For rejected timesheets, hours will be zeroed out upon saving.",
// // //         "info",
// // //       );

// // //       setLines((currentLines) =>
// // //         currentLines.map((line) =>
// // //           selectedLines.has(line.id)
// // //             ? {
// // //               ...line,
// // //               hours: Object.keys(line.hours).reduce(
// // //                 (acc, k) => ({ ...acc, [k]: 0 }),
// // //                 {},
// // //               ),
// // //             }
// // //             : line,
// // //         ),
// // //       );
// // //     } else {
// // //       setLines((currentLines) => {
// // //         const idsToDelete = [...selectedLines].filter(
// // //           (id) => typeof id === "number" || !String(id).startsWith("temp-"),
// // //         );

// // //         if (idsToDelete.length > 0)
// // //           setLinesToDelete((prev) => [...new Set([...prev, ...idsToDelete])]);

// // //         return currentLines.filter((line) => !selectedLines.has(line.id));
// // //       });
// // //     }

// // //     setSelectedLines(new Set());
// // //   }; // Correct Dynamic Totals

// // //   const dailyTotals = useMemo(() => {
// // //     if (periodDates.length === 0) return {};

// // //     const totals = {};

// // //     periodDates.forEach((_, index) => {
// // //       totals[index] = 0;
// // //     });

// // //     lines.forEach((line) => {
// // //       Object.keys(line.hours).forEach((idx) => {
// // //         totals[idx] = (totals[idx] || 0) + (parseFloat(line.hours[idx]) || 0);
// // //       });
// // //     });

// // //     return totals;
// // //   }, [lines, periodDates]);

// // //   const copyLines = () => {
// // //     if (selectedLines.size === 0) {
// // //       showToast("Please select lines to copy.", "warning");
// // //       return;
// // //     }

// // //     const linesToCopy = lines.filter((line) => selectedLines.has(line.id));

// // //     const potentialTotals = { ...dailyTotals };

// // //     let validationFailed = false;

// // //     linesToCopy.forEach((lineToCopy) => {
// // //       Object.keys(lineToCopy.hours).forEach((idx) => {
// // //         potentialTotals[idx] =
// // //           (potentialTotals[idx] || 0) +
// // //           (parseFloat(lineToCopy.hours[idx]) || 0);

// // //         if (potentialTotals[idx] > maxDailyHours) validationFailed = true;
// // //       });
// // //     });

// // //     if (validationFailed) {
// // //       showToast(
// // //         `Cannot copy, as it would cause a daily total to exceed ${maxDailyHours} hours.`,
// // //         "error",
// // //       );
// // //       return;
// // //     }

// // //     showToast("Line(s) copied.", "info");

// // //     const newLines = linesToCopy.map((line, index) => ({
// // //       ...line,
// // //       hours: { ...line.hours },
// // //       comments: { ...(line.comments || {}) },
// // //       id: `temp-${Date.now()}-${index}`,
// // //       hourIds: {},
// // //     }));

// // //     setLines((prev) => [...prev, ...newLines]);

// // //     setSelectedLines(new Set());
// // //   };

// // //   const grandTotal = Object.values(dailyTotals).reduce(
// // //     (sum, total) => sum + total,
// // //     0,
// // //   );

// // //   const toggleColumnVisibility = (columnName) => {
// // //     setHiddenColumns((prev) => ({ ...prev, [columnName]: !prev[columnName] }));
// // //   };

// // //   const showAllHiddenColumns = () => {
// // //     const allVisible = {};
// // //     Object.keys(hiddenColumns).forEach((col) => {
// // //       allVisible[col] = false;
// // //     });
// // //     setHiddenColumns(allVisible);
// // //   };
// // //   const hasChangesToExistingData = useMemo(() => {
// // //     // Check for deletions of existing lines (lines with numeric IDs)

// // //     if (
// // //       linesToDelete.some(
// // //         (id) => typeof id === "number" || !String(id).startsWith("temp-"),
// // //       )
// // //     ) {
// // //       return true;
// // //     } // Check for changes to existing lines or hours

// // //     for (const currentLine of lines) {
// // //       // Only check lines that existed initially (non-temp IDs)

// // //       if (
// // //         typeof currentLine.id === "number" ||
// // //         !String(currentLine.id).startsWith("temp-")
// // //       ) {
// // //         const initialLine = initialLines.find((l) => l.id === currentLine.id);

// // //         if (!initialLine) continue; // Should not happen for existing lines // 1. Check line property changes

// // //         const isLineChanged =
// // //           currentLine.payType !== initialLine.payType ||
// // //           currentLine.workOrder !== initialLine.workOrder ||
// // //           currentLine.wa_Code !== initialLine.wa_Code ||
// // //           currentLine.description !== initialLine.description;

// // //         if (isLineChanged) return true; // 2. Check hour changes

// // //         for (const idx of Object.keys(currentLine.hours)) {
// // //           // Use '===' comparison for primitive values after initial load normalization

// // //           if (
// // //             String(currentLine.hours[idx]) !== String(initialLine.hours[idx])
// // //           ) {
// // //             return true;
// // //           }

// // //           // Check comment changes
// // //           if (
// // //             String(currentLine.comments?.[idx] || "") !==
// // //             String(initialLine.comments?.[idx] || "")
// // //           ) {
// // //             return true;
// // //           }
// // //         }
// // //       }
// // //     }

// // //     return false;
// // //   }, [lines, initialLines, linesToDelete]);

// // //   const handleSaveWithReasonPrompt = () => {
// // //     const invalidDay = Object.values(dailyTotals).find(
// // //       (val) => val > maxDailyHours,
// // //     );

// // //     if (invalidDay) {
// // //       showToast(
// // //         `Save failed: Total hours for one or more days exceed ${maxDailyHours}.`,
// // //         "error",
// // //       );
// // //       return;
// // //     }

// // //     const currentStatus = timesheetData?.status
// // //       ? timesheetData.status.toUpperCase()
// // //       : "";
// // //     const isOpen = currentStatus === "OPEN";

// // //     // If status is OPEN, skip the reason prompt completely and save directly
// // //     if (isOpen) {
// // //       handleSave("");
// // //       return;
// // //     }

// // //     const linesToPost = lines.filter((line) =>
// // //       String(line.id).startsWith("temp-"),
// // //     );

// // //     // Otherwise, show the prompt for REJECTED, CORRECTION, or other statuses
// // //     if (
// // //       linesToPost.length > 0 ||
// // //       hasChangesToExistingData ||
// // //       linesToDelete.length > 0
// // //     ) {
// // //       setShowReasonPrompt(true);
// // //     } else {
// // //       handleSave("");
// // //     }
// // //   };

// // //   const handleSave = async (reason = "") => {
// // //     // if (
// // //     //   timesheetData?.status.toUpperCase() === "REJECTED" ||
// // //     //   timesheetData?.status.toUpperCase() === "CORRECTION"
// // //     // ) {
// // //     //   setShowReasonPrompt(false);
// // //     // }

// // //     setIsCurrentlySaving(true);
// // //     setShowReasonPrompt(false);
// // //     setUpdateReason("");

// // //     const invalidDay = Object.values(dailyTotals).find(
// // //       (val) => val > maxDailyHours,
// // //     );

// // //     if (invalidDay) {
// // //       showToast(
// // //         `Save failed: Total hours for one or more days exceed ${maxDailyHours}.`,
// // //         "error",
// // //       );
// // //       setIsCurrentlySaving(false);
// // //       return;
// // //     }

// // //     const promises = [];
// // //     const API_BASE_URL = backendUrl;
// // //     const now = new Date().toISOString();
// // //     const resourceId = timesheetData["Employee ID"];
// // //     const currentUserName = String(resourceId);

// // //     // 1. Deletions
// // //     linesToDelete.forEach((id) => {
// // //       if (typeof id === "number" || !String(id).startsWith("temp-")) {
// // //         promises.push(
// // //           fetch(
// // //             `${API_BASE_URL}/api/SubkTimesheet/${id}?reason=${encodeURIComponent(
// // //               reason,
// // //             )}`,
// // //             { method: "DELETE" },
// // //           ),
// // //         );
// // //       }
// // //     });

// // //     // 2. Process Lines (New and Existing)
// // //     lines.forEach((currentLine) => {
// // //       const initialLine = initialLines.find((l) => l.id === currentLine.id);

// // //       const totalHours = Object.values(currentLine.hours).reduce(
// // //         (s, h) => s + (parseFloat(h) || 0),
// // //         0,
// // //       );

// // //       // A. New Line (POST)
// // //       if (!initialLine) {
// // //         // if (totalHours <= 0) {
// // //         //   showToast(
// // //         //     "Cannot save a new line with zero or negative hours.",
// // //         //     "warning",
// // //         //   );
// // //         //   setIsCurrentlySaving(false);
// // //         //   return;
// // //         // }

// // //         const payload = {
// // //           Description: currentLine.description || "New Timesheet Line",
// // //           ProjId: currentLine.project || "",
// // //           Plc: currentLine.plc || "",
// // //           PayType: currentLine.payType || "SR",
// // //           PoNumber: currentLine.poNumber || "0000",
// // //           RlseNumber: currentLine.rlseNumber || "0",
// // //           Resource_Id: String(userId),
// // //           WorkOrder: currentLine.wa_Code,
// // //           Pm_User_Id: currentLine.pmUserID || "",
// // //           PoLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,
// // //           Timesheet_Date: new Date(timesheetData.Date)
// // //             .toISOString()
// // //             .split("T")[0],
// // //           CreatedBy: String(currentUser?.name),
// // //           UpdatedAt: now,
// // //           UpdatedBy: String(currentUser?.name),
// // //           UpdateReason: reason,
// // //           TimesheetHours: periodDates.map((dateInfo, idx) => {
// // //             let hourValue = parseFloat(currentLine.hours[idx]);
// // //             if (isNaN(hourValue)) hourValue = 0;
// // //             const hourComment = currentLine.comments?.[idx] || "";

// // //             return {
// // //               Ts_Date: dateInfo.apiDate,
// // //               Hours: hourValue,
// // //               CreatedBy: String(currentUser?.name),
// // //               UpdatedBy: String(currentUser?.name),
// // //               comment: hourComment,
// // //               Comment: hourComment,
// // //             };
// // //           }),
// // //         };

// // //         promises.push(
// // //           fetch(`${API_BASE_URL}/api/SubkTimesheet`, {
// // //             method: "POST",
// // //             headers: { "Content-Type": "application/json" },
// // //             body: JSON.stringify(payload),
// // //           }),
// // //         );
// // //       } else {
// // //         // B. Existing Line Property Change (PUT)
// // //         const isLineChanged =
// // //           currentLine.payType !== initialLine.payType ||
// // //           currentLine.workOrder !== initialLine.workOrder ||
// // //           currentLine.wa_Code !== initialLine.wa_Code ||
// // //           currentLine.description !== initialLine.description;

// // //         if (isLineChanged) {
// // //           const updatePayload = {
// // //             lineNo: currentLine.id,
// // //             description: currentLine.description,
// // //             projId: currentLine.project,
// // //             plc: currentLine.plc,
// // //             payType: currentLine.payType,
// // //             poNumber: currentLine.poNumber,
// // //             rlseNumber: currentLine.rlseNumber,
// // //             resource_Id: String(userId),
// // //             pm_User_Id: currentLine.pmUserID,
// // //             poLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,
// // //             rvsnNumber: 0,
// // //             timesheet_Date: new Date(timesheetData.Date)
// // //               .toISOString()
// // //               .split("T")[0],
// // //             workOrder: currentLine.wa_Code,
// // //             updatedAt: now,
// // //             updatedBy: String(currentUser?.name),
// // //             createdBy: String(currentUser?.name),
// // //             createdAt: timesheetDetails?.createdAt || now,
// // //             hours: 0,
// // //             status: timesheetData.Status || "OPEN",
// // //             UpdateReason: reason,
// // //           };

// // //           promises.push(
// // //             fetch(`${API_BASE_URL}/api/SubkTimesheet/${currentLine.id}`, {
// // //               method: "PUT",
// // //               headers: { "Content-Type": "application/json" },
// // //               body: JSON.stringify(updatePayload),
// // //             }),
// // //           );
// // //         }

// // //         // C. Existing Hour Change (TimesheetHours upsert)
// // //         Object.keys(currentLine.hours).forEach((idx) => {
// // //           const initialHour = initialLine.hours[idx];
// // //           const currentHour = currentLine.hours[idx];
// // //           const initialComment = initialLine.comments?.[idx] || "";
// // //           const currentComment = currentLine.comments?.[idx] || "";

// // //           if (
// // //             String(initialHour) !== String(currentHour) ||
// // //             String(initialComment) !== String(currentComment)
// // //           ) {
// // //             const hourId = currentLine.hourIds[idx];
// // //             let hourValue = parseFloat(currentHour);

// // //             if (isNaN(hourValue)) hourValue = 0;

// // //             const url = `${API_BASE_URL}/api/TimesheetHours/upsert`;
// // //             const payload = {
// // //               id: hourId || 0,
// // //               ts_Date: periodDates[idx].apiDate,
// // //               hours: hourValue,
// // //               lineNo: currentLine.id,
// // //               CreatedBy: String(currentUser?.name),
// // //               UpdatedBy: String(currentUser?.name),
// // //               comment: currentComment || reason || updateReason || "",
// // //               Comment: currentComment || reason || updateReason || "",
// // //             };

// // //             promises.push(
// // //               fetch(url, {
// // //                 method: "POST",
// // //                 headers: { "Content-Type": "application/json" },
// // //                 body: JSON.stringify(payload),
// // //               }),
// // //             );
// // //           }
// // //         });
// // //       }
// // //     });

// // //     if (promises.length === 0) {
// // //       showToast("No changes to save.", "info");
// // //       setIsCurrentlySaving(false);
// // //       return;
// // //     }

// // //     try {
// // //       const responses = await Promise.all(promises);

// // //       for (const response of responses) {
// // //         if (!response.ok) {
// // //           const errorText = await response.text();
// // //           throw new Error(`Failed to save changes: ${errorText}`);
// // //         }
// // //       }

// // //       showToast("Timesheet saved successfully!", "success");
// // //       onSave();
// // //       setIsCurrentlySaving(false);
// // //     } catch (error) {
// // //       showToast(error.message, "error");
// // //       console.error("Save error:", error);
// // //       setIsCurrentlySaving(false);
// // //     }
// // //   };
// // //   // const handleSave = async (reason = "") => {
// // //   //   setIsCurrentlySaving(true);

// // //   //   setShowReasonPrompt(false); // Close prompt modal

// // //   //   setUpdateReason(""); // Reset reason field

// // //   //   const invalidDay = Object.values(dailyTotals).find(
// // //   //     (val) => val > maxDailyHours,
// // //   //   );

// // //   //   if (invalidDay) {
// // //   //     showToast(
// // //   //       `Save failed: Total hours for one or more days exceed ${maxDailyHours}.`,
// // //   //       "error",
// // //   //     );
// // //   //     setIsCurrentlySaving(false);
// // //   //     return;
// // //   //   }

// // //   //   const promises = [];

// // //   //   const API_BASE_URL = backendUrl;

// // //   //   const isOnlyDeletion = lines.length === 0 && linesToDelete.length > 0;

// // //   //   // if (!isOnlyDeletion && grandTotal === 0) {
// // //   //   //   showToast("Cannot save a timesheet with zero hours.", "warning");
// // //   //   //   setIsCurrentlySaving(false);
// // //   //   //   return;
// // //   //   // }

// // //   //   const now = new Date().toISOString();

// // //   //   const resourceId = timesheetData["Employee ID"];

// // //   //   const currentUserName = String(resourceId); // 1. Deletions

// // //   //   linesToDelete.forEach((id) => {
// // //   //     if (typeof id === "number" || !String(id).startsWith("temp-")) {
// // //   //       promises.push(
// // //   //         fetch(
// // //   //           `${API_BASE_URL}/api/SubkTimesheet/${id}?reason=${encodeURIComponent(
// // //   //             reason,
// // //   //           )}`,
// // //   //           { method: "DELETE" },
// // //   //         ),
// // //   //       );
// // //   //     }
// // //   //   }); // 2. New Lines (POST) / Existing Lines (PUT/Hours Upsert)

// // //   //   lines.forEach((currentLine) => {
// // //   //     const initialLine = initialLines.find((l) => l.id === currentLine.id);

// // //   //     const totalHours = Object.values(currentLine.hours).reduce(
// // //   //       (s, h) => s + (parseFloat(h) || 0),
// // //   //       0,
// // //   //     ); // A. New Line (POST)

// // //   //     if (!initialLine) {
// // //   //       if (totalHours > 0) {
// // //   //         const payload = {
// // //   //           Description: currentLine.description || "New Timesheet Line",

// // //   //           ProjId: currentLine.project || "",

// // //   //           Plc: currentLine.plc || "",

// // //   //           PayType: currentLine.payType || "SR",

// // //   //           PoNumber: currentLine.poNumber || "0000",

// // //   //           RlseNumber: currentLine.rlseNumber || "0",

// // //   //           Resource_Id: String(resourceId),

// // //   //           WorkOrder: currentLine.wa_Code,

// // //   //           Pm_User_Id: currentLine.pmUserID || "",

// // //   //           PoLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,

// // //   //           Timesheet_Date: new Date(timesheetData.Date)
// // //   //             .toISOString()
// // //   //             .split("T")[0],

// // //   //           CreatedBy: String(resourceId), // Existing line property payload uses resourceId

// // //   //           UpdatedAt: now,

// // //   //           UpdatedBy: String(resourceId), // Existing line property payload uses resourceId

// // //   //           UpdateReason: reason,

// // //   //           TimesheetHours: periodDates.map((dateInfo, idx) => {
// // //   //             let hourValue = parseFloat(currentLine.hours[idx]);

// // //   //             if (isNaN(hourValue)) hourValue = 0;

// // //   //             return {
// // //   //               Ts_Date: dateInfo.apiDate,
// // //   //               Hours: hourValue,
// // //   //               CreatedBy: currentUserName,
// // //   //               UpdatedBy: currentUserName,
// // //   //             };
// // //   //           }),
// // //   //         };

// // //   //         promises.push(
// // //   //           fetch(`${API_BASE_URL}/api/SubkTimesheet`, {
// // //   //             method: "POST",
// // //   //             headers: { "Content-Type": "application/json" },
// // //   //             body: JSON.stringify(payload),
// // //   //           }),
// // //   //         );
// // //   //       }

// // //   //       return;
// // //   //     } // B. Existing Line Property Change (PUT)

// // //   //     const isLineChanged =
// // //   //       currentLine.payType !== initialLine.payType ||
// // //   //       currentLine.workOrder !== initialLine.workOrder ||
// // //   //       currentLine.wa_Code !== initialLine.wa_Code ||
// // //   //       currentLine.description !== initialLine.description;

// // //   //     if (isLineChanged) {
// // //   //       const updatePayload = {
// // //   //         lineNo: currentLine.id,

// // //   //         description: currentLine.description,

// // //   //         projId: currentLine.project,

// // //   //         plc: currentLine.plc,

// // //   //         payType: currentLine.payType,

// // //   //         poNumber: currentLine.poNumber,

// // //   //         rlseNumber: currentLine.rlseNumber,

// // //   //         resource_Id: String(resourceId),

// // //   //         pm_User_Id: currentLine.pmUserID,

// // //   //         poLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,

// // //   //         rvsnNumber: 0,

// // //   //         timesheet_Date: new Date(timesheetData.Date)
// // //   //           .toISOString()
// // //   //           .split("T")[0],

// // //   //         workOrder: currentLine.wa_Code,

// // //   //         updatedAt: now,

// // //   //         updatedBy: String(resourceId),

// // //   //         createdBy: String(resourceId),

// // //   //         createdAt: timesheetDetails?.createdAt || now,

// // //   //         hours: 0,

// // //   //         status: timesheetData.Status || "OPEN",

// // //   //         UpdateReason: reason,
// // //   //       };

// // //   //       promises.push(
// // //   //         fetch(`${API_BASE_URL}/api/SubkTimesheet/${currentLine.id}`, {
// // //   //           method: "PUT",
// // //   //           headers: { "Content-Type": "application/json" },
// // //   //           body: JSON.stringify(updatePayload),
// // //   //         }),
// // //   //       );
// // //   //     } // C. Existing Hour Change (TimesheetHours upsert)

// // //   //     Object.keys(currentLine.hours).forEach((idx) => {
// // //   //       const initialHour = initialLine.hours[idx];

// // //   //       const currentHour = currentLine.hours[idx];

// // //   //       if (String(initialHour) !== String(currentHour)) {
// // //   //         const hourId = currentLine.hourIds[idx];

// // //   //         let hourValue = parseFloat(currentHour);

// // //   //         if (isNaN(hourValue)) hourValue = 0;

// // //   //         const url = `${API_BASE_URL}/api/TimesheetHours/upsert`;

// // //   //         const payload = {
// // //   //           id: hourId || 0,

// // //   //           ts_Date: periodDates[idx].apiDate,

// // //   //           hours: hourValue,

// // //   //           lineNo: currentLine.id,
// // //   //           CreatedBy: currentUserName,
// // //   //           UpdatedBy: currentUserName,
// // //   //         };

// // //   //         promises.push(
// // //   //           fetch(url, {
// // //   //             method: "POST",
// // //   //             headers: { "Content-Type": "application/json" },
// // //   //             body: JSON.stringify(payload),
// // //   //           }),
// // //   //         );
// // //   //       }
// // //   //     });
// // //   //   });

// // //   //   if (promises.length === 0) {
// // //   //     showToast("No changes to save.", "info");
// // //   //     setIsCurrentlySaving(false);
// // //   //     return;
// // //   //   }

// // //   //   try {
// // //   //     const responses = await Promise.all(promises);

// // //   //     for (const response of responses) {
// // //   //       if (!response.ok) {
// // //   //         const errorText = await response.text();

// // //   //         throw new Error(`Failed to save changes: ${errorText}`);
// // //   //       }
// // //   //     }

// // //   //     showToast("Timesheet saved successfully!", "success");

// // //   //     onSave();

// // //   //     setIsCurrentlySaving(false);
// // //   //   } catch (error) {
// // //   //     showToast(error.message, "error");

// // //   //     console.error("Save error:", error);

// // //   //     setIsCurrentlySaving(false);
// // //   //   }
// // //   // };

// // //   const isLineDisabled = (line) => {
// // //     if (!isEditable) return true;

// // //     if (timesheetData?.Status?.toUpperCase() === "CORRECTION")
// // //       return line.isInvoiced === true;

// // //     return false;
// // //   };

// // //   if (isLoading) return <div className="text-center p-8">Loading...</div>;

// // //   const workOrderOptions = Array.from(
// // //     new Map(
// // //       purchaseOrderData.flatMap((item) =>
// // //         (item.resourceDesc || []).map((desc) => {
// // //           const label = `${item.wa_Code} - ${desc}`;
// // //           return [label, { value: label, label: label }];
// // //         }),
// // //       ),
// // //     ).values(),
// // //   );

// // //   const availableHideableColumns = hideableColumns.filter((col) =>
// // //     col === "PO Remaining Hours" ? isAdmin : true,
// // //   );

// // //   const hiddenCount = Object.entries(hiddenColumns).filter(
// // //     ([key, val]) => val && (key === "PO Remaining Hours" ? isAdmin : true),
// // //   ).length;

// // //   const hiddenColumnsList = Object.entries(hiddenColumns)
// // //     .filter(
// // //       ([col, isHidden]) =>
// // //         isHidden && (col === "PO Remaining Hours" ? isAdmin : true),
// // //     )
// // //     .map(([col]) => col);

// // //   return (
// // //     <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 w-full max-w-[95vw] font-inter">
// // //       {/* {showReasonPrompt && (
// // //         <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] shadow-2xl border border-gray-100 animate-premium-popup">
// // //           <div className="mb-4">
// // //             <h3 className="text-base font-bold text-gray-900 mb-3">
// // //               Reason for Timesheet Update
// // //             </h3>
// // //             <textarea
// // //               rows="3"
// // //               className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs text-black"
// // //               value={updateReason}
// // //               onChange={(e) => setUpdateReason(e.target.value)}
// // //               placeholder="E.g., Corrected hours for Monday, switched project code."
// // //             />
// // //             <div className="mt-4 flex justify-end gap-2">
// // //               <ActionButton
// // //                 onClick={() => {
// // //                   setShowReasonPrompt(false);
// // //                   setUpdateReason("");
// // //                   setIsCurrentlySaving(false);
// // //                 }}
// // //               >
// // //                 Cancel
// // //               </ActionButton>
// // //               <ActionButton
// // //                 onClick={() => handleSave(updateReason)}
// // //                 disabled={!updateReason.trim() || isCurrentlySaving}
// // //               >
// // //                 {isCurrentlySaving ? "Saving..." : "Confirm & Save"}
// // //               </ActionButton>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )} */}
// // //       {showReasonPrompt && (
// // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
// // //           <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] shadow-2xl border border-gray-100 animate-premium-popup">
// // //             <div className="mb-4">
// // //               <h3 className="text-base font-bold text-gray-900 mb-3">
// // //                 Reason for Timesheet Update
// // //               </h3>
// // //               <textarea
// // //                 rows="3"
// // //                 className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs text-black"
// // //                 value={updateReason}
// // //                 onChange={(e) => setUpdateReason(e.target.value)}
// // //                 placeholder="E.g., Corrected hours for Monday, switched project code."
// // //               />
// // //               <div className="mt-4 flex justify-end gap-2">
// // //                 <ActionButton
// // //                   onClick={() => {
// // //                     setShowReasonPrompt(false);
// // //                     setUpdateReason("");
// // //                     setIsCurrentlySaving(false);
// // //                   }}
// // //                 >
// // //                   Cancel
// // //                 </ActionButton>
// // //                 <ActionButton
// // //                   onClick={() => handleSave(updateReason)}
// // //                   disabled={!updateReason.trim() || isCurrentlySaving}
// // //                 >
// // //                   {isCurrentlySaving ? "Saving..." : "Confirm & Save"}
// // //                 </ActionButton>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //       <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
// // //         <div className="flex flex-col">
// // //           <h2 className="text-lg font-bold text-gray-800 mb-1">
// // //             Timesheet Details
// // //           </h2>
// // //           {timesheetDetails && (
// // //             <div className="flex gap-4 text-xs text-black flex-wrap font-medium">
// // //               <div>
// // //                 <span className="font-semibold text-gray-700">Status:</span>{" "}
// // //                 <span className="font-bold text-[#17414d]">
// // //                   {timesheetData.Status
// // //                     ? timesheetData.Status.charAt(0).toUpperCase() +
// // //                     timesheetData.Status.slice(1).toLowerCase()
// // //                     : "N/A"}
// // //                 </span>
// // //               </div>
// // //               <div>
// // //                 <span className="font-semibold text-gray-700">Date:</span>{" "}
// // //                 {timesheetDetails?.timesheet_Date
// // //                   ? formatDate(timesheetDetails.timesheet_Date)
// // //                   : "N/A"}
// // //               </div>
// // //               <div>
// // //                 <span className="font-semibold text-gray-700">
// // //                   Approved By:
// // //                 </span>{" "}
// // //                 {timesheetDetails?.approvedBy || "N/A"}
// // //               </div>
// // //               <div>
// // //                 <span className="font-semibold text-gray-700">
// // //                   Approved Date:
// // //                 </span>{" "}
// // //                 {timesheetDetails?.approvedDate
// // //                   ? formatDate(timesheetDetails.approvedDate)
// // //                   : "N/A"}
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>
// // //         {isEditable && (
// // //           <div className="flex items-center gap-2">
// // //             <ActionButton
// // //               onClick={addLine}
// // //             //  icon={<PlusIcon />}
// // //             >
// // //               Add
// // //             </ActionButton>
// // //             <ActionButton
// // //               onClick={copyLines}
// // //               // icon={<CopyIcon />}
// // //               disabled={selectedLines.size === 0}
// // //             >
// // //               Copy
// // //             </ActionButton>
// // //             {timesheetData?.Status?.toUpperCase() !== "CORRECTION" && (
// // //               <ActionButton
// // //                 onClick={deleteLines}
// // //                 // icon={<TrashIcon />}
// // //                 disabled={selectedLines.size === 0}
// // //               >
// // //                 Delete
// // //               </ActionButton>
// // //             )}
// // //             <ActionButton onClick={onClose}>Cancel</ActionButton>
// // //             {isEditable && (
// // //               <ActionButton
// // //                 onClick={handleSaveWithReasonPrompt}
// // //                 disabled={isSaving || isCurrentlySaving}
// // //               >
// // //                 {isCurrentlySaving ? "Saving..." : "Save"}
// // //               </ActionButton>
// // //             )}
// // //           </div>
// // //         )}
// // //       </div>

// // //       {hiddenCount > 0 && (
// // //         <div className="bg-[#e9f6fb] border border-blue-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3 flex-wrap mb-3">
// // //           <div className="flex items-center gap-2">
// // //             <EyeIcon className="h-4 w-4 text-blue-600" />
// // //             <span className="text-xs font-medium text-gray-700">
// // //               {hiddenCount} column{hiddenCount > 1 ? "s" : ""} hidden:
// // //             </span>
// // //           </div>
// // //           <div className="flex gap-2 flex-wrap">
// // //             {hiddenColumnsList.map((col) => (
// // //               <button
// // //                 key={col}
// // //                 onClick={() => toggleColumnVisibility(col)}
// // //                 className="inline-flex items-center px-2.5 py-1 bg-white hover:bg-blue-100 border border-blue-300 rounded-full text-xs font-medium text-blue-700 transition-colors shadow-sm cursor-pointer"
// // //               >
// // //                 {col}
// // //               </button>
// // //             ))}
// // //             <button
// // //               onClick={showAllHiddenColumns}
// // //               className="btn1 btn-blue !py-0.5 !px-2.5 text-xs font-medium cursor-pointer"
// // //             >
// // //               Show All
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}

// // //       <div className="overflow-x-auto rounded-lg border border-gray-300 scrollbar-thin">
// // //         <table className="w-full text-xs min-w-[1600px] border-collapse">
// // //           <thead className="sticky top-0 z-10">
// // //             <tr>
// // //               <th className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center w-10"></th>
// // //               <th className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center w-12">
// // //                 Line
// // //               </th>
// // //               {availableHideableColumns.map(
// // //                 (col) =>
// // //                   !hiddenColumns[col] && (
// // //                     <th
// // //                       key={col}
// // //                       className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center"
// // //                     >
// // //                       <div className="flex items-center justify-between gap-2 group px-1">
// // //                         <span className="flex-1 text-center">{col}</span>
// // //                         <button
// // //                           onClick={(e) => {
// // //                             e.stopPropagation();
// // //                             toggleColumnVisibility(col);
// // //                           }}
// // //                           className="p-1 hover:bg-blue-100 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
// // //                           title="Hide column"
// // //                           type="button"
// // //                         >
// // //                           <MinusCircleIcon className="h-3.5 w-3.5 text-gray-500 hover:text-gray-800" />
// // //                         </button>
// // //                       </div>
// // //                     </th>
// // //                   ),
// // //               )}
// // //               {periodDates.map((dateInfo) => (
// // //                 <th
// // //                   key={dateInfo.apiDate}
// // //                   className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center min-w-[75px]"
// // //                 >
// // //                   {dateInfo.display}
// // //                 </th>
// // //               ))}
// // //               <th className="px-2 py-1.5 whitespace-nowrap border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center">
// // //                 Total
// // //               </th>
// // //             </tr>
// // //           </thead>
// // //           <tbody className="divide-y divide-gray-200 bg-white">
// // //             {lines.map((line, index) => {
// // //               const rowTotal = Object.values(line.hours)
// // //                 .reduce((s, h) => s + (parseFloat(h) || 0), 0)
// // //                 .toFixed(2);

// // //               const isDisabled = isLineDisabled(line);

// // //               return (
// // //                 <tr
// // //                   key={line.id}
// // //                   className="hover:bg-sky-50/50 transition-colors"
// // //                 >
// // //                   <td className="px-2 py-1 text-center whitespace-nowrap border-r border-b border-gray-300">
// // //                     <input
// // //                       type="checkbox"
// // //                       className={`rounded border-gray-300 ${!isEditable
// // //                           ? "cursor-not-allowed opacity-50"
// // //                           : "cursor-pointer accent-blue-600"
// // //                         }`}
// // //                       checked={selectedLines.has(line.id)}
// // //                       onChange={() => handleSelectLine(line.id)}
// // //                       disabled={!isEditable}
// // //                     />
// // //                   </td>
// // //                   <td className="px-2 py-1 text-center whitespace-nowrap border-r border-b border-gray-300 text-black font-medium">
// // //                     {index + 1}
// // //                   </td>
// // //                   {hideableColumns.includes("Work Order") &&
// // //                     !hiddenColumns["Work Order"] && (
// // //                       <td className="p-1 border-r border-b border-gray-300 min-w-[250px]">
// // //                         <CascadingSelect
// // //                           label="Work Order"
// // //                           options={workOrderOptions}
// // //                           value={line.workOrder}
// // //                           onChange={(e) =>
// // //                             handleSelectChange(
// // //                               line.id,
// // //                               "workOrder",
// // //                               e.target.value,
// // //                             )
// // //                           }
// // //                           disabled={isDisabled}
// // //                         />
// // //                       </td>
// // //                     )}
// // //                   {hideableColumns.includes("Description") &&
// // //                     !hiddenColumns["Description"] && (
// // //                       <td className="p-1 border-r border-b border-gray-300 min-w-[200px]">
// // //                         <input
// // //                           type="text"
// // //                           value={line.description}
// // //                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// // //                           readOnly
// // //                         />
// // //                       </td>
// // //                     )}
// // //                   {/* {!hiddenColumns["Project"] && (
// // //                     <td className="p-1 border-r border-b border-gray-300 min-w-[150px]">
// // //                       <input
// // //                         type="text"
// // //                         value={line.project}
// // //                         className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// // //                         readOnly
// // //                       />
// // //                     </td>
// // //                   )} */}
// // //                   {hideableColumns.includes("Project") &&
// // //                     !hiddenColumns["Project"] && (
// // //                       <td className="p-1 border-r border-b border-gray-300 min-w-[150px]">
// // //                         {role !== "fbsdusbcsdnjsbhasbx" ? (
// // //                           <select
// // //                             value={line.project}
// // //                             onChange={(e) => {
// // //                               const selectedProjId = e.target.value;
// // //                               // Find matching entry from employeeProjects data to automatically map the billLabCatCd to plc
// // //                               const matchedEntry = employeeProjects.find(
// // //                                 (proj) => proj.projId === selectedProjId,
// // //                               );

// // //                               setLines((currentLines) =>
// // //                                 currentLines.map((l) =>
// // //                                   l.id === line.id
// // //                                     ? {
// // //                                       ...l,
// // //                                       project: selectedProjId,
// // //                                       projectName: matchedEntry
// // //                                         ? matchedEntry.projectName
// // //                                         : "",
// // //                                       plc: matchedEntry
// // //                                         ? matchedEntry.billLabCatCd
// // //                                         : "",
// // //                                       plcDesc: matchedEntry
// // //                                         ? matchedEntry.plcDesc
// // //                                         : "",
// // //                                       pmUserID: matchedEntry
// // //                                         ? matchedEntry.pm_UserId || ""
// // //                                         : "",
// // //                                     }
// // //                                     : l,
// // //                                 ),
// // //                               );
// // //                             }}
// // //                             disabled={isDisabled}
// // //                             className={`w-full bg-white px-2 py-1 text-xs border border-gray-300 rounded shadow-inner text-black ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
// // //                               }`}
// // //                           >
// // //                             <option value="">Select Project</option>
// // //                             {employeeProjects.map((proj) => (
// // //                               <option key={proj.projId} value={proj.projId}>
// // //                                 {proj.projId} (LabCat: {proj.billLabCatCd})
// // //                               </option>
// // //                             ))}
// // //                           </select>
// // //                         ) : (
// // //                           <input
// // //                             type="text"
// // //                             value={line.project}
// // //                             className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// // //                             readOnly
// // //                           />
// // //                         )}
// // //                       </td>
// // //                     )}
// // //                   {hideableColumns.includes("Project Name") &&
// // //                     !hiddenColumns["Project Name"] && (
// // //                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// // //                         <input
// // //                           type="text"
// // //                           value={line.projectName}
// // //                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// // //                           readOnly
// // //                         />
// // //                       </td>
// // //                     )}
// // //                   {hideableColumns.includes("PLC") && !hiddenColumns["PLC"] && (
// // //                     <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// // //                       <input
// // //                         type="text"
// // //                         value={line.plc}
// // //                         className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// // //                         readOnly
// // //                       />
// // //                     </td>
// // //                   )}
// // //                   {hideableColumns.includes("PLC Description") &&
// // //                     !hiddenColumns["PLC Description"] && (
// // //                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// // //                         <input
// // //                           type="text"
// // //                           value={line.plcDesc}
// // //                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// // //                           readOnly
// // //                         />
// // //                       </td>
// // //                     )}
// // //                   {hideableColumns.includes("Pay Type") &&
// // //                     !hiddenColumns["Pay Type"] && (
// // //                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// // //                         <select
// // //                           value={line.payType}
// // //                           onChange={(e) =>
// // //                             handleSelectChange(
// // //                               line.id,
// // //                               "payType",
// // //                               e.target.value,
// // //                             )
// // //                           }
// // //                           className={`w-full bg-white px-2 py-1 text-xs border border-gray-300 rounded shadow-inner text-black ${isDisabled
// // //                               ? "bg-gray-100 text-gray-500 cursor-not-allowed"
// // //                               : ""
// // //                             }`}
// // //                           disabled={isDisabled}
// // //                         >
// // //                           <option value="SR">Regular</option>
// // //                           <option value="SO">Overtime</option>
// // //                         </select>
// // //                       </td>
// // //                     )}
// // //                   {hideableColumns.includes("PO Number") &&
// // //                     !hiddenColumns["PO Number"] && (
// // //                       <td className="p-1 border-r border-b border-gray-300 min-w-[150px]">
// // //                         <input
// // //                           type="text"
// // //                           value={line.poNumber}
// // //                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// // //                           readOnly
// // //                         />
// // //                       </td>
// // //                     )}
// // //                   {hideableColumns.includes("RLSE Number") &&
// // //                     !hiddenColumns["RLSE Number"] && (
// // //                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// // //                         <input
// // //                           type="text"
// // //                           value={line.rlseNumber}
// // //                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// // //                           readOnly
// // //                         />
// // //                       </td>
// // //                     )}
// // //                   {hideableColumns.includes("PO Line Number") &&
// // //                     !hiddenColumns["PO Line Number"] && (
// // //                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// // //                         <input
// // //                           type="text"
// // //                           value={line.poLineNumber}
// // //                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// // //                           readOnly
// // //                         />
// // //                       </td>
// // //                     )}
// // //                   {isAdmin &&
// // //                     hideableColumns.includes("PO Remaining Hours") &&
// // //                     !hiddenColumns["PO Remaining Hours"] && (
// // //                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// // //                         {line.poLineNumber &&
// // //                           remainingPoHours[String(line.poLineNumber).trim()] !==
// // //                           undefined ? (
// // //                           <div className="text-xs font-medium text-center">
// // //                             <span
// // //                               className={`font-semibold ${parseFloat(getRemainingHoursForLine(line)) < 0
// // //                                   ? "text-red-600"
// // //                                   : "text-green-600"
// // //                                 }`}
// // //                             >
// // //                               {getRemainingHoursForLine(line)} hrs
// // //                             </span>
// // //                           </div>
// // //                         ) : (
// // //                           <div className="text-xs font-medium text-center text-gray-400">
// // //                             -
// // //                           </div>
// // //                         )}
// // //                       </td>
// // //                     )}
// // //                   {periodDates.map((dateInfo, dayIndex) => {
// // //                     const days = [
// // //                       "sunday",
// // //                       "monday",
// // //                       "tuesday",
// // //                       "wednesday",
// // //                       "thursday",
// // //                       "friday",
// // //                       "saturday",
// // //                     ];
// // //                     const dayIndexUtc = dateInfo.obj.getUTCDay();
// // //                     const dayName = days[dayIndexUtc];
// // //                     const isWeekend = configWeekends.includes(dayName);
// // //                     const isFutureDate =
// // //                       dateInfo.obj.getUTCFullYear() > today.getUTCFullYear() ||
// // //                       (dateInfo.obj.getUTCFullYear() ===
// // //                         today.getUTCFullYear() &&
// // //                         dateInfo.obj.getUTCMonth() > today.getUTCMonth()) ||
// // //                       (dateInfo.obj.getUTCFullYear() ===
// // //                         today.getUTCFullYear() &&
// // //                         dateInfo.obj.getUTCMonth() === today.getUTCMonth() &&
// // //                         dateInfo.obj.getUTCDate() > today.getUTCDate());

// // //                     const finalDisabled = isDisabled || isFutureDate;
// // //                     const dayTotal = dailyTotals[dayIndex] || 0;
// // //                     const exceededMax = dayTotal > maxDailyHours;

// // //                     let inputClasses = `w-16 text-right px-1.5 py-1 text-xs border border-gray-300 rounded shadow-inner text-black `;
// // //                     let inputStyle = {};

// // //                     if (isWeekend && configHighlightColor) {
// // //                       inputStyle.backgroundColor = configHighlightColor;
// // //                     }
// // //                     if (!inputStyle.backgroundColor && isWeekend) {
// // //                       inputClasses += "bg-gray-100 ";
// // //                     } else if (!inputStyle.backgroundColor) {
// // //                       inputClasses += "bg-white ";
// // //                     }

// // //                     if (exceededMax) {
// // //                       inputStyle.backgroundColor = "";
// // //                       inputClasses = inputClasses
// // //                         .replace("bg-gray-100", "")
// // //                         .replace("bg-white", "");
// // //                       inputClasses +=
// // //                         "bg-red-100 border-red-500 text-red-800 font-bold ";
// // //                     } else if (finalDisabled) {
// // //                       inputClasses = inputClasses.replace("bg-white", "");
// // //                       if (isWeekend && configHighlightColor) {
// // //                         inputClasses = inputClasses.replace("bg-gray-100", "");
// // //                       } else {
// // //                         inputStyle.backgroundColor = "";
// // //                         inputClasses += "bg-gray-100 ";
// // //                       }
// // //                       inputClasses += " text-gray-500 cursor-not-allowed ";
// // //                     } else {
// // //                       inputClasses +=
// // //                         " focus:outline-none focus:ring-1 focus:ring-blue-500 ";
// // //                     }

// // //                     const dayComment = line.comments?.[dayIndex] || "";
// // //                     const hasComment = Boolean(
// // //                       dayComment && dayComment.trim() !== "",
// // //                     );
// // //                     let cellTitle = "";
// // //                     if (hasComment) {
// // //                       cellTitle = `Comment: ${dayComment}`;
// // //                     }

// // //                     return (
// // //                       <td
// // //                         key={dateInfo.apiDate}
// // //                         className="p-1 border-r border-b border-gray-300 text-center"
// // //                       >
// // //                         <div className="relative inline-flex items-center group">
// // //                           <input
// // //                             type="number"
// // //                             step="0.5"
// // //                             value={
// // //                               line.hours[dayIndex] === 0 ||
// // //                               line.hours[dayIndex] === ""
// // //                                 ? ""
// // //                                 : line.hours[dayIndex]
// // //                             }
// // //                             onChange={(e) =>
// // //                               handleHourChange(line.id, dayIndex, e.target.value)
// // //                             }
// // //                             title={cellTitle}
// // //                             className={`${inputClasses} ${hasComment ? "pr-4" : ""}`}
// // //                             style={inputStyle}
// // //                             disabled={finalDisabled}
// // //                           />
// // //                           {/* Comment Icon button: interactive if isEditable or if existing comment */}
// // //                           {(isEditable || hasComment) && (
// // //                             <button
// // //                               type="button"
// // //                               onClick={() =>
// // //                                 openCommentModal(
// // //                                   line.id,
// // //                                   dayIndex,
// // //                                   dateInfo.display,
// // //                                   !isEditable,
// // //                                 )
// // //                               }
// // //                               title={
// // //                                 hasComment
// // //                                   ? `Comment: ${dayComment}`
// // //                                   : "Add comment"
// // //                               }
// // //                               className={`absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded transition-all ${
// // //                                 hasComment
// // //                                   ? "text-blue-600 opacity-100 hover:text-blue-800"
// // //                                   : "text-gray-400 opacity-0 group-hover:opacity-80 hover:text-gray-700"
// // //                               }`}
// // //                             >
// // //                               <CommentIcon className="w-2.5 h-2.5" />
// // //                             </button>
// // //                           )}
// // //                           {/* Custom hover tooltip if comment exists */}
// // //                           {hasComment && (
// // //                             <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-40 w-max max-w-[200px] p-2 bg-gray-900 text-white text-xs rounded shadow-lg pointer-events-none break-words text-left">
// // //                               <span className="font-semibold text-sky-300 block text-[10px] uppercase tracking-wider">
// // //                                 Comment:
// // //                               </span>
// // //                               <span className="block text-[11px] mt-0.5 whitespace-pre-wrap">
// // //                                 {dayComment}
// // //                               </span>
// // //                               <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
// // //                             </div>
// // //                           )}
// // //                         </div>
// // //                       </td>
// // //                     );
// // //                   })}
// // //                   <td className="px-2 py-1 text-right font-bold text-black border-b border-gray-300 pr-3">
// // //                     {rowTotal}
// // //                   </td>
// // //                 </tr>
// // //               );
// // //             })}
// // //           </tbody>
// // //           <tfoot className="border-t-2 border-gray-300 bg-[#e5f3fb] font-semibold text-black text-xs">
// // //             <tr>
// // //               <td
// // //                 colSpan={
// // //                   2 +
// // //                   availableHideableColumns.filter((col) => !hiddenColumns[col])
// // //                     .length
// // //                 }
// // //                 className="px-3 py-2 text-right font-bold text-black border-r border-gray-300"
// // //               >
// // //                 Total Hours
// // //               </td>
// // //               {periodDates.map((_, idx) => (
// // //                 <td
// // //                   key={idx}
// // //                   className="px-2 py-2 text-center border-r border-gray-300"
// // //                 >
// // //                   <div
// // //                     className={`w-16 mx-auto ${dailyTotals[idx] > maxDailyHours
// // //                         ? "text-red-700 font-bold"
// // //                         : "text-black font-semibold"
// // //                       }`}
// // //                   >
// // //                     {dailyTotals[idx] ? dailyTotals[idx].toFixed(2) : "0.00"}
// // //                   </div>
// // //                 </td>
// // //               ))}
// // //               <td className="px-3 py-2 text-right font-bold text-black pr-3">
// // //                 {grandTotal.toFixed(2)}
// // //               </td>
// // //             </tr>
// // //           </tfoot>
// // //         </table>
// // //       </div>

// // //       {/* <div className="mt-4 flex justify-end gap-2">
// // //         <ActionButton onClick={onClose}>Cancel</ActionButton>
// // //         {isEditable && (
// // //           <ActionButton
// // //             onClick={handleSaveWithReasonPrompt}
// // //             disabled={isSaving || isCurrentlySaving}
// // //           >
// // //             {isCurrentlySaving ? "Saving..." : "Save Changes"}
// // //           </ActionButton>
// // //         )}
// // //       {/* Comment Popup Modal */}
// // //       {commentModal.isOpen && (
// // //         <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// // //           <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
// // //             <div className="flex items-center justify-between px-4 py-3 bg-[#1e3a5f] text-white">
// // //               <div className="flex items-center gap-2">
// // //                 <CommentIcon className="w-4 h-4 text-sky-300" />
// // //                 <h3 className="text-sm font-semibold">
// // //                   {commentModal.isReadOnly ? "View Hour Comment" : "Hour Comment"}
// // //                   {commentModal.dateLabel ? ` - ${commentModal.dateLabel}` : ""}
// // //                 </h3>
// // //               </div>
// // //               <button
// // //                 type="button"
// // //                 onClick={closeCommentModal}
// // //                 className="text-gray-300 hover:text-white transition-colors text-lg leading-none"
// // //               >
// // //                 &times;
// // //               </button>
// // //             </div>

// // //             <div className="p-4 space-y-3">
// // //               <label className="block text-xs font-medium text-gray-700">
// // //                 Comment for {commentModal.dateLabel || "selected date"}:
// // //               </label>
// // //               <textarea
// // //                 rows={4}
// // //                 disabled={commentModal.isReadOnly}
// // //                 value={commentModal.comment}
// // //                 onChange={(e) =>
// // //                   setCommentModal((prev) => ({
// // //                     ...prev,
// // //                     comment: e.target.value,
// // //                   }))
// // //                 }
// // //                 placeholder={
// // //                   commentModal.isReadOnly
// // //                     ? "No comment added."
// // //                     : "Enter comment / note for this day's hours..."
// // //                 }
// // //                 className={`w-full text-xs p-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
// // //                   commentModal.isReadOnly
// // //                     ? "bg-gray-100 text-gray-700 cursor-not-allowed border-gray-300"
// // //                     : "bg-white text-gray-900 border-gray-300"
// // //                 }`}
// // //                 autoFocus={!commentModal.isReadOnly}
// // //               />
// // //             </div>

// // //             <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
// // //               <div>
// // //                 {!commentModal.isReadOnly && commentModal.comment && (
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => saveComment("")}
// // //                     className="text-xs text-red-600 hover:text-red-800 hover:underline font-medium"
// // //                   >
// // //                     Clear Comment
// // //                   </button>
// // //                 )}
// // //               </div>
// // //               <div className="flex items-center gap-2">
// // //                 <button
// // //                   type="button"
// // //                   onClick={closeCommentModal}
// // //                   className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
// // //                 >
// // //                   {commentModal.isReadOnly ? "Close" : "Cancel"}
// // //                 </button>
// // //                 {!commentModal.isReadOnly && (
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => saveComment(commentModal.comment)}
// // //                     className="px-3 py-1.5 text-xs font-medium text-white bg-[#1e3a5f] hover:bg-[#152a45] rounded shadow transition-colors"
// // //                   >
// // //                     Save Comment
// // //                   </button>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // import React, { useState, useEffect, useMemo, useRef } from "react";
// // import { backendUrl } from "./config";

// // // --- SVG Icons ---
// // const CommentIcon = ({ className = "h-4 w-4" }) => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     className={className}
// //     fill="none"
// //     viewBox="0 0 24 24"
// //     stroke="currentColor"
// //   >
// //     <path
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //       strokeWidth={2}
// //       d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
// //     />
// //   </svg>
// // );
// // const PlusIcon = ({ className = "h-4 w-4" }) => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     className={className}
// //     fill="none"
// //     viewBox="0 0 24 24"
// //     stroke="currentColor"
// //   >
// //     {" "}
// //     <path
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //       strokeWidth={2}
// //       d="M12 6v6m0 0v6m0-6h6m-6 0H6"
// //     />{" "}
// //   </svg>
// // );

// // const CopyIcon = ({ className = "h-4 w-4" }) => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     className={className}
// //     fill="none"
// //     viewBox="0 0 24 24"
// //     stroke="currentColor"
// //   >
// //     {" "}
// //     <path
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //       strokeWidth={2}
// //       d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
// //     />{" "}
// //   </svg>
// // );

// // const TrashIcon = ({ className = "h-4 w-4" }) => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     className={className}
// //     fill="none"
// //     viewBox="0 0 24 24"
// //     stroke="currentColor"
// //   >
// //     {" "}
// //     <path
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //       strokeWidth={2}
// //       d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
// //     />{" "}
// //   </svg>
// // );

// // const EyeIcon = ({ className = "h-4 w-4" }) => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     className={className}
// //     fill="none"
// //     viewBox="0 0 24 24"
// //     stroke="currentColor"
// //   >
// //     {" "}
// //     <path
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //       strokeWidth={2}
// //       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
// //     />{" "}
// //     <path
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //       strokeWidth={2}
// //       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
// //     />{" "}
// //   </svg>
// // );

// // const XIcon = ({ className = "h-4 w-4" }) => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     className={className}
// //     fill="none"
// //     viewBox="0 0 24 24"
// //     stroke="currentColor"
// //   >
// //     {" "}
// //     <path
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //       strokeWidth={2}
// //       d="M6 18L18 6M6 6l12 12"
// //     />{" "}
// //   </svg>
// // );

// // const MinusCircleIcon = ({ className = "h-4 w-4" }) => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     className={className}
// //     fill="none"
// //     viewBox="0 0 24 24"
// //     stroke="currentColor"
// //   >
// //     {" "}
// //     <path
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //       strokeWidth={2}
// //       d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
// //     />{" "}
// //   </svg>
// // );

// // // --- ActionButton Component ---

// // const ActionButton = ({
// //   children,
// //   onClick,
// //   icon,
// //   className = "",
// //   disabled = false,
// // }) => {
// //   const buttonStyle = disabled
// //     ? "btn1 btn-inactive opacity-60 cursor-not-allowed"
// //     : "btn1 btn-blue cursor-pointer";

// //   return (
// //     <button
// //       onClick={onClick}
// //       disabled={disabled}
// //       className={`${buttonStyle} inline-flex items-center gap-1.5 text-xs font-semibold ${className}`}
// //     >
// //       {icon && <span>{icon}</span>}
// //       {children}
// //     </button>
// //   );
// // };

// // // --- Toast Notification (Updated Duration) ---

// // const showToast = (message, type = "info", duration = 3000) => {
// //   const toast = document.createElement("div");

// //   const typeClasses = {
// //     success: "bg-green-500",
// //     error: "bg-red-500",
// //     warning: "bg-yellow-500 text-black",
// //     info: "bg-blue-500",
// //   };

// //   toast.className = `fixed top-5 right-5 p-4 rounded-md text-white shadow-lg z-[10000] ${typeClasses[type] || typeClasses["info"]
// //     }`;

// //   toast.textContent = message;

// //   document.body.appendChild(toast);

// //   setTimeout(() => {
// //     if (document.body.contains(toast)) {
// //       document.body.removeChild(toast);
// //     }
// //   }, duration);
// // };

// // const createEmptyLine = (id, periodLength) => {
// //   const emptyHours = {};
// //   const emptyComments = {};

// //   for (let i = 0; i < periodLength; i++) {
// //     emptyHours[i] = 0;
// //     emptyComments[i] = "";
// //   }

// //   return {
// //     id,
// //     description: "",
// //     project: "",
// //     plc: "",
// //     workOrder: "",
// //     wa_Code: "",
// //     pmUserID: "",
// //     payType: "SR",

// //     poNumber: "",
// //     rlseNumber: "",
// //     poLineNumber: "",
// //     hours: emptyHours,
// //     hourIds: {},
// //     comments: emptyComments,
// //     isInvoiced: false,
// //   };
// // };

// // const CascadingSelect = ({
// //   label,
// //   options,
// //   value,
// //   onChange,
// //   disabled = false,
// // }) => (
// //   <select
// //     value={value}
// //     onChange={onChange}
// //     disabled={disabled}
// //     className={`w-full bg-white px-2 py-1 text-xs border border-gray-300 rounded shadow-inner text-black focus:outline-none focus:ring-1 focus:ring-blue-500 ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
// //       }`}
// //   >
// //     <option value="">Select {label}</option>
// //     {options.map((opt) => (
// //       <option key={opt.value} value={opt.value}>
// //         {opt.label}
// //       </option>
// //     ))}
// //   </select>
// // );

// // const formatDate = (dateInput) => {
// //   if (!dateInput) return "";

// //   let date;

// //   if (dateInput instanceof Date) {
// //     date = dateInput;
// //   } else {
// //     const dateOnlyString = String(dateInput).split("T")[0];

// //     const parts = dateOnlyString.split("-");

// //     if (parts.length !== 3) return dateInput;

// //     const year = parseInt(parts[0], 10);

// //     const month = parseInt(parts[1], 10) - 1;

// //     const day = parseInt(parts[2], 10);

// //     date = new Date(Date.UTC(year, month, day));
// //   }

// //   if (isNaN(date.getTime())) return "";

// //   return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(date);
// // };

// // const getPeriodData = (endDateStr, frequency) => {
// //   // --- CRITICAL CHANGE: Parse MM/DD/YYYY format for endDateStr ---
// //   const dateOnlyString = endDateStr.split("T")[0];
// //   const parts = dateOnlyString.split(/[-\/]/).map(Number); // Handles both MM/DD/YYYY and YYYY-MM-DD formats more flexibly

// //   let year, monthIndex, day;
// //   if (parts.length === 3) {
// //     // Determine format based on typical display order vs ISO order (heuristically, assuming YYYY is large)
// //     if (parts[0] > 31 && parts[0] > 1900) {
// //       // Assumes YYYY-MM-DD format (ISO)
// //       year = parts[0];
// //       monthIndex = parts[1] - 1;
// //       day = parts[2];
// //     } else {
// //       // Assumes MM/DD/YYYY format (Display)
// //       monthIndex = parts[0] - 1;
// //       day = parts[1];
// //       year = parts[2];
// //     }
// //   } else {
// //     // Fallback or handle invalid input
// //     return [];
// //   } // Construct the Date object explicitly in UTC to ensure no local timezone offset

// //   const end = new Date(Date.UTC(year, monthIndex, day)); // --- Rest of the logic remains UTC-safe ---
// //   const dates = [];
// //   const freq = frequency ? frequency.toLowerCase() : "weekly";

// //   const numOpt = { month: "2-digit", day: "2-digit", timeZone: "UTC" };
// //   const txtOpt = { month: "short", day: "2-digit", timeZone: "UTC" };

// //   const getFmt = (d) => {
// //     if (freq === "monthly" || freq === "semi-monthly")
// //       return new Intl.DateTimeFormat("en-US", txtOpt).format(d);
// //     return new Intl.DateTimeFormat("en-US", numOpt).format(d);
// //   }; // This ensures the output date for API remains YYYY-MM-DD
// //   const getApiFmt = (d) => d.toISOString().split("T")[0]; // Use 'end' date which is now correctly set to UTC midnight for the calendar date

// //   let start = new Date(end); // start is also a UTC date for the end day

// //   if (freq === "weekly") {
// //     // Setting date on a UTC Date object is safe and keeps it in UTC context
// //     start.setUTCDate(end.getUTCDate() - 6);
// //   } else if (freq === "bi-weekly") {
// //     start.setUTCDate(end.getUTCDate() - 13);
// //   } else if (freq === "monthly") {
// //     // Calculate start of month in UTC
// //     start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));
// //   } else if (freq === "semi-monthly") {
// //     if (end.getUTCDate() <= 15) {
// //       // Calculate start of 1st half of month in UTC
// //       start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));
// //     } else {
// //       // Calculate start of 2nd half of month in UTC
// //       start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 16));
// //     }
// //   } // Iterate using UTC date methods

// //   for (
// //     let d = new Date(start);
// //     d.getTime() <= end.getTime();
// //     d.setUTCDate(d.getUTCDate() + 1)
// //   ) {
// //     const currentDay = new Date(d); // Create a new object for each day
// //     dates.push({
// //       display: getFmt(currentDay),
// //       apiDate: getApiFmt(currentDay),
// //       obj: currentDay,
// //     });
// //   }

// //   return dates;
// // };

// // const hideableColumns = [
// //   "Work Order",
// //   "Description",
// //   "Project",
// //   "PLC",
// //   "Pay Type",

// //   "PO Number",
// //   "RLSE Number",
// //   "PO Line Number",
// //   "PO Remaining Hours",
// // ];

// // export default function TimesheetDetailModal({
// //   timesheetData,
// //   currentUser,
// //   userId,
// //   role,
// //   onClose,

// //   onSave,

// //   isSaving,

// //   isAdmin = false,
// // }) {
// //   const [lines, setLines] = useState([]);

// //   const [selectedLines, setSelectedLines] = useState(new Set());

// //   const [isLoading, setIsLoading] = useState(true);

// //   const [purchaseOrderData, setPurchaseOrderData] = useState([]);
// //   const [employeeProjects, setEmployeeProjects] = useState([]);

// //   const [isEditable, setIsEditable] = useState(false);

// //   const [initialLines, setInitialLines] = useState([]);

// //   const [linesToDelete, setLinesToDelete] = useState([]);

// //   const [isCurrentlySaving, setIsCurrentlySaving] = useState(false);

// //   const [timesheetDetails, setTimesheetDetails] = useState(null);

// //   // Comment Modal state for individual hour comments
// //   const [commentModal, setCommentModal] = useState({
// //     isOpen: false,
// //     lineId: null,
// //     dayIndex: null,
// //     dateLabel: "",
// //     comment: "",
// //     isReadOnly: false,
// //   });

// //   const openCommentModal = (lineId, dayIndex, dateLabel, isReadOnly = false) => {
// //     const line = lines.find((l) => l.id === lineId);
// //     const existingComment = line?.comments?.[dayIndex] || "";
// //     setCommentModal({
// //       isOpen: true,
// //       lineId,
// //       dayIndex,
// //       dateLabel: dateLabel || `Day ${dayIndex + 1}`,
// //       comment: existingComment,
// //       isReadOnly,
// //     });
// //   };

// //   const closeCommentModal = () => {
// //     setCommentModal((prev) => ({ ...prev, isOpen: false }));
// //   };

// //   const saveComment = (newComment) => {
// //     if (commentModal.lineId == null || commentModal.dayIndex == null) return;
// //     const { lineId, dayIndex } = commentModal;
// //     setLines((prevLines) =>
// //       prevLines.map((line) =>
// //         line.id === lineId
// //           ? {
// //               ...line,
// //               comments: {
// //                 ...(line.comments || {}),
// //                 [dayIndex]: newComment,
// //               },
// //             }
// //           : line,
// //       ),
// //     );
// //     closeCommentModal();
// //   };

// //   // const [hiddenColumns, setHiddenColumns] = useState({
// //   //   "Work Order": false,
// //   //   Description: false,
// //   //   Project: false,
// //   //   PLC: false,
// //   //   "Pay Type": false,

// //   //   "PO Number": false,
// //   //   "RLSE Number": false,
// //   //   "PO Line Number": false,
// //   //   "PO Remaining Hours": false,
// //   // }); // Config States

// //   // const role = currentUser?.role?.toLowerCase(); // Default role, can be dynamically set based on user context

// //   console.log(timesheetData?.status);

// //   // Define hideable columns conditionally based on the role
// //   // const hideableColumns =
// //   //   role === "user"
// //   //     ? ["Project", "PLC", "Pay Type"]
// //   //     : [
// //   //         "Work Order",
// //   //         "Description",
// //   //         "Project",
// //   //         "PLC",
// //   //         "Pay Type",
// //   //         "PO Number",
// //   //         "RLSE Number",
// //   //         "PO Line Number",
// //   //         "PO Remaining Hours",
// //   //       ];
// //   const hideableColumns =
// //     role === "fbsdusbcsdnjsbhasbx"
// //       ? [
// //         "Work Order",
// //         "Description",
// //         "Project",
// //         "PLC",
// //         "Pay Type",
// //         "PO Number",
// //         "RLSE Number",
// //         "PO Line Number",
// //         "PO Remaining Hours",
// //       ]
// //       : ["Project", "Project Name", "PLC", "PLC Description", "Pay Type"];

// //   const [hiddenColumns, setHiddenColumns] = useState(() => {
// //     const initial = {};
// //     hideableColumns.forEach((col) => {
// //       initial[col] = false;
// //     });
// //     return initial;
// //   });

// //   const [periodType, setPeriodType] = useState("Weekly");

// //   const [configWeekends, setConfigWeekends] = useState([]);

// //   const [configHighlightColor, setConfigHighlightColor] = useState("");

// //   const [maxDailyHours, setMaxDailyHours] = useState(24);

// //   const [hardEdit, setHardEdit] = useState(false); // Dynamic Dates

// //   const periodDates = useMemo(() => {
// //     if (!timesheetData?.Date) return [];

// //     return getPeriodData(timesheetData.Date, periodType);
// //   }, [timesheetData, periodType]);

// //   const [remainingPoHours, setRemainingPoHours] = useState({});

// //   const [isLoadingRemainingHours, setIsLoadingRemainingHours] = useState(false);

// //   const [showReasonPrompt, setShowReasonPrompt] = useState(false);

// //   const [updateReason, setUpdateReason] = useState("");

// //   const nextId = useRef(0); // Global 'today' variable for future date check, set to midnight UTC // We keep this as UTC midnight for correct date part comparison.

// //   //   const today = useMemo(() => {

// //   //     const d = new Date();

// //   //     return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

// //   //   }, []);

// //   const today = useMemo(() => {
// //     const d = new Date(); // Get the current UTC date components
// //     const year = d.getUTCFullYear();
// //     const month = d.getUTCMonth();
// //     const date = d.getUTCDate(); // Create a new Date object representing the start of the current UTC calendar day
// //     return new Date(Date.UTC(year, month, date));
// //   }, []); // 1. Fetch Config (Updated)

// //   useEffect(() => {
// //     if (role !== "fbsdusbcsdnjsbhasbx") {
// //       const fetchEmployeeProjects = async () => {
// //         try {
// //           const response = await fetch(
// //             // `${backendUrl}/api/user-projects/projects/${userId}`,
// //             // `${backendUrl}/api/ProjEmployeeLabcat/employee/${currentUser?.name}`,
// //             `${backendUrl}/api/ProjEmployeeLabcat/employee/${userId}`,
// //           );
// //           if (!response.ok)
// //             throw new Error("Failed to fetch employee projects");
// //           const data = await response.json();
// //           if (Array.isArray(data)) {
// //             setEmployeeProjects(data);
// //           }
// //         } catch (err) {
// //           console.error("Error fetching employee projects:", err);
// //         }
// //       };
// //       fetchEmployeeProjects();
// //     }
// //   }, [role]);

// //   useEffect(() => {
// //     const fetchConfig = async () => {
// //       try {
// //         const response = await fetch(`${backendUrl}/api/ConfigValues`);

// //         if (!response.ok) throw new Error("Failed to fetch config");

// //         const data = await response.json();

// //         const getConfigValue = (name) =>
// //           data.find((item) => item.name?.toLowerCase() === name)?.value;

// //         const periodConfig = getConfigValue("timesheet_period");

// //         const weekendConfig = getConfigValue("weekend");

// //         const colorConfig = getConfigValue("weekend_highlight_color");

// //         const maxDailyHoursConfig = getConfigValue("max_daily_hours");

// //         const hardEditConfig = getConfigValue("hard_edit");

// //         if (periodConfig) setPeriodType(periodConfig);

// //         if (weekendConfig) {
// //           const days = weekendConfig
// //             .split(",")
// //             .map((d) => d.trim().toLowerCase());

// //           setConfigWeekends(days);
// //         }

// //         if (colorConfig) setConfigHighlightColor(colorConfig);

// //         if (maxDailyHoursConfig)
// //           setMaxDailyHours(parseFloat(maxDailyHoursConfig) || 24);

// //         if (hardEditConfig)
// //           setHardEdit(hardEditConfig.toLowerCase() === "true");
// //       } catch (error) {
// //         console.error("Config fetch error:", error);

// //         setPeriodType("Weekly"); // Fallback

// //         setConfigWeekends(["saturday", "sunday"]); // Fallback

// //         setConfigHighlightColor("#e5e7eb"); // Fallback

// //         setMaxDailyHours(24); // Fallback

// //         setHardEdit(false); // Fallback
// //       }
// //     };

// //     fetchConfig();
// //   }, []); // 2. Check Editability

// //   useEffect(() => {
// //     if (timesheetData) {
// //       const status = timesheetData.Status?.toUpperCase();

// //       setIsEditable(
// //         status === "OPEN" || status === "REJECTED" || status === "CORRECTION",
// //       );
// //     }
// //   }, [timesheetData]); // 3. Fetch PO Remaining Hours

// //   useEffect(() => {
// //     if (!timesheetData || !timesheetData["Employee ID"]) return;

// //     const fetchRemainingHours = async () => {
// //       setIsLoadingRemainingHours(true);

// //       const API_URL = `${backendUrl}/api/SubkTimesheet/GetRemainingPoHours?resourceId=${timesheetData["Employee ID"]}`;

// //       try {
// //         const response = await fetch(API_URL);

// //         if (!response.ok) throw new Error(`HTTP error!`);

// //         const data = await response.json();

// //         const hoursMap = {};

// //         if (Array.isArray(data)) {
// //           data.forEach((item) => {
// //             const poLineNum = String(
// //               item.poLineNumber || item.PoLineNumber || "",
// //             ).trim();

// //             if (poLineNum)
// //               hoursMap[poLineNum] = parseFloat(
// //                 item.remainingHours || item.RemainingHours || 0,
// //               );
// //           });
// //         }

// //         setRemainingPoHours(hoursMap);
// //       } catch (error) {
// //       } finally {
// //         setIsLoadingRemainingHours(false);
// //       }
// //     };

// //     fetchRemainingHours();
// //   }, [timesheetData]); // 4. Fetch Details & Map to Dynamic Period

// //   useEffect(() => {
// //     // Only fetch details once we have the correct Period Type loaded

// //     if (periodDates.length === 0) return;

// //     fetchTimesheetDetails();
// //   }, [periodDates]);

// //   //   const fetchTimesheetDetails = async () => {

// //   //     setIsLoading(true);

// //   //     try {

// //   //       const response = await fetch(`${backendUrl}/api/SubkTimesheet/ByResource/${timesheetData["Employee ID"]}`);

// //   //       if (!response.ok) throw new Error("Failed to fetch timesheet details");

// //   //       const data = await response.json();

// //   //       const poResponse = await fetch(`${backendUrl}/api/PurchaseOrders/ByResourceDetails/${timesheetData["Employee ID"]}`);

// //   //       if (!poResponse.ok) throw new Error("Failed to fetch purchase order details");

// //   //       const poData = await poResponse.json();

// //   //       const poDataArray = Array.isArray(poData) ? poData : [];

// //   //       setPurchaseOrderData(poDataArray);

// //   //       const dataArray = Array.isArray(data) ? data : [];

// //   //       const filteredData = dataArray.filter((item) => formatDate(item.timesheet_Date) === timesheetData.Date);

// //   //       if (filteredData.length > 0) {

// //   //         setTimesheetDetails(filteredData[0]);

// //   //       }

// //   //       const mappedLines = filteredData.map((item) => {

// //   //         const hoursData = {};

// //   //         const hourIdsData = {};

// //   //         periodDates.forEach((_, index) => { hoursData[index] = 0; });

// //   //         let isLineInvoiced = false;

// //   //         if (item.timesheetHours) {

// //   //           item.timesheetHours.forEach((hourEntry) => {

// //   //             if (hourEntry.invoiceGenerated === true) isLineInvoiced = true;

// //   //             const entryDateStr = hourEntry.ts_Date.split("T")[0];

// //   //             const dateIndex = periodDates.findIndex(d => d.apiDate === entryDateStr);

// //   //             if (dateIndex !== -1) {

// //   //               hoursData[dateIndex] = hourEntry.hours;

// //   //               hourIdsData[dateIndex] = hourEntry.id;

// //   //             }

// //   //           });

// //   //         }

// //   //         let fullWorkOrderString = "";

// //   //         const poEntry = poDataArray.find((po) => po.project?.includes(item.projId));

// //   //         if (poEntry) {

// //   //           const projectIndex = poEntry.project.indexOf(item.projId);

// //   //           if (projectIndex > -1) {

// //   //             fullWorkOrderString = `${poEntry.wa_Code} - ${poEntry.resourceDesc[projectIndex]}`;

// //   //           }

// //   //         }

// //   //         return {

// //   //           id: item.lineNo, description: item.description || "", project: item.projId || "",

// //   //           plc: item.plc || "", payType: item.payType || "SR", workOrder: fullWorkOrderString,

// //   //           wa_Code: poEntry?.wa_Code || "", pmUserID: poEntry?.pmUserId || "",

// //   //           poNumber: item.poNumber || "", rlseNumber: item.rlseNumber || "",

// //   //           poLineNumber: item.poLineNumber || "",

// //   //           hours: hoursData, hourIds: hourIdsData, isInvoiced: isLineInvoiced,

// //   //         };

// //   //       });

// //   //       setLines(mappedLines);

// //   //       setInitialLines(JSON.parse(JSON.stringify(mappedLines)));

// //   //     } catch (error) {

// //   //       showToast(error.message, "error");

// //   //     } finally {

// //   //       setIsLoading(false);

// //   //     }

// //   //   };

// //   const fetchTimesheetDetails = async () => {
// //     setIsLoading(true);
// //     try {
// //       const response = await fetch(
// //         `${backendUrl}/api/SubkTimesheet/ByResource/${timesheetData["Employee ID"]}`,
// //       );
// //       if (!response.ok) throw new Error("Failed to fetch timesheet details");
// //       const data = await response.json();

// //       const poResponse = await fetch(
// //         `${backendUrl}/api/PurchaseOrders/ByResourceDetails/${timesheetData["Employee ID"]}`,
// //       );
// //       if (!poResponse.ok)
// //         throw new Error("Failed to fetch purchase order details");
// //       const poData = await poResponse.json();
// //       const poDataArray = Array.isArray(poData) ? poData : [];
// //       setPurchaseOrderData(poDataArray);

// //       const dataArray = Array.isArray(data) ? data : []; // --- START: FIX FOR TIMEZONE-INDEPENDENT DATE COMPARISON ---

// //       const normalizeTargetDate = (dateString) => {
// //         // Assuming timesheetData.Date is in 'MM/DD/YYYY' format from the grid (based on formatDate output)
// //         const parts = dateString.split("/");
// //         if (parts.length === 3) {
// //           // Converts MM/DD/YYYY to YYYY-MM-DD
// //           return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(
// //             2,
// //             "0",
// //           )}`;
// //         } // Fallback for an ISO-like string
// //         return dateString.split("T")[0];
// //       };

// //       const normalizedTimesheetDate = normalizeTargetDate(timesheetData.Date);

// //       // const filteredData = dataArray.filter((item) => {
// //       //   // item.timesheet_Date is typically an ISO string from the API (e.g., '2025-10-12T00:00:00')
// //       //   const itemDateOnly = item.timesheet_Date.split("T")[0]; // Direct string comparison (YYYY-MM-DD) bypasses local timezone issues
// //       //   return itemDateOnly === normalizedTimesheetDate;
// //       // });
// //       const filteredData = dataArray.filter((item) => {
// //         const itemDateOnly = item.timesheet_Date.split("T")[0];
// //         const matchesDate = itemDateOnly === normalizedTimesheetDate;

// //         const isProjectManager =
// //           currentUser?.role?.toUpperCase() === "PROJECT MANAGER" ||
// //           currentUser?.role === "PM";

// //         // Filter by userId if userId is provided/available
// //         const matchesUser =
// //           isProjectManager && userId
// //             ? String(item.pm_User_Id || item.pm_User_Id || "") ===
// //             String(currentUser?.name)
// //             : true;

// //         return matchesDate && matchesUser;
// //       });

// //       // --- END: FIX FOR TIMEZONE-INDEPENDENT DATE COMPARISON ---

// //       if (filteredData.length > 0) {
// //         setTimesheetDetails(filteredData[0]);
// //       }

// //       const mappedLines = filteredData.map((item) => {
// //         const hoursData = {};

// //         const hourIdsData = {};
// //         const commentsData = {};

// //         periodDates.forEach((_, index) => {
// //           hoursData[index] = 0;
// //           commentsData[index] = "";
// //         });

// //         let isLineInvoiced = false;

// //         if (item.timesheetHours) {
// //           item.timesheetHours.forEach((hourEntry) => {
// //             if (hourEntry.invoiceGenerated === true) isLineInvoiced = true;

// //             const entryDateStr = hourEntry.ts_Date.split("T")[0];

// //             const dateIndex = periodDates.findIndex(
// //               (d) => d.apiDate === entryDateStr,
// //             );

// //             if (dateIndex !== -1) {
// //               hoursData[dateIndex] = hourEntry.hours;

// //               hourIdsData[dateIndex] = hourEntry.id;

// //               commentsData[dateIndex] =
// //                 hourEntry.comment || hourEntry.Comment || "";
// //             }
// //           });
// //         }

// //         let fullWorkOrderString = "";

// //         const poEntry = poDataArray.find((po) =>
// //           po.project?.includes(item.projId),
// //         );

// //         if (poEntry) {
// //           const projectIndex = poEntry.project.indexOf(item.projId);

// //           if (projectIndex > -1) {
// //             fullWorkOrderString = `${poEntry.wa_Code} - ${poEntry.resourceDesc[projectIndex]}`;
// //           }
// //         }

// //         return {
// //           id: item.lineNo,
// //           description: item.description || "",
// //           project: item.projId || "",
// //           projectName: item?.projectName || "",
// //           plc: item.plc || "",
// //           plcDesc: item?.plcDesc || "",
// //           payType: item.payType || "SR",
// //           workOrder: fullWorkOrderString,

// //           wa_Code: poEntry?.wa_Code || "",
// //           pmUserID: poEntry?.pmUserId || "",

// //           poNumber: item.poNumber || "",
// //           rlseNumber: item.rlseNumber || "",

// //           poLineNumber: item.poLineNumber || "",

// //           hours: hoursData,
// //           hourIds: hourIdsData,
// //           comments: commentsData,
// //           isInvoiced: isLineInvoiced,
// //         };
// //       });

// //       setLines(mappedLines);

// //       setInitialLines(JSON.parse(JSON.stringify(mappedLines)));
// //     } catch (error) {
// //       showToast(error.message, "error");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleSelectChange = (id, fieldName, value) => {
// //     setLines((currentLines) =>
// //       currentLines.map((line) => {
// //         if (line.id === id) {
// //           let updatedLine = { ...line, [fieldName]: value };

// //           if (fieldName === "workOrder") {
// //             if (!value) {
// //               const emptyLine = createEmptyLine(id, periodDates.length);

// //               return { ...emptyLine, id: line.id };
// //             }

// //             const splitIndex = value.indexOf(" - ");

// //             const waCode =
// //               splitIndex > -1 ? value.substring(0, splitIndex) : value;

// //             const desc = splitIndex > -1 ? value.substring(splitIndex + 3) : "";

// //             const selectedWorkOrderData = purchaseOrderData.find(
// //               (item) =>
// //                 item.wa_Code === waCode &&
// //                 (item.resourceDesc || []).includes(desc),
// //             );

// //             if (selectedWorkOrderData) {
// //               updatedLine.wa_Code = selectedWorkOrderData.wa_Code || "";

// //               updatedLine.pmUserID = selectedWorkOrderData.pmUserId || "";

// //               const descIndex =
// //                 selectedWorkOrderData.resourceDesc.indexOf(desc);

// //               if (descIndex > -1) {
// //                 updatedLine.description = desc || "";

// //                 updatedLine.project =
// //                   selectedWorkOrderData.project[descIndex] || "";

// //                 updatedLine.plc = selectedWorkOrderData.plcCd[descIndex] || "";

// //                 updatedLine.poNumber =
// //                   selectedWorkOrderData.purchaseOrder[0] || "";

// //                 updatedLine.rlseNumber =
// //                   selectedWorkOrderData.purchaseOrderRelease[0] || "";

// //                 updatedLine.poLineNumber =
// //                   selectedWorkOrderData.poLineNumber[descIndex] || "";
// //               }
// //             } else {
// //               const emptyLine = createEmptyLine(id, periodDates.length);

// //               return { ...emptyLine, id: line.id };
// //             }
// //           }

// //           return updatedLine;
// //         }

// //         return line;
// //       }),
// //     );
// //   };

// //   const handleHourChange = (id, dayIndex, value) => {
// //     // FIX: Preserve current value as empty string or 0 in state if input is empty
// //     if (value === "") {
// //       setLines((currentLines) =>
// //         currentLines.map((line) =>
// //           line.id === id
// //             ? { ...line, hours: { ...line.hours, [dayIndex]: "" } }
// //             : line,
// //         ),
// //       );
// //       return;
// //     }

// //     const numValue = parseFloat(value);
// //     let isValid = true;
// //     let toastMessage = "";
// //     let toastType = "warning"; // Default for soft checks
// //     let isPOExceeded = false;
// //     let isMaxDailyExceeded = false;
// //     const currentLine = lines.find((line) => line.id === id);

// //     const status = timesheetData.Status?.toUpperCase();
// //     const allowNegativeHours = status === "CORRECTION" || status === "REJECTED";

// //     if (isNaN(numValue)) {
// //       isValid = false;
// //       toastType = "error";
// //       toastMessage = "Hours must be a number.";
// //     } else if (!allowNegativeHours && numValue < 0) {
// //       // Block negative numbers ONLY if not in Correction/Rejected status
// //       isValid = false;
// //       toastType = "error";
// //       toastMessage =
// //         "Hours cannot be negative unless correcting a rejected timesheet.";
// //     } else if (numValue % 0.5 !== 0) {
// //       isValid = false;
// //       toastType = "error";
// //       toastMessage = "Hours must be in 0.5 increments.";
// //     } else {
// //       // Start complex checks only if base validation passed
// //       // **VALIDATION 2: PO Remaining Hours (Conditional based on hardEdit) - CHECKED FIRST**
// //       if (currentLine && currentLine.poLineNumber) {
// //         const poLineNumber = String(currentLine.poLineNumber).trim();
// //         const remainingHours = remainingPoHours[poLineNumber];

// //         if (remainingHours !== undefined) {
// //           // Calculate the impact of the new hour value (synchronized calculation)
// //           const tempLines = lines.map((line) =>
// //             line.id === id
// //               ? { ...line, hours: { ...line.hours, [dayIndex]: numValue } }
// //               : line,
// //           );
// //           const allLinesWithSamePO = tempLines.filter(
// //             (l) => String(l.poLineNumber).trim() === poLineNumber,
// //           );

// //           const totalNewHoursForPO = allLinesWithSamePO.reduce((sum, l) => {
// //             const initialLine = initialLines.find((init) => init.id === l.id);
// //             const currentUITotal = Object.values(l.hours).reduce(
// //               (s, h) => s + (parseFloat(h) || 0),
// //               0,
// //             );
// //             const initialTotal = initialLine
// //               ? Object.values(initialLine.hours).reduce(
// //                 (s, h) => s + (parseFloat(h) || 0),
// //                 0,
// //               )
// //               : 0;
// //             return sum + (currentUITotal - initialTotal);
// //           }, 0);

// //           if (totalNewHoursForPO > remainingHours) {
// //             isPOExceeded = true;

// //             if (!hardEdit) {
// //               // HARD STOP (Blocking entry)
// //               isValid = false;
// //               toastType = "error";
// //               toastMessage = `Disabled: Cannot exceed remaining PO hours (${remainingHours.toFixed(
// //                 2,
// //               )} available for PO Line ${poLineNumber}).`;
// //             } else {
// //               // SOFT WARNING (Allowing entry)
// //               // Set initial soft warning message
// //               toastMessage = `PO hours exceeded. ${remainingHours.toFixed(
// //                 2,
// //               )} hours available for PO Line ${poLineNumber}.`;
// //               toastType = "warning";
// //             }
// //           }
// //         }
// //       } // **VALIDATION 3: Max Daily Hours (Configurable) - CHECKED SECOND** // Check only if we haven't hit a hard stop already (isValid is still true from base/PO check)

// //       if (isValid) {
// //         const otherLinesTotal = lines
// //           .filter((line) => line.id !== id)
// //           .reduce(
// //             (sum, line) => sum + (parseFloat(line.hours[dayIndex]) || 0),
// //             0,
// //           );

// //         const newDailyTotal = otherLinesTotal + numValue;

// //         if (newDailyTotal > maxDailyHours) {
// //           isMaxDailyExceeded = true; // Max Daily limit is always a hard block
// //           isValid = false;
// //           toastType = "error"; // SYNCED MESSAGE LOGIC:
// //           const maxDailyError = `Daily total hours exceed the maximum limit of ${maxDailyHours}.`;
// //           if (isPOExceeded && hardEdit) {
// //             // PO was soft-warned, but Max Daily is a hard fail. Use the Warning structure from Line component.
// //             // The hard fail (isValid=false) means this message will be shown as an ERROR toast.
// //             toastMessage = `${maxDailyError} Also, PO hours exceeded.`;
// //           } else {
// //             // Max Daily is the only issue, or PO was already a hard fail.
// //             toastMessage = `Disabled: ${maxDailyError}`;
// //           }
// //         }
// //       }
// //     } // Determine toast duration (5 seconds for soft warnings, 3 seconds for blocks)

// //     const toastDuration = isValid && isPOExceeded && hardEdit ? 5000 : 3000;

// //     if (isValid) {
// //       setLines((currentLines) =>
// //         currentLines.map((line) =>
// //           line.id === id
// //             ? { ...line, hours: { ...line.hours, [dayIndex]: numValue } }
// //             : line,
// //         ),
// //       ); // Show soft warning if an input was allowed but exceeded a soft limit (hardEdit=true PO limit)
// //       if (isPOExceeded && hardEdit) {
// //         showToast(toastMessage, toastType, toastDuration);
// //       }
// //     } else {
// //       // Input blocked by a hard-error
// //       showToast(toastMessage, toastType, toastDuration); // Revert value to the previous state
// //       setLines((currentLines) =>
// //         currentLines.map((line) =>
// //           line.id === id
// //             ? {
// //               ...line,
// //               hours: { ...line.hours, [dayIndex]: line.hours[dayIndex] },
// //             }
// //             : line,
// //         ),
// //       );
// //     }
// //   };

// //   const getRemainingHoursForLine = (line) => {
// //     if (!line.poLineNumber) return null;

// //     const poLineNumStr = String(line.poLineNumber).trim();

// //     const remaining = remainingPoHours[poLineNumStr];

// //     if (remaining === undefined) return null;

// //     const allLinesWithSamePO = lines.filter(
// //       (l) => String(l.poLineNumber).trim() === poLineNumStr,
// //     );

// //     const totalNewHoursForPO = allLinesWithSamePO.reduce((sum, l) => {
// //       const initialLine = initialLines.find((init) => init.id === l.id);

// //       const currentUITotal = Object.values(l.hours).reduce(
// //         (s, h) => s + (parseFloat(h) || 0),
// //         0,
// //       );

// //       const initialTotal = initialLine
// //         ? Object.values(initialLine.hours).reduce(
// //           (s, h) => s + (parseFloat(h) || 0),
// //           0,
// //         )
// //         : 0;

// //       return sum + (currentUITotal - initialTotal);
// //     }, 0);

// //     return (remaining - totalNewHoursForPO).toFixed(2);
// //   };

// //   const addLine = () =>
// //     setLines((prev) => [
// //       ...prev,
// //       createEmptyLine(`temp-${Date.now()}`, periodDates.length),
// //     ]);

// //   const handleSelectLine = (id) => {
// //     const newSelection = new Set(selectedLines);

// //     newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);

// //     setSelectedLines(newSelection);
// //   };

// //   const deleteLines = () => {
// //     if (selectedLines.size === 0) {
// //       showToast("Please select lines to delete.", "warning");
// //       return;
// //     }

// //     if (timesheetData.Status?.toUpperCase() === "REJECTED") {
// //       showToast(
// //         "For rejected timesheets, hours will be zeroed out upon saving.",
// //         "info",
// //       );

// //       setLines((currentLines) =>
// //         currentLines.map((line) =>
// //           selectedLines.has(line.id)
// //             ? {
// //               ...line,
// //               hours: Object.keys(line.hours).reduce(
// //                 (acc, k) => ({ ...acc, [k]: 0 }),
// //                 {},
// //               ),
// //             }
// //             : line,
// //         ),
// //       );
// //     } else {
// //       setLines((currentLines) => {
// //         const idsToDelete = [...selectedLines].filter(
// //           (id) => typeof id === "number" || !String(id).startsWith("temp-"),
// //         );

// //         if (idsToDelete.length > 0)
// //           setLinesToDelete((prev) => [...new Set([...prev, ...idsToDelete])]);

// //         return currentLines.filter((line) => !selectedLines.has(line.id));
// //       });
// //     }

// //     setSelectedLines(new Set());
// //   }; // Correct Dynamic Totals

// //   const dailyTotals = useMemo(() => {
// //     if (periodDates.length === 0) return {};

// //     const totals = {};

// //     periodDates.forEach((_, index) => {
// //       totals[index] = 0;
// //     });

// //     lines.forEach((line) => {
// //       Object.keys(line.hours).forEach((idx) => {
// //         totals[idx] = (totals[idx] || 0) + (parseFloat(line.hours[idx]) || 0);
// //       });
// //     });

// //     return totals;
// //   }, [lines, periodDates]);

// //   const copyLines = () => {
// //     if (selectedLines.size === 0) {
// //       showToast("Please select lines to copy.", "warning");
// //       return;
// //     }

// //     const linesToCopy = lines.filter((line) => selectedLines.has(line.id));

// //     const potentialTotals = { ...dailyTotals };

// //     let validationFailed = false;

// //     linesToCopy.forEach((lineToCopy) => {
// //       Object.keys(lineToCopy.hours).forEach((idx) => {
// //         potentialTotals[idx] =
// //           (potentialTotals[idx] || 0) +
// //           (parseFloat(lineToCopy.hours[idx]) || 0);

// //         if (potentialTotals[idx] > maxDailyHours) validationFailed = true;
// //       });
// //     });

// //     if (validationFailed) {
// //       showToast(
// //         `Cannot copy, as it would cause a daily total to exceed ${maxDailyHours} hours.`,
// //         "error",
// //       );
// //       return;
// //     }

// //     showToast("Line(s) copied.", "info");

// //     const newLines = linesToCopy.map((line, index) => ({
// //       ...line,
// //       hours: { ...line.hours },
// //       comments: { ...(line.comments || {}) },
// //       id: `temp-${Date.now()}-${index}`,
// //       hourIds: {},
// //     }));

// //     setLines((prev) => [...prev, ...newLines]);

// //     setSelectedLines(new Set());
// //   };

// //   const grandTotal = Object.values(dailyTotals).reduce(
// //     (sum, total) => sum + total,
// //     0,
// //   );

// //   const toggleColumnVisibility = (columnName) => {
// //     setHiddenColumns((prev) => ({ ...prev, [columnName]: !prev[columnName] }));
// //   };

// //   const showAllHiddenColumns = () => {
// //     const allVisible = {};
// //     Object.keys(hiddenColumns).forEach((col) => {
// //       allVisible[col] = false;
// //     });
// //     setHiddenColumns(allVisible);
// //   };
// //   const hasChangesToExistingData = useMemo(() => {
// //     // Check for deletions of existing lines (lines with numeric IDs)

// //     if (
// //       linesToDelete.some(
// //         (id) => typeof id === "number" || !String(id).startsWith("temp-"),
// //       )
// //     ) {
// //       return true;
// //     } // Check for changes to existing lines or hours

// //     for (const currentLine of lines) {
// //       // Only check lines that existed initially (non-temp IDs)

// //       if (
// //         typeof currentLine.id === "number" ||
// //         !String(currentLine.id).startsWith("temp-")
// //       ) {
// //         const initialLine = initialLines.find((l) => l.id === currentLine.id);

// //         if (!initialLine) continue; // Should not happen for existing lines // 1. Check line property changes

// //         const isLineChanged =
// //           currentLine.payType !== initialLine.payType ||
// //           currentLine.workOrder !== initialLine.workOrder ||
// //           currentLine.wa_Code !== initialLine.wa_Code ||
// //           currentLine.description !== initialLine.description;

// //         if (isLineChanged) return true; // 2. Check hour changes

// //         for (const idx of Object.keys(currentLine.hours)) {
// //           // Use '===' comparison for primitive values after initial load normalization

// //           if (
// //             String(currentLine.hours[idx]) !== String(initialLine.hours[idx])
// //           ) {
// //             return true;
// //           }

// //           // Check comment changes
// //           if (
// //             String(currentLine.comments?.[idx] || "") !==
// //             String(initialLine.comments?.[idx] || "")
// //           ) {
// //             return true;
// //           }
// //         }
// //       }
// //     }

// //     return false;
// //   }, [lines, initialLines, linesToDelete]);

// //   const handleSaveWithReasonPrompt = () => {
// //     const invalidDay = Object.values(dailyTotals).find(
// //       (val) => val > maxDailyHours,
// //     );

// //     if (invalidDay) {
// //       showToast(
// //         `Save failed: Total hours for one or more days exceed ${maxDailyHours}.`,
// //         "error",
// //       );
// //       return;
// //     }

// //     const currentStatus = timesheetData?.status
// //       ? timesheetData.status.toUpperCase()
// //       : "";
// //     const isOpen = currentStatus === "OPEN";

// //     // If status is OPEN, skip the reason prompt completely and save directly
// //     if (isOpen) {
// //       handleSave("");
// //       return;
// //     }

// //     const linesToPost = lines.filter((line) =>
// //       String(line.id).startsWith("temp-"),
// //     );

// //     // Otherwise, show the prompt for REJECTED, CORRECTION, or other statuses
// //     if (
// //       linesToPost.length > 0 ||
// //       hasChangesToExistingData ||
// //       linesToDelete.length > 0
// //     ) {
// //       setShowReasonPrompt(true);
// //     } else {
// //       handleSave("");
// //     }
// //   };

// //   const handleSave = async (reason = "") => {
// //     // if (
// //     //   timesheetData?.status.toUpperCase() === "REJECTED" ||
// //     //   timesheetData?.status.toUpperCase() === "CORRECTION"
// //     // ) {
// //     //   setShowReasonPrompt(false);
// //     // }

// //     setIsCurrentlySaving(true);
// //     setShowReasonPrompt(false);
// //     setUpdateReason("");

// //     const invalidDay = Object.values(dailyTotals).find(
// //       (val) => val > maxDailyHours,
// //     );

// //     if (invalidDay) {
// //       showToast(
// //         `Save failed: Total hours for one or more days exceed ${maxDailyHours}.`,
// //         "error",
// //       );
// //       setIsCurrentlySaving(false);
// //       return;
// //     }

// //     const promises = [];
// //     const API_BASE_URL = backendUrl;
// //     const now = new Date().toISOString();
// //     const resourceId = timesheetData["Employee ID"];
// //     const currentUserName = String(resourceId);

// //     // 1. Deletions
// //     linesToDelete.forEach((id) => {
// //       if (typeof id === "number" || !String(id).startsWith("temp-")) {
// //         promises.push(
// //           fetch(
// //             `${API_BASE_URL}/api/SubkTimesheet/${id}?reason=${encodeURIComponent(
// //               reason,
// //             )}`,
// //             { method: "DELETE" },
// //           ),
// //         );
// //       }
// //     });

// //     // 2. Process Lines (New and Existing)
// //     lines.forEach((currentLine) => {
// //       const initialLine = initialLines.find((l) => l.id === currentLine.id);

// //       const totalHours = Object.values(currentLine.hours).reduce(
// //         (s, h) => s + (parseFloat(h) || 0),
// //         0,
// //       );

// //       // A. New Line (POST)
// //       if (!initialLine) {
// //         // if (totalHours <= 0) {
// //         //   showToast(
// //         //     "Cannot save a new line with zero or negative hours.",
// //         //     "warning",
// //         //   );
// //         //   setIsCurrentlySaving(false);
// //         //   return;
// //         // }

// //         const payload = {
// //           Description: currentLine.description || "New Timesheet Line",
// //           ProjId: currentLine.project || "",
// //           Plc: currentLine.plc || "",
// //           PayType: currentLine.payType || "SR",
// //           PoNumber: currentLine.poNumber || "0000",
// //           RlseNumber: currentLine.rlseNumber || "0",
// //           Resource_Id: String(userId),
// //           WorkOrder: currentLine.wa_Code,
// //           Pm_User_Id: currentLine.pmUserID || "",
// //           PoLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,
// //           Timesheet_Date: new Date(timesheetData.Date)
// //             .toISOString()
// //             .split("T")[0],
// //           CreatedBy: String(currentUser?.name),
// //           UpdatedAt: now,
// //           UpdatedBy: String(currentUser?.name),
// //           UpdateReason: reason,
// //           TimesheetHours: periodDates.map((dateInfo, idx) => {
// //             let hourValue = parseFloat(currentLine.hours[idx]);
// //             if (isNaN(hourValue)) hourValue = 0;
// //             const hourComment = currentLine.comments?.[idx] || "";

// //             return {
// //               Ts_Date: dateInfo.apiDate,
// //               Hours: hourValue,
// //               CreatedBy: String(currentUser?.name),
// //               UpdatedBy: String(currentUser?.name),
// //               comment: hourComment,
// //               Comment: hourComment,
// //             };
// //           }),
// //         };

// //         promises.push(
// //           fetch(`${API_BASE_URL}/api/SubkTimesheet`, {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify(payload),
// //           }),
// //         );
// //       } else {
// //         // B. Existing Line Property Change (PUT)
// //         const isLineChanged =
// //           currentLine.payType !== initialLine.payType ||
// //           currentLine.workOrder !== initialLine.workOrder ||
// //           currentLine.wa_Code !== initialLine.wa_Code ||
// //           currentLine.description !== initialLine.description;

// //         if (isLineChanged) {
// //           const updatePayload = {
// //             lineNo: currentLine.id,
// //             description: currentLine.description,
// //             projId: currentLine.project,
// //             plc: currentLine.plc,
// //             payType: currentLine.payType,
// //             poNumber: currentLine.poNumber,
// //             rlseNumber: currentLine.rlseNumber,
// //             resource_Id: String(userId),
// //             pm_User_Id: currentLine.pmUserID,
// //             poLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,
// //             rvsnNumber: 0,
// //             timesheet_Date: new Date(timesheetData.Date)
// //               .toISOString()
// //               .split("T")[0],
// //             workOrder: currentLine.wa_Code,
// //             updatedAt: now,
// //             updatedBy: String(currentUser?.name),
// //             createdBy: String(currentUser?.name),
// //             createdAt: timesheetDetails?.createdAt || now,
// //             hours: 0,
// //             status: timesheetData.Status || "OPEN",
// //             UpdateReason: reason,
// //           };

// //           promises.push(
// //             fetch(`${API_BASE_URL}/api/SubkTimesheet/${currentLine.id}`, {
// //               method: "PUT",
// //               headers: { "Content-Type": "application/json" },
// //               body: JSON.stringify(updatePayload),
// //             }),
// //           );
// //         }

// //         // C. Existing Hour Change (TimesheetHours upsert)
// //         Object.keys(currentLine.hours).forEach((idx) => {
// //           const initialHour = initialLine.hours[idx];
// //           const currentHour = currentLine.hours[idx];
// //           const initialComment = initialLine.comments?.[idx] || "";
// //           const currentComment = currentLine.comments?.[idx] || "";

// //           if (
// //             String(initialHour) !== String(currentHour) ||
// //             String(initialComment) !== String(currentComment)
// //           ) {
// //             const hourId = currentLine.hourIds[idx];
// //             let hourValue = parseFloat(currentHour);

// //             if (isNaN(hourValue)) hourValue = 0;

// //             const url = `${API_BASE_URL}/api/TimesheetHours/upsert`;
// //             const payload = {
// //               id: hourId || 0,
// //               ts_Date: periodDates[idx].apiDate,
// //               hours: hourValue,
// //               lineNo: currentLine.id,
// //               CreatedBy: String(currentUser?.name),
// //               UpdatedBy: String(currentUser?.name),
// //               comment: currentComment || reason || updateReason || "",
// //               Comment: currentComment || reason || updateReason || "",
// //             };

// //             promises.push(
// //               fetch(url, {
// //                 method: "POST",
// //                 headers: { "Content-Type": "application/json" },
// //                 body: JSON.stringify(payload),
// //               }),
// //             );
// //           }
// //         });
// //       }
// //     });

// //     if (promises.length === 0) {
// //       showToast("No changes to save.", "info");
// //       setIsCurrentlySaving(false);
// //       return;
// //     }

// //     try {
// //       const responses = await Promise.all(promises);

// //       for (const response of responses) {
// //         if (!response.ok) {
// //           const errorText = await response.text();
// //           throw new Error(`Failed to save changes: ${errorText}`);
// //         }
// //       }

// //       showToast("Timesheet saved successfully!", "success");
// //       onSave();
// //       setIsCurrentlySaving(false);
// //     } catch (error) {
// //       showToast(error.message, "error");
// //       console.error("Save error:", error);
// //       setIsCurrentlySaving(false);
// //     }
// //   };
// //   // const handleSave = async (reason = "") => {
// //   //   setIsCurrentlySaving(true);

// //   //   setShowReasonPrompt(false); // Close prompt modal

// //   //   setUpdateReason(""); // Reset reason field

// //   //   const invalidDay = Object.values(dailyTotals).find(
// //   //     (val) => val > maxDailyHours,
// //   //   );

// //   //   if (invalidDay) {
// //   //     showToast(
// //   //       `Save failed: Total hours for one or more days exceed ${maxDailyHours}.`,
// //   //       "error",
// //   //     );
// //   //     setIsCurrentlySaving(false);
// //   //     return;
// //   //   }

// //   //   const promises = [];

// //   //   const API_BASE_URL = backendUrl;

// //   //   const isOnlyDeletion = lines.length === 0 && linesToDelete.length > 0;

// //   //   // if (!isOnlyDeletion && grandTotal === 0) {
// //   //   //   showToast("Cannot save a timesheet with zero hours.", "warning");
// //   //   //   setIsCurrentlySaving(false);
// //   //   //   return;
// //   //   // }

// //   //   const now = new Date().toISOString();

// //   //   const resourceId = timesheetData["Employee ID"];

// //   //   const currentUserName = String(resourceId); // 1. Deletions

// //   //   linesToDelete.forEach((id) => {
// //   //     if (typeof id === "number" || !String(id).startsWith("temp-")) {
// //   //       promises.push(
// //   //         fetch(
// //   //           `${API_BASE_URL}/api/SubkTimesheet/${id}?reason=${encodeURIComponent(
// //   //             reason,
// //   //           )}`,
// //   //           { method: "DELETE" },
// //   //         ),
// //   //       );
// //   //     }
// //   //   }); // 2. New Lines (POST) / Existing Lines (PUT/Hours Upsert)

// //   //   lines.forEach((currentLine) => {
// //   //     const initialLine = initialLines.find((l) => l.id === currentLine.id);

// //   //     const totalHours = Object.values(currentLine.hours).reduce(
// //   //       (s, h) => s + (parseFloat(h) || 0),
// //   //       0,
// //   //     ); // A. New Line (POST)

// //   //     if (!initialLine) {
// //   //       if (totalHours > 0) {
// //   //         const payload = {
// //   //           Description: currentLine.description || "New Timesheet Line",

// //   //           ProjId: currentLine.project || "",

// //   //           Plc: currentLine.plc || "",

// //   //           PayType: currentLine.payType || "SR",

// //   //           PoNumber: currentLine.poNumber || "0000",

// //   //           RlseNumber: currentLine.rlseNumber || "0",

// //   //           Resource_Id: String(resourceId),

// //   //           WorkOrder: currentLine.wa_Code,

// //   //           Pm_User_Id: currentLine.pmUserID || "",

// //   //           PoLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,

// //   //           Timesheet_Date: new Date(timesheetData.Date)
// //   //             .toISOString()
// //   //             .split("T")[0],

// //   //           CreatedBy: String(resourceId), // Existing line property payload uses resourceId

// //   //           UpdatedAt: now,

// //   //           UpdatedBy: String(resourceId), // Existing line property payload uses resourceId

// //   //           UpdateReason: reason,

// //   //           TimesheetHours: periodDates.map((dateInfo, idx) => {
// //   //             let hourValue = parseFloat(currentLine.hours[idx]);

// //   //             if (isNaN(hourValue)) hourValue = 0;

// //   //             return {
// //   //               Ts_Date: dateInfo.apiDate,
// //   //               Hours: hourValue,
// //   //               CreatedBy: currentUserName,
// //   //               UpdatedBy: currentUserName,
// //   //             };
// //   //           }),
// //   //         };

// //   //         promises.push(
// //   //           fetch(`${API_BASE_URL}/api/SubkTimesheet`, {
// //   //             method: "POST",
// //   //             headers: { "Content-Type": "application/json" },
// //   //             body: JSON.stringify(payload),
// //   //           }),
// //   //         );
// //   //       }

// //   //       return;
// //   //     } // B. Existing Line Property Change (PUT)

// //   //     const isLineChanged =
// //   //       currentLine.payType !== initialLine.payType ||
// //   //       currentLine.workOrder !== initialLine.workOrder ||
// //   //       currentLine.wa_Code !== initialLine.wa_Code ||
// //   //       currentLine.description !== initialLine.description;

// //   //     if (isLineChanged) {
// //   //       const updatePayload = {
// //   //         lineNo: currentLine.id,

// //   //         description: currentLine.description,

// //   //         projId: currentLine.project,

// //   //         plc: currentLine.plc,

// //   //         payType: currentLine.payType,

// //   //         poNumber: currentLine.poNumber,

// //   //         rlseNumber: currentLine.rlseNumber,

// //   //         resource_Id: String(resourceId),

// //   //         pm_User_Id: currentLine.pmUserID,

// //   //         poLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,

// //   //         rvsnNumber: 0,

// //   //         timesheet_Date: new Date(timesheetData.Date)
// //   //           .toISOString()
// //   //           .split("T")[0],

// //   //         workOrder: currentLine.wa_Code,

// //   //         updatedAt: now,

// //   //         updatedBy: String(resourceId),

// //   //         createdBy: String(resourceId),

// //   //         createdAt: timesheetDetails?.createdAt || now,

// //   //         hours: 0,

// //   //         status: timesheetData.Status || "OPEN",

// //   //         UpdateReason: reason,
// //   //       };

// //   //       promises.push(
// //   //         fetch(`${API_BASE_URL}/api/SubkTimesheet/${currentLine.id}`, {
// //   //           method: "PUT",
// //   //           headers: { "Content-Type": "application/json" },
// //   //           body: JSON.stringify(updatePayload),
// //   //         }),
// //   //       );
// //   //     } // C. Existing Hour Change (TimesheetHours upsert)

// //   //     Object.keys(currentLine.hours).forEach((idx) => {
// //   //       const initialHour = initialLine.hours[idx];

// //   //       const currentHour = currentLine.hours[idx];

// //   //       if (String(initialHour) !== String(currentHour)) {
// //   //         const hourId = currentLine.hourIds[idx];

// //   //         let hourValue = parseFloat(currentHour);

// //   //         if (isNaN(hourValue)) hourValue = 0;

// //   //         const url = `${API_BASE_URL}/api/TimesheetHours/upsert`;

// //   //         const payload = {
// //   //           id: hourId || 0,

// //   //           ts_Date: periodDates[idx].apiDate,

// //   //           hours: hourValue,

// //   //           lineNo: currentLine.id,
// //   //           CreatedBy: currentUserName,
// //   //           UpdatedBy: currentUserName,
// //   //         };

// //   //         promises.push(
// //   //           fetch(url, {
// //   //             method: "POST",
// //   //             headers: { "Content-Type": "application/json" },
// //   //             body: JSON.stringify(payload),
// //   //           }),
// //   //         );
// //   //       }
// //   //     });
// //   //   });

// //   //   if (promises.length === 0) {
// //   //     showToast("No changes to save.", "info");
// //   //     setIsCurrentlySaving(false);
// //   //     return;
// //   //   }

// //   //   try {
// //   //     const responses = await Promise.all(promises);

// //   //     for (const response of responses) {
// //   //       if (!response.ok) {
// //   //         const errorText = await response.text();

// //   //         throw new Error(`Failed to save changes: ${errorText}`);
// //   //       }
// //   //     }

// //   //     showToast("Timesheet saved successfully!", "success");

// //   //     onSave();

// //   //     setIsCurrentlySaving(false);
// //   //   } catch (error) {
// //   //     showToast(error.message, "error");

// //   //     console.error("Save error:", error);

// //   //     setIsCurrentlySaving(false);
// //   //   }
// //   // };

// //   const isLineDisabled = (line) => {
// //     if (!isEditable) return true;

// //     if (timesheetData?.Status?.toUpperCase() === "CORRECTION")
// //       return line.isInvoiced === true;

// //     return false;
// //   };

// //   if (isLoading) return <div className="text-center p-8">Loading...</div>;

// //   const workOrderOptions = Array.from(
// //     new Map(
// //       purchaseOrderData.flatMap((item) =>
// //         (item.resourceDesc || []).map((desc) => {
// //           const label = `${item.wa_Code} - ${desc}`;
// //           return [label, { value: label, label: label }];
// //         }),
// //       ),
// //     ).values(),
// //   );

// //   const availableHideableColumns = hideableColumns.filter((col) =>
// //     col === "PO Remaining Hours" ? isAdmin : true,
// //   );

// //   const hiddenCount = Object.entries(hiddenColumns).filter(
// //     ([key, val]) => val && (key === "PO Remaining Hours" ? isAdmin : true),
// //   ).length;

// //   const hiddenColumnsList = Object.entries(hiddenColumns)
// //     .filter(
// //       ([col, isHidden]) =>
// //         isHidden && (col === "PO Remaining Hours" ? isAdmin : true),
// //     )
// //     .map(([col]) => col);

// //   return (
// //     <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 w-full max-w-[95vw] font-inter">
// //       {/* {showReasonPrompt && (
// //         <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] shadow-2xl border border-gray-100 animate-premium-popup">
// //           <div className="mb-4">
// //             <h3 className="text-base font-bold text-gray-900 mb-3">
// //               Reason for Timesheet Update
// //             </h3>
// //             <textarea
// //               rows="3"
// //               className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs text-black"
// //               value={updateReason}
// //               onChange={(e) => setUpdateReason(e.target.value)}
// //               placeholder="E.g., Corrected hours for Monday, switched project code."
// //             />
// //             <div className="mt-4 flex justify-end gap-2">
// //               <ActionButton
// //                 onClick={() => {
// //                   setShowReasonPrompt(false);
// //                   setUpdateReason("");
// //                   setIsCurrentlySaving(false);
// //                 }}
// //               >
// //                 Cancel
// //               </ActionButton>
// //               <ActionButton
// //                 onClick={() => handleSave(updateReason)}
// //                 disabled={!updateReason.trim() || isCurrentlySaving}
// //               >
// //                 {isCurrentlySaving ? "Saving..." : "Confirm & Save"}
// //               </ActionButton>
// //             </div>
// //           </div>
// //         </div>
// //       )} */}
// //       {showReasonPrompt && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
// //           <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] shadow-2xl border border-gray-100 animate-premium-popup">
// //             <div className="mb-4">
// //               <h3 className="text-base font-bold text-gray-900 mb-3">
// //                 Reason for Timesheet Update
// //               </h3>
// //               <textarea
// //                 rows="3"
// //                 className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs text-black"
// //                 value={updateReason}
// //                 onChange={(e) => setUpdateReason(e.target.value)}
// //                 placeholder="E.g., Corrected hours for Monday, switched project code."
// //               />
// //               <div className="mt-4 flex justify-end gap-2">
// //                 <ActionButton
// //                   onClick={() => {
// //                     setShowReasonPrompt(false);
// //                     setUpdateReason("");
// //                     setIsCurrentlySaving(false);
// //                   }}
// //                 >
// //                   Cancel
// //                 </ActionButton>
// //                 <ActionButton
// //                   onClick={() => handleSave(updateReason)}
// //                   disabled={!updateReason.trim() || isCurrentlySaving}
// //                 >
// //                   {isCurrentlySaving ? "Saving..." : "Confirm & Save"}
// //                 </ActionButton>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //       <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
// //         <div className="flex flex-col">
// //           <h2 className="text-lg font-bold text-gray-800 mb-1">
// //             Timesheet Details
// //           </h2>
// //           {timesheetDetails && (
// //             <div className="flex gap-4 text-xs text-black flex-wrap font-medium">
// //               <div>
// //                 <span className="font-semibold text-gray-700">Status:</span>{" "}
// //                 <span className="font-bold text-[#17414d]">
// //                   {timesheetData.Status
// //                     ? timesheetData.Status.charAt(0).toUpperCase() +
// //                     timesheetData.Status.slice(1).toLowerCase()
// //                     : "N/A"}
// //                 </span>
// //               </div>
// //               <div>
// //                 <span className="font-semibold text-gray-700">Date:</span>{" "}
// //                 {timesheetDetails?.timesheet_Date
// //                   ? formatDate(timesheetDetails.timesheet_Date)
// //                   : "N/A"}
// //               </div>
// //               <div>
// //                 <span className="font-semibold text-gray-700">
// //                   Approved By:
// //                 </span>{" "}
// //                 {timesheetDetails?.approvedBy || "N/A"}
// //               </div>
// //               <div>
// //                 <span className="font-semibold text-gray-700">
// //                   Approved Date:
// //                 </span>{" "}
// //                 {timesheetDetails?.approvedDate
// //                   ? formatDate(timesheetDetails.approvedDate)
// //                   : "N/A"}
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //         {isEditable && (
// //           <div className="flex items-center gap-2">
// //             <ActionButton
// //               onClick={addLine}
// //             //  icon={<PlusIcon />}
// //             >
// //               Add
// //             </ActionButton>
// //             <ActionButton
// //               onClick={copyLines}
// //               // icon={<CopyIcon />}
// //               disabled={selectedLines.size === 0}
// //             >
// //               Copy
// //             </ActionButton>
// //             {timesheetData?.Status?.toUpperCase() !== "CORRECTION" && (
// //               <ActionButton
// //                 onClick={deleteLines}
// //                 // icon={<TrashIcon />}
// //                 disabled={selectedLines.size === 0}
// //               >
// //                 Delete
// //               </ActionButton>
// //             )}
// //             <ActionButton onClick={onClose}>Cancel</ActionButton>
// //             {isEditable && (
// //               <ActionButton
// //                 onClick={handleSaveWithReasonPrompt}
// //                 disabled={isSaving || isCurrentlySaving}
// //               >
// //                 {isCurrentlySaving ? "Saving..." : "Save"}
// //               </ActionButton>
// //             )}
// //           </div>
// //         )}
// //       </div>

// //       {hiddenCount > 0 && (
// //         <div className="bg-[#e9f6fb] border border-blue-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3 flex-wrap mb-3">
// //           <div className="flex items-center gap-2">
// //             <EyeIcon className="h-4 w-4 text-blue-600" />
// //             <span className="text-xs font-medium text-gray-700">
// //               {hiddenCount} column{hiddenCount > 1 ? "s" : ""} hidden:
// //             </span>
// //           </div>
// //           <div className="flex gap-2 flex-wrap">
// //             {hiddenColumnsList.map((col) => (
// //               <button
// //                 key={col}
// //                 onClick={() => toggleColumnVisibility(col)}
// //                 className="inline-flex items-center px-2.5 py-1 bg-white hover:bg-blue-100 border border-blue-300 rounded-full text-xs font-medium text-blue-700 transition-colors shadow-sm cursor-pointer"
// //               >
// //                 {col}
// //               </button>
// //             ))}
// //             <button
// //               onClick={showAllHiddenColumns}
// //               className="btn1 btn-blue !py-0.5 !px-2.5 text-xs font-medium cursor-pointer"
// //             >
// //               Show All
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       <div className="overflow-x-auto rounded-lg border border-gray-300 scrollbar-thin">
// //         <table className="w-full text-xs min-w-[1600px] border-collapse">
// //           <thead className="sticky top-0 z-10">
// //             <tr>
// //               <th className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center w-10"></th>
// //               <th className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center w-12">
// //                 Line
// //               </th>
// //               {availableHideableColumns.map(
// //                 (col) =>
// //                   !hiddenColumns[col] && (
// //                     <th
// //                       key={col}
// //                       className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center"
// //                     >
// //                       <div className="flex items-center justify-between gap-2 group px-1">
// //                         <span className="flex-1 text-center">{col}</span>
// //                         <button
// //                           onClick={(e) => {
// //                             e.stopPropagation();
// //                             toggleColumnVisibility(col);
// //                           }}
// //                           className="p-1 hover:bg-blue-100 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
// //                           title="Hide column"
// //                           type="button"
// //                         >
// //                           <MinusCircleIcon className="h-3.5 w-3.5 text-gray-500 hover:text-gray-800" />
// //                         </button>
// //                       </div>
// //                     </th>
// //                   ),
// //               )}
// //               {periodDates.map((dateInfo) => (
// //                 <th
// //                   key={dateInfo.apiDate}
// //                   className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center min-w-[75px]"
// //                 >
// //                   {dateInfo.display}
// //                 </th>
// //               ))}
// //               <th className="px-2 py-1.5 whitespace-nowrap border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center">
// //                 Total
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody className="divide-y divide-gray-200 bg-white">
// //             {lines.map((line, index) => {
// //               const rowTotal = Object.values(line.hours)
// //                 .reduce((s, h) => s + (parseFloat(h) || 0), 0)
// //                 .toFixed(2);

// //               const isDisabled = isLineDisabled(line);

// //               return (
// //                 <tr
// //                   key={line.id}
// //                   className="hover:bg-sky-50/50 transition-colors"
// //                 >
// //                   <td className="px-2 py-1 text-center whitespace-nowrap border-r border-b border-gray-300">
// //                     <input
// //                       type="checkbox"
// //                       className={`rounded border-gray-300 ${!isEditable
// //                           ? "cursor-not-allowed opacity-50"
// //                           : "cursor-pointer accent-blue-600"
// //                         }`}
// //                       checked={selectedLines.has(line.id)}
// //                       onChange={() => handleSelectLine(line.id)}
// //                       disabled={!isEditable}
// //                     />
// //                   </td>
// //                   <td className="px-2 py-1 text-center whitespace-nowrap border-r border-b border-gray-300 text-black font-medium">
// //                     {index + 1}
// //                   </td>
// //                   {hideableColumns.includes("Work Order") &&
// //                     !hiddenColumns["Work Order"] && (
// //                       <td className="p-1 border-r border-b border-gray-300 min-w-[250px]">
// //                         <CascadingSelect
// //                           label="Work Order"
// //                           options={workOrderOptions}
// //                           value={line.workOrder}
// //                           onChange={(e) =>
// //                             handleSelectChange(
// //                               line.id,
// //                               "workOrder",
// //                               e.target.value,
// //                             )
// //                           }
// //                           disabled={isDisabled}
// //                         />
// //                       </td>
// //                     )}
// //                   {hideableColumns.includes("Description") &&
// //                     !hiddenColumns["Description"] && (
// //                       <td className="p-1 border-r border-b border-gray-300 min-w-[200px]">
// //                         <input
// //                           type="text"
// //                           value={line.description}
// //                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// //                           readOnly
// //                         />
// //                       </td>
// //                     )}
// //                   {/* {!hiddenColumns["Project"] && (
// //                     <td className="p-1 border-r border-b border-gray-300 min-w-[150px]">
// //                       <input
// //                         type="text"
// //                         value={line.project}
// //                         className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// //                         readOnly
// //                       />
// //                     </td>
// //                   )} */}
// //                   {hideableColumns.includes("Project") &&
// //                     !hiddenColumns["Project"] && (
// //                       <td className="p-1 border-r border-b border-gray-300 min-w-[150px]">
// //                         {role !== "fbsdusbcsdnjsbhasbx" ? (
// //                           <select
// //                             value={line.project}
// //                             onChange={(e) => {
// //                               const selectedProjId = e.target.value;
// //                               // Find matching entry from employeeProjects data to automatically map the billLabCatCd to plc
// //                               const matchedEntry = employeeProjects.find(
// //                                 (proj) => proj.projId === selectedProjId,
// //                               );

// //                               setLines((currentLines) =>
// //                                 currentLines.map((l) =>
// //                                   l.id === line.id
// //                                     ? {
// //                                       ...l,
// //                                       project: selectedProjId,
// //                                       projectName: matchedEntry
// //                                         ? matchedEntry.projectName
// //                                         : "",
// //                                       plc: matchedEntry
// //                                         ? matchedEntry.billLabCatCd
// //                                         : "",
// //                                       plcDesc: matchedEntry
// //                                         ? matchedEntry.plcDesc
// //                                         : "",
// //                                       pmUserID: matchedEntry
// //                                         ? matchedEntry.pm_UserId || ""
// //                                         : "",
// //                                     }
// //                                     : l,
// //                                 ),
// //                               );
// //                             }}
// //                             disabled={isDisabled}
// //                             className={`w-full bg-white px-2 py-1 text-xs border border-gray-300 rounded shadow-inner text-black ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
// //                               }`}
// //                           >
// //                             <option value="">Select Project</option>
// //                             {employeeProjects.map((proj) => (
// //                               <option key={proj.projId} value={proj.projId}>
// //                                 {proj.projId} (LabCat: {proj.billLabCatCd})
// //                               </option>
// //                             ))}
// //                           </select>
// //                         ) : (
// //                           <input
// //                             type="text"
// //                             value={line.project}
// //                             className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// //                             readOnly
// //                           />
// //                         )}
// //                       </td>
// //                     )}
// //                   {hideableColumns.includes("Project Name") &&
// //                     !hiddenColumns["Project Name"] && (
// //                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// //                         <input
// //                           type="text"
// //                           value={line.projectName}
// //                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// //                           readOnly
// //                         />
// //                       </td>
// //                     )}
// //                   {hideableColumns.includes("PLC") && !hiddenColumns["PLC"] && (
// //                     <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// //                       <input
// //                         type="text"
// //                         value={line.plc}
// //                         className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// //                         readOnly
// //                       />
// //                     </td>
// //                   )}
// //                   {hideableColumns.includes("PLC Description") &&
// //                     !hiddenColumns["PLC Description"] && (
// //                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// //                         <input
// //                           type="text"
// //                           value={line.plcDesc}
// //                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// //                           readOnly
// //                         />
// //                       </td>
// //                     )}
// //                   {hideableColumns.includes("Pay Type") &&
// //                     !hiddenColumns["Pay Type"] && (
// //                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// //                         <select
// //                           value={line.payType}
// //                           onChange={(e) =>
// //                             handleSelectChange(
// //                               line.id,
// //                               "payType",
// //                               e.target.value,
// //                             )
// //                           }
// //                           className={`w-full bg-white px-2 py-1 text-xs border border-gray-300 rounded shadow-inner text-black ${isDisabled
// //                               ? "bg-gray-100 text-gray-500 cursor-not-allowed"
// //                               : ""
// //                             }`}
// //                           disabled={isDisabled}
// //                         >
// //                           <option value="SR">Regular</option>
// //                           <option value="SO">Overtime</option>
// //                         </select>
// //                       </td>
// //                     )}
// //                   {hideableColumns.includes("PO Number") &&
// //                     !hiddenColumns["PO Number"] && (
// //                       <td className="p-1 border-r border-b border-gray-300 min-w-[150px]">
// //                         <input
// //                           type="text"
// //                           value={line.poNumber}
// //                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// //                           readOnly
// //                         />
// //                       </td>
// //                     )}
// //                   {hideableColumns.includes("RLSE Number") &&
// //                     !hiddenColumns["RLSE Number"] && (
// //                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// //                         <input
// //                           type="text"
// //                           value={line.rlseNumber}
// //                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// //                           readOnly
// //                         />
// //                       </td>
// //                     )}
// //                   {hideableColumns.includes("PO Line Number") &&
// //                     !hiddenColumns["PO Line Number"] && (
// //                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// //                         <input
// //                           type="text"
// //                           value={line.poLineNumber}
// //                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
// //                           readOnly
// //                         />
// //                       </td>
// //                     )}
// //                   {isAdmin &&
// //                     hideableColumns.includes("PO Remaining Hours") &&
// //                     !hiddenColumns["PO Remaining Hours"] && (
// //                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
// //                         {line.poLineNumber &&
// //                           remainingPoHours[String(line.poLineNumber).trim()] !==
// //                           undefined ? (
// //                           <div className="text-xs font-medium text-center">
// //                             <span
// //                               className={`font-semibold ${parseFloat(getRemainingHoursForLine(line)) < 0
// //                                   ? "text-red-600"
// //                                   : "text-green-600"
// //                                 }`}
// //                             >
// //                               {getRemainingHoursForLine(line)} hrs
// //                             </span>
// //                           </div>
// //                         ) : (
// //                           <div className="text-xs font-medium text-center text-gray-400">
// //                             -
// //                           </div>
// //                         )}
// //                       </td>
// //                     )}
// //                   {periodDates.map((dateInfo, dayIndex) => {
// //                     const days = [
// //                       "sunday",
// //                       "monday",
// //                       "tuesday",
// //                       "wednesday",
// //                       "thursday",
// //                       "friday",
// //                       "saturday",
// //                     ];
// //                     const dayIndexUtc = dateInfo.obj.getUTCDay();
// //                     const dayName = days[dayIndexUtc];
// //                     const isWeekend = configWeekends.includes(dayName);
// //                     const isFutureDate =
// //                       dateInfo.obj.getUTCFullYear() > today.getUTCFullYear() ||
// //                       (dateInfo.obj.getUTCFullYear() ===
// //                         today.getUTCFullYear() &&
// //                         dateInfo.obj.getUTCMonth() > today.getUTCMonth()) ||
// //                       (dateInfo.obj.getUTCFullYear() ===
// //                         today.getUTCFullYear() &&
// //                         dateInfo.obj.getUTCMonth() === today.getUTCMonth() &&
// //                         dateInfo.obj.getUTCDate() > today.getUTCDate());

// //                     const finalDisabled = isDisabled || isFutureDate;
// //                     const dayTotal = dailyTotals[dayIndex] || 0;
// //                     const exceededMax = dayTotal > maxDailyHours;

// //                     let inputClasses = `w-[72px] text-right pl-1.5 pr-6 py-1 text-xs border border-gray-300 rounded shadow-inner text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none `;
// //                     let inputStyle = {};

// //                     if (isWeekend && configHighlightColor) {
// //                       inputStyle.backgroundColor = configHighlightColor;
// //                     }
// //                     if (!inputStyle.backgroundColor && isWeekend) {
// //                       inputClasses += "bg-gray-100 ";
// //                     } else if (!inputStyle.backgroundColor) {
// //                       inputClasses += "bg-white ";
// //                     }

// //                     if (exceededMax) {
// //                       inputStyle.backgroundColor = "";
// //                       inputClasses = inputClasses
// //                         .replace("bg-gray-100", "")
// //                         .replace("bg-white", "");
// //                       inputClasses +=
// //                         "bg-red-100 border-red-500 text-red-800 font-bold ";
// //                     } else if (finalDisabled) {
// //                       inputClasses = inputClasses.replace("bg-white", "");
// //                       if (isWeekend && configHighlightColor) {
// //                         inputClasses = inputClasses.replace("bg-gray-100", "");
// //                       } else {
// //                         inputStyle.backgroundColor = "";
// //                         inputClasses += "bg-gray-100 ";
// //                       }
// //                       inputClasses += " text-gray-500 cursor-not-allowed ";
// //                     } else {
// //                       inputClasses +=
// //                         " focus:outline-none focus:ring-1 focus:ring-blue-500 ";
// //                     }

// //                     const dayComment = line.comments?.[dayIndex] || "";
// //                     const hasComment = Boolean(
// //                       dayComment && dayComment.trim() !== "",
// //                     );
// //                     let cellTitle = "";
// //                     if (hasComment) {
// //                       cellTitle = `Comment: ${dayComment}`;
// //                     }

// //                     return (
// //                       <td
// //                         key={dateInfo.apiDate}
// //                         className="p-1 border-r border-b border-gray-300 text-center"
// //                       >
// //                         <div className="relative inline-flex items-center group">
// //                           <input
// //                             type="number"
// //                             step="0.5"
// //                             value={
// //                               line.hours[dayIndex] === 0 ||
// //                               line.hours[dayIndex] === ""
// //                                 ? ""
// //                                 : line.hours[dayIndex]
// //                             }
// //                             onChange={(e) =>
// //                               handleHourChange(line.id, dayIndex, e.target.value)
// //                             }
// //                             title={cellTitle}
// //                             className={inputClasses}
// //                             style={inputStyle}
// //                             disabled={finalDisabled}
// //                           />
// //                           {/* Comment Icon button: interactive if isEditable or if existing comment */}
// //                           {(isEditable || hasComment) && (
// //                             <button
// //                               type="button"
// //                               onClick={() =>
// //                                 openCommentModal(
// //                                   line.id,
// //                                   dayIndex,
// //                                   dateInfo.display,
// //                                   !isEditable,
// //                                 )
// //                               }
// //                               className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded cursor-pointer transition-all ${
// //                                 hasComment
// //                                   ? "text-blue-600 opacity-100 hover:text-blue-800"
// //                                   : "text-gray-400 opacity-0 group-hover:opacity-80 hover:text-gray-700"
// //                               }`}
// //                             >
// //                               <CommentIcon className="w-3 h-3" />
// //                             </button>
// //                           )}
// //                           {/* Custom hover tooltip if comment exists - positioned BELOW cell to prevent top cutoff */}
// //                           {hasComment && (
// //                             <div className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-50 w-max max-w-[220px] p-2 bg-gray-900 text-white text-xs rounded shadow-lg pointer-events-none break-words text-left">
// //                               <span className="font-semibold text-sky-300 block text-[10px] uppercase tracking-wider">
// //                                 Comment:
// //                               </span>
// //                               <span className="block text-[11px] mt-0.5 whitespace-pre-wrap">
// //                                 {dayComment}
// //                               </span>
// //                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
// //                             </div>
// //                           )}
// //                         </div>
// //                       </td>
// //                     );
// //                   })}
// //                   <td className="px-2 py-1 text-right font-bold text-black border-b border-gray-300 pr-3">
// //                     {rowTotal}
// //                   </td>
// //                 </tr>
// //               );
// //             })}
// //           </tbody>
// //           <tfoot className="border-t-2 border-gray-300 bg-[#e5f3fb] font-semibold text-black text-xs">
// //             <tr>
// //               <td
// //                 colSpan={
// //                   2 +
// //                   availableHideableColumns.filter((col) => !hiddenColumns[col])
// //                     .length
// //                 }
// //                 className="px-3 py-2 text-right font-bold text-black border-r border-gray-300"
// //               >
// //                 Total Hours
// //               </td>
// //               {periodDates.map((_, idx) => (
// //                 <td
// //                   key={idx}
// //                   className="px-2 py-2 text-center border-r border-gray-300"
// //                 >
// //                   <div
// //                     className={`w-16 mx-auto ${dailyTotals[idx] > maxDailyHours
// //                         ? "text-red-700 font-bold"
// //                         : "text-black font-semibold"
// //                       }`}
// //                   >
// //                     {dailyTotals[idx] ? dailyTotals[idx].toFixed(2) : "0.00"}
// //                   </div>
// //                 </td>
// //               ))}
// //               <td className="px-3 py-2 text-right font-bold text-black pr-3">
// //                 {grandTotal.toFixed(2)}
// //               </td>
// //             </tr>
// //           </tfoot>
// //         </table>
// //       </div>

// //       {/* <div className="mt-4 flex justify-end gap-2">
// //         <ActionButton onClick={onClose}>Cancel</ActionButton>
// //         {isEditable && (
// //           <ActionButton
// //             onClick={handleSaveWithReasonPrompt}
// //             disabled={isSaving || isCurrentlySaving}
// //           >
// //             {isCurrentlySaving ? "Saving..." : "Save Changes"}
// //           </ActionButton>
// //         )}
// //       {/* Comment Popup Modal */}
// //       {commentModal.isOpen && (
// //         <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/40 p-4">
// //           <div className="bg-white rounded-lg p-5 w-full max-w-md shadow-xl border border-gray-200 animate-in fade-in duration-150">
// //             <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
// //               <div className="flex items-center gap-2">
// //                 <CommentIcon className="w-4 h-4 text-[#1e3a5f]" />
// //                 <h3 className="text-sm font-bold text-gray-900">
// //                   {commentModal.isReadOnly ? "View Hour Comment" : "Hour Comment"}
// //                   {commentModal.dateLabel ? ` (${commentModal.dateLabel})` : ""}
// //                 </h3>
// //               </div>
// //               <button
// //                 type="button"
// //                 onClick={closeCommentModal}
// //                 className="text-gray-400 hover:text-gray-700 text-lg font-bold leading-none p-1 cursor-pointer"
// //               >
// //                 &times;
// //               </button>
// //             </div>

// //             <div className="space-y-2 mb-4">
// //               <label className="block text-xs font-semibold text-gray-700">
// //                 Comment for {commentModal.dateLabel || "selected date"}:
// //               </label>
// //               <textarea
// //                 rows={4}
// //                 disabled={commentModal.isReadOnly}
// //                 value={commentModal.comment}
// //                 onChange={(e) =>
// //                   setCommentModal((prev) => ({
// //                     ...prev,
// //                     comment: e.target.value,
// //                   }))
// //                 }
// //                 placeholder={
// //                   commentModal.isReadOnly
// //                     ? "No comment added."
// //                     : "Enter comment / note for this day's hours..."
// //                 }
// //                 className={`w-full text-xs p-2.5 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
// //                   commentModal.isReadOnly
// //                     ? "bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300"
// //                     : "bg-white text-black border-gray-300"
// //                 }`}
// //                 autoFocus={!commentModal.isReadOnly}
// //               />
// //             </div>

// //             <div className="flex items-center justify-between pt-3 border-t border-gray-200">
// //               <div>
// //                 {!commentModal.isReadOnly && commentModal.comment && (
// //                   <button
// //                     type="button"
// //                     onClick={() => saveComment("")}
// //                     className="text-xs text-red-600 hover:text-red-800 hover:underline font-medium cursor-pointer"
// //                   >
// //                     Clear Comment
// //                   </button>
// //                 )}
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 <ActionButton
// //                   onClick={closeCommentModal}
// //                   className="!text-xs"
// //                 >
// //                   {commentModal.isReadOnly ? "Close" : "Cancel"}
// //                 </ActionButton>
// //                 {!commentModal.isReadOnly && (
// //                   <ActionButton
// //                     onClick={() => saveComment(commentModal.comment)}
// //                     className="!text-xs"
// //                   >
// //                     Save Comment
// //                   </ActionButton>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { backendUrl } from "./config";

// // --- SVG Icons ---
// const CommentIcon = ({ className = "h-4 w-4" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className={className}
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//     />
//   </svg>
// );
// const PlusIcon = ({ className = "h-4 w-4" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className={className}
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     {" "}
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//     />{" "}
//   </svg>
// );

// const CopyIcon = ({ className = "h-4 w-4" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className={className}
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     {" "}
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
//     />{" "}
//   </svg>
// );

// const TrashIcon = ({ className = "h-4 w-4" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className={className}
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     {" "}
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//     />{" "}
//   </svg>
// );

// const EyeIcon = ({ className = "h-4 w-4" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className={className}
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     {" "}
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//     />{" "}
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//     />{" "}
//   </svg>
// );

// const XIcon = ({ className = "h-4 w-4" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className={className}
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     {" "}
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M6 18L18 6M6 6l12 12"
//     />{" "}
//   </svg>
// );

// const MinusCircleIcon = ({ className = "h-4 w-4" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className={className}
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     {" "}
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
//     />{" "}
//   </svg>
// );

// // --- ActionButton Component ---

// const ActionButton = ({
//   children,
//   onClick,
//   icon,
//   className = "",
//   disabled = false,
// }) => {
//   const buttonStyle = disabled
//     ? "btn1 btn-inactive opacity-60 cursor-not-allowed"
//     : "btn1 btn-blue cursor-pointer";

//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`${buttonStyle} inline-flex items-center gap-1.5 text-xs font-semibold ${className}`}
//     >
//       {icon && <span>{icon}</span>}
//       {children}
//     </button>
//   );
// };

// // --- Toast Notification (Updated Duration) ---

// const showToast = (message, type = "info", duration = 3000) => {
//   const toast = document.createElement("div");

//   const typeClasses = {
//     success: "bg-green-500",
//     error: "bg-red-500",
//     warning: "bg-yellow-500 text-black",
//     info: "bg-blue-500",
//   };

//   toast.className = `fixed top-5 right-5 p-4 rounded-md text-white shadow-lg z-[10000] ${
//     typeClasses[type] || typeClasses["info"]
//   }`;

//   toast.textContent = message;

//   document.body.appendChild(toast);

//   setTimeout(() => {
//     if (document.body.contains(toast)) {
//       document.body.removeChild(toast);
//     }
//   }, duration);
// };

// const createEmptyLine = (id, periodLength) => {
//   const emptyHours = {};
//   const emptyComments = {};

//   for (let i = 0; i < periodLength; i++) {
//     emptyHours[i] = 0;
//     emptyComments[i] = "";
//   }

//   return {
//     id,
//     description: "",
//     project: "",
//     plc: "",
//     workOrder: "",
//     wa_Code: "",
//     pmUserID: "",
//     payType: "SR",

//     poNumber: "",
//     rlseNumber: "",
//     poLineNumber: "",
//     hours: emptyHours,
//     hourIds: {},
//     comments: emptyComments,
//     isInvoiced: false,
//   };
// };

// const CascadingSelect = ({
//   label,
//   options,
//   value,
//   onChange,
//   disabled = false,
// }) => (
//   <select
//     value={value}
//     onChange={onChange}
//     disabled={disabled}
//     className={`w-full bg-white px-2 py-1 text-xs border border-gray-300 rounded shadow-inner text-black focus:outline-none focus:ring-1 focus:ring-blue-500 ${
//       disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
//     }`}
//   >
//     <option value="">Select {label}</option>
//     {options.map((opt) => (
//       <option key={opt.value} value={opt.value}>
//         {opt.label}
//       </option>
//     ))}
//   </select>
// );

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

// const getPeriodData = (endDateStr, frequency) => {
//   // --- CRITICAL CHANGE: Parse MM/DD/YYYY format for endDateStr ---
//   const dateOnlyString = endDateStr.split("T")[0];
//   const parts = dateOnlyString.split(/[-\/]/).map(Number); // Handles both MM/DD/YYYY and YYYY-MM-DD formats more flexibly

//   let year, monthIndex, day;
//   if (parts.length === 3) {
//     // Determine format based on typical display order vs ISO order (heuristically, assuming YYYY is large)
//     if (parts[0] > 31 && parts[0] > 1900) {
//       // Assumes YYYY-MM-DD format (ISO)
//       year = parts[0];
//       monthIndex = parts[1] - 1;
//       day = parts[2];
//     } else {
//       // Assumes MM/DD/YYYY format (Display)
//       monthIndex = parts[0] - 1;
//       day = parts[1];
//       year = parts[2];
//     }
//   } else {
//     // Fallback or handle invalid input
//     return [];
//   } // Construct the Date object explicitly in UTC to ensure no local timezone offset

//   const end = new Date(Date.UTC(year, monthIndex, day)); // --- Rest of the logic remains UTC-safe ---
//   const dates = [];
//   const freq = frequency ? frequency.toLowerCase() : "weekly";

//   const numOpt = { month: "2-digit", day: "2-digit", timeZone: "UTC" };
//   const txtOpt = { month: "short", day: "2-digit", timeZone: "UTC" };

//   const getFmt = (d) => {
//     if (freq === "monthly" || freq === "semi-monthly")
//       return new Intl.DateTimeFormat("en-US", txtOpt).format(d);
//     return new Intl.DateTimeFormat("en-US", numOpt).format(d);
//   }; // This ensures the output date for API remains YYYY-MM-DD
//   const getApiFmt = (d) => d.toISOString().split("T")[0]; // Use 'end' date which is now correctly set to UTC midnight for the calendar date

//   let start = new Date(end); // start is also a UTC date for the end day

//   if (freq === "weekly") {
//     // Setting date on a UTC Date object is safe and keeps it in UTC context
//     start.setUTCDate(end.getUTCDate() - 6);
//   } else if (freq === "bi-weekly") {
//     start.setUTCDate(end.getUTCDate() - 13);
//   } else if (freq === "monthly") {
//     // Calculate start of month in UTC
//     start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));
//   } else if (freq === "semi-monthly") {
//     if (end.getUTCDate() <= 15) {
//       // Calculate start of 1st half of month in UTC
//       start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));
//     } else {
//       // Calculate start of 2nd half of month in UTC
//       start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 16));
//     }
//   } // Iterate using UTC date methods

//   for (
//     let d = new Date(start);
//     d.getTime() <= end.getTime();
//     d.setUTCDate(d.getUTCDate() + 1)
//   ) {
//     const currentDay = new Date(d); // Create a new object for each day
//     dates.push({
//       display: getFmt(currentDay),
//       apiDate: getApiFmt(currentDay),
//       obj: currentDay,
//     });
//   }

//   return dates;
// };

// const getDatesBetween = (startDateStr, endDateStr, frequency) => {
//   const startParts = startDateStr.split("T")[0].split("-").map(Number);
//   const endParts = endDateStr.split("T")[0].split("-").map(Number);

//   const start = new Date(
//     Date.UTC(startParts[0], startParts[1] - 1, startParts[2]),
//   );
//   const end = new Date(Date.UTC(endParts[0], endParts[1] - 1, endParts[2]));

//   const dates = [];
//   const freq = frequency ? frequency.toLowerCase() : "weekly";

//   const numOpt = { month: "2-digit", day: "2-digit", timeZone: "UTC" };
//   const txtOpt = { month: "short", day: "2-digit", timeZone: "UTC" };

//   const getFmt = (d) => {
//     if (freq === "monthly" || freq === "semi-monthly")
//       return new Intl.DateTimeFormat("en-US", txtOpt).format(d);
//     return new Intl.DateTimeFormat("en-US", numOpt).format(d);
//   };
//   const getApiFmt = (d) => d.toISOString().split("T")[0];

//   for (
//     let d = new Date(start);
//     d.getTime() <= end.getTime();
//     d.setUTCDate(d.getUTCDate() + 1)
//   ) {
//     const currentDay = new Date(d);
//     dates.push({
//       display: getFmt(currentDay),
//       apiDate: getApiFmt(currentDay),
//       obj: currentDay,
//     });
//   }

//   return dates;
// };

// const hideableColumns = [
//   "Work Order",
//   "Description",
//   "Project",
//   "PLC",
//   "Pay Type",

//   "PO Number",
//   "RLSE Number",
//   "PO Line Number",
//   "PO Remaining Hours",
// ];

// export default function TimesheetDetailModal({
//   timesheetData,
//   currentUser,
//   userId,
//   role,
//   onClose,

//   onSave,

//   isSaving,

//   isAdmin = false,
// }) {
//   const [lines, setLines] = useState([]);

//   const [selectedLines, setSelectedLines] = useState(new Set());

//   const [isLoading, setIsLoading] = useState(true);

//   const [purchaseOrderData, setPurchaseOrderData] = useState([]);
//   const [employeeProjects, setEmployeeProjects] = useState([]);

//   const [isEditable, setIsEditable] = useState(false);

//   const [initialLines, setInitialLines] = useState([]);

//   const [linesToDelete, setLinesToDelete] = useState([]);

//   const [isCurrentlySaving, setIsCurrentlySaving] = useState(false);

//   const [timesheetDetails, setTimesheetDetails] = useState(null);

//   // Comment Modal state for individual hour comments
//   const [commentModal, setCommentModal] = useState({
//     isOpen: false,
//     lineId: null,
//     dayIndex: null,
//     dateLabel: "",
//     comment: "",
//     isReadOnly: false,
//   });

//   // Floating hover tooltip state (position: fixed so it never causes table scrollbars or gets cut off)
//   const [hoveredComment, setHoveredComment] = useState(null);

//   const openCommentModal = (
//     lineId,
//     dayIndex,
//     dateLabel,
//     isReadOnly = false,
//   ) => {
//     const line = lines.find((l) => l.id === lineId);
//     const existingComment = line?.comments?.[dayIndex] || "";
//     setCommentModal({
//       isOpen: true,
//       lineId,
//       dayIndex,
//       dateLabel: dateLabel || `Day ${dayIndex + 1}`,
//       comment: existingComment,
//       isReadOnly,
//     });
//   };

//   const closeCommentModal = () => {
//     setCommentModal((prev) => ({ ...prev, isOpen: false }));
//   };

//   const saveComment = (newComment) => {
//     if (commentModal.lineId == null || commentModal.dayIndex == null) return;
//     const { lineId, dayIndex } = commentModal;
//     setLines((prevLines) =>
//       prevLines.map((line) =>
//         line.id === lineId
//           ? {
//               ...line,
//               comments: {
//                 ...(line.comments || {}),
//                 [dayIndex]: newComment,
//               },
//             }
//           : line,
//       ),
//     );
//     closeCommentModal();
//   };

//   // const [hiddenColumns, setHiddenColumns] = useState({
//   //   "Work Order": false,
//   //   Description: false,
//   //   Project: false,
//   //   PLC: false,
//   //   "Pay Type": false,

//   //   "PO Number": false,
//   //   "RLSE Number": false,
//   //   "PO Line Number": false,
//   //   "PO Remaining Hours": false,
//   // }); // Config States

//   // const role = currentUser?.role?.toLowerCase(); // Default role, can be dynamically set based on user context

//   console.log(timesheetData?.status);

//   // Define hideable columns conditionally based on the role
//   // const hideableColumns =
//   //   role === "user"
//   //     ? ["Project", "PLC", "Pay Type"]
//   //     : [
//   //         "Work Order",
//   //         "Description",
//   //         "Project",
//   //         "PLC",
//   //         "Pay Type",
//   //         "PO Number",
//   //         "RLSE Number",
//   //         "PO Line Number",
//   //         "PO Remaining Hours",
//   //       ];
//   const hideableColumns =
//     role === "fbsdusbcsdnjsbhasbx"
//       ? [
//           "Work Order",
//           "Description",
//           "Project",
//           "PLC",
//           "Pay Type",
//           "PO Number",
//           "RLSE Number",
//           "PO Line Number",
//           "PO Remaining Hours",
//         ]
//       : ["Project", "Project Name", "PLC", "PLC Description", "Pay Type"];

//   const [hiddenColumns, setHiddenColumns] = useState(() => {
//     const initial = {};
//     hideableColumns.forEach((col) => {
//       initial[col] = false;
//     });
//     return initial;
//   });

//   const [periodType, setPeriodType] = useState("Weekly");

//   const [configWeekends, setConfigWeekends] = useState([]);

//   const [configHighlightColor, setConfigHighlightColor] = useState("");

//   const [maxDailyHours, setMaxDailyHours] = useState(24);

//   const [hardEdit, setHardEdit] = useState(false); // Dynamic Dates

//   const periodDates = useMemo(() => {
//     if (!timesheetData?.Date) return [];

//     return getPeriodData(timesheetData.Date, periodType);
//   }, [timesheetData, periodType]);

//   const [remainingPoHours, setRemainingPoHours] = useState({});

//   const [isLoadingRemainingHours, setIsLoadingRemainingHours] = useState(false);

//   const [showReasonPrompt, setShowReasonPrompt] = useState(false);

//   const [updateReason, setUpdateReason] = useState("");

//   const nextId = useRef(0); // Global 'today' variable for future date check, set to midnight UTC // We keep this as UTC midnight for correct date part comparison.

//   //   const today = useMemo(() => {

//   //     const d = new Date();

//   //     return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

//   //   }, []);

//   const today = useMemo(() => {
//     const d = new Date(); // Get the current UTC date components
//     const year = d.getUTCFullYear();
//     const month = d.getUTCMonth();
//     const date = d.getUTCDate(); // Create a new Date object representing the start of the current UTC calendar day
//     return new Date(Date.UTC(year, month, date));
//   }, []); // 1. Fetch Config (Updated)

//   useEffect(() => {
//     if (role !== "fbsdusbcsdnjsbhasbx") {
//       const fetchEmployeeProjects = async () => {
//         try {
//           const response = await fetch(
//             // `${backendUrl}/api/user-projects/projects/${userId}`,
//             // `${backendUrl}/api/ProjEmployeeLabcat/employee/${currentUser?.name}`,
//             `${backendUrl}/api/ProjEmployeeLabcat/employee/${userId}`,
//           );
//           if (!response.ok)
//             throw new Error("Failed to fetch employee projects");
//           const data = await response.json();
//           if (Array.isArray(data)) {
//             setEmployeeProjects(data);
//           }
//         } catch (err) {
//           console.error("Error fetching employee projects:", err);
//         }
//       };
//       fetchEmployeeProjects();
//     }
//   }, [role]);

//   useEffect(() => {
//     const fetchConfig = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/api/ConfigValues`);

//         if (!response.ok) throw new Error("Failed to fetch config");

//         const data = await response.json();

//         const getConfigValue = (name) =>
//           data.find((item) => item.name?.toLowerCase() === name)?.value;

//         const periodConfig = getConfigValue("timesheet_period");

//         const weekendConfig = getConfigValue("weekend");

//         const colorConfig = getConfigValue("weekend_highlight_color");

//         const maxDailyHoursConfig = getConfigValue("max_daily_hours");

//         const hardEditConfig = getConfigValue("hard_edit");

//         if (periodConfig) setPeriodType(periodConfig);

//         if (weekendConfig) {
//           const days = weekendConfig
//             .split(",")
//             .map((d) => d.trim().toLowerCase());

//           setConfigWeekends(days);
//         }

//         if (colorConfig) setConfigHighlightColor(colorConfig);

//         if (maxDailyHoursConfig)
//           setMaxDailyHours(parseFloat(maxDailyHoursConfig) || 24);

//         if (hardEditConfig)
//           setHardEdit(hardEditConfig.toLowerCase() === "true");
//       } catch (error) {
//         console.error("Config fetch error:", error);

//         setPeriodType("Weekly"); // Fallback

//         setConfigWeekends(["saturday", "sunday"]); // Fallback

//         setConfigHighlightColor("#e5e7eb"); // Fallback

//         setMaxDailyHours(24); // Fallback

//         setHardEdit(false); // Fallback
//       }
//     };

//     fetchConfig();
//   }, []); // 2. Check Editability

//   useEffect(() => {
//     if (timesheetData) {
//       const status = timesheetData.Status?.toUpperCase();

//       setIsEditable(
//         status === "OPEN" || status === "REJECTED" || status === "CORRECTION",
//       );
//     }
//   }, [timesheetData]); // 3. Fetch PO Remaining Hours

//   useEffect(() => {
//     if (!timesheetData || !timesheetData["Employee ID"]) return;

//     const fetchRemainingHours = async () => {
//       setIsLoadingRemainingHours(true);

//       const API_URL = `${backendUrl}/api/SubkTimesheet/GetRemainingPoHours?resourceId=${timesheetData["Employee ID"]}`;

//       try {
//         const response = await fetch(API_URL);

//         if (!response.ok) throw new Error(`HTTP error!`);

//         const data = await response.json();

//         const hoursMap = {};

//         if (Array.isArray(data)) {
//           data.forEach((item) => {
//             const poLineNum = String(
//               item.poLineNumber || item.PoLineNumber || "",
//             ).trim();

//             if (poLineNum)
//               hoursMap[poLineNum] = parseFloat(
//                 item.remainingHours || item.RemainingHours || 0,
//               );
//           });
//         }

//         setRemainingPoHours(hoursMap);
//       } catch (error) {
//       } finally {
//         setIsLoadingRemainingHours(false);
//       }
//     };

//     fetchRemainingHours();
//   }, [timesheetData]); // 4. Fetch Details & Map to Dynamic Period

//   useEffect(() => {
//     // Only fetch details once we have the correct Period Type loaded

//     if (periodDates.length === 0) return;

//     fetchTimesheetDetails();
//   }, [periodDates]);

//   //   const fetchTimesheetDetails = async () => {

//   //     setIsLoading(true);

//   //     try {

//   //       const response = await fetch(`${backendUrl}/api/SubkTimesheet/ByResource/${timesheetData["Employee ID"]}`);

//   //       if (!response.ok) throw new Error("Failed to fetch timesheet details");

//   //       const data = await response.json();

//   //       const poResponse = await fetch(`${backendUrl}/api/PurchaseOrders/ByResourceDetails/${timesheetData["Employee ID"]}`);

//   //       if (!poResponse.ok) throw new Error("Failed to fetch purchase order details");

//   //       const poData = await poResponse.json();

//   //       const poDataArray = Array.isArray(poData) ? poData : [];

//   //       setPurchaseOrderData(poDataArray);

//   //       const dataArray = Array.isArray(data) ? data : [];

//   //       const filteredData = dataArray.filter((item) => formatDate(item.timesheet_Date) === timesheetData.Date);

//   //       if (filteredData.length > 0) {

//   //         setTimesheetDetails(filteredData[0]);

//   //       }

//   //       const mappedLines = filteredData.map((item) => {

//   //         const hoursData = {};

//   //         const hourIdsData = {};

//   //         periodDates.forEach((_, index) => { hoursData[index] = 0; });

//   //         let isLineInvoiced = false;

//   //         if (item.timesheetHours) {

//   //           item.timesheetHours.forEach((hourEntry) => {

//   //             if (hourEntry.invoiceGenerated === true) isLineInvoiced = true;

//   //             const entryDateStr = hourEntry.ts_Date.split("T")[0];

//   //             const dateIndex = periodDates.findIndex(d => d.apiDate === entryDateStr);

//   //             if (dateIndex !== -1) {

//   //               hoursData[dateIndex] = hourEntry.hours;

//   //               hourIdsData[dateIndex] = hourEntry.id;

//   //             }

//   //           });

//   //         }

//   //         let fullWorkOrderString = "";

//   //         const poEntry = poDataArray.find((po) => po.project?.includes(item.projId));

//   //         if (poEntry) {

//   //           const projectIndex = poEntry.project.indexOf(item.projId);

//   //           if (projectIndex > -1) {

//   //             fullWorkOrderString = `${poEntry.wa_Code} - ${poEntry.resourceDesc[projectIndex]}`;

//   //           }

//   //         }

//   //         return {

//   //           id: item.lineNo, description: item.description || "", project: item.projId || "",

//   //           plc: item.plc || "", payType: item.payType || "SR", workOrder: fullWorkOrderString,

//   //           wa_Code: poEntry?.wa_Code || "", pmUserID: poEntry?.pmUserId || "",

//   //           poNumber: item.poNumber || "", rlseNumber: item.rlseNumber || "",

//   //           poLineNumber: item.poLineNumber || "",

//   //           hours: hoursData, hourIds: hourIdsData, isInvoiced: isLineInvoiced,

//   //         };

//   //       });

//   //       setLines(mappedLines);

//   //       setInitialLines(JSON.parse(JSON.stringify(mappedLines)));

//   //     } catch (error) {

//   //       showToast(error.message, "error");

//   //     } finally {

//   //       setIsLoading(false);

//   //     }

//   //   };

//   const fetchTimesheetDetails = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `${backendUrl}/api/SubkTimesheet/ByResource/${timesheetData["Employee ID"]}`,
//       );
//       if (!response.ok) throw new Error("Failed to fetch timesheet details");
//       const data = await response.json();

//       const poResponse = await fetch(
//         `${backendUrl}/api/PurchaseOrders/ByResourceDetails/${timesheetData["Employee ID"]}`,
//       );
//       if (!poResponse.ok)
//         throw new Error("Failed to fetch purchase order details");
//       const poData = await poResponse.json();
//       const poDataArray = Array.isArray(poData) ? poData : [];
//       setPurchaseOrderData(poDataArray);

//       const dataArray = Array.isArray(data) ? data : []; // --- START: FIX FOR TIMEZONE-INDEPENDENT DATE COMPARISON ---

//       const normalizeTargetDate = (dateString) => {
//         // Assuming timesheetData.Date is in 'MM/DD/YYYY' format from the grid (based on formatDate output)
//         const parts = dateString.split("/");
//         if (parts.length === 3) {
//           // Converts MM/DD/YYYY to YYYY-MM-DD
//           return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(
//             2,
//             "0",
//           )}`;
//         } // Fallback for an ISO-like string
//         return dateString.split("T")[0];
//       };

//       const normalizedTimesheetDate = normalizeTargetDate(timesheetData.Date);

//       // const filteredData = dataArray.filter((item) => {
//       //   // item.timesheet_Date is typically an ISO string from the API (e.g., '2025-10-12T00:00:00')
//       //   const itemDateOnly = item.timesheet_Date.split("T")[0]; // Direct string comparison (YYYY-MM-DD) bypasses local timezone issues
//       //   return itemDateOnly === normalizedTimesheetDate;
//       // });
//       const filteredData = dataArray.filter((item) => {
//         const itemDateOnly = item.timesheet_Date.split("T")[0];
//         const matchesDate = itemDateOnly === normalizedTimesheetDate;

//         const isProjectManager =
//           currentUser?.role?.toUpperCase() === "PROJECT MANAGER" ||
//           currentUser?.role === "PM";

//         // Filter by userId if userId is provided/available
//         const matchesUser =
//           isProjectManager && userId
//             ? String(item.pm_User_Id || item.pm_User_Id || "") ===
//               String(currentUser?.name)
//             : true;

//         return matchesDate && matchesUser;
//       });

//       // --- END: FIX FOR TIMEZONE-INDEPENDENT DATE COMPARISON ---

//       if (filteredData.length > 0) {
//         setTimesheetDetails(filteredData[0]);
//       }

//       const mappedLines = filteredData.map((item) => {
//         const hoursData = {};

//         const hourIdsData = {};
//         const commentsData = {};

//         periodDates.forEach((_, index) => {
//           hoursData[index] = 0;
//           commentsData[index] = "";
//         });

//         let isLineInvoiced = false;

//         if (item.timesheetHours) {
//           item.timesheetHours.forEach((hourEntry) => {
//             if (hourEntry.invoiceGenerated === true) isLineInvoiced = true;

//             const entryDateStr = hourEntry.ts_Date.split("T")[0];

//             const dateIndex = periodDates.findIndex(
//               (d) => d.apiDate === entryDateStr,
//             );

//             if (dateIndex !== -1) {
//               hoursData[dateIndex] = hourEntry.hours;

//               hourIdsData[dateIndex] = hourEntry.id;

//               commentsData[dateIndex] =
//                 hourEntry.comment || hourEntry.Comment || "";
//             }
//           });
//         }

//         let fullWorkOrderString = "";

//         const poEntry = poDataArray.find((po) =>
//           po.project?.includes(item.projId),
//         );

//         if (poEntry) {
//           const projectIndex = poEntry.project.indexOf(item.projId);

//           if (projectIndex > -1) {
//             fullWorkOrderString = `${poEntry.wa_Code} - ${poEntry.resourceDesc[projectIndex]}`;
//           }
//         }

//         return {
//           id: item.lineNo,
//           description: item.description || "",
//           project: item.projId || "",
//           projectName: item?.projectName || "",
//           plc: item.plc || "",
//           plcDesc: item?.plcDesc || "",
//           payType: item.payType || "SR",
//           workOrder: fullWorkOrderString,

//           wa_Code: poEntry?.wa_Code || "",
//           pmUserID: poEntry?.pmUserId || "",

//           poNumber: item.poNumber || "",
//           rlseNumber: item.rlseNumber || "",

//           poLineNumber: item.poLineNumber || "",

//           hours: hoursData,
//           hourIds: hourIdsData,
//           comments: commentsData,
//           isInvoiced: isLineInvoiced,
//         };
//       });

//       setLines(mappedLines);

//       setInitialLines(JSON.parse(JSON.stringify(mappedLines)));
//     } catch (error) {
//       showToast(error.message, "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSelectChange = (id, fieldName, value) => {
//     setLines((currentLines) =>
//       currentLines.map((line) => {
//         if (line.id === id) {
//           let updatedLine = { ...line, [fieldName]: value };

//           if (fieldName === "workOrder") {
//             if (!value) {
//               const emptyLine = createEmptyLine(id, periodDates.length);

//               return { ...emptyLine, id: line.id };
//             }

//             const splitIndex = value.indexOf(" - ");

//             const waCode =
//               splitIndex > -1 ? value.substring(0, splitIndex) : value;

//             const desc = splitIndex > -1 ? value.substring(splitIndex + 3) : "";

//             const selectedWorkOrderData = purchaseOrderData.find(
//               (item) =>
//                 item.wa_Code === waCode &&
//                 (item.resourceDesc || []).includes(desc),
//             );

//             if (selectedWorkOrderData) {
//               updatedLine.wa_Code = selectedWorkOrderData.wa_Code || "";

//               updatedLine.pmUserID = selectedWorkOrderData.pmUserId || "";

//               const descIndex =
//                 selectedWorkOrderData.resourceDesc.indexOf(desc);

//               if (descIndex > -1) {
//                 updatedLine.description = desc || "";

//                 updatedLine.project =
//                   selectedWorkOrderData.project[descIndex] || "";

//                 updatedLine.plc = selectedWorkOrderData.plcCd[descIndex] || "";

//                 updatedLine.poNumber =
//                   selectedWorkOrderData.purchaseOrder[0] || "";

//                 updatedLine.rlseNumber =
//                   selectedWorkOrderData.purchaseOrderRelease[0] || "";

//                 updatedLine.poLineNumber =
//                   selectedWorkOrderData.poLineNumber[descIndex] || "";
//               }
//             } else {
//               const emptyLine = createEmptyLine(id, periodDates.length);

//               return { ...emptyLine, id: line.id };
//             }
//           }

//           return updatedLine;
//         }

//         return line;
//       }),
//     );
//   };

//   const handleHourChange = (id, dayIndex, value) => {
//     // FIX: Preserve current value as empty string or 0 in state if input is empty
//     if (value === "") {
//       setLines((currentLines) =>
//         currentLines.map((line) =>
//           line.id === id
//             ? { ...line, hours: { ...line.hours, [dayIndex]: "" } }
//             : line,
//         ),
//       );
//       return;
//     }

//     const numValue = parseFloat(value);
//     let isValid = true;
//     let toastMessage = "";
//     let toastType = "warning"; // Default for soft checks
//     let isPOExceeded = false;
//     let isMaxDailyExceeded = false;
//     const currentLine = lines.find((line) => line.id === id);

//     const status = timesheetData.Status?.toUpperCase();
//     const allowNegativeHours = status === "CORRECTION" || status === "REJECTED";

//     if (isNaN(numValue)) {
//       isValid = false;
//       toastType = "error";
//       toastMessage = "Hours must be a number.";
//     } else if (!allowNegativeHours && numValue < 0) {
//       // Block negative numbers ONLY if not in Correction/Rejected status
//       isValid = false;
//       toastType = "error";
//       toastMessage =
//         "Hours cannot be negative unless correcting a rejected timesheet.";
//     } else if (numValue % 0.5 !== 0) {
//       isValid = false;
//       toastType = "error";
//       toastMessage = "Hours must be in 0.5 increments.";
//     } else {
//       // Start complex checks only if base validation passed
//       // **VALIDATION 2: PO Remaining Hours (Conditional based on hardEdit) - CHECKED FIRST**
//       if (currentLine && currentLine.poLineNumber) {
//         const poLineNumber = String(currentLine.poLineNumber).trim();
//         const remainingHours = remainingPoHours[poLineNumber];

//         if (remainingHours !== undefined) {
//           // Calculate the impact of the new hour value (synchronized calculation)
//           const tempLines = lines.map((line) =>
//             line.id === id
//               ? { ...line, hours: { ...line.hours, [dayIndex]: numValue } }
//               : line,
//           );
//           const allLinesWithSamePO = tempLines.filter(
//             (l) => String(l.poLineNumber).trim() === poLineNumber,
//           );

//           const totalNewHoursForPO = allLinesWithSamePO.reduce((sum, l) => {
//             const initialLine = initialLines.find((init) => init.id === l.id);
//             const currentUITotal = Object.values(l.hours).reduce(
//               (s, h) => s + (parseFloat(h) || 0),
//               0,
//             );
//             const initialTotal = initialLine
//               ? Object.values(initialLine.hours).reduce(
//                   (s, h) => s + (parseFloat(h) || 0),
//                   0,
//                 )
//               : 0;
//             return sum + (currentUITotal - initialTotal);
//           }, 0);

//           if (totalNewHoursForPO > remainingHours) {
//             isPOExceeded = true;

//             if (!hardEdit) {
//               // HARD STOP (Blocking entry)
//               isValid = false;
//               toastType = "error";
//               toastMessage = `Disabled: Cannot exceed remaining PO hours (${remainingHours.toFixed(
//                 2,
//               )} available for PO Line ${poLineNumber}).`;
//             } else {
//               // SOFT WARNING (Allowing entry)
//               // Set initial soft warning message
//               toastMessage = `PO hours exceeded. ${remainingHours.toFixed(
//                 2,
//               )} hours available for PO Line ${poLineNumber}.`;
//               toastType = "warning";
//             }
//           }
//         }
//       } // **VALIDATION 3: Max Daily Hours (Configurable) - CHECKED SECOND** // Check only if we haven't hit a hard stop already (isValid is still true from base/PO check)

//       if (isValid) {
//         const otherLinesTotal = lines
//           .filter((line) => line.id !== id)
//           .reduce(
//             (sum, line) => sum + (parseFloat(line.hours[dayIndex]) || 0),
//             0,
//           );

//         const newDailyTotal = otherLinesTotal + numValue;

//         if (newDailyTotal > maxDailyHours) {
//           isMaxDailyExceeded = true; // Max Daily limit is always a hard block
//           isValid = false;
//           toastType = "error"; // SYNCED MESSAGE LOGIC:
//           const maxDailyError = `Daily total hours exceed the maximum limit of ${maxDailyHours}.`;
//           if (isPOExceeded && hardEdit) {
//             // PO was soft-warned, but Max Daily is a hard fail. Use the Warning structure from Line component.
//             // The hard fail (isValid=false) means this message will be shown as an ERROR toast.
//             toastMessage = `${maxDailyError} Also, PO hours exceeded.`;
//           } else {
//             // Max Daily is the only issue, or PO was already a hard fail.
//             toastMessage = `Disabled: ${maxDailyError}`;
//           }
//         }
//       }
//     } // Determine toast duration (5 seconds for soft warnings, 3 seconds for blocks)

//     const toastDuration = isValid && isPOExceeded && hardEdit ? 5000 : 3000;

//     if (isValid) {
//       setLines((currentLines) =>
//         currentLines.map((line) =>
//           line.id === id
//             ? { ...line, hours: { ...line.hours, [dayIndex]: numValue } }
//             : line,
//         ),
//       ); // Show soft warning if an input was allowed but exceeded a soft limit (hardEdit=true PO limit)
//       if (isPOExceeded && hardEdit) {
//         showToast(toastMessage, toastType, toastDuration);
//       }
//     } else {
//       // Input blocked by a hard-error
//       showToast(toastMessage, toastType, toastDuration); // Revert value to the previous state
//       setLines((currentLines) =>
//         currentLines.map((line) =>
//           line.id === id
//             ? {
//                 ...line,
//                 hours: { ...line.hours, [dayIndex]: line.hours[dayIndex] },
//               }
//             : line,
//         ),
//       );
//     }
//   };

//   const getRemainingHoursForLine = (line) => {
//     if (!line.poLineNumber) return null;

//     const poLineNumStr = String(line.poLineNumber).trim();

//     const remaining = remainingPoHours[poLineNumStr];

//     if (remaining === undefined) return null;

//     const allLinesWithSamePO = lines.filter(
//       (l) => String(l.poLineNumber).trim() === poLineNumStr,
//     );

//     const totalNewHoursForPO = allLinesWithSamePO.reduce((sum, l) => {
//       const initialLine = initialLines.find((init) => init.id === l.id);

//       const currentUITotal = Object.values(l.hours).reduce(
//         (s, h) => s + (parseFloat(h) || 0),
//         0,
//       );

//       const initialTotal = initialLine
//         ? Object.values(initialLine.hours).reduce(
//             (s, h) => s + (parseFloat(h) || 0),
//             0,
//           )
//         : 0;

//       return sum + (currentUITotal - initialTotal);
//     }, 0);

//     return (remaining - totalNewHoursForPO).toFixed(2);
//   };

//   const addLine = () =>
//     setLines((prev) => [
//       ...prev,
//       createEmptyLine(`temp-${Date.now()}`, periodDates.length),
//     ]);

//   const handleSelectLine = (id) => {
//     const newSelection = new Set(selectedLines);

//     newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);

//     setSelectedLines(newSelection);
//   };

//   const deleteLines = () => {
//     if (selectedLines.size === 0) {
//       showToast("Please select lines to delete.", "warning");
//       return;
//     }

//     if (timesheetData.Status?.toUpperCase() === "REJECTED") {
//       showToast(
//         "For rejected timesheets, hours will be zeroed out upon saving.",
//         "info",
//       );

//       setLines((currentLines) =>
//         currentLines.map((line) =>
//           selectedLines.has(line.id)
//             ? {
//                 ...line,
//                 hours: Object.keys(line.hours).reduce(
//                   (acc, k) => ({ ...acc, [k]: 0 }),
//                   {},
//                 ),
//               }
//             : line,
//         ),
//       );
//     } else {
//       setLines((currentLines) => {
//         const idsToDelete = [...selectedLines].filter(
//           (id) => typeof id === "number" || !String(id).startsWith("temp-"),
//         );

//         if (idsToDelete.length > 0)
//           setLinesToDelete((prev) => [...new Set([...prev, ...idsToDelete])]);

//         return currentLines.filter((line) => !selectedLines.has(line.id));
//       });
//     }

//     setSelectedLines(new Set());
//   }; // Correct Dynamic Totals

//   const dailyTotals = useMemo(() => {
//     if (periodDates.length === 0) return {};

//     const totals = {};

//     periodDates.forEach((_, index) => {
//       totals[index] = 0;
//     });

//     lines.forEach((line) => {
//       Object.keys(line.hours).forEach((idx) => {
//         totals[idx] = (totals[idx] || 0) + (parseFloat(line.hours[idx]) || 0);
//       });
//     });

//     return totals;
//   }, [lines, periodDates]);

//   const copyLines = () => {
//     if (selectedLines.size === 0) {
//       showToast("Please select lines to copy.", "warning");
//       return;
//     }

//     const linesToCopy = lines.filter((line) => selectedLines.has(line.id));

//     const potentialTotals = { ...dailyTotals };

//     let validationFailed = false;

//     linesToCopy.forEach((lineToCopy) => {
//       Object.keys(lineToCopy.hours).forEach((idx) => {
//         potentialTotals[idx] =
//           (potentialTotals[idx] || 0) +
//           (parseFloat(lineToCopy.hours[idx]) || 0);

//         if (potentialTotals[idx] > maxDailyHours) validationFailed = true;
//       });
//     });

//     if (validationFailed) {
//       showToast(
//         `Cannot copy, as it would cause a daily total to exceed ${maxDailyHours} hours.`,
//         "error",
//       );
//       return;
//     }

//     showToast("Line(s) copied.", "info");

//     const newLines = linesToCopy.map((line, index) => ({
//       ...line,
//       hours: { ...line.hours },
//       comments: { ...(line.comments || {}) },
//       id: `temp-${Date.now()}-${index}`,
//       hourIds: {},
//     }));

//     setLines((prev) => [...prev, ...newLines]);

//     setSelectedLines(new Set());
//   };

//   const grandTotal = Object.values(dailyTotals).reduce(
//     (sum, total) => sum + total,
//     0,
//   );

//   const toggleColumnVisibility = (columnName) => {
//     setHiddenColumns((prev) => ({ ...prev, [columnName]: !prev[columnName] }));
//   };

//   const showAllHiddenColumns = () => {
//     const allVisible = {};
//     Object.keys(hiddenColumns).forEach((col) => {
//       allVisible[col] = false;
//     });
//     setHiddenColumns(allVisible);
//   };
//   const hasChangesToExistingData = useMemo(() => {
//     // Check for deletions of existing lines (lines with numeric IDs)

//     if (
//       linesToDelete.some(
//         (id) => typeof id === "number" || !String(id).startsWith("temp-"),
//       )
//     ) {
//       return true;
//     } // Check for changes to existing lines or hours

//     for (const currentLine of lines) {
//       // Only check lines that existed initially (non-temp IDs)

//       if (
//         typeof currentLine.id === "number" ||
//         !String(currentLine.id).startsWith("temp-")
//       ) {
//         const initialLine = initialLines.find((l) => l.id === currentLine.id);

//         if (!initialLine) continue; // Should not happen for existing lines // 1. Check line property changes

//         const isLineChanged =
//           currentLine.payType !== initialLine.payType ||
//           currentLine.workOrder !== initialLine.workOrder ||
//           currentLine.wa_Code !== initialLine.wa_Code ||
//           currentLine.description !== initialLine.description;

//         if (isLineChanged) return true; // 2. Check hour changes

//         for (const idx of Object.keys(currentLine.hours)) {
//           // Use '===' comparison for primitive values after initial load normalization

//           if (
//             String(currentLine.hours[idx]) !== String(initialLine.hours[idx])
//           ) {
//             return true;
//           }

//           // Check comment changes
//           if (
//             String(currentLine.comments?.[idx] || "") !==
//             String(initialLine.comments?.[idx] || "")
//           ) {
//             return true;
//           }
//         }
//       }
//     }

//     return false;
//   }, [lines, initialLines, linesToDelete]);

//   const handleSaveWithReasonPrompt = () => {
//     const invalidDay = Object.values(dailyTotals).find(
//       (val) => val > maxDailyHours,
//     );

//     if (invalidDay) {
//       showToast(
//         `Save failed: Total hours for one or more days exceed ${maxDailyHours}.`,
//         "error",
//       );
//       return;
//     }

//     const currentStatus = timesheetData?.status
//       ? timesheetData.status.toUpperCase()
//       : "";
//     const isOpen = currentStatus === "OPEN";

//     // If status is OPEN, skip the reason prompt completely and save directly
//     if (isOpen) {
//       handleSave("");
//       return;
//     }

//     const linesToPost = lines.filter((line) =>
//       String(line.id).startsWith("temp-"),
//     );

//     // Otherwise, show the prompt for REJECTED, CORRECTION, or other statuses
//     if (
//       linesToPost.length > 0 ||
//       hasChangesToExistingData ||
//       linesToDelete.length > 0
//     ) {
//       setShowReasonPrompt(true);
//     } else {
//       handleSave("");
//     }
//   };

//   const handleSave = async (reason = "") => {
//     // if (
//     //   timesheetData?.status.toUpperCase() === "REJECTED" ||
//     //   timesheetData?.status.toUpperCase() === "CORRECTION"
//     // ) {
//     //   setShowReasonPrompt(false);
//     // }

//     setIsCurrentlySaving(true);
//     setShowReasonPrompt(false);
//     setUpdateReason("");

//     const invalidDay = Object.values(dailyTotals).find(
//       (val) => val > maxDailyHours,
//     );

//     if (invalidDay) {
//       showToast(
//         `Save failed: Total hours for one or more days exceed ${maxDailyHours}.`,
//         "error",
//       );
//       setIsCurrentlySaving(false);
//       return;
//     }

//     const promises = [];
//     const API_BASE_URL = backendUrl;
//     const now = new Date().toISOString();
//     const resourceId = timesheetData["Employee ID"];
//     const currentUserName = String(resourceId);

//     // 1. Deletions
//     linesToDelete.forEach((id) => {
//       if (typeof id === "number" || !String(id).startsWith("temp-")) {
//         promises.push(
//           fetch(
//             `${API_BASE_URL}/api/SubkTimesheet/${id}?reason=${encodeURIComponent(
//               reason,
//             )}`,
//             { method: "DELETE" },
//           ),
//         );
//       }
//     });

//     // 2. Process Lines (New and Existing)
//     lines.forEach((currentLine) => {
//       const initialLine = initialLines.find((l) => l.id === currentLine.id);

//       const totalHours = Object.values(currentLine.hours).reduce(
//         (s, h) => s + (parseFloat(h) || 0),
//         0,
//       );

//       // A. New Line (POST)
//       if (!initialLine) {
//         // if (totalHours <= 0) {
//         //   showToast(
//         //     "Cannot save a new line with zero or negative hours.",
//         //     "warning",
//         //   );
//         //   setIsCurrentlySaving(false);
//         //   return;
//         // }

//         const payload = {
//           Description: currentLine.description || "New Timesheet Line",
//           ProjId: currentLine.project || "",
//           Plc: currentLine.plc || "",
//           PayType: currentLine.payType || "SR",
//           PoNumber: currentLine.poNumber || "0000",
//           RlseNumber: currentLine.rlseNumber || "0",
//           Resource_Id: String(userId),
//           WorkOrder: currentLine.wa_Code,
//           Pm_User_Id: currentLine.pmUserID || "",
//           PoLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,
//           Timesheet_Date: new Date(timesheetData.Date)
//             .toISOString()
//             .split("T")[0],
//           CreatedBy: String(currentUser?.name),
//           UpdatedAt: now,
//           UpdatedBy: String(currentUser?.name),
//           UpdateReason: reason,
//           TimesheetHours: periodDates.map((dateInfo, idx) => {
//             let hourValue = parseFloat(currentLine.hours[idx]);
//             if (isNaN(hourValue)) hourValue = 0;
//             const hourComment = currentLine.comments?.[idx] || "";

//             return {
//               Ts_Date: dateInfo.apiDate,
//               Hours: hourValue,
//               CreatedBy: String(currentUser?.name),
//               UpdatedBy: String(currentUser?.name),
//               comment: hourComment,
//               Comment: hourComment,
//             };
//           }),
//         };

//         promises.push(
//           fetch(`${API_BASE_URL}/api/SubkTimesheet`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//           }),
//         );
//       } else {
//         // B. Existing Line Property Change (PUT)
//         const isLineChanged =
//           currentLine.payType !== initialLine.payType ||
//           currentLine.workOrder !== initialLine.workOrder ||
//           currentLine.wa_Code !== initialLine.wa_Code ||
//           currentLine.description !== initialLine.description;

//         if (isLineChanged) {
//           const updatePayload = {
//             lineNo: currentLine.id,
//             description: currentLine.description,
//             projId: currentLine.project,
//             plc: currentLine.plc,
//             payType: currentLine.payType,
//             poNumber: currentLine.poNumber,
//             rlseNumber: currentLine.rlseNumber,
//             resource_Id: String(userId),
//             pm_User_Id: currentLine.pmUserID,
//             poLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,
//             rvsnNumber: 0,
//             timesheet_Date: new Date(timesheetData.Date)
//               .toISOString()
//               .split("T")[0],
//             workOrder: currentLine.wa_Code,
//             updatedAt: now,
//             updatedBy: String(currentUser?.name),
//             createdBy: String(currentUser?.name),
//             createdAt: timesheetDetails?.createdAt || now,
//             hours: 0,
//             status: timesheetData.Status || "OPEN",
//             UpdateReason: reason,
//           };

//           promises.push(
//             fetch(`${API_BASE_URL}/api/SubkTimesheet/${currentLine.id}`, {
//               method: "PUT",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(updatePayload),
//             }),
//           );
//         }

//         // C. Existing Hour Change (TimesheetHours upsert)
//         Object.keys(currentLine.hours).forEach((idx) => {
//           const initialHour = initialLine.hours[idx];
//           const currentHour = currentLine.hours[idx];
//           const initialComment = initialLine.comments?.[idx] || "";
//           const currentComment = currentLine.comments?.[idx] || "";

//           if (
//             String(initialHour) !== String(currentHour) ||
//             String(initialComment) !== String(currentComment)
//           ) {
//             const hourId = currentLine.hourIds[idx];
//             let hourValue = parseFloat(currentHour);

//             if (isNaN(hourValue)) hourValue = 0;

//             const url = `${API_BASE_URL}/api/TimesheetHours/upsert`;
//             const payload = {
//               id: hourId || 0,
//               ts_Date: periodDates[idx].apiDate,
//               hours: hourValue,
//               lineNo: currentLine.id,
//               CreatedBy: String(currentUser?.name),
//               UpdatedBy: String(currentUser?.name),
//               comment: currentComment || reason || updateReason || "",
//               Comment: currentComment || reason || updateReason || "",
//             };

//             promises.push(
//               fetch(url, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload),
//               }),
//             );
//           }
//         });
//       }
//     });

//     if (promises.length === 0) {
//       showToast("No changes to save.", "info");
//       setIsCurrentlySaving(false);
//       return;
//     }

//     try {
//       const responses = await Promise.all(promises);

//       for (const response of responses) {
//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Failed to save changes: ${errorText}`);
//         }
//       }

//       showToast("Timesheet saved successfully!", "success");
//       onSave();
//       setIsCurrentlySaving(false);
//     } catch (error) {
//       showToast(error.message, "error");
//       console.error("Save error:", error);
//       setIsCurrentlySaving(false);
//     }
//   };
//   // const handleSave = async (reason = "") => {
//   //   setIsCurrentlySaving(true);

//   //   setShowReasonPrompt(false); // Close prompt modal

//   //   setUpdateReason(""); // Reset reason field

//   //   const invalidDay = Object.values(dailyTotals).find(
//   //     (val) => val > maxDailyHours,
//   //   );

//   //   if (invalidDay) {
//   //     showToast(
//   //       `Save failed: Total hours for one or more days exceed ${maxDailyHours}.`,
//   //       "error",
//   //     );
//   //     setIsCurrentlySaving(false);
//   //     return;
//   //   }

//   //   const promises = [];

//   //   const API_BASE_URL = backendUrl;

//   //   const isOnlyDeletion = lines.length === 0 && linesToDelete.length > 0;

//   //   // if (!isOnlyDeletion && grandTotal === 0) {
//   //   //   showToast("Cannot save a timesheet with zero hours.", "warning");
//   //   //   setIsCurrentlySaving(false);
//   //   //   return;
//   //   // }

//   //   const now = new Date().toISOString();

//   //   const resourceId = timesheetData["Employee ID"];

//   //   const currentUserName = String(resourceId); // 1. Deletions

//   //   linesToDelete.forEach((id) => {
//   //     if (typeof id === "number" || !String(id).startsWith("temp-")) {
//   //       promises.push(
//   //         fetch(
//   //           `${API_BASE_URL}/api/SubkTimesheet/${id}?reason=${encodeURIComponent(
//   //             reason,
//   //           )}`,
//   //           { method: "DELETE" },
//   //         ),
//   //       );
//   //     }
//   //   }); // 2. New Lines (POST) / Existing Lines (PUT/Hours Upsert)

//   //   lines.forEach((currentLine) => {
//   //     const initialLine = initialLines.find((l) => l.id === currentLine.id);

//   //     const totalHours = Object.values(currentLine.hours).reduce(
//   //       (s, h) => s + (parseFloat(h) || 0),
//   //       0,
//   //     ); // A. New Line (POST)

//   //     if (!initialLine) {
//   //       if (totalHours > 0) {
//   //         const payload = {
//   //           Description: currentLine.description || "New Timesheet Line",

//   //           ProjId: currentLine.project || "",

//   //           Plc: currentLine.plc || "",

//   //           PayType: currentLine.payType || "SR",

//   //           PoNumber: currentLine.poNumber || "0000",

//   //           RlseNumber: currentLine.rlseNumber || "0",

//   //           Resource_Id: String(resourceId),

//   //           WorkOrder: currentLine.wa_Code,

//   //           Pm_User_Id: currentLine.pmUserID || "",

//   //           PoLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,

//   //           Timesheet_Date: new Date(timesheetData.Date)
//   //             .toISOString()
//   //             .split("T")[0],

//   //           CreatedBy: String(resourceId), // Existing line property payload uses resourceId

//   //           UpdatedAt: now,

//   //           UpdatedBy: String(resourceId), // Existing line property payload uses resourceId

//   //           UpdateReason: reason,

//   //           TimesheetHours: periodDates.map((dateInfo, idx) => {
//   //             let hourValue = parseFloat(currentLine.hours[idx]);

//   //             if (isNaN(hourValue)) hourValue = 0;

//   //             return {
//   //               Ts_Date: dateInfo.apiDate,
//   //               Hours: hourValue,
//   //               CreatedBy: currentUserName,
//   //               UpdatedBy: currentUserName,
//   //             };
//   //           }),
//   //         };

//   //         promises.push(
//   //           fetch(`${API_BASE_URL}/api/SubkTimesheet`, {
//   //             method: "POST",
//   //             headers: { "Content-Type": "application/json" },
//   //             body: JSON.stringify(payload),
//   //           }),
//   //         );
//   //       }

//   //       return;
//   //     } // B. Existing Line Property Change (PUT)

//   //     const isLineChanged =
//   //       currentLine.payType !== initialLine.payType ||
//   //       currentLine.workOrder !== initialLine.workOrder ||
//   //       currentLine.wa_Code !== initialLine.wa_Code ||
//   //       currentLine.description !== initialLine.description;

//   //     if (isLineChanged) {
//   //       const updatePayload = {
//   //         lineNo: currentLine.id,

//   //         description: currentLine.description,

//   //         projId: currentLine.project,

//   //         plc: currentLine.plc,

//   //         payType: currentLine.payType,

//   //         poNumber: currentLine.poNumber,

//   //         rlseNumber: currentLine.rlseNumber,

//   //         resource_Id: String(resourceId),

//   //         pm_User_Id: currentLine.pmUserID,

//   //         poLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,

//   //         rvsnNumber: 0,

//   //         timesheet_Date: new Date(timesheetData.Date)
//   //           .toISOString()
//   //           .split("T")[0],

//   //         workOrder: currentLine.wa_Code,

//   //         updatedAt: now,

//   //         updatedBy: String(resourceId),

//   //         createdBy: String(resourceId),

//   //         createdAt: timesheetDetails?.createdAt || now,

//   //         hours: 0,

//   //         status: timesheetData.Status || "OPEN",

//   //         UpdateReason: reason,
//   //       };

//   //       promises.push(
//   //         fetch(`${API_BASE_URL}/api/SubkTimesheet/${currentLine.id}`, {
//   //           method: "PUT",
//   //           headers: { "Content-Type": "application/json" },
//   //           body: JSON.stringify(updatePayload),
//   //         }),
//   //       );
//   //     } // C. Existing Hour Change (TimesheetHours upsert)

//   //     Object.keys(currentLine.hours).forEach((idx) => {
//   //       const initialHour = initialLine.hours[idx];

//   //       const currentHour = currentLine.hours[idx];

//   //       if (String(initialHour) !== String(currentHour)) {
//   //         const hourId = currentLine.hourIds[idx];

//   //         let hourValue = parseFloat(currentHour);

//   //         if (isNaN(hourValue)) hourValue = 0;

//   //         const url = `${API_BASE_URL}/api/TimesheetHours/upsert`;

//   //         const payload = {
//   //           id: hourId || 0,

//   //           ts_Date: periodDates[idx].apiDate,

//   //           hours: hourValue,

//   //           lineNo: currentLine.id,
//   //           CreatedBy: currentUserName,
//   //           UpdatedBy: currentUserName,
//   //         };

//   //         promises.push(
//   //           fetch(url, {
//   //             method: "POST",
//   //             headers: { "Content-Type": "application/json" },
//   //             body: JSON.stringify(payload),
//   //           }),
//   //         );
//   //       }
//   //     });
//   //   });

//   //   if (promises.length === 0) {
//   //     showToast("No changes to save.", "info");
//   //     setIsCurrentlySaving(false);
//   //     return;
//   //   }

//   //   try {
//   //     const responses = await Promise.all(promises);

//   //     for (const response of responses) {
//   //       if (!response.ok) {
//   //         const errorText = await response.text();

//   //         throw new Error(`Failed to save changes: ${errorText}`);
//   //       }
//   //     }

//   //     showToast("Timesheet saved successfully!", "success");

//   //     onSave();

//   //     setIsCurrentlySaving(false);
//   //   } catch (error) {
//   //     showToast(error.message, "error");

//   //     console.error("Save error:", error);

//   //     setIsCurrentlySaving(false);
//   //   }
//   // };

//   const isLineDisabled = (line) => {
//     if (!isEditable) return true;

//     if (timesheetData?.Status?.toUpperCase() === "CORRECTION")
//       return line.isInvoiced === true;

//     return false;
//   };

//   if (isLoading) return <div className="text-center p-8">Loading...</div>;

//   const workOrderOptions = Array.from(
//     new Map(
//       purchaseOrderData.flatMap((item) =>
//         (item.resourceDesc || []).map((desc) => {
//           const label = `${item.wa_Code} - ${desc}`;
//           return [label, { value: label, label: label }];
//         }),
//       ),
//     ).values(),
//   );

//   const availableHideableColumns = hideableColumns.filter((col) =>
//     col === "PO Remaining Hours" ? isAdmin : true,
//   );

//   const hiddenCount = Object.entries(hiddenColumns).filter(
//     ([key, val]) => val && (key === "PO Remaining Hours" ? isAdmin : true),
//   ).length;

//   const hiddenColumnsList = Object.entries(hiddenColumns)
//     .filter(
//       ([col, isHidden]) =>
//         isHidden && (col === "PO Remaining Hours" ? isAdmin : true),
//     )
//     .map(([col]) => col);

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 w-full max-w-[95vw] font-inter">
//       {/* {showReasonPrompt && (
//         <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] shadow-2xl border border-gray-100 animate-premium-popup">
//           <div className="mb-4">
//             <h3 className="text-base font-bold text-gray-900 mb-3">
//               Reason for Timesheet Update
//             </h3>
//             <textarea
//               rows="3"
//               className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs text-black"
//               value={updateReason}
//               onChange={(e) => setUpdateReason(e.target.value)}
//               placeholder="E.g., Corrected hours for Monday, switched project code."
//             />
//             <div className="mt-4 flex justify-end gap-2">
//               <ActionButton
//                 onClick={() => {
//                   setShowReasonPrompt(false);
//                   setUpdateReason("");
//                   setIsCurrentlySaving(false);
//                 }}
//               >
//                 Cancel
//               </ActionButton>
//               <ActionButton
//                 onClick={() => handleSave(updateReason)}
//                 disabled={!updateReason.trim() || isCurrentlySaving}
//               >
//                 {isCurrentlySaving ? "Saving..." : "Confirm & Save"}
//               </ActionButton>
//             </div>
//           </div>
//         </div>
//       )} */}
//       {showReasonPrompt && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] shadow-2xl border border-gray-100 animate-premium-popup">
//             <div className="mb-4">
//               <h3 className="text-base font-bold text-gray-900 mb-3">
//                 Reason for Timesheet Update
//               </h3>
//               <textarea
//                 rows="3"
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs text-black"
//                 value={updateReason}
//                 onChange={(e) => setUpdateReason(e.target.value)}
//                 placeholder="E.g., Corrected hours for Monday, switched project code."
//               />
//               <div className="mt-4 flex justify-end gap-2">
//                 <ActionButton
//                   onClick={() => {
//                     setShowReasonPrompt(false);
//                     setUpdateReason("");
//                     setIsCurrentlySaving(false);
//                   }}
//                 >
//                   Cancel
//                 </ActionButton>
//                 <ActionButton
//                   onClick={() => handleSave(updateReason)}
//                   disabled={!updateReason.trim() || isCurrentlySaving}
//                 >
//                   {isCurrentlySaving ? "Saving..." : "Confirm & Save"}
//                 </ActionButton>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
//         <div className="flex flex-col">
//           <h2 className="text-lg font-bold text-gray-800 mb-1">
//             Timesheet Details
//           </h2>
//           {timesheetDetails && (
//             <div className="flex gap-4 text-xs text-black flex-wrap font-medium">
//               <div>
//                 <span className="font-semibold text-gray-700">Status:</span>{" "}
//                 <span className="font-bold text-[#17414d]">
//                   {timesheetData.Status
//                     ? timesheetData.Status.charAt(0).toUpperCase() +
//                       timesheetData.Status.slice(1).toLowerCase()
//                     : "N/A"}
//                 </span>
//               </div>
//               <div>
//                 <span className="font-semibold text-gray-700">Date:</span>{" "}
//                 {timesheetDetails?.timesheet_Date
//                   ? formatDate(timesheetDetails.timesheet_Date)
//                   : "N/A"}
//               </div>
//               <div>
//                 <span className="font-semibold text-gray-700">
//                   Approved By:
//                 </span>{" "}
//                 {timesheetDetails?.approvedBy || "N/A"}
//               </div>
//               <div>
//                 <span className="font-semibold text-gray-700">
//                   Approved Date:
//                 </span>{" "}
//                 {timesheetDetails?.approvedDate
//                   ? formatDate(timesheetDetails.approvedDate)
//                   : "N/A"}
//               </div>
//             </div>
//           )}
//         </div>
//         {isEditable && (
//           <div className="flex items-center gap-2">
//             <ActionButton
//               onClick={addLine}
//               //  icon={<PlusIcon />}
//             >
//               Add
//             </ActionButton>
//             <ActionButton
//               onClick={copyLines}
//               // icon={<CopyIcon />}
//               disabled={selectedLines.size === 0}
//             >
//               Copy
//             </ActionButton>
//             {timesheetData?.Status?.toUpperCase() !== "CORRECTION" && (
//               <ActionButton
//                 onClick={deleteLines}
//                 // icon={<TrashIcon />}
//                 disabled={selectedLines.size === 0}
//               >
//                 Delete
//               </ActionButton>
//             )}
//             <ActionButton onClick={onClose}>Cancel</ActionButton>
//             {isEditable && (
//               <ActionButton
//                 onClick={handleSaveWithReasonPrompt}
//                 disabled={isSaving || isCurrentlySaving}
//               >
//                 {isCurrentlySaving ? "Saving..." : "Save"}
//               </ActionButton>
//             )}
//           </div>
//         )}
//       </div>

//       {hiddenCount > 0 && (
//         <div className="bg-[#e9f6fb] border border-blue-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3 flex-wrap mb-3">
//           <div className="flex items-center gap-2">
//             <EyeIcon className="h-4 w-4 text-blue-600" />
//             <span className="text-xs font-medium text-gray-700">
//               {hiddenCount} column{hiddenCount > 1 ? "s" : ""} hidden:
//             </span>
//           </div>
//           <div className="flex gap-2 flex-wrap">
//             {hiddenColumnsList.map((col) => (
//               <button
//                 key={col}
//                 onClick={() => toggleColumnVisibility(col)}
//                 className="inline-flex items-center px-2.5 py-1 bg-white hover:bg-blue-100 border border-blue-300 rounded-full text-xs font-medium text-blue-700 transition-colors shadow-sm cursor-pointer"
//               >
//                 {col}
//               </button>
//             ))}
//             <button
//               onClick={showAllHiddenColumns}
//               className="btn1 btn-blue !py-0.5 !px-2.5 text-xs font-medium cursor-pointer"
//             >
//               Show All
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="overflow-x-auto rounded-lg border border-gray-300 scrollbar-thin">
//         <table className="w-full text-xs min-w-[1600px] border-collapse">
//           <thead className="sticky top-0 z-10">
//             <tr>
//               <th className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center w-10"></th>
//               <th className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center w-12">
//                 Line
//               </th>
//               {availableHideableColumns.map(
//                 (col) =>
//                   !hiddenColumns[col] && (
//                     <th
//                       key={col}
//                       className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center"
//                     >
//                       <div className="flex items-center justify-between gap-2 group px-1">
//                         <span className="flex-1 text-center">{col}</span>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleColumnVisibility(col);
//                           }}
//                           className="p-1 hover:bg-blue-100 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
//                           title="Hide column"
//                           type="button"
//                         >
//                           <MinusCircleIcon className="h-3.5 w-3.5 text-gray-500 hover:text-gray-800" />
//                         </button>
//                       </div>
//                     </th>
//                   ),
//               )}
//               {periodDates.map((dateInfo) => (
//                 <th
//                   key={dateInfo.apiDate}
//                   className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center min-w-[75px]"
//                 >
//                   {dateInfo.display}
//                 </th>
//               ))}
//               <th className="px-2 py-1.5 whitespace-nowrap border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center">
//                 Total
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 bg-white">
//             {lines.map((line, index) => {
//               const rowTotal = Object.values(line.hours)
//                 .reduce((s, h) => s + (parseFloat(h) || 0), 0)
//                 .toFixed(2);

//               const isDisabled = isLineDisabled(line);

//               return (
//                 <tr
//                   key={line.id}
//                   className="hover:bg-sky-50/50 transition-colors"
//                 >
//                   <td className="px-2 py-1 text-center whitespace-nowrap border-r border-b border-gray-300">
//                     <input
//                       type="checkbox"
//                       className={`rounded border-gray-300 ${
//                         !isEditable
//                           ? "cursor-not-allowed opacity-50"
//                           : "cursor-pointer accent-blue-600"
//                       }`}
//                       checked={selectedLines.has(line.id)}
//                       onChange={() => handleSelectLine(line.id)}
//                       disabled={!isEditable}
//                     />
//                   </td>
//                   <td className="px-2 py-1 text-center whitespace-nowrap border-r border-b border-gray-300 text-black font-medium">
//                     {index + 1}
//                   </td>
//                   {hideableColumns.includes("Work Order") &&
//                     !hiddenColumns["Work Order"] && (
//                       <td className="p-1 border-r border-b border-gray-300 min-w-[250px]">
//                         <CascadingSelect
//                           label="Work Order"
//                           options={workOrderOptions}
//                           value={line.workOrder}
//                           onChange={(e) =>
//                             handleSelectChange(
//                               line.id,
//                               "workOrder",
//                               e.target.value,
//                             )
//                           }
//                           disabled={isDisabled}
//                         />
//                       </td>
//                     )}
//                   {hideableColumns.includes("Description") &&
//                     !hiddenColumns["Description"] && (
//                       <td className="p-1 border-r border-b border-gray-300 min-w-[200px]">
//                         <input
//                           type="text"
//                           value={line.description}
//                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
//                           readOnly
//                         />
//                       </td>
//                     )}
//                   {/* {!hiddenColumns["Project"] && (
//                     <td className="p-1 border-r border-b border-gray-300 min-w-[150px]">
//                       <input
//                         type="text"
//                         value={line.project}
//                         className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
//                         readOnly
//                       />
//                     </td>
//                   )} */}
//                   {hideableColumns.includes("Project") &&
//                     !hiddenColumns["Project"] && (
//                       <td className="p-1 border-r border-b border-gray-300 min-w-[150px]">
//                         {role !== "fbsdusbcsdnjsbhasbx" ? (
//                           <select
//                             value={line.project}
//                             onChange={(e) => {
//                               const selectedProjId = e.target.value;
//                               // Find matching entry from employeeProjects data to automatically map the billLabCatCd to plc
//                               const matchedEntry = employeeProjects.find(
//                                 (proj) => proj.projId === selectedProjId,
//                               );

//                               setLines((currentLines) =>
//                                 currentLines.map((l) =>
//                                   l.id === line.id
//                                     ? {
//                                         ...l,
//                                         project: selectedProjId,
//                                         projectName: matchedEntry
//                                           ? matchedEntry.projectName
//                                           : "",
//                                         plc: matchedEntry
//                                           ? matchedEntry.billLabCatCd
//                                           : "",
//                                         plcDesc: matchedEntry
//                                           ? matchedEntry.plcDesc
//                                           : "",
//                                         pmUserID: matchedEntry
//                                           ? matchedEntry.pm_UserId || ""
//                                           : "",
//                                       }
//                                     : l,
//                                 ),
//                               );
//                             }}
//                             disabled={isDisabled}
//                             className={`w-full bg-white px-2 py-1 text-xs border border-gray-300 rounded shadow-inner text-black ${
//                               isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
//                             }`}
//                           >
//                             <option value="">Select Project</option>
//                             {employeeProjects.map((proj) => (
//                               <option key={proj.projId} value={proj.projId}>
//                                 {proj.projId} (LabCat: {proj.billLabCatCd})
//                               </option>
//                             ))}
//                           </select>
//                         ) : (
//                           <input
//                             type="text"
//                             value={line.project}
//                             className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
//                             readOnly
//                           />
//                         )}
//                       </td>
//                     )}
//                   {hideableColumns.includes("Project Name") &&
//                     !hiddenColumns["Project Name"] && (
//                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
//                         <input
//                           type="text"
//                           value={line.projectName}
//                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
//                           readOnly
//                         />
//                       </td>
//                     )}
//                   {hideableColumns.includes("PLC") && !hiddenColumns["PLC"] && (
//                     <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
//                       <input
//                         type="text"
//                         value={line.plc}
//                         className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
//                         readOnly
//                       />
//                     </td>
//                   )}
//                   {hideableColumns.includes("PLC Description") &&
//                     !hiddenColumns["PLC Description"] && (
//                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
//                         <input
//                           type="text"
//                           value={line.plcDesc}
//                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
//                           readOnly
//                         />
//                       </td>
//                     )}
//                   {hideableColumns.includes("Pay Type") &&
//                     !hiddenColumns["Pay Type"] && (
//                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
//                         <select
//                           value={line.payType}
//                           onChange={(e) =>
//                             handleSelectChange(
//                               line.id,
//                               "payType",
//                               e.target.value,
//                             )
//                           }
//                           className={`w-full bg-white px-2 py-1 text-xs border border-gray-300 rounded shadow-inner text-black ${
//                             isDisabled
//                               ? "bg-gray-100 text-gray-500 cursor-not-allowed"
//                               : ""
//                           }`}
//                           disabled={isDisabled}
//                         >
//                           <option value="SR">Regular</option>
//                           <option value="SO">Overtime</option>
//                         </select>
//                       </td>
//                     )}
//                   {hideableColumns.includes("PO Number") &&
//                     !hiddenColumns["PO Number"] && (
//                       <td className="p-1 border-r border-b border-gray-300 min-w-[150px]">
//                         <input
//                           type="text"
//                           value={line.poNumber}
//                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
//                           readOnly
//                         />
//                       </td>
//                     )}
//                   {hideableColumns.includes("RLSE Number") &&
//                     !hiddenColumns["RLSE Number"] && (
//                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
//                         <input
//                           type="text"
//                           value={line.rlseNumber}
//                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
//                           readOnly
//                         />
//                       </td>
//                     )}
//                   {hideableColumns.includes("PO Line Number") &&
//                     !hiddenColumns["PO Line Number"] && (
//                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
//                         <input
//                           type="text"
//                           value={line.poLineNumber}
//                           className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
//                           readOnly
//                         />
//                       </td>
//                     )}
//                   {isAdmin &&
//                     hideableColumns.includes("PO Remaining Hours") &&
//                     !hiddenColumns["PO Remaining Hours"] && (
//                       <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
//                         {line.poLineNumber &&
//                         remainingPoHours[String(line.poLineNumber).trim()] !==
//                           undefined ? (
//                           <div className="text-xs font-medium text-center">
//                             <span
//                               className={`font-semibold ${
//                                 parseFloat(getRemainingHoursForLine(line)) < 0
//                                   ? "text-red-600"
//                                   : "text-green-600"
//                               }`}
//                             >
//                               {getRemainingHoursForLine(line)} hrs
//                             </span>
//                           </div>
//                         ) : (
//                           <div className="text-xs font-medium text-center text-gray-400">
//                             -
//                           </div>
//                         )}
//                       </td>
//                     )}
//                   {periodDates.map((dateInfo, dayIndex) => {
//                     const days = [
//                       "sunday",
//                       "monday",
//                       "tuesday",
//                       "wednesday",
//                       "thursday",
//                       "friday",
//                       "saturday",
//                     ];
//                     const dayIndexUtc = dateInfo.obj.getUTCDay();
//                     const dayName = days[dayIndexUtc];
//                     const isWeekend = configWeekends.includes(dayName);
//                     const isFutureDate =
//                       dateInfo.obj.getUTCFullYear() > today.getUTCFullYear() ||
//                       (dateInfo.obj.getUTCFullYear() ===
//                         today.getUTCFullYear() &&
//                         dateInfo.obj.getUTCMonth() > today.getUTCMonth()) ||
//                       (dateInfo.obj.getUTCFullYear() ===
//                         today.getUTCFullYear() &&
//                         dateInfo.obj.getUTCMonth() === today.getUTCMonth() &&
//                         dateInfo.obj.getUTCDate() > today.getUTCDate());

//                     const finalDisabled = isDisabled || isFutureDate;
//                     const dayTotal = dailyTotals[dayIndex] || 0;
//                     const exceededMax = dayTotal > maxDailyHours;

//                     let inputClasses = `w-[72px] text-right pl-1.5 pr-6 py-1 text-xs border border-gray-300 rounded shadow-inner text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none `;
//                     let inputStyle = {};

//                     if (isWeekend && configHighlightColor) {
//                       inputStyle.backgroundColor = configHighlightColor;
//                     }
//                     if (!inputStyle.backgroundColor && isWeekend) {
//                       inputClasses += "bg-gray-100 ";
//                     } else if (!inputStyle.backgroundColor) {
//                       inputClasses += "bg-white ";
//                     }

//                     if (exceededMax) {
//                       inputStyle.backgroundColor = "";
//                       inputClasses = inputClasses
//                         .replace("bg-gray-100", "")
//                         .replace("bg-white", "");
//                       inputClasses +=
//                         "bg-red-100 border-red-500 text-red-800 font-bold ";
//                     } else if (finalDisabled) {
//                       inputClasses = inputClasses.replace("bg-white", "");
//                       if (isWeekend && configHighlightColor) {
//                         inputClasses = inputClasses.replace("bg-gray-100", "");
//                       } else {
//                         inputStyle.backgroundColor = "";
//                         inputClasses += "bg-gray-100 ";
//                       }
//                       inputClasses += " text-gray-500 cursor-not-allowed ";
//                     } else {
//                       inputClasses +=
//                         " focus:outline-none focus:ring-1 focus:ring-blue-500 ";
//                     }

//                     const dayComment = line.comments?.[dayIndex] || "";
//                     const hasComment = Boolean(
//                       dayComment && dayComment.trim() !== "",
//                     );
//                     let cellTitle = "";
//                     if (hasComment) {
//                       cellTitle = `Comment: ${dayComment}`;
//                     }

//                     return (
//                       <td
//                         key={dateInfo.apiDate}
//                         className="p-1 border-r border-b border-gray-300 text-center"
//                       >
//                         <div
//                           className="relative inline-flex items-center group"
//                           onMouseEnter={(e) => {
//                             if (!hasComment) return;
//                             const rect =
//                               e.currentTarget.getBoundingClientRect();
//                             setHoveredComment({
//                               text: dayComment,
//                               x: rect.left + rect.width / 2,
//                               y: rect.top,
//                             });
//                           }}
//                           onMouseLeave={() => setHoveredComment(null)}
//                         >
//                           <input
//                             type="number"
//                             step="0.5"
//                             value={
//                               line.hours[dayIndex] === 0 ||
//                               line.hours[dayIndex] === ""
//                                 ? ""
//                                 : line.hours[dayIndex]
//                             }
//                             onChange={(e) =>
//                               handleHourChange(
//                                 line.id,
//                                 dayIndex,
//                                 e.target.value,
//                               )
//                             }
//                             title={cellTitle}
//                             className={inputClasses}
//                             style={inputStyle}
//                             disabled={finalDisabled}
//                           />
//                           {/* Comment Icon button: interactive if isEditable or if existing comment */}
//                           {(isEditable || hasComment) && (
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 openCommentModal(
//                                   line.id,
//                                   dayIndex,
//                                   dateInfo.display,
//                                   !isEditable,
//                                 )
//                               }
//                               className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded cursor-pointer transition-all ${
//                                 hasComment
//                                   ? "text-blue-600 opacity-100 hover:text-blue-800"
//                                   : "text-gray-400 opacity-0 group-hover:opacity-80 hover:text-gray-700"
//                               }`}
//                             >
//                               <CommentIcon className="w-3 h-3" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     );
//                   })}
//                   <td className="px-2 py-1 text-right font-bold text-black border-b border-gray-300 pr-3">
//                     {rowTotal}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//           <tfoot className="border-t-2 border-gray-300 bg-[#e5f3fb] font-semibold text-black text-xs">
//             <tr>
//               <td
//                 colSpan={
//                   2 +
//                   availableHideableColumns.filter((col) => !hiddenColumns[col])
//                     .length
//                 }
//                 className="px-3 py-2 text-right font-bold text-black border-r border-gray-300"
//               >
//                 Total Hours
//               </td>
//               {periodDates.map((_, idx) => (
//                 <td
//                   key={idx}
//                   className="px-2 py-2 text-center border-r border-gray-300"
//                 >
//                   <div
//                     className={`w-16 mx-auto ${
//                       dailyTotals[idx] > maxDailyHours
//                         ? "text-red-700 font-bold"
//                         : "text-black font-semibold"
//                     }`}
//                   >
//                     {dailyTotals[idx] ? dailyTotals[idx].toFixed(2) : "0.00"}
//                   </div>
//                 </td>
//               ))}
//               <td className="px-3 py-2 text-right font-bold text-black pr-3">
//                 {grandTotal.toFixed(2)}
//               </td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>

//       {/* <div className="mt-4 flex justify-end gap-2">
//         <ActionButton onClick={onClose}>Cancel</ActionButton>
//         {isEditable && (
//           <ActionButton
//             onClick={handleSaveWithReasonPrompt}
//             disabled={isSaving || isCurrentlySaving}
//           >
//             {isCurrentlySaving ? "Saving..." : "Save Changes"}
//           </ActionButton>
//         )}
//       {/* Comment Popup Modal */}
//       {commentModal.isOpen && (
//         <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/40 p-4">
//           <div className="bg-white rounded-lg p-5 w-full max-w-md shadow-xl border border-gray-200 animate-in fade-in duration-150">
//             <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
//               <div className="flex items-center gap-2">
//                 <CommentIcon className="w-4 h-4 text-[#1e3a5f]" />
//                 <h3 className="text-sm font-bold text-gray-900">
//                   {commentModal.isReadOnly
//                     ? "View Hour Comment"
//                     : "Hour Comment"}
//                   {commentModal.dateLabel ? ` (${commentModal.dateLabel})` : ""}
//                 </h3>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeCommentModal}
//                 className="text-gray-400 hover:text-gray-700 text-lg font-bold leading-none p-1 cursor-pointer"
//               >
//                 &times;
//               </button>
//             </div>

//             <div className="space-y-2 mb-4">
//               <label className="block text-xs font-semibold text-gray-700">
//                 Comment for {commentModal.dateLabel || "selected date"}:
//               </label>
//               <textarea
//                 rows={4}
//                 disabled={commentModal.isReadOnly}
//                 value={commentModal.comment}
//                 onChange={(e) =>
//                   setCommentModal((prev) => ({
//                     ...prev,
//                     comment: e.target.value,
//                   }))
//                 }
//                 placeholder={
//                   commentModal.isReadOnly
//                     ? "No comment added."
//                     : "Enter comment / note for this day's hours..."
//                 }
//                 className={`w-full text-xs p-2.5 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
//                   commentModal.isReadOnly
//                     ? "bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300"
//                     : "bg-white text-black border-gray-300"
//                 }`}
//                 autoFocus={!commentModal.isReadOnly}
//               />
//             </div>

//             <div className="flex items-center justify-between pt-3 border-t border-gray-200">
//               <div>
//                 {!commentModal.isReadOnly && commentModal.comment && (
//                   <button
//                     type="button"
//                     onClick={() => saveComment("")}
//                     className="text-xs text-red-600 hover:text-red-800 hover:underline font-medium cursor-pointer"
//                   >
//                     Clear Comment
//                   </button>
//                 )}
//               </div>
//               <div className="flex items-center gap-2">
//                 <ActionButton onClick={closeCommentModal} className="!text-xs">
//                   {commentModal.isReadOnly ? "Close" : "Cancel"}
//                 </ActionButton>
//                 {!commentModal.isReadOnly && (
//                   <ActionButton
//                     onClick={() => saveComment(commentModal.comment)}
//                     className="!text-xs"
//                   >
//                     Save Comment
//                   </ActionButton>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Floating Comment Tooltip - fixed position ensures zero vertical scrollbar and zero cutoff */}
//       {hoveredComment && (
//         <div
//           style={{
//             position: "fixed",
//             left: `${hoveredComment.x}px`,
//             top: `${hoveredComment.y - 6}px`,
//             transform: "translate(-50%, -100%)",
//             zIndex: 12000,
//           }}
//           className="pointer-events-none p-2 bg-gray-900 text-white text-xs rounded-md shadow-xl max-w-xs whitespace-normal break-words animate-in fade-in duration-100"
//         >
//           <div className="font-semibold text-sky-300 text-[10px] uppercase tracking-wider mb-0.5">
//             Comment:
//           </div>
//           <div className="text-[11px] leading-relaxed whitespace-pre-wrap">
//             {hoveredComment.text}
//           </div>
//           <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo, useRef } from "react";
import { backendUrl } from "./config";

// --- SVG Icons ---
const CommentIcon = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);
const PlusIcon = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />{" "}
  </svg>
);

const CopyIcon = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />{" "}
  </svg>
);

const TrashIcon = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />{" "}
  </svg>
);

const EyeIcon = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />{" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />{" "}
  </svg>
);

const XIcon = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />{" "}
  </svg>
);

const MinusCircleIcon = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />{" "}
  </svg>
);

// --- ActionButton Component ---

const ActionButton = ({
  children,
  onClick,
  icon,
  className = "",
  disabled = false,
}) => {
  const buttonStyle = disabled
    ? "btn1 btn-inactive opacity-60 cursor-not-allowed"
    : "btn1 btn-blue cursor-pointer";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${buttonStyle} inline-flex items-center gap-1.5 text-xs font-semibold ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

// --- Toast Notification ---

const showToast = (message, type = "info", duration = 3000) => {
  const toast = document.createElement("div");

  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500",
  };

  toast.className = `fixed top-5 right-5 p-4 rounded-md text-white shadow-lg z-[10000] ${
    typeClasses[type] || typeClasses["info"]
  }`;

  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, duration);
};

const createEmptyLine = (id, periodLength) => {
  const emptyHours = {};
  const emptyComments = {};

  for (let i = 0; i < periodLength; i++) {
    emptyHours[i] = 0;
    emptyComments[i] = "";
  }

  return {
    id,
    description: "",
    project: "",
    plc: "",
    workOrder: "",
    wa_Code: "",
    pmUserID: "",
    payType: "SR",
    poNumber: "",
    rlseNumber: "",
    poLineNumber: "",
    hours: emptyHours,
    hourIds: {},
    comments: emptyComments,
    isInvoiced: false,
  };
};

const CascadingSelect = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
}) => (
  <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    className={`w-full bg-white px-2 py-1 text-xs border border-gray-300 rounded shadow-inner text-black focus:outline-none focus:ring-1 focus:ring-blue-500 ${
      disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
    }`}
  >
    <option value="">Select {label}</option>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

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

const normalizeTargetDate = (dateString) => {
  if (!dateString) return "";
  const parts = String(dateString).split("/");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
  }
  return String(dateString).split("T")[0];
};

const getDatesBetween = (startDateStr, endDateStr, frequency) => {
  const startParts = startDateStr.split("T")[0].split("-").map(Number);
  const endParts = endDateStr.split("T")[0].split("-").map(Number);

  const start = new Date(
    Date.UTC(startParts[0], startParts[1] - 1, startParts[2]),
  );
  const end = new Date(Date.UTC(endParts[0], endParts[1] - 1, endParts[2]));

  const dates = [];
  const freq = frequency ? frequency.toLowerCase() : "weekly";

  const numOpt = { month: "2-digit", day: "2-digit", timeZone: "UTC" };
  const txtOpt = { month: "short", day: "2-digit", timeZone: "UTC" };

  const getFmt = (d) => {
    if (freq === "monthly" || freq === "semi-monthly")
      return new Intl.DateTimeFormat("en-US", txtOpt).format(d);
    return new Intl.DateTimeFormat("en-US", numOpt).format(d);
  };
  const getApiFmt = (d) => d.toISOString().split("T")[0];

  for (
    let d = new Date(start);
    d.getTime() <= end.getTime();
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    const currentDay = new Date(d);
    dates.push({
      display: getFmt(currentDay),
      apiDate: getApiFmt(currentDay),
      obj: currentDay,
    });
  }

  return dates;
};

const hideableColumns = [
  "Work Order",
  "Description",
  "Project",
  "PLC",
  "Pay Type",
  "PO Number",
  "RLSE Number",
  "PO Line Number",
  "PO Remaining Hours",
];

export default function TimesheetDetailModal({
  timesheetData,
  currentUser,
  userId,
  scheduleId,
  role,
  onClose,
  onSave,
  isSaving,
  isAdmin = false,
}) {
  const [lines, setLines] = useState([]);
  const [selectedLines, setSelectedLines] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [employeeProjects, setEmployeeProjects] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [initialLines, setInitialLines] = useState([]);
  const [linesToDelete, setLinesToDelete] = useState([]);
  const [payTypes, setPayTypes] = useState([]);
  const [isCurrentlySaving, setIsCurrentlySaving] = useState(false);
  const [timesheetDetails, setTimesheetDetails] = useState(null);

  // Timesheet Schedule API state
  const [schedulePeriods, setSchedulePeriods] = useState([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState(null);

  // Comment Modal state
  const [commentModal, setCommentModal] = useState({
    isOpen: false,
    lineId: null,
    dayIndex: null,
    dateLabel: "",
    comment: "",
    isReadOnly: false,
  });

  const [hoveredComment, setHoveredComment] = useState(null);

  const openCommentModal = (
    lineId,
    dayIndex,
    dateLabel,
    isReadOnly = false,
  ) => {
    const line = lines.find((l) => l.id === lineId);
    const existingComment = line?.comments?.[dayIndex] || "";
    setCommentModal({
      isOpen: true,
      lineId,
      dayIndex,
      dateLabel: dateLabel || `Day ${dayIndex + 1}`,
      comment: existingComment,
      isReadOnly,
    });
  };

  const closeCommentModal = () => {
    setCommentModal((prev) => ({ ...prev, isOpen: false }));
  };

  const saveComment = (newComment) => {
    if (commentModal.lineId == null || commentModal.dayIndex == null) return;
    const { lineId, dayIndex } = commentModal;
    setLines((prevLines) =>
      prevLines.map((line) =>
        line.id === lineId
          ? {
              ...line,
              comments: {
                ...(line.comments || {}),
                [dayIndex]: newComment,
              },
            }
          : line,
      ),
    );
    closeCommentModal();
  };

  const hideableColumns =
    role === "fbsdusbcsdnjsbhasbx"
      ? [
          "Work Order",
          "Description",
          "Project",
          "PLC",
          "Pay Type",
          "PO Number",
          "RLSE Number",
          "PO Line Number",
          "PO Remaining Hours",
        ]
      : ["Project", "Project Name", "PLC", "PLC Description", "Pay Type"];

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    const initial = {};
    hideableColumns.forEach((col) => {
      initial[col] = false;
    });
    return initial;
  });

  const [periodType, setPeriodType] = useState("Weekly");
  const [configWeekends, setConfigWeekends] = useState([]);
  const [configHighlightColor, setConfigHighlightColor] = useState("");
  const [maxDailyHours, setMaxDailyHours] = useState(24);
  const [hardEdit, setHardEdit] = useState(false);
  const currentYear = new Date().getFullYear();

  // Extract year from timesheetData.Date
  const scheduleYear = useMemo(() => {
    if (!timesheetData?.Date) return new Date().getFullYear();
    const dateStr = String(timesheetData.Date);
    const parts = dateStr.split(/[-\/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) return parseInt(parts[0], 10);
      if (parts[2].length === 4) return parseInt(parts[2], 10);
    }
    const d = new Date(timesheetData.Date);
    return isNaN(d.getFullYear()) ? new Date().getFullYear() : d.getFullYear();
  }, [timesheetData]);

  // Fetch schedule periods from API
  useEffect(() => {
    const fetchSchedulePeriods = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/TimesheetSchedule/id/${scheduleId}?year=${currentYear}`,
        );
        if (!response.ok) throw new Error("Failed to fetch timesheet schedule");
        const data = await response.json();
        if (data && Array.isArray(data.periods)) {
          setSchedulePeriods(data.periods);

          if (timesheetData?.Date) {
            const targetNorm = normalizeTargetDate(timesheetData.Date);
            const matched = data.periods.find((p) => {
              const start = p.periodStartDate.split("T")[0];
              const end = p.periodEndDate.split("T")[0];
              return targetNorm >= start && targetNorm <= end;
            });
            if (matched) {
              setSelectedPeriodId(matched.periodId);
            } else if (data.periods.length > 0) {
              setSelectedPeriodId(data.periods[0].periodId);
            }
          } else if (data.periods.length > 0) {
            setSelectedPeriodId(data.periods[0].periodId);
          }
        }
      } catch (err) {
        console.error("Error fetching timesheet schedule periods:", err);
      }
    };
    fetchSchedulePeriods();
  }, [scheduleYear, timesheetData]);

  const selectedPeriod = useMemo(() => {
    return (
      schedulePeriods.find((p) => p.periodId === Number(selectedPeriodId)) ||
      schedulePeriods[0]
    );
  }, [schedulePeriods, selectedPeriodId]);

  // Check if the selected schedule period is open (isOpen === true)
  const isPeriodOpen = useMemo(() => {
    if (!selectedPeriod) return true; // Default to true if not loaded yet
    return selectedPeriod.isOpen === true;
  }, [selectedPeriod]);

  const periodDates = useMemo(() => {
    if (
      selectedPeriod &&
      selectedPeriod.periodStartDate &&
      selectedPeriod.periodEndDate
    ) {
      return getDatesBetween(
        selectedPeriod.periodStartDate,
        selectedPeriod.periodEndDate,
        periodType,
      );
    }
    if (!timesheetData?.Date) return [];
    return getDatesBetween(timesheetData.Date, timesheetData.Date, periodType);
  }, [selectedPeriod, timesheetData, periodType]);

  const [remainingPoHours, setRemainingPoHours] = useState({});
  const [showReasonPrompt, setShowReasonPrompt] = useState(false);
  const [updateReason, setUpdateReason] = useState("");

  const today = useMemo(() => {
    const d = new Date();
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    );
  }, []);

  useEffect(() => {
    if (role !== "fbsdusbcsdnjsbhasbx") {
      const fetchEmployeeProjects = async () => {
        try {
          const response = await fetch(
            `${backendUrl}/api/ProjEmployeeLabcat/employee/${userId}`,
          );
          if (!response.ok)
            throw new Error("Failed to fetch employee projects");
          const data = await response.json();
          if (Array.isArray(data)) {
            setEmployeeProjects(data);
          }
        } catch (err) {
          console.error("Error fetching employee projects:", err);
        }
      };
      fetchEmployeeProjects();
    }
  }, [role, userId]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/ConfigValues`);
        if (!response.ok) throw new Error("Failed to fetch config");
        const data = await response.json();

        const getConfigValue = (name) =>
          data.find((item) => item.name?.toLowerCase() === name)?.value;

        const periodConfig = getConfigValue("timesheet_period");
        const weekendConfig = getConfigValue("weekend");
        const colorConfig = getConfigValue("weekend_highlight_color");
        const maxDailyHoursConfig = getConfigValue("max_daily_hours");
        const hardEditConfig = getConfigValue("hard_edit");

        if (periodConfig) setPeriodType(periodConfig);
        if (weekendConfig) {
          const days = weekendConfig
            .split(",")
            .map((d) => d.trim().toLowerCase());
          setConfigWeekends(days);
        }
        if (colorConfig) setConfigHighlightColor(colorConfig);
        if (maxDailyHoursConfig)
          setMaxDailyHours(parseFloat(maxDailyHoursConfig) || 24);
        if (hardEditConfig)
          setHardEdit(hardEditConfig.toLowerCase() === "true");
      } catch (error) {
        console.error("Config fetch error:", error);
        setPeriodType("Weekly");
        setConfigWeekends(["saturday", "sunday"]);
        setConfigHighlightColor("#e5e7eb");
        setMaxDailyHours(24);
        setHardEdit(false);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (timesheetData) {
      const status = timesheetData.Status?.toUpperCase();
      const statusEditable =
        status === "OPEN" || status === "REJECTED" || status === "CORRECTION";
      // Respect both timesheet status and schedule period's isOpen status
      setIsEditable(statusEditable && isPeriodOpen);
    }
  }, [timesheetData, isPeriodOpen]);

  useEffect(() => {
    if (!timesheetData || !timesheetData["Employee ID"]) return;

    const fetchRemainingHours = async () => {
      const API_URL = `${backendUrl}/api/SubkTimesheet/GetRemainingPoHours?resourceId=${timesheetData["Employee ID"]}`;
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error!`);
        const data = await response.json();
        const hoursMap = {};
        if (Array.isArray(data)) {
          data.forEach((item) => {
            const poLineNum = String(
              item.poLineNumber || item.PoLineNumber || "",
            ).trim();
            if (poLineNum)
              hoursMap[poLineNum] = parseFloat(
                item.remainingHours || item.RemainingHours || 0,
              );
          });
        }
        setRemainingPoHours(hoursMap);
      } catch (error) {
        console.error("Error fetching remaining PO hours:", error);
      }
    };
    fetchRemainingHours();
  }, [timesheetData]);

  useEffect(() => {
    if (periodDates.length === 0) return;
    fetchTimesheetDetails();
  }, [periodDates]);

  useEffect(() => {
    const fetchPayTypes = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/PayType`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch Pay Types");
        const data = await response.json();
        setPayTypes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching Pay Types:", error);
        setPayTypes([]);
      }
    };
    fetchPayTypes();
  }, []);

  const fetchTimesheetDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/SubkTimesheet/ByResource/${timesheetData["Employee ID"]}`,
      );
      if (!response.ok) throw new Error("Failed to fetch timesheet details");
      const data = await response.json();

      const poResponse = await fetch(
        `${backendUrl}/api/PurchaseOrders/ByResourceDetails/${timesheetData["Employee ID"]}`,
      );
      if (!poResponse.ok)
        throw new Error("Failed to fetch purchase order details");
      const poData = await poResponse.json();
      const poDataArray = Array.isArray(poData) ? poData : [];
      setPurchaseOrderData(poDataArray);

      const dataArray = Array.isArray(data) ? data : [];
      const normalizedTimesheetDate = normalizeTargetDate(timesheetData.Date);

      const filteredData = dataArray.filter((item) => {
        const itemDateOnly = item.timesheet_Date.split("T")[0];
        const matchesDate = itemDateOnly === normalizedTimesheetDate;

        const isProjectManager =
          currentUser?.role?.toUpperCase() === "PROJECT MANAGER" ||
          currentUser?.role === "PM";

        const matchesUser =
          isProjectManager && userId
            ? String(item.pm_User_Id || "") === String(currentUser?.name)
            : true;

        return matchesDate && matchesUser;
      });

      if (filteredData.length > 0) {
        setTimesheetDetails(filteredData[0]);
      }

      const mappedLines = filteredData.map((item) => {
        const hoursData = {};
        const hourIdsData = {};
        const commentsData = {};

        periodDates.forEach((_, index) => {
          hoursData[index] = 0;
          commentsData[index] = "";
        });

        let isLineInvoiced = false;

        if (item.timesheetHours) {
          item.timesheetHours.forEach((hourEntry) => {
            if (hourEntry.invoiceGenerated === true) isLineInvoiced = true;
            const entryDateStr = hourEntry.ts_Date.split("T")[0];
            const dateIndex = periodDates.findIndex(
              (d) => d.apiDate === entryDateStr,
            );

            if (dateIndex !== -1) {
              hoursData[dateIndex] = hourEntry.hours;
              hourIdsData[dateIndex] = hourEntry.id;
              commentsData[dateIndex] =
                hourEntry.comment || hourEntry.Comment || "";
            }
          });
        }

        let fullWorkOrderString = "";
        const poEntry = poDataArray.find((po) =>
          po.project?.includes(item.projId),
        );

        if (poEntry) {
          const projectIndex = poEntry.project.indexOf(item.projId);
          if (projectIndex > -1) {
            fullWorkOrderString = `${poEntry.wa_Code} - ${poEntry.resourceDesc[projectIndex]}`;
          }
        }

        return {
          id: item.lineNo,
          description: item.description || "",
          project: item.projId || "",
          projectName: item?.projectName || item?.projName || "",
          plc: item.plc || "",
          plcDesc: item?.plcDesc || "",
          payType: item.payType || "SR",
          workOrder: fullWorkOrderString,
          wa_Code: poEntry?.wa_Code || "",
          pmUserID: poEntry?.pmUserId || "",
          poNumber: item.poNumber || "",
          rlseNumber: item.rlseNumber || "",
          poLineNumber: item.poLineNumber || "",
          hours: hoursData,
          hourIds: hourIdsData,
          comments: commentsData,
          isInvoiced: isLineInvoiced,
        };
      });

      setLines(mappedLines);
      setInitialLines(JSON.parse(JSON.stringify(mappedLines)));
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChange = (id, fieldName, value) => {
    setLines((currentLines) =>
      currentLines.map((line) => {
        if (line.id === id) {
          let updatedLine = { ...line, [fieldName]: value };

          if (fieldName === "workOrder") {
            if (!value) {
              const emptyLine = createEmptyLine(id, periodDates.length);
              return { ...emptyLine, id: line.id };
            }

            const splitIndex = value.indexOf(" - ");
            const waCode =
              splitIndex > -1 ? value.substring(0, splitIndex) : value;
            const desc = splitIndex > -1 ? value.substring(splitIndex + 3) : "";

            const selectedWorkOrderData = purchaseOrderData.find(
              (item) =>
                item.wa_Code === waCode &&
                (item.resourceDesc || []).includes(desc),
            );

            if (selectedWorkOrderData) {
              updatedLine.wa_Code = selectedWorkOrderData.wa_Code || "";
              updatedLine.pmUserID = selectedWorkOrderData.pmUserId || "";
              const descIndex =
                selectedWorkOrderData.resourceDesc.indexOf(desc);

              if (descIndex > -1) {
                updatedLine.description = desc || "";
                updatedLine.project =
                  selectedWorkOrderData.project[descIndex] || "";
                updatedLine.plc = selectedWorkOrderData.plcCd[descIndex] || "";
                updatedLine.poNumber =
                  selectedWorkOrderData.purchaseOrder[0] || "";
                updatedLine.rlseNumber =
                  selectedWorkOrderData.purchaseOrderRelease[0] || "";
                updatedLine.poLineNumber =
                  selectedWorkOrderData.poLineNumber[descIndex] || "";
              }
            } else {
              const emptyLine = createEmptyLine(id, periodDates.length);
              return { ...emptyLine, id: line.id };
            }
          }
          return updatedLine;
        }
        return line;
      }),
    );
  };

  // const handleHourChange = (id, dayIndex, value) => {
  //   if (value === "") {
  //     setLines((currentLines) =>
  //       currentLines.map((line) =>
  //         line.id === id
  //           ? { ...line, hours: { ...line.hours, [dayIndex]: "" } }
  //           : line,
  //       ),
  //     );
  //     return;
  //   }

  //   const numValue = parseFloat(value);
  //   let isValid = true;
  //   let toastMessage = "";
  //   let toastType = "warning";
  //   let isPOExceeded = false;
  //   let isMaxDailyExceeded = false;
  //   const currentLine = lines.find((line) => line.id === id);

  //   const status = timesheetData.Status?.toUpperCase();
  //   const allowNegativeHours = status === "CORRECTION" || status === "REJECTED";

  //   if (isNaN(numValue)) {
  //     isValid = false;
  //     toastType = "error";
  //     toastMessage = "Hours must be a number.";
  //   } else if (!allowNegativeHours && numValue < 0) {
  //     isValid = false;
  //     toastType = "error";
  //     toastMessage =
  //       "Hours cannot be negative unless correcting a rejected timesheet.";
  //   }
  //   // else if (numValue % 0.5 !== 0) {
  //   //   isValid = false;
  //   //   toastType = "error";
  //   //   toastMessage = "Hours must be in 0.5 increments.";
  //   // }
  //   else if (!/^\d+(\.\d{1,2})?$/.test(String(numValue))) {
  //     isValid = false;
  //     toastMessage = "Hours can have a maximum of two decimal places.";
  //   } else {
  //     if (currentLine && currentLine.poLineNumber) {
  //       const poLineNumber = String(currentLine.poLineNumber).trim();
  //       const remainingHours = remainingPoHours[poLineNumber];

  //       if (remainingHours !== undefined) {
  //         const tempLines = lines.map((line) =>
  //           line.id === id
  //             ? { ...line, hours: { ...line.hours, [dayIndex]: numValue } }
  //             : line,
  //         );
  //         const allLinesWithSamePO = tempLines.filter(
  //           (l) => String(l.poLineNumber).trim() === poLineNumber,
  //         );

  //         const totalNewHoursForPO = allLinesWithSamePO.reduce((sum, l) => {
  //           const initialLine = initialLines.find((init) => init.id === l.id);
  //           const currentUITotal = Object.values(l.hours).reduce(
  //             (s, h) => s + (parseFloat(h) || 0),
  //             0,
  //           );
  //           const initialTotal = initialLine
  //             ? Object.values(initialLine.hours).reduce(
  //                 (s, h) => s + (parseFloat(h) || 0),
  //                 0,
  //               )
  //             : 0;
  //           return sum + (currentUITotal - initialTotal);
  //         }, 0);

  //         if (totalNewHoursForPO > remainingHours) {
  //           isPOExceeded = true;
  //           if (!hardEdit) {
  //             isValid = false;
  //             toastType = "error";
  //             toastMessage = `Disabled: Cannot exceed remaining PO hours (${remainingHours.toFixed(
  //               2,
  //             )} available for PO Line ${poLineNumber}).`;
  //           } else {
  //             toastMessage = `PO hours exceeded. ${remainingHours.toFixed(
  //               2,
  //             )} hours available for PO Line ${poLineNumber}.`;
  //             toastType = "warning";
  //           }
  //         }
  //       }
  //     }

  //     if (isValid) {
  //       const otherLinesTotal = lines
  //         .filter((line) => line.id !== id)
  //         .reduce(
  //           (sum, line) => sum + (parseFloat(line.hours[dayIndex]) || 0),
  //           0,
  //         );

  //       const newDailyTotal = otherLinesTotal + numValue;

  //       // if (newDailyTotal > maxDailyHours) {
  //       //   isMaxDailyExceeded = true;
  //       //   isValid = false;
  //       //   toastType = "error";
  //       //   const maxDailyError = `Daily total hours exceed the maximum limit of ${maxDailyHours}.`;
  //       //   if (isPOExceeded && hardEdit) {
  //       //     toastMessage = `${maxDailyError} Also, PO hours exceeded.`;
  //       //   } else {
  //       //     toastMessage = `Disabled: ${maxDailyError}`;
  //       //   }
  //       // }
  //       if (newDailyTotal > maxDailyHours) {
  //         // Check if the current line's payType is already Overtime
  //         const isOvertimePayType =
  //           currentLine?.payType?.toLowerCase() === "so" ||
  //           currentLine?.payType?.toLowerCase() === "overtime";

  //         // If it's an overtime line, we allow it past the max daily block
  //         if (!isOvertimePayType) {
  //           isMaxDailyExceeded = true;
  //           isValid = false;
  //           toastType = "error";
  //           const maxDailyError = `Daily total hours exceed the maximum limit of ${maxDailyHours}. Please add a new line with the OT pay type for the excess hours.`;
  //           if (isPOExceeded && hardEdit) {
  //             toastMessage = `${maxDailyError} Also, PO hours exceeded.`;
  //           } else {
  //             toastMessage = `Disabled: ${maxDailyError}`;
  //           }
  //         }
  //       }
  //     }
  //   }

  //   const toastDuration = isValid && isPOExceeded && hardEdit ? 5000 : 3000;

  //   if (isValid) {
  //     setLines((currentLines) =>
  //       currentLines.map((line) =>
  //         line.id === id
  //           ? { ...line, hours: { ...line.hours, [dayIndex]: numValue } }
  //           : line,
  //       ),
  //     );
  //     if (isPOExceeded && hardEdit) {
  //       showToast(toastMessage, toastType, toastDuration);
  //     }
  //   } else {
  //     showToast(toastMessage, toastType, toastDuration);
  //     setLines((currentLines) =>
  //       currentLines.map((line) =>
  //         line.id === id
  //           ? {
  //               ...line,
  //               hours: { ...line.hours, [dayIndex]: line.hours[dayIndex] },
  //             }
  //           : line,
  //       ),
  //     );
  //   }
  // };

   const handleHourChange = (id, dayIndex, value) => {
    if (value === "") {
      setLines((currentLines) =>
        currentLines.map((line) =>
          line.id === id
            ? { ...line, hours: { ...line.hours, [dayIndex]: "" } }
            : line,
        ),
      );
      return;
    }
 
    const numValue = parseFloat(value);
    let isValid = true;
    let toastMessage = "";
    let toastType = "warning";
    let isPOExceeded = false;
    let isMaxDailyExceeded = false;
    const currentLine = lines.find((line) => line.id === id);
 
    const status = timesheetData.Status?.toUpperCase();
    const allowNegativeHours = status === "CORRECTION" || status === "REJECTED";
 
    if (isNaN(numValue)) {
      isValid = false;
      toastType = "error";
      toastMessage = "Hours must be a number.";
    } else if (!allowNegativeHours && numValue < 0) {
      isValid = false;
      toastType = "error";
      toastMessage =
        "Hours cannot be negative unless correcting a rejected timesheet.";
    } else if (!/^\d+(\.\d{1,2})?$/.test(String(numValue))) {
      isValid = false;
      toastMessage = "Hours can have a maximum of two decimal places.";
    } else {
      if (currentLine && currentLine.poLineNumber) {
        const poLineNumber = String(currentLine.poLineNumber).trim();
        const remainingHours = remainingPoHours[poLineNumber];
 
        if (remainingHours !== undefined) {
          const tempLines = lines.map((line) =>
            line.id === id
              ? { ...line, hours: { ...line.hours, [dayIndex]: numValue } }
              : line,
          );
          const allLinesWithSamePO = tempLines.filter(
            (l) => String(l.poLineNumber).trim() === poLineNumber,
          );
 
          const totalNewHoursForPO = allLinesWithSamePO.reduce((sum, l) => {
            const initialLine = initialLines.find((init) => init.id === l.id);
            const currentUITotal = Object.values(l.hours).reduce(
              (s, h) => s + (parseFloat(h) || 0),
              0,
            );
            const initialTotal = initialLine
              ? Object.values(initialLine.hours).reduce(
                  (s, h) => s + (parseFloat(h) || 0),
                  0,
                )
              : 0;
            return sum + (currentUITotal - initialTotal);
          }, 0);
 
          if (totalNewHoursForPO > remainingHours) {
            isPOExceeded = true;
            if (!hardEdit) {
              isValid = false;
              toastType = "error";
              toastMessage = `Disabled: Cannot exceed remaining PO hours (${remainingHours.toFixed(
                2,
              )} available for PO Line ${poLineNumber}).`;
            } else {
              toastMessage = `PO hours exceeded. ${remainingHours.toFixed(
                2,
              )} hours available for PO Line ${poLineNumber}.`;
              toastType = "warning";
            }
          }
        }
      }
 
      if (isValid) {
        // Check if the current line is an overtime pay type
        const isCurrentLineOvertime =
          currentLine?.payType?.toLowerCase() === "so" ||
          currentLine?.payType?.toLowerCase() === "overtime" ||
          currentLine?.payType?.toLowerCase() === "ot";
 
        if (!isCurrentLineOvertime) {
          // Sum hours only from OTHER non-overtime lines for this day
          const otherNonOvertimeLinesTotal = lines
            .filter((line) => {
              if (line.id === id) return false;
              const pt = line.payType?.toLowerCase();
              return pt !== "so" && pt !== "overtime" && pt !== "ot";
            })
            .reduce(
              (sum, line) => sum + (parseFloat(line.hours[dayIndex]) || 0),
              0,
            );
 
          const newRegularDailyTotal = otherNonOvertimeLinesTotal + numValue;
 
          if (newRegularDailyTotal > maxDailyHours) {
            isMaxDailyExceeded = true;
            isValid = false;
            toastType = "error";
            const maxDailyError = `Daily total hours exceed the maximum limit of ${maxDailyHours}. Please add a new line with the OT pay type for the excess hours.`;
            if (isPOExceeded && hardEdit) {
              toastMessage = `${maxDailyError} Also, PO hours exceeded.`;
            } else {
              toastMessage = `Disabled: ${maxDailyError}`;
            }
          }
        }
      }
    }
 
    const toastDuration = isValid && isPOExceeded && hardEdit ? 5000 : 3000;
 
    if (isValid) {
      setLines((currentLines) =>
        currentLines.map((line) =>
          line.id === id
            ? { ...line, hours: { ...line.hours, [dayIndex]: numValue } }
            : line,
        ),
      );
      if (isPOExceeded && hardEdit) {
        showToast(toastMessage, toastType, toastDuration);
      }
    } else {
      showToast(toastMessage, toastType, toastDuration);
      setLines((currentLines) =>
        currentLines.map((line) =>
          line.id === id
            ? {
                ...line,
                hours: { ...line.hours, [dayIndex]: line.hours[dayIndex] },
              }
            : line,
        ),
      );
    }
  };

  const getRemainingHoursForLine = (line) => {
    if (!line.poLineNumber) return null;
    const poLineNumStr = String(line.poLineNumber).trim();
    const remaining = remainingPoHours[poLineNumStr];
    if (remaining === undefined) return null;

    const allLinesWithSamePO = lines.filter(
      (l) => String(l.poLineNumber).trim() === poLineNumStr,
    );

    const totalNewHoursForPO = allLinesWithSamePO.reduce((sum, l) => {
      const initialLine = initialLines.find((init) => init.id === l.id);
      const currentUITotal = Object.values(l.hours).reduce(
        (s, h) => s + (parseFloat(h) || 0),
        0,
      );
      const initialTotal = initialLine
        ? Object.values(initialLine.hours).reduce(
            (s, h) => s + (parseFloat(h) || 0),
            0,
          )
        : 0;

      return sum + (currentUITotal - initialTotal);
    }, 0);

    return (remaining - totalNewHoursForPO).toFixed(2);
  };

  const addLine = () =>
    setLines((prev) => [
      ...prev,
      createEmptyLine(`temp-${Date.now()}`, periodDates.length),
    ]);

  const handleSelectLine = (id) => {
    const newSelection = new Set(selectedLines);
    newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
    setSelectedLines(newSelection);
  };

  const deleteLines = () => {
    if (selectedLines.size === 0) {
      showToast("Please select lines to delete.", "warning");
      return;
    }

    if (timesheetData.Status?.toUpperCase() === "REJECTED") {
      showToast(
        "For rejected timesheets, hours will be zeroed out upon saving.",
        "info",
      );
      setLines((currentLines) =>
        currentLines.map((line) =>
          selectedLines.has(line.id)
            ? {
                ...line,
                hours: Object.keys(line.hours).reduce(
                  (acc, k) => ({ ...acc, [k]: 0 }),
                  {},
                ),
              }
            : line,
        ),
      );
    } else {
      setLines((currentLines) => {
        const idsToDelete = [...selectedLines].filter(
          (id) => typeof id === "number" || !String(id).startsWith("temp-"),
        );

        if (idsToDelete.length > 0)
          setLinesToDelete((prev) => [...new Set([...prev, ...idsToDelete])]);

        return currentLines.filter((line) => !selectedLines.has(line.id));
      });
    }
    setSelectedLines(new Set());
  };

  const dailyTotals = useMemo(() => {
    if (periodDates.length === 0) return {};
    const totals = {};
    periodDates.forEach((_, index) => {
      totals[index] = 0;
    });

    lines.forEach((line) => {
      Object.keys(line.hours).forEach((idx) => {
        totals[idx] = (totals[idx] || 0) + (parseFloat(line.hours[idx]) || 0);
      });
    });

    return totals;
  }, [lines, periodDates]);

  const copyLines = () => {
    if (selectedLines.size === 0) {
      showToast("Please select lines to copy.", "warning");
      return;
    }

    const linesToCopy = lines.filter((line) => selectedLines.has(line.id));
    const potentialTotals = { ...dailyTotals };
    let validationFailed = false;

    linesToCopy.forEach((lineToCopy) => {
      Object.keys(lineToCopy.hours).forEach((idx) => {
        potentialTotals[idx] =
          (potentialTotals[idx] || 0) +
          (parseFloat(lineToCopy.hours[idx]) || 0);

        if (potentialTotals[idx] > maxDailyHours) validationFailed = true;
      });
    });

    if (validationFailed) {
      showToast(
        `Cannot copy, as it would cause a daily total to exceed ${maxDailyHours} hours.`,
        "error",
      );
      return;
    }

    showToast("Line(s) copied.", "info");

    const newLines = linesToCopy.map((line, index) => ({
      ...line,
      hours: { ...line.hours },
      comments: { ...(line.comments || {}) },
      id: `temp-${Date.now()}-${index}`,
      hourIds: {},
    }));

    setLines((prev) => [...prev, ...newLines]);
    setSelectedLines(new Set());
  };

  const grandTotal = Object.values(dailyTotals).reduce(
    (sum, total) => sum + total,
    0,
  );

  const toggleColumnVisibility = (columnName) => {
    setHiddenColumns((prev) => ({ ...prev, [columnName]: !prev[columnName] }));
  };

  const showAllHiddenColumns = () => {
    const allVisible = {};
    Object.keys(hiddenColumns).forEach((col) => {
      allVisible[col] = false;
    });
    setHiddenColumns(allVisible);
  };

  const hasChangesToExistingData = useMemo(() => {
    if (
      linesToDelete.some(
        (id) => typeof id === "number" || !String(id).startsWith("temp-"),
      )
    ) {
      return true;
    }

    for (const currentLine of lines) {
      if (
        typeof currentLine.id === "number" ||
        !String(currentLine.id).startsWith("temp-")
      ) {
        const initialLine = initialLines.find((l) => l.id === currentLine.id);
        if (!initialLine) continue;

        const isLineChanged =
          currentLine.payType !== initialLine.payType ||
          currentLine.workOrder !== initialLine.workOrder ||
          currentLine.wa_Code !== initialLine.wa_Code ||
          currentLine.description !== initialLine.description;

        if (isLineChanged) return true;

        for (const idx of Object.keys(currentLine.hours)) {
          if (
            String(currentLine.hours[idx]) !== String(initialLine.hours[idx])
          ) {
            return true;
          }
          if (
            String(currentLine.comments?.[idx] || "") !==
            String(initialLine.comments?.[idx] || "")
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [lines, initialLines, linesToDelete]);

  const handleSaveWithReasonPrompt = () => {
    // const invalidDay = Object.values(dailyTotals).find(
    //   (val) => val > maxDailyHours,
    // );

    // if (invalidDay) {
    //   showToast(
    //     `Save failed: Total hours for one or more days exceed ${maxDailyHours}.`,
    //     "error",
    //   );
    //   return;
    // }
    const hasInvalidNonOTDay = Object.entries(dailyTotals).some(
      ([dayIndex, total]) => {
        if (total <= maxDailyHours) return false;

        // Calculate how much of this day's total comes from NON-overtime lines
        const nonOTTotalForDay = lines
          .filter((line) => {
            const pt = line.payType?.toLowerCase();
            return pt !== "so" && pt !== "overtime";
          })
          .reduce(
            (sum, line) => sum + (parseFloat(line.hours[dayIndex]) || 0),
            0,
          );

        // If non-OT hours alone exceed maxDailyHours, then it's an invalid block
        return nonOTTotalForDay > maxDailyHours;
      },
    );

    if (hasInvalidNonOTDay) {
      showToast(
        `Save failed: Total non-overtime hours for one or more days exceed ${maxDailyHours}. Please use the OT pay type for excess hours.`,
        "error",
      );
      return;
    }

    const currentStatus = timesheetData?.status
      ? timesheetData.status.toUpperCase()
      : "";
    const isOpen = currentStatus === "OPEN";

    if (isOpen) {
      handleSave("");
      return;
    }

    const linesToPost = lines.filter((line) =>
      String(line.id).startsWith("temp-"),
    );

    if (
      linesToPost.length > 0 ||
      hasChangesToExistingData ||
      linesToDelete.length > 0
    ) {
      setShowReasonPrompt(true);
    } else {
      handleSave("");
    }
  };

  const handleSave = async (reason = "") => {
    setIsCurrentlySaving(true);
    setShowReasonPrompt(false);
    setUpdateReason("");

    // const invalidDay = Object.values(dailyTotals).find(
    //   (val) => val > maxDailyHours,
    // );

    // if (invalidDay) {
    //   showToast(
    //     `Save failed: Total hours for one or more days exceed ${maxDailyHours}.`,
    //     "error",
    //   );
    //   setIsCurrentlySaving(false);
    //   return;
    // }
    const hasInvalidNonOTDay = Object.entries(dailyTotals).some(
      ([dayIndex, total]) => {
        if (total <= maxDailyHours) return false;

        const nonOTTotalForDay = lines
          .filter((line) => {
            const pt = line.payType?.toLowerCase();
            return pt !== "so" && pt !== "overtime";
          })
          .reduce(
            (sum, line) => sum + (parseFloat(line.hours[dayIndex]) || 0),
            0,
          );

        return nonOTTotalForDay > maxDailyHours;
      },
    );

    if (hasInvalidNonOTDay) {
      showToast(
        `Save failed: Total non-overtime hours for one or more days exceed ${maxDailyHours}. Please use the OT pay type for excess hours.`,
        "error",
      );
      setIsCurrentlySaving(false);
      return;
    }

    const promises = [];
    const API_BASE_URL = backendUrl;
    const now = new Date().toISOString();
    const resourceId = timesheetData["Employee ID"];

    linesToDelete.forEach((id) => {
      if (typeof id === "number" || !String(id).startsWith("temp-")) {
        promises.push(
          fetch(
            `${API_BASE_URL}/api/SubkTimesheet/${id}?reason=${encodeURIComponent(
              reason,
            )}`,
            { method: "DELETE" },
          ),
        );
      }
    });

    lines.forEach((currentLine) => {
      const initialLine = initialLines.find((l) => l.id === currentLine.id);

      if (!initialLine) {
        const payload = {
          Description: currentLine.description || "New Timesheet Line",
          ProjId: currentLine.project || "",
          Plc: currentLine.plc || "",
          PayType: currentLine.payType || "SR",
          PoNumber: currentLine.poNumber || "0000",
          RlseNumber: currentLine.rlseNumber || "0",
          Resource_Id: String(userId),
          WorkOrder: currentLine.wa_Code,
          Pm_User_Id: currentLine.pmUserID || "",
          PoLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,
          Timesheet_Date: new Date(timesheetData.Date)
            .toISOString()
            .split("T")[0],
          CreatedBy: String(currentUser?.name),
          UpdatedAt: now,
          UpdatedBy: String(currentUser?.name),
          UpdateReason: reason,
          TimesheetHours: periodDates.map((dateInfo, idx) => {
            let hourValue = parseFloat(currentLine.hours[idx]);
            if (isNaN(hourValue)) hourValue = 0;
            const hourComment = currentLine.comments?.[idx] || "";

            return {
              Ts_Date: dateInfo.apiDate,
              Hours: hourValue,
              CreatedBy: String(currentUser?.name),
              UpdatedBy: String(currentUser?.name),
              comment: hourComment,
              Comment: hourComment,
            };
          }),
        };

        promises.push(
          fetch(`${API_BASE_URL}/api/SubkTimesheet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }),
        );
      } else {
        const isLineChanged =
          currentLine.payType !== initialLine.payType ||
          currentLine.workOrder !== initialLine.workOrder ||
          currentLine.wa_Code !== initialLine.wa_Code ||
          currentLine.description !== initialLine.description;

        if (isLineChanged) {
          const updatePayload = {
            lineNo: currentLine.id,
            description: currentLine.description,
            projId: currentLine.project,
            plc: currentLine.plc,
            payType: currentLine.payType,
            poNumber: currentLine.poNumber,
            rlseNumber: currentLine.rlseNumber,
            resource_Id: String(userId),
            pm_User_Id: currentLine.pmUserID,
            poLineNumber: parseInt(currentLine.poLineNumber, 10) || 0,
            rvsnNumber: 0,
            timesheet_Date: new Date(timesheetData.Date)
              .toISOString()
              .split("T")[0],
            workOrder: currentLine.wa_Code,
            updatedAt: now,
            updatedBy: String(currentUser?.name),
            createdBy: String(currentUser?.name),
            createdAt: timesheetDetails?.createdAt || now,
            hours: 0,
            status: timesheetData.Status || "OPEN",
            UpdateReason: reason,
          };

          promises.push(
            fetch(`${API_BASE_URL}/api/SubkTimesheet/${currentLine.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatePayload),
            }),
          );
        }

        Object.keys(currentLine.hours).forEach((idx) => {
          const initialHour = initialLine.hours[idx];
          const currentHour = currentLine.hours[idx];
          const initialComment = initialLine.comments?.[idx] || "";
          const currentComment = currentLine.comments?.[idx] || "";

          if (
            String(initialHour) !== String(currentHour) ||
            String(initialComment) !== String(currentComment)
          ) {
            const hourId = currentLine.hourIds[idx];
            let hourValue = parseFloat(currentHour);
            if (isNaN(hourValue)) hourValue = 0;

            const url = `${API_BASE_URL}/api/TimesheetHours/upsert`;
            const payload = {
              id: hourId || 0,
              ts_Date: periodDates[idx].apiDate,
              hours: hourValue,
              lineNo: currentLine.id,
              CreatedBy: String(currentUser?.name),
              UpdatedBy: String(currentUser?.name),
              comment: currentComment || reason || updateReason || "",
              Comment: currentComment || reason || updateReason || "",
            };

            promises.push(
              fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              }),
            );
          }
        });
      }
    });

    if (promises.length === 0) {
      showToast("No changes to save.", "info");
      setIsCurrentlySaving(false);
      return;
    }

    try {
      const responses = await Promise.all(promises);
      for (const response of responses) {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to save changes: ${errorText}`);
        }
      }

      showToast("Timesheet saved successfully!", "success");
      onSave();
      setIsCurrentlySaving(false);
    } catch (error) {
      showToast(error.message, "error");
      console.error("Save error:", error);
      setIsCurrentlySaving(false);
    }
  };

  const isLineDisabled = (line) => {
    if (!isEditable) return true;
    if (timesheetData?.Status?.toUpperCase() === "CORRECTION")
      return line.isInvoiced === true;
    return false;
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;

  const workOrderOptions = Array.from(
    new Map(
      purchaseOrderData.flatMap((item) =>
        (item.resourceDesc || []).map((desc) => {
          const label = `${item.wa_Code} - ${desc}`;
          return [label, { value: label, label: label }];
        }),
      ),
    ).values(),
  );

  const availableHideableColumns = hideableColumns.filter((col) =>
    col === "PO Remaining Hours" ? isAdmin : true,
  );

  const hiddenCount = Object.entries(hiddenColumns).filter(
    ([key, val]) => val && (key === "PO Remaining Hours" ? isAdmin : true),
  ).length;

  const hiddenColumnsList = Object.entries(hiddenColumns)
    .filter(
      ([col, isHidden]) =>
        isHidden && (col === "PO Remaining Hours" ? isAdmin : true),
    )
    .map(([col]) => col);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 w-full max-w-[95vw] font-inter">
      {showReasonPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw] shadow-2xl border border-gray-100 animate-premium-popup">
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Reason for Timesheet Update
              </h3>
              <textarea
                rows="3"
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs text-black"
                value={updateReason}
                onChange={(e) => setUpdateReason(e.target.value)}
                placeholder="E.g., Corrected hours for Monday, switched project code."
              />
              <div className="mt-4 flex justify-end gap-2">
                <ActionButton
                  onClick={() => {
                    setShowReasonPrompt(false);
                    setUpdateReason("");
                    setIsCurrentlySaving(false);
                  }}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  onClick={() => handleSave(updateReason)}
                  disabled={!updateReason.trim() || isCurrentlySaving}
                >
                  {isCurrentlySaving ? "Saving..." : "Confirm & Save"}
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-1">
            Timesheet Details
          </h2>
          {timesheetDetails && (
            <div className="flex gap-4 text-xs text-black flex-wrap font-medium">
              <div>
                <span className="font-semibold text-gray-700">Status:</span>{" "}
                <span className="font-bold text-[#17414d]">
                  {timesheetData.Status
                    ? timesheetData.Status.charAt(0).toUpperCase() +
                      timesheetData.Status.slice(1).toLowerCase()
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Date:</span>{" "}
                {timesheetDetails?.timesheet_Date
                  ? formatDate(timesheetDetails.timesheet_Date)
                  : "N/A"}
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Approved By:
                </span>{" "}
                {timesheetDetails?.approvedBy || "N/A"}
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Approved Date:
                </span>{" "}
                {timesheetDetails?.approvedDate
                  ? formatDate(timesheetDetails.approvedDate)
                  : "N/A"}
              </div>
            </div>
          )}

          {/* Timesheet Schedule Period Selector Dropdown */}
           {schedulePeriods.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-semibold text-gray-700">
                Period:
              </span>
              <select
                value={selectedPeriodId || ""}
                // disabled
                onChange={(e) => setSelectedPeriodId(Number(e.target.value))}
                className="bg-gray-100 cursor-not-allowed text-gray-500 px-2 py-1 text-xs border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {schedulePeriods.map((p) => (
                  <option key={p.periodId} value={p.periodId}>
                    {formatDate(p.periodStartDate)} -{" "}
                    {formatDate(p.periodEndDate)}{" "}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isEditable && (
            <>
              <ActionButton onClick={addLine}>Add</ActionButton>
              <ActionButton
                onClick={copyLines}
                disabled={selectedLines.size === 0}
              >
                Copy
              </ActionButton>
              {timesheetData?.Status?.toUpperCase() !== "CORRECTION" && (
                <ActionButton
                  onClick={deleteLines}
                  disabled={selectedLines.size === 0}
                >
                  Delete
                </ActionButton>
              )}
            </>
          )}
          <ActionButton onClick={onClose}>Cancel</ActionButton>
          {isEditable && (
            <ActionButton
              onClick={handleSaveWithReasonPrompt}
              disabled={isSaving || isCurrentlySaving}
            >
              {isCurrentlySaving ? "Saving..." : "Save"}
            </ActionButton>
          )}
        </div>
      </div>

      {hiddenCount > 0 && (
        <div className="bg-[#e9f6fb] border border-blue-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3 flex-wrap mb-3">
          <div className="flex items-center gap-2">
            <EyeIcon className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">
              {hiddenCount} column{hiddenCount > 1 ? "s" : ""} hidden:
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {hiddenColumnsList.map((col) => (
              <button
                key={col}
                onClick={() => toggleColumnVisibility(col)}
                className="inline-flex items-center px-2.5 py-1 bg-white hover:bg-blue-100 border border-blue-300 rounded-full text-xs font-medium text-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                {col}
              </button>
            ))}
            <button
              onClick={showAllHiddenColumns}
              className="btn1 btn-blue !py-0.5 !px-2.5 text-xs font-medium cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-300 scrollbar-thin">
        <table className="w-full text-xs min-w-[1600px] border-collapse">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center w-10"></th>
              <th className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center w-12">
                Line
              </th>
              {availableHideableColumns.map(
                (col) =>
                  !hiddenColumns[col] && (
                    <th
                      key={col}
                      className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center"
                    >
                      <div className="flex items-center justify-between gap-2 group px-1">
                        <span className="flex-1 text-center">{col}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleColumnVisibility(col);
                          }}
                          className="p-1 hover:bg-blue-100 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Hide column"
                          type="button"
                        >
                          <MinusCircleIcon className="h-3.5 w-3.5 text-gray-500 hover:text-gray-800" />
                        </button>
                      </div>
                    </th>
                  ),
              )}
              {periodDates.map((dateInfo) => (
                <th
                  key={dateInfo.apiDate}
                  className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center min-w-[75px]"
                >
                  {dateInfo.display}
                </th>
              ))}
              <th className="px-2 py-1.5 whitespace-nowrap border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {lines.map((line, index) => {
              const rowTotal = Object.values(line.hours)
                .reduce((s, h) => s + (parseFloat(h) || 0), 0)
                .toFixed(2);

              const isDisabled = isLineDisabled(line);

              return (
                <tr
                  key={line.id}
                  className="hover:bg-sky-50/50 transition-colors"
                >
                  <td className="px-2 py-1 text-center whitespace-nowrap border-r border-b border-gray-300">
                    <input
                      type="checkbox"
                      className={`rounded border-gray-300 ${
                        !isEditable
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer accent-blue-600"
                      }`}
                      checked={selectedLines.has(line.id)}
                      onChange={() => handleSelectLine(line.id)}
                      disabled={!isEditable}
                    />
                  </td>
                  <td className="px-2 py-1 text-center whitespace-nowrap border-r border-b border-gray-300 text-black font-medium">
                    {index + 1}
                  </td>
                  {hideableColumns.includes("Work Order") &&
                    !hiddenColumns["Work Order"] && (
                      <td className="p-1 border-r border-b border-gray-300 min-w-[250px]">
                        <CascadingSelect
                          label="Work Order"
                          options={workOrderOptions}
                          value={line.workOrder}
                          onChange={(e) =>
                            handleSelectChange(
                              line.id,
                              "workOrder",
                              e.target.value,
                            )
                          }
                          disabled={isDisabled}
                        />
                      </td>
                    )}
                  {hideableColumns.includes("Description") &&
                    !hiddenColumns["Description"] && (
                      <td className="p-1 border-r border-b border-gray-300 min-w-[200px]">
                        <input
                          type="text"
                          value={line.description}
                          className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
                          readOnly
                        />
                      </td>
                    )}
                  {hideableColumns.includes("Project") &&
                    !hiddenColumns["Project"] && (
                      <td className="p-1 border-r border-b border-gray-300 min-w-[150px]">
                        {role !== "fbsdusbcsdnjsbhasbx" ? (
                          <select
                            value={line.project}
                            onChange={(e) => {
                              const selectedProjId = e.target.value;
                              const matchedEntry = employeeProjects.find(
                                (proj) => proj.projId === selectedProjId,
                              );

                              setLines((currentLines) =>
                                currentLines.map((l) =>
                                  l.id === line.id
                                    ? {
                                        ...l,
                                        project: selectedProjId,
                                        projectName: matchedEntry
                                          ? matchedEntry.projectName ||
                                            matchedEntry?.projName
                                          : "",
                                        plc: matchedEntry
                                          ? matchedEntry.billLabCatCd
                                          : "",
                                        plcDesc: matchedEntry
                                          ? matchedEntry.plcDesc
                                          : "",
                                        pmUserID: matchedEntry
                                          ? matchedEntry.pm_UserId || ""
                                          : "",
                                      }
                                    : l,
                                ),
                              );
                            }}
                            disabled={isDisabled}
                            className={`w-full bg-white px-2 py-1 text-xs border border-gray-300 rounded shadow-inner text-black ${
                              isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                          >
                            <option value="">Select Project</option>
                            {employeeProjects.map((proj) => (
                              <option key={proj.projId} value={proj.projId}>
                                {proj.projId} (LabCat: {proj.billLabCatCd})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={line.project}
                            className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
                            readOnly
                          />
                        )}
                      </td>
                    )}
                  {hideableColumns.includes("Project Name") &&
                    !hiddenColumns["Project Name"] && (
                      <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
                        <input
                          type="text"
                          value={line.projectName || line.projName}
                          className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
                          readOnly
                        />
                      </td>
                    )}
                  {hideableColumns.includes("PLC") && !hiddenColumns["PLC"] && (
                    <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
                      <input
                        type="text"
                        value={line.plc}
                        className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
                        readOnly
                      />
                    </td>
                  )}
                  {hideableColumns.includes("PLC Description") &&
                    !hiddenColumns["PLC Description"] && (
                      <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
                        <input
                          type="text"
                          value={line.plcDesc}
                          className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
                          readOnly
                        />
                      </td>
                    )}
                  {hideableColumns.includes("Pay Type") &&
                    !hiddenColumns["Pay Type"] && (
                      <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
                        <select
                          value={line.payType}
                          onChange={(e) =>
                            handleSelectChange(
                              line.id,
                              "payType",
                              e.target.value,
                            )
                          }
                          className={`w-full bg-white px-2 py-1 text-xs border border-gray-300 rounded shadow-inner text-black ${
                            isDisabled
                              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={isDisabled}
                        >
                          <option value="SR">Regular</option>
                          <option value="SO">Overtime</option>
                        </select>
                      </td>
                    )}
                  {hideableColumns.includes("PO Number") &&
                    !hiddenColumns["PO Number"] && (
                      <td className="p-1 border-r border-b border-gray-300 min-w-[150px]">
                        <input
                          type="text"
                          value={line.poNumber}
                          className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
                          readOnly
                        />
                      </td>
                    )}
                  {hideableColumns.includes("RLSE Number") &&
                    !hiddenColumns["RLSE Number"] && (
                      <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
                        <input
                          type="text"
                          value={line.rlseNumber}
                          className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
                          readOnly
                        />
                      </td>
                    )}
                  {hideableColumns.includes("PO Line Number") &&
                    !hiddenColumns["PO Line Number"] && (
                      <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
                        <input
                          type="text"
                          value={line.poLineNumber}
                          className="w-full bg-gray-50 px-2 py-1 border border-gray-300 rounded text-xs text-black shadow-inner"
                          readOnly
                        />
                      </td>
                    )}
                  {isAdmin &&
                    hideableColumns.includes("PO Remaining Hours") &&
                    !hiddenColumns["PO Remaining Hours"] && (
                      <td className="p-1 border-r border-b border-gray-300 min-w-[120px]">
                        {line.poLineNumber &&
                        remainingPoHours[String(line.poLineNumber).trim()] !==
                          undefined ? (
                          <div className="text-xs font-medium text-center">
                            <span
                              className={`font-semibold ${
                                parseFloat(getRemainingHoursForLine(line)) < 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {getRemainingHoursForLine(line)} hrs
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs font-medium text-center text-gray-400">
                            -
                          </div>
                        )}
                      </td>
                    )}
                  {periodDates.map((dateInfo, dayIndex) => {
                    const days = [
                      "sunday",
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                    ];
                    const dayIndexUtc = dateInfo.obj.getUTCDay();
                    const dayName = days[dayIndexUtc];
                    const isWeekend = configWeekends.includes(dayName);

                    // Find the corresponding pay type object for this line from your payTypes state/prop list
                    const currentPayTypeConfig = payTypes.find(
                      (pt) =>
                        pt.name === line.payType || pt.id === line.payType,
                    );

                    // Check future date restriction using the pay type's configuration if available,
                    // defaulting to standard future date check if not found.
                    const isSystemFutureDate =
                      dateInfo.obj.getUTCFullYear() > today.getUTCFullYear() ||
                      (dateInfo.obj.getUTCFullYear() ===
                        today.getUTCFullYear() &&
                        dateInfo.obj.getUTCMonth() > today.getUTCMonth()) ||
                      (dateInfo.obj.getUTCFullYear() ===
                        today.getUTCFullYear() &&
                        dateInfo.obj.getUTCMonth() === today.getUTCMonth() &&
                        dateInfo.obj.getUTCDate() > today.getUTCDate());

                    // If current payType config defines 'isFuture', respect it (e.g. if isFuture is false, disable future dates)
                    const allowsFuture = currentPayTypeConfig
                      ? currentPayTypeConfig.isFuture
                      : true;
                    const isFutureDate = isSystemFutureDate && !allowsFuture;

                    const finalDisabled = isDisabled || isFutureDate;
                    const dayTotal = dailyTotals[dayIndex] || 0;

                    // Check if this specific line is overtime using the pay type config flag `isOvertime`
                    const isLineOvertime = currentPayTypeConfig
                      ? currentPayTypeConfig.isOvertime
                      : line.payType?.toLowerCase() === "ot" ||
                        line.payType?.toLowerCase() === "overtime" ||
                        line.payType === "SO";

                    // Only flag exceededMax with red styling if the day total exceeds max AND it's not purely covered by overtime pay types
                    const exceededMax =
                      dayTotal > maxDailyHours && !isLineOvertime;

                    let inputClasses = `w-[72px] text-right pl-1.5 pr-6 py-1 text-xs border border-gray-300 rounded shadow-inner text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none `;
                    let inputStyle = {};

                    if (isWeekend && configHighlightColor) {
                      inputStyle.backgroundColor = configHighlightColor;
                    }
                    if (!inputStyle.backgroundColor && isWeekend) {
                      inputClasses += "bg-gray-100 ";
                    } else if (!inputStyle.backgroundColor) {
                      inputClasses += "bg-white ";
                    }

                    if (exceededMax) {
                      inputStyle.backgroundColor = "";
                      inputClasses = inputClasses
                        .replace("bg-gray-100", "")
                        .replace("bg-white", "");
                      inputClasses +=
                        // "bg-red-100 border-red-500 text-red-800 font-bold ";
                        "bg-white";
                    } else if (finalDisabled) {
                      inputClasses = inputClasses.replace("bg-white", "");
                      if (isWeekend && configHighlightColor) {
                        inputClasses = inputClasses.replace("bg-gray-100", "");
                      } else {
                        inputStyle.backgroundColor = "";
                        inputClasses += "bg-gray-100 ";
                      }
                      inputClasses += " text-gray-500 cursor-not-allowed ";
                    } else {
                      inputClasses +=
                        " focus:outline-none focus:ring-1 focus:ring-blue-500 ";
                    }

                    const dayComment = line.comments?.[dayIndex] || "";
                    const hasComment = Boolean(
                      dayComment && dayComment.trim() !== "",
                    );
                    let cellTitle = "";
                    if (hasComment) {
                      cellTitle = `Comment: ${dayComment}`;
                    }

                    return (
                      <td
                        key={dateInfo.apiDate}
                        className="p-1 border-r border-b border-gray-300 text-center"
                      >
                        <div
                          className="relative inline-flex items-center group"
                          onMouseEnter={(e) => {
                            if (!hasComment) return;
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            setHoveredComment({
                              text: dayComment,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                            });
                          }}
                          onMouseLeave={() => setHoveredComment(null)}
                        >
                          <input
                            type="number"
                            step="0.5"
                            value={
                              line.hours[dayIndex] === 0 ||
                              line.hours[dayIndex] === ""
                                ? ""
                                : line.hours[dayIndex]
                            }
                            onChange={(e) =>
                              handleHourChange(
                                line.id,
                                dayIndex,
                                e.target.value,
                              )
                            }
                            title={cellTitle}
                            className={inputClasses}
                            style={inputStyle}
                            disabled={finalDisabled}
                          />
                          {(isEditable || hasComment) && (
                            <button
                              type="button"
                              onClick={() =>
                                openCommentModal(
                                  line.id,
                                  dayIndex,
                                  dateInfo.display,
                                  !isEditable,
                                )
                              }
                              className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded cursor-pointer transition-all ${
                                hasComment
                                  ? "text-blue-600 opacity-100 hover:text-blue-800"
                                  : "text-gray-400 opacity-0 group-hover:opacity-80 hover:text-gray-700"
                              }`}
                            >
                              <CommentIcon className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-2 py-1 text-right font-bold text-black border-b border-gray-300 pr-3">
                    {rowTotal}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t-2 border-gray-300 bg-[#e5f3fb] font-semibold text-black text-xs">
            <tr>
              <td
                colSpan={
                  2 +
                  availableHideableColumns.filter((col) => !hiddenColumns[col])
                    .length
                }
                className="px-3 py-2 text-right font-bold text-black border-r border-gray-300"
              >
                Total Hours
              </td>
              {periodDates.map((_, idx) => (
                <td
                  key={idx}
                  className="px-2 py-2 text-center border-r border-gray-300"
                >
                  <div
                    className={`w-16 mx-auto ${
                      // dailyTotals[idx] > maxDailyHours
                      //   ? "text-red-700 font-bold"
                      // :
                      "text-black font-semibold"
                    }`}
                  >
                    {dailyTotals[idx] ? dailyTotals[idx].toFixed(2) : "0.00"}
                  </div>
                </td>
              ))}
              <td className="px-3 py-2 text-right font-bold text-black pr-3">
                {grandTotal.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {commentModal.isOpen && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg p-5 w-full max-w-md shadow-xl border border-gray-200 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <CommentIcon className="w-4 h-4 text-[#1e3a5f]" />
                <h3 className="text-sm font-bold text-gray-900">
                  {commentModal.isReadOnly
                    ? "View Hour Comment"
                    : "Hour Comment"}
                  {commentModal.dateLabel ? ` (${commentModal.dateLabel})` : ""}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeCommentModal}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold leading-none p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <label className="block text-xs font-semibold text-gray-700">
                Comment for {commentModal.dateLabel || "selected date"}:
              </label>
              <textarea
                rows={4}
                disabled={commentModal.isReadOnly}
                value={commentModal.comment}
                onChange={(e) =>
                  setCommentModal((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                placeholder={
                  commentModal.isReadOnly
                    ? "No comment added."
                    : "Enter comment / note for this day's hours..."
                }
                className={`w-full text-xs p-2.5 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  commentModal.isReadOnly
                    ? "bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300"
                    : "bg-white text-black border-gray-300"
                }`}
                autoFocus={!commentModal.isReadOnly}
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div>
                {!commentModal.isReadOnly && commentModal.comment && (
                  <button
                    type="button"
                    onClick={() => saveComment("")}
                    className="text-xs text-red-600 hover:text-red-800 hover:underline font-medium cursor-pointer"
                  >
                    Clear Comment
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ActionButton onClick={closeCommentModal} className="!text-xs">
                  {commentModal.isReadOnly ? "Close" : "Cancel"}
                </ActionButton>
                {!commentModal.isReadOnly && (
                  <ActionButton
                    onClick={() => saveComment(commentModal.comment)}
                    className="!text-xs"
                  >
                    Save Comment
                  </ActionButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {hoveredComment && (
        <div
          style={{
            position: "fixed",
            left: `${hoveredComment.x}px`,
            top: `${hoveredComment.y - 6}px`,
            transform: "translate(-50%, -100%)",
            zIndex: 12000,
          }}
          className="pointer-events-none p-2 bg-gray-900 text-white text-xs rounded-md shadow-xl max-w-xs whitespace-normal break-words animate-in fade-in duration-100"
        >
          <div className="font-semibold text-sky-300 text-[10px] uppercase tracking-wider mb-0.5">
            Comment:
          </div>
          <div className="text-[11px] leading-relaxed whitespace-pre-wrap">
            {hoveredComment.text}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
