import React, { useState, useEffect, useCallback, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar } from "lucide-react";
import { backendUrl } from "../config";

// const BASE_URL = backendUrl || "https://localhost:58652";

// const BASE_URL = "https://localhost:58652" || backendUrl ;

const BASE_URL = backendUrl;

const SUPPLB_COMPENSATION_STORAGE_KEY = "supplb-compensation-rows";

const SUPPLB_COPY_HEADERS = [
  "FY",
  "POSITION",
  "SALES SCOPE",
  "% TIME DIRECT",
  "BASE SALARY",
  "BONUS",
  "401(k) MATCH",
  "HEALTH/LIFE INS.",
  "AUTO ALLOW.",
  "DEFERRED COMP.",
  "LTI",
  "OTHER*",
  "VOL. DELS.",
  "PROPOSED COMP.",
];

const isSupplBHeaderLine = (line) => {
  const upper = line.toUpperCase().trim();
  if (!upper) return true;
  if (
    upper.includes("BASE SALARY") ||
    upper.includes("SALES SCOPE") ||
    upper.includes("TIME DIRECT") ||
    upper.includes("PROPOSED COMP") ||
    upper.includes("401(K)") ||
    upper.includes("COMPENSATION DATA") ||
    upper.includes("POSITION")
  ) {
    return true;
  }
  return false;
};

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseNumeric = (val) => {
  if (val === null || val === undefined || val === "") return null;
  const clean = String(val).replace(/[$,]/g, "").trim();
  const num = parseFloat(clean);
  return isNaN(num) ? null : num;
};

const parseInteger = (val) => {
  if (val === null || val === undefined || val === "") return null;
  const clean = String(val).replace(/[%$,]/g, "").trim();
  const num = parseInt(clean, 10);
  return isNaN(num) ? null : num;
};

const MONTH_NAMES = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

