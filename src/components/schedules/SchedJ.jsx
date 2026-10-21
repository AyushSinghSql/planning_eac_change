import React, { useEffect, useState, useCallback } from "react";
import { backendUrl } from "../config";

const BASE_URL = backendUrl;

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const COPY_HEADERS = [
  "SUBCONTRACT NO.",
  "PRIME CONTRACT NO.",
  "PRIME CONTRACT VALUE",
  "SUBCONTRACTOR'S NAME & ADDRESS",
  "SUBCONTRACTOR'S DUNS NUMBER",
  "POINT OF CONTACT AND PHONE NO.",
  "SUBCONTRACT VALUE",
  "PERFORMANCE PERIOD FROM",
  "PERFORMANCE PERIOD TO",
  "SUBCONTRACT INCURRED IN FY 2009",
  "AWARD TYPE",
];

const isHeaderOrTitleLine = (line) => {
  const upper = line.toUpperCase().trim();
  if (!upper) return true;
  if (
    upper.startsWith("SECTION:") ||
    upper.includes("SUBCONTRACT NO") ||
    upper.includes("PRIME CONTRACT NO") ||
    upper.includes("PERFORMANCE PERIOD") ||
    upper.includes("SUBCONTRACT VALUE") ||
    upper.includes("AWARD TYPE") ||
    upper.includes("SUBCONTRACTS ISSUED UNDER") ||
    upper.includes("COST-TYPE SUBCONTRACTS") ||
    upper.includes("T&M/LH SUBCONTRACTS") ||
    upper.includes("INCENTIVE SUBCONTRACTS") ||
    upper.includes("SUBDIVISION") ||
    upper.includes("INTER-DIVISIONAL") ||
    upper.includes("SCHEDULE J")
  ) {
    return true;
  }
  return false;
};

const detectSectionFromText = (text) => {
  if (!text || typeof text !== "string") return null;
  const upper = text.toUpperCase();
  if (upper.includes("COST-TYPE") || upper.includes("COST TYPE"))
    return "costType";
  if (
    upper.includes("T&M") ||
    upper.includes("TIME & MATERIAL") ||
    upper.includes("T&M/LH")
  )
    return "tm";
  if (upper.includes("INCENTIVE")) return "incentive";
  if (upper.includes("IDIQ")) return "idiq";
  if (upper.includes("INTER-DIVISIONAL") || upper.includes("INTERCOMPANY"))
    return "interdivision";
  return null;
};

const normalizeDateForInput = (val) => {
  if (!val || typeof val !== "string") return "";
  const trimmed = val.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(trimmed)) {
    const parts = trimmed.split("/");
    const mm = parts[0].padStart(2, "0");
    const dd = parts[1].padStart(2, "0");
    let yy = parts[2];
    if (yy.length === 2) yy = "20" + yy;
    return `${yy}-${mm}-${dd}`;
  }
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return trimmed;
};

const EMPTY_ROW = ["", "", "", "", "", "", "", "", "", "", ""];

const AWARD_TYPE_OPTIONS = [
  "CPFF",
  "CPAF",
  "T&M",
  "Fixed Price",
  "Grants",
  "IPA",
];

const columns = [
  "SUBCONTRACT NO.",
  "PRIME CONTRACT NO.",
  "PRIME CONTRACT VALUE",
  "SUBCONTRACTOR'S NAME & ADDRESS",
  "SUBCONTRACTOR'S DUNS NUMBER",
  "POINT OF CONTACT AND PHONE NO.",
  "SUBCONTRACT VALUE",
  "Performance Period",
  "Performance Period",
  "SUBCONTRACT INCURRED IN FY 2009",
  "AWARD TYPE",
];

const SECTION_DEFINITIONS = [
  {
    id: "costType",
    title:
      "Cost-type subcontracts issued under flexibly priced prime contracts",
  },
  {
    id: "tm",
    title: "T&M/LH subcontracts issued under flexibly priced prime contracts",
  },
  {
    id: "incentive",
    title: "Incentive subcontracts under flexibly priced prime contracts",
  },
  {
    id: "idiq",
    title: "Subcontract orders based on cost issued under IDIQ prime contracts",
  },
  {
    id: "interdivision",
    title:
      "Inter-divisional/intercompany and FFP effort issued under flexibly priced prime contracts",
  },
];

/* ============================================================
   DATA TABLE
   ============================================================ */

