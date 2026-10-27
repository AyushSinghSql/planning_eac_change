import React, { useState, useEffect, useMemo } from "react";
import { backendUrl } from "./config";

// Base API URL: uses backendUrl from config if available, otherwise falls back to localhost:5033
// const API_BASE_URL = backendUrl || "http://localhost:5033"

// const API_BASE_URL = "http://localhost:5033"

const columns = [
  { key: "project_id", label: "Project ID" },
  { key: "project_name", label: "Project Name" },
  { key: "project_type", label: "Project Type" },
  { key: "owning_org_id", label: "Owning Org ID" },
  { key: "project_manager_id", label: "Manager ID" },
  { key: "project_manager_name", label: "Manager Name" },
];

const requiredFields = [
  "project_id",
  "project_name",
  "project_type",
  "owning_org_id",
  "project_manager_id",
];

function ProjectMaster() {
  const [projects, setProjects] = useState([]);
  // Keep a snapshot of the last saved version so Clear can undo unsaved edits.
  const [savedProjects, setSavedProjects] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [nextId, setNextId] = useState(1);
  const [copiedProjects, setCopiedProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [recentSavedIds, setRecentSavedIds] = useState(() => {
    try {
      // Clear any old stored IDs from previous sessions so existing projects don't stick to top
      localStorage.removeItem("project_master_recent_ids");
    } catch {}
    return [];
  });

  // Fetch initial projects from backend
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/ProjectMaster`);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects (${response.status})`);
      }
      const data = await response.json();
      const loaded = (Array.isArray(data) ? data : []).map((item, index) => {
        const managerId = (
          item.projectManagerId ||
          item.project_manager_id ||
          ""
        ).trim();
        const rawManagerName = (
          item.projectManagerName ||
          item.project_manager_name ||
          ""
        ).trim();
        return {
          rowId: index + 1,
          project_id: item.projectId || item.project_id || "",
          project_name: item.projectName || item.project_name || "",
          project_type: item.projectType || item.project_type || "",
          owning_org_id: item.owningOrgId || item.owning_org_id || "",
          project_manager_id: managerId,
          // If Manager ID is not selected/empty, do NOT show any default or legacy name
          project_manager_name: managerId ? rawManagerName : "",
          isNew: false,
          isPasted: false,
        };
      });
      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
      });
      loaded.sort((a, b) => {
        if (!a.project_id) return !b.project_id ? 0 : -1;
        if (!b.project_id) return 1;
        return collator.compare(a.project_id, b.project_id);
      });
      loaded.forEach((item, index) => {
        item.rowId = index + 1;
      });
      setProjects(loaded);
      setSavedProjects(loaded.map((p) => ({ ...p })));
      setNextId(loaded.length + 1);
      setSelectedIds([]);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees for manager dropdown suggestions with deduplication
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/EmployeeMaster`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const seen = new Set();
          const uniqueEmployees = [];
          for (const emp of data) {
            const id = String(
              emp.emplId || emp.employeeId || emp.id || "",
            ).trim();
            if (id && !seen.has(id.toLowerCase())) {
              seen.add(id.toLowerCase());
              uniqueEmployees.push({
                employeeid: id,
                displayedname:
                  emp.firstName || emp.displayedname || emp.name || id,
              });
            }
          }
          setEmployees(uniqueEmployees);
        }
      }
    } catch (err) {
      console.warn("Could not load employees:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const inputStyle =
    "w-full min-w-0 rounded border border-slate-300 bg-white px-2 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100";

  const buttonStyle =
    "rounded-full bg-[#174653] px-4 py-2 text-xs font-semibold text-white hover:bg-[#103743] disabled:cursor-not-allowed disabled:opacity-40";

  // Use known organization IDs as suggestions, while still allowing typed IDs.
  const organizationIds = useMemo(() => {
    const orgSet = new Set();
    for (let i = 0; i < projects.length; i++) {
      const org = projects[i].owning_org_id;
      if (org) orgSet.add(org);
    }
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: "base",
    });
    return Array.from(orgSet).sort((a, b) => collator.compare(a, b));
  }, [projects.length]);

  // Pasted projects appear at the very top. New projects being drafted appear next.
  // Recently saved projects appear immediately after new projects (newest saved first),
  // followed by other existing projects sorted by Project ID.
  const sortedProjects = useMemo(() => {
    const pasted = [];
    const newRows = [];
    const recentRows = [];
    const existing = [];

    const recentMap = new Map();
    recentSavedIds.forEach((id, idx) => {
      if (id) recentMap.set(String(id).trim().toLowerCase(), idx);
    });

    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      const pId = String(p.project_id || "")
        .trim()
        .toLowerCase();

      if (p.isPasted) {
        pasted.push(p);
      } else if (p.isNew) {
        newRows.push(p);
      } else if (pId && recentMap.has(pId)) {
        recentRows.push(p);
      } else {
        existing.push(p);
      }
    }

    // New rows: newest created row stays at top
    newRows.sort((a, b) => (b.rowId || 0) - (a.rowId || 0));

    // Recent saved rows: most recently saved appears first
    recentRows.sort((a, b) => {
      const idxA =
        recentMap.get(
          String(a.project_id || "")
            .trim()
            .toLowerCase(),
        ) ?? 9999;
      const idxB =
        recentMap.get(
          String(b.project_id || "")
            .trim()
            .toLowerCase(),
        ) ?? 9999;
      return idxA - idxB;
    });

    return [...pasted, ...newRows, ...recentRows, ...existing];
  }, [projects, recentSavedIds]);

  const filteredProjects = useMemo(() => {
    const trimmed = search.toLowerCase().trim();
    if (!trimmed) return sortedProjects;
    return sortedProjects.filter(
      (project) =>
        project.isNew ||
        project.isPasted ||
        columns.some((column) =>
          String(project[column.key] || "")
            .toLowerCase()
            .includes(trimmed),
        ),
    );
  }, [sortedProjects, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const pageOptions = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  const paginatedProjects = filteredProjects.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  const allSelected =
    paginatedProjects.length > 0 &&
    paginatedProjects.every((project) => selectedIds.includes(project.rowId));

  const handleSelectAll = (checked) => {
    const visibleIds = paginatedProjects.map((project) => project.rowId);

    setSelectedIds((previous) =>
      checked
        ? [...new Set([...previous, ...visibleIds])]
        : previous.filter((id) => !visibleIds.includes(id)),
    );
  };

  const handleSelectRow = (rowId) => {
    setSelectedIds((previous) =>
      previous.includes(rowId)
        ? previous.filter((id) => id !== rowId)
        : [...previous, rowId],
    );
  };

  const handleCellChange = (rowId, field, value) => {
    // Editing a cell also selects its project, enabling Save and Clear.
    setSelectedIds((previous) =>
      previous.includes(rowId) ? previous : [...previous, rowId],
    );

    setProjects((previous) =>
      previous.map((project) =>
        project.rowId === rowId ? { ...project, [field]: value } : project,
      ),
    );
  };

  const handleManagerChange = (rowId, employeeId) => {
    // Changing the manager also selects its project.
    setSelectedIds((previous) =>
      previous.includes(rowId) ? previous : [...previous, rowId],
    );

    const trimmedId = (employeeId || "").trim();
    const employee = employees.find(
      (item) =>
        String(item.employeeid || "")
          .trim()
          .toLowerCase() === trimmedId.toLowerCase(),
    );

    setProjects((previous) =>
      previous.map((project) =>
        project.rowId === rowId
          ? {
              ...project,
              project_manager_id: employeeId,
              // If manager ID is empty/cleared, clear manager name; otherwise set to matched employee name
              project_manager_name: !trimmedId
                ? ""
                : employee
                  ? employee.displayedname
                  : "",
            }
          : project,
      ),
    );
  };

  // Add a blank row at the top and select it.
  const handleNewProject = () => {
    const newProject = {
      rowId: nextId,
      project_id: "",
      project_name: "",
      project_type: "",
      owning_org_id: "",
      project_manager_id: "",
      project_manager_name: "",
      isNew: true,
    };

    setProjects((previous) => [...previous, newProject]);
    // Keep every newly added project selected, including earlier new rows.
    setSelectedIds((previous) => [...new Set([...previous, nextId])]);
    setNextId((previous) => previous + 1);
    setSearch("");
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one project.");
      return;
    }

    if (!window.confirm("Delete the selected project(s)?")) return;

    try {
      const selectedProjects = projects.filter((project) =>
        selectedIds.includes(project.rowId),
      );

      for (const project of selectedProjects) {
        const isSaved = savedProjects.some(
          (saved) => saved.rowId === project.rowId && !project.isNew,
        );
        if (isSaved && project.project_id) {
          const res = await fetch(
            `${backendUrl}/api/ProjectMaster/${encodeURIComponent(project.project_id)}`,
            {
              method: "DELETE",
            },
          );
          if (!res.ok) {
            const err = await res.text();
            throw new Error(
              `Error deleting ${project.project_id}: ${err || res.statusText}`,
            );
          }
        }
      }

      const deletedIds = selectedProjects
        .map((p) => p.project_id.trim().toLowerCase())
        .filter(Boolean);

      setRecentSavedIds((previous) => {
        const next = previous.filter(
          (id) => !deletedIds.includes(String(id).toLowerCase()),
        );
        try {
          localStorage.setItem(
            "project_master_recent_ids",
            JSON.stringify(next),
          );
        } catch {}
        return next;
      });

      alert("Selected project(s) deleted successfully.");
      await fetchProjects();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete project(s).");
    }
  };

  // Undo unsaved changes for selected rows only.
  // Existing rows return to their last saved values; new unsaved rows are removed.
  const handleClear = () => {
    if (selectedIds.length === 0) return;

    setProjects((currentProjects) =>
      currentProjects.flatMap((project) => {
        if (!selectedIds.includes(project.rowId)) {
          return [project];
        }

        const savedProject = savedProjects.find(
          (saved) => saved.rowId === project.rowId,
        );

        // If this row existed in the last saved snapshot, restore it.
        // Otherwise, it is a new unsaved row, so remove it.
        return savedProject ? [{ ...savedProject }] : [];
      }),
    );

    setSelectedIds([]);
    setCopiedProjects([]);
  };

  // Copy all selected projects into temporary component state.
  const handleCopy = () => {
    const selectedProjects = projects.filter((project) =>
      selectedIds.includes(project.rowId),
    );

    if (selectedProjects.length === 0) {
      alert("Please select a project to copy.");
      return;
    }

    setCopiedProjects(
      selectedProjects.map(({ rowId, ...project }) => ({ ...project })),
    );
  };

  // Paste copies as new rows with new row IDs and unique project IDs.
  const handlePaste = () => {
    if (copiedProjects.length === 0) {
      alert("Please select a project and click Copy first.");
      return;
    }

    let rowNumber = nextId;

    const pastedProjects = copiedProjects.map((project) => ({
      ...project,
      rowId: rowNumber++,
      // A pasted project is a new project, so its Project ID starts blank.
      project_id: "",
      isPasted: true,
      isNew: true,
    }));

    // Add pasted rows to the beginning; isPasted keeps them at the top.
    setProjects((previous) => [...pastedProjects, ...previous]);
    setSelectedIds(pastedProjects.map((project) => project.rowId));
    setNextId(rowNumber);
    setSearch("");
    setCurrentPage(1);
  };

  const handleSave = async () => {
    const projectsToSave =
      selectedIds.length > 0
        ? projects.filter((project) => selectedIds.includes(project.rowId))
        : projects;

    if (projectsToSave.length === 0) {
      alert("Please select at least one project to save.");
      return;
    }

    let missingInfo = null;
    for (const project of projectsToSave) {
      for (const field of requiredFields) {
        if (!String(project[field] || "").trim()) {
          const col = columns.find((c) => c.key === field);
          missingInfo = {
            rowId: project.rowId,
            fieldLabel: col ? col.label : field,
          };
          break;
        }
      }
      if (missingInfo) break;
    }

    if (missingInfo) {
      alert(
        `Please fill in "${missingInfo.fieldLabel}" for project row ${missingInfo.rowId}.`,
      );
      return;
    }

    const ids = projects.map((project) =>
      project.project_id.trim().toLowerCase(),
    );

    if (new Set(ids).size !== ids.length) {
      alert("Project IDs must be unique.");
      return;
    }

    try {
      for (const project of projectsToSave) {
        const isExisting = savedProjects.some(
          (saved) => saved.rowId === project.rowId && !project.isNew,
        );

        const managerId = project.project_manager_id
          ? project.project_manager_id.trim()
          : "";
        const payload = {
          projectId: project.project_id.trim(),
          projectName: project.project_name.trim(),
          projectType: project.project_type.trim(),
          owningOrgId: project.owning_org_id.trim(),
          projectManagerId: managerId,
          projectManagerName:
            managerId && project.project_manager_name
              ? project.project_manager_name.trim()
              : null,
        };

        if (isExisting) {
          const res = await fetch(
            `${backendUrl}/api/ProjectMaster/${encodeURIComponent(payload.projectId)}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            },
          );
          if (!res.ok) {
            const err = await res.text();
            throw new Error(
              `Error updating ${payload.projectId}: ${err || res.statusText}`,
            );
          }
        } else {
          const res = await fetch(`${backendUrl}/api/ProjectMaster`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const err = await res.text();
            throw new Error(
              `Error creating ${payload.projectId}: ${err || res.statusText}`,
            );
          }
        }
      }

      // Only newly created (isNew) or pasted projects should be tracked at the top.
      // Existing projects that were updated stay in their natural alphabetical order.
      const justSavedNewIds = projectsToSave
        .filter((p) => p.isNew || p.isPasted)
        .map((p) => p.project_id.trim())
        .filter(Boolean);

      const hasNewProjects = justSavedNewIds.length > 0;

      if (hasNewProjects) {
        setRecentSavedIds((previous) => [
          ...justSavedNewIds,
          ...previous.filter(
            (id) =>
              !justSavedNewIds.some(
                (s) => s.toLowerCase() === id.toLowerCase(),
              ),
          ),
        ]);
      }

      alert("Project(s) saved successfully!");
      await fetchProjects();

      // Only navigate back to page 1 if a brand new project was added
      if (hasNewProjects) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert(error.message || "Failed to save project(s).");
    }
  };

  const handleExport = () => {
    const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const headers = columns.map((column) => column.label);

    const rows = sortedProjects.map((project) =>
      columns.map((column) => escapeCSV(project[column.key])).join(","),
    );

    const blob = new Blob(
      ["\uFEFF" + [headers.join(","), ...rows].join("\r\n")],
      { type: "text/csv;charset=utf-8;" },
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "project-master.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const lines = String(e.target.result || "")
        .replace(/^\uFEFF/, "")
        .split(/\r?\n/)
        .filter((line) => line.trim());

      if (lines.length < 2) {
        alert("The CSV file has no project rows.");
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

      const headers = parseCSVLine(lines[0]).map((header) =>
        header
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, ""),
      );

      const existingIds = new Set(
        projects
          .map((project) => project.project_id.trim().toLowerCase())
          .filter(Boolean),
      );

      let rowNumber = nextId;
      const imported = [];

      lines.slice(1).forEach((line) => {
        const values = parseCSVLine(line);
        const item = {};

        columns.forEach((column) => {
          const label = column.label.toLowerCase().replace(/[^a-z0-9]/g, "");
          const key = column.key.toLowerCase().replace(/[^a-z0-9]/g, "");

          let index = headers.indexOf(label);
          if (index === -1) {
            index = headers.indexOf(key);
          }
          item[column.key] = index >= 0 ? (values[index] || "").trim() : "";
        });

        if (requiredFields.some((field) => !String(item[field] || "").trim())) {
          return;
        }

        const id = item.project_id.trim().toLowerCase();
        if (existingIds.has(id)) return;

        const employee = employees.find(
          (person) => person.employeeid === item.project_manager_id,
        );

        if (!item.project_manager_name && employee) {
          item.project_manager_name = employee.displayedname;
        }

        imported.push({ ...item, rowId: rowNumber++, isNew: true });
        existingIds.add(id);
      });

      if (imported.length === 0) {
        alert("No new valid projects were imported.");
      } else {
        const importedRowIds = imported.map((item) => item.rowId);
        setProjects((previous) => [...previous, ...imported]);
        setSelectedIds((previous) => [
          ...new Set([...previous, ...importedRowIds]),
        ]);
        setNextId(rowNumber);
        setSearch("");
        setCurrentPage(1);
        alert(`${imported.length} project(s) imported.`);
      }

      event.target.value = "";
    };

    reader.readAsText(file);
  };

  return (
    <div className="w-full min-h-screen bg-[#e6f3f6] pb-4 text-xs text-slate-700 antialiased">
      <div className="mx-auto w-full">
        <div className="mx-4 mt-4 mb-3 flex h-11 items-center gap-3 rounded-md border border-slate-200 bg-white px-4">
          <span
            className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-blue-500 bg-white text-blue-600"
            aria-hidden="true"
          >
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
              <path
                d="M3 8.2 6.4 11 13 4.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 className="text-base font-bold text-slate-800">Project Master</h1>
        </div>

        <div className="mx-4 mb-3 flex flex-wrap items-center justify-between gap-3 bg-transparent px-0 py-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Existing Projects
            </h2>

            <input
              type="search"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-60 rounded border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500"
            />

            <span className="text-xs text-slate-500">
              {filteredProjects.length} projects {loading ? "(loading...)" : ""}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleNewProject}
              className={buttonStyle}
            >
              New Project
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={selectedIds.length === 0}
              className={buttonStyle}
            >
              Copy
            </button>

            <button
              type="button"
              onClick={handlePaste}
              disabled={copiedProjects.length === 0}
              className={buttonStyle}
            >
              Paste
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={selectedIds.length === 0}
              className={`${buttonStyle} bg-red-500 hover:bg-red-600`}
            >
              Delete
            </button>
            <button
              onClick={handleClear}
              disabled={selectedIds.length === 0}
              className="rounded-full bg-[#174653] px-4 py-2 text-xs font-semibold text-white hover:bg-[#103743] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>

            <button
              onClick={handleSave}
              disabled={selectedIds.length === 0}
              className="rounded-full bg-[#174653] px-4 py-2 text-xs font-semibold text-white hover:bg-[#103743] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save
            </button>

            <label className={`${buttonStyle} cursor-pointer`}>
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
              className={buttonStyle}
            >
              Export
            </button>
          </div>
        </div>

        <div className="mx-4 max-h-[calc(100vh-275px)] min-h-[300px] overflow-auto rounded border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[900px] border-collapse ">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-slate-200 bg-sky-50 text-left text-[11px] font-bold text-slate-700">
                <th className="w-10 border-r border-slate-200 px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    aria-label="Select all visible projects"
                  />
                </th>

                {columns.map((column) => (
                  <th key={column.key} className="px-3 py-2">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    {loading
                      ? "Loading projects..."
                      : "No projects found. Click New Project to add one."}
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project) => (
                  <tr
                    key={project.rowId}
                    onClick={() =>
                      setSelectedIds((previous) =>
                        previous.includes(project.rowId)
                          ? previous
                          : [...previous, project.rowId],
                      )
                    }
                    className={`cursor-pointer border-b border-slate-100 ${
                      selectedIds.includes(project.rowId)
                        ? "bg-blue-50"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <td className="border-r border-slate-200 px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(project.rowId)}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => handleSelectRow(project.rowId)}
                        aria-label={`Select ${project.project_id || "new project"}`}
                      />
                    </td>

                    {columns.map((column) => (
                      <td key={column.key} className="px-3 py-1.5">
                        {column.key === "owning_org_id" ? (
                          <input
                            type="text"
                            list="global-org-options"
                            value={project.owning_org_id || ""}
                            onChange={(e) =>
                              handleCellChange(
                                project.rowId,
                                "owning_org_id",
                                e.target.value,
                              )
                            }
                            placeholder="Type or search Org ID"
                            className={inputStyle}
                            autoComplete="off"
                          />
                        ) : column.key === "project_manager_id" ? (
                          <input
                            type="text"
                            list="global-manager-options"
                            value={project.project_manager_id || ""}
                            onChange={(e) =>
                              handleManagerChange(project.rowId, e.target.value)
                            }
                            placeholder="Type or search Manager ID"
                            className={inputStyle}
                            autoComplete="off"
                          />
                        ) : column.key === "project_manager_name" ? (
                          <input
                            type="text"
                            value={
                              project.project_manager_id?.trim()
                                ? project.project_manager_name || ""
                                : ""
                            }
                            onChange={(e) =>
                              handleCellChange(
                                project.rowId,
                                column.key,
                                e.target.value,
                              )
                            }
                            readOnly={!project.project_manager_id?.trim()}
                            placeholder={
                              project.project_manager_id?.trim()
                                ? "Enter Manager Name"
                                : ""
                            }
                            className={`${inputStyle} ${!project.project_manager_id?.trim() ? "bg-slate-50 cursor-not-allowed" : ""}`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={project[column.key] || ""}
                            onChange={(e) =>
                              handleCellChange(
                                project.rowId,
                                column.key,
                                e.target.value,
                              )
                            }
                            readOnly={
                              column.key === "project_id" &&
                              savedProjects.some(
                                (saved) =>
                                  saved.rowId === project.rowId &&
                                  !project.isNew,
                              )
                            }
                            placeholder={`Enter ${column.label}`}
                            className={`${inputStyle} ${
                              column.key === "project_id" &&
                              savedProjects.some(
                                (saved) =>
                                  saved.rowId === project.rowId &&
                                  !project.isNew,
                              )
                                ? "bg-slate-50 cursor-not-allowed"
                                : ""
                            }`}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination Controls */}
        <div className="mx-4 mt-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Showing{" "}
              <strong>
                {filteredProjects.length === 0
                  ? 0
                  : (safeCurrentPage - 1) * pageSize + 1}
                –{Math.min(safeCurrentPage * pageSize, filteredProjects.length)}
              </strong>{" "}
              of <strong>{filteredProjects.length}</strong> records
            </span>
            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-7 rounded border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-indigo-500"
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
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                className="h-7 rounded border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-indigo-500"
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
        {/* Shared global datalists for fast typing & unique keys */}
        <datalist id="global-org-options">
          {organizationIds.map((orgId, idx) => (
            <option key={`org-${orgId}-${idx}`} value={orgId} />
          ))}
        </datalist>
        <datalist id="global-manager-options">
          {employees.map((employee, idx) => (
            <option
              key={`emp-${employee.employeeid}-${idx}`}
              value={employee.employeeid}
            >
              {employee.displayedname}
            </option>
          ))}
        </datalist>
      </div>
    </div>
  );
}

export default ProjectMaster;
