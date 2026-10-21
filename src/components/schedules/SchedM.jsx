import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar } from "lucide-react";
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

// Helper function to safely parse date string to Date object
const parseDate = (dateStr) => {
  if (!dateStr || String(dateStr).includes("#")) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

// Helper function to format Date object to MM/DD/YYYY string
const formatDateToString = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

// Helper function to format Date to YYYY-MM-DD string for Backend API
const formatDateToISO = (dateStr) => {
  const d = parseDate(dateStr);
  if (!d) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const SCHEDM_COPY_HEADERS = [
  "SECTION HEADER",
  "EFFECTIVE DATE",
  "DESCRIPTION OF CHANGE",
];

const isSchedMHeaderLine = (line) => {
  const upper = line.toUpperCase().trim();
  if (!upper) return true;
  if (
    upper.includes("SECTION HEADER") ||
    upper.includes("DESCRIPTION OF CHANGE") ||
    upper.includes("EFFECTIVE DATE") ||
    upper.includes("SCHEDULE M") ||
    upper.includes("SCHEDULE OF DESCRIPTION") ||
    upper.includes("FISCAL YEAR ENDED")
  ) {
    return true;
  }
  return false;
};

const ScheduleM = ({
  data,
  onSave,
  companyName,
  companyAddress,
  year,
  fiscalYearEnd,
}) => {
  // Main data state
  const [companyName1] = useState(data?.companyName1 || "");
  const [companyName2] = useState(data?.companyName2 || "Vienna, VA 22182");
  // const [fiscalYearEnd, setFiscalYearEnd] = useState(
  //   () => data?.fiscalYearEnd || `${fiscalYearEnd}`,
  // );
  const [iceVersion] = useState(data?.iceVersion || "ICE (version 2.0.1h)");

  // Unified single flat list of entries (matching database row-level schema)
  const [entries, setEntries] = useState(() => data?.entries || []);
  const [canPaste, setCanPaste] = useState(false);

  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Extract selected Year
  const getSelectedYear = useCallback(() => {
    const d = parseDate(fiscalYearEnd);
    return d ? d.getFullYear() : null;
  }, [fiscalYearEnd]);

  // ----------------------------------------------------
  // FETCH FROM BACKEND API
  // ----------------------------------------------------
  const fetchScheduleMData = useCallback(async () => {
    const year = getSelectedYear();
    if (!year) {
      setEntries([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/ScheduleM?year=${year}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const records = await response.json();
        const recordsArr = Array.isArray(records)
          ? records
          : records
            ? [records]
            : [];
        if (recordsArr.length > 0) {
          const mapped = recordsArr.map((item, index) => ({
            id: `entry-db-${item.year}-${index}-${Date.now()}`,
            change_hdr: item.changeHdr || item.change_hdr || "",
            change_desc: item.changeDesc || item.change_desc || "",
            effective_dt: item.effectiveDt
              ? formatDateToString(new Date(item.effectiveDt))
              : "",
          }));
          setEntries(mapped);
        } else {
          setEntries([]);
        }
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.warn("Could not fetch Schedule M data from backend:", error);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, [getSelectedYear]);

  useEffect(() => {
    fetchScheduleMData();
  }, [fetchScheduleMData]);

  // Toggle selection for deletion
  const handleToggleRowSelection = (rowId) => {
    setSelectedRowIds((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId],
    );
  };

  // ----------------------------------------------------
  // ACTION: COPY
  // ----------------------------------------------------
  const handleCopy = async () => {
    if (selectedRowIds.length === 0) {
      toast.warning("Please select at least one row to copy.");
      return;
    }

    const selectedEntries = entries.filter((item) =>
      selectedRowIds.includes(item.id),
    );

    if (selectedEntries.length === 0) return;

    const headerLine = SCHEDM_COPY_HEADERS.join("\t");
    const dataLines = selectedEntries.map((item) =>
      [
        (item.change_hdr || "").replace(/\t/g, " "),
        (item.effective_dt || "").replace(/\t/g, " "),
        (item.change_desc || "").replace(/\t/g, " ").replace(/\r?\n/g, " "),
      ].join("\t"),
    );

    const tsvString = [headerLine, ...dataLines].join("\n");

    try {
      await navigator.clipboard.writeText(tsvString);
      setCanPaste(true);
      toast.success(`${selectedEntries.length} row(s) copied.`);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = tsvString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCanPaste(true);
      toast.success(`${selectedEntries.length} row(s) copied.`);
    }
  };

  // ----------------------------------------------------
  // ACTION: PASTE
  // ----------------------------------------------------
  const handlePaste = async (clipboardText = null) => {
    let text = clipboardText;
    if (!text || typeof text !== "string") {
      try {
        text = await navigator.clipboard.readText();
      } catch (err) {
        toast.warning(
          "Clipboard access unavailable. Please use Ctrl + V to paste.",
        );
        return;
      }
    }

    if (!text || typeof text !== "string" || !text.trim()) {
      toast.warning("Clipboard is empty.");
      return;
    }

    const rawLines = text.split(/\r\n|\n|\r/);
    const parsedEntries = [];

    rawLines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      if (isSchedMHeaderLine(trimmedLine)) {
        return;
      }

      const cols = line.split("\t");
      let changeHdr = "";
      let effectiveDt = formatDateToString(new Date());
      let changeDesc = "";

      if (cols.length >= 3) {
        changeHdr = cols[0].trim();
        const parsedD = parseDate(cols[1].trim());
        effectiveDt = parsedD
          ? formatDateToString(parsedD)
          : cols[1].trim() || formatDateToString(new Date());
        changeDesc = cols.slice(2).join(" ").trim();
      } else if (cols.length === 2) {
        changeHdr = cols[0].trim();
        const parsedD = parseDate(cols[1].trim());
        if (parsedD) {
          effectiveDt = formatDateToString(parsedD);
        } else {
          changeDesc = cols[1].trim();
        }
      } else {
        changeHdr = cols[0].trim();
      }

      parsedEntries.push({
        id: `entry-pasted-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        change_hdr: changeHdr,
        change_desc: changeDesc,
        effective_dt: effectiveDt,
      });
    });

    if (parsedEntries.length === 0) {
      toast.warning("No valid data rows found to paste.");
      return;
    }

    setEntries((prev) => [...prev, ...parsedEntries]);
    setSelectedRowIds([]);
    toast.success(`${parsedEntries.length} row(s) pasted.`);
  };

  const handleContainerKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");
      const hasTextSelection =
        window.getSelection() && window.getSelection().toString().length > 0;

      if (!isInputFocused || !hasTextSelection) {
        if (selectedRowIds.length > 0) {
          e.preventDefault();
          handleCopy();
        }
      }
    }
  };

  const handleContainerPaste = (e) => {
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

  // ----------------------------------------------------
  // ACTION: NEW LINE (Single clean entry row)
  // ----------------------------------------------------
  const handleNewLine = () => {
    const timestamp = Date.now();
    const newEntry = {
      id: `entry-${timestamp}`,
      change_hdr: "",
      change_desc: "",
      effective_dt: formatDateToString(new Date()),
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  // ----------------------------------------------------
  // ACTION: DELETE
  // Deletes selected rows or the last entry
  // ----------------------------------------------------
  const handleDelete = async () => {
    const year = getSelectedYear();
    const rowsToDelete = entries.filter((item) =>
      selectedRowIds.includes(item.id),
    );

    if (selectedRowIds.length === 0) {
      if (window.confirm("No row selected. Delete the last section?")) {
        if (entries.length <= 1) {
          toast.info("Cannot delete the only remaining section.");
          return;
        }
        const lastEntry = entries[entries.length - 1];
        if (lastEntry?.change_hdr) {
          try {
            await fetch(`${BASE_URL}/api/ScheduleM/bulk-delete`, {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify([
                {
                  year: year,
                  changeHdr: lastEntry.change_hdr.trim(),
                  effectiveDt: formatDateToISO(lastEntry.effective_dt),
                },
              ]),
            });
          } catch (e) {
            console.warn("Backend delete error:", e);
          }
        }
        setEntries((prev) => prev.slice(0, -1));
        toast.success("Section deleted.");
      }
      return;
    }

    // Call Backend Bulk Delete if rows have change_hdr
    if (rowsToDelete.length > 0) {
      try {
        const deletePayload = rowsToDelete
          .filter((item) => item.change_hdr?.trim())
          .map((item) => ({
            year: year,
            changeHdr: item.change_hdr.trim(),
            effectiveDt: formatDateToISO(item.effective_dt),
          }));

        if (deletePayload.length > 0) {
          await fetch(`${BASE_URL}/api/ScheduleM/bulk-delete`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(deletePayload),
          });
        }
      } catch (err) {
        console.warn("Backend bulk-delete error:", err);
      }
    }

    setEntries((prev) => {
      const filtered = prev.filter((item) => !selectedRowIds.includes(item.id));
      if (filtered.length === 0) {
        const timestamp = Date.now();
        return [
          {
            id: `entry-${timestamp}`,
            change_hdr: "",
            change_desc: "",
            effective_dt: formatDateToString(new Date()),
          },
        ];
      }
      return filtered;
    });
    setSelectedRowIds([]);
    toast.success("Selected section deleted.");
  };

  // ----------------------------------------------------
  // ACTION: CLEAR
  // Clears entries to 1 single blank draft row
  // ----------------------------------------------------
  const handleClear = () => {
    if (
      window.confirm("Are you sure you want to clear all Schedule M entries?")
    ) {
      setFiscalYearEnd(formatDateToString(new Date()));
      const timestamp = Date.now();
      setEntries([
        {
          id: `entry-${timestamp}`,
          change_hdr: "",
          change_desc: "",
          effective_dt: formatDateToString(new Date()),
        },
      ]);
      setSelectedRowIds([]);
      toast.info("Schedule M inputs cleared.");
    }
  };

  // ----------------------------------------------------
  // ACTION: SAVE
  // ----------------------------------------------------
  const handleSave = async () => {
    setIsSaving(true);
    const year = getSelectedYear();

    const payload = {
      companyName1,
      companyName2,
      fiscalYearEnd,
      iceVersion,
      entries,
    };

    // Prepare Backend Database Payload
    const backendRecords = entries
      .filter((item) => item.change_hdr && item.change_hdr.trim() !== "")
      .map((item) => ({
        year: year,
        changeHdr: item.change_hdr.trim(),
        changeDesc: item.change_desc || "",
        effectiveDt: formatDateToISO(item.effective_dt),
      }));

    try {
      if (backendRecords.length > 0) {
        const response = await fetch(`${BASE_URL}/api/ScheduleM/bulk-upsert`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(backendRecords),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || errData.error || "Save failed");
        }
      }

      if (onSave) {
        await onSave(payload);
      }
      toast.success("Schedule M saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error(`Failed to save Schedule M: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------- Handlers for entry updates ----------------
  const handleEntryChange = (id, field, value) => {
    setEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleDateKeyDown = (e) => {
    if (
      [
        "Backspace",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Delete",
        "Enter",
      ].includes(e.key) ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }
    if (!/^[0-9/\-]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div
      onKeyDown={handleContainerKeyDown}
      onPaste={handleContainerPaste}
      style={{
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        padding: "16px 0",
      }}
    >
      {/* ======================================================
          TOOLBAR (ManageUser style buttons)
      ====================================================== */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto 10px auto",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <button
          type="button"
          onClick={handleNewLine}
          className="btn1 btn-blue whitespace-nowrap cursor-pointer"
        >
          New Line
        </button>

        <button
          type="button"
          onClick={handleCopy}
          disabled={selectedRowIds.length === 0}
          className="btn1 btn-blue whitespace-nowrap cursor-pointer"
        >
          Copy
        </button>

        <button
          type="button"
          onClick={() => handlePaste()}
          disabled={!canPaste}
          className="btn1 btn-blue whitespace-nowrap cursor-pointer"
        >
          Paste
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="btn1 btn-red whitespace-nowrap cursor-pointer"
        >
          Delete
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="btn1 btn-blue whitespace-nowrap cursor-pointer"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="btn1 btn-blue whitespace-nowrap cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* ======================================================
          SCHEDULE M CARD CONTAINER
      ====================================================== */}
      <div style={styles.container}>
        {/* Top Header Block */}
        <div style={styles.topRow}>
          {/* Left Manual Link */}
          <div style={styles.leftNav}>
            <a href="#manual" style={styles.manualLink}>
              Manual Entry
            </a>
          </div>

          {/* Center Yellow Header Banner */}
          <div style={styles.yellowBanner}>
            <div style={styles.companyName}>
              {companyName}
              <br />
              {companyAddress}
            </div>
            <div style={styles.scheduleTitle}>
              SCHEDULE OF DESCRIPTION OF ACCOUNTING SYSTEM AND OTHER SIGNIFICANT
              <br />
              CHANGES AND OTHER AGREEMENTS AND APPROVALS
            </div>
            <div style={styles.fiscalYear}>
              <span>FISCAL YEAR ENDED &nbsp;</span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderBottom: "1px solid #000000",
                  paddingBottom: "1px",
                  cursor: "pointer",
                }}
              >
                <DatePicker
                  selected={parseDate(fiscalYearEnd)}
                  onChange={(date) =>
                    setFiscalYearEnd(date ? formatDateToString(date) : "")
                  }
                  onChangeRaw={(e) => {
                    if (e?.target?.value !== undefined) {
                      setFiscalYearEnd(e.target.value);
                    }
                  }}
                  onKeyDown={handleDateKeyDown}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  className="cursor-pointer bg-transparent border-0 outline-none font-bold text-xs text-center p-0 text-black"
                  style={{
                    width: "82px",
                    textAlign: "center",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#000000",
                  }}
                />
                <Calendar
                  size={13}
                  color="#000000"
                  style={{ marginLeft: "2px", pointerEvents: "none" }}
                />
              </div>
            </div>
          </div>

          {/* Right Info */}
          <div style={styles.rightHeader}>
            <div style={styles.scheduleName}>SCHEDULE M</div>
            <div style={styles.versionText}>{iceVersion}</div>
          </div>
        </div>

        {/* Main Table Structure */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, ...styles.colDescription }}>
                Description of change
              </th>
              <th style={{ ...styles.th, ...styles.colEffective }}>
                Effective
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((item, index) => {
              const isSelected = selectedRowIds.includes(item.id);

              return (
                <React.Fragment key={item.id}>
                  {/* 1. Header & Effective Date Row */}
                  <tr
                    style={{
                      backgroundColor: isSelected ? "#eff6ff" : "transparent",
                    }}
                  >
                    <td style={styles.sectionHeaderCol1}>
                      <input
                        type="text"
                        value={item.change_hdr}
                        onChange={(e) =>
                          handleEntryChange(
                            item.id,
                            "change_hdr",
                            e.target.value,
                          )
                        }
                        placeholder="Enter section header (e.g. Accounting System and Cost Allocation Changes)..."
                        style={styles.sectionHeaderInput}
                      />
                    </td>
                    <td style={styles.sectionHeaderCol2}>
                      <div style={styles.datePickerContainer}>
                        <div style={{ flex: 1, width: "100%" }}>
                          <DatePicker
                            selected={parseDate(item.effective_dt)}
                            onChange={(date) =>
                              handleEntryChange(
                                item.id,
                                "effective_dt",
                                date ? formatDateToString(date) : "",
                              )
                            }
                            onChangeRaw={(e) => {
                              if (e?.target?.value !== undefined) {
                                handleEntryChange(
                                  item.id,
                                  "effective_dt",
                                  e.target.value,
                                );
                              }
                            }}
                            onKeyDown={handleDateKeyDown}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="MM/DD/YYYY"
                            className="cursor-pointer w-full bg-transparent border-0 outline-none font-bold text-xs p-0 text-black"
                            wrapperClassName="w-full"
                          />
                        </div>
                        <Calendar
                          size={14}
                          color="#4b5563"
                          style={{
                            flexShrink: 0,
                            marginLeft: "4px",
                            pointerEvents: "none",
                          }}
                        />
                      </div>
                    </td>
                  </tr>

                  {/* 2. Full-Width Description Row (spans both columns) */}
                  <tr
                    style={{
                      backgroundColor: isSelected ? "#eff6ff" : "transparent",
                    }}
                  >
                    <td colSpan={2} style={styles.descFullCol}>
                      <div style={styles.descWrapper}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRowSelection(item.id)}
                          style={styles.checkbox}
                          title="Select row for delete"
                        />
                        <textarea
                          value={item.change_desc}
                          onChange={(e) =>
                            handleEntryChange(
                              item.id,
                              "change_desc",
                              e.target.value,
                            )
                          }
                          placeholder="Enter Detailed Description of Change..."
                          rows={index === 0 ? 12 : 3}
                          style={styles.descriptionTextarea}
                        />
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Inline styles mirroring classic Excel/ICE Schedule layout (Original exact styling)
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    color: "#000000",
    backgroundColor: "#ffffff",
    padding: "16px",
    maxWidth: "920px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  leftNav: {
    flex: "1 1 20%",
  },
  manualLink: {
    color: "#0000FF",
    textDecoration: "underline",
    fontSize: "11px",
    fontWeight: "normal",
  },
  yellowBanner: {
    backgroundColor: "#FFFF00",
    padding: "8px 16px",
    textAlign: "center",
    flex: "2 1 60%",
    color: "#000000",
  },
  companyName: {
    fontWeight: "bold",
    fontSize: "13px",
    marginBottom: "2px",
  },
  scheduleTitle: {
    fontWeight: "bold",
    fontSize: "12px",
    lineHeight: "1.3",
    margin: "4px 0",
  },
  fiscalYear: {
    fontWeight: "bold",
    fontSize: "12px",
    marginTop: "6px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  rightHeader: {
    flex: "1 1 20%",
    textAlign: "left",
    paddingLeft: "12px",
  },
  scheduleName: {
    fontWeight: "bold",
    fontSize: "13px",
  },
  versionText: {
    fontSize: "11px",
    marginTop: "2px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "8px",
  },
  th: {
    borderTop: "1px solid #000000",
    borderBottom: "1px solid #000000",
    borderLeft: "1px solid #000000",
    borderRight: "1px solid #000000",
    padding: "4px 6px",
    fontWeight: "bold",
    fontSize: "12px",
    backgroundColor: "#ffffff",
  },
  colDescription: {
    textAlign: "left",
    width: "78%",
  },
  colEffective: {
    textAlign: "left",
    width: "22%",
  },
  sectionHeaderCol1: {
    padding: "12px 8px 4px 0",
    verticalAlign: "middle",
  },
  sectionHeaderCol2: {
    padding: "12px 0 4px 6px",
    verticalAlign: "middle",
  },
  sectionHeaderInput: {
    width: "100%",
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    fontWeight: "bold",
    backgroundColor: "#ffffff",
    border: "1px solid #9ca3af",
    borderRadius: "3px",
    padding: "5px 8px",
    boxSizing: "border-box",
    color: "#000000",
  },
  datePickerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#ffffff",
    border: "1px solid #9ca3af",
    borderRadius: "3px",
    padding: "4px 8px",
    boxSizing: "border-box",
  },
  datePickerInput: {
    width: "100%",
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    fontWeight: "bold",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    padding: "0",
    color: "#000000",
  },
  descFullCol: {
    padding: "4px 0 12px 0",
    verticalAlign: "top",
  },
  descWrapper: {
    display: "flex",
    alignItems: "flex-start",
    gap: "6px",
    width: "100%",
  },
  checkbox: {
    cursor: "pointer",
    width: "14px",
    height: "14px",
    marginTop: "6px",
    flexShrink: 0,
  },
  descriptionTextarea: {
    width: "100%",
    flex: 1,
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    padding: "8px 10px",
    backgroundColor: "#ffffff",
    border: "1px solid #9ca3af",
    borderRadius: "3px",
    lineHeight: "1.45",
    resize: "vertical",
    boxSizing: "border-box",
  },
};

export default ScheduleM;