function DataTable({
  rows,
  savedRows = [],
  selectedRows,
  onToggleRow,
  onChangeRow,
}) {
  return (
    <div className="sched-j-table-wrap">
      <table className="sched-j-table">
        <colgroup>
          <col className="c0" />
          <col className="c1" />
          <col className="c2" />
          <col className="c3" />
          <col className="c4" />
          <col className="c5" />
          <col className="c6" />
          <col className="c7" />
          <col className="c8" />
          <col className="c9" />
          <col className="c10" />
          <col className="c11" />
        </colgroup>

        <thead>
          <tr>
            <th rowSpan="2" className="select-head">
              <input
                type="checkbox"
                aria-label="Select all rows"
                checked={rows.length > 0 && selectedRows.length === rows.length}
                onChange={(event) => {
                  if (event.target.checked) {
                    onToggleRow("all");
                  } else {
                    onToggleRow("none");
                  }
                }}
              />
            </th>

            <th rowSpan="2">{columns[0]}</th>

            <th rowSpan="2">{columns[1]}</th>

            <th rowSpan="2">{columns[2]}</th>

            <th rowSpan="2">{columns[3]}</th>

            <th rowSpan="2">{columns[4]}</th>

            <th rowSpan="2">{columns[5]}</th>

            <th rowSpan="2">{columns[6]}</th>

            <th colSpan="2">Performance Period</th>

            <th rowSpan="2">{columns[9]}</th>

            <th rowSpan="2">{columns[10]}</th>
          </tr>

          <tr>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr className="empty-row">
              <td colSpan="12">No data available</td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => {
              const isSavedRow =
                Array.isArray(savedRows) &&
                rowIndex < savedRows.length &&
                savedRows[rowIndex] &&
                savedRows[rowIndex][0] &&
                String(savedRows[rowIndex][0]).trim() !== "" &&
                String(savedRows[rowIndex][0]).trim() === String(row[0]).trim();

              return (
                <tr key={rowIndex}>
                  <td className="select-cell">
                    <input
                      type="checkbox"
                      aria-label={`Select row ${rowIndex + 1}`}
                      checked={selectedRows.includes(rowIndex)}
                      onChange={() => onToggleRow(rowIndex)}
                    />
                  </td>

                  {row.map((value, columnIndex) => (
                    <td
                      key={columnIndex}
                      className={
                        columnIndex === 3 || columnIndex === 5 ? "left" : ""
                      }
                    >
                      {/* PERFORMANCE PERIOD FROM */}
                      {columnIndex === 7 || columnIndex === 8 ? (
                        <input
                          type="date"
                          aria-label={columns[columnIndex]}
                          className="sched-j-input"
                          value={value}
                          onChange={(event) =>
                            onChangeRow(
                              rowIndex,
                              columnIndex,
                              event.target.value,
                            )
                          }
                        />
                      ) : /* AWARD TYPE */
                      columnIndex === 10 ? (
                        <select
                          aria-label={columns[columnIndex]}
                          className="sched-j-input sched-j-select"
                          value={value}
                          onChange={(event) =>
                            onChangeRow(
                              rowIndex,
                              columnIndex,
                              event.target.value,
                            )
                          }
                        >
                          <option value="">Select award type</option>

                          {AWARD_TYPE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : /* SUBCONTRACT NO (PRIMARY KEY - READ ONLY ONCE SAVED) */
                      columnIndex === 0 && isSavedRow ? (
                        <input
                          type="text"
                          aria-label={columns[columnIndex]}
                          className="sched-j-input"
                          value={value}
                          readOnly
                          title="Primary Key (Subcontract No.) is fixed after save. To change it, delete and re-add the row."
                          style={{
                            backgroundColor: "#f3f4f6",
                            color: "#4b5563",
                            cursor: "not-allowed",
                          }}
                        />
                      ) : (
                        /* NORMAL EDITABLE INPUT */
                        <input
                          type="text"
                          aria-label={columns[columnIndex]}
                          className="sched-j-input"
                          value={value}
                          onChange={(event) =>
                            onChangeRow(
                              rowIndex,
                              columnIndex,
                              event.target.value,
                            )
                          }
                        />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   TOAST
   ============================================================ */

function ActionToast({ message, type = "success", onClose }) {
  return (
    <div
      className={`sched-j-toast ${type === "warning" ? "warning" : ""}`}
      role="alert"
    >
      <div className="sched-j-toast-content">
        <span className="sched-j-toast-icon">
          {type === "warning" ? "!" : "✓"}
        </span>

        <span className="sched-j-toast-message">{message}</span>

        <button
          type="button"
          className="sched-j-toast-close"
          aria-label="Close notification"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className="sched-j-toast-progress" />
    </div>
  );
}

/* ============================================================
   SECTION
   ============================================================ */

function Section({
  sectionId,
  title,
  rows,
  savedRows,
  onChangeRows,
  onSave,
  onDelete,
  canPaste = false,
  onCopied,
  onPasteToSection,
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const hasExistingData =
      (Array.isArray(savedRows) &&
        savedRows.some((row) =>
          row.some((cell) => cell && String(cell).trim() !== ""),
        )) ||
      (Array.isArray(rows) &&
        rows.some((row) =>
          row.some((cell) => cell && String(cell).trim() !== ""),
        ));

    if (hasExistingData) {
      setEnabled(true);
    }
  }, [rows, savedRows]);

  const [selectedRows, setSelectedRows] = useState([]);

  const [toast, setToast] = useState(null);

  /* ----------------------------------------------------------
     TOAST TIMER
     ---------------------------------------------------------- */

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(null), 3500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  /* ----------------------------------------------------------
     SELECT ROW
     ---------------------------------------------------------- */

  const handleToggleRow = (rowIndex) => {
    if (rowIndex === "all") {
      setSelectedRows(rows.map((_, index) => index));

      return;
    }

    if (rowIndex === "none") {
      setSelectedRows([]);
      return;
    }

    setSelectedRows((current) =>
      current.includes(rowIndex)
        ? current.filter((index) => index !== rowIndex)
        : [...current, rowIndex],
    );
  };

  /* ----------------------------------------------------------
     CHANGE CELL
     ---------------------------------------------------------- */

  const handleChangeRow = (rowIndex, columnIndex, value) => {
    onChangeRows((currentRows) =>
      currentRows.map((row, index) =>
        index === rowIndex
          ? row.map((cell, cellIndex) =>
              cellIndex === columnIndex ? value : cell,
            )
          : row,
      ),
    );
  };

  /* ----------------------------------------------------------
     TOAST
     ---------------------------------------------------------- */

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  /* ----------------------------------------------------------
     COPY (Includes Column Header Row for Excel)
     ---------------------------------------------------------- */

  const handleCopy = async () => {
    if (selectedRows.length === 0) {
      showToast("Please select at least one row to copy.", "warning");
      return;
    }

    const selectedData = selectedRows.map((idx) => rows[idx]).filter(Boolean);

    if (selectedData.length === 0) return;

    // Column header row at top for Excel compatibility (no section title line)
    const headerLine = COPY_HEADERS.join("\t");
    const dataLines = selectedData.map((row) =>
      row
        .map((cell) =>
          cell !== null && cell !== undefined
            ? String(cell).replace(/\t/g, " ")
            : "",
        )
        .join("\t"),
    );

    const tsvString = [headerLine, ...dataLines].join("\n");

    try {
      await navigator.clipboard.writeText(tsvString);
      if (onCopied) onCopied(sectionId);
      showToast(`${selectedData.length} row(s) copied.`);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = tsvString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      if (onCopied) onCopied(sectionId);
      showToast(`${selectedData.length} row(s) copied.`);
    }
  };

  /* ----------------------------------------------------------
     PASTE (Pastes into this specific section)
     ---------------------------------------------------------- */

  const handlePaste = async (clipboardText = null) => {
    let text = clipboardText;
    if (!text || typeof text !== "string") {
      try {
        text = await navigator.clipboard.readText();
      } catch (err) {
        showToast(
          "Clipboard access unavailable. Please use Ctrl + V to paste.",
          "warning",
        );
        return;
      }
    }

    if (!text || typeof text !== "string" || !text.trim()) {
      showToast("Clipboard is empty.", "warning");
      return;
    }

    if (!enabled) {
      setEnabled(true);
    }

    const rawLines = text.split(/\r\n|\n|\r/);
    const parsedRows = [];

    rawLines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // Skip header / title rows if copied from Excel or table
      if (isHeaderOrTitleLine(trimmedLine)) {
        return;
      }

      const cols = line.split("\t");
      const newRow = [...EMPTY_ROW];
      for (let i = 0; i < Math.min(cols.length, 11); i++) {
        let val =
          cols[i] !== undefined && cols[i] !== null ? cols[i].trim() : "";
        if (i === 7 || i === 8) {
          val = normalizeDateForInput(val);
        }
        newRow[i] = val;
      }

      parsedRows.push(newRow);
    });

    if (parsedRows.length === 0) {
      showToast("No valid data rows found to paste.", "warning");
      return;
    }

    onChangeRows((currentRows) => [...currentRows, ...parsedRows]);
    setSelectedRows([]);
    showToast(`${parsedRows.length} row(s) pasted.`);
  };

  const handleSectionKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");
      const hasTextSelection =
        window.getSelection() && window.getSelection().toString().length > 0;

      if (!isInputFocused || !hasTextSelection) {
        if (selectedRows.length > 0) {
          e.preventDefault();
          handleCopy();
        }
      }
    }
  };

  const handleSectionPaste = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData ? clipboardData.getData("text") : "";

    if (
      pastedText &&
      (pastedText.includes("\t") || pastedText.includes("\n"))
    ) {
      e.preventDefault();
      handlePaste(pastedText);
    }
  };

  /* ----------------------------------------------------------
     NEW
     ---------------------------------------------------------- */

  const handleNew = () => {
    if (!enabled) {
      showToast("Please select Yes before adding a new row.", "warning");

      return;
    }

    onChangeRows((currentRows) => [...currentRows, [...EMPTY_ROW]]);

    setSelectedRows([]);
  };

  /* ----------------------------------------------------------
     DELETE
     ---------------------------------------------------------- */

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      return;
    }

    const deletedRowItems = rows.filter((_, index) =>
      selectedRows.includes(index),
    );

    if (onDelete) {
      onDelete(deletedRowItems);
    }

    const updatedRows = rows.filter(
      (_, index) => !selectedRows.includes(index),
    );

    onChangeRows(updatedRows);
    setSelectedRows([]);

    showToast("Selected rows deleted.");
  };

  /* ----------------------------------------------------------
     CLEAR
     ---------------------------------------------------------- */

  const handleClear = () => {
    onChangeRows(savedRows.map((row) => [...row]));

    setSelectedRows([]);
  };

  /* ----------------------------------------------------------
     SAVE
     ---------------------------------------------------------- */

  const handleSave = () => {
    onSave(rows.map((row) => [...row]));

    setSelectedRows([]);

    showToast("Changes saved successfully.");
  };

  return (
    <section
      className="sched-j-section"
      onKeyDown={handleSectionKeyDown}
      onPaste={handleSectionPaste}
    >
      <div className="sched-j-section-header">
        <div className="sched-j-question">
          <span className="sched-j-section-title">{title}</span>

          <label className="sched-j-radio">
            <input
              type="radio"
              name={`answer-${title}`}
              checked={enabled}
              onChange={() => setEnabled(true)}
            />

            <span>Yes</span>
          </label>

          <label className="sched-j-radio">
            <input
              type="radio"
              name={`answer-${title}`}
              checked={!enabled}
              onChange={() => setEnabled(false)}
            />

            <span>No</span>
          </label>
        </div>

        <div className="sched-j-actions">
          <button type="button" className="sched-j-button" onClick={handleNew}>
            New
          </button>

          <button
            type="button"
            className="sched-j-button"
            onClick={handleCopy}
            disabled={selectedRows.length === 0}
          >
            Copy
          </button>

          <button
            type="button"
            className="sched-j-button"
            onClick={() => handlePaste()}
            disabled={selectedRows.length === 0}
          >
            Paste
          </button>

          <button
            type="button"
            className="sched-j-button sched-j-button-danger"
            onClick={handleDelete}
            disabled={selectedRows.length === 0}
          >
            Delete
          </button>

          <button
            type="button"
            className="sched-j-button"
            onClick={handleClear}
          >
            Clear
          </button>

          <button type="button" className="sched-j-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {enabled && (
        <DataTable
          rows={rows}
          savedRows={savedRows}
          selectedRows={selectedRows}
          onToggleRow={handleToggleRow}
          onChangeRow={handleChangeRow}
        />
      )}

      {toast && (
        <ActionToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}

/* ============================================================
   LOCAL STORAGE
   ============================================================ */

const STORAGE_KEY = "sched-j-section-rows";

/* ============================================================
   MAIN SCHEDULE J
   ============================================================ */

export default function SchedJ({
  companyName,
  companyAddress,
  year,
  explanatoryNote,
  setExplanatoryNote,
}) {
  const [fiscalYearEnd, setFiscalYearEnd] = useState(`${year}-12-31`);
  const [canPaste, setCanPaste] = useState(false);

  const [sectionRows, setSectionRows] = useState({
    costType: [],
    tm: [],
    incentive: [],
    idiq: [],
    interdivision: [],
  });

  const [savedSectionRows, setSavedSectionRows] = useState({
    costType: [],
    tm: [],
    incentive: [],
    idiq: [],
    interdivision: [],
  });

  // const getYear = useCallback(() => {
  //   if (!fiscalYearEnd) return 2025;
  //   const parts = fiscalYearEnd.split("-");
  //   return parts.length > 0 ? parseInt(parts[0], 10) || 2025 : 2025;
  // }, [fiscalYearEnd, year]);

  // Fetch all Schedule J from backend API
  const fetchScheduleJData = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/ScheduleJ?year=${year}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const grouped = {
            costType: [],
            tm: [],
            incentive: [],
            idiq: [],
            interdivision: [],
          };

          data.forEach((item) => {
            const secKey = item.subcType || "costType";
            const targetKey = grouped[secKey] ? secKey : "costType";
            const rowArr = [
              item.subcNo || "",
              item.prmCntrNo || "",
              item.prmCntrAmt != null ? String(item.prmCntrAmt) : "",
              item.subcNameAddr || "",
              item.subcDunsNo || "",
              item.pocPhoneNo || "",
              item.subcAmt != null ? String(item.subcAmt) : "",
              item.popStartDt || "",
              item.popEndDt || "",
              item.incrPriorYrAmt != null ? String(item.incrPriorYrAmt) : "",
              item.awardType || "",
            ];
            grouped[targetKey].push(rowArr);
          });

          setSectionRows(grouped);
          setSavedSectionRows(grouped);
          setFiscalYearEnd(`${year}-12-31`);
        }
      }
    } catch (err) {
      console.warn("Could not fetch Schedule J records:", err);
    }
  }, [year]);

  useEffect(() => {
    fetchScheduleJData();
  }, [fetchScheduleJData]);

  const saveSectionRows = async (sectionId, rows) => {
    const year = getYear();

    // Check for renamed / replaced subcNo entries and clean up old records in backend
    const previousSaved = savedSectionRows[sectionId] || [];
    const currentSubcNos = new Set(
      rows
        .filter((r) => r[0] && String(r[0]).trim() !== "")
        .map((r) => String(r[0]).trim()),
    );
    const staleRows = previousSaved.filter(
      (oldRow) =>
        oldRow[0] &&
        String(oldRow[0]).trim() !== "" &&
        !currentSubcNos.has(String(oldRow[0]).trim()),
    );

    if (staleRows.length > 0) {
      const deletePayload = staleRows.map((r) => ({
        year: year,
        subcType: sectionId,
        subcNo: String(r[0]).trim(),
      }));
      try {
        await fetch(`${BASE_URL}/api/ScheduleJ/bulk-delete`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(deletePayload),
        });
      } catch (err) {
        console.warn("Error cleaning up renamed/stale Schedule J rows:", err);
      }
    }

    const payload = rows
      .filter((row) => row.some((cell) => cell && String(cell).trim() !== ""))
      .map((row, idx) => ({
        year: year,
        subcType: sectionId,
        subcNo:
          row[0] && String(row[0]).trim() !== ""
            ? String(row[0]).trim()
            : `SUB-${idx + 1}`,
        prmCntrNo: row[1] || null,
        prmCntrAmt: row[2] ? parseFloat(row[2]) || null : null,
        subcNameAddr: row[3] || null,
        subcDunsNo: row[4] || null,
        pocPhoneNo: row[5] || null,
        subcAmt: row[6] ? parseFloat(row[6]) || null : null,
        popStartDt: row[7] || null,
        popEndDt: row[8] || null,
        incrPriorYrAmt: row[9] ? parseFloat(row[9]) || null : null,
        awardType: row[10] || null,
      }));

    if (payload.length > 0) {
      try {
        await fetch(`${BASE_URL}/api/ScheduleJ/bulk-upsert`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.warn("Error saving Schedule J to backend:", err);
      }
    }

    setSavedSectionRows((current) => ({
      ...current,
      [sectionId]: [...rows],
    }));
  };

  const deleteSectionRows = async (sectionId, deletedRowItems) => {
    const year = getYear();
    const deletePayload = deletedRowItems
      .filter((row) => row[0] && String(row[0]).trim() !== "")
      .map((row) => ({
        year: year,
        subcType: sectionId,
        subcNo: String(row[0]).trim(),
      }));

    if (deletePayload.length > 0) {
      try {
        await fetch(`${BASE_URL}/api/ScheduleJ/bulk-delete`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(deletePayload),
        });
      } catch (err) {
        console.warn("Error deleting Schedule J rows:", err);
      }
    }
  };

  const updateSectionRows = (sectionId, updater) => {
    setSectionRows((current) => ({
      ...current,

      [sectionId]:
        typeof updater === "function" ? updater(current[sectionId]) : updater,
    }));
  };

  const handlePasteToSection = (targetSectionId, text) => {
    const rawLines = text.split(/\r\n|\n|\r/);
    const parsedRows = [];

    rawLines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || isHeaderOrTitleLine(trimmedLine)) return;

      const cols = line.split("\t");
      const newRow = [...EMPTY_ROW];
      for (let i = 0; i < Math.min(cols.length, 11); i++) {
        let val =
          cols[i] !== undefined && cols[i] !== null ? cols[i].trim() : "";
        if (i === 7 || i === 8) {
          val = normalizeDateForInput(val);
        }
        newRow[i] = val;
      }
      parsedRows.push(newRow);
    });

    if (parsedRows.length > 0) {
      updateSectionRows(targetSectionId, (current) => [
        ...current,
        ...parsedRows,
      ]);
    }
  };

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <>
      <style>{`

        /* ====================================================
           GLOBAL
           ==================================================== */

        * {
          box-sizing: border-box;
        }


        /* ====================================================
           PAGE
           ==================================================== */

        .sched-j-page {
          width: 100%;
          min-height: 100vh;

          padding: 12px;

          background: #eaf7fb;

          color: #12384a;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 12px;

          overflow-x: auto;
        }


        .sched-j-document {
          width: 100%;

          min-width: 1120px;

          margin: 0 auto;
        }


        /* ====================================================
           NEW PDF-STYLE SCHEDULE J HEADER
           ==================================================== */

        .sched-j-report-header {
          position: relative;

          width: 100%;

          padding: 2px 0 8px;

          background: #ffffff;

          color: #000000;

          text-align: center;
        }


        /* ====================================================
           COMPANY BANNER
           ==================================================== */

        .sched-j-company-banner {
          width: 360px;

          margin: 0 auto;

          padding: 4px 8px;

          background: #ffff00;

          color: #000000;

          text-align: center;

          font-family:
            "Times New Roman",
            Times,
            serif;

          font-size: 14px;

          font-weight: 700;

          line-height: 1.15;
        }


        /* ====================================================
           TITLE
           ==================================================== */

        .sched-j-report-title {
          margin-top: 17px;

          color: #000000;

          font-family:
            "Times New Roman",
            Times,
            serif;

          font-size: 15px;

          font-weight: 700;

          line-height: 1.15;
        }


        /* ====================================================
           FISCAL YEAR END BANNER
           ==================================================== */

        .sched-j-fy-banner {
          display: flex;

          align-items: center;

          justify-content: center;

          width: 360px;

          height: 25px;

          margin: 3px auto 0;

          padding: 2px 6px;

          background: #ffff00;

          color: #000000;

          font-family:
            "Times New Roman",
            Times,
            serif;

          font-size: 14px;

          font-weight: 700;

          line-height: 1;
        }


        /* ====================================================
           FISCAL YEAR DATE PICKER
           ==================================================== */

        .sched-j-fy-date {
          width: 115px;

          height: 21px;

          margin-left: 4px;

          padding: 0 2px;

          border: 0;

          outline: none;

          background: #ffff00;

          color: #000000;

          font-family:
            "Times New Roman",
            Times,
            serif;

          font-size: 14px;

          font-weight: 700;

          cursor: pointer;
        }


        .sched-j-fy-date:focus {
          outline: 1px solid #777;

          outline-offset: 1px;
        }


        /* ====================================================
           OLD TOP HEADER STYLES
           ==================================================== */

        .sched-j-top {
          min-height: 58px;

          padding: 0 16px;

          margin-bottom: 10px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          background: #fff;

          border: 1px solid #d8e5ea;

          border-radius: 6px;

          box-shadow:
            0 1px 3px
            rgba(
              20,
              60,
              75,
              0.06
            );
        }


        .sched-j-heading {
          display: flex;

          align-items: center;

          gap: 10px;

          color: #12384a;

          font-size: 18px;

          font-weight: 700;
        }


        .sched-j-heading-icon {
          display: flex;

          align-items: center;

          justify-content: center;

          color: #1f6ff2;
        }


        .sched-j-ice {
          text-align: right;

          color: #174b63;

          font-size: 10px;

          font-weight: 700;

          line-height: 1.25;
        }


        /* ====================================================
           SECTION
           ==================================================== */

        .sched-j-section {
          margin-bottom: 10px;

          padding: 10px 12px;

          background: #fff;

          border:
            1px solid #d8e5ea;

          border-radius: 6px;

          box-shadow:
            0 1px 3px
            rgba(
              20,
              60,
              75,
              0.05
            );
        }


        .sched-j-section-header {
          min-height: 27px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 10px;

          margin-bottom: 7px;
        }


        /* ====================================================
           QUESTION
           ==================================================== */

        .sched-j-question {
          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 10px;

          color: #12384a;

          font-size: 12px;

          font-weight: 700;
        }


        .sched-j-section-title {
          margin-right: 4px;
        }


        /* ====================================================
           RADIO
           ==================================================== */

        .sched-j-radio {
          display: inline-flex;

          align-items: center;

          gap: 4px;

          color: #234b5e;

          font-size: 11px;

          font-weight: 500;

          cursor: pointer;
        }


        .sched-j-radio input,
        .sched-j-table input[type="checkbox"] {
          margin: 0;

          accent-color: #1f86f7;

          cursor: pointer;
        }


        /* ====================================================
           ACTION BUTTONS
           ==================================================== */

        .sched-j-actions {
          display: flex;

          align-items: center;

          gap: 7px;

          flex-shrink: 0;
        }


        .sched-j-button {
          min-width: 63px;

          border: 0;

          border-radius: 18px;

          padding: 7px 15px;

          background: #103f4d;

          color: #fff;

          font-size: 11px;

          font-weight: 700;

          cursor: pointer;

          transition:
            opacity 0.15s ease,
            transform 0.15s ease;
        }


        .sched-j-button:hover:not(:disabled) {
          opacity: 0.9;

          transform:
            translateY(-1px);
        }


        .sched-j-button:disabled {
          opacity: 0.45;

          cursor: not-allowed;
        }


        .sched-j-button-danger {
          background: #ef1f25;
        }


        /* ====================================================
           TABLE WRAPPER
           ==================================================== */

        .sched-j-table-wrap {
          width: 100%;

          overflow-x: auto;

          border:
            1px solid #c9e5f2;

          border-radius: 3px;
        }


        /* ====================================================
           TABLE
           ==================================================== */

        .sched-j-table {
          width: 100%;

          min-width: 1080px;

          table-layout: fixed;

          border-collapse: collapse;

          font-size: 9px;

          color: #174b63;
        }


        /* ====================================================
           COLUMN WIDTHS
           ==================================================== */

        .sched-j-table .c0 {
          width: 2.5%;
        }

        .sched-j-table .c1 {
          width: 7.8%;
        }

        .sched-j-table .c2 {
          width: 8.4%;
        }

        .sched-j-table .c3 {
          width: 9.2%;
        }

        .sched-j-table .c4 {
          width: 18.5%;
        }

        .sched-j-table .c5 {
          width: 9.1%;
        }

        .sched-j-table .c6 {
          width: 11.3%;
        }

        .sched-j-table .c7 {
          width: 7.5%;
        }

        .sched-j-table .c8 {
          width: 5.5%;
        }

        .sched-j-table .c9 {
          width: 5.5%;
        }

        .sched-j-table .c10 {
          width: 7.4%;
        }

        .sched-j-table .c11 {
          width: 7.3%;
        }


        /* ====================================================
           TABLE HEADER
           ==================================================== */

        .sched-j-table th {
          height: 32px;

          padding: 4px 4px;

          border:
            1px solid #c9e5f2;

          background: #e4f5fc;

          color: #174b63;

          text-align: center;

          vertical-align: middle;

          font-weight: 700;

          line-height: 1.1;
        }


        .sched-j-table th.select-head {
          background: #e4f5fc;
        }


        /* ====================================================
           TABLE BODY
           ==================================================== */

        .sched-j-table td {
          height: 31px;

          padding: 3px 4px;

          border:
            1px solid #d7e8ef;

          background: #fff;

          text-align: center;

          vertical-align: middle;
        }


        .sched-j-table td.left {
          text-align: left;
        }


        .sched-j-table td.select-cell {
          text-align: center;
        }


        /* ====================================================
           INPUTS
           ==================================================== */

        .sched-j-input {
          width: 100%;

          min-width: 0;

          height: 27px;

          padding: 4px 6px;

          border:
            1px solid #cbd5df;

          border-radius: 4px;

          background: #fff;

          color: #12384a;

          font: inherit;

          outline: none;
        }


        .sched-j-input:focus {
          border-color: #78b7ed;

          box-shadow:
            0 0 0 1px
            rgba(
              31,
              134,
              247,
              0.12
            );
        }


        .sched-j-select {
          cursor: pointer;
        }


        /* ====================================================
           EMPTY ROW
           ==================================================== */

        .sched-j-table .empty-row td {
          height: 31px;

          color: #8aa4b2;

          font-size: 10px;

          text-align: center;
        }


        /* ====================================================
           NOTE
           ==================================================== */

        .sched-j-note {
          margin-top: 2px;

          padding: 7px 8px;

          border:
            1px solid #d3e0e6;

          border-radius: 4px;

          background: #f7f9fa;

          color: #49616d;

          font-size: 9px;

          line-height: 1.3;
        }


        .sched-j-note b {
          color: #294957;

          font-weight: 700;
        }


        /* ====================================================
           TOAST
           ==================================================== */

        .sched-j-toast {
          position: fixed;

          top: 18px;

          right: 18px;

          z-index: 9999;

          width: 400px;

          max-width:
            calc(100vw - 36px);

          overflow: hidden;

          background: #fff;

          border:
            1px solid #e2e7eb;

          border-radius: 5px;

          box-shadow:
            0 4px 16px
            rgba(
              20,
              60,
              75,
              0.16
            );

          color: #6b6f73;
        }


        .sched-j-toast-content {
          min-height: 72px;

          display: flex;

          align-items: center;

          gap: 12px;

          padding:
            14px
            12px
            12px
            16px;
        }


        .sched-j-toast-icon {
          width: 26px;

          height: 26px;

          flex:
            0 0 26px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          background: #08b72e;

          color: #fff;

          font-size: 17px;

          font-weight: 700;
        }


        .sched-j-toast-message {
          flex: 1;

          font-size: 16px;

          line-height: 1.25;
        }


        .sched-j-toast-close {
          width: 24px;

          height: 24px;

          padding: 0;

          border: 0;

          background: transparent;

          color: #a5a5a5;

          font-size: 25px;

          line-height: 20px;

          cursor: pointer;
        }


        .sched-j-toast-close:hover {
          color: #6b6f73;
        }


        .sched-j-toast-progress {
          height: 5px;

          width: 76%;

          background: #22c93a;

          animation:
            schedJToastProgress
            3.5s
            linear
            forwards;
        }


        .sched-j-toast.warning
          .sched-j-toast-icon {
          background: #f0a400;
        }


        .sched-j-toast.warning
          .sched-j-toast-progress {
          background: #f0a400;
        }


        @keyframes schedJToastProgress {
          from {
            width: 76%;
          }

          to {
            width: 0;
          }
        }


        /* ====================================================
           RESPONSIVE
           ==================================================== */

        @media (max-width: 1100px) {

          .sched-j-document {
            min-width: 1120px;
          }

        }


        /* ====================================================
           PRINT
           ==================================================== */

        @media print {

          .sched-j-page {
            padding: 5px;

            background: #fff;
          }


          .sched-j-document {
            min-width: 0;

            width: 100%;
          }


          .sched-j-button {
            display: none;
          }

        }

      `}</style>

      {/* ======================================================
          SCHEDULE J PAGE
          ====================================================== */}

      <div className="sched-j-page">
        <div className="sched-j-document">
          {/* ==================================================
              NEW PDF-STYLE HEADER
              ================================================== */}

          <div className="sched-j-report-header">
            {/* COMPANY */}
            <div className="sched-j-company-banner">
              <div>{companyName} </div>

              <div>{companyAddress}</div>
            </div>

            {/* TITLE */}
            <div className="sched-j-report-title">
              Subcontractor Information
            </div>

            {/* FISCAL YEAR END */}
            <div className="sched-j-fy-banner">
              <span>Fiscal Year End -</span>

              <input
                type="date"
                value={fiscalYearEnd}
                onChange={(event) => setFiscalYearEnd(event.target.value)}
                className="sched-j-fy-date"
                aria-label="Fiscal Year End"
              />
            </div>
          </div>

          {/* ==================================================
              EXISTING SECTIONS
              ================================================== */}

          {SECTION_DEFINITIONS.map((section) => (
            <Section
              key={section.id}
              sectionId={section.id}
              title={section.title}
              canPaste={canPaste}
              onCopied={() => setCanPaste(true)}
              onPasteToSection={handlePasteToSection}
              rows={sectionRows[section.id]}
              savedRows={savedSectionRows[section.id]}
              onChangeRows={(updater) => updateSectionRows(section.id, updater)}
              onSave={(rows) => saveSectionRows(section.id, rows)}
              onDelete={(deletedItems) =>
                deleteSectionRows(section.id, deletedItems)
              }
            />
          ))}

          {/* ==================================================
              NOTE
              ================================================== */}
          <div className="sched-j-note">
            <div className="mt-8 border p-4 bg-gray-50 rounded">
              <label className="block font-bold underline mb-2 text-sm">
                Explanatory Notes:
              </label>
              <textarea
                value={explanatoryNote}
                onChange={(e) => setExplanatoryNote(e.target.value)}
                rows={4}
                className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                placeholder="Type explanatory notes here..."
              />
            </div>
          </div>

          {/* <div className="sched-j-note">
            <b>Note:</b> Subject schedule is to provide identification of
            subcontracts you have awarded to companies for which you are the
            prime or upper-tier contractor, including inter-divisional effort.
            This information is required at the pricing action level (e.g.
            delivery order, CLIN) for all subcontract awards (e.g. cost-type,
            incentive contracts, T&amp;M/LH, FFP etc.) issued under
            flexibly-priced and IDIQ prime contracts.
          </div> */}
        </div>
      </div>
    </>
  );
}
