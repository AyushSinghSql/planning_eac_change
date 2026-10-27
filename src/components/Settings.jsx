// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Clock,
//   MessageSquare,
//   Download,
//   Receipt,
//   Package,
//   Users,
//   Settings as SettingsIcon,
//   Save,
//   Edit2,
//   Trash2,
//   X,
//   Settings2,
// } from "lucide-react";
// import { backendUrl } from "./config";

// // Toast notification utility
// const showToast = (message, type = "info") => {
//   const bgColor =
//     type === "success"
//       ? "#4ade80"
//       : type === "error"
//         ? "#ef4444"
//         : type === "warning"
//           ? "#f59e0b"
//           : "#3b82f6";

//   const toast = document.createElement("div");
//   toast.textContent = message;
//   toast.style.cssText = `
//     position: fixed;
//     top: 20px;
//     right: 20px;
//     z-index: 9999;
//     background: ${bgColor};
//     color: white;
//     padding: 12px 16px;
//     border-radius: 6px;
//     font-size: 14px;
//     max-width: 300px;
//     box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//     transition: all 0.3s ease;
//   `;

//   document.body.appendChild(toast);

//   setTimeout(() => {
//     toast.style.opacity = "0";
//     setTimeout(() => document.body.removeChild(toast), 300);
//   }, 1000);
// };

// const Settings = () => {
//   const navigate = useNavigate();
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userLoaded, setUserLoaded] = useState(false);

//   // Config Values states
//   const [woPrefix, setWoPrefix] = useState("");
//   const [woSuffixLength, setWoSuffixLength] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [configValues, setConfigValues] = useState([]);

//   // Workflow configuration states
//   const [workflowPM, setWorkflowPM] = useState(false);
//   const [workflowSupervisor, setWorkflowSupervisor] = useState(false);

//   // New states for email redirect config
//   const [allowEmailRedirect, setAllowEmailRedirect] = useState(false);
//   const [redirectEmailTo, setRedirectEmailTo] = useState("");
//   // Store both value and id for each config to pass id on save
//   const [allowEmailRedirectId, setAllowEmailRedirectId] = useState(0);
//   const [importLoading, setImportLoading] = useState(false);
//   const [redirectEmailToId, setRedirectEmailToId] = useState(0);
//   const [allowEmailNotification, setAllowEmailNotification] = useState(false);
//   const [allowEmailNotificationId, setAllowEmailNotificationId] = useState(0);
//   const [notificaionEmailToId, setNotificaionEmailToId] = useState(0);
//   const [rows, setRows] = useState([]);
//   const [configLoading, setConfigLoading] = useState(false);
//   const [editIdx, setEditIdx] = useState(null);
//   const [prevRow, setPrevRow] = useState(null);
//   const [loadingWorkflow, setLoadingWorkflow] = useState(false);
//   const [timesheetPeriod, setTimesheetPeriod] = useState("");
//   const [weekendDays, setWeekendDays] = useState([]); // e.g. ["SAT","SUN"]
//   const [maxHoursPerDay, setMaxHoursPerDay] = useState("8");
//   const [hardEdit, setHardEdit] = useState(false);
//   const [weekendHighlightColor, setWeekendHighlightColor] = useState("#ef4444");

//   const WEEK_DAYS = [
//     { value: "monday", label: "Mon" },
//     { value: "tuesday", label: "Tue" },
//     { value: "wednesday", label: "Wed" },
//     { value: "thursday", label: "Thu" },
//     { value: "friday", label: "Fri" },
//     { value: "saturday", label: "Sat" },
//     { value: "sunday", label: "Sun" },
//   ];

//   const [originalValues, setOriginalValues] = useState({
//     woPrefix: "",
//     woSuffixLength: "",
//     workflowPM: false,
//     workflowSupervisor: false,
//     allowEmailRedirect: false,
//     redirectEmailTo: "",
//     allowEmailNotification: false,
//     timesheetPeriod: "",
//     weekendDays: [],
//     maxHoursPerDay: "8",
//     hardEdit: false,
//     weekendHighlightColor: "#ef4444",
//   });

//   useEffect(() => {
//     const userInfo = localStorage.getItem("currentUser");
//     if (userInfo) {
//       try {
//         const parsedUser = JSON.parse(userInfo);
//         setCurrentUser(parsedUser);
//         setUserLoaded(true);
//       } catch (error) {
//         console.error("Error parsing user info:", error);
//         navigate("/");
//       }
//     } else {
//       navigate("/");
//     }
//   }, [navigate]);

//   // Load config values when component mounts
//   useEffect(() => {
//     if (userLoaded && currentUser) {
//       loadConfigValues();
//     }
//   }, [userLoaded, currentUser]);

//   const loadConfigValues = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(`${backendUrl}/api/ConfigValues`);

//       if (!response.ok) {
//         throw new Error("Failed to fetch config values");
//       }

//       const data = await response.json();
//       setConfigValues(data);

//       // Set work order values
//       const prefixConfig = data.find((config) => config.name === "WO_Prefix");
//       const suffixConfig = data.find(
//         (config) => config.name === "WO_SuffixLength",
//       );

//       let loadedWoPrefix = "";
//       let loadedWoSuffixLength = "";

//       if (prefixConfig) {
//         loadedWoPrefix = prefixConfig.value;
//         setWoPrefix(prefixConfig.value);
//       }

//       if (suffixConfig) {
//         loadedWoSuffixLength = suffixConfig.value;
//         setWoSuffixLength(suffixConfig.value);
//       }

//       // Set workflow values
//       let loadedWorkflowPM = false;
//       let loadedWorkflowSupervisor = false;

//       const workflowConfig = data.find((config) => config.name === "Workflow");
//       if (workflowConfig && workflowConfig.value) {
//         const workflowValues = workflowConfig.value
//           .split(",")
//           .map((v) => v.trim());
//         loadedWorkflowPM = workflowValues.includes("PM");
//         loadedWorkflowSupervisor = workflowValues.includes("Supervisor");
//         setWorkflowPM(loadedWorkflowPM);
//         setWorkflowSupervisor(loadedWorkflowSupervisor);
//       }

//       // Additional email-related config values
//       const redirectConfig = data.find(
//         (item) => item.name === "ALLOW_EMAIL_REDIRECT",
//       );
//       const emailConfig = data.find(
//         (item) => item.name === "REDIRECT_EMAIL_TO",
//       );
//       const emailNotification = data.find(
//         (item) => item.name === "EMAIL_NOTIFICATION",
//       );

//       if (redirectConfig) {
//         setAllowEmailRedirect(redirectConfig.value === "true");
//         setAllowEmailRedirectId(redirectConfig.id);
//       }
//       if (emailConfig) {
//         setRedirectEmailTo(emailConfig.value);
//         setRedirectEmailToId(emailConfig.id);
//       }
//       if (emailNotification) {
//         setAllowEmailNotification(emailNotification.value === "true");
//         setAllowEmailNotificationId(emailNotification.id);
//       }

//       const timesheetPeriodConfig = data.find(
//         (config) => config.name === "timesheet_period",
//       );
//       let loadedTimesheetPeriod = "";
//       if (timesheetPeriodConfig) {
//         loadedTimesheetPeriod = timesheetPeriodConfig.value;
//         setTimesheetPeriod(timesheetPeriodConfig.value);
//       }

//       const weekendConfig = data.find((config) => config.name === "weekend");
//       let loadedWeekendDays = [];
//       if (weekendConfig && weekendConfig.value) {
//         loadedWeekendDays = weekendConfig.value
//           .split(",")
//           .map((v) => v.trim())
//           .filter(Boolean);
//         setWeekendDays(loadedWeekendDays);
//       }

//       const maxHoursConfig = data.find(
//         (config) => config.name === "max_daily_hours",
//       );
//       const hardEditConfig = data.find((config) => config.name === "hard_edit");

//       let loadedMaxHours = "8";
//       let loadedHardEdit = false;

//       if (maxHoursConfig) {
//         loadedMaxHours = maxHoursConfig.value;
//         setMaxHoursPerDay(maxHoursConfig.value);
//       }
//       if (hardEditConfig) {
//         loadedHardEdit = hardEditConfig.value === "true";
//         setHardEdit(loadedHardEdit);
//       }

//       const weekendColorConfig = data.find(
//         (config) => config.name === "weekend_highlight_color",
//       );
//       let loadedWeekendColor = "#ef4444";
//       if (weekendColorConfig) {
//         loadedWeekendColor = weekendColorConfig.value;
//         setWeekendHighlightColor(weekendColorConfig.value);
//       }

//       setOriginalValues({
//         woPrefix: loadedWoPrefix,
//         woSuffixLength: loadedWoSuffixLength,
//         workflowPM: loadedWorkflowPM,
//         workflowSupervisor: loadedWorkflowSupervisor,
//         allowEmailRedirect: redirectConfig
//           ? redirectConfig.value === "true"
//           : false,
//         redirectEmailTo: emailConfig ? emailConfig.value : "",
//         allowEmailNotification: emailNotification
//           ? emailNotification.value === "true"
//           : false,
//         timesheetPeriod: loadedTimesheetPeriod,
//         weekendDays: loadedWeekendDays,
//         maxHoursPerDay: loadedMaxHours,
//         hardEdit: loadedHardEdit,
//         weekendHighlightColor: loadedWeekendColor,
//       });
//     } catch (error) {
//       console.error("Error loading config values:", error);
//       showToast("Failed to load configuration values", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetch(`${backendUrl}/api/ApprovalWorkflow`)
//       .then((res) => res.json())
//       .then((data) => {
//         // Map API data to rows with keys level and name
//         const mapped = data.map((item) => ({
//           workflowId: item.workflowId,
//           level: item.levelNo,
//           name: item.approverRole,
//           isMandetory: item.isMandetory,
//           requestType: item.requestType,
//         }));
//         setRows(mapped);
//       })
//       .catch((err) => {
//         console.error("Failed to load workflow data", err);
//       })
//       .finally(() => {
//         setConfigLoading(false); // Stop loading regardless of success or failure
//       });
//   }, []);

//   // Add a blank row
//   const handleInputChange = (idx, field, value) => {
//     const updated = [...rows];
//     updated[idx][field] = value;
//     setRows(updated);
//   };

