// import React, { useEffect, useMemo, useState } from "react";
// import { backendUrl } from "./config";
// import { useOutletContext } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// const columns = [
//   { key: "employeeId", label: "Employee ID" },
//   { key: "displayedName", label: "Displayed Name" },
//   { key: "lastName", label: "Last Name" },
//   { key: "firstName", label: "First Name" },
//   { key: "tsSchdule", label: "Timesheet Schdule" },
//   { key: "status", label: "Status" },
//   { key: "createDate", label: "Create Date" },
//   //   { key: "modifiedName", label: "Modified Name" },
//   { key: "createdBy", label: "Created By" },
//   { key: "modifiedDate", label: "Modified Date" },
//   { key: "modifiedBy", label: "Modified By" },
// ];

// const makeBlankEmployee = () => ({
//   _rowId: `employee-new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
//   employeeId: "",
//   displayedName: "",
//   lastName: "",
//   firstName: "",
//   status: "Active",
//   createDate: "",
//   modifiedName: "",
//   createdBy: "",
//   modifiedDate: "",
//   modifiedBy: "",
//   _new: true,
// });

// const parseEmployeeStatus = (item) => {
//   if (!item) return "Active";

//   // 1. Check boolean or numeric flags (e.g. isActive, active)
//   const activeFlag =
//     item.isActive ?? item.IsActive ?? item.active ?? item.Active;
//   if (
//     activeFlag === false ||
//     activeFlag === 0 ||
//     activeFlag === "false" ||
//     activeFlag === "0"
//   ) {
//     return "Inactive";
//   }

//   // 2. Extract raw status value from possible backend fields
//   const raw =
//     item.status ??
//     item.Status ??
//     item.emplStatus ??
//     item.EmplStatus ??
//     item.employeeStatus ??
//     item.EmployeeStatus ??
//     item.statusCode ??
//     item.StatusCode ??
//     "";

//   if (raw === false || raw === 0) {
//     return "Inactive";
//   }

//   const s = String(raw).trim().toUpperCase();

//   // 3. Match any inactive representations
//   if (
//     s === "IN" ||
//     s === "INA" ||
//     s === "INACT" ||
//     s === "INACTIVE" ||
//     s === "I" ||
//     s === "TER" ||
//     s === "TERM" ||
//     s === "TERMINATED" ||
//     s === "T" ||
//     s === "N" ||
//     s === "NO" ||
//     s === "FALSE" ||
//     s === "0" ||
//     s === "DIS" ||
//     s === "DISABLED" ||
//     s === "DEACTIVE" ||
//     s === "DEACTIVATED" ||
//     s.startsWith("IN")
//   ) {
//     return "Inactive";
//   }

//   return "Active";
// };

// const formatDateForInput = (val) => {
//   if (!val) return "";
//   const str = String(val).trim();
//   if (!str) return "";

//   // 1. If already YYYY-MM-DD or starts with YYYY-MM-DD (e.g. ISO format YYYY-MM-DDTHH:mm:ss)
//   const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
//   if (isoMatch) {
//     const y = isoMatch[1];
//     const m = isoMatch[2].padStart(2, "0");
//     const d = isoMatch[3].padStart(2, "0");
//     return `${y}-${m}-${d}`;
//   }

//   // 2. Check DD/MM/YYYY, MM/DD/YYYY, DD-MM-YYYY, MM-DD-YYYY
//   const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
//   if (dmyMatch) {
//     const p1 = parseInt(dmyMatch[1], 10);
//     const p2 = parseInt(dmyMatch[2], 10);
//     const year = dmyMatch[3];

//     let month, day;
//     if (p1 > 12) {
//       day = String(p1).padStart(2, "0");
//       month = String(p2).padStart(2, "0");
//     } else if (p2 > 12) {
//       month = String(p1).padStart(2, "0");
//       day = String(p2).padStart(2, "0");
//     } else {
//       const parsed = new Date(str);
//       if (!isNaN(parsed.getTime())) {
//         const y = parsed.getFullYear();
//         const m = String(parsed.getMonth() + 1).padStart(2, "0");
//         const d = String(parsed.getDate()).padStart(2, "0");
//         return `${y}-${m}-${d}`;
//       }
//       month = String(p1).padStart(2, "0");
//       day = String(p2).padStart(2, "0");
//     }
//     return `${year}-${month}-${day}`;
//   }

//   // 3. Fallback to native Date parser (handles "26 Oct 2026", "October 26, 2026", etc.)
//   const parsed = new Date(str);
//   if (!isNaN(parsed.getTime())) {
//     const y = parsed.getFullYear();
//     const m = String(parsed.getMonth() + 1).padStart(2, "0");
//     const d = String(parsed.getDate()).padStart(2, "0");
//     return `${y}-${m}-${d}`;
//   }

//   return str;
// };

// export default function EmployeeMaster() {
//   const [employees, setEmployees] = useState([]);
//   const [savedEmployees, setSavedEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(25);
//   const [sortConfig, setSortConfig] = useState({
//     key: "employeeId",
//     direction: "asc",
//   });
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [copiedEmployees, setCopiedEmployees] = useState([]);
//   const [userFormLoading, setUserFormLoading] = useState(false);
//   const [recentSavedIds, setRecentSavedIds] = useState(() => {
//     try {
//       const stored = localStorage.getItem("employee_master_recent_ids");
//       return stored ? JSON.parse(stored) : [];
//     } catch {
//       return [];
//     }
//   });

//   const [salaryInfoLoading, setSalaryInfoLoading] = useState(false);
//   const [salaryInfoModalOpen, setSalaryInfoModalOpen] = useState(false);
//   const [salaryInfoEmployee, setSalaryInfoEmployee] = useState(false);
//   const [salaryInfo, setSalaryInfo] = useState([]);
//   const [savingSalaryIdx, setSavingSalaryIdx] = useState(null);
//   const [originalSalaryInfo, setOriginalSalaryInfo] = useState([]);
// const [savingSalary, setSavingSalary] = useState(false);
// const[timesheetSchedule, setTimesheetSchedule] = useState([])

//   const [salaryRecords, setSalaryRecords] = useState([]);
// const [saving, setSaving] = useState(false);

// const handleSalaryChange = (index, field, value) => {
//   setSalaryRecords((prev) =>
//     prev.map((row, i) =>
//       i === index ? { ...row, [field]: value } : row
//     )
//   );
// };


// const handleSaveSalary = async () => {
//   try {
//     const fieldsToCompare = [
//       "effectDt",
//       "titleDesc",
//       "sHrlySalCd",
//       "hrlyAmt",
//       "salAmt",
//       "annlAmt",
//       "sEmplTypeCd",
//       "orgId",
//       "workStateCd",
//       "reasonDesc",
//       "stdEstHrs",
//       "pctIncrRt",
//       "labLocCd",
//       "salGradeCd",
//       "mgrEmplId1",
//       "endDt",
//       "emplClassCd",
//       "reasonDesc2",
//       "reasonDesc3",
//     ];

//     const normalize = (value) =>
//       value == null ? "" : String(value).trim();

//     const updatedRows = salaryInfo.filter((row, index) => {
//       const original = originalSalaryInfo[index];

//       if (!original) return false;

//       return fieldsToCompare.some(
//         (field) =>
//           normalize(row[field]) !== normalize(original[field])
//       );
//     });

//     if (updatedRows.length === 0) {
//       toast.info("No changes to save.");
//       return;
//     }

//     setSavingSalary(true);

//     const payload = updatedRows.map((row) => ({
//       ...row,
//       hrlyAmt:
//         row.hrlyAmt === "" || row.hrlyAmt == null
//           ? null
//           : Number(row.hrlyAmt),
//       salAmt:
//         row.salAmt === "" || row.salAmt == null
//           ? null
//           : Number(row.salAmt),
//       annlAmt:
//         row.annlAmt === "" || row.annlAmt == null
//           ? null
//           : Number(row.annlAmt),
//       stdEstHrs:
//         row.stdEstHrs === "" || row.stdEstHrs == null
//           ? null
//           : Number(row.stdEstHrs),
//       pctIncrRt:
//         row.pctIncrRt === "" || row.pctIncrRt == null
//           ? null
//           : Number(row.pctIncrRt),
//     }));

//     await axios.put(
//       `${backendUrl}/api/EmployeeMaster/SalaryDetail/update`,
//       payload
//     );

//     setOriginalSalaryInfo(
//       JSON.parse(JSON.stringify(salaryInfo))
//     );

//     toast.success(`${updatedRows.length} updated row(s) saved successfully.`);
//   } catch (error) {
//     toast.error(
//       error.response?.data?.message ||
//         "Failed to save salary information."
//     );
//   } finally {
//     setSavingSalary(false);
//   }
// };

//   const getCurrentUserContext = () => {
//     try {
//       const userString = localStorage.getItem("currentUser");
//       if (!userString) return { userId: "", role: "" };
//       const userObj = JSON.parse(userString);
//       return {
//         userId: userObj.userId ?? "",
//         userName: userObj.name ?? "",
//         role: userObj.role?.toLowerCase() ?? "",
//       };
//     } catch {
//       return { userId: "", role: "", userName: "" };
//     }
//   };

//   const { userId, role, userName } = getCurrentUserContext();

//   const fetchEmployees = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${backendUrl}/api/EmployeeMaster`);
//       const tsSchedule = await axios.get(`${backendUrl}/api/TimesheetSchedule`)
//       if (!response.ok) {
//         throw new Error(`Failed to fetch employees (${response.status})`);
//       }
//       // if (!tsSchedule.ok) {
//       //   throw new Error(`Failed to fetch Schdule (${response.status})`);
//       // }
//       const data = await response.json();
//       const loaded = (Array.isArray(data) ? data : []).map((item, index) => {
//         const empId = item.employeeId || item.emplId || item.id || "";
//         return {
//           _rowId: `employee-${empId || index + 1}`,
//           employeeId: empId,
//           displayedName:
//             item.displayedName || item.displayedname || item.name || "",
//           lastName: item.lastName || item.lastname || "",
//           firstName: item.firstName || item.firstname || "",
//           status: parseEmployeeStatus(item),
//           createDate:
//             item.createdDate || item.createDate
//               ? String(item.createdDate || item.createDate).split("T")[0]
//               : "",
//           modifiedName:
//             item.supervisorName || item.supervisor || item.modifiedName || "",
//           createdBy: item.createdBy || "",
//           modifiedDate: item.modifiedDate
//             ? String(item.modifiedDate).split("T")[0]
//             : "",
//           modifiedBy: item.modifiedBy || "",
//           _new: false,
//         };
//       });
//       setTimesheetSchedule(tsSchedule.data)
//       setEmployees(loaded);
//       setSavedEmployees(loaded.map((e) => ({ ...e })));
//       setSelectedIds([]);
//       setEditingId(null);
//     } catch (err) {
//       console.error("Error loading employees from API:", err);
//       setEmployees([]);
//       setSavedEmployees([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const filteredEmployees = useMemo(() => {
//     const query = searchQuery.trim().toLowerCase();
//     const filtered = employees.filter((employee) => {
//       const matchesSearch =
//         !query ||
//         columns.some((column) =>
//           String(employee[column.key] ?? "")
//             .toLowerCase()
//             .includes(query),
//         );
//       const matchesStatus =
//         selectedStatus === "All" || employee.status === selectedStatus;
//       return matchesSearch && matchesStatus;
//     });
//     return [...filtered].sort((a, b) => {
//       if (a._new && !b._new) return -1;
//       if (!a._new && b._new) return 1;