// Helper function to safely parse date string to Date object
const parseDate = (dateStr) => {
  if (!dateStr || String(dateStr).includes("#")) return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;
  if (typeof dateStr === "string") {
    const partsSlash = dateStr.split("/");
    if (partsSlash.length === 3) {
      const mm = parseInt(partsSlash[0], 10) - 1;
      const dd = parseInt(partsSlash[1], 10);
      let yyyy = parseInt(partsSlash[2], 10);
      if (yyyy < 100) yyyy += 2000;
      const d = new Date(yyyy, mm, dd);
      return isNaN(d.getTime()) ? null : d;
    }
    const partsDash = dateStr.split("-");
    if (partsDash.length === 3 && partsDash[0].length === 4) {
      const yyyy = parseInt(partsDash[0], 10);
      const mm = parseInt(partsDash[1], 10) - 1;
      const dd = parseInt(partsDash[2], 10);
      const d = new Date(yyyy, mm, dd);
      return isNaN(d.getTime()) ? null : d;
    }
  }
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

const formatDateToISO = (date) => {
  if (!date) return "";
  if (typeof date === "string") {
    if (date.includes("T")) return date.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return date;
  }
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function SupplB({ companyName, companyAddress, fiscalYearEnd }) {
  // const [fiscalYearEnd, setFiscalYearEnd] = useState(() => `${fiscalYearEnd}`);
  const [contractorName, setContractorName] = useState("");

  const [contractorRows, setContractorRows] = useState([
    {
      type: "PRIMARY",
      sicCode: "",
      sicDescription: "",
      year: "",
      sales: "",
      govtPercent: "",
      advPercent: "",
      employees: "",
    },
    {
      type: "SECONDARY",
      sicCode: "",
      sicDescription: "",
      year: "",
      sales: "",
      govtPercent: "",
      advPercent: "",
      employees: "",
    },
  ]);

  const [rows, setRows] = useState([]);

  const [selectedCompensationRows, setSelectedCompensationRows] = useState([]);
  const [savedCompensation, setSavedCompensation] = useState(false);

  // Basis of Contractor's Compensation state (Supports multiple checkboxes)
  const [basisState, setBasisState] = useState({
    market: false,
    dcaa: false,
    writtenPlan: false,
    consultant: false,
    management: false,
    other: false,
    board: false,
    jobDescriptionsYes: false,
    jobDescriptionsNo: false,
  });
  const [basisOtherText, setBasisOtherText] = useState("");

  const markUnsaved = () => {
    setSavedCompensation(false);
  };

  // Derive target fiscal year only from fiscalYearEnd date to avoid re-fetching on typing
  const currentFiscalYear = useMemo(() => {
    if (fiscalYearEnd) {
      const d = parseDate(fiscalYearEnd);
      if (d && !isNaN(d.getFullYear()) && d.getFullYear() > 1900) {
        return d.getFullYear();
      }
      if (typeof fiscalYearEnd === "string") {
        const match = fiscalYearEnd.match(/\b(19\d\d|20\d\d)\b/);
        if (match) return parseInt(match[1], 10);
      }
    }
    return new Date().getFullYear();
  }, [fiscalYearEnd]);

  // ----------------------------------------------------
  // FETCH FROM BACKEND API (Triggered ONLY when Year changes)
  // ----------------------------------------------------
  const fetchData = useCallback(
    async (yearToFetch) => {
      const year = yearToFetch || currentFiscalYear;
      if (!year) {
        setContractorName("");
        setContractorRows([
          {
            type: "PRIMARY",
            sicCode: "",
            sicDescription: "",
            year: "",
            sales: "",
            govtPercent: "",
            advPercent: "",
            employees: "",
          },
          {
            type: "SECONDARY",
            sicCode: "",
            sicDescription: "",
            year: "",
            sales: "",
            govtPercent: "",
            advPercent: "",
            employees: "",
          },
        ]);
        setBasisState({
          market: false,
          dcaa: false,
          writtenPlan: false,
          consultant: false,
          management: false,
          other: false,
          board: false,
          jobDescriptionsYes: false,
          jobDescriptionsNo: false,
        });
        setBasisOtherText("");
        setRows([]);
        return;
      }
      try {
        // 1. Fetch Header Data
        const hdrRes = await fetch(
          `${BASE_URL}/api/SupplBHdr/get-by-year?year=${year}`,
          {
            headers: getAuthHeaders(),
          },
        );

        if (hdrRes.ok) {
          const hdr = await hdrRes.json();
          if (hdr) {
            setContractorName(hdr.cntrName || "");
            if (hdr.cntrYear) {
              const d = parseDate(hdr.cntrYear);
              if (d && !isNaN(d.getTime())) {
                setFiscalYearEnd(formatDateToString(d));
              }
            }

            setContractorRows([
              {
                type: "PRIMARY",
                sicCode: hdr.primaryNaicsCd || "",
                sicDescription: hdr.primaryNaicsDesc || "",
                year: String(hdr.year || year),
                sales: hdr.salesAmt != null ? String(hdr.salesAmt) : "",
                govtPercent:
                  hdr.govtPercent != null ? String(hdr.govtPercent) : "",
                advPercent:
                  hdr.advPercent != null ? String(hdr.advPercent) : "",
                employees:
                  hdr.emplYsPercent != null ? String(hdr.emplYsPercent) : "",
              },
              {
                type: "SECONDARY",
                sicCode: hdr.secondNaicsCd || "",
                sicDescription: hdr.secondNaicsDesc || "",
                year: "",
                sales: "",
                govtPercent: "",
                advPercent: "",
                employees: "",
              },
            ]);

            setBasisState({
              market: !!hdr.marketPriceDataFl,
              writtenPlan: !!hdr.writtenCompPlanFl,
              management: !!hdr.managementJudgement,
              board: !!hdr.determinedByBodFl,
              dcaa: !!hdr.priorDcaaAuditFl,
              consultant: !!hdr.thirdPartyCompFl,
              other: !!hdr.other,
              jobDescriptionsYes: hdr.jobDescFl === true,
              jobDescriptionsNo: hdr.jobDescFl === false,
            });

            if (hdr.other) {
              setBasisOtherText(hdr.other);
            } else {
              setBasisOtherText("");
            }
          } else {
            setContractorName("");
          }
        } else {
          // When 404 or no header found for the requested year, clear out the fields
          setContractorName("");
          setContractorRows([
            {
              type: "PRIMARY",
              sicCode: "",
              sicDescription: "",
              year: String(year),
              sales: "",
              govtPercent: "",
              advPercent: "",
              employees: "",
            },
            {
              type: "SECONDARY",
              sicCode: "",
              sicDescription: "",
              year: "",
              sales: "",
              govtPercent: "",
              advPercent: "",
              employees: "",
            },
          ]);
          setBasisState({
            market: false,
            writtenPlan: false,
            management: false,
            board: false,
            dcaa: false,
            consultant: false,
            other: false,
            jobDescriptionsYes: false,
            jobDescriptionsNo: false,
          });
          setBasisOtherText("");
        }

        // 2. Fetch Detail Records
        const detlRes = await fetch(`${BASE_URL}/api/SupplBDetl?year=${year}`, {
          headers: getAuthHeaders(),
        });

        if (detlRes.ok) {
          const detls = await detlRes.json();
          if (Array.isArray(detls) && detls.length > 0) {
            const yearDetls = detls.filter(
              (d) => !d.year || Number(d.year) === Number(year),
            );
            const mappedRows = yearDetls.map((d) => ({
              fy: String(d.year || year),
              position: d.position || "",
              scope: d.salesAmt != null ? String(d.salesAmt) : "",
              direct:
                d.directTimePercent != null ? String(d.directTimePercent) : "",
              salary: d.baseSalAmt != null ? String(d.baseSalAmt) : "",
              bonus: "",
              match: d.employer401Amt != null ? String(d.employer401Amt) : "",
              insurance:
                d.healthLifeInsAmt != null ? String(d.healthLifeInsAmt) : "",
              auto: d.autoAllowAmt != null ? String(d.autoAllowAmt) : "",
              deferred:
                d.deferredCompAmt != null ? String(d.deferredCompAmt) : "",
              lti: d.ltiAmt != null ? String(d.ltiAmt) : "",
              other: d.otherAmt != null ? String(d.otherAmt) : "",
              dels: d.volDelsAmt != null ? String(d.volDelsAmt) : "",
              proposed:
                d.proposedCompAmt != null ? String(d.proposedCompAmt) : "",
            }));

            setRows(mappedRows);
          } else {
            setRows([]);
          }
        } else {
          setRows([]);
        }
      } catch (err) {
        console.warn("Could not fetch Supplemental B data from backend:", err);
      }
    },
    [currentFiscalYear],
  );

  // Initial load only
  useEffect(() => {
    fetchData(currentFiscalYear);
  }, [currentFiscalYear]);

  const updateContractor = (index, key, value) => {
    let sanitizedValue = value;
    if (key === "year") {
      sanitizedValue = value.replace(/\D/g, "").slice(0, 4);
    } else if (
      ["sales", "govtPercent", "advPercent", "employees"].includes(key)
    ) {
      sanitizedValue = value.replace(/[^\d.,$-]/g, "");
    }
    setContractorRows((current) =>
      current.map((row, i) =>
        i === index ? { ...row, [key]: sanitizedValue } : row,
      ),
    );
    markUnsaved();
  };

  const updateRow = (index, key, value) => {
    let sanitizedValue = value;
    if (key === "fy") {
      sanitizedValue = value.replace(/\D/g, "").slice(0, 4);
    } else if (key !== "position") {
      // Don't let SALES SCOPE or numeric compensation columns accept alphabetic characters
      sanitizedValue = value.replace(/[^\d.,$-]/g, "");
    }
    setRows((current) =>
      current.map((row, i) =>
        i === index ? { ...row, [key]: sanitizedValue } : row,
      ),
    );
    markUnsaved();
  };

  const toggleCompensationRow = (index) => {
    setSelectedCompensationRows((current) =>
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index],
    );
  };

  const toggleAllCompensationRows = () => {
    setSelectedCompensationRows((current) =>
      current.length === rows.length ? [] : rows.map((_, index) => index),
    );
  };

  const handleCopy = async () => {
    if (selectedCompensationRows.length === 0) {
      toast.warning("Please select at least one row to copy.");
      return;
    }

    const selectedData = selectedCompensationRows
      .map((idx) => rows[idx])
      .filter(Boolean);

    if (selectedData.length === 0) return;

    const headerLine = SUPPLB_COPY_HEADERS.join("\t");
    const dataLines = selectedData.map((r) =>
      [
        r.fy || "",
        r.position || "",
        r.scope || "",
        r.direct || "",
        r.salary || "",
        r.bonus || "",
        r.match || "",
        r.insurance || "",
        r.auto || "",
        r.deferred || "",
        r.lti || "",
        r.other || "",
        r.dels || "",
        r.proposed || "",
      ]
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
      toast.success(`${selectedData.length} row(s) copied.`);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = tsvString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success(`${selectedData.length} row(s) copied.`);
    }
  };

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
    const parsedRows = [];

    rawLines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || isSupplBHeaderLine(trimmedLine)) return;

      const cols = line.split("\t");
      const newRow = {
        fy: cols[0]
          ? cols[0].replace(/\D/g, "").slice(0, 4)
          : String(currentFiscalYear || ""),
        position: cols[1] ? cols[1].trim() : "",
        scope: cols[2] ? cols[2].replace(/[^\d.,$-]/g, "").trim() : "",
        direct: cols[3] ? cols[3].replace(/[^\d.,$-]/g, "").trim() : "",
        salary: cols[4] ? cols[4].replace(/[^\d.,$-]/g, "").trim() : "",
        bonus: cols[5] ? cols[5].replace(/[^\d.,$-]/g, "").trim() : "",
        match: cols[6] ? cols[6].replace(/[^\d.,$-]/g, "").trim() : "",
        insurance: cols[7] ? cols[7].replace(/[^\d.,$-]/g, "").trim() : "",
        auto: cols[8] ? cols[8].replace(/[^\d.,$-]/g, "").trim() : "",
        deferred: cols[9] ? cols[9].replace(/[^\d.,$-]/g, "").trim() : "",
        lti: cols[10] ? cols[10].replace(/[^\d.,$-]/g, "").trim() : "",
        other: cols[11] ? cols[11].replace(/[^\d.,$-]/g, "").trim() : "",
        dels: cols[12] ? cols[12].replace(/[^\d.,$-]/g, "").trim() : "",
        proposed: cols[13] ? cols[13].replace(/[^\d.,$-]/g, "").trim() : "",
      };

      parsedRows.push(newRow);
    });

    if (parsedRows.length === 0) {
      toast.warning("No valid data rows found to paste.");
      return;
    }

    setRows((current) => [...current, ...parsedRows]);
    setSelectedCompensationRows([]);
    markUnsaved();
    toast.success(`${parsedRows.length} row(s) pasted.`);
  };

  const handleTableKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");
      const hasTextSelection =
        window.getSelection() && window.getSelection().toString().length > 0;

      if (!isInputFocused || !hasTextSelection) {
        if (selectedCompensationRows.length > 0) {
          e.preventDefault();
          handleCopy();
        }
      }
    }
  };

  const handleTablePaste = (e) => {
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

  const addCompensationRow = () => {
    const defaultSalesScope = contractorRows[0]?.sales
      ? String(contractorRows[0].sales)
      : "";
    setRows((current) => [
      ...current,
      {
        fy: currentFiscalYear ? String(currentFiscalYear) : "",
        position: "",
        scope: defaultSalesScope,
        direct: "",
        salary: "",
        bonus: "",
        match: "",
        insurance: "",
        auto: "",
        deferred: "",
        lti: "",
        other: "",
        dels: "",
        proposed: "",
      },
    ]);
    markUnsaved();
  };

  const deleteCompensationRows = async () => {
    if (!selectedCompensationRows.length) return;

    const year = currentFiscalYear;
    const rowsToDelete = selectedCompensationRows
      .map((idx) => rows[idx])
      .filter((r) => r && r.position && r.position.trim() !== "");

    if (rowsToDelete.length > 0) {
      const deletePayload = rowsToDelete.map((r) => ({
        year: year,
        position: r.position.trim(),
      }));

      try {
        await fetch(`${BASE_URL}/api/SupplBDetl/bulk-delete`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(deletePayload),
        });
      } catch (err) {
        console.warn("Backend bulk delete error:", err);
      }
    }

    const selected = new Set(selectedCompensationRows);
    setRows((current) => current.filter((_, index) => !selected.has(index)));
    setSelectedCompensationRows([]);
    markUnsaved();
    toast.success("Selected row(s) deleted.");
  };

  const clearCompensationRows = async () => {
    if (selectedCompensationRows.length > 0) {
      const selected = new Set(selectedCompensationRows);
      setRows((current) =>
        current.map((row, index) =>
          selected.has(index)
            ? Object.fromEntries(Object.keys(row).map((key) => [key, ""]))
            : row,
        ),
      );
      setSelectedCompensationRows([]);
      markUnsaved();
      toast.info("Selected row(s) cleared.");
    } else {
      await fetchData(currentFiscalYear);
      setSelectedCompensationRows([]);
      setSavedCompensation(false);
      toast.info("All unsaved changes cleared.");
    }
  };

  // ----------------------------------------------------
  // SAVE (Header + Compensation Details)
  // ----------------------------------------------------
  const saveCompensation = async () => {
    const year = currentFiscalYear;

    // 1. Prepare Header Payload
    const hdrPayload = {
      year: year,
      cntrName: contractorName || null,
      primaryNaicsCd: contractorRows[0]?.sicCode || null,
      primaryNaicsDesc: contractorRows[0]?.sicDescription || null,
      secondNaicsCd: contractorRows[1]?.sicCode || null,
      secondNaicsDesc: contractorRows[1]?.sicDescription || null,
      cntrYear: fiscalYearEnd ? formatDateToISO(fiscalYearEnd) : null,
      salesAmt: parseNumeric(contractorRows[0]?.sales),
      govtPercent: parseInteger(contractorRows[0]?.govtPercent),
      advPercent: parseInteger(contractorRows[0]?.advPercent),
      emplYsPercent: parseInteger(contractorRows[0]?.employees),
      marketPriceDataFl: !!basisState.market,
      writtenCompPlanFl: !!basisState.writtenPlan,
      managementJudgement: !!basisState.management,
      determinedByBodFl: !!basisState.board,
      priorDcaaAuditFl: !!basisState.dcaa,
      thirdPartyCompFl: !!basisState.consultant,
      other: basisState.other ? basisOtherText || "" : null,
      jobDescFl: basisState.jobDescriptionsYes,
    };

    // 2. Prepare Detail Payload
    const validRows = rows.filter(
      (r) => r.position && r.position.trim() !== "",
    );
    const detlPayload = validRows.map((r) => {
      const baseSalary = parseNumeric(r.salary) || 0;
      const match = parseNumeric(r.match) || 0;
      const insurance = parseNumeric(r.insurance) || 0;
      const auto = parseNumeric(r.auto) || 0;
      const deferred = parseNumeric(r.deferred) || 0;
      const lti = parseNumeric(r.lti) || 0;
      const bonus = parseNumeric(r.bonus) || 0;
      const other = (parseNumeric(r.other) || 0) + bonus;
      const dels = parseNumeric(r.dels) || 0;

      let proposed = parseNumeric(r.proposed);
      if (proposed === null) {
        proposed =
          baseSalary + match + insurance + auto + deferred + lti + other - dels;
      }

      return {
        year: year,
        position: r.position.trim(),
        salesAmt: parseNumeric(r.scope),
        directTimePercent: parseInteger(r.direct),
        baseSalAmt: parseNumeric(r.salary),
        employer401Amt: parseNumeric(r.match),
        healthLifeInsAmt: parseNumeric(r.insurance),
        autoAllowAmt: parseNumeric(r.auto),
        deferredCompAmt: parseNumeric(r.deferred),
        ltiAmt: parseNumeric(r.lti),
        otherAmt: other > 0 ? other : parseNumeric(r.other),
        volDelsAmt: parseNumeric(r.dels),
        proposedCompAmt: proposed,
      };
    });

    try {
      // Save Header
      const hdrResponse = await fetch(`${BASE_URL}/api/SupplBHdr/upsert`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(hdrPayload),
      });

      let detlSuccess = true;
      if (detlPayload.length > 0) {
        const detlResponse = await fetch(
          `${BASE_URL}/api/SupplBDetl/bulk-upsert`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(detlPayload),
          },
        );
        detlSuccess = detlResponse.ok;
      }

      if (hdrResponse.ok && detlSuccess) {
        localStorage.setItem(
          SUPPLB_COMPENSATION_STORAGE_KEY,
          JSON.stringify(rows),
        );
        setSavedCompensation(true);
        setSelectedCompensationRows([]);
        window.setTimeout(() => setSavedCompensation(false), 2500);
        toast.success("Supplemental B saved successfully");
      } else {
        const errJson = await hdrResponse.json().catch(() => ({}));
        toast.error(
          errJson.message || "Failed to save Supplemental B records.",
        );
      }
    } catch (error) {
      console.error("Failed to save compensation rows:", error);
      toast.error("Network error while saving Supplemental B.");
    }
  };

  // Multiple checkboxes toggle support
  const toggleBasis = (key) => {
    setBasisState((current) => ({
      ...current,
      [key]: !current[key],
    }));
    markUnsaved();
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
    if (!/^[0-9/-]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const renderCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div
      style={{
        margin: 0,
        padding: "4px 8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#f0f6fa",
        borderBottom: "1px solid #c9dce8",
      }}
    >
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "13px",
          color: "#073b5c",
          padding: "0 4px",
        }}
      >
        ‹
      </button>
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <select
          value={date.getMonth()}
          onChange={({ target: { value } }) => changeMonth(Number(value))}
          style={{
            border: "1px solid #c9dce8",
            borderRadius: "3px",
            padding: "1px 4px",
            fontSize: "11px",
            fontWeight: "600",
            background: "#fff",
            color: "#073b5c",
          }}
        >
          {MONTH_NAMES.map((monthNum, index) => (
            <option key={index} value={index}>
              {monthNum}
            </option>
          ))}
        </select>
        <select
          value={date.getFullYear()}
          onChange={({ target: { value } }) => changeYear(Number(value))}
          style={{
            border: "1px solid #c9dce8",
            borderRadius: "3px",
            padding: "1px 4px",
            fontSize: "11px",
            fontWeight: "600",
            background: "#fff",
            color: "#073b5c",
          }}
        >
          {Array.from(
            { length: 40 },
            (_, i) => new Date().getFullYear() - 20 + i,
          ).map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "13px",
          color: "#073b5c",
          padding: "0 4px",
        }}
      >
        ›
      </button>
    </div>
  );

  return (
    <div
      className="supplb-page"
      onKeyDown={handleTableKeyDown}
      onPaste={handleTablePaste}
    >
      <style>{`
        * { box-sizing: border-box; }
        .supplb-page { min-height:100vh; background:#eef3f6; padding:5px 7px 12px; font-family:Arial,Helvetica,sans-serif; font-size:10px; color:#082f49; }
        .supplb-header { background:#fff; border:1px solid #c9dce8; border-radius:4px; padding:5px 8px 6px; margin-bottom:5px; }
        .supplb-company { width:330px; margin:0 auto 4px; background:#ffff00; color:#000; text-align:center; font:700 10px/1.1 Arial,Helvetica,sans-serif; padding:3px 6px; }
        .supplb-title { text-align:center; font:700 10px/1.15 Arial,sans-serif; color:#111; margin:2px auto 3px; max-width:1050px; }
        .supplb-fy { width:330px; margin:0 auto; background:#ffff00; height:23px; display:flex; align-items:center; justify-content:center; gap:4px; color:#000; font:700 10px Arial,Helvetica,sans-serif; }
        .supplb-fy input { width:115px; height:19px; border:0; background:#ffff00; font:700 10px Arial,Helvetica,sans-serif; color:#000; }
        .supplb-card { max-width:1500px; margin:0 auto; background:#fff; border:1px solid #c8dce8; border-radius:4px; overflow:hidden; box-shadow:0 1px 2px rgba(0,0,0,.05); }
        .supplb-main-heading { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:6px 9px; border-bottom:1px solid #c9dce8; background:#f8fbfd; }
        .supplb-main-title { font-weight:700; font-size:10px; color:#073b5c; }
        .supplb-section-heading { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:5px 9px; border-bottom:1px solid #c9dce8; background:#fff; }
        .supplb-section-title { font-size:10px; font-weight:700; color:#083d5b; }
        .supplb-actions { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
        .supplb-btn { border:0; border-radius:16px; min-width:68px; height:28px; padding:0 12px; font-weight:700; font-size:10px; color:#fff; background:#0c465b; cursor:pointer; }
        .supplb-btn:hover:not(:disabled) { filter:brightness(.94); }
        .supplb-btn:disabled { opacity:0.45; cursor:not-allowed; }
        .supplb-btn.delete { background:#f39a9d; }
        .supplb-status { font-size:11px; color:#24734a; margin-left:4px; font-weight:700; }
        .supplb-contractor-table-wrap { padding:0 8px 5px; border-bottom:1px solid #c9dce8; overflow-x:auto; }
        .supplb-contractor-table-title { padding-top:5px; margin-bottom:0; }
        .supplb-contractor-table { width:100%; min-width:0; border-collapse:separate; border-spacing:0; table-layout:fixed; }
        .supplb-contractor-table .contractor-label-col { width:16%; min-width:0; }
        .supplb-contractor-table .contractor-code-col { width:10%; min-width:0; }
        .supplb-contractor-table .contractor-description-col { width:27%; min-width:0; }
        .supplb-contractor-table .contractor-year-col { width:7%; min-width:0; }
        .supplb-contractor-table .contractor-sales-col { width:13%; min-width:0; }
        .supplb-contractor-table .contractor-percent-col { width:6%; min-width:0; }
        .supplb-contractor-table .contractor-employees-col { width:7%; min-width:0; }
        .supplb-contractor-table th { background:#dff1fa; border-right:1px solid #bdd5e3; border-bottom:1px solid #bdd5e3; padding:3px 4px; height:29px; font-size:10px; line-height:1.1; text-align:center; color:#073b5c; white-space:normal; }
        .supplb-contractor-table th:first-child { border-left:1px solid #bdd5e3; }
        .supplb-contractor-table td { border-right:1px solid #c8dce8; border-bottom:1px solid #c8dce8; padding:2px 4px; background:#fff; }
        .supplb-contractor-table td:first-child { border-left:1px solid #c8dce8; text-align:left; }
        .supplb-contractor-table .contractor-info-row th { height:29px; }
        .supplb-contractor-table .contractor-info-label { text-align:center; white-space:nowrap; }
        .supplb-contractor-table .contractor-info-value { padding:2px 4px; }
        .supplb-contractor-table .contractor-company-value { min-width:0; text-align:center; }
        .supplb-page input, .supplb-page button, .supplb-page select, .supplb-page textarea { font-family:Arial,Helvetica,sans-serif; font-size:10px; }
        .supplb-contractor-table .contractor-company-value .supplb-input { width:100%; min-width:0; white-space:nowrap; overflow:visible; text-overflow:clip; text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:10px; font-weight:700; }
        .supplb-contractor-table .contractor-info-value .supplb-input { text-align:left; }
        .supplb-contractor-table .contractor-company-value .supplb-input { text-align:center !important; font-family:Arial,Helvetica,sans-serif; font-size:10px !important; font-weight:700; }
        .supplb-contractor-table .react-datepicker-wrapper { width:100%; display:inline-block; }
        .supplb-contractor-table .react-datepicker__input-container { width:100%; display:flex; align-items:center; }
        .supplb-contractor-table .react-datepicker-popper { z-index:9999; }
        .supplb-contractor-table td:nth-child(4) .supplb-input { text-align:left; font-size:10px; padding-left:4px; padding-right:4px; }
        .supplb-contractor-table td .supplb-input { min-width:0; width:100%; height:23px; box-sizing:border-box; }
        .supplb-contractor-table tr.selected td { background:#f1f8fc; }
        .supplb-table-wrap { overflow-x:auto; border-bottom:1px solid #c9dce8; }
        .supplb-table { width:max-content; min-width:100%; border-collapse:separate; border-spacing:0; }
        .supplb-table th { background:#dff1fa; border-right:1px solid #bdd5e3; border-bottom:1px solid #bdd5e3; padding:3px 4px; height:29px; min-width:72px; font-size:10px; line-height:1.1; text-align:center; color:#073b5c; white-space:normal; }
        .supplb-table th:first-child { min-width:32px; width:32px; border-left:1px solid #bdd5e3; }
        .supplb-table td { border-right:1px solid #c8dce8; border-bottom:1px solid #c8dce8; padding:2px 4px; background:#fff; }
        .supplb-table td:first-child { border-left:1px solid #c8dce8; text-align:center; }
        .supplb-table tr.selected td { background:#f1f8fc; }
        .supplb-table td .supplb-input { min-width:62px; height:23px; box-sizing:border-box; }
        .supplb-table td.position .supplb-input { min-width:145px; }

        .supplb-check { display:flex; align-items:flex-start; gap:5px; font-size:10px; line-height:1.25; color:#163f54; margin:6px 0; }
        .supplb-check input { width:15px; height:15px; margin-top:0; accent-color:#0d8df5; }
        .supplb-basis-table { width:100%; border-collapse:collapse; table-layout:fixed; margin:4px 0 8px; }
        .supplb-basis-table td { border:1px solid #000; padding:2px 4px; height:22px; font-size:10px; line-height:1.1; color:#000; vertical-align:middle; }
        .supplb-basis-table .basis-check-cell { width:28px; text-align:center; padding:1px; }
        .supplb-basis-table .basis-check-cell input { width:13px; height:13px; margin:0; vertical-align:middle; cursor:pointer; }
        .supplb-basis-table .basis-label-cell { width:calc(50% - 28px); }
        .supplb-basis-table .basis-other-input { width:calc(100% - 38px); margin-left:5px; height:18px; border:0; border-bottom:1px solid #000; outline:none; background:#fff; font-size:10px; }
        .supplb-basis-table .basis-other-input:disabled { background:#f5f5f5; cursor:not-allowed; }
        .supplb-note { font-size:10px; line-height:1.3; color:#244c60; margin:4px 0 8px; }
        .supplb-footer-note { padding:6px 9px 9px; font-size:9px; color:#4b6471; }
        @media(max-width:900px){ .supplb-company,.supplb-fy{width:100%;max-width:330px;} .supplb-section-heading{align-items:flex-start;flex-direction:column;} .supplb-actions{width:100%;} }
        @media print { .supplb-page{padding:0;background:#fff}.supplb-card{border:0;box-shadow:none}.supplb-header{border:0} }
      `}</style>

      {/* ============================================================
          TOP HEADER
          ============================================================ */}
      <div className="supplb-header">
        <div className="supplb-company">
          <div>{companyName}</div>
          <div>{companyAddress}</div>
        </div>
        <div className="supplb-title">
          GENERAL ORGANIZATIONAL INFORMATION AND COMPENSATION FOR CERTAIN
          CONTRACTOR EMPLOYEES PER FAR 31/205-6(p)
        </div>
      </div>

      <div className="supplb-card">
        <div className="supplb-main-heading">
          <div className="supplb-main-title">
            Contractor Compensation Information
          </div>
        </div>

        {/* ============================================================
            SECTION 1: CONTRACTOR DATA (NO TOP BUTTONS AS PER ORIGINAL UI)
            ============================================================ */}
        <div className="supplb-section-heading">
          <div className="supplb-section-title">Contractor Data</div>
        </div>

        <div className="supplb-table-wrap">
          <table className="supplb-table supplb-contractor-table">
            <colgroup>
              <col className="contractor-label-col" />
              <col className="contractor-code-col" />
              <col className="contractor-description-col" />
              <col className="contractor-year-col" />
              <col className="contractor-sales-col" />
              <col className="contractor-percent-col" />
              <col className="contractor-percent-col" />
              <col className="contractor-employees-col" />
            </colgroup>
            <thead>
              <tr className="contractor-info-row">
                <th colSpan={2} className="contractor-info-label">
                  CONTRACTOR NAME:
                </th>
                <th
                  colSpan={3}
                  className="contractor-info-value contractor-company-value"
                >
                  <input
                    className="supplb-input"
                    value={contractorName || ""}
                    onChange={(e) => {
                      setContractorName(e.target.value);
                      markUnsaved();
                    }}
                  />
                </th>
                <th colSpan={2} className="contractor-info-label">
                  CONTRACTOR FYE (MM/DD/YYYY):
                </th>
                <th colSpan={3} className="contractor-info-value">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      height: "23px",
                      background: "#fff",
                      boxSizing: "border-box",
                      cursor: "pointer",
                    }}
                  >
                    <DatePicker
                      selected={parseDate(fiscalYearEnd)}
                      onChange={(date) => {
                        setFiscalYearEnd(date ? formatDateToString(date) : "");
                        markUnsaved();
                      }}
                      onChangeRaw={(e) => {
                        if (e?.target?.value !== undefined) {
                          setFiscalYearEnd(e.target.value);
                          markUnsaved();
                        }
                      }}
                      onKeyDown={handleDateKeyDown}
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="supplb-input"
                      renderCustomHeader={renderCustomHeader}
                    />
                    <Calendar
                      size={13}
                      color="#073b5c"
                      style={{
                        marginLeft: "4px",
                        flexShrink: 0,
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </th>
              </tr>
              <tr>
                <th>SIC/NAICS CODE:</th>
                <th>CODE</th>
                <th>SIC/NAICS CODE DESCRIPTION</th>
                <th>YEAR</th>
                <th>SALES</th>
                <th>GOVT %</th>
                <th>ADV %</th>
                <th>EMPLYS. #</th>
              </tr>
            </thead>
            <tbody>
              {contractorRows.map((row, i) => (
                <tr key={i}>
                  <td>{row.type}</td>
                  <td>
                    <input
                      className="supplb-input supplb-number"
                      value={row.sicCode}
                      onChange={(e) =>
                        updateContractor(i, "sicCode", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="supplb-input"
                      value={row.sicDescription}
                      onChange={(e) =>
                        updateContractor(i, "sicDescription", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="supplb-input supplb-number"
                      value={row.year}
                      maxLength={4}
                      inputMode="numeric"
                      onChange={(e) =>
                        updateContractor(i, "year", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="supplb-input supplb-number"
                      value={row.sales}
                      onChange={(e) =>
                        updateContractor(i, "sales", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="supplb-input supplb-number"
                      value={row.govtPercent}
                      onChange={(e) =>
                        updateContractor(i, "govtPercent", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="supplb-input supplb-number"
                      value={row.advPercent}
                      onChange={(e) =>
                        updateContractor(i, "advPercent", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="supplb-input supplb-number"
                      value={row.employees}
                      onChange={(e) =>
                        updateContractor(i, "employees", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ============================================================
            SECTION 2: COMPENSATION DATA (WITH ORIGINAL ACTION BUTTONS)
            ============================================================ */}
        <div className="supplb-section-heading">
          <div className="supplb-section-title">Compensation Data</div>
          <div className="supplb-actions">
            <button className="supplb-btn" onClick={addCompensationRow}>
              New
            </button>
            <button
              className="supplb-btn"
              onClick={handleCopy}
              disabled={selectedCompensationRows.length === 0}
            >
              Copy
            </button>
            <button
              className="supplb-btn"
              onClick={() => handlePaste()}
              disabled={selectedCompensationRows.length === 0}
            >
              Paste
            </button>
            <button
              className="supplb-btn delete"
              onClick={deleteCompensationRows}
            >
              Delete
            </button>
            <button className="supplb-btn" onClick={clearCompensationRows}>
              Clear
            </button>
            <button className="supplb-btn" onClick={saveCompensation}>
              Save
            </button>
            {savedCompensation && <span className="supplb-status">Saved</span>}
          </div>
        </div>

        <div className="supplb-table-wrap">
          <table className="supplb-table">
            <thead>
              <tr>
                <th>
                  <input
                    className="supplb-row-check"
                    type="checkbox"
                    checked={
                      rows.length > 0 &&
                      selectedCompensationRows.length === rows.length
                    }
                    onChange={toggleAllCompensationRows}
                    aria-label="Select all compensation rows"
                  />
                </th>
                <th>FY</th>
                <th>POSITION</th>
                <th>SALES SCOPE</th>
                <th>% TIME DIRECT</th>
                <th>BASE SALARY</th>
                <th>BONUS</th>
                <th>401(k) MATCH</th>
                <th>HEALTH/LIFE INS.</th>
                <th>AUTO ALLOW.</th>
                <th>DEFERRED COMP.</th>
                <th>LTI</th>
                <th>OTHER*</th>
                <th>VOL. DELS.</th>
                <th>PROPOSED COMP.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={
                    selectedCompensationRows.includes(i) ? "selected" : ""
                  }
                >
                  <td>
                    <input
                      className="supplb-row-check"
                      type="checkbox"
                      checked={selectedCompensationRows.includes(i)}
                      onChange={() => toggleCompensationRow(i)}
                      aria-label={`Select compensation row ${i + 1}`}
                    />
                  </td>
                  {Object.entries(row).map(([key, value]) => (
                    <td
                      key={key}
                      className={key === "position" ? "position" : ""}
                    >
                      <input
                        className={
                          key === "position"
                            ? "supplb-input"
                            : "supplb-input supplb-number"
                        }
                        value={value}
                        maxLength={key === "fy" ? 4 : undefined}
                        inputMode={key === "fy" ? "numeric" : undefined}
                        onChange={(e) => updateRow(i, key, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ============================================================
            SECTION 3: BASIS OF CONTRACTOR'S COMPENSATION
            ============================================================ */}
        <div className="supplb-section ml-3 mt-5">
          <div className="supplb-section-title">
            Basis of Contractor's Compensation
          </div>
          <div className="supplb-note">
            Below, please check the box next to the item which describes the
            contractor's basis for the proposed compensation costs, i.e. how the
            compensation levels were established in accordance with any existing
            policies and procedures. Also, did the contractor consider whether
            the proposed compensation was reasonable in accordance with FAR
            31.205-6(b)? If so, include any reasonableness analysis, including
            all assumptions, data relied upon, compensation surveys and/or any
            other data. Include any attachments separately.
          </div>
          <table className="supplb-basis-table">
            <tbody>
              <tr>
                <td className="basis-check-cell">
                  <input
                    type="checkbox"
                    checked={basisState.market}
                    onChange={() => toggleBasis("market")}
                  />
                </td>
                <td className="basis-label-cell">
                  Market Pricing Data (Compensation Surveys)
                </td>
                <td className="basis-check-cell">
                  <input
                    type="checkbox"
                    checked={basisState.dcaa}
                    onChange={() => toggleBasis("dcaa")}
                  />
                </td>
                <td className="basis-label-cell">
                  Prior DCAA Audit of Compensation Reasonableness
                </td>
              </tr>
              <tr>
                <td className="basis-check-cell">
                  <input
                    type="checkbox"
                    checked={basisState.writtenPlan}
                    onChange={() => toggleBasis("writtenPlan")}
                  />
                </td>
                <td className="basis-label-cell">
                  Written Compensation Plan/Policy
                </td>
                <td className="basis-check-cell">
                  <input
                    type="checkbox"
                    checked={basisState.consultant}
                    onChange={() => toggleBasis("consultant")}
                  />
                </td>
                <td className="basis-label-cell">
                  3rd Party (Consultant) Compensation Analysis
                </td>
              </tr>
              <tr>
                <td className="basis-check-cell">
                  <input
                    type="checkbox"
                    checked={basisState.management}
                    onChange={() => toggleBasis("management")}
                  />
                </td>
                <td className="basis-label-cell">
                  Management Judgment (No written plan/policy)
                </td>
                <td className="basis-check-cell">
                  <input
                    type="checkbox"
                    checked={basisState.other}
                    onChange={() => toggleBasis("other")}
                  />
                </td>
                <td className="basis-label-cell">
                  Other --{" "}
                  <input
                    className="basis-other-input"
                    type="text"
                    value={basisOtherText}
                    onChange={(e) => {
                      setBasisOtherText(e.target.value);
                      markUnsaved();
                    }}
                    disabled={!basisState.other}
                  />
                </td>
              </tr>
              <tr>
                <td className="basis-check-cell">
                  <input
                    type="checkbox"
                    checked={basisState.board}
                    onChange={() => toggleBasis("board")}
                  />
                </td>
                <td className="basis-label-cell">
                  Determined by Board of Directors
                </td>
                <td className="basis-check-cell"></td>
                <td className="basis-label-cell"></td>
              </tr>
            </tbody>
          </table>

          <div
            className="supplb-note"
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <b>(1) Indicate if Job Descriptions are available:</b>

            <label className="supplb-check" style={{ margin: 0 }}>
              <input
                type="radio"
                name="jobDescriptions"
                checked={basisState.jobDescriptionsYes}
                onChange={() =>
                  setBasisState((current) => ({
                    ...current,
                    jobDescriptionsYes: true,
                    jobDescriptionsNo: false,
                  }))
                }
              />
              YES
            </label>

            <label className="supplb-check" style={{ margin: 0 }}>
              <input
                type="radio"
                name="jobDescriptions"
                checked={basisState.jobDescriptionsNo}
                onChange={() =>
                  setBasisState((current) => ({
                    ...current,
                    jobDescriptionsYes: false,
                    jobDescriptionsNo: true,
                  }))
                }
              />
              NO
            </label>
          </div>
          <div className="supplb-note">
            <b>*Written description Other compensation:</b> personal usage of
            leased vehicle; PTO payout; cell phone reimbursement
          </div>
          <div className="supplb-note">
            <b>*Breakdown of Other compensation by cost element:</b> $25,539
            personal usage of leased vehicle; $24,304 PTO pay-out; $1,920 cell
            phone reimbursement
          </div>
        </div>

        <div className="supplb-footer-note">
          The contractor data above is fixed. Use the controls in the
          Compensation Data table below to manage compensation rows.
        </div>
      </div>
    </div>
  );
}