//   const addRow = () => {
//     setRows([
//       ...rows,
//       {
//         workflowId: 0,
//         level: "",
//         name: "",
//         isMandetory: false,
//         requestType: "TIMESHEET",
//       },
//     ]);
//   };

//   const cancelRow = (index) => {
//     setRows((prevRows) => prevRows.filter((_, idx) => idx !== index));
//   };

//   const handleCancel = (idx) => {
//     if (!rows[idx].workflowId || rows[idx].workflowId === 0) {
//       cancelRow(idx); // Safe to remove new rows
//     } else {
//       const updatedRows = [...rows];
//       updatedRows[idx] = prevRow; // Restore previous data
//       setRows(updatedRows);
//       setEditIdx(null);
//       setPrevRow(null);
//     }
//   };

//   const handleEdit = (idx) => {
//     setEditIdx(idx);
//     setPrevRow({ ...rows[idx] }); // store a copy
//   };

//   // const handleDeleteRow = async (idx) => {
//   //   const row = rows[idx];
//   //   if (row.workflowId) {
//   //     // Replace DELETE call with actual API as needed
//   //     await fetch(`${backendUrl}/api/ApprovalWorkflow/${row.workflowId}`, {
//   //       method: "DELETE",
//   //     });
//   //   }
//   //   setRows(rows.filter((_, i) => i !== idx));
//   // };

//   const handleDeleteRow = async (idx) => {
//     const row = rows[idx];

//     // showToast("Deleting...", "info"); // show info toast on start

//     try {
//       if (row.workflowId) {
//         // Replace DELETE call with actual API as needed
//         await fetch(`${backendUrl}/api/ApprovalWorkflow/${row.workflowId}`, {
//           method: "DELETE",
//         });
//       }

//       setRows(rows.filter((_, i) => i !== idx));
//       showToast(" deleted successfully.", "success"); // success toast on completion
//     } catch (error) {
//       console.error("Delete error:", error);
//       showToast("Failed to delete row", "error"); // error toast on failure
//     }
//   };

//   const handleSaveWorkflow = (idx) => {
//     setLoadingWorkflow(true);
//     // showToast("Saving...", "info");
//     const row = rows[idx];

//     // Determine if it is a new row (no ID or 0), then POST, else call update
//     if (!row.workflowId || row.workflowId === 0) {
//       // Create new workflow entry
//       fetch(`${backendUrl}/api/ApprovalWorkflow`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           requestType: row.requestType || "TIMESHEET", // default to TIMESHEET or your value
//           levelNo: Number(row.level),
//           approverRole: row.name,
//           isMandetory: Boolean(row.isMandetory),
//         }),
//       })
//         .then((res) => {
//           if (!res.ok) throw new Error("Save failed");
//           return res.json();
//         })
//         .then((savedItem) => {
//           showToast("Workflow saved successfully.");
//           // Update local row with returned workflowId if needed
//           const updatedRows = [...rows];
//           updatedRows[idx] = {
//             ...updatedRows[idx],
//             workflowId: savedItem.workflowId, // assuming API returns this
//           };
//           setRows(updatedRows);
//         })
//         .catch((err) => {
//           console.error("Error saving workflow:", err);
//           showToast("Failed to save workflow.");
//         })
//         .finally(() => setLoadingWorkflow(false));
//     } else {
//       // Update existing workflow
//       handleUpdate(idx);
//     }
//   };

//   const handleUpdate = (idx) => {
//     setLoadingWorkflow(true);
//     // showToast("Saving...", "info");
//     const row = rows[idx];

//     if (!row.workflowId || row.workflowId === 0) {
//       alert("Cannot update a new unsaved row. Please save as new.");
//       setLoadingWorkflow(false);
//       return;
//     }

//     fetch(`${backendUrl}/api/ApprovalWorkflow/${row.workflowId}`, {
//       method: "PUT", // or PATCH if your API supports partial updates
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         workflowId: row.workflowId,
//         requestType: row.requestType || "TIMESHEET",
//         levelNo: Number(row.level),
//         approverRole: row.name,
//         isMandetory: Boolean(row.isMandetory),
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Update failed");
//         // If API does not return JSON, skip res.json()
//         if (res.status === 204) return null;
//         return res.json();
//       })
//       .then(() => {
//         showToast("Workflow updated successfully.");
//         setEditIdx(null);
//         // Optionally refresh your data here (fetchWorkflowData())
//       })
//       .catch((err) => {
//         console.error("Error updating workflow:", err);
//         showToast("Failed to update workflow.");
//       })
//       .finally(() => setLoadingWorkflow(false));
//   };

//   const handleSaveConfig = async () => {
//     // Validation
//     if (!woPrefix.trim()) {
//       showToast("Please enter a work order prefix", "warning");
//       return;
//     }
//     if (
//       !woSuffixLength.trim() ||
//       isNaN(woSuffixLength) ||
//       parseInt(woSuffixLength) <= 0
//     ) {
//       showToast(
//         "Please enter a valid suffix length (positive number)",
//         "warning",
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       const nowISOString = new Date().toISOString();

//       // Prepare workflow value
//       const selectedWorkflows = [];
//       if (workflowPM) selectedWorkflows.push("PM");
//       if (workflowSupervisor) selectedWorkflows.push("Supervisor");
//       const workflowValue = selectedWorkflows.join(",");

//       const originalWorkflowValue = [];
//       if (originalValues.workflowPM) originalWorkflowValue.push("PM");
//       if (originalValues.workflowSupervisor)
//         originalWorkflowValue.push("Supervisor");
//       const originalWorkflow = originalWorkflowValue.join(",");

//       // Start building updated configs array
//       let updatedConfigs = [];

//       // Check if WO_Prefix changed
//       if (woPrefix.trim() !== originalValues.woPrefix) {
//         const prefixConfig = configValues.find((c) => c.name === "WO_Prefix");
//         if (prefixConfig) {
//           updatedConfigs.push({
//             ...prefixConfig,
//             value: woPrefix.trim(),
//             createdAt: nowISOString,
//           });
//         } else {
//           updatedConfigs.push({
//             name: "WO_Prefix",
//             value: woPrefix.trim(),
//             createdAt: nowISOString,
//             id: 0,
//           });
//         }
//       }

//       // Check if WO_SuffixLength changed
//       if (woSuffixLength.trim() !== originalValues.woSuffixLength) {
//         const suffixConfig = configValues.find(
//           (c) => c.name === "WO_SuffixLength",
//         );
//         if (suffixConfig) {
//           updatedConfigs.push({
//             ...suffixConfig,
//             value: woSuffixLength.trim(),
//             createdAt: nowISOString,
//           });
//         } else {
//           updatedConfigs.push({
//             name: "WO_SuffixLength",
//             value: woSuffixLength.trim(),
//             createdAt: nowISOString,
//             id: 0,
//           });
//         }
//       }

//       // Check if Workflow changed
//       if (workflowValue !== originalWorkflow) {
//         const workflowConfig = configValues.find((c) => c.name === "Workflow");
//         if (workflowConfig) {
//           updatedConfigs.push({
//             ...workflowConfig,
//             value: workflowValue,
//             createdAt: nowISOString,
//           });
//         } else {
//           updatedConfigs.push({
//             name: "Workflow",
//             value: workflowValue,
//             createdAt: nowISOString,
//             id: 0,
//           });
//         }
//       }

//       // Check if email-related configs changed and add to updatedConfigs
//       if (
//         allowEmailRedirect.toString() !==
//         (originalValues.allowEmailRedirect?.toString() || "false")
//       ) {
//         const redirectConfig = configValues.find(
//           (c) => c.name === "ALLOW_EMAIL_REDIRECT",
//         );
//         if (redirectConfig) {
//           updatedConfigs.push({
//             ...redirectConfig,
//             value: allowEmailRedirect.toString(),
//             createdAt: nowISOString,
//           });
//         } else {
//           updatedConfigs.push({
//             name: "ALLOW_EMAIL_REDIRECT",
//             value: allowEmailRedirect.toString(),
//             createdAt: nowISOString,
//             id: 0,
//           });
//         }
//       }

//       if (redirectEmailTo !== (originalValues.redirectEmailTo || "")) {
//         const emailToConfig = configValues.find(
//           (c) => c.name === "REDIRECT_EMAIL_TO",
//         );
//         if (emailToConfig) {
//           updatedConfigs.push({
//             ...emailToConfig,
//             value: redirectEmailTo,
//             createdAt: nowISOString,
//           });
//         } else {
//           updatedConfigs.push({
//             name: "REDIRECT_EMAIL_TO",
//             value: redirectEmailTo,
//             createdAt: nowISOString,
//             id: 0,
//           });
//         }
//       }

//       if (
//         allowEmailNotification.toString() !==
//         (originalValues.allowEmailNotification?.toString() || "false")
//       ) {
//         const notificationConfig = configValues.find(
//           (c) => c.name === "EMAIL_NOTIFICATION",
//         );
//         if (notificationConfig) {
//           updatedConfigs.push({
//             ...notificationConfig,
//             value: allowEmailNotification.toString(),
//             createdAt: nowISOString,
//           });
//         } else {
//           updatedConfigs.push({
//             name: "EMAIL_NOTIFICATION",
//             value: allowEmailNotification.toString(),
//             createdAt: nowISOString,
//             id: 0,
//           });
//         }
//       }

//       //timesheet period
//       if (timesheetPeriod !== originalValues.timesheetPeriod) {
//         const tsConfig = configValues.find(
//           (c) => c.name === "timesheet_period",
//         );
//         if (tsConfig) {
//           updatedConfigs.push({
//             ...tsConfig,
//             value: timesheetPeriod,
//             createdAt: nowISOString,
//           });
//         } else {
//           updatedConfigs.push({
//             id: 0,
//             name: "timesheet_period",
//             value: timesheetPeriod,
//             createdAt: nowISOString,
//           });
//         }
//       }

//       const weekendValue = weekendDays.join(",");

//       if (weekendValue !== (originalValues.weekendDays || []).join(",")) {
//         const weekendConfig = configValues.find((c) => c.name === "weekend");
//         if (weekendConfig) {
//           updatedConfigs.push({
//             ...weekendConfig,
//             value: weekendValue,
//             createdAt: nowISOString,
//           });
//         } else {
//           updatedConfigs.push({
//             id: 0,
//             name: "weekend",
//             value: weekendValue,
//             createdAt: nowISOString,
//           });
//         }
//       }

