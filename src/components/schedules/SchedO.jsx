import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

const SCHEDO_COPY_HEADERS = [
  "CONTRACT NO.",
  "ORDER NO.",
  "FROM",
  "TO",
  "READY TO CLOSE (1)",
  "CONTRACT CEILING AMOUNT (2)",
  "FEE (3)",
  "REQUIRED",
  "ACTUAL",
  "NOTES",
];

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

const isSchedOHeaderLine = (line) => {
  const upper = line.toUpperCase().trim();
  if (!upper) return true;
  if (
    upper.includes("CONTRACT NO") ||
    upper.includes("ORDER NO") ||
    upper.includes("PERFORMANCE PERIOD") ||
    upper.includes("READY TO CLOSE") ||
    upper.includes("CONTRACT CEILING") ||
    upper.includes("LEVEL OF EFFORT") ||
    upper.includes("SCHEDULE OF CONTRACT CLOSING") ||
    upper.includes("SCHEDULE O") ||
    upper.includes("COST TYPE") ||
    upper.includes("TIME & MATERIAL") ||
    upper.includes("TIME AND MATERIAL") ||
    upper.includes("FISCAL YEAR END")
  ) {
    return true;
  }
  return false;
};

// ============================================================
// INITIAL DATA
// ============================================================

const INITIAL_COST_TYPE_ROWS = [];

const INITIAL_TIME_MATERIAL_ROWS = [];

// ============================================================
// CREATE EMPTY ROW
// ============================================================

const createEmptyRow = (id) => ({
  id,
  contractNo: "",
  orderNo: "",
  from: "",
  to: "",
  readyToClose: "",
  ceilingAmount: "",
  fee: "",
  required: "",
  actual: "",
  notes: "",
});

// ============================================================
// TABLE COLUMNS
// ============================================================

const COLUMNS = [
  {
    key: "contractNo",
    label: "CONTRACT NO.",
  },
  {
    key: "orderNo",
    label: "ORDER NO.",
  },
  {
    key: "from",
    label: "FROM",
    type: "date",
  },
  {
    key: "to",
    label: "TO",
    type: "date",
  },
  {
    key: "readyToClose",
    label: "READY TO CLOSE (1)",
  },
  {
    key: "ceilingAmount",
    label: "CONTRACT CEILING AMOUNT (2)",
    numeric: true,
  },
  {
    key: "fee",
    label: "FEE (3)",
    numeric: true,
  },
  {
    key: "required",
    label: "REQUIRED",
    numeric: true,
  },
  {
    key: "actual",
    label: "ACTUAL",
    numeric: true,
  },
  {
    key: "notes",
    label: "NOTES",
  },
];

// ============================================================
// COMPONENT
// ============================================================