//       const aId = String(a.employeeId || "")
//         .trim()
//         .toLowerCase();
//       const bId = String(b.employeeId || "")
//         .trim()
//         .toLowerCase();
//       const aRecentIdx = aId ? recentSavedIds.indexOf(aId) : -1;
//       const bRecentIdx = bId ? recentSavedIds.indexOf(bId) : -1;

//       if (aRecentIdx !== -1 && bRecentIdx !== -1) {
//         return aRecentIdx - bRecentIdx;
//       }
//       if (aRecentIdx !== -1) return -1;
//       if (bRecentIdx !== -1) return 1;

//       const result = String(a[sortConfig.key] ?? "")
//         .toLowerCase()
//         .localeCompare(
//           String(b[sortConfig.key] ?? "").toLowerCase(),
//           undefined,
//           { numeric: true },
//         );
//       return sortConfig.direction === "asc" ? result : -result;
//     });
//   }, [employees, searchQuery, selectedStatus, sortConfig, recentSavedIds]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredEmployees.length / pageSize),
//   );
//   const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

//   const pageOptions = useMemo(() => {
//     return Array.from({ length: totalPages }, (_, i) => i + 1);
//   }, [totalPages]);

//   const paginatedEmployees = filteredEmployees.slice(
//     (safeCurrentPage - 1) * pageSize,
//     safeCurrentPage * pageSize,
//   );
//   const visibleIds = paginatedEmployees.map((employee) => employee._rowId);
//   const allVisibleSelected =
//     visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

//   const resetFilters = () => {
//     setSearchQuery("");
//     setSelectedStatus("All");
//     setCurrentPage(1);
//   };

//   const handleSort = (key) =>
//     setSortConfig((previous) => ({
//       key,
//       direction:
//         previous.key === key && previous.direction === "asc" ? "desc" : "asc",
//     }));

//   const handleNewUser = () => {
//     const blank = makeBlankEmployee();
//     setEmployees((previous) => [blank, ...previous]);
//     setEditingId(blank._rowId);
//     setSelectedIds([blank._rowId]);
//     setCurrentPage(1);
//     setSearchQuery("");
//     setSelectedStatus("All");
//   };

//   const updateEmployee = (employee, key, value) => {
//     const rowId = employee._rowId;
//     setEmployees((previous) =>
//       previous.map((item) =>
//         item._rowId === rowId ? { ...item, [key]: value } : item,
//       ),
//     );
//   };

//   const handleDeleteClick = async () => {
//     if (!selectedIds.length) return;

//     if (
//       !window.confirm(
//         `Are you sure you want to delete ${selectedIds.length} employee(s)?`,
//       )
//     ) {
//       return;
//     }

//     setUserFormLoading(true);
//     try {
//       const toDelete = employees.filter((employee) =>
//         selectedIds.includes(employee._rowId),
//       );

//       for (const emp of toDelete) {
//         const isSaved = savedEmployees.some(
//           (s) => s.employeeId === emp.employeeId && !emp._new,
//         );
//         if (isSaved && emp.employeeId) {
//           const res = await fetch(
//             `${backendUrl}/api/EmployeeMaster/${encodeURIComponent(emp.employeeId.trim())}`,
//             {
//               method: "DELETE",
//             },
//           );
//           if (!res.ok) {
//             const err = await res.json().catch(() => ({}));
//             throw new Error(
//               err.message || err.error || `Failed to delete ${emp.employeeId}`,
//             );
//           }
//         }
//       }

//       const deletedIds = toDelete
//         .map((emp) => emp.employeeId.trim().toLowerCase())
//         .filter(Boolean);

//       setRecentSavedIds((previous) => {
//         const next = previous.filter(
//           (id) => !deletedIds.includes(String(id).toLowerCase()),
//         );
//         try {
//           localStorage.setItem(
//             "employee_master_recent_ids",
//             JSON.stringify(next),
//           );
//         } catch {}
//         return next;
//       });

//       alert("Selected employee(s) deleted successfully.");
//       await fetchEmployees();
//     } catch (error) {
//       console.error("Failed to delete employees:", error);
//       alert(error.message || "Unable to delete employees. Please try again.");
//     } finally {
//       setUserFormLoading(false);
//     }
//   };

//   const handleClear = () => {
//     setEmployees(savedEmployees.map((employee) => ({ ...employee })));
//     setSelectedIds([]);
//     setEditingId(null);
//     resetFilters();
//   };

//   const handleSaveUsers = async () => {
//     setUserFormLoading(true);

//     try {
//       const employeesToSave =
//         selectedIds.length > 0
//           ? employees.filter((employee) =>
//               selectedIds.includes(employee._rowId),
//             )
//           : employees.filter((employee) => {
//               if (employee._new) return true;
//               const orig = savedEmployees.find(
//                 (s) => s.employeeId === employee.employeeId,
//               );
//               if (!orig) return false;
//               return columns.some(
//                 (col) => (employee[col.key] || "") !== (orig[col.key] || ""),
//               );
//             });

//       if (employeesToSave.length === 0) {
//         alert("Please select at least one employee to save.");
//         setUserFormLoading(false);
//         return;
//       }

//       const missingEmployeeId = employeesToSave.find(
//         (employee) => !String(employee.employeeId || "").trim(),
//       );

//       if (missingEmployeeId) {
//         alert("Please enter an Employee ID for every employee before saving.");
//         setEditingId(missingEmployeeId._rowId);
//         setSelectedIds([missingEmployeeId._rowId]);
//         setUserFormLoading(false);
//         return;
//       }

//       const ids = employees
//         .map((employee) =>
//           String(employee.employeeId || "")
//             .trim()
//             .toLowerCase(),
//         )
//         .filter(Boolean);

//       if (new Set(ids).size !== ids.length) {
//         alert("Employee IDs must be unique.");
//         setUserFormLoading(false);
//         return;
//       }

//       const todayIso = new Date().toISOString().split("T")[0];

//       for (const emp of employeesToSave) {
//         const isNew =
//           emp._new ||
//           !savedEmployees.some(
//             (s) =>
//               s.employeeId.toLowerCase() ===
//               emp.employeeId.trim().toLowerCase(),
//           );

//         const existingSaved = savedEmployees.find(
//           (s) =>
//             s.employeeId.toLowerCase() === emp.employeeId.trim().toLowerCase(),
//         );

//         const payload = {
//           employeeId: emp.employeeId.trim(),
//           displayedName: emp.displayedName?.trim() || null,
//           firstName: emp.firstName?.trim() || null,
//           lastName: emp.lastName?.trim() || null,
//           status: emp.status === "Active" ? "ACT" : "IN",
//           supervisorName: emp.modifiedName?.trim() || null,
//           supervisor: emp.modifiedName?.trim() || null,
//           createdBy: isNew
//             ? userName || "admin"
//             : existingSaved?.createdBy || emp.createdBy?.trim() || "admin",
//           createDate:
//             emp.createDate?.trim() ||
//             (isNew ? todayIso : existingSaved?.createDate || todayIso),
//           modifiedBy: userName || "admin",
//           modifiedDate: todayIso,
//         };

//         if (isNew) {
//           const res = await fetch(`${backendUrl}/api/EmployeeMaster`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//           });
//           if (!res.ok) {
//             const err = await res.json().catch(() => ({}));
//             throw new Error(
//               err.message ||
//                 err.error ||
//                 `Failed to create employee ${emp.employeeId}`,
//             );
//           }
//         } else {
//           const res = await fetch(
//             `${backendUrl}/api/EmployeeMaster/${encodeURIComponent(emp.employeeId.trim())}`,
//             {
//               method: "PUT",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(payload),
//             },
//           );
//           if (!res.ok) {
//             const err = await res.json().catch(() => ({}));
//             throw new Error(
//               err.message ||
//                 err.error ||
//                 `Failed to update employee ${emp.employeeId}`,
//             );
//           }
//         }
//       }

//       const justSavedIds = employeesToSave
//         .map((emp) => emp.employeeId.trim().toLowerCase())
//         .filter(Boolean);

//       const updatedRecent = [
//         ...justSavedIds,
//         ...recentSavedIds.filter((id) => !justSavedIds.includes(id)),
//       ].slice(0, 100);

//       setRecentSavedIds(updatedRecent);
//       try {
//         localStorage.setItem(
//           "employee_master_recent_ids",
//           JSON.stringify(updatedRecent),
//         );
//       } catch {}

//       alert("Employees saved successfully.");
//       await fetchEmployees();
//       setCurrentPage(1);
//     } catch (error) {
//       console.error("Error saving employees:", error);
//       alert(error.message || "Unable to save employees. Please try again.");
//     } finally {
//       setUserFormLoading(false);
//     }
//   };

//   const handleCopy = () => {
//     const selectedEmployees = employees.filter((employee) =>
//       selectedIds.includes(employee._rowId),
//     );

//     if (selectedEmployees.length === 0) {
//       alert("Please select an employee to copy.");
//       return;
//     }

//     setCopiedEmployees(
//       selectedEmployees.map(({ _rowId, _new, ...employee }) => ({
//         ...employee,
//       })),
//     );
//   };

//   const handlePaste = () => {
//     if (copiedEmployees.length === 0) {
//       alert("Please select an employee and click Copy first.");
//       return;
//     }

//     const existingEmployeeIds = new Set(
//       employees
//         .map((employee) =>
//           String(employee.employeeId || "")
//             .trim()
//             .toLowerCase(),
//         )
//         .filter(Boolean),
//     );

//     const pastedEmployees = copiedEmployees.map((employee) => {
//       const baseId = String(employee.employeeId || "").trim();
//       let newEmployeeId = baseId;
//       let suffix = 1;

//       while (
//         newEmployeeId &&
//         existingEmployeeIds.has(newEmployeeId.toLowerCase())
//       ) {
//         newEmployeeId = `${baseId}-COPY${suffix++}`;
//       }
//       if (newEmployeeId) existingEmployeeIds.add(newEmployeeId.toLowerCase());

//       return {
//         ...employee,
//         _rowId: `employee-paste-${Date.now()}-${Math.random().toString(36).slice(2)}`,
//         employeeId: newEmployeeId,
//         _new: true,
//       };
//     });

//     setEmployees((previous) => [...pastedEmployees, ...previous]);
//     setSelectedIds(pastedEmployees.map((employee) => employee._rowId));
//     setEditingId(pastedEmployees[0]?._rowId ?? null);
//     setCurrentPage(1);
//     setSearchQuery("");
//     setSelectedStatus("All");
//   };