//       // Max Hours
//       if (maxHoursPerDay !== originalValues.maxHoursPerDay) {
//         const maxHoursConfig = configValues.find(
//           (c) => c.name === "max_daily_hours",
//         );
//         if (maxHoursConfig) {
//           updatedConfigs.push({
//             ...maxHoursConfig,
//             value: maxHoursPerDay,
//             createdAt: nowISOString,
//           });
//         } else {
//           updatedConfigs.push({
//             id: 0,
//             name: "max_daily_hours",
//             value: maxHoursPerDay,
//             createdAt: nowISOString,
//           });
//         }
//       }

//       // Hard Edit
//       if (hardEdit !== originalValues.hardEdit) {
//         const hardEditConfig = configValues.find((c) => c.name === "hard_edit");
//         if (hardEditConfig) {
//           updatedConfigs.push({
//             ...hardEditConfig,
//             value: hardEdit.toString(),
//             createdAt: nowISOString,
//           });
//         } else {
//           updatedConfigs.push({
//             id: 0,
//             name: "hard_edit",
//             value: hardEdit.toString(),
//             createdAt: nowISOString,
//           });
//         }
//       }

//       if (weekendHighlightColor !== originalValues.weekendHighlightColor) {
//         const colorConfig = configValues.find(
//           (c) => c.name === "weekend_highlight_color",
//         );
//         if (colorConfig) {
//           updatedConfigs.push({
//             ...colorConfig,
//             value: weekendHighlightColor,
//             createdAt: nowISOString,
//           });
//         } else {
//           updatedConfigs.push({
//             id: 0,
//             name: "weekend_highlight_color",
//             value: weekendHighlightColor,
//             createdAt: nowISOString,
//           });
//         }
//       }

//       // If nothing changed
//       if (updatedConfigs.length === 0) {
//         showToast("No changes detected", "info");
//         return;
//       }

//       console.log("Sending only changed configs:", updatedConfigs);

//       // API call to save all changed configs together
//       const response = await fetch(`${backendUrl}/api/ConfigValues`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedConfigs),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to save configuration values");
//       }

//       showToast(
//         `${updatedConfigs.length} configuration(s) saved successfully`,
//         "success",
//       );

//       // Reload updated configs
//       await loadConfigValues();
//     } catch (error) {
//       console.error("Error saving config values:", error);
//       showToast("Failed to save configuration", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("currentUser");
//     setCurrentUser(null);
//     setUserLoaded(false);
//     navigate("/");
//   };

//   // if (loading) {
//   //   return (
//   //     <div className="min-h-screen bg-[#f9fafd] flex flex-col pr-4">
//   //       <div className="flex-1 flex items-center justify-center">
//   //         <div className="flex items-center">
//   //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//   //           <span className="ml-2">Loading Setting...</span>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   return (
//     // <div className="h-screen bg-[#f9fafd] flex flex-col pr-4 overflow-hidden">
//     //   <div className="flex-1 flex flex-col pt-6 pb-6">
//     //     {/* Header */}
//     //     <div className="flex justify-between items-center mb-6 px-4">
//     //       <div className="flex items-center">
//     //         <SettingsIcon className="h-8 w-8 text-green-600 mr-3" />
//     //         <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
//     //       </div>

//     //       <button
//     //         onClick={handleLogout}
//     //         className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-normal shadow transition"
//     //       >
//     //         Logout
//     //       </button>
//     //     </div>
//     <div className="space-y-2 text-sm sm:text-base text-gray-800 font-inter">
//       <div className="flex flex-col gap-2">
//         <div className="flex items-center gap-2 bg-white rounded-sm p-4">
//           <Settings2 size={20} className="text-blue-600" />
//           <h2 className="text-lg font-bold text-gray-800">Settings</h2>
//         </div>

//         {/* Main Content Area */}
//         <div className="" style={{ height: "calc(100vh - 120px)" }}>
//           <div className="h-full border border-gray-300 bg-white shadow flex flex-col overflow-y-auto">
//             {loading ? (
//               <div className="flex-1 flex items-center justify-center">
//                 <div className="flex items-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                   <span className="ml-2">Loading Setting...</span>
//                 </div>
//               </div>
//             ) : (
//               <div className="p-4 space-y-5">
//                 <div className="flex justify-end">
//                   <button
//                     onClick={handleSaveConfig}
//                     disabled={
//                       loading || !woPrefix.trim() || !woSuffixLength.trim()
//                     }
//                     // className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
//                     className="btn1 btn-blue shrink-0 flex items-center gap-1"
//                   >
//                     {loadingWorkflow ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         <span>Saving...</span>
//                       </>
//                     ) : (
//                       <>
//                         {/* <Save className="h-4 w-4" /> */}
//                         <span>Save </span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//                 <div className="flex gap-6 w-full">
//                   {/* configure notification */}
//                   <div className="flex-1">
//                     <div className="flex items-center mb-2">
//                       <SettingsIcon className="h-4 w-4 text-blue-600 mr-3" />
//                       <h2 className="text-l font-semibold text-gray-900">
//                         Notification Setup
//                       </h2>
//                     </div>

//                     <div className="bg-gray-50 rounded-lg p-2">
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-x-8">
//                           <div className="flex items-center">
//                             <label
//                               htmlFor="allowEmailNotification"
//                               className="text-gray-700 text-md"
//                             >
//                               Allow Email Notification :
//                             </label>
//                             <input
//                               id="allowEmailNotification"
//                               type="checkbox"
//                               checked={allowEmailNotification}
//                               onChange={(e) =>
//                                 setAllowEmailNotification(e.target.checked)
//                               }
//                               className="w-4 h-5 ml-2 text-blue-600 rounded focus:ring-blue-500"
//                             />
//                           </div>

//                           <div className="flex items-center">
//                             <label
//                               htmlFor="allowEmailRedirect"
//                               className="text-gray-700 text-md"
//                             >
//                               Allow Email Redirect :
//                             </label>
//                             <input
//                               id="allowEmailRedirect"
//                               type="checkbox"
//                               checked={allowEmailRedirect}
//                               onChange={(e) =>
//                                 setAllowEmailRedirect(e.target.checked)
//                               }
//                               className="w-4 h-5 ml-2 text-blue-600 rounded focus:ring-blue-500"
//                             />
//                           </div>
//                         </div>

//                         <div className="flex items-center">
//                           <label
//                             htmlFor="redirectEmailTo"
//                             className="mr-4 text-gray-700 text-md whitespace-nowrap"
//                           >
//                             Redirect Email To :
//                           </label>
//                           <span>
//                             <input
//                               id="redirectEmailTo"
//                               type="email"
//                               value={redirectEmailTo}
//                               onChange={(e) =>
//                                 setRedirectEmailTo(e.target.value)
//                               }
//                               className="flex-1 px-1 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400  min-w-[300px]"
//                             />
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex-1">
//                     {/* Configure colour for weekend */}
//                     <div>
//                       <div className="flex items-center mb-2">
//                         <SettingsIcon className="h-4 w-4 text-blue-600 mr-3" />
//                         <h2 className="text-l font-semibold text-gray-900">
//                           Configure Colour for Weekend
//                         </h2>
//                       </div>

//                       <div className="bg-gray-50 rounded-lg p-6 space-y-6">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Weekend Colour
//                             {weekendHighlightColor !==
//                               originalValues.weekendHighlightColor && (
//                               <span className="ml-2 text-xs text-blue-600 font-semibold">
//                                 (Modified)
//                               </span>
//                             )}
//                           </label>

//                           <div className="flex items-center space-x-4">
//                             {/* Color Preview */}
//                             <div
//                               className={`w-12 h-12 rounded-lg border-2 shadow-sm ${weekendHighlightColor !== originalValues.weekendHighlightColor ? "ring-2 ring-blue-500 ring-offset-2" : "border-gray-300"}`}
//                               style={{ backgroundColor: weekendHighlightColor }}
//                             ></div>

//                             {/* Color Input */}
//                             <input
//                               type="color"
//                               value={weekendHighlightColor}
//                               onChange={(e) =>
//                                 setWeekendHighlightColor(e.target.value)
//                               }
//                               className="w-12 h-12 rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm"
//                               disabled={loading}
//                               title="Click to change weekend highlight color"
//                             />

//                             {/* Hex Value */}
//                             <input
//                               type="text"
//                               value={weekendHighlightColor}
//                               onChange={(e) => {
//                                 const hex = e.target.value.replace(
//                                   /[^#a-fA-F0-9]/g,
//                                   "",
//                                 );
//                                 if (hex) setWeekendHighlightColor(hex);
//                               }}
//                               className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent w-24 font-mono text-sm ${
//                                 weekendHighlightColor !==
//                                 originalValues.weekendHighlightColor
//                                   ? "border-blue-500 focus:ring-blue-500"
//                                   : "border-gray-300 focus:ring-blue-500"
//                               }`}
//                               placeholder="#ef4444"
//                               disabled={loading}
//                             />
//                           </div>

//                           <p className="mt-2 text-xs text-gray-500">
//                             Color used to highlight weekend days in timesheets
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-6 w-full">
//                   {/* Configure Work Order Section */}
//                   <div className="flex-1">
//                     <div className="flex items-center mb-2">
//                       <SettingsIcon className="h-4 w-4 text-blue-600 mr-3" />
//                       <h2 className="text-l font-semibold text-gray-900">
//                         Configure Work Order
//                       </h2>
//                     </div>

//                     <div className="bg-gray-50 rounded-lg p-2">
//                       <div className="space-y-2">
//                         {/* Work Order Prefix */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Work Order Prefix
//                             {/* {woPrefix.trim() !== originalValues.woPrefix && (
//                           <span className="ml-2 text-xs text-orange-600 font-semibold">
//                             (Modified)
//                           </span>
//                         )} */}
//                           </label>
//                           <input
//                             type="text"
//                             value={woPrefix}
//                             onChange={(e) => setWoPrefix(e.target.value)}
//                             className={`w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent max-w-[300px] ${
//                               woPrefix.trim() !== originalValues.woPrefix
//                                 ? "border-gray-300 focus:ring-blue-500"
//                                 : "border-gray-300 focus:ring-blue-500"
//                             }`}
//                             placeholder="Enter work order prefix (e.g., WO-)"
//                             disabled={loading}
//                           />
//                           <p className="mt-1 text-xs text-gray-500">
//                             This prefix will be used at the beginning of all
//                             work order numbers
//                           </p>
//                         </div>