export default function SchedO({ companyName, companyAddress, year }) {
  const [fiscalYearEnd, setFiscalYearEnd] = useState(`${year}-12-31`);

  const [costTypeRows, setCostTypeRows] = useState(INITIAL_COST_TYPE_ROWS);

  const [timeMaterialRows, setTimeMaterialRows] = useState(
    INITIAL_TIME_MATERIAL_ROWS,
  );

  const getYear = useCallback(() => {
    if (!fiscalYearEnd) return year;
    const parts = fiscalYearEnd.split("-");
    return parts.length > 0 ? parseInt(parts[0], 10) || year : year;
  }, [fiscalYearEnd]);

  // Fetch Schedule O data from backend API
  const fetchScheduleOData = useCallback(async () => {
    const year = getYear();
    try {
      const response = await fetch(`${BASE_URL}/api/ScheduleO?year=${year}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const costRows = [];
          const tmRows = [];

          data.forEach((item, idx) => {
            const mappedRow = {
              id: `db-row-${idx}-${Date.now()}`,
              contractNo: item.contractNo || "",
              orderNo: item.orderNo || "",
              from: item.popStartDt || "",
              to: item.popEndDt || "",
              readyToClose: item.readyToCloseFl ? "Y" : "N",
              ceilingAmount:
                item.cntrCeilingAmt != null ? String(item.cntrCeilingAmt) : "",
              fee: item.feeAmt != null ? String(item.feeAmt) : "",
              required: item.reqHrs != null ? String(item.reqHrs) : "",
              actual: item.actualHrs != null ? String(item.actualHrs) : "",
              notes: item.notes || "",
            };

            if (item.projType === "CostType") {
              costRows.push(mappedRow);
            } else {
              tmRows.push(mappedRow);
            }
          });

          if (costRows.length > 0) setCostTypeRows(costRows);
          else setCostTypeRows([]);
          if (tmRows.length > 0) setTimeMaterialRows(tmRows);
          else setTimeMaterialRows([]);
          setSavedState({ costTypeRows: costRows, timeMaterialRows: tmRows });
        } else {
          setCostTypeRows([]);
          setTimeMaterialRows([]);
          setSavedState({ costTypeRows: [], timeMaterialRows: [] });
        }
      } else {
        setCostTypeRows([]);
        setTimeMaterialRows([]);
        setSavedState({ costTypeRows: [], timeMaterialRows: [] });
      }
    } catch (err) {
      console.warn("Could not fetch Schedule O records:", err);
      setCostTypeRows([]);
      setTimeMaterialRows([]);
      setSavedState({ costTypeRows: [], timeMaterialRows: [] });
    }
  }, [getYear]);

  useEffect(() => {
    fetchScheduleOData();
  }, [fetchScheduleOData]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [canPaste, setCanPaste] = useState(false);

  // ==========================================================
  // SAVED STATE
  // ==========================================================

  const [savedState, setSavedState] = useState({
    costTypeRows: INITIAL_COST_TYPE_ROWS,
    timeMaterialRows: INITIAL_TIME_MATERIAL_ROWS,
  });

  // ==========================================================
  // ALL ROW IDS
  // ==========================================================

  const allRowIds = [
    ...costTypeRows.map((row) => row.id),
    ...timeMaterialRows.map((row) => row.id),
  ];

  // ==========================================================
  // CHECK WHETHER ALL ROWS ARE SELECTED
  // ==========================================================

  const allSelected =
    allRowIds.length > 0 && selectedRows.length === allRowIds.length;

  // ==========================================================
  // UPDATE ROW
  // ==========================================================

  const updateRow = (section, rowId, key, value) => {
    if (section === "costType") {
      setCostTypeRows((currentRows) =>
        currentRows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                [key]: value,
              }
            : row,
        ),
      );

      return;
    }

    if (section === "timeMaterial") {
      setTimeMaterialRows((currentRows) =>
        currentRows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                [key]: value,
              }
            : row,
        ),
      );
    }
  };

  // ==========================================================
  // NUMERIC INPUT HANDLER
  // ==========================================================

  const handleNumericChange = (section, rowId, key, value) => {
    // Allow only numbers and decimal point
    let numericValue = value.replace(/[^0-9.]/g, "");

    // Allow only one decimal point
    const parts = numericValue.split(".");

    if (parts.length > 2) {
      numericValue = `${parts[0]}.${parts.slice(1).join("")}`;
    }

    updateRow(section, rowId, key, numericValue);
  };

  // ==========================================================
  // SELECT / UNSELECT ONE ROW
  // ==========================================================

  const toggleRow = (rowId) => {
    setSelectedRows((currentSelected) => {
      if (currentSelected.includes(rowId)) {
        return currentSelected.filter((id) => id !== rowId);
      }

      return [...currentSelected, rowId];
    });
  };

  // ==========================================================
  // SELECT / UNSELECT ALL
  // ==========================================================

  const toggleAll = (checked) => {
    if (checked) {
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  // ==========================================================
  // NEW COST TYPE
  // ==========================================================

  const handleNewCostType = () => {
    const newId = `cost-${Date.now()}-${Math.random()}`;

    const newRow = createEmptyRow(newId);

    setCostTypeRows((currentRows) => [...currentRows, newRow]);
  };

  // ==========================================================
  // NEW TIME & MATERIAL
  // ==========================================================

  const handleNewTimeMaterial = () => {
    const newId = `tm-${Date.now()}-${Math.random()}`;

    const newRow = createEmptyRow(newId);

    setTimeMaterialRows((currentRows) => [...currentRows, newRow]);
  };

  // ==========================================================
  // COPY
  // ==========================================================

  const handleCopy = async () => {
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to copy.");
      return;
    }

    const allRows = [...costTypeRows, ...timeMaterialRows];
    const selectedData = allRows.filter((r) => selectedRows.includes(r.id));

    if (selectedData.length === 0) return;

    const headerLine = SCHEDO_COPY_HEADERS.join("\t");
    const dataLines = selectedData.map((row) =>
      [
        (row.contractNo || "").replace(/\t/g, " "),
        (row.orderNo || "").replace(/\t/g, " "),
        (row.from || "").replace(/\t/g, " "),
        (row.to || "").replace(/\t/g, " "),
        (row.readyToClose || "").replace(/\t/g, " "),
        (row.ceilingAmount || "").replace(/\t/g, " "),
        (row.fee || "").replace(/\t/g, " "),
        (row.required || "").replace(/\t/g, " "),
        (row.actual || "").replace(/\t/g, " "),
        (row.notes || "").replace(/\t/g, " ").replace(/\r?\n/g, " "),
      ].join("\t"),
    );

    const tsvString = [headerLine, ...dataLines].join("\n");

    try {
      await navigator.clipboard.writeText(tsvString);
      setCanPaste(true);
      toast.success(`${selectedData.length} row(s) copied.`);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = tsvString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCanPaste(true);
      toast.success(`${selectedData.length} row(s) copied.`);
    }
  };

  // ==========================================================
  // PASTE
  // ==========================================================

  const handlePaste = async (
    targetSection = "costType",
    clipboardText = null,
  ) => {
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
    const parsedRows = [];

    rawLines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      if (isSchedOHeaderLine(trimmedLine)) {
        return;
      }

      const cols = line.split("\t");
      const newId = `${targetSection}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const row = createEmptyRow(newId);

      row.contractNo = cols[0] ? cols[0].trim() : "";
      row.orderNo = cols[1] ? cols[1].trim() : "";
      row.from = cols[2] ? normalizeDateForInput(cols[2]) : "";
      row.to = cols[3] ? normalizeDateForInput(cols[3]) : "";
      row.readyToClose = cols[4]
        ? cols[4].trim().toUpperCase().startsWith("Y")
          ? "Y"
          : "N"
        : "";
      row.ceilingAmount = cols[5] ? cols[5].replace(/[^0-9.]/g, "") : "";
      row.fee = cols[6] ? cols[6].replace(/[^0-9.]/g, "") : "";
      row.required = cols[7] ? cols[7].replace(/[^0-9.]/g, "") : "";
      row.actual = cols[8] ? cols[8].replace(/[^0-9.]/g, "") : "";
      row.notes = cols[9] ? cols[9].trim() : "";

      parsedRows.push(row);
    });

    if (parsedRows.length === 0) {
      toast.warning("No valid data rows found to paste.");
      return;
    }

    if (targetSection === "timeMaterial") {
      setTimeMaterialRows((current) => [...current, ...parsedRows]);
    } else {
      setCostTypeRows((current) => [...current, ...parsedRows]);
    }

    setSelectedRows([]);
    toast.success(`${parsedRows.length} row(s) pasted.`);
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
        if (selectedRows.length > 0) {
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
      handlePaste("costType", pastedText);
    }
  };

  // ==========================================================
  // DELETE SELECTED ROWS
  // ==========================================================

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      return;
    }

    const year = getYear();
    const selectedCostRows = costTypeRows.filter((r) =>
      selectedRows.includes(r.id),
    );
    const selectedTmRows = timeMaterialRows.filter((r) =>
      selectedRows.includes(r.id),
    );

    const deletePayload = [
      ...selectedCostRows
        .filter((r) => r.contractNo)
        .map((r) => ({
          year: year,
          projType: "CostType",
          contractNo: r.contractNo.trim(),
          orderNo: r.orderNo?.trim() || "N/A",
        })),
      ...selectedTmRows
        .filter((r) => r.contractNo)
        .map((r) => ({
          year: year,
          projType: "TimeAndMaterials",
          contractNo: r.contractNo.trim(),
          orderNo: r.orderNo?.trim() || "N/A",
        })),
    ];

    if (deletePayload.length > 0) {
      try {
        const res = await fetch(`${BASE_URL}/api/ScheduleO/bulk-delete`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(deletePayload),
        });
        if (res.ok) {
          toast.success("Selected row(s) deleted successfully.");
        } else {
          toast.error("Failed to delete selected row(s).");
        }
      } catch (err) {
        console.warn("Backend Schedule O delete error:", err);
        toast.error("Network error while deleting row(s).");
      }
    } else {
      toast.success("Selected row(s) deleted.");
    }

    setCostTypeRows((currentRows) =>
      currentRows.filter((row) => !selectedRows.includes(row.id)),
    );

    setTimeMaterialRows((currentRows) =>
      currentRows.filter((row) => !selectedRows.includes(row.id)),
    );

    setSelectedRows([]);
  };

  // ==========================================================
  // CLEAR
  // ==========================================================

  const handleClear = async () => {
    if (selectedRows.length > 0) {
      setCostTypeRows((currentRows) =>
        currentRows.map((row) =>
          selectedRows.includes(row.id) ? createEmptyRow(row.id) : row,
        ),
      );

      setTimeMaterialRows((currentRows) =>
        currentRows.map((row) =>
          selectedRows.includes(row.id) ? createEmptyRow(row.id) : row,
        ),
      );

      setSelectedRows([]);
      toast.info("Selected row(s) cleared.");
      return;
    }

    await fetchScheduleOData();
    setSelectedRows([]);
    toast.info("All unsaved changes cleared.");
  };

  // ==========================================================
  // SAVE
  // ==========================================================

  const handleSave = async () => {
    const year = getYear();

    const costPayload = costTypeRows
      .filter((r) => r.contractNo && r.contractNo.trim() !== "")
      .map((r) => ({
        year: year,
        projType: "CostType",
        contractNo: r.contractNo.trim(),
        orderNo: r.orderNo?.trim() || "N/A",
        popStartDt: r.from || null,
        popEndDt: r.to || null,
        readyToCloseFl: r.readyToClose === "Y" || r.readyToClose === true,
        cntrCeilingAmt: r.ceilingAmount
          ? parseFloat(r.ceilingAmount) || null
          : null,
        feeAmt: r.fee ? parseFloat(r.fee) || null : null,
        reqHrs: r.required ? parseInt(r.required, 10) || null : null,
        actualHrs: r.actual ? parseInt(r.actual, 10) || null : null,
        notes: r.notes || "",
      }));

    const tmPayload = timeMaterialRows
      .filter((r) => r.contractNo && r.contractNo.trim() !== "")
      .map((r) => ({
        year: year,
        projType: "TimeAndMaterials",
        contractNo: r.contractNo.trim(),
        orderNo: r.orderNo?.trim() || "N/A",
        popStartDt: r.from || null,
        popEndDt: r.to || null,
        readyToCloseFl: r.readyToClose === "Y" || r.readyToClose === true,
        cntrCeilingAmt: r.ceilingAmount
          ? parseFloat(r.ceilingAmount) || null
          : null,
        feeAmt: r.fee ? parseFloat(r.fee) || null : null,
        reqHrs: r.required ? parseInt(r.required, 10) || null : null,
        actualHrs: r.actual ? parseInt(r.actual, 10) || null : null,
        notes: r.notes || "",
      }));

    const totalPayload = [...costPayload, ...tmPayload];

    if (totalPayload.length > 0) {
      try {
        const response = await fetch(`${BASE_URL}/api/ScheduleO/bulk-upsert`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(totalPayload),
        });
        if (response.ok) {
          toast.success("Schedule O saved successfully!");
        } else {
          const errJson = await response.json().catch(() => ({}));
          toast.error(errJson.message || "Failed to save Schedule O records.");
        }
      } catch (err) {
        console.warn("Save Schedule O error:", err);
        toast.error("Network error while saving Schedule O.");
      }
    } else {
      toast.info("Schedule O saved locally.");
    }

    setSavedState({
      costTypeRows: [...costTypeRows],
      timeMaterialRows: [...timeMaterialRows],
    });

    setSelectedRows([]);
  };

  // ==========================================================
  // UNSAVED CHANGES
  // ==========================================================

  const currentStateString = JSON.stringify({
    costTypeRows,
    timeMaterialRows,
  });

  const savedStateString = JSON.stringify(savedState);

  const hasUnsavedChanges = currentStateString !== savedStateString;

  // ==========================================================
  // FORMAT FISCAL YEAR END
  // ==========================================================

  const formattedFiscalYearEnd = fiscalYearEnd
    ? new Date(`${fiscalYearEnd}T00:00:00`).toLocaleDateString("en-US")
    : "";

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="schedule-o"
      onKeyDown={handleContainerKeyDown}
      onPaste={handleContainerPaste}
    >
      <style>{`

        /* ====================================================
           MAIN CONTAINER
           ==================================================== */

        .schedule-o {
          width: 100%;
          min-width: 1100px;

          box-sizing: border-box;

          padding: 8px;

          background: #eef8fc;

          color: #0d3d55;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .schedule-o *,
        .schedule-o *::before,
        .schedule-o *::after {
          box-sizing: border-box;
        }


        /* ====================================================
           SCHEDULE O HEADER
           ==================================================== */

        .schedule-o-page-heading {
          position: relative;

          width: 100%;

          padding: 3px 0 8px;

          background: #ffffff;

          color: #000000;

          text-align: center;
        }


        /* ====================================================
           SCHEDULE O LABEL
           ==================================================== */

        .schedule-o-title-top {
          position: absolute;

          top: 2px;
          right: 8px;

          font-size: 12px;

          font-weight: 700;

          line-height: 1;
        }


        /* ====================================================
           COMPANY BANNER
           ==================================================== */

        .company-banner {
          width: 340px;

          margin: 12px auto 0;

          padding: 4px 7px;

          background: #ffff00;

          color: #000000;

          text-align: center;

          font-size: 13px;

          font-weight: 700;

          line-height: 1.15;
        }


        /* ====================================================
           TITLE
           ==================================================== */

        .title {
          width: 600px;

          margin: 13px auto 0;

          color: #000000;

          text-align: center;

          font-size: 14px;

          font-weight: 700;

          line-height: 1.1;
        }

        .subtitle {
          margin-top: 2px;

          font-size: 13px;
        }


        /* ====================================================
           FISCAL YEAR END
           ==================================================== */

        .fy-banner {
          display: flex;

          align-items: center;

          justify-content: center;

          width: 340px;

          height: 23px;

          margin: 2px auto 0;

          padding: 2px 5px;

          background: #ffff00;

          color: #000000;

          font-size: 13px;

          font-weight: 700;
        }

        .fy-date {
          width: 112px;

          height: 19px;

          margin-left: 3px;

          padding: 0 2px;

          border: 0;

          outline: none;

          background: #ffff00;

          color: #000000;

          font-size: 13px;

          font-weight: 700;

          cursor: pointer;
        }

        .fy-date:focus {
          outline: 1px solid #777777;

          outline-offset: 1px;
        }


        /* ====================================================
           MAIN CARD
           ==================================================== */

        .schedule-o-card {
          width: 100%;

          background: #ffffff;

          border: 1px solid #c8dce5;

          border-radius: 6px;

          padding: 7px 9px 8px;

          box-shadow:
            0 1px 3px
            rgba(
              20,
              70,
              90,
              0.08
            );
        }


        /* ====================================================
           TOP TOOLBAR
           ==================================================== */

        .schedule-o-toolbar {
          display: flex;

          align-items: center;

          justify-content: space-between;

          min-height: 34px;

          margin-bottom: 6px;
        }

        .schedule-o-heading {
          display: flex;

          align-items: center;

          color: #103f50;

          font-size: 14px;

          font-weight: 700;
        }

        .schedule-o-heading-text {
          white-space: nowrap;
        }


        /* ====================================================
           MAIN BUTTONS
           ==================================================== */

        .schedule-o-actions {
          display: flex;

          align-items: center;

          gap: 6px;
        }

        .schedule-o-btn {
          min-width: 68px;

          height: 30px;

          border: none;

          border-radius: 16px;

          padding: 0 15px;

          background: #103f50;

          color: #ffffff;

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;

          transition:
            transform 0.12s ease,
            filter 0.12s ease;
        }

        .schedule-o-btn:hover {
          filter: brightness(1.08);

          transform:
            translateY(-1px);
        }

        .schedule-o-btn.delete {
          background: #e99aa1;
        }

        .schedule-o-btn:disabled {
          opacity: 0.5;

          cursor: not-allowed;

          transform: none;
        }


        /* ====================================================
           TABLE WRAPPER
           ==================================================== */

        .schedule-o-table-wrap {
          width: 100%;

          overflow-x: auto;

          border: 1px solid #c4dce7;

          border-radius: 4px;

          background: #ffffff;
        }


        /* ====================================================
           TABLE
           ==================================================== */

        .schedule-o-table {
          width: 100%;

          min-width: 1080px;

          border-collapse: separate;

          border-spacing: 0;

          table-layout: fixed;

          color: #103f50;
        }


        /* ====================================================
           TABLE BORDERS
           ==================================================== */

        .schedule-o-table th,
        .schedule-o-table td {
          border-right:
            1px solid #d3e3ea;

          border-bottom:
            1px solid #d3e3ea;
        }

        .schedule-o-table th:last-child,
        .schedule-o-table td:last-child {
          border-right: none;
        }


        /* ====================================================
           TABLE HEADER
           ==================================================== */

        .schedule-o-table thead th {
          height: 33px;

          padding: 3px 5px;

          background: #e8f5fa;

          color: #08405b;

          font-size: 10px;

          line-height: 1.05;

          font-weight: 700;

          text-align: center;

          vertical-align: middle;
        }

        .schedule-o-table thead tr:first-child th {
          border-bottom:
            1px solid #c4dce7;
        }

        .schedule-o-table thead tr:nth-child(2) th {
          height: 27px;

          background: #f0f8fb;

          font-size: 10px;
        }


        /* ====================================================
           SELECT COLUMN
           ==================================================== */

        .schedule-o-table .select-head,
        .schedule-o-table .select-cell {
          width: 38px;

          text-align: center;
        }


        /* ====================================================
           CHECKBOX
           ==================================================== */

        .schedule-o-check {
          width: 14px;

          height: 14px;

          margin: 0;

          cursor: pointer;

          accent-color: #147da5;
        }


        /* ====================================================
           DATA ROW
           ==================================================== */

        .schedule-o-table tbody td {
          height: 34px;

          padding: 2px 4px;

          background: #ffffff;

          vertical-align: middle;
        }

        .schedule-o-table tbody tr:hover td {
          background: #f8fcfe;
        }


        /* ====================================================
           INPUT
           ==================================================== */

        .schedule-o-input {
          width: 100%;

          height: 27px;

          border: 1px solid #c5d9e2;

          border-radius: 4px;

          outline: none;

          padding: 2px 6px;

          background: #ffffff;

          color: #173f51;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 11px;
        }

        .schedule-o-input:focus {
          border-color: #55a5c5;

          box-shadow:
            0 0 0 2px
            rgba(
              65,
              155,
              193,
              0.10
            );
        }

        .schedule-o-date {
          padding-right: 2px;
        }


        /* ====================================================
           REMOVE NUMBER INPUT ARROWS
           ==================================================== */

        .schedule-o-input[type="number"]::-webkit-inner-spin-button,
        .schedule-o-input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .schedule-o-input[type="number"] {
          -moz-appearance: textfield;
        }


        /* ====================================================
           SECTION ROW
           ==================================================== */

        .schedule-o-section-row td {
          height: auto;

          padding: 0;

          background: #ffffff;

          border-right: none;

          border-bottom: none;
        }


        /* ====================================================
           SECTION HEADER
           ==================================================== */

        .schedule-o-section-heading {
          display: flex;

          align-items: center;

          gap: 7px;

          min-height: 30px;

          padding: 3px 6px;

          background: #f4f9fb;

          border-left:
            3px solid #147da5;

          border-bottom:
            1px solid #d5e5eb;

          color: #173f51;

          font-family:
            "Times New Roman",
            Times,
            serif;

          font-size: 14px;

          font-style: italic;

          font-weight: 700;
        }


        /* ====================================================
           SECTION NEW BUTTON
           ==================================================== */

        .schedule-o-section-btn {
          height: 22px;

          padding: 0 9px;

          border: none;

          border-radius: 4px;

          background: #103f50;

          color: #ffffff;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 10px;

          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.12s ease,
            transform 0.12s ease;
        }

        .schedule-o-section-btn:hover {
          background: #15566d;

          transform:
            translateY(-1px);
        }


        /* ====================================================
           COST TYPE LABEL
           ==================================================== */

        .schedule-o-section-name {
          padding: 3px 6px 4px;

          background: #ffffff;

          color: #1b1b1b;

          font-family:
            "Times New Roman",
            Times,
            serif;

          font-size: 13px;

          font-weight: 700;
        }


        /* ====================================================
           EMPTY STATE
           ==================================================== */

        .schedule-o-empty {
          height: 34px;

          text-align: center;

          color: #71838c;

          font-size: 11px;
        }


        /* ====================================================
           FOOTER
           ==================================================== */

        .schedule-o-footnote {
          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-top: 5px;

          color: #647983;

          font-size: 10px;
        }

        .schedule-o-saved {
          color: #3f6878;
        }


        /* ====================================================
           COLUMN WIDTHS
           ==================================================== */

        .schedule-o-table col:nth-child(1) {
          width: 38px;
        }

        .schedule-o-table col:nth-child(2) {
          width: 12%;
        }

        .schedule-o-table col:nth-child(3) {
          width: 9%;
        }

        .schedule-o-table col:nth-child(4) {
          width: 8%;
        }

        .schedule-o-table col:nth-child(5) {
          width: 8%;
        }

        .schedule-o-table col:nth-child(6) {
          width: 9%;
        }

        .schedule-o-table col:nth-child(7) {
          width: 12%;
        }

        .schedule-o-table col:nth-child(8) {
          width: 8%;
        }

        .schedule-o-table col:nth-child(9) {
          width: 8%;
        }

        .schedule-o-table col:nth-child(10) {
          width: 8%;
        }

        .schedule-o-table col:nth-child(11) {
          width: 10%;
        }


        /* ====================================================
           RESPONSIVE
           ==================================================== */

        @media (max-width: 1200px) {

          .schedule-o {
            min-width: 0;
          }

          .schedule-o-card {
            min-width: 0;
          }

          .schedule-o-toolbar {
            align-items: center;
          }

          .schedule-o-heading-text {
            white-space: normal;
          }

        }

      `}</style>

      {/* ====================================================
          SCHEDULE O HEADER
          ==================================================== */}

      <div className="schedule-o-page-heading">
        <div className="schedule-o-title-top">SCHEDULE O</div>

        <div className="company-banner">
          <div>{companyName}</div>

          <div>{companyAddress}</div>
        </div>

        <div className="title">
          <div>Schedule of Contract Closing Information</div>

          <div className="subtitle">
            for those Contracts which Work Effort was Completed During
          </div>
        </div>

        <div className="fy-banner">
          <span>Fiscal Year End -</span>

          <input
            type="date"
            value={fiscalYearEnd}
            onChange={(event) => setFiscalYearEnd(event.target.value)}
            className="fy-date"
            aria-label="Fiscal Year End"
          />
        </div>
      </div>

      {/* ====================================================
          MAIN CARD
          ==================================================== */}

      <div className="schedule-o-card">
        {/* ==================================================
            TOP TOOLBAR
            ================================================== */}

        <div className="schedule-o-toolbar">
          <div className="schedule-o-heading">
            <span className="schedule-o-heading-text">
              Contract Closing Information
            </span>
          </div>

          <div className="schedule-o-actions">
            <button
              type="button"
              className="schedule-o-btn"
              onClick={handleCopy}
              disabled={selectedRows.length === 0}
            >
              Copy
            </button>

            <button
              type="button"
              className="schedule-o-btn"
              onClick={() => handlePaste("costType")}
              disabled={!canPaste}
            >
              Paste
            </button>

            <button
              type="button"
              className="schedule-o-btn delete"
              onClick={handleDelete}
              disabled={selectedRows.length === 0}
            >
              Delete
            </button>

            <button
              type="button"
              className="schedule-o-btn"
              onClick={handleClear}
              disabled={
                costTypeRows.length === 0 && timeMaterialRows.length === 0
              }
            >
              Clear
            </button>

            <button
              type="button"
              className="schedule-o-btn"
              onClick={handleSave}
              disabled={
                costTypeRows.length === 0 && timeMaterialRows.length === 0
              }
            >
              Save
            </button>
          </div>
        </div>

        {/* ==================================================
            TABLE
            ================================================== */}

        <div className="schedule-o-table-wrap">
          <table className="schedule-o-table">
            <colgroup>
              <col style={{ width: "38px" }} />

              <col style={{ width: "12%" }} />

              <col style={{ width: "9%" }} />

              <col style={{ width: "8%" }} />

              <col style={{ width: "8%" }} />

              <col style={{ width: "9%" }} />

              <col style={{ width: "12%" }} />

              <col style={{ width: "8%" }} />

              <col style={{ width: "8%" }} />

              <col style={{ width: "8%" }} />

              <col style={{ width: "10%" }} />
            </colgroup>

            {/* =================================================
                TABLE HEADER
                ================================================= */}

            <thead>
              <tr>
                <th rowSpan="2" className="select-head">
                  <input
                    type="checkbox"
                    className="schedule-o-check"
                    aria-label="Select all rows"
                    checked={allSelected}
                    onChange={(event) => toggleAll(event.target.checked)}
                  />
                </th>

                <th rowSpan="2">CONTRACT NO.</th>

                <th rowSpan="2">ORDER NO.</th>

                <th colSpan="2">PERFORMANCE PERIOD</th>

                <th rowSpan="2">
                  READY TO
                  <br />
                  CLOSE (1)
                </th>

                <th rowSpan="2">
                  CONTRACT CEILING
                  <br />
                  AMOUNT (2)
                </th>

                <th rowSpan="2">FEE (3)</th>

                <th colSpan="2">
                  LEVEL OF EFFORT
                  <br />
                  CUMULATIVE HOURS
                </th>

                <th rowSpan="2">NOTES</th>
              </tr>

              <tr>
                <th>From</th>

                <th>To</th>

                <th>Required</th>

                <th>Actual</th>
              </tr>
            </thead>

            {/* =================================================
                TABLE BODY
                ================================================= */}

            <tbody>
              {/* =================================================
                  COST TYPE HEADER
                  ================================================= */}

              <tr className="schedule-o-section-row">
                <td colSpan="11">
                  <div className="schedule-o-section-heading">
                    <button
                      type="button"
                      className="schedule-o-section-btn"
                      onClick={handleNewCostType}
                    >
                      + New
                    </button>

                    <span>Cost Type:</span>
                  </div>
                </td>
              </tr>

              {/* COST TYPE NAME */}

              <tr className="schedule-o-section-row">
                <td colSpan="11" className="schedule-o-section-name">
                  NONE
                </td>
              </tr>

              {/* =================================================
                  COST TYPE ROWS
                  ================================================= */}

              {costTypeRows.map((row) => (
                <tr key={row.id}>
                  <td className="select-cell">
                    <input
                      type="checkbox"
                      className="schedule-o-check"
                      aria-label="Select cost type row"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                    />
                  </td>

                  {COLUMNS.map((column) => (
                    <td key={column.key}>
                      <input
                        type={
                          column.type || (column.numeric ? "number" : "text")
                        }
                        inputMode={column.numeric ? "decimal" : undefined}
                        min={column.numeric ? "0" : undefined}
                        step={column.numeric ? "any" : undefined}
                        className={`
                              schedule-o-input
                              ${column.type === "date" ? "schedule-o-date" : ""}
                            `}
                        aria-label={column.label}
                        value={row[column.key]}
                        onChange={(event) => {
                          if (column.numeric) {
                            handleNumericChange(
                              "costType",
                              row.id,
                              column.key,
                              event.target.value,
                            );
                          } else {
                            updateRow(
                              "costType",
                              row.id,
                              column.key,
                              event.target.value,
                            );
                          }
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}

              {/* =================================================
                  TIME & MATERIAL HEADER
                  ================================================= */}

              <tr className="schedule-o-section-row">
                <td colSpan="11">
                  <div className="schedule-o-section-heading">
                    <button
                      type="button"
                      className="schedule-o-section-btn"
                      onClick={handleNewTimeMaterial}
                    >
                      + New
                    </button>

                    <button
                      type="button"
                      className="schedule-o-section-btn"
                      onClick={() => handlePaste("timeMaterial")}
                      disabled={!canPaste}
                      style={{ marginLeft: "4px" }}
                    >
                      Paste
                    </button>

                    <span>Time &amp; Material</span>
                  </div>
                </td>
              </tr>

              {/* =================================================
                  TIME & MATERIAL ROWS
                  ================================================= */}

              {timeMaterialRows.map((row) => (
                <tr key={row.id}>
                  <td className="select-cell">
                    <input
                      type="checkbox"
                      className="schedule-o-check"
                      aria-label="Select time and material row"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                    />
                  </td>

                  {COLUMNS.map((column) => (
                    <td key={column.key}>
                      <input
                        type={
                          column.type || (column.numeric ? "number" : "text")
                        }
                        inputMode={column.numeric ? "decimal" : undefined}
                        min={column.numeric ? "0" : undefined}
                        step={column.numeric ? "any" : undefined}
                        className={`
                              schedule-o-input
                              ${column.type === "date" ? "schedule-o-date" : ""}
                            `}
                        aria-label={column.label}
                        value={row[column.key]}
                        onChange={(event) => {
                          if (column.numeric) {
                            handleNumericChange(
                              "timeMaterial",
                              row.id,
                              column.key,
                              event.target.value,
                            );
                          } else {
                            updateRow(
                              "timeMaterial",
                              row.id,
                              column.key,
                              event.target.value,
                            );
                          }
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}

              {/* =================================================
                  EMPTY STATE
                  ================================================= */}

              {costTypeRows.length === 0 && timeMaterialRows.length === 0 && (
                <tr>
                  <td colSpan="11" className="schedule-o-empty">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ==================================================
            FOOTER
            ================================================== */}

        <div className="schedule-o-footnote">
          <span>Fiscal Year End - {formattedFiscalYearEnd}</span>

          <span className="schedule-o-saved">
            {hasUnsavedChanges ? "Unsaved changes" : "Ready"}
          </span>
        </div>
      </div>
    </div>
  );
}