//   const handleExport = () => {
//     const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
//     const headers = columns.map((column) => escapeCSV(column.label));
//     const rows = filteredEmployees.map((employee) =>
//       columns.map((column) => escapeCSV(employee[column.key])).join(","),
//     );
//     const blob = new Blob(
//       ["\uFEFF" + [headers.join(","), ...rows].join("\r\n")],
//       {
//         type: "text/csv;charset=utf-8;",
//       },
//     );
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "employee-master.csv";
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   const handleImport = (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (loadEvent) => {
//       const lines = String(loadEvent.target?.result || "")
//         .replace(/^\uFEFF/, "")
//         .split(/\r?\n/)
//         .filter((line) => line.trim());

//       if (lines.length < 2) {
//         alert("The CSV file has no employee rows.");
//         event.target.value = "";
//         return;
//       }

//       const parseCSVLine = (line) => {
//         const values = [];
//         let value = "";
//         let inQuotes = false;
//         for (let i = 0; i < line.length; i++) {
//           const char = line[i];
//           if (char === '"' && line[i + 1] === '"' && inQuotes) {
//             value += '"';
//             i++;
//           } else if (char === '"') {
//             inQuotes = !inQuotes;
//           } else if (char === "," && !inQuotes) {
//             values.push(value);
//             value = "";
//           } else {
//             value += char;
//           }
//         }
//         values.push(value);
//         return values;
//       };

//       const normalize = (value) =>
//         value
//           .trim()
//           .toLowerCase()
//           .replace(/[^a-z0-9]/g, "");
//       const headers = parseCSVLine(lines[0]).map(normalize);
//       const existingIds = new Set(
//         employees
//           .map((employee) =>
//             String(employee.employeeId || "")
//               .trim()
//               .toLowerCase(),
//           )
//           .filter(Boolean),
//       );
//       const imported = [];

//       const COLUMN_ALIASES = {
//         employeeId: ["employeeid", "emplid", "empid", "id"],
//         displayedName: [
//           "displayedname",
//           "displayname",
//           "name",
//           "fullname",
//           "employeename",
//         ],
//         firstName: ["firstname", "fname", "first"],
//         lastName: ["lastname", "lname", "last"],
//         status: ["status", "employeestatus", "emplstatus", "isactive", "state"],
//         createDate: [
//           "createdate",
//           "createddate",
//           "creationdate",
//           "datecreated",
//           "createdon",
//           "createdat",
//         ],
//         createdBy: ["createdby", "creator", "createduser"],
//         modifiedDate: [
//           "modifieddate",
//           "modifydate",
//           "updateddate",
//           "updatedat",
//           "modifiedon",
//         ],
//         modifiedBy: ["modifiedby", "modifier", "updatedby"],
//         modifiedName: ["modifiedname", "supervisorname", "supervisor"],
//       };

//       lines.slice(1).forEach((line, index) => {
//         const values = parseCSVLine(line);
//         const employee = {};
//         columns.forEach((column) => {
//           const labelNorm = normalize(column.label);
//           const keyNorm = normalize(column.key);
//           const aliases = COLUMN_ALIASES[column.key] || [labelNorm, keyNorm];

//           let headerIndex = headers.indexOf(labelNorm);
//           if (headerIndex === -1) {
//             headerIndex = headers.indexOf(keyNorm);
//           }
//           if (headerIndex === -1) {
//             headerIndex = headers.findIndex((h) => aliases.includes(h));
//           }

//           let val = headerIndex >= 0 ? (values[headerIndex] || "").trim() : "";
//           if (column.key === "createDate" || column.key === "modifiedDate") {
//             val = formatDateForInput(val);
//           }
//           employee[column.key] = val;
//         });
//         const employeeId = String(employee.employeeId || "").trim();
//         if (
//           !columns.some((column) => String(employee[column.key] || "").trim())
//         )
//           return;
//         if (employeeId && existingIds.has(employeeId.toLowerCase())) return;
//         if (employeeId) existingIds.add(employeeId.toLowerCase());
//         imported.push({
//           ...employee,
//           status: parseEmployeeStatus(employee),
//           _rowId: `employee-import-${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
//           _new: true,
//         });
//       });

//       if (imported.length === 0) {
//         alert(
//           "No new employee rows were imported. Existing Employee IDs may have been skipped.",
//         );
//       } else {
//         setEmployees((previous) => [...imported, ...previous]);
//         setSelectedIds(imported.map((employee) => employee._rowId));
//         setEditingId(imported[0]._rowId);
//         setCurrentPage(1);
//         setSearchQuery("");
//         setSelectedStatus("All");
//         alert(`${imported.length} employee(s) imported.`);
//       }
//       event.target.value = "";
//     };
//     reader.readAsText(file);
//   };

//   const handleSalaryInfo = async () => {
//     const selectedEmployees = employees.filter((employee) =>
//       selectedIds.includes(employee._rowId),
//     );

//     if (selectedEmployees.length === 0) {
//       alert("Please select an employee to view salary info.");
//       return;
//     }
//     setSalaryInfoLoading(true);
//     setSalaryInfoEmployee(selectedEmployees[0]);
//     setSalaryInfoModalOpen(true);

//     const targetEmpId = selectedEmployees[0].employeeId || "001034";

//     try {
//       const response = await fetch(
//         `${backendUrl}/api/EmployeeMaster/SalaryInfo/${encodeURIComponent(targetEmpId)}`,
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       const formattedData = Array.isArray(data)
//         ? data.map((item) => ({
//             emplId: item.emplId || targetEmpId,
//             effectDt: item.effectDt ? item.effectDt.split("T")[0] : "",
//             sHrlySalCd: item.sHrlySalCd || "",
//             hrlyAmt: item.hrlyAmt ?? 0,
//             salAmt: item.salAmt ?? 0,
//             annlAmt: item.annlAmt ?? 0,
//             sEmplTypeCd: item.sEmplTypeCd || "",
//             orgId: item.orgId || "",
//             titleDesc: item.titleDesc || "",
//             workStateCd: item.workStateCd || "",
//             stdEstHrs: item.stdEstHrs ?? 0,
//             pctIncrRt: item.pctIncrRt ?? 0,
//             reasonDesc: item.reasonDesc || "",
//             labLocCd: item.labLocCd || "",
//             salGradeCd: item.salGradeCd || "",
//             mgrEmplId1: item.mgrEmplId1 || "",
//             endDt: item.endDt ? item.endDt.split("T")[0] : "",
//             emplClassCd: item.emplClassCd || "",
//             reasonDesc2: item.reasonDesc2 || "",
//             reasonDesc3: item.reasonDesc3 || "",
//           }))
//         : [];

//       setSalaryInfo(formattedData);
//       setOriginalSalaryInfo(JSON.parse(JSON.stringify(formattedData)));
//     } catch (error) {
//       console.error(`Error fetching salary info: ${error.message}`);
//       setSalaryInfo([]);
//     } finally {
//       setSalaryInfoLoading(false);
//     }
//   };

//   const updateSalaryField = (index, key, value) => {
//     console.log(index, key , value)
//     setSalaryInfo((previous) =>
//       previous.map((item, idx) =>
//         idx === index ? { ...item, [key]: value } : item,
//       ),
//     );
//   };

// console.log(salaryInfo)

//   const handleSaveSalaryRow = async (index) => {
//     const item = salaryInfo[index];
//     if (!item) return;

//     setSavingSalaryIdx(index);
//     try {
//       const payload = {
//         emplId: String(item.emplId || "").trim(),
//         effectDt: item.effectDt ? `${item.effectDt}T00:00:00` : null,
//         sHrlySalCd: String(item.sHrlySalCd || "").trim(),
//         hrlyAmt: parseFloat(item.hrlyAmt) || 0,
//         salAmt: parseFloat(item.salAmt) || 0,
//         annlAmt: parseFloat(item.annlAmt) || 0,
//         sEmplTypeCd: String(item.sEmplTypeCd || "").trim(),
//         orgId: String(item.orgId || "").trim(),
//         titleDesc: String(item.titleDesc || "").trim(),
//         workStateCd: String(item.workStateCd || "").trim(),
//         stdEstHrs: parseFloat(item.stdEstHrs) || 0,
//         pctIncrRt: parseFloat(item.pctIncrRt) || 0,
//         reasonDesc: String(item.reasonDesc || "").trim(),
//         labLocCd: String(item.labLocCd || "").trim(),
//         salGradeCd: String(item.salGradeCd || "").trim(),
//         mgrEmplId1: String(item.mgrEmplId1 || "").trim(),
//         endDt: item.endDt ? `${item.endDt}T00:00:00` : null,
//         emplClassCd: String(item.emplClassCd || "").trim(),
//         reasonDesc2: String(item.reasonDesc2 || "").trim(),
//         reasonDesc3: String(item.reasonDesc3 || "").trim(),
//       };

//       const res = await fetch(
//         `${backendUrl}/api/EmployeeMaster/SalaryDetail/update`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         },
//       );

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(
//           err.message || err.error || "Failed to update salary info.",
//         );
//       }

//       alert("Salary information saved successfully.");
//     } catch (error) {
//       console.error("Error saving salary info:", error);
//       alert(error.message || "Unable to save salary info. Please try again.");
//     } finally {
//       setSavingSalaryIdx(null);
//     }
//   };

//   const toggleSelected = (id, checked) =>
//     setSelectedIds((previous) =>
//       checked
//         ? [...new Set([...previous, id])]
//         : previous.filter((item) => item !== id),
//     );
//   const toggleAllVisible = (checked) =>
//     setSelectedIds((previous) =>
//       checked
//         ? [...new Set([...previous, ...visibleIds])]
//         : previous.filter((id) => !visibleIds.includes(id)),
//     );

//   return (
//     <div className="w-full min-h-screen bg-[#e7f2f5] px-3 py-2 pb-4 text-xs text-slate-800 sm:px-4">
//       <header className="mb-3 flex items-center gap-2.5 rounded-md border border-slate-200 bg-white px-3 py-2.5">
//         <svg
//           className="h-5 w-5 shrink-0 text-blue-600"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.8"
//           aria-hidden="true"
//         >
//           <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
//           <path d="m7.5 12 3 3 6-7" />
//         </svg>
//         <h1 className="text-lg font-bold leading-tight text-slate-800">
//           Employee Master
//         </h1>
//       </header>

//       <div className="mb-3 flex flex-wrap items-center gap-2">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(event) => {
//             setSearchQuery(event.target.value);
//             setCurrentPage(1);
//           }}
//           placeholder="Search Employee"
//           aria-label="Search employees"
//           className="h-8 w-[201px] max-w-full rounded border border-slate-300 bg-white px-3 text-xs outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
//         />
//         <select
//           value={selectedStatus}
//           onChange={(event) => {
//             setSelectedStatus(event.target.value);
//             setCurrentPage(1);
//           }}
//           aria-label="Filter by status"
//           className="h-8 w-[201px] max-w-full rounded border border-slate-300 bg-white px-3 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
//         >
//           <option value="All">All Statuses</option>
//           <option value="Active">Active</option>
//           <option value="Inactive">Inactive</option>
//         </select>
//       </div>

//       <section className="w-full rounded border border-slate-300 bg-white p-2 shadow-sm">
//         <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
//           <span className="text-xs text-slate-600">
//             Total records:{" "}
//             <strong className="text-slate-800">
//               {filteredEmployees.length}
//             </strong>
//           </span>
//           <div className="flex flex-wrap items-center gap-2">
//             <button
//               type="button"
//               onClick={handleSalaryInfo}
//               className="btn1 btn-blue whitespace-nowrap rounded-full"
//               disabled={userFormLoading}
//             >
//               Salary Info
//             </button>
//             <button
//               type="button"
//               onClick={handleNewUser}
//               className="btn1 btn-blue whitespace-nowrap rounded-full"
//               disabled={userFormLoading}
//             >
//               New User
//             </button>

//             <button
//               type="button"
//               onClick={handleDeleteClick}
//               className="btn1 btn-red whitespace-nowrap rounded-full"
//               disabled={selectedIds.length === 0}
//             >
//               Delete
//             </button>

//             <button
//               type="button"
//               onClick={handleClear}
//               className="btn1 btn-blue whitespace-nowrap rounded-full"
//               disabled={selectedIds.length === 0}
//             >
//               Clear
//             </button>

//             <button
//               type="button"
//               onClick={handleCopy}
//               className="btn1 btn-blue whitespace-nowrap rounded-full"
//               disabled={selectedIds.length === 0}
//             >
//               Copy
//             </button>

//             <button
//               type="button"
//               onClick={handlePaste}
//               className="btn1 btn-blue whitespace-nowrap rounded-full"
//               disabled={copiedEmployees.length === 0}
//             >
//               Paste
//             </button>

//             <label className="btn1 btn-blue whitespace-nowrap rounded-full cursor-pointer">
//               Import
//               <input
//                 type="file"
//                 accept=".csv,text/csv"
//                 onChange={handleImport}
//                 className="hidden"
//               />
//             </label>

//             <button
//               type="button"
//               onClick={handleExport}
//               className="btn1 btn-blue whitespace-nowrap rounded-full"
//             >
//               Export
//             </button>

//             <button
//               type="button"
//               onClick={handleSaveUsers}
//               className="btn1 btn-blue whitespace-nowrap rounded-full"
//               disabled={userFormLoading}
//             >
//               {userFormLoading ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </div>

//         <div className="w-full max-h-[calc(100vh-320px)] min-h-[280px] overflow-auto rounded-sm border border-slate-200">
//           <table className="w-full min-w-[1120px] border-separate border-spacing-0 text-left text-xs text-slate-800">
//             <thead className="sticky top-0 z-10 bg-sky-100">
//               <tr>
//                 <th className="w-9 border-b border-r border-slate-300 bg-sky-100 px-2 py-2 text-center">
//                   <input
//                     type="checkbox"
//                     aria-label="Select all visible employees"
//                     checked={allVisibleSelected}
//                     onChange={(event) => toggleAllVisible(event.target.checked)}
//                     className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
//                   />
//                 </th>
//                 {columns.map((column) => (
//                   <th
//                     key={column.key}
//                     className="whitespace-nowrap border-b border-r border-slate-300 bg-sky-100 px-2 py-2 font-bold text-slate-800 last:border-r-0"
//                   >
//                     <button
//                       type="button"
//                       onClick={() => handleSort(column.key)}
//                       className="inline-flex items-center gap-1 whitespace-nowrap text-left"
//                       aria-label={`Sort by ${column.label}`}
//                     >
//                       {column.label}
//                       <span className="text-[10px] text-slate-500">
//                         {sortConfig.key === column.key
//                           ? sortConfig.direction === "asc"
//                             ? "↑"
//                             : "↓"
//                           : "↕"}
//                       </span>
//                     </button>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedEmployees.length ? (
//                 paginatedEmployees.map((employee, index) => {
//                   const id = employee._rowId;
//                   const isEditing = editingId === id;
//                   const isSelected = selectedIds.includes(id);
//                   const selectAndEditRow = () => {
//                     setSelectedIds((previous) =>
//                       previous.includes(id) ? previous : [...previous, id],
//                     );
//                     setEditingId(id);
//                   };
//                   return (
//                     <tr
//                       key={employee._rowId}
//                       onClick={selectAndEditRow}
//                       className="cursor-pointer bg-white"
//                     >
//                       <td
//                         className="border-b border-r border-slate-200 px-2 py-1.5 text-center"
//                         onClick={(event) => event.stopPropagation()}
//                       >
//                         <input
//                           type="checkbox"
//                           aria-label={`Select ${employee.employeeId || "new employee row"}`}
//                           checked={isSelected}
//                           onChange={(event) =>
//                             toggleSelected(id, event.target.checked)
//                           }
//                           className="h-3.5 w-3.5 cursor-pointer"
//                         />
//                       </td>
//                       {columns.map((column) => (
//                         <td
//                           key={column.key}
//                           className="border-b border-r border-slate-200 px-2 py-1.5 last:border-r-0"
//                           onClick={selectAndEditRow}
//                         >
//                           {isEditing ? (
//                             column.key === "employeeId" && !employee._new ? (
//                               <span
//                                 className="inline-block min-w-[100px] px-1.5 text-slate-500"
//                                 title="Saved Employee IDs cannot be changed"
//                               >
//                                 {employee.employeeId || "—"}
//                               </span>
//                             ) : column.key === "status" ? (
//                               <select
//                                 value={employee.status || "Active"}
//                                 onChange={(event) =>
//                                   updateEmployee(
//                                     employee,
//                                     column.key,
//                                     event.target.value,
//                                   )
//                                 }
//                                 onClick={(event) => event.stopPropagation()}
//                                 className="h-7 min-w-[82px] rounded border border-blue-200 bg-white px-1.5 text-xs outline-none focus:border-blue-500"
//                               >
//                                 <option value="Active">Active</option>
//                                 <option value="Inactive">Inactive</option>
//                               </select>
//                             ) : column.key === "createDate" ? (
//                               <input
//                                 type="date"
//                                 value={employee[column.key] || ""}
//                                 onChange={(event) =>
//                                   updateEmployee(
//                                     employee,
//                                     column.key,
//                                     event.target.value,
//                                   )
//                                 }
//                                 onClick={(event) => event.stopPropagation()}
//                                 className="h-7 min-w-[125px] rounded border border-blue-200 bg-white px-1.5 text-xs outline-none focus:border-blue-500"
//                               />
//                             ) : column.key === "tsSchdule" ? (
//                               <select
//                                 value={employee.tsSchId ?? ""}
//                                 onChange={(e) =>
//                                   updateEmployee(
//                                     employee.employeeId,
//                                     "tsSchdule",
//                                     e.target.value
//                                   )
//                                 }
//                               >
//                                 <option value="">Select Timesheet Type</option>

//                                 {timesheetSchedule
//                                   .filter((schedule) => schedule.isActive)
//                                   .map((schedule) => (
//                                     <option
//                                       key={schedule.scheduleId}
//                                       value={schedule.scheduleId}
//                                     >
//                                       {schedule.timesheetType}
//                                     </option>
//                                   ))}
//                               </select>
//                              ):  (
//                               <input
//                                 type="text"
//                                 value={employee[column.key] || ""}
//                                 onChange={(event) =>
//                                   updateEmployee(
//                                     employee,
//                                     column.key,
//                                     event.target.value,
//                                   )
//                                 }
//                                 onClick={(event) => event.stopPropagation()}
//                                 className="h-7 min-w-[100px] w-full rounded border border-blue-200 bg-white px-1.5 text-xs outline-none focus:border-blue-500"
//                               />
//                             )
//                           ) : column.key === "status" ? (
//                             <span
//                               className={`inline-block min-w-[56px] rounded border px-2 py-0.5 text-center text-[11px] ${employee.status === "Active" ? "border-green-200 bg-green-50 text-green-800" : "border-slate-200 bg-slate-50 text-slate-600"}`}
//                             >
//                               {employee.status || "—"}
//                             </span>
//                           ) : (
//                             <span
//                               className={
//                                 column.key === "employeeId" ||
//                                 column.key === "displayedName"
//                                   ? "text-blue-900"
//                                   : ""
//                               }
//                             >
//                               {employee[column.key] || "—"}
//                             </span>
//                           )}
//                         </td>
//                       ))}
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={columns.length + 1}
//                     className="px-3 py-5 text-center text-slate-500"
//                   >
//                     {loading ? "Loading employees..." : "No employees found."}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-3 pb-1 text-xs text-slate-600">
//           <div className="flex flex-wrap items-center gap-3">
//             <span>
//               Showing{" "}
//               <strong>
//                 {filteredEmployees.length === 0
//                   ? 0
//                   : (safeCurrentPage - 1) * pageSize + 1}
//                 –
//                 {Math.min(safeCurrentPage * pageSize, filteredEmployees.length)}
//               </strong>{" "}
//               of <strong>{filteredEmployees.length}</strong> records
//             </span>
//             <div className="flex items-center gap-1.5">
//               <span>Rows per page:</span>
//               <select
//                 value={pageSize}
//                 onChange={(e) => {
//                   setPageSize(Number(e.target.value));
//                   setCurrentPage(1);
//                 }}
//                 className="h-7 rounded border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"
//               >
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//                 <option value={100}>100</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             <button
//               type="button"
//               onClick={() => setCurrentPage(1)}
//               disabled={safeCurrentPage === 1}
//               className="h-7 rounded border border-slate-300 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//               title="First Page"
//             >
//               « First
//             </button>
//             <button
//               type="button"
//               onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
//               disabled={safeCurrentPage === 1}
//               className="h-7 rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//             >
//               Previous
//             </button>

//             <div className="flex items-center gap-1">
//               <span>Page</span>
//               <select
//                 value={safeCurrentPage}
//                 onChange={(e) => setCurrentPage(Number(e.target.value))}
//                 className="h-7 rounded border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"
//               >
//                 {pageOptions.map((pg) => (
//                   <option key={pg} value={pg}>
//                     {pg}
//                   </option>
//                 ))}
//               </select>
//               <span>of {totalPages}</span>
//             </div>

//             <button
//               type="button"
//               onClick={() =>
//                 setCurrentPage((page) => Math.min(totalPages, page + 1))
//               }
//               disabled={safeCurrentPage === totalPages}
//               className="h-7 rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//             >
//               Next
//             </button>
//             <button
//               type="button"
//               onClick={() => setCurrentPage(totalPages)}
//               disabled={safeCurrentPage === totalPages}
//               className="h-7 rounded border border-slate-300 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//               title="Last Page"
//             >
//               Last »
//             </button>
//           </div>
//         </div>
//       </section>

//       {salaryInfoModalOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
//           onClick={() => setSalaryInfoModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-xl p-6 w-full max-w-7xl shadow-2xl border border-gray-100 font-inter overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
//               <h3 className="text-base font-bold text-gray-900">
//                 Salary Information (
//                 {salaryInfoEmployee?.displayedName ||
//                   salaryInfoEmployee?.employeeId ||
//                   ""}
//                 )
//               </h3>

//               <div className="flex gap-2 items-center">
// <button
//   type="button"
//   onClick={handleSaveSalary}
//   disabled={savingSalary}
//   className="btn1 btn-blue !py-1 !px-3 text-xs cursor-pointer"
// >
//   {savingSalary ? "Saving..." : "Save"}
// </button>
//               <button
//                 onClick={() => setSalaryInfoModalOpen(false)}
//                 className="btn1 btn-blue !py-1 !px-3 text-xs cursor-pointer"
//               >
//                 Close
//               </button>
//               </div>
//             </div>

//             <div className="overflow-auto max-h-[60vh] border border-gray-300 rounded-lg">
//               {salaryInfoLoading ? (
//                 <div className="flex items-center justify-center py-12">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                   <span className="ml-2 text-xs font-medium text-gray-600">
//                     Loading salary info...
//                   </span>
//                 </div>
//               ) : (
//                 <table className="w-full text-xs border-collapse whitespace-nowrap">
//                   <thead className="sticky top-0 bg-[#e5f3fb] z-10">
//                     <tr>
//                       <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
//                         Effective Date
//                       </th>
//                       <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
//                         Title
//                       </th>
//                       <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
//                         Hourly / Sal. Code
//                       </th>
//                       <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
//                         Hourly Amt
//                       </th>
//                       <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
//                         Salary Amt
//                       </th>
//                       <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
//                         Annual Amt
//                       </th>
//                       <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
//                         Empl Type
//                       </th>
//                       <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
//                         Org ID
//                       </th>
//                       <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
//                         Work State
//                       </th>
//                       <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
//                         Reason
//                       </th>
//                       {/* <th className="px-3 py-2 border-b border-gray-300 font-semibold text-black text-center">
//                         Action
//                       </th> */}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//   {salaryInfo.length > 0 ? (
//     salaryInfo.map((item, idx) => (
//       <tr
//         key={`${item.emplId}-${item.effectDt}-${idx}`}
//         className={
//           idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
//         }
//       >
//         <td className="px-2 py-1.5 text-center border-r border-b border-gray-300">
//           <input
//             type="date"
//             value={item.effectDt || ""}
//             onChange={(e) =>
//               updateSalaryField(idx, "effectDt", e.target.value)
//             }
//             className="h-7 rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500"
//           />
//         </td>

//         <td className="px-2 py-1.5 text-left border-r border-b border-gray-300">
//           <input
//             type="text"
//             value={item.titleDesc || ""}
//             onChange={(e) =>
//               updateSalaryField(idx, "titleDesc", e.target.value)
//             }
//             className="h-7 w-full rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500"
//           />
//         </td>

//         <td className="px-2 py-1.5 text-center border-r border-b border-gray-300">
//           <input
//             type="text"
//             value={item.sHrlySalCd || ""}
//             onChange={(e) =>
//               updateSalaryField(idx, "sHrlySalCd", e.target.value)
//             }
//             className="h-7 w-12 text-center rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500"
//           />
//         </td>

//         <td className="px-2 py-1.5 text-right border-r border-b border-gray-300">
//           <input
//             type="number"
//             step="0.01"
//             value={item.hrlyAmt ?? ""}
//             onChange={(e) =>
//               updateSalaryField(idx, "hrlyAmt", e.target.value)
//             }
//             className="h-7 w-20 text-right rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500"
//           />
//         </td>

//         <td className="px-2 py-1.5 text-right border-r border-b border-gray-300">
//           <input
//             type="number"
//             step="0.01"
//             value={item.salAmt ?? ""}
//             onChange={(e) =>
//               updateSalaryField(idx, "salAmt", e.target.value)
//             }
//             className="h-7 w-24 text-right rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500"
//           />
//         </td>

//         <td className="px-2 py-1.5 text-right border-r border-b border-gray-300">
//           <input
//             type="number"
//             step="0.01"
//             value={item.annlAmt ?? ""}
//             onChange={(e) =>
//               updateSalaryField(idx, "annlAmt", e.target.value)
//             }
//             className="h-7 w-28 text-right rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500 font-bold text-green-700"
//           />
//         </td>

//         <td className="px-2 py-1.5 text-center border-r border-b border-gray-300">
//           <input
//             type="text"
//             value={item.sEmplTypeCd || ""}
//             onChange={(e) =>
//               updateSalaryField(idx, "sEmplTypeCd", e.target.value)
//             }
//             className="h-7 w-12 text-center rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500"
//           />
//         </td>

//         <td className="px-2 py-1.5 text-center border-r border-b border-gray-300">
//           <input
//             type="text"
//             value={item.orgId || ""}
//             onChange={(e) =>
//               updateSalaryField(idx, "orgId", e.target.value)
//             }
//             className="h-7 w-20 text-center rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500"
//           />
//         </td>

//         <td className="px-2 py-1.5 text-center border-r border-b border-gray-300">
//           <input
//             type="text"
//             value={item.workStateCd || ""}
//             onChange={(e) =>
//               updateSalaryField(idx, "workStateCd", e.target.value)
//             }
//             className="h-7 w-12 text-center rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500"
//           />
//         </td>

//         <td className="px-2 py-1.5 text-left border-r border-b border-gray-300">
//           <input
//             type="text"
//             value={item.reasonDesc || ""}
//             onChange={(e) =>
//               updateSalaryField(idx, "reasonDesc", e.target.value)
//             }
//             className="h-7 w-full rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500"
//           />
//         </td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td
//         colSpan={10}
//         className="text-center p-8 italic text-gray-500"
//       >
//         No salary records found for this employee.
//       </td>
//     </tr>
//   )}
// </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { backendUrl } from "./config";
import axios from "axios";
import { toast } from "react-toastify";

const columns = [
  { key: "employeeId", label: "Employee ID" },
  { key: "displayedName", label: "Displayed Name" },
  { key: "lastName", label: "Last Name" },
  { key: "firstName", label: "First Name" },
  { key: "tsSchedule", label: "Timesheet Schedule" },
  { key: "status", label: "Status" },
  { key: "createDate", label: "Create Date" },
  { key: "createdBy", label: "Created By" },
  { key: "modifiedDate", label: "Modified Date" },
  { key: "modifiedBy", label: "Modified By" },
];

/* ---------- timesheet schedule helpers (handle camelCase / PascalCase) ---------- */
const getScheduleId = (s) => String(s?.scheduleId ?? s?.ScheduleId ?? "");
const getScheduleLabel = (s) =>
  s?.timesheetType ??
  s?.TimesheetType ??
  s?.scheduleName ??
  s?.ScheduleName ??
  `Schedule ${getScheduleId(s)}`;
const isScheduleActive = (s) => s?.isActive ?? s?.IsActive ?? true;

// Convert UI value ("" | "3") to what the API expects (null | 3)
const toScheduleNumber = (value) => {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const makeBlankEmployee = () => ({
  _rowId: `employee-new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  employeeId: "",
  displayedName: "",
  lastName: "",
  firstName: "",
  tsSchedule: "",
  status: "Active",
  createDate: "",
  modifiedName: "",
  createdBy: "",
  modifiedDate: "",
  modifiedBy: "",
  _new: true,
});

const parseEmployeeStatus = (item) => {
  if (!item) return "Active";

  const activeFlag =
    item.isActive ?? item.IsActive ?? item.active ?? item.Active;
  if (
    activeFlag === false ||
    activeFlag === 0 ||
    activeFlag === "false" ||
    activeFlag === "0"
  ) {
    return "Inactive";
  }

  const raw =
    item.status ??
    item.Status ??
    item.emplStatus ??
    item.EmplStatus ??
    item.employeeStatus ??
    item.EmployeeStatus ??
    item.statusCode ??
    item.StatusCode ??
    "";

  if (raw === false || raw === 0) return "Inactive";

  const s = String(raw).trim().toUpperCase();

  if (
    s === "IN" ||
    s === "INA" ||
    s === "INACT" ||
    s === "INACTIVE" ||
    s === "I" ||
    s === "TER" ||
    s === "TERM" ||
    s === "TERMINATED" ||
    s === "T" ||
    s === "N" ||
    s === "NO" ||
    s === "FALSE" ||
    s === "0" ||
    s === "DIS" ||
    s === "DISABLED" ||
    s === "DEACTIVE" ||
    s === "DEACTIVATED" ||
    s.startsWith("IN")
  ) {
    return "Inactive";
  }

  return "Active";
};

const formatDateForInput = (val) => {
  if (!val) return "";
  const str = String(val).trim();
  if (!str) return "";

  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, "0");
    const d = isoMatch[3].padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const p1 = parseInt(dmyMatch[1], 10);
    const p2 = parseInt(dmyMatch[2], 10);
    const year = dmyMatch[3];

    let month, day;
    if (p1 > 12) {
      day = String(p1).padStart(2, "0");
      month = String(p2).padStart(2, "0");
    } else if (p2 > 12) {
      month = String(p1).padStart(2, "0");
      day = String(p2).padStart(2, "0");
    } else {
      const parsed = new Date(str);
      if (!isNaN(parsed.getTime())) {
        const y = parsed.getFullYear();
        const m = String(parsed.getMonth() + 1).padStart(2, "0");
        const d = String(parsed.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      }
      month = String(p1).padStart(2, "0");
      day = String(p2).padStart(2, "0");
    }
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  return str;
};

export default function EmployeeMaster() {
  const [employees, setEmployees] = useState([]);
  const [savedEmployees, setSavedEmployees] = useState([]);
  const [timesheetSchedule, setTimesheetSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortConfig, setSortConfig] = useState({
    key: "employeeId",
    direction: "asc",
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [copiedEmployees, setCopiedEmployees] = useState([]);
  const [userFormLoading, setUserFormLoading] = useState(false);
  const [recentSavedIds, setRecentSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem("employee_master_recent_ids");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [salaryInfoLoading, setSalaryInfoLoading] = useState(false);
  const [salaryInfoModalOpen, setSalaryInfoModalOpen] = useState(false);
  const [salaryInfoEmployee, setSalaryInfoEmployee] = useState(null);
  const [salaryInfo, setSalaryInfo] = useState([]);
  const [originalSalaryInfo, setOriginalSalaryInfo] = useState([]);
  const [savingSalary, setSavingSalary] = useState(false);

  const getCurrentUserContext = () => {
    try {
      const userString = localStorage.getItem("currentUser");
      if (!userString) return { userId: "", role: "", userName: "" };
      const userObj = JSON.parse(userString);
      return {
        userId: userObj.userId ?? "",
        userName: userObj.name ?? "",
        role: userObj.role?.toLowerCase() ?? "",
      };
    } catch {
      return { userId: "", role: "", userName: "" };
    }
  };

  const { userName } = getCurrentUserContext();

  /* ---------- schedule lookups ---------- */
  const scheduleById = useMemo(() => {
    const map = new Map();
    timesheetSchedule.forEach((s) => map.set(getScheduleId(s), s));
    return map;
  }, [timesheetSchedule]);

  // Human readable schedule name for an employee's stored schedule ID
  const getEmployeeScheduleLabel = (employee) => {
    const id = String(employee?.tsSchedule ?? "");
    if (!id) return "";
    const schedule = scheduleById.get(id);
    return schedule ? getScheduleLabel(schedule) : id; // fall back to raw id
  };

  // Value shown / searched / sorted / exported for any column
  const getCellValue = (employee, key) =>
    key === "tsSchedule"
      ? getEmployeeScheduleLabel(employee)
      : String(employee[key] ?? "");

  // Resolve CSV text (an id OR a schedule name) to a schedule id
  const resolveScheduleId = (raw) => {
    const text = String(raw ?? "").trim();
    if (!text) return "";
    if (scheduleById.has(text)) return text;
    const match = timesheetSchedule.find(
      (s) => getScheduleLabel(s).trim().toLowerCase() === text.toLowerCase(),
    );
    return match ? getScheduleId(match) : "";
  };

  /* ---------- data loading ---------- */
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const [response, scheduleRes] = await Promise.all([
        fetch(`${backendUrl}/api/EmployeeMaster`),
        axios.get(`${backendUrl}/api/TimesheetSchedule`).catch((err) => {
          console.error("Error loading timesheet schedules:", err);
          toast.error("Failed to load timesheet schedules.");
          return { data: [] };
        }),
      ]);

      if (!response.ok) {
        throw new Error(`Failed to fetch employees (${response.status})`);
      }

      const data = await response.json();
      const loaded = (Array.isArray(data) ? data : []).map((item, index) => {
        const empId = item.employeeId || item.emplId || item.id || "";
        return {
          _rowId: `employee-${empId || index + 1}`,
          employeeId: empId,
          displayedName:
            item.displayedName || item.displayedname || item.name || "",
          lastName: item.lastName || item.lastname || "",
          firstName: item.firstName || item.firstname || "",
          // Store the schedule ID; the UI shows its name via the lookup
          tsSchedule: String(
            item.tsSchedule ?? item.TsSchedule ?? item.tsSchdule ?? item.TsSchdule ?? "",
          ),
          status: parseEmployeeStatus(item),
          createDate:
            item.createdDate || item.createDate
              ? String(item.createdDate || item.createDate).split("T")[0]
              : "",
          modifiedName:
            item.supervisorName || item.supervisor || item.modifiedName || "",
          createdBy: item.createdBy || "",
          modifiedDate: item.modifiedDate
            ? String(item.modifiedDate).split("T")[0]
            : "",
          modifiedBy: item.modifiedBy || "",
          _new: false,
        };
      });

      setTimesheetSchedule(Array.isArray(scheduleRes.data) ? scheduleRes.data : []);
      setEmployees(loaded);
      setSavedEmployees(loaded.map((e) => ({ ...e })));
      setSelectedIds([]);
      setEditingId(null);
    } catch (err) {
      console.error("Error loading employees from API:", err);
      toast.error(err.message || "Failed to load employees.");
      setEmployees([]);
      setSavedEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- filtering / sorting / paging ---------- */
  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = employees.filter((employee) => {
      const matchesSearch =
        !query ||
        columns.some((column) =>
          getCellValue(employee, column.key).toLowerCase().includes(query),
        );
      const matchesStatus =
        selectedStatus === "All" || employee.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (a._new && !b._new) return -1;
      if (!a._new && b._new) return 1;

      const aId = String(a.employeeId || "").trim().toLowerCase();
      const bId = String(b.employeeId || "").trim().toLowerCase();
      const aRecentIdx = aId ? recentSavedIds.indexOf(aId) : -1;
      const bRecentIdx = bId ? recentSavedIds.indexOf(bId) : -1;

      if (aRecentIdx !== -1 && bRecentIdx !== -1) return aRecentIdx - bRecentIdx;
      if (aRecentIdx !== -1) return -1;
      if (bRecentIdx !== -1) return 1;

      const result = getCellValue(a, sortConfig.key)
        .toLowerCase()
        .localeCompare(getCellValue(b, sortConfig.key).toLowerCase(), undefined, {
          numeric: true,
        });
      return sortConfig.direction === "asc" ? result : -result;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, searchQuery, selectedStatus, sortConfig, recentSavedIds, scheduleById]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const pageOptions = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  );

  const paginatedEmployees = filteredEmployees.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );
  const visibleIds = paginatedEmployees.map((employee) => employee._rowId);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setCurrentPage(1);
  };

  const handleSort = (key) =>
    setSortConfig((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));

  const handleNewUser = () => {
    const blank = makeBlankEmployee();
    setEmployees((previous) => [blank, ...previous]);
    setEditingId(blank._rowId);
    setSelectedIds([blank._rowId]);
    setCurrentPage(1);
    setSearchQuery("");
    setSelectedStatus("All");
  };

  const updateEmployee = (employee, key, value) => {
    const rowId = employee._rowId;
    setEmployees((previous) =>
      previous.map((item) =>
        item._rowId === rowId ? { ...item, [key]: value } : item,
      ),
    );
  };

  /* ---------- delete ---------- */
  const handleDeleteClick = async () => {
    if (!selectedIds.length) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} employee(s)?`,
      )
    ) {
      return;
    }

    setUserFormLoading(true);
    try {
      const toDelete = employees.filter((employee) =>
        selectedIds.includes(employee._rowId),
      );

      for (const emp of toDelete) {
        const isSaved = savedEmployees.some(
          (s) => s.employeeId === emp.employeeId && !emp._new,
        );
        if (isSaved && emp.employeeId) {
          const res = await fetch(
            `${backendUrl}/api/EmployeeMaster/${encodeURIComponent(emp.employeeId.trim())}`,
            { method: "DELETE" },
          );
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(
              err.message || err.error || `Failed to delete ${emp.employeeId}`,
            );
          }
        }
      }

      const deletedIds = toDelete
        .map((emp) => emp.employeeId.trim().toLowerCase())
        .filter(Boolean);

      setRecentSavedIds((previous) => {
        const next = previous.filter(
          (id) => !deletedIds.includes(String(id).toLowerCase()),
        );
        try {
          localStorage.setItem("employee_master_recent_ids", JSON.stringify(next));
        } catch {}
        return next;
      });

      alert("Selected employee(s) deleted successfully.");
      await fetchEmployees();
    } catch (error) {
      console.error("Failed to delete employees:", error);
      alert(error.message || "Unable to delete employees. Please try again.");
    } finally {
      setUserFormLoading(false);
    }
  };

  const handleClear = () => {
    setEmployees(savedEmployees.map((employee) => ({ ...employee })));
    setSelectedIds([]);
    setEditingId(null);
    resetFilters();
  };

  /* ---------- save ---------- */
  const handleSaveUsers = async () => {
    setUserFormLoading(true);

    try {
      const employeesToSave =
        selectedIds.length > 0
          ? employees.filter((employee) => selectedIds.includes(employee._rowId))
          : employees.filter((employee) => {
              if (employee._new) return true;
              const orig = savedEmployees.find(
                (s) => s.employeeId === employee.employeeId,
              );
              if (!orig) return false;
              return columns.some(
                (col) => (employee[col.key] || "") !== (orig[col.key] || ""),
              );
            });

      if (employeesToSave.length === 0) {
        alert("Please select at least one employee to save.");
        return;
      }

      const missingEmployeeId = employeesToSave.find(
        (employee) => !String(employee.employeeId || "").trim(),
      );

      if (missingEmployeeId) {
        alert("Please enter an Employee ID for every employee before saving.");
        setEditingId(missingEmployeeId._rowId);
        setSelectedIds([missingEmployeeId._rowId]);
        return;
      }

      const ids = employees
        .map((employee) => String(employee.employeeId || "").trim().toLowerCase())
        .filter(Boolean);

      if (new Set(ids).size !== ids.length) {
        alert("Employee IDs must be unique.");
        return;
      }

      const todayIso = new Date().toISOString().split("T")[0];

      for (const emp of employeesToSave) {
        const isNew =
          emp._new ||
          !savedEmployees.some(
            (s) => s.employeeId.toLowerCase() === emp.employeeId.trim().toLowerCase(),
          );

        const existingSaved = savedEmployees.find(
          (s) => s.employeeId.toLowerCase() === emp.employeeId.trim().toLowerCase(),
        );

        const payload = {
          employeeId: emp.employeeId.trim(),
          displayedName: emp.displayedName?.trim() || null,
          firstName: emp.firstName?.trim() || null,
          lastName: emp.lastName?.trim() || null,
          // number or null – matches backend `long? TsSchedule`
          tsSchedule: toScheduleNumber(emp.tsSchedule),
          status: emp.status === "Active" ? "ACT" : "IN",
          supervisorName: emp.modifiedName?.trim() || null,
          supervisor: emp.modifiedName?.trim() || null,
          createdBy: isNew
            ? userName || "admin"
            : existingSaved?.createdBy || emp.createdBy?.trim() || "admin",
          createDate:
            emp.createDate?.trim() ||
            (isNew ? todayIso : existingSaved?.createDate || todayIso),
          modifiedBy: userName || "admin",
          modifiedDate: todayIso,
        };

        const url = isNew
          ? `${backendUrl}/api/EmployeeMaster`
          : `${backendUrl}/api/EmployeeMaster/${encodeURIComponent(emp.employeeId.trim())}`;

        const res = await fetch(url, {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.message ||
              err.error ||
              `Failed to ${isNew ? "create" : "update"} employee ${emp.employeeId}`,
          );
        }
      }

      const justSavedIds = employeesToSave
        .map((emp) => emp.employeeId.trim().toLowerCase())
        .filter(Boolean);

      const updatedRecent = [
        ...justSavedIds,
        ...recentSavedIds.filter((id) => !justSavedIds.includes(id)),
      ].slice(0, 100);

      setRecentSavedIds(updatedRecent);
      try {
        localStorage.setItem(
          "employee_master_recent_ids",
          JSON.stringify(updatedRecent),
        );
      } catch {}

      alert("Employees saved successfully.");
      await fetchEmployees(); // reloads schedule IDs straight from the DB
      setCurrentPage(1);
    } catch (error) {
      console.error("Error saving employees:", error);
      alert(error.message || "Unable to save employees. Please try again.");
    } finally {
      setUserFormLoading(false);
    }
  };

  /* ---------- copy / paste ---------- */
  const handleCopy = () => {
    const selectedEmployees = employees.filter((employee) =>
      selectedIds.includes(employee._rowId),
    );

    if (selectedEmployees.length === 0) {
      alert("Please select an employee to copy.");
      return;
    }

    setCopiedEmployees(
      selectedEmployees.map(({ _rowId, _new, ...employee }) => ({ ...employee })),
    );
  };

  const handlePaste = () => {
    if (copiedEmployees.length === 0) {
      alert("Please select an employee and click Copy first.");
      return;
    }

    const existingEmployeeIds = new Set(
      employees
        .map((employee) => String(employee.employeeId || "").trim().toLowerCase())
        .filter(Boolean),
    );

    const pastedEmployees = copiedEmployees.map((employee) => {
      const baseId = String(employee.employeeId || "").trim();
      let newEmployeeId = baseId;
      let suffix = 1;

      while (newEmployeeId && existingEmployeeIds.has(newEmployeeId.toLowerCase())) {
        newEmployeeId = `${baseId}-COPY${suffix++}`;
      }
      if (newEmployeeId) existingEmployeeIds.add(newEmployeeId.toLowerCase());

      return {
        ...employee,
        _rowId: `employee-paste-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        employeeId: newEmployeeId,
        _new: true,
      };
    });

    setEmployees((previous) => [...pastedEmployees, ...previous]);
    setSelectedIds(pastedEmployees.map((employee) => employee._rowId));
    setEditingId(pastedEmployees[0]?._rowId ?? null);
    setCurrentPage(1);
    setSearchQuery("");
    setSelectedStatus("All");
  };

  /* ---------- export / import ---------- */
  const handleExport = () => {
    const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const headers = columns.map((column) => escapeCSV(column.label));
    const rows = filteredEmployees.map((employee) =>
      columns
        .map((column) => escapeCSV(getCellValue(employee, column.key)))
        .join(","),
    );
    const blob = new Blob(["\uFEFF" + [headers.join(","), ...rows].join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "employee-master.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const lines = String(loadEvent.target?.result || "")
        .replace(/^\uFEFF/, "")
        .split(/\r?\n/)
        .filter((line) => line.trim());

      if (lines.length < 2) {
        alert("The CSV file has no employee rows.");
        event.target.value = "";
        return;
      }

      const parseCSVLine = (line) => {
        const values = [];
        let value = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"' && line[i + 1] === '"' && inQuotes) {
            value += '"';
            i++;
          } else if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            values.push(value);
            value = "";
          } else {
            value += char;
          }
        }
        values.push(value);
        return values;
      };

      const normalize = (value) =>
        value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      const headers = parseCSVLine(lines[0]).map(normalize);
      const existingIds = new Set(
        employees
          .map((employee) => String(employee.employeeId || "").trim().toLowerCase())
          .filter(Boolean),
      );
      const imported = [];

      const COLUMN_ALIASES = {
        employeeId: ["employeeid", "emplid", "empid", "id"],
        displayedName: ["displayedname", "displayname", "name", "fullname", "employeename"],
        firstName: ["firstname", "fname", "first"],
        lastName: ["lastname", "lname", "last"],
        tsSchedule: ["timesheetschedule", "tsschedule", "schedule", "timesheettype"],
        status: ["status", "employeestatus", "emplstatus", "isactive", "state"],
        createDate: ["createdate", "createddate", "creationdate", "datecreated", "createdon", "createdat"],
        createdBy: ["createdby", "creator", "createduser"],
        modifiedDate: ["modifieddate", "modifydate", "updateddate", "updatedat", "modifiedon"],
        modifiedBy: ["modifiedby", "modifier", "updatedby"],
        modifiedName: ["modifiedname", "supervisorname", "supervisor"],
      };

      lines.slice(1).forEach((line, index) => {
        const values = parseCSVLine(line);
        const employee = {};
        columns.forEach((column) => {
          const labelNorm = normalize(column.label);
          const keyNorm = normalize(column.key);
          const aliases = COLUMN_ALIASES[column.key] || [labelNorm, keyNorm];

          let headerIndex = headers.indexOf(labelNorm);
          if (headerIndex === -1) headerIndex = headers.indexOf(keyNorm);
          if (headerIndex === -1) {
            headerIndex = headers.findIndex((h) => aliases.includes(h));
          }

          let val = headerIndex >= 0 ? (values[headerIndex] || "").trim() : "";
          if (column.key === "createDate" || column.key === "modifiedDate") {
            val = formatDateForInput(val);
          }
          if (column.key === "tsSchedule") {
            val = resolveScheduleId(val); // name or id -> id
          }
          employee[column.key] = val;
        });

        const employeeId = String(employee.employeeId || "").trim();
        if (!columns.some((column) => String(employee[column.key] || "").trim())) return;
        if (employeeId && existingIds.has(employeeId.toLowerCase())) return;
        if (employeeId) existingIds.add(employeeId.toLowerCase());
        imported.push({
          ...employee,
          status: parseEmployeeStatus(employee),
          _rowId: `employee-import-${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
          _new: true,
        });
      });

      if (imported.length === 0) {
        alert(
          "No new employee rows were imported. Existing Employee IDs may have been skipped.",
        );
      } else {
        setEmployees((previous) => [...imported, ...previous]);
        setSelectedIds(imported.map((employee) => employee._rowId));
        setEditingId(imported[0]._rowId);
        setCurrentPage(1);
        setSearchQuery("");
        setSelectedStatus("All");
        alert(`${imported.length} employee(s) imported.`);
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  };

  /* ---------- salary info ---------- */
  const handleSalaryInfo = async () => {
    const selectedEmployees = employees.filter((employee) =>
      selectedIds.includes(employee._rowId),
    );

    if (selectedEmployees.length === 0) {
      alert("Please select an employee to view salary info.");
      return;
    }
    setSalaryInfoLoading(true);
    setSalaryInfoEmployee(selectedEmployees[0]);
    setSalaryInfoModalOpen(true);

    const targetEmpId = selectedEmployees[0].employeeId;

    try {
      const response = await fetch(
        `${backendUrl}/api/EmployeeMaster/SalaryInfo/${encodeURIComponent(targetEmpId)}`,
        { method: "GET", headers: { "Content-Type": "application/json" } },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const formattedData = Array.isArray(data)
        ? data.map((item) => ({
            emplId: item.emplId || targetEmpId,
            effectDt: item.effectDt ? item.effectDt.split("T")[0] : "",
            sHrlySalCd: item.sHrlySalCd || "",
            hrlyAmt: item.hrlyAmt ?? 0,
            salAmt: item.salAmt ?? 0,
            annlAmt: item.annlAmt ?? 0,
            sEmplTypeCd: item.sEmplTypeCd || "",
            orgId: item.orgId || "",
            titleDesc: item.titleDesc || "",
            workStateCd: item.workStateCd || "",
            stdEstHrs: item.stdEstHrs ?? 0,
            pctIncrRt: item.pctIncrRt ?? 0,
            reasonDesc: item.reasonDesc || "",
            labLocCd: item.labLocCd || "",
            salGradeCd: item.salGradeCd || "",
            mgrEmplId1: item.mgrEmplId1 || "",
            endDt: item.endDt ? item.endDt.split("T")[0] : "",
            emplClassCd: item.emplClassCd || "",
            reasonDesc2: item.reasonDesc2 || "",
            reasonDesc3: item.reasonDesc3 || "",
          }))
        : [];

      setSalaryInfo(formattedData);
      setOriginalSalaryInfo(JSON.parse(JSON.stringify(formattedData)));
    } catch (error) {
      console.error(`Error fetching salary info: ${error.message}`);
      setSalaryInfo([]);
      setOriginalSalaryInfo([]);
    } finally {
      setSalaryInfoLoading(false);
    }
  };

  const updateSalaryField = (index, key, value) => {
    setSalaryInfo((previous) =>
      previous.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)),
    );
  };

  const handleSaveSalary = async () => {
    try {
      // effectDt is part of the record key (emplId + effectDt) so it is not compared/edited
      const fieldsToCompare = [
        "titleDesc", "sHrlySalCd", "hrlyAmt", "salAmt", "annlAmt", "sEmplTypeCd",
        "orgId", "workStateCd", "reasonDesc", "stdEstHrs", "pctIncrRt", "labLocCd",
        "salGradeCd", "mgrEmplId1", "endDt", "emplClassCd", "reasonDesc2", "reasonDesc3",
      ];

      const normalize = (value) => (value == null ? "" : String(value).trim());

      const updatedRows = salaryInfo.filter((row, index) => {
        const original = originalSalaryInfo[index];
        if (!original) return false;
        return fieldsToCompare.some(
          (field) => normalize(row[field]) !== normalize(original[field]),
        );
      });

      if (updatedRows.length === 0) {
        toast.info("No changes to save.");
        return;
      }

      setSavingSalary(true);

      const toNumber = (v) => (v === "" || v == null ? null : Number(v));

      const payload = updatedRows.map((row) => ({
        ...row,
        hrlyAmt: toNumber(row.hrlyAmt),
        salAmt: toNumber(row.salAmt),
        annlAmt: toNumber(row.annlAmt),
        stdEstHrs: toNumber(row.stdEstHrs),
        pctIncrRt: toNumber(row.pctIncrRt),
        effectDt: row.effectDt || null,
        endDt: row.endDt || null, // "" would fail DateTime? binding
      }));

      await axios.put(`${backendUrl}/api/EmployeeMaster/SalaryDetail/update`, payload);

      setOriginalSalaryInfo(JSON.parse(JSON.stringify(salaryInfo)));
      toast.success(`${updatedRows.length} updated row(s) saved successfully.`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save salary information.",
      );
    } finally {
      setSavingSalary(false);
    }
  };

  /* ---------- selection ---------- */
  const toggleSelected = (id, checked) =>
    setSelectedIds((previous) =>
      checked ? [...new Set([...previous, id])] : previous.filter((item) => item !== id),
    );
  const toggleAllVisible = (checked) =>
    setSelectedIds((previous) =>
      checked
        ? [...new Set([...previous, ...visibleIds])]
        : previous.filter((id) => !visibleIds.includes(id)),
    );

  /* ---------- schedule dropdown options for a given employee ---------- */
  const renderScheduleOptions = (employee) => {
    const currentId = String(employee.tsSchedule ?? "");
    // active schedules + the employee's current one even if it is inactive/unknown
    const options = timesheetSchedule.filter(
      (s) => isScheduleActive(s) || getScheduleId(s) === currentId,
    );
    const currentMissing = currentId && !scheduleById.has(currentId);

    return (
      <>
        <option value="">Select Schedule</option>
        {currentMissing && <option value={currentId}>{`Schedule ${currentId}`}</option>}
        {options.map((s) => (
          <option key={getScheduleId(s)} value={getScheduleId(s)}>
            {getScheduleLabel(s)}
            {isScheduleActive(s) ? "" : " (inactive)"}
          </option>
        ))}
      </>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#e7f2f5] px-3 py-2 pb-4 text-xs text-slate-800 sm:px-4">
      <header className="mb-3 flex items-center gap-2.5 rounded-md border border-slate-200 bg-white px-3 py-2.5">
        <svg
          className="h-5 w-5 shrink-0 text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
          <path d="m7.5 12 3 3 6-7" />
        </svg>
        <h1 className="text-lg font-bold leading-tight text-slate-800">
          Employee Master
        </h1>
      </header>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search Employee"
          aria-label="Search employees"
          className="h-8 w-[201px] max-w-full rounded border border-slate-300 bg-white px-3 text-xs outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <select
          value={selectedStatus}
          onChange={(event) => {
            setSelectedStatus(event.target.value);
            setCurrentPage(1);
          }}
          aria-label="Filter by status"
          className="h-8 w-[201px] max-w-full rounded border border-slate-300 bg-white px-3 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <section className="w-full rounded border border-slate-300 bg-white p-2 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-600">
            Total records:{" "}
            <strong className="text-slate-800">{filteredEmployees.length}</strong>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={handleSalaryInfo} className="btn1 btn-blue whitespace-nowrap rounded-full" disabled={userFormLoading}>
              Salary Info
            </button>
            <button type="button" onClick={handleNewUser} className="btn1 btn-blue whitespace-nowrap rounded-full" disabled={userFormLoading}>
              New User
            </button>
            <button type="button" onClick={handleDeleteClick} className="btn1 btn-red whitespace-nowrap rounded-full" disabled={selectedIds.length === 0}>
              Delete
            </button>
            <button type="button" onClick={handleClear} className="btn1 btn-blue whitespace-nowrap rounded-full" disabled={selectedIds.length === 0}>
              Clear
            </button>
            <button type="button" onClick={handleCopy} className="btn1 btn-blue whitespace-nowrap rounded-full" disabled={selectedIds.length === 0}>
              Copy
            </button>
            <button type="button" onClick={handlePaste} className="btn1 btn-blue whitespace-nowrap rounded-full" disabled={copiedEmployees.length === 0}>
              Paste
            </button>
            <label className="btn1 btn-blue whitespace-nowrap rounded-full cursor-pointer">
              Import
              <input type="file" accept=".csv,text/csv" onChange={handleImport} className="hidden" />
            </label>
            <button type="button" onClick={handleExport} className="btn1 btn-blue whitespace-nowrap rounded-full">
              Export
            </button>
            <button type="button" onClick={handleSaveUsers} className="btn1 btn-blue whitespace-nowrap rounded-full" disabled={userFormLoading}>
              {userFormLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="w-full max-h-[calc(100vh-320px)] min-h-[280px] overflow-auto rounded-sm border border-slate-200">
          <table className="w-full min-w-[1120px] border-separate border-spacing-0 text-left text-xs text-slate-800">
            <thead className="sticky top-0 z-10 bg-sky-100">
              <tr>
                <th className="w-9 border-b border-r border-slate-300 bg-sky-100 px-2 py-2 text-center">
                  <input
                    type="checkbox"
                    aria-label="Select all visible employees"
                    checked={allVisibleSelected}
                    onChange={(event) => toggleAllVisible(event.target.checked)}
                    className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="whitespace-nowrap border-b border-r border-slate-300 bg-sky-100 px-2 py-2 font-bold text-slate-800 last:border-r-0"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                      className="inline-flex items-center gap-1 whitespace-nowrap text-left"
                      aria-label={`Sort by ${column.label}`}
                    >
                      {column.label}
                      <span className="text-[10px] text-slate-500">
                        {sortConfig.key === column.key
                          ? sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.length ? (
                paginatedEmployees.map((employee) => {
                  const id = employee._rowId;
                  const isEditing = editingId === id;
                  const isSelected = selectedIds.includes(id);
                  const selectAndEditRow = () => {
                    setSelectedIds((previous) =>
                      previous.includes(id) ? previous : [...previous, id],
                    );
                    setEditingId(id);
                  };
                  return (
                    <tr key={employee._rowId} onClick={selectAndEditRow} className="cursor-pointer bg-white">
                      <td
                        className="border-b border-r border-slate-200 px-2 py-1.5 text-center"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          aria-label={`Select ${employee.employeeId || "new employee row"}`}
                          checked={isSelected}
                          onChange={(event) => toggleSelected(id, event.target.checked)}
                          className="h-3.5 w-3.5 cursor-pointer"
                        />
                      </td>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="border-b border-r border-slate-200 px-2 py-1.5 last:border-r-0"
                          onClick={selectAndEditRow}
                        >
                          {isEditing ? (
                            column.key === "employeeId" && !employee._new ? (
                              <span
                                className="inline-block min-w-[100px] px-1.5 text-slate-500"
                                title="Saved Employee IDs cannot be changed"
                              >
                                {employee.employeeId || "—"}
                              </span>
                            ) : column.key === "status" ? (
                              <select
                                value={employee.status || "Active"}
                                onChange={(event) => updateEmployee(employee, column.key, event.target.value)}
                                onClick={(event) => event.stopPropagation()}
                                className="h-7 min-w-[82px] rounded border border-blue-200 bg-white px-1.5 text-xs outline-none focus:border-blue-500"
                              >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                            ) : column.key === "createDate" ? (
                              <input
                                type="date"
                                value={employee[column.key] || ""}
                                onChange={(event) => updateEmployee(employee, column.key, event.target.value)}
                                onClick={(event) => event.stopPropagation()}
                                className="h-7 min-w-[125px] rounded border border-blue-200 bg-white px-1.5 text-xs outline-none focus:border-blue-500"
                              />
                            ) : column.key === "tsSchedule" ? (
                              <select
                                value={String(employee.tsSchedule ?? "")}
                                onChange={(event) => updateEmployee(employee, "tsSchedule", event.target.value)}
                                onClick={(event) => event.stopPropagation()}
                                aria-label={`Timesheet schedule for ${employee.employeeId || "new employee"}`}
                                className="h-7 min-w-[130px] rounded border border-blue-200 bg-white px-1.5 text-xs outline-none focus:border-blue-500"
                              >
                                {renderScheduleOptions(employee)}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={employee[column.key] || ""}
                                onChange={(event) => updateEmployee(employee, column.key, event.target.value)}
                                onClick={(event) => event.stopPropagation()}
                                className="h-7 min-w-[100px] w-full rounded border border-blue-200 bg-white px-1.5 text-xs outline-none focus:border-blue-500"
                              />
                            )
                          ) : column.key === "status" ? (
                            <span
                              className={`inline-block min-w-[56px] rounded border px-2 py-0.5 text-center text-[11px] ${
                                employee.status === "Active"
                                  ? "border-green-200 bg-green-50 text-green-800"
                                  : "border-slate-200 bg-slate-50 text-slate-600"
                              }`}
                            >
                              {employee.status || "—"}
                            </span>
                          ) : (
                            <span
                              className={
                                column.key === "employeeId" || column.key === "displayedName"
                                  ? "text-blue-900"
                                  : ""
                              }
                            >
                              {getCellValue(employee, column.key) || "—"}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="px-3 py-5 text-center text-slate-500">
                    {loading ? "Loading employees..." : "No employees found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-3 pb-1 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Showing{" "}
              <strong>
                {filteredEmployees.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}–
                {Math.min(safeCurrentPage * pageSize, filteredEmployees.length)}
              </strong>{" "}
              of <strong>{filteredEmployees.length}</strong> records
            </span>
            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-7 rounded border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setCurrentPage(1)} disabled={safeCurrentPage === 1} className="h-7 rounded border border-slate-300 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" title="First Page">
              « First
            </button>
            <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safeCurrentPage === 1} className="h-7 rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
              Previous
            </button>

            <div className="flex items-center gap-1">
              <span>Page</span>
              <select
                value={safeCurrentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="h-7 rounded border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"
              >
                {pageOptions.map((pg) => (
                  <option key={pg} value={pg}>
                    {pg}
                  </option>
                ))}
              </select>
              <span>of {totalPages}</span>
            </div>

            <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={safeCurrentPage === totalPages} className="h-7 rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
              Next
            </button>
            <button type="button" onClick={() => setCurrentPage(totalPages)} disabled={safeCurrentPage === totalPages} className="h-7 rounded border border-slate-300 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" title="Last Page">
              Last »
            </button>
          </div>
        </div>
      </section>

      {salaryInfoModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setSalaryInfoModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-7xl shadow-2xl border border-gray-100 font-inter overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900">
                Salary Information (
                {salaryInfoEmployee?.displayedName || salaryInfoEmployee?.employeeId || ""})
              </h3>

              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={handleSaveSalary}
                  disabled={savingSalary}
                  className="btn1 btn-blue !py-1 !px-3 text-xs cursor-pointer"
                >
                  {savingSalary ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setSalaryInfoModalOpen(false)}
                  className="btn1 btn-blue !py-1 !px-3 text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="overflow-auto max-h-[60vh] border border-gray-300 rounded-lg">
              {salaryInfoLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-xs font-medium text-gray-600">
                    Loading salary info...
                  </span>
                </div>
              ) : (
                <table className="w-full text-xs border-collapse whitespace-nowrap">
                  <thead className="sticky top-0 bg-[#e5f3fb] z-10">
                    <tr>
                      {[
                        "Effective Date",
                        "Title",
                        "Hourly / Sal. Code",
                        "Hourly Amt",
                        "Salary Amt",
                        "Annual Amt",
                        "Empl Type",
                        "Org ID",
                        "Work State",
                        "Reason",
                      ].map((label) => (
                        <th
                          key={label}
                          className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salaryInfo.length > 0 ? (
                      salaryInfo.map((item, idx) => (
                        <tr
                          key={`${item.emplId}-${item.effectDt}-${idx}`}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                        >
                          {/* Effective date is part of the record key – read only */}
                          <td className="px-2 py-1.5 text-center border-r border-b border-gray-300 text-slate-600">
                            {item.effectDt || "—"}
                          </td>

                          <td className="px-2 py-1.5 text-left border-r border-b border-gray-300">
                            <input type="text" value={item.titleDesc || ""} onChange={(e) => updateSalaryField(idx, "titleDesc", e.target.value)} className="h-7 w-full rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500" />
                          </td>

                          <td className="px-2 py-1.5 text-center border-r border-b border-gray-300">
                            <input type="text" value={item.sHrlySalCd || ""} onChange={(e) => updateSalaryField(idx, "sHrlySalCd", e.target.value)} className="h-7 w-12 text-center rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500" />
                          </td>

                          <td className="px-2 py-1.5 text-right border-r border-b border-gray-300">
                            <input type="number" step="0.01" value={item.hrlyAmt ?? ""} onChange={(e) => updateSalaryField(idx, "hrlyAmt", e.target.value)} className="h-7 w-20 text-right rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500" />
                          </td>

                          <td className="px-2 py-1.5 text-right border-r border-b border-gray-300">
                            <input type="number" step="0.01" value={item.salAmt ?? ""} onChange={(e) => updateSalaryField(idx, "salAmt", e.target.value)} className="h-7 w-24 text-right rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500" />
                          </td>

                          <td className="px-2 py-1.5 text-right border-r border-b border-gray-300">
                            <input type="number" step="0.01" value={item.annlAmt ?? ""} onChange={(e) => updateSalaryField(idx, "annlAmt", e.target.value)} className="h-7 w-28 text-right rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500 font-bold text-green-700" />
                          </td>

                          <td className="px-2 py-1.5 text-center border-r border-b border-gray-300">
                            <input type="text" value={item.sEmplTypeCd || ""} onChange={(e) => updateSalaryField(idx, "sEmplTypeCd", e.target.value)} className="h-7 w-12 text-center rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500" />
                          </td>

                          <td className="px-2 py-1.5 text-center border-r border-b border-gray-300">
                            <input type="text" value={item.orgId || ""} onChange={(e) => updateSalaryField(idx, "orgId", e.target.value)} className="h-7 w-20 text-center rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500" />
                          </td>

                          <td className="px-2 py-1.5 text-center border-r border-b border-gray-300">
                            <input type="text" value={item.workStateCd || ""} onChange={(e) => updateSalaryField(idx, "workStateCd", e.target.value)} className="h-7 w-12 text-center rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500" />
                          </td>

                          <td className="px-2 py-1.5 text-left border-r border-b border-gray-300">
                            <input type="text" value={item.reasonDesc || ""} onChange={(e) => updateSalaryField(idx, "reasonDesc", e.target.value)} className="h-7 w-full rounded border border-slate-300 bg-white px-1 text-xs outline-none focus:border-blue-500" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="text-center p-8 italic text-gray-500">
                          No salary records found for this employee.
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
    </div>
  );
}