//                         {/* Work Order Suffix Length */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Work Order Suffix Length
//                             {/* {woSuffixLength.trim() !==
//                           originalValues.woSuffixLength && (
//                           <span className="ml-2 text-xs text-orange-600 font-semibold">
//                             (Modified)
//                           </span>
//                         )} */}
//                           </label>
//                           <input
//                             type="number"
//                             value={woSuffixLength}
//                             onChange={(e) => setWoSuffixLength(e.target.value)}
//                             min="1"
//                             max="10"
//                             className={`w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent max-w-[300px] ${
//                               woSuffixLength.trim() !==
//                               originalValues.woSuffixLength
//                                 ? "border-gray-300 focus:ring-blue-500"
//                                 : "border-gray-300 focus:ring-blue-500"
//                             }`}
//                             placeholder="Enter suffix length (e.g., 5)"
//                             disabled={loading}
//                           />
//                           <p className="mt-1 text-xs text-gray-500">
//                             Number of digits for the work order suffix (e.g., 5
//                             = 00001, 00002, etc.)
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Workflow Settings */}
//                   <div className="flex-1">
//                     <div className="flex items-center mb-2">
//                       <SettingsIcon className="h-4 w-4 text-blue-600 mr-3" />
//                       <h2 className="text-l font-semibold text-gray-900">
//                         Workflow Setup
//                       </h2>
//                     </div>
//                     {/* <div className="w-full flex flex-col gap-4 bg-white border rounded shadow-sm py-6 px-6 mt-2"> */}
//                     {/* <h1 className="font-semibold">Workflow Setup</h1> */}
//                     <div className="bg-gray-50 rounded-lg p-2">
//                       <div className="space-y-2">
//                         <div className="flex justify-end">
//                           <button
//                             onClick={addRow}
//                             // className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
//                             className="btn1 btn-blue shrink-0 flex items-center gap-1"
//                           >
//                             Add
//                           </button>
//                         </div>
//                         <table className="w-full border-collapse border border-gray-300 text-sm">
//                           <thead>
//                             <tr className="bg-gray-100">
//                               <th className="border border-gray-300 p-2 text-left min-w-5">
//                                 Level
//                               </th>
//                               <th className="border border-gray-300 p-2 text-left">
//                                 Name
//                               </th>
//                               <th className="border border-gray-300 p-2 text-left">
//                                 Action
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {rows.map((row, idx) => (
//                               <tr key={idx}>
//                                 <td className="border border-gray-300 p-2 max-w-5">
//                                   <input
//                                     type="number"
//                                     value={row.level}
//                                     onChange={(e) =>
//                                       handleInputChange(
//                                         idx,
//                                         "level",
//                                         e.target.value,
//                                       )
//                                     }
//                                     className="w-full border px-1 py-0.5 rounded"
//                                     disabled={
//                                       editIdx !== idx &&
//                                       !(row.workflowId === 0 || !row.workflowId)
//                                     }
//                                   />
//                                 </td>
//                                 <td className="border border-gray-300 p-2">
//                                   <input
//                                     type="text"
//                                     value={row.name}
//                                     onChange={(e) =>
//                                       handleInputChange(
//                                         idx,
//                                         "name",
//                                         e.target.value,
//                                       )
//                                     }
//                                     className="w-full border px-1 py-0.5 rounded"
//                                     disabled={
//                                       editIdx !== idx &&
//                                       !(row.workflowId === 0 || !row.workflowId)
//                                     }
//                                   />
//                                 </td>
//                                 <td className="border border-gray-300 p-2 flex gap-2">
//                                   {/* NEW ROW: Always show Cancel & Save */}
//                                   {!row.workflowId || row.workflowId === 0 ? (
//                                     <>
//                                       <button
//                                         onClick={() => handleCancel(idx)}
//                                         className="px-2 py-0.5 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
//                                         aria-label="Cancel"
//                                         title="Cancel"
//                                       >
//                                         <X size={16} />
//                                       </button>
//                                       <button
//                                         onClick={() => handleSaveWorkflow(idx)}
//                                         title="Save"
//                                         className="px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                                       >
//                                         <Save size={16} />
//                                       </button>
//                                     </>
//                                   ) : (
//                                     <>
//                                       {/* If editing this row: show Cancel & Save */}
//                                       {editIdx === idx ? (
//                                         <>
//                                           <button
//                                             onClick={() => handleCancel(idx)}
//                                             className="px-2 py-0.5 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
//                                             aria-label="Cancel"
//                                             title="Cancel"
//                                           >
//                                             <X size={16} />
//                                           </button>
//                                           <button
//                                             onClick={() => handleUpdate(idx)}
//                                             title="Save"
//                                             className="px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                                           >
//                                             <Save size={16} />
//                                           </button>
//                                           <button
//                                             onClick={() => handleDeleteRow(idx)}
//                                             title="Delete"
//                                             className="px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700 transition"
//                                           >
//                                             <Trash2 size={16} />
//                                           </button>
//                                         </>
//                                       ) : (
//                                         <>
//                                           {/* Default: Edit and Delete */}
//                                           <button
//                                             onClick={() => handleEdit(idx)}
//                                             title="Edit"
//                                             className="px-2 py-0.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
//                                           >
//                                             <Edit2 size={16} />
//                                           </button>
//                                           <button
//                                             onClick={() => handleDeleteRow(idx)}
//                                             title="Delete"
//                                             className="px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700 transition"
//                                           >
//                                             <Trash2 size={16} />
//                                           </button>
//                                         </>
//                                       )}
//                                     </>
//                                   )}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                       {/* </div> */}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-6 w-full">
//                   {/* Configure Timesheet Period Section */}
//                   <div className="flex-1">
//                     <div className="flex items-center mb-2">
//                       <SettingsIcon className="h-4 w-4 text-blue-600 mr-3" />
//                       <h2 className="text-l font-semibold text-gray-900">
//                         Configure Timesheet Period
//                       </h2>
//                     </div>

//                     <div className="bg-gray-50 rounded-lg p-2">
//                       <div className="space-y-2">
//                         {/* Timesheet Period*/}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Timesheet Period
//                           </label>

//                           <select
//                             value={timesheetPeriod}
//                             onChange={(e) => setTimesheetPeriod(e.target.value)}
//                             disabled={loading}
//                             className={`
//       w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent max-w-[300px]
//       ${
//         timesheetPeriod !== originalValues.timesheetPeriod
//           ? "border-blue-500 focus:ring-blue-500"
//           : "border-gray-300 focus:ring-blue-500"
//       }
//     `}
//                           >
//                             <option value="">Select timesheet period</option>
//                             <option value="weekly">Weekly - 7 Days</option>
//                             <option value="bi-weekly">
//                               Bi-weekly - 14 Days
//                             </option>
//                             <option value="semi-monthly">
//                               Semi-Monthly - 15 days{" "}
//                             </option>
//                             <option value="monthly">Monthly </option>
//                           </select>

//                           <p className="mt-1 text-xs text-gray-500">
//                             Select how often timesheets are generated.
//                           </p>
//                         </div>

//                         {/* Weekend */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Set Weekend
//                             {weekendDays.length > 0 &&
//                               weekendDays.join(", ") !==
//                                 originalValues.weekendDays?.join(", ") && (
//                                 <span className="ml-2 text-xs text-blue-600 font-semibold">
//                                   (Modified)
//                                 </span>
//                               )}
//                           </label>

//                           <div
//                             className={`w-full max-w-[300px] border rounded-lg p-3 border-gray-300
//       focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50
//       ${
//         weekendDays.join(", ") !== originalValues.weekendDays?.join(", ")
//           ? "border-blue-500"
//           : ""
//       }
//       ${loading ? "opacity-50 pointer-events-none" : ""}`}
//                           >
//                             <div className="flex flex-wrap gap-x-4 gap-y-2">
//                               {WEEK_DAYS.map((day) => (
//                                 <label
//                                   key={day.value}
//                                   className="inline-flex items-center space-x-2 cursor-pointer"
//                                 >
//                                   <input
//                                     type="checkbox"
//                                     checked={weekendDays.includes(day.value)}
//                                     onChange={(e) => {
//                                       setWeekendDays(
//                                         e.target.checked
//                                           ? [...weekendDays, day.value]
//                                           : weekendDays.filter(
//                                               (d) => d !== day.value,
//                                             ),
//                                       );
//                                     }}
//                                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                     disabled={loading}
//                                   />
//                                   <span className="text-sm font-medium text-gray-700">
//                                     {day.label}
//                                   </span>
//                                 </label>
//                               ))}
//                             </div>
//                           </div>

//                           <p className="mt-1 text-xs text-gray-500">
//                             Select days that count as weekend (single click to
//                             toggle).
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Hours Settings */}
//                   <div className="flex-1">
//                     <div className="flex items-center mb-2">
//                       <SettingsIcon className="h-4 w-4 text-blue-600 mr-3" />
//                       <h2 className="text-l font-semibold text-gray-900">
//                         Configure Hours
//                       </h2>
//                     </div>

//                     <div className="bg-gray-50 rounded-lg p-6 space-y-6">
//                       {/* Hours per day */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Max Hours per day
//                           {maxHoursPerDay !== originalValues.maxHoursPerDay && (
//                             <span className="ml-2 text-xs text-blue-600 font-semibold">
//                               (Modified)
//                             </span>
//                           )}
//                         </label>
//                         <input
//                           type="number"
//                           step="0.5"
//                           min="1"
//                           max="24"
//                           value={maxHoursPerDay}
//                           onChange={(e) => setMaxHoursPerDay(e.target.value)}
//                           className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent max-w-[300px] ${
//                             maxHoursPerDay !== originalValues.maxHoursPerDay
//                               ? "border-blue-500 focus:ring-blue-500"
//                               : "border-gray-300 focus:ring-blue-500"
//                           }`}
//                           placeholder="8"
//                           disabled={loading}
//                         />
//                         <p className="mt-1 text-xs text-gray-500">
//                           Standard working hours per day
//                         </p>
//                       </div>

//                       {/* Hard Edit Checkbox */}
//                       <div>
//                         <label className="flex items-center space-x-3 cursor-pointer">
//                           <input
//                             type="checkbox"
//                             checked={hardEdit}
//                             onChange={(e) => setHardEdit(e.target.checked)}
//                             className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                             disabled={loading}
//                           />
//                           <span
//                             className={`text-sm font-medium transition-colors ${
//                               hardEdit !== originalValues.hardEdit
//                                 ? "text-blue-900 font-semibold"
//                                 : "text-gray-700"
//                             }`}
//                           >
//                             Hard Edit Mode
//                             {hardEdit !== originalValues.hardEdit && (
//                               <span className="ml-2 text-xs text-blue-600">
//                                 (Modified)
//                               </span>
//                             )}
//                           </span>
//                         </label>
//                         <p className="mt-2 text-xs text-gray-500 ml-7">
//                           Prevent enter hours beyond the maximum limit
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Configure Workflow Section */}
//                 <div className="flex gap-6 w-full">
//                   {/* Configure Timesheet Period Section */}
//                 </div>

//                 {/* Save Button - Common for both sections */}
//                 {/* <div className="flex justify-end">
//                   <button
//                     onClick={handleSaveConfig}
//                     disabled={
//                       loading || !woPrefix.trim() || !woSuffixLength.trim()
//                     }
//                     // className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
//                     className="btn1 btn-blue shrink-0 flex items-center gap-1"
//                   >
//                     {loadingWorkflow ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         <span>Saving...</span>
//                       </>
//                     ) : (
//                       <>
//                         <Save className="h-4 w-4" />
//                         <span>Save </span>
//                       </>
//                     )}
//                   </button>
//                 </div> */}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  MessageSquare,
  Download,
  Receipt,
  Package,
  Users,
  Settings as SettingsIcon,
  Save,
  Edit2,
  Trash2,
  X,
  Settings2,
} from "lucide-react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";

