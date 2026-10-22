import React, { useEffect, useMemo, useState } from "react";
import { backendUrl } from "./config";

const initialEmployees = [
    {
        employeeId: "EMP-001",
        displayedName: "Aarav Sharma",
        lastName: "Sharma",
        firstName: "Aarav",
        status: "Active",
        createDate: "2026-10-01",
        modifiedName: "Aarav Sharma",
        createdBy: "admin",
        modifiedBy: "admin",
    },
    {
        employeeId: "EMP-002",
        displayedName: "Priya Patel",
        lastName: "Patel",
        firstName: "Priya",
        status: "Active",
        createDate: "2026-10-03",
        modifiedName: "Priya Patel",
        createdBy: "admin",
        modifiedBy: "admin",
    },
    {
        employeeId: "EMP-003",
        displayedName: "Rohan Mehta",
        lastName: "Mehta",
        firstName: "Rohan",
        status: "Inactive",
        createDate: "2026-10-05",
        modifiedName: "Rohan Mehta",
        createdBy: "admin",
        modifiedBy: "admin",
    },
].map((employee, index) => ({ ...employee, _rowId: `employee-${index + 1}` }));


const EMPLOYEE_STORAGE_KEY = "employeeMasterData";

const loadEmployees = () => {
    try {
        const storedEmployees = localStorage.getItem(EMPLOYEE_STORAGE_KEY);

        if (storedEmployees !== null) {
            const parsedEmployees = JSON.parse(storedEmployees);

            if (Array.isArray(parsedEmployees)) {
                return parsedEmployees;
            }
        }
    } catch (error) {
        console.error("Failed to load employees:", error);
    }

    return initialEmployees.map((employee) => ({ ...employee }));
};


const columns = [
    { key: "employeeId", label: "Employee ID" },
    { key: "displayedName", label: "Displayed Name" },
    { key: "lastName", label: "Last Name" },
    { key: "firstName", label: "First Name" },
    { key: "status", label: "Status" },
    { key: "createDate", label: "Create Date" },
    { key: "modifiedName", label: "Modified Name" },
    { key: "createdBy", label: "Created By" },
    { key: "modifiedBy", label: "Modified By" },
];

const makeBlankEmployee = () => ({
    _rowId: `employee-new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    employeeId: "",
    displayedName: "",
    lastName: "",
    firstName: "",
    status: "Active",
    createDate: "",
    modifiedName: "",
    createdBy: "",
    modifiedBy: "",
    _new: true,
});

export default function EmployeeMaster() {
    const [employees, setEmployees] = useState([]);
    const [savedEmployees, setSavedEmployees] = useState([]);
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

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api/EmployeeMaster`);
            if (!response.ok) {
                throw new Error(`Failed to fetch employees (${response.status})`);
            }
            const data = await response.json();
            const loaded = (Array.isArray(data) ? data : []).map((item, index) => {
                const statusRaw = String(item.status || "ACT").trim().toUpperCase();
                const isInactive = statusRaw === "INA" || statusRaw === "INACTIVE" || statusRaw === "TER";
                return {
                    _rowId: `employee-${item.employeeId || index + 1}`,
                    employeeId: item.employeeId || "",
                    displayedName: item.displayedName || "",
                    lastName: item.lastName || "",
                    firstName: item.firstName || "",
                    status: isInactive ? "Inactive" : "Active",
                    createDate: item.createdDate ? String(item.createdDate).split("T")[0] : "",
                    modifiedName: item.supervisorName || item.supervisor || item.modifiedName || "",
                    createdBy: item.createdBy || "",
                    modifiedBy: item.modifiedBy || "",
                    _new: false,
                };
            });
            setEmployees(loaded);
            setSavedEmployees(loaded.map((e) => ({ ...e })));
            setSelectedIds([]);
            setEditingId(null);
        } catch (err) {
            console.error("Error loading employees from API:", err);
            const fallback = loadEmployees();
            setEmployees(fallback);
            setSavedEmployees(fallback.map((e) => ({ ...e })));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const filteredEmployees = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const filtered = employees.filter((employee) => {
            const matchesSearch =
                !query ||
                columns.some((column) =>
                    String(employee[column.key] ?? "")
                        .toLowerCase()
                        .includes(query),
                );
            const matchesStatus =
                selectedStatus === "All" || employee.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
        return [...filtered].sort((a, b) => {
            // Keep a newly added blank row at the top until it is saved.
            if (a._new && !b._new) return -1;
            if (!a._new && b._new) return 1;

            // Keep recently saved employees at the top (most recent first)
            const aId = String(a.employeeId || "").trim().toLowerCase();
            const bId = String(b.employeeId || "").trim().toLowerCase();
            const aRecentIdx = aId ? recentSavedIds.indexOf(aId) : -1;
            const bRecentIdx = bId ? recentSavedIds.indexOf(bId) : -1;

            if (aRecentIdx !== -1 && bRecentIdx !== -1) {
                return aRecentIdx - bRecentIdx;
            }
            if (aRecentIdx !== -1) return -1;
            if (bRecentIdx !== -1) return 1;

            const result = String(a[sortConfig.key] ?? "")
                .toLowerCase()
                .localeCompare(
                    String(b[sortConfig.key] ?? "").toLowerCase(),
                    undefined,
                    { numeric: true },
                );
            return sortConfig.direction === "asc" ? result : -result;
        });
    }, [employees, searchQuery, selectedStatus, sortConfig, recentSavedIds]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredEmployees.length / pageSize), 
    );
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

    const pageOptions = useMemo(() => {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }, [totalPages]);

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


    const handleDeleteClick = async () => {
        if (!selectedIds.length) return;

        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} employee(s)?`)) {
            return;
        }

        setUserFormLoading(true);
        try {
            const toDelete = employees.filter((employee) =>
                selectedIds.includes(employee._rowId)
            );

            for (const emp of toDelete) {
                const isSaved = savedEmployees.some((s) => s.employeeId === emp.employeeId && !emp._new);
                if (isSaved && emp.employeeId) {
                    const res = await fetch(`${backendUrl}/api/EmployeeMaster/${encodeURIComponent(emp.employeeId.trim())}`, {
                        method: "DELETE",
                    });
                    if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        throw new Error(err.message || err.error || `Failed to delete ${emp.employeeId}`);
                    }
                }
            }

            const deletedIds = toDelete
                .map((emp) => emp.employeeId.trim().toLowerCase())
                .filter(Boolean);

            setRecentSavedIds((previous) => {
                const next = previous.filter((id) => !deletedIds.includes(String(id).toLowerCase()));
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


    const handleSaveUsers = async () => {
        setUserFormLoading(true);

        try {
            const employeesToSave = selectedIds.length > 0
                ? employees.filter((employee) => selectedIds.includes(employee._rowId))
                : employees.filter((employee) => {
                    if (employee._new) return true;
                    const orig = savedEmployees.find((s) => s.employeeId === employee.employeeId);
                    if (!orig) return false;
                    return columns.some((col) => (employee[col.key] || "") !== (orig[col.key] || ""));
                });

            if (employeesToSave.length === 0) {
                alert("Please select at least one employee to save.");
                setUserFormLoading(false);
                return;
            }

            // 1. Validate that every employee has an Employee ID.
            const missingEmployeeId = employeesToSave.find(
                (employee) => !String(employee.employeeId || "").trim()
            );

            if (missingEmployeeId) {
                alert(
                    "Please enter an Employee ID for every employee before saving."
                );
                setEditingId(missingEmployeeId._rowId);
                setSelectedIds([missingEmployeeId._rowId]);
                setUserFormLoading(false);
                return;
            }

            // 2. Validate that Employee IDs are unique.
            const ids = employees
                .map((employee) =>
                    String(employee.employeeId || "").trim().toLowerCase()
                )
                .filter(Boolean);

            if (new Set(ids).size !== ids.length) {
                alert("Employee IDs must be unique.");
                setUserFormLoading(false);
                return;
            }

            // 3. Save each employee via API
            for (const emp of employeesToSave) {
                const payload = {
                    employeeId: emp.employeeId.trim(),
                    displayedName: emp.displayedName?.trim() || null,
                    firstName: emp.firstName?.trim() || null,
                    lastName: emp.lastName?.trim() || null,
                    status: emp.status === "Active" ? "ACT" : "INA",
                    supervisorName: emp.modifiedName?.trim() || null,
                    supervisor: emp.modifiedName?.trim() || null,
                    createdBy: emp.createdBy?.trim() || "admin",
                    modifiedBy: emp.modifiedBy?.trim() || "admin",
                };

                const isNew = emp._new || !savedEmployees.some((s) => s.employeeId.toLowerCase() === emp.employeeId.trim().toLowerCase());

                if (isNew) {
                    const res = await fetch(`${backendUrl}/api/EmployeeMaster`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });
                    if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        throw new Error(err.message || err.error || `Failed to create employee ${emp.employeeId}`);
                    }
                } else {
                    const res = await fetch(`${backendUrl}/api/EmployeeMaster/${encodeURIComponent(emp.employeeId.trim())}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });
                    if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        throw new Error(err.message || err.error || `Failed to update employee ${emp.employeeId}`);
                    }
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
                localStorage.setItem("employee_master_recent_ids", JSON.stringify(updatedRecent));
            } catch {}

            alert("Employees saved successfully.");
            await fetchEmployees();
            setCurrentPage(1);
        } catch (error) {
            console.error("Error saving employees:", error);
            alert(error.message || "Unable to save employees. Please try again.");
        } finally {
            setUserFormLoading(false);
        }
    };


    const handleCopy = () => {
        const selectedEmployees = employees.filter((employee) =>
            selectedIds.includes(employee._rowId),
        );

        if (selectedEmployees.length === 0) {
            alert("Please select an employee to copy.");
            return;
        }

        setCopiedEmployees(
            selectedEmployees.map(({ _rowId, _new, ...employee }) => ({
                ...employee,
            })),
        );
    };

    const handlePaste = () => {
        if (copiedEmployees.length === 0) {
            alert("Please select an employee and click Copy first.");
            return;
        }

        const existingEmployeeIds = new Set(
            employees
                .map((employee) =>
                    String(employee.employeeId || "")
                        .trim()
                        .toLowerCase(),
                )
                .filter(Boolean),
        );

        const pastedEmployees = copiedEmployees.map((employee) => {
            const baseId = String(employee.employeeId || "").trim();
            let newEmployeeId = baseId;
            let suffix = 1;

            while (
                newEmployeeId &&
                existingEmployeeIds.has(newEmployeeId.toLowerCase())
            ) {
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

    const handleExport = () => {
        const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
        const headers = columns.map((column) => escapeCSV(column.label));
        const rows = filteredEmployees.map((employee) =>
            columns.map((column) => escapeCSV(employee[column.key])).join(","),
        );
        const blob = new Blob(
            ["\uFEFF" + [headers.join(","), ...rows].join("\r\n")],
            {
                type: "text/csv;charset=utf-8;",
            },
        );
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
                value
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");
            const headers = parseCSVLine(lines[0]).map(normalize);
            const existingIds = new Set(
                employees
                    .map((employee) =>
                        String(employee.employeeId || "")
                            .trim()
                            .toLowerCase(),
                    )
                    .filter(Boolean),
            );
            const imported = [];

            lines.slice(1).forEach((line, index) => {
                const values = parseCSVLine(line);
                const employee = {};
                columns.forEach((column) => {
                    const headerIndex = headers.indexOf(normalize(column.label));
                    employee[column.key] =
                        headerIndex >= 0 ? values[headerIndex] || "" : "";
                });
                const employeeId = String(employee.employeeId || "").trim();
                if (
                    !columns.some((column) => String(employee[column.key] || "").trim())
                )
                    return;
                if (employeeId && existingIds.has(employeeId.toLowerCase())) return;
                if (employeeId) existingIds.add(employeeId.toLowerCase());
                imported.push({
                    ...employee,
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

    const toggleSelected = (id, checked) =>
        setSelectedIds((previous) =>
            checked
                ? [...new Set([...previous, id])]
                : previous.filter((item) => item !== id),
        );
    const toggleAllVisible = (checked) =>
        setSelectedIds((previous) =>
            checked
                ? [...new Set([...previous, ...visibleIds])]
                : previous.filter((id) => !visibleIds.includes(id)),
        );

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
                {/* <button type="button" onClick={resetFilters} className="h-8 rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 hover:bg-slate-50">Reset Filters</button> */}
            </div>

            <section className="w-full rounded border border-slate-300 bg-white p-2 shadow-sm">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-slate-600">
                        Total records:{" "}
                        <strong className="text-slate-800">
                            {filteredEmployees.length}
                        </strong>
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={handleNewUser}
                            className="btn1 btn-blue whitespace-nowrap rounded-full"
                            disabled={userFormLoading}
                        >
                            New User
                        </button>

                        <button
                            type="button"
                            onClick={handleDeleteClick}
                            className="btn1 btn-red whitespace-nowrap rounded-full"
                            disabled={selectedIds.length === 0}
                        >
                            Delete
                        </button>

                        <button
                            type="button"
                            onClick={handleClear}
                            className="btn1 btn-blue whitespace-nowrap rounded-full"
                            disabled={selectedIds.length === 0}
                        >
                            Clear
                        </button>

                        <button
                            type="button"
                            onClick={handleCopy}
                            className="btn1 btn-blue whitespace-nowrap rounded-full"
                            disabled={selectedIds.length === 0}
                        >
                            Copy
                        </button>

                        <button
                            type="button"
                            onClick={handlePaste}
                            className="btn1 btn-blue whitespace-nowrap rounded-full"
                            disabled={copiedEmployees.length === 0}
                        >
                            Paste
                        </button>

                        <label className="btn1 btn-blue whitespace-nowrap rounded-full cursor-pointer">
                            Import
                            <input
                                type="file"
                                accept=".csv,text/csv"
                                onChange={handleImport}
                                className="hidden"
                            />
                        </label>

                        <button
                            type="button"
                            onClick={handleExport}
                            className="btn1 btn-blue whitespace-nowrap rounded-full"
                        >
                            Export
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveUsers}
                            className="btn1 btn-blue whitespace-nowrap rounded-full"
                            disabled={userFormLoading}
                        >
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
                                paginatedEmployees.map((employee, index) => {
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
                                        <tr
                                            key={employee._rowId}
                                            onClick={selectAndEditRow}
                                            className="cursor-pointer bg-white"
                                        >
                                            {" "}
                                            <td
                                                className="border-b border-r border-slate-200 px-2 py-1.5 text-center"
                                                onClick={(event) => event.stopPropagation()}
                                            >
                                                <input
                                                    type="checkbox"
                                                    aria-label={`Select ${employee.employeeId || "new employee row"}`}
                                                    checked={isSelected}
                                                    onChange={(event) =>
                                                        toggleSelected(id, event.target.checked)
                                                    }
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
                                                                onChange={(event) =>
                                                                    updateEmployee(
                                                                        employee,
                                                                        column.key,
                                                                        event.target.value,
                                                                    )
                                                                }
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
                                                                onChange={(event) =>
                                                                    updateEmployee(
                                                                        employee,
                                                                        column.key,
                                                                        event.target.value,
                                                                    )
                                                                }
                                                                onClick={(event) => event.stopPropagation()}
                                                                className="h-7 min-w-[125px] rounded border border-blue-200 bg-white px-1.5 text-xs outline-none focus:border-blue-500"
                                                            />
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={employee[column.key] || ""}
                                                                onChange={(event) =>
                                                                    updateEmployee(
                                                                        employee,
                                                                        column.key,
                                                                        event.target.value,
                                                                    )
                                                                }
                                                                onClick={(event) => event.stopPropagation()}
                                                                className="h-7 min-w-[100px] w-full rounded border border-blue-200 bg-white px-1.5 text-xs outline-none focus:border-blue-500"
                                                            />
                                                        )
                                                    ) : column.key === "status" ? (
                                                        <span
                                                            className={`inline-block min-w-[56px] rounded border px-2 py-0.5 text-center text-[11px] ${employee.status === "Active" ? "border-green-200 bg-green-50 text-green-800" : "border-slate-200 bg-slate-50 text-slate-600"}`}
                                                        >
                                                            {employee.status || "—"}
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className={
                                                                column.key === "employeeId" ||
                                                                    column.key === "displayedName"
                                                                    ? "text-blue-900"
                                                                    : ""
                                                            }
                                                        >
                                                            {employee[column.key] || "—"}
                                                        </span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length + 1}
                                        className="px-3 py-5 text-center text-slate-500"
                                    >
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
                                {filteredEmployees.length === 0
                                    ? 0
                                    : (safeCurrentPage - 1) * pageSize + 1}
                                –{Math.min(safeCurrentPage * pageSize, filteredEmployees.length)}
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
                        <button
                            type="button"
                            onClick={() => setCurrentPage(1)}
                            disabled={safeCurrentPage === 1}
                            className="h-7 rounded border border-slate-300 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            title="First Page"
                        >
                            « First
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                            disabled={safeCurrentPage === 1}
                            className="h-7 rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
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

                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((page) => Math.min(totalPages, page + 1))
                            }
                            disabled={safeCurrentPage === totalPages}
                            className="h-7 rounded border border-slate-300 bg-white px-3 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={safeCurrentPage === totalPages}
                            className="h-7 rounded border border-slate-300 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Last Page"
                        >
                            Last »
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