// Toast notification utility
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
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: ${bgColor};
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 14px;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 1000);
};

const Settings = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  // Config Values states
  const [woPrefix, setWoPrefix] = useState("");
  const [woSuffixLength, setWoSuffixLength] = useState("");
  const [loading, setLoading] = useState(false);
  const [configValues, setConfigValues] = useState([]);

  // Workflow configuration states
  const [workflowPM, setWorkflowPM] = useState(false);
  const [workflowSupervisor, setWorkflowSupervisor] = useState(false);

  // New states for roles list
  const [roles, setRoles] = useState([]);

  // Store both value and id for each config to pass id on save
  const [allowEmailRedirect, setAllowEmailRedirect] = useState(false);
  const [redirectEmailTo, setRedirectEmailTo] = useState("");
  const [allowEmailRedirectId, setAllowEmailRedirectId] = useState(0);
  const [importLoading, setImportLoading] = useState(false);
  const [redirectEmailToId, setRedirectEmailToId] = useState(0);
  const [allowEmailNotification, setAllowEmailNotification] = useState(false);
  const [allowEmailNotificationId, setAllowEmailNotificationId] = useState(0);
  const [notificaionEmailToId, setNotificaionEmailToId] = useState(0);
  const [rows, setRows] = useState([]);
  const [configLoading, setConfigLoading] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [prevRow, setPrevRow] = useState(null);
  const [loadingWorkflow, setLoadingWorkflow] = useState(false);
  const [timesheetPeriod, setTimesheetPeriod] = useState("");
  const [weekendDays, setWeekendDays] = useState([]); // e.g. ["SAT","SUN"]
  const [maxHoursPerDay, setMaxHoursPerDay] = useState("8");
  const [hardEdit, setHardEdit] = useState(false);
  const [weekendHighlightColor, setWeekendHighlightColor] = useState("#ef4444");
  const [payTypes, setPayTypes] = useState([]);
  const [payTypeEditIdx, setPayTypeEditIdx] = useState(null);
  const [prevPayTypeRow, setPrevPayTypeRow] = useState(null);

  const WEEK_DAYS = [
    { value: "monday", label: "Mon" },
    { value: "tuesday", label: "Tue" },
    { value: "wednesday", label: "Wed" },
    { value: "thursday", label: "Thu" },
    { value: "friday", label: "Fri" },
    { value: "saturday", label: "Sat" },
    { value: "sunday", label: "Sun" },
  ];

  const [originalValues, setOriginalValues] = useState({
    woPrefix: "",
    woSuffixLength: "",
    workflowPM: false,
    workflowSupervisor: false,
    allowEmailRedirect: false,
    redirectEmailTo: "",
    allowEmailNotification: false,
    timesheetPeriod: "",
    weekendDays: [],
    maxHoursPerDay: "8",
    hardEdit: false,
    weekendHighlightColor: "#ef4444",
  });

  useEffect(() => {
    const fetchPayTypes = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/PayType`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch Pay Types");

        const data = await response.json();
        setPayTypes(data);
      } catch (error) {
        console.error("Error fetching Pay Types:", error);
      }
    };

    fetchPayTypes();
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem("currentUser");
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setCurrentUser(parsedUser);
        setUserLoaded(true);
      } catch (error) {
        console.error("Error parsing user info:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Load config values when component mounts
  useEffect(() => {
    if (userLoaded && currentUser) {
      loadConfigValues();
      loadRoles();
    }
  }, [userLoaded, currentUser]);

  const loadRoles = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/Role`);
      if (!response.ok) throw new Error("Failed to fetch roles");
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  const loadConfigValues = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${backendUrl}/api/ConfigValues`);

      if (!response.ok) {
        throw new Error("Failed to fetch config values");
      }

      const data = await response.json();
      setConfigValues(data);

      // Set work order values
      const prefixConfig = data.find((config) => config.name === "WO_Prefix");
      const suffixConfig = data.find(
        (config) => config.name === "WO_SuffixLength",
      );

      let loadedWoPrefix = "";
      let loadedWoSuffixLength = "";

      if (prefixConfig) {
        loadedWoPrefix = prefixConfig.value;
        setWoPrefix(prefixConfig.value);
      }

      if (suffixConfig) {
        loadedWoSuffixLength = suffixConfig.value;
        setWoSuffixLength(suffixConfig.value);
      }

      // Set workflow values
      let loadedWorkflowPM = false;
      let loadedWorkflowSupervisor = false;

      const workflowConfig = data.find((config) => config.name === "Workflow");
      if (workflowConfig && workflowConfig.value) {
        const workflowValues = workflowConfig.value
          .split(",")
          .map((v) => v.trim());
        loadedWorkflowPM = workflowValues.includes("PM");
        loadedWorkflowSupervisor = workflowValues.includes("Supervisor");
        setWorkflowPM(loadedWorkflowPM);
        setWorkflowSupervisor(loadedWorkflowSupervisor);
      }

      // Additional email-related config values
      const redirectConfig = data.find(
        (item) => item.name === "ALLOW_EMAIL_REDIRECT",
      );
      const emailConfig = data.find(
        (item) => item.name === "REDIRECT_EMAIL_TO",
      );
      const emailNotification = data.find(
        (item) => item.name === "EMAIL_NOTIFICATION",
      );

      if (redirectConfig) {
        setAllowEmailRedirect(redirectConfig.value === "true");
        setAllowEmailRedirectId(redirectConfig.id);
      }
      if (emailConfig) {
        setRedirectEmailTo(emailConfig.value);
        setRedirectEmailToId(emailConfig.id);
      }
      if (emailNotification) {
        setAllowEmailNotification(emailNotification.value === "true");
        setAllowEmailNotificationId(emailNotification.id);
      }

      const timesheetPeriodConfig = data.find(
        (config) => config.name === "timesheet_period",
      );
      let loadedTimesheetPeriod = "";
      if (timesheetPeriodConfig) {
        loadedTimesheetPeriod = timesheetPeriodConfig.value;
        setTimesheetPeriod(timesheetPeriodConfig.value);
      }

      const weekendConfig = data.find((config) => config.name === "weekend");
      let loadedWeekendDays = [];
      if (weekendConfig && weekendConfig.value) {
        loadedWeekendDays = weekendConfig.value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
        setWeekendDays(loadedWeekendDays);
      }

      const maxHoursConfig = data.find(
        (config) => config.name === "max_daily_hours",
      );
      const hardEditConfig = data.find((config) => config.name === "hard_edit");

      let loadedMaxHours = "8";
      let loadedHardEdit = false;

      if (maxHoursConfig) {
        loadedMaxHours = maxHoursConfig.value;
        setMaxHoursPerDay(maxHoursConfig.value);
      }
      if (hardEditConfig) {
        loadedHardEdit = hardEditConfig.value === "true";
        setHardEdit(loadedHardEdit);
      }

      const weekendColorConfig = data.find(
        (config) => config.name === "weekend_highlight_color",
      );
      let loadedWeekendColor = "#ef4444";
      if (weekendColorConfig) {
        loadedWeekendColor = weekendColorConfig.value;
        setWeekendHighlightColor(weekendColorConfig.value);
      }

      setOriginalValues({
        woPrefix: loadedWoPrefix,
        woSuffixLength: loadedWoSuffixLength,
        workflowPM: loadedWorkflowPM,
        workflowSupervisor: loadedWorkflowSupervisor,
        allowEmailRedirect: redirectConfig
          ? redirectConfig.value === "true"
          : false,
        redirectEmailTo: emailConfig ? emailConfig.value : "",
        allowEmailNotification: emailNotification
          ? emailNotification.value === "true"
          : false,
        timesheetPeriod: loadedTimesheetPeriod,
        weekendDays: loadedWeekendDays,
        maxHoursPerDay: loadedMaxHours,
        hardEdit: loadedHardEdit,
        weekendHighlightColor: loadedWeekendColor,
      });
    } catch (error) {
      console.error("Error loading config values:", error);
      showToast("Failed to load configuration values", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(`${backendUrl}/api/ApprovalWorkflow`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item) => ({
          workflowId: item.workflowId,
          level: item.levelNo,
          name: item.approverRole,
          isMandetory: item.isMandetory,
          requestType: item.requestType,
        }));
        setRows(mapped);
      })
      .catch((err) => {
        console.error("Failed to load workflow data", err);
      })
      .finally(() => {
        setConfigLoading(false);
      });
  }, []);

  // Add a blank row
  const handleInputChange = (idx, field, value) => {
    const updated = [...rows];
    updated[idx][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        workflowId: 0,
        level: "",
        name: "",
        isMandetory: false,
        requestType: "TIMESHEET",
      },
    ]);
  };

  const cancelRow = (index) => {
    setRows((prevRows) => prevRows.filter((_, idx) => idx !== index));
  };

  const handleCancel = (idx) => {
    if (!rows[idx].workflowId || rows[idx].workflowId === 0) {
      cancelRow(idx);
    } else {
      const updatedRows = [...rows];
      updatedRows[idx] = prevRow;
      setRows(updatedRows);
      setEditIdx(null);
      setPrevRow(null);
    }
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setPrevRow({ ...rows[idx] });
  };

  const handleDeleteRow = async (idx) => {
    const row = rows[idx];

    try {
      if (row.workflowId) {
        await fetch(`${backendUrl}/api/ApprovalWorkflow/${row.workflowId}`, {
          method: "DELETE",
        });
      }

      setRows(rows.filter((_, i) => i !== idx));
      showToast("Deleted successfully.", "success");
    } catch (error) {
      console.error("Delete error:", error);
      showToast("Failed to delete row", "error");
    }
  };

  const handleSaveWorkflow = (idx) => {
    setLoadingWorkflow(true);
    const row = rows[idx];

    if (!row.workflowId || row.workflowId === 0) {
      fetch(`${backendUrl}/api/ApprovalWorkflow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: row.requestType || "TIMESHEET",
          levelNo: Number(row.level),
          approverRole: row.name,
          isMandetory: Boolean(row.isMandetory),
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Save failed");
          return res.json();
        })
        .then((savedItem) => {
          showToast("Workflow saved successfully.");
          const updatedRows = [...rows];
          updatedRows[idx] = {
            ...updatedRows[idx],
            workflowId: savedItem.workflowId,
          };
          setRows(updatedRows);
        })
        .catch((err) => {
          console.error("Error saving workflow:", err);
          showToast("Failed to save workflow.");
        })
        .finally(() => setLoadingWorkflow(false));
    } else {
      handleUpdate(idx);
    }
  };

  const handleUpdate = (idx) => {
    setLoadingWorkflow(true);
    const row = rows[idx];

    if (!row.workflowId || row.workflowId === 0) {
      alert("Cannot update a new unsaved row. Please save as new.");
      setLoadingWorkflow(false);
      return;
    }

    fetch(`${backendUrl}/api/ApprovalWorkflow/${row.workflowId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workflowId: row.workflowId,
        requestType: row.requestType || "TIMESHEET",
        levelNo: Number(row.level),
        approverRole: row.name,
        isMandetory: Boolean(row.isMandetory),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        if (res.status === 204) return null;
        return res.json();
      })
      .then(() => {
        showToast("Workflow updated successfully.");
        setEditIdx(null);
      })
      .catch((err) => {
        console.error("Error updating workflow:", err);
        showToast("Failed to update workflow.");
      })
      .finally(() => setLoadingWorkflow(false));
  };

  const handleSaveConfig = async () => {
    if (!woPrefix.trim()) {
      showToast("Please enter a work order prefix", "warning");
      return;
    }
    if (
      !woSuffixLength.trim() ||
      isNaN(woSuffixLength) ||
      parseInt(woSuffixLength) <= 0
    ) {
      showToast(
        "Please enter a valid suffix length (positive number)",
        "warning",
      );
      return;
    }

    try {
      setLoading(true);
      const nowISOString = new Date().toISOString();

      const selectedWorkflows = [];
      if (workflowPM) selectedWorkflows.push("PM");
      if (workflowSupervisor) selectedWorkflows.push("Supervisor");
      const workflowValue = selectedWorkflows.join(",");

      const originalWorkflowValue = [];
      if (originalValues.workflowPM) originalWorkflowValue.push("PM");
      if (originalValues.workflowSupervisor)
        originalWorkflowValue.push("Supervisor");
      const originalWorkflow = originalWorkflowValue.join(",");

      let updatedConfigs = [];

      if (woPrefix.trim() !== originalValues.woPrefix) {
        const prefixConfig = configValues.find((c) => c.name === "WO_Prefix");
        if (prefixConfig) {
          updatedConfigs.push({
            ...prefixConfig,
            value: woPrefix.trim(),
            createdAt: nowISOString,
          });
        } else {
          updatedConfigs.push({
            name: "WO_Prefix",
            value: woPrefix.trim(),
            createdAt: nowISOString,
            id: 0,
          });
        }
      }

      if (woSuffixLength.trim() !== originalValues.woSuffixLength) {
        const suffixConfig = configValues.find(
          (c) => c.name === "WO_SuffixLength",
        );
        if (suffixConfig) {
          updatedConfigs.push({
            ...suffixConfig,
            value: woSuffixLength.trim(),
            createdAt: nowISOString,
          });
        } else {
          updatedConfigs.push({
            name: "WO_SuffixLength",
            value: woSuffixLength.trim(),
            createdAt: nowISOString,
            id: 0,
          });
        }
      }

      if (workflowValue !== originalWorkflow) {
        const workflowConfig = configValues.find((c) => c.name === "Workflow");
        if (workflowConfig) {
          updatedConfigs.push({
            ...workflowConfig,
            value: workflowValue,
            createdAt: nowISOString,
          });
        } else {
          updatedConfigs.push({
            name: "Workflow",
            value: workflowValue,
            createdAt: nowISOString,
            id: 0,
          });
        }
      }

      if (
        allowEmailRedirect.toString() !==
        (originalValues.allowEmailRedirect?.toString() || "false")
      ) {
        const redirectConfig = configValues.find(
          (c) => c.name === "ALLOW_EMAIL_REDIRECT",
        );
        if (redirectConfig) {
          updatedConfigs.push({
            ...redirectConfig,
            value: allowEmailRedirect.toString(),
            createdAt: nowISOString,
          });
        } else {
          updatedConfigs.push({
            name: "ALLOW_EMAIL_REDIRECT",
            value: allowEmailRedirect.toString(),
            createdAt: nowISOString,
            id: 0,
          });
        }
      }

      if (redirectEmailTo !== (originalValues.redirectEmailTo || "")) {
        const emailToConfig = configValues.find(
          (c) => c.name === "REDIRECT_EMAIL_TO",
        );
        if (emailToConfig) {
          updatedConfigs.push({
            ...emailToConfig,
            value: redirectEmailTo,
            createdAt: nowISOString,
          });
        } else {
          updatedConfigs.push({
            name: "REDIRECT_EMAIL_TO",
            value: redirectEmailTo,
            createdAt: nowISOString,
            id: 0,
          });
        }
      }

      if (
        allowEmailNotification.toString() !==
        (originalValues.allowEmailNotification?.toString() || "false")
      ) {
        const notificationConfig = configValues.find(
          (c) => c.name === "EMAIL_NOTIFICATION",
        );
        if (notificationConfig) {
          updatedConfigs.push({
            ...notificationConfig,
            value: allowEmailNotification.toString(),
            createdAt: nowISOString,
          });
        } else {
          updatedConfigs.push({
            name: "EMAIL_NOTIFICATION",
            value: allowEmailNotification.toString(),
            createdAt: nowISOString,
            id: 0,
          });
        }
      }

      if (timesheetPeriod !== originalValues.timesheetPeriod) {
        const tsConfig = configValues.find(
          (c) => c.name === "timesheet_period",
        );
        if (tsConfig) {
          updatedConfigs.push({
            ...tsConfig,
            value: timesheetPeriod,
            createdAt: nowISOString,
          });
        } else {
          updatedConfigs.push({
            id: 0,
            name: "timesheet_period",
            value: timesheetPeriod,
            createdAt: nowISOString,
          });
        }
      }

      const weekendValue = weekendDays.join(",");

      if (weekendValue !== (originalValues.weekendDays || []).join(",")) {
        const weekendConfig = configValues.find((c) => c.name === "weekend");
        if (weekendConfig) {
          updatedConfigs.push({
            ...weekendConfig,
            value: weekendValue,
            createdAt: nowISOString,
          });
        } else {
          updatedConfigs.push({
            id: 0,
            name: "weekend",
            value: weekendValue,
            createdAt: nowISOString,
          });
        }
      }

      if (maxHoursPerDay !== originalValues.maxHoursPerDay) {
        const maxHoursConfig = configValues.find(
          (c) => c.name === "max_daily_hours",
        );
        if (maxHoursConfig) {
          updatedConfigs.push({
            ...maxHoursConfig,
            value: maxHoursPerDay,
            createdAt: nowISOString,
          });
        } else {
          updatedConfigs.push({
            id: 0,
            name: "max_daily_hours",
            value: maxHoursPerDay,
            createdAt: nowISOString,
          });
        }
      }

      if (hardEdit !== originalValues.hardEdit) {
        const hardEditConfig = configValues.find((c) => c.name === "hard_edit");
        if (hardEditConfig) {
          updatedConfigs.push({
            ...hardEditConfig,
            value: hardEdit.toString(),
            createdAt: nowISOString,
          });
        } else {
          updatedConfigs.push({
            id: 0,
            name: "hard_edit",
            value: hardEdit.toString(),
            createdAt: nowISOString,
          });
        }
      }

      if (weekendHighlightColor !== originalValues.weekendHighlightColor) {
        const colorConfig = configValues.find(
          (c) => c.name === "weekend_highlight_color",
        );
        if (colorConfig) {
          updatedConfigs.push({
            ...colorConfig,
            value: weekendHighlightColor,
            createdAt: nowISOString,
          });
        } else {
          updatedConfigs.push({
            id: 0,
            name: "weekend_highlight_color",
            value: weekendHighlightColor,
            createdAt: nowISOString,
          });
        }
      }

      if (updatedConfigs.length === 0) {
        showToast("No changes detected", "info");
        return;
      }

      const response = await fetch(`${backendUrl}/api/ConfigValues`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedConfigs),
      });

      if (!response.ok) {
        throw new Error("Failed to save configuration values");
      }

      showToast(
        `${updatedConfigs.length} configuration(s) saved successfully`,
        "success",
      );

      await loadConfigValues();
    } catch (error) {
      console.error("Error saving config values:", error);
      showToast("Failed to save configuration", "error");
    } finally {
      setLoading(false);
    }
  };

  const addPayTypeRow = () => {
    const newRow = {
      id: null,
      name: "",
      description: "",
      rate: "",
      isOvertime: false,
      isHourly: false,
      isSalary: false,
      isFuture: false,
      isNew: true,
    };

    setPayTypes((prev) => [...prev, newRow]);
    setPayTypeEditIdx(payTypes.length);
  };

  const handlePayTypeInputChange = (index, field, value) => {
    setPayTypes((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const handlePayTypeEdit = (index) => {
    setPrevPayTypeRow({ ...payTypes[index] });
    setPayTypeEditIdx(index);
  };

  const handlePayTypeCancel = (index) => {
    if (payTypes[index]?.isNew) {
      setPayTypes((prev) => prev.filter((_, i) => i !== index));
    } else {
      setPayTypes((prev) =>
        prev.map((row, i) => (i === index ? prevPayTypeRow : row)),
      );
    }

    setPayTypeEditIdx(null);
    setPrevPayTypeRow(null);
  };

  const handlePayTypeSave = async (index) => {
    const row = payTypes[index];

    if (!row.name?.trim()) {
      toast.error("Pay Type name is required");
      return;
    }

    if (
      row.rate === "" ||
      row.rate === null ||
      row.rate === undefined ||
      !Number.isFinite(Number(row.rate)) ||
      Number(row.rate) <= 0
    ) {
      toast.error("Rate is required and must be greater than 0");
      return;
    }

    const rate = Number(row.rate);

    if (rate > 99999999.99 || !/^\d+(\.\d{1,2})?$/.test(String(row.rate))) {
      toast.error("Enter a valid rate with up to 2 decimal places");
      return;
    }

    const payload = {
      name: row.name.trim(),
      description: row.description?.trim() || "",
      rate,

      isOvertime: Boolean(row.isOvertime),
      isHourly: Boolean(row.isHourly),
      isSalary: Boolean(row.isSalary),
      isFuture: Boolean(row.isFuture),
    };

    try {
      const response = await fetch(`${backendUrl}/api/PayType`, {
        method: row.isNew ? "POST" : "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          row.isNew ? [payload] : [{ id: row.id, ...payload }],
        ),
      });

      const resultData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          resultData?.message || resultData?.title || "Failed to save Pay Type",
        );
      }

      const result = await fetch(`${backendUrl}/api/PayType`, {
        credentials: "include",
      });

      if (!result.ok) {
        throw new Error("Pay Type saved, but failed to reload the list");
      }

      setPayTypes(await result.json());
      setPayTypeEditIdx(null);
      setPrevPayTypeRow(null);

      toast.success("Pay Type saved successfully");
    } catch (error) {
      console.error("Error saving Pay Type:", error);
      toast.error(error.message || "Failed to save Pay Type");
    }
  };

  const handlePayTypeDelete = async (id) => {
    if (!id) {
      toast.error("Invalid Pay Type ID");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this Pay Type?")) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/PayType/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete Pay Type");

      setPayTypes((prev) => prev.filter((row) => row.id !== id));
      toast.success("Pay Type deleted successfully");
    } catch (error) {
      console.error("Error deleting Pay Type:", error);
      toast.error("Failed to delete Pay Type");
    }
  };

  return (
    <div className="space-y-2 text-sm sm:text-base text-gray-800 font-inter">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-white rounded-sm p-4">
          <Settings2 size={20} className="text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">Settings</h2>
        </div>

        {/* Main Content Area */}
        <div className="" style={{ height: "calc(100vh - 120px)" }}>
          <div className="h-full border border-gray-300 bg-white shadow flex flex-col overflow-y-auto">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading Setting...</span>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-5">
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveConfig}
                    disabled={
                      loading || !woPrefix.trim() || !woSuffixLength.trim()
                    }
                    className="btn1 btn-blue shrink-0 flex items-center gap-1"
                  >
                    {loadingWorkflow ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Save </span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex gap-6 w-full">
                  {/* configure notification */}
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <SettingsIcon className="h-4 w-4 text-blue-600 mr-3" />
                      <h2 className="text-l font-semibold text-gray-900">
                        Notification Setup
                      </h2>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-x-8">
                          <div className="flex items-center">
                            <label
                              htmlFor="allowEmailNotification"
                              className="text-gray-700 text-md"
                            >
                              Allow Email Notification :
                            </label>
                            <input
                              id="allowEmailNotification"
                              type="checkbox"
                              checked={allowEmailNotification}
                              onChange={(e) =>
                                setAllowEmailNotification(e.target.checked)
                              }
                              className="w-4 h-5 ml-2 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>

                          <div className="flex items-center">
                            <label
                              htmlFor="allowEmailRedirect"
                              className="text-gray-700 text-md"
                            >
                              Allow Email Redirect :
                            </label>
                            <input
                              id="allowEmailRedirect"
                              type="checkbox"
                              checked={allowEmailRedirect}
                              onChange={(e) =>
                                setAllowEmailRedirect(e.target.checked)
                              }
                              className="w-4 h-5 ml-2 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <label
                            htmlFor="redirectEmailTo"
                            className="mr-4 text-gray-700 text-md whitespace-nowrap"
                          >
                            Redirect Email To :
                          </label>
                          <span>
                            <input
                              id="redirectEmailTo"
                              type="email"
                              value={redirectEmailTo}
                              onChange={(e) =>
                                setRedirectEmailTo(e.target.value)
                              }
                              className="flex-1 px-1 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400  min-w-[300px]"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    {/* Configure colour for weekend */}
                    <div>
                      <div className="flex items-center mb-2">
                        <SettingsIcon className="h-4 w-4 text-blue-600 mr-3" />
                        <h2 className="text-l font-semibold text-gray-900">
                          Configure Colour for Weekend
                        </h2>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weekend Colour
                            {weekendHighlightColor !==
                              originalValues.weekendHighlightColor && (
                              <span className="ml-2 text-xs text-blue-600 font-semibold">
                                (Modified)
                              </span>
                            )}
                          </label>

                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-12 h-12 rounded-lg border-2 shadow-sm ${weekendHighlightColor !== originalValues.weekendHighlightColor ? "ring-2 ring-blue-500 ring-offset-2" : "border-gray-300"}`}
                              style={{ backgroundColor: weekendHighlightColor }}
                            ></div>

                            <input
                              type="color"
                              value={weekendHighlightColor}
                              onChange={(e) =>
                                setWeekendHighlightColor(e.target.value)
                              }
                              className="w-12 h-12 rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm"
                              disabled={loading}
                              title="Click to change weekend highlight color"
                            />

                            <input
                              type="text"
                              value={weekendHighlightColor}
                              onChange={(e) => {
                                const hex = e.target.value.replace(
                                  /[^#a-fA-F0-9]/g,
                                  "",
                                );
                                if (hex) setWeekendHighlightColor(hex);
                              }}
                              className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent w-24 font-mono text-sm ${
                                weekendHighlightColor !==
                                originalValues.weekendHighlightColor
                                  ? "border-blue-500 focus:ring-blue-500"
                                  : "border-gray-300 focus:ring-blue-500"
                              }`}
                              placeholder="#ef4444"
                              disabled={loading}
                            />
                          </div>

                          <p className="mt-2 text-xs text-gray-500">
                            Color used to highlight weekend days in timesheets
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 w-full">
                  {/* Configure Work Order Section */}
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <SettingsIcon className="h-4 w-4 text-blue-600 mr-3" />
                      <h2 className="text-l font-semibold text-gray-900">
                        Configure Work Order
                      </h2>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Work Order Prefix
                          </label>
                          <input
                            type="text"
                            value={woPrefix}
                            onChange={(e) => setWoPrefix(e.target.value)}
                            className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent max-w-[300px] border-gray-300 focus:ring-blue-500"
                            placeholder="Enter work order prefix (e.g., WO-)"
                            disabled={loading}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            This prefix will be used at the beginning of all
                            work order numbers
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Work Order Suffix Length
                          </label>
                          <input
                            type="number"
                            value={woSuffixLength}
                            onChange={(e) => setWoSuffixLength(e.target.value)}
                            min="1"
                            max="10"
                            className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent max-w-[300px] border-gray-300 focus:ring-blue-500"
                            placeholder="Enter suffix length (e.g., 5)"
                            disabled={loading}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Number of digits for the work order suffix (e.g., 5
                            = 00001, 00002, etc.)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Workflow Settings */}
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <SettingsIcon className="h-4 w-4 text-blue-600 mr-3" />
                      <h2 className="text-l font-semibold text-gray-900">
                        Workflow Setup
                      </h2>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="space-y-2">
                        <div className="flex justify-end">
                          <button
                            onClick={addRow}
                            className="btn1 btn-blue shrink-0 flex items-center gap-1"
                          >
                            Add
                          </button>
                        </div>
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 p-2 text-left min-w-5">
                                Level
                              </th>
                              <th className="border border-gray-300 p-2 text-left">
                                Role Name
                              </th>
                              <th className="border border-gray-300 p-2 text-left">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, idx) => (
                              <tr key={idx}>
                                <td className="border border-gray-300 p-2 max-w-5">
                                  <input
                                    type="number"
                                    value={row.level}
                                    onChange={(e) =>
                                      handleInputChange(
                                        idx,
                                        "level",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full border px-1 py-0.5 rounded"
                                    disabled={
                                      editIdx !== idx &&
                                      !(row.workflowId === 0 || !row.workflowId)
                                    }
                                  />
                                </td>
                                <td className="border border-gray-300 p-2">
                                  {editIdx === idx ||
                                  !row.workflowId ||
                                  row.workflowId === 0 ? (
                                    <select
                                      value={row.name}
                                      onChange={(e) =>
                                        handleInputChange(
                                          idx,
                                          "name",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full border px-1.5 py-1 rounded bg-white"
                                    >
                                      <option value="">Select Role</option>
                                      {roles.map((r) => (
                                        <option
                                          key={r.roleId}
                                          value={r.roleName}
                                        >
                                          {r.roleName}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <span className="px-1 py-0.5 font-medium">
                                      {row.name || "-"}
                                    </span>
                                  )}
                                </td>
                                <td className="border border-gray-300 p-2 flex gap-2">
                                  {!row.workflowId || row.workflowId === 0 ? (
                                    <>
                                      <button
                                        onClick={() => handleCancel(idx)}
                                        className="px-2 py-0.5 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                        aria-label="Cancel"
                                        title="Cancel"
                                      >
                                        <X size={16} />
                                      </button>
                                      <button
                                        onClick={() => handleSaveWorkflow(idx)}
                                        title="Save"
                                        className="px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                      >
                                        <Save size={16} />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      {editIdx === idx ? (
                                        <>
                                          <button
                                            onClick={() => handleCancel(idx)}
                                            className="px-2 py-0.5 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                            aria-label="Cancel"
                                            title="Cancel"
                                          >
                                            <X size={16} />
                                          </button>
                                          <button
                                            onClick={() => handleUpdate(idx)}
                                            title="Save"
                                            className="px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                          >
                                            <Save size={16} />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteRow(idx)}
                                            title="Delete"
                                            className="px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => handleEdit(idx)}
                                            title="Edit"
                                            className="px-2 py-0.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                                          >
                                            <Edit2 size={16} />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteRow(idx)}
                                            title="Delete"
                                            className="px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </>
                                      )}
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {/* Optional icon to match Workflow Setup */}
                    <SettingsIcon className="h-4 w-4 text-blue-600 mr-3" />
                    <h2 className="text-base font-semibold text-gray-900">
                      Pay Type Setup
                    </h2>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="space-y-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={addPayTypeRow}
                          disabled={payTypeEditIdx !== null}
                          className="btn1 btn-blue shrink-0 flex items-center gap-1"
                        >
                          Add
                        </button>
                      </div>

                      <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">
                              Code
                            </th>

                            <th className="border border-gray-300 p-2 text-left">
                              Description
                            </th>

                            <th className="border border-gray-300 p-2 text-right">
                              Rate
                            </th>

                            <th className="border border-gray-300 p-2 text-center">
                              OVERTIME
                            </th>

                            {/* <th className="border border-gray-300 p-2 text-center">
      HOURLY
    </th>

    <th className="border border-gray-300 p-2 text-center">
      SALARY
    </th> */}

                            <th className="border border-gray-300 p-2 text-center">
                              FUTURE
                            </th>

                            <th className="border border-gray-300 p-2 text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {payTypes.map((row, index) => {
                            const isEditing = payTypeEditIdx === index;

                            return (
                              <tr key={row.id ?? `new-${index}`}>
                                <td className="border border-gray-300 p-2">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={row.name || ""}
                                      onChange={(e) =>
                                        handlePayTypeInputChange(
                                          index,
                                          "name",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full border px-1.5 py-1 rounded bg-white text-sm"
                                      placeholder="Enter pay type name"
                                    />
                                  ) : (
                                    <span className="px-1 py-0.5 font-medium">
                                      {row.name || "-"}
                                    </span>
                                  )}
                                </td>

                                <td className="border border-gray-300 p-2">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={row.description || ""}
                                      onChange={(e) =>
                                        handlePayTypeInputChange(
                                          index,
                                          "description",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full border px-1.5 py-1 rounded bg-white text-sm"
                                      placeholder="Enter description"
                                    />
                                  ) : (
                                    <span className="px-1 py-0.5 text-gray-700">
                                      {row.description || "-"}
                                    </span>
                                  )}
                                </td>

                                <td className="border border-gray-300 p-2">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      min="0.01"
                                      max="99999999.99"
                                      step="0.01"
                                      required
                                      value={row.rate ?? ""}
                                      onChange={(e) =>
                                        handlePayTypeInputChange(
                                          index,
                                          "rate",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full border px-1.5 py-1 rounded bg-white text-sm text-right"
                                      placeholder="Enter rate"
                                    />
                                  ) : (
                                    <span className="block text-right">
                                      {row.rate != null
                                        ? Number(row.rate).toFixed(2)
                                        : "-"}
                                    </span>
                                  )}
                                </td>

                                {/* OVERTIME */}
                                <td className="border border-gray-300 p-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(row.isOvertime)}
                                    disabled={!isEditing}
                                    onChange={(e) =>
                                      handlePayTypeInputChange(
                                        index,
                                        "isOvertime",
                                        e.target.checked,
                                      )
                                    }
                                    className="w-4 h-4 accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
                                  />
                                </td>

                                {/* HOURLY */}
                                {/* <td className="border border-gray-300 p-2 text-center">
  <input
    type="checkbox"
    checked={Boolean(row.isHourly)}
    disabled={!isEditing}
    onChange={(e) =>
      handlePayTypeInputChange(
        index,
        "isHourly",
        e.target.checked
      )
    }
    className="w-4 h-4 accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
  />
</td> */}

                                {/* SALARY */}
                                {/* <td className="border border-gray-300 p-2 text-center">
  <input
    type="checkbox"
    checked={Boolean(row.isSalary)}
    disabled={!isEditing}
    onChange={(e) =>
      handlePayTypeInputChange(
        index,
        "isSalary",
        e.target.checked
      )
    }
    className="w-4 h-4 accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
  />
</td> */}

                                {/* FUTURE */}
                                <td className="border border-gray-300 p-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(row.isFuture)}
                                    disabled={!isEditing}
                                    onChange={(e) =>
                                      handlePayTypeInputChange(
                                        index,
                                        "isFuture",
                                        e.target.checked,
                                      )
                                    }
                                    className="w-4 h-4 accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
                                  />
                                </td>
                                <td className="border border-gray-300 p-2">
                                  <div className="flex justify-center gap-2">
                                    {isEditing ? (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handlePayTypeSave(index)
                                          }
                                          className="px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
                                        >
                                          <Save size={16} />
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handlePayTypeCancel(index)
                                          }
                                          className="px-2 py-0.5 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm transition"
                                        >
                                          <X size={16} />
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handlePayTypeEdit(index)
                                          }
                                          disabled={payTypeEditIdx !== null}
                                          className="px-2 py-0.5 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm disabled:opacity-50 transition"
                                        >
                                          <Edit2 size={16} />
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handlePayTypeDelete(row.id)
                                          }
                                          className="px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                          {payTypes.length === 0 && (
                            <tr>
                              <td
                                colSpan={8}
                                className="border border-gray-300 p-4 text-center text-gray-500"
                              >
                                No Pay Types found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 w-full">
                  {/* Configure Timesheet Period Section */}
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <SettingsIcon className="h-4 w-4 text-blue-600 mr-3" />
                      <h2 className="text-l font-semibold text-gray-900">
                        Configure Timesheet Period
                      </h2>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timesheet Period
                          </label>

                          <select
                            value={timesheetPeriod}
                            onChange={(e) => setTimesheetPeriod(e.target.value)}
                            disabled={loading}
                            className={`
                              w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent max-w-[300px]
                              ${
                                timesheetPeriod !==
                                originalValues.timesheetPeriod
                                  ? "border-blue-500 focus:ring-blue-500"
                                  : "border-gray-300 focus:ring-blue-500"
                              }
                            `}
                          >
                            <option value="">Select timesheet period</option>
                            <option value="weekly">Weekly - 7 Days</option>
                            <option value="bi-weekly">
                              Bi-weekly - 14 Days
                            </option>
                            <option value="semi-monthly">
                              Semi-Monthly - 15 days{" "}
                            </option>
                            <option value="monthly">Monthly </option>
                          </select>

                          <p className="mt-1 text-xs text-gray-500">
                            Select how often timesheets are generated.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Set Weekend
                            {weekendDays.length > 0 &&
                              weekendDays.join(", ") !==
                                originalValues.weekendDays?.join(", ") && (
                                <span className="ml-2 text-xs text-blue-600 font-semibold">
                                  (Modified)
                                </span>
                              )}
                          </label>

                          <div
                            className={`w-full max-w-[300px] border rounded-lg p-3 border-gray-300
                            focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50
                            ${
                              weekendDays.join(", ") !==
                              originalValues.weekendDays?.join(", ")
                                ? "border-blue-500"
                                : ""
                            }
                            ${loading ? "opacity-50 pointer-events-none" : ""}`}
                          >
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                              {WEEK_DAYS.map((day) => (
                                <label
                                  key={day.value}
                                  className="inline-flex items-center space-x-2 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={weekendDays.includes(day.value)}
                                    onChange={(e) => {
                                      setWeekendDays(
                                        e.target.checked
                                          ? [...weekendDays, day.value]
                                          : weekendDays.filter(
                                              (d) => d !== day.value,
                                            ),
                                      );
                                    }}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    disabled={loading}
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    {day.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <p className="mt-1 text-xs text-gray-500">
                            Select days that count as weekend (single click to
                            toggle).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hours Settings */}
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <SettingsIcon className="h-4 w-4 text-blue-600 mr-3" />
                      <h2 className="text-l font-semibold text-gray-900">
                        Configure Hours
                      </h2>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Hours per day
                          {maxHoursPerDay !== originalValues.maxHoursPerDay && (
                            <span className="ml-2 text-xs text-blue-600 font-semibold">
                              (Modified)
                            </span>
                          )}
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          max="24"
                          value={maxHoursPerDay}
                          onChange={(e) => setMaxHoursPerDay(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent max-w-[300px] ${
                            maxHoursPerDay !== originalValues.maxHoursPerDay
                              ? "border-blue-500 focus:ring-blue-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                          placeholder="8"
                          disabled={loading}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Standard working hours per day
                        </p>
                      </div>

                      <div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hardEdit}
                            onChange={(e) => setHardEdit(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            disabled={loading}
                          />
                          <span
                            className={`text-sm font-medium transition-colors ${
                              hardEdit !== originalValues.hardEdit
                                ? "text-blue-900 font-semibold"
                                : "text-gray-700"
                            }`}
                          >
                            Hard Edit Mode
                            {hardEdit !== originalValues.hardEdit && (
                              <span className="ml-2 text-xs text-blue-600">
                                (Modified)
                              </span>
                            )}
                          </span>
                        </label>
                        <p className="mt-2 text-xs text-gray-500 ml-7">
                          Prevent enter hours beyond the maximum limit
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
