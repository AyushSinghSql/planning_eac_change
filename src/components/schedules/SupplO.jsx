import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar } from "lucide-react";
import { backendUrl } from "../config";

// const BASE_URL = backendUrl;

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

const formatDateToISO = (date) => {
  if (!date) return null;
  if (typeof date === "string") {
    if (date.includes("T")) return date.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const parts = date.split("/");
    if (parts.length === 3) {
      const mm = parts[0].padStart(2, "0");
      const dd = parts[1].padStart(2, "0");
      let yy = parts[2];
      if (yy.length === 2) yy = "20" + yy;
      return `${yy}-${mm}-${dd}`;
    }
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return date;
  }
  return null;
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
        fontSize: "14px",
        color: "#073b5c",
        padding: "0 6px",
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
          borderRadius: "4px",
          padding: "2px 4px",
          fontSize: "11px",
          fontWeight: "bold",
          background: "#fff",
          color: "#073b5c",
          cursor: "pointer",
          outline: "none",
          height: "24px",
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
          borderRadius: "4px",
          padding: "2px 4px",
          fontSize: "11px",
          fontWeight: "bold",
          background: "#fff",
          color: "#073b5c",
          cursor: "pointer",
          outline: "none",
          height: "24px",
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
        fontSize: "14px",
        color: "#073b5c",
        padding: "0 6px",
      }}
    >
      ›
    </button>
  </div>
);

const SHEET = {
  rows: 125,
  cols: 17,
  cells: [
    {
      r: 1,
      c: 1,
      v: "This Schedule does not contain any links to",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 1,
      c: 2,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 1,
      c: 3,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 1,
      c: 4,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 1,
      c: 5,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 1,
      c: 6,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 1,
      c: 7,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 1,
      c: 8,
      v: "SUPPLEMENTAL O",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 1,
      c: 10,
      v: "ICE MANUAL",
      bg: "#FFFFFF",
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: "single",
      fontColor: "#0000FF",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 1,
      c: 12,
      v: "",
      bg: "#FFFFFF",
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: "single",
      fontColor: "#0000FF",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 1,
      c: 16,
      v: "SUPPLEMENTAL O",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 2,
      c: 1,
      v: "other schedules.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 2,
      c: 2,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 2,
      c: 3,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 2,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 12.0,
      bold: true,
      italic: false,
      underline: "single",
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 2,
      c: 5,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 2,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 12.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 2,
      c: 8,
      v: " ICE (version 2.0.1h)",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 2,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 2,
      c: 12,
      v: "",
      bg: null,
      font: "Arial",
      size: 12.0,
      bold: true,
      italic: false,
      underline: "single",
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 2,
      c: 13,
      v: "Contract Briefings",
      bg: null,
      font: "Arial",
      size: 12.0,
      bold: true,
      italic: false,
      underline: "single",
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 2,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 2,
      c: 16,
      v: "Page 4 of 4",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 3,
      c: 1,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 3,
      c: 2,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 3,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 3,
      c: 5,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 3,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 12.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 3,
      c: 8,
      v: "Page 1 of 4",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 3,
      c: 9,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 3,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 3,
      c: 12,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 3,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 3,
      c: 17,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 4,
      c: 1,
      v: "ICE MANUAL",
      bg: "#FFFFFF",
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: "single",
      fontColor: "#0000FF",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 4,
      c: 2,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 4,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 4,
      c: 4,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 4,
      c: 5,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 4,
      c: 6,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 4,
      c: 7,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 4,
      c: 8,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 4,
      c: 9,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 4,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 4,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 4,
      c: 15,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 4,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 5,
      c: 2,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 5,
      c: 3,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 5,
      c: 4,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 5,
      c: 5,
      v: "Contract Briefings",
      bg: null,
      font: "Arial",
      size: 12.0,
      bold: true,
      italic: false,
      underline: "single",
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 5,
      c: 6,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 5,
      c: 7,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 5,
      c: 8,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 5,
      c: 9,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 5,
      c: 10,
      v: "Contractor Name:",
      bg: null,
      font: "Times New Roman",
      size: 11.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 5,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 5,
      c: 12,
      v: "Columbus Technologies and Services, Inc.",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 5,
      c: 13,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 5,
      c: 14,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 5,
      c: 15,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 6,
      c: 1,
      v: "1. Contractor Name:",
      bg: null,
      font: "Times New Roman",
      size: 11.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 6,
      c: 3,
      v: "Columbus Technologies and Services, Inc.",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 3],
    },
    {
      r: 6,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 6,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 6,
      c: 10,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 7,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 7,
      c: 10,
      v: "Contract Number",
      bg: null,
      font: "Times New Roman",
      size: 11.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 7,
      c: 12,
      v: "Prime -1628605",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 7,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 7,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 7,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 8,
      c: 1,
      v: "2. Contract Number",
      bg: null,
      font: "Times New Roman",
      size: 11.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 8,
      c: 3,
      v: "Prime -1628605",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 3],
    },
    {
      r: 8,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 8,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 8,
      c: 6,
      v: "Date of Award:",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 8,
      c: 8,
      v: "10/01/19",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 8,
      c: 12,
      v: "Sub - 4400574846",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 9,
      c: 1,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 9,
      c: 3,
      v: "Sub - 4400574846",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 3],
    },
    {
      r: 9,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 9,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 9,
      c: 8,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 9,
      c: 11,
      v: "C.  ",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "right",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 9,
      c: 12,
      v: "Summary of Contract Modifications",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 5],
    },
    {
      r: 9,
      c: 13,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 9,
      c: 14,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 9,
      c: 15,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 9,
      c: 16,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 10,
      c: 1,
      v: "Contractor Job. No.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 10,
      c: 3,
      v: "1392",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 3],
    },
    {
      r: 10,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 10,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 10,
      c: 6,
      v: "FY Funds",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 10,
      c: 8,
      v: "No",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 11,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 11,
      c: 10,
      v: "Modification Number",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "center",
      wrap: true,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 11,
      c: 11,
      v: "Date",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "center",
      wrap: true,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 11,
      c: 12,
      v: "Change in Funding",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "center",
      wrap: true,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 11,
      c: 13,
      v: "Total Funding",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "center",
      wrap: true,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 11,
      c: 14,
      v: "Cost",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "center",
      wrap: true,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 11,
      c: 15,
      v: "Profit/Fee",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "center",
      wrap: true,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 11,
      c: 16,
      v: "Total",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "center",
      wrap: true,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 12,
      c: 1,
      v: "3. Briefed through",
      bg: null,
      font: "Times New Roman",
      size: 11.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 12,
      c: 10,
      v: "Original Contract",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: true,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 12,
      c: 11,
      v: "10/01/19",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 12,
      c: 12,
      v: "$1,755,960",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 12,
      c: 13,
      v: "$1,755,960",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 12,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 12,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 12,
      c: 16,
      v: "$1,755,960",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 13,
      c: 1,
      v: "      Mod. No.",
      bg: null,
      font: "Times New Roman",
      size: 11.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 13,
      c: 3,
      v: "9",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 13,
      c: 4,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 13,
      c: 5,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 13,
      c: 6,
      v: "Dated:",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 13,
      c: 8,
      v: "09/30/24",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 13,
      c: 10,
      v: "1",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 13,
      c: 11,
      v: "01/09/20",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 13,
      c: 12,
      v: "$1,855",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 13,
      c: 13,
      v: "$1,757,815",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 13,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 13,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 13,
      c: 16,
      v: "$1,757,815",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 14,
      c: 1,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 14,
      c: 10,
      v: "2",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 14,
      c: 11,
      v: "05/05/20",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 14,
      c: 12,
      v: "$75,063",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 14,
      c: 13,
      v: "$1,832,878",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 14,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 14,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 14,
      c: 16,
      v: "$1,832,878",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 15,
      c: 1,
      v: "4. Contract",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 15,
      c: 10,
      v: "3",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 15,
      c: 11,
      v: "09/15/20",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 15,
      c: 12,
      v: "$80,810",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 15,
      c: 13,
      v: "$1,913,688",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 15,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 15,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 15,
      c: 16,
      v: "$1,913,688",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 16,
      c: 1,
      v: "     Type",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 16,
      c: 10,
      v: "4",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 16,
      c: 11,
      v: "10/15/26",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 16,
      c: 12,
      v: "$1,163,705",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 16,
      c: 13,
      v: "$3,077,392",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 16,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 16,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 16,
      c: 16,
      v: "$3,077,392",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 17,
      c: 6,
      v: "(Specify)",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 17,
      c: 7,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 17,
      c: 10,
      v: "5",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 17,
      c: 11,
      v: "10/07/21",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 17,
      c: 12,
      v: "$1,323,812",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 17,
      c: 13,
      v: "$4,401,204",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 17,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 17,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 17,
      c: 16,
      v: "$4,401,204",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 18,
      c: 10,
      v: "6",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 18,
      c: 11,
      v: "09/28/22",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 18,
      c: 12,
      v: "$446,988",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 18,
      c: 13,
      v: "$4,848,192",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 18,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 18,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 18,
      c: 16,
      v: "$4,848,192",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 19,
      c: 1,
      v: "5. Estimated Cost",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 19,
      c: 2,
      v: "$0",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"??_);_(@_)',
      merge: [1, 2],
    },
    {
      r: 19,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 19,
      c: 4,
      v: "Est. Fee",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"??_);_(@_)',
    },
    {
      r: 19,
      c: 5,
      v: "$0",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"??_);_(@_)',
      merge: [1, 2],
    },
    {
      r: 19,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 19,
      c: 7,
      v: "Total Price",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"??_);_(@_)',
    },
    {
      r: 19,
      c: 8,
      v: "$5,456,335",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"??_);_(@_)',
    },
    {
      r: 19,
      c: 10,
      v: "7",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 19,
      c: 11,
      v: "09/22/22",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 19,
      c: 12,
      v: "$1,333,940",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 19,
      c: 13,
      v: "$6,182,132",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 19,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 19,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 19,
      c: 16,
      v: "$6,182,132",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 20,
      c: 10,
      v: "8",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 20,
      c: 11,
      v: "09/25/23",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 20,
      c: 12,
      v: "$1,572,336",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 20,
      c: 13,
      v: "$7,754,469",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 20,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 20,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 20,
      c: 16,
      v: "$7,754,469",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 21,
      c: 1,
      v: "6. Period of Performance From: ",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 21,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 21,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 21,
      c: 4,
      v: "10/01/19",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "mm/dd/yy;@",
      merge: [1, 2],
    },
    {
      r: 21,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 21,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: "single",
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 21,
      c: 7,
      v: "TO:",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 21,
      c: 8,
      v: "09/30/25",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 21,
      c: 10,
      v: "9",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 21,
      c: 11,
      v: "09/30/24",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "mm/dd/yy;@",
    },
    {
      r: 21,
      c: 12,
      v: "$1,434,277",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 21,
      c: 13,
      v: "$9,188,746",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 21,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 21,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    },
    {
      r: 21,
      c: 16,
      v: "$9,188,746",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: '"$"#,##0_);\\("$"#,##0\\)',
    },
    {
      r: 22,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 22,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 22,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 22,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 22,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 22,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 22,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 23,
      c: 1,
      v: "7. Is this a Subcontract?",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 23,
      c: 4,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
      merge: [1, 2],
    },
    {
      r: 23,
      c: 7,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
      merge: [1, 2],
    },
    {
      r: 23,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 23,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 23,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 23,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 23,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 23,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 23,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 24,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 24,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 24,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 24,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 24,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 24,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 24,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 25,
      c: 1,
      v: "8. Prime ",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 25,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 25,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 25,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 25,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 25,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 25,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 25,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 25,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 25,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 25,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 25,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 25,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 25,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 26,
      c: 1,
      v: "   Contractor",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 26,
      c: 2,
      v: "Raytheon Company",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 26,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 26,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 26,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 26,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 26,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 26,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 26,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 26,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 26,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 26,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 26,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 26,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 27,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 27,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 27,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 27,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 27,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 27,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 27,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 27,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 27,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 27,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 27,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 27,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 27,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 27,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 28,
      c: 1,
      v: "Prime Contract No.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 28,
      c: 2,
      v: "1628605",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 28,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 28,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 28,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 28,
      c: 6,
      v: "Contract Type",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 28,
      c: 8,
      v: "T&M",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 28,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 28,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 28,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 28,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 28,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 28,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 28,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 29,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 29,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 29,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 29,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 29,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 29,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 29,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 29,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 29,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 29,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 29,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 29,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 29,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 29,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 30,
      c: 1,
      v: "Address",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 30,
      c: 2,
      v: "300 North Lake Avenue, Suite 1120",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 30,
      c: 3,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 30,
      c: 4,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 30,
      c: 5,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 30,
      c: 6,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 30,
      c: 7,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 30,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 30,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 30,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 30,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 30,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 30,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 30,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 31,
      c: 2,
      v: "Pasadena, CA 91101",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 31,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 31,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 31,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 31,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 31,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 31,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 31,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 31,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 31,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 31,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 32,
      c: 1,
      v: "Point of Contact",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 32,
      c: 2,
      v: "Brandy Clark",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 32,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 32,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 32,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 32,
      c: 6,
      v: "Phone",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 32,
      c: 7,
      v: "478.235.7016",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 32,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 32,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 32,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 32,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 32,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 32,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 32,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 33,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 33,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 33,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 33,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 33,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 33,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 33,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 34,
      c: 1,
      v: "Cognizant ",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 34,
      c: 2,
      v: "Los Angeles East Branch Office (4961)",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 34,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 34,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 34,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 34,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 34,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 34,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 34,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 34,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 34,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 34,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 35,
      c: 1,
      v: "DCAA Office",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 35,
      c: 2,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { top: "1px solid #000000", bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 35,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { top: "1px solid #000000", bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 35,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { top: "1px solid #000000", bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 35,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { top: "1px solid #000000", bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 35,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 35,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 35,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 35,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 35,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 35,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 35,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 36,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 36,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 36,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 36,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 36,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 36,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 36,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 36,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 37,
      c: 1,
      v: "9. Acquisition ",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 37,
      c: 2,
      v: "Jet Propulsion Laboratory (JPL)",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 37,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 37,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 37,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 37,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 37,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 37,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 37,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 37,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 37,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 37,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 38,
      c: 1,
      v: "   Agency",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 38,
      c: 2,
      v: "4800 Oak Grove Drive",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 38,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 38,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 38,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 38,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 38,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 38,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 38,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 38,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 38,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 38,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 39,
      c: 1,
      v: "Address:",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 39,
      c: 2,
      v: "Pasadena, CA 91109-8099",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 39,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 39,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 39,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 39,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 39,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 39,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 39,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 39,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 39,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 39,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 40,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 40,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 40,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 40,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 40,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 40,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 40,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 41,
      c: 1,
      v: "Point of Contact",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 41,
      c: 2,
      v: "Shannon Grover",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 41,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 41,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 41,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 41,
      c: 6,
      v: "Phone",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 41,
      c: 7,
      v: "818-393-7798",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 41,
      c: 10,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 41,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "d-mmm-yy",
    },
    {
      r: 41,
      c: 12,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 41,
      c: 13,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 41,
      c: 14,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 41,
      c: 15,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 41,
      c: 16,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {
        top: "1px solid #000000",
        right: "1px solid #000000",
        bottom: "1px solid #000000",
        left: "1px solid #000000",
      },
      numfmt: "General",
    },
    {
      r: 42,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 42,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 42,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 42,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 42,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 42,
      c: 6,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 42,
      c: 11,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "d-mmm-yy",
    },
    {
      r: 43,
      c: 1,
      v: "ICE MANUAL",
      bg: "#FFFFFF",
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: "single",
      fontColor: "#0000FF",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 43,
      c: 8,
      v: "SUPPLEMENTAL O",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 44,
      c: 1,
      v: "",
      bg: "#FFFFFF",
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#FFFFFF",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 44,
      c: 5,
      v: "Contract Briefings",
      bg: null,
      font: "Arial",
      size: 12.0,
      bold: true,
      italic: false,
      underline: "single",
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 44,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 12.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 44,
      c: 8,
      v: "Page 2 of 4",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 46,
      c: 1,
      v: "10. Administrative ",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 46,
      c: 2,
      v: "Raytheon Company",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 46,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 46,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 46,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 47,
      c: 1,
      v: "Contract Office",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 47,
      c: 2,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 47,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 47,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 47,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 48,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 48,
      c: 2,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 48,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 48,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 48,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 49,
      c: 1,
      v: "Address:",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 49,
      c: 2,
      v: "300 North Lake Avenue, Suite 1120",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 49,
      c: 3,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 49,
      c: 4,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 49,
      c: 5,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 50,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 50,
      c: 2,
      v: "Pasadena, CA 91101",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 50,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 50,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 50,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 51,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 52,
      c: 1,
      v: "Point of Contact:",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 52,
      c: 2,
      v: "Brandy Clark",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 52,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 52,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 52,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 52,
      c: 6,
      v: "Phone",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 52,
      c: 7,
      v: "478.235.7016",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 53,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 54,
      c: 1,
      v: "11. Procurement",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 55,
      c: 1,
      v: "Regulations:",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 55,
      c: 2,
      v: "Check All that Apply",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 4],
    },
    {
      r: 55,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 55,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 55,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 56,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 57,
      c: 6,
      v: "(Specify)",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 57,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 2],
    },
    {
      r: 57,
      c: 8,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 59,
      c: 1,
      v: "12. Cost Accounting",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 60,
      c: 1,
      v: "Standards (CAS)",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 60,
      c: 2,
      v: "Identify the CAS clauses contained in the contract.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 6],
    },
    {
      r: 60,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 60,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 60,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 60,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 60,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 62,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
      merge: [1, 2],
    },
    {
      r: 62,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
      merge: [1, 2],
    },
    {
      r: 62,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
      merge: [1, 2],
    },
    {
      r: 63,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
      merge: [1, 2],
    },
    {
      r: 63,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
      merge: [1, 2],
    },
    {
      r: 63,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
      merge: [1, 2],
    },
    {
      r: 65,
      c: 1,
      v: "13. Truth In",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 65,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 66,
      c: 1,
      v: "Negotiation (TINA)",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 66,
      c: 2,
      v: "Identify the TINA clauses contained in the contract.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 6],
    },
    {
      r: 66,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 66,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 66,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 66,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 66,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 67,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 67,
      c: 2,
      v: "FAR 52.215-22",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 67,
      c: 4,
      v: "(FAR 52.215-10, effective 10/10/97)",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 67,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 67,
      c: 8,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 68,
      c: 2,
      v: "FAR 52.230-23",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 68,
      c: 4,
      v: "(FAR 52.215-11, effective 10/10/97)",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 68,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 68,
      c: 8,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 69,
      c: 2,
      v: "FAR 52.230-24",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 69,
      c: 4,
      v: "(FAR 52.215-12, effective 10/10/97)",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 69,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 69,
      c: 8,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 70,
      c: 2,
      v: "FAR 52.230-25",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 70,
      c: 4,
      v: "(FAR 52.215-13, effective 10/10/97)",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 70,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 70,
      c: 8,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 72,
      c: 1,
      v: "14. Brief Statement",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 72,
      c: 2,
      v: "As a subcontractor to Raytheon to provide",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 6],
    },
    {
      r: 72,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 72,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 72,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 72,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 72,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 73,
      c: 1,
      v: "of Scope of Work",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 73,
      c: 2,
      v: "System Administration support to the",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 6],
    },
    {
      r: 73,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 73,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 73,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 73,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 73,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 74,
      c: 2,
      v: "Jet Propulsion Laboratory",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 6],
    },
    {
      r: 74,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 74,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 74,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 74,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 74,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 75,
      c: 2,
      v: "B.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 75,
      c: 3,
      v: "Contract Clauses and Special Provisions",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 5],
    },
    {
      r: 75,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 75,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 75,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 75,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 76,
      c: 8,
      v: "YES",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: "single",
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 76,
      c: 9,
      v: " NO",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: "single",
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 77,
      c: 1,
      v: "15. FAR 52.252-2 Contract Clauses Incorporated by reference.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 78,
      c: 2,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 6],
    },
    {
      r: 78,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 78,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 78,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 78,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 78,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 81,
      c: 1,
      v: "ICE MANUAL",
      bg: "#FFFFFF",
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: "single",
      fontColor: "#0000FF",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 81,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 81,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 81,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 81,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 81,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 81,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 81,
      c: 8,
      v: "SUPPLEMENTAL O",
      bg: null,
      font: "Times New Roman",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 82,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 82,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 82,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 82,
      c: 4,
      v: "Contract Briefings",
      bg: null,
      font: "Arial",
      size: 12.0,
      bold: true,
      italic: false,
      underline: "single",
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 82,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 82,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 12.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 82,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 82,
      c: 8,
      v: "Page 3 of 4",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 83,
      c: 8,
      v: "YES",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: "single",
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 83,
      c: 9,
      v: " NO",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: "single",
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 84,
      c: 1,
      v: "16. If this is a Time & Material (T&M) or fixed price contract attach",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 85,
      c: 1,
      v: "the schedule of negotiated rates.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 86,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 87,
      c: 1,
      v: "17.  If this is a cost sharing contract, identify the terms of the",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 88,
      c: 1,
      v: "cost sharing arrangement.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 89,
      c: 8,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: "single",
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 89,
      c: 9,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: "single",
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 90,
      c: 1,
      v: "18.  Does the contract contain a level of effort clause?",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 91,
      c: 1,
      v: "If yes, identify the limitations specified in the contract.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 92,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 93,
      c: 1,
      v: "19.  Does the contract contain ceilings on the indirect costs?",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 94,
      c: 1,
      v: "If yes, identify the ceiling rates (attach relevant portions of the contract).",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 95,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 7],
    },
    {
      r: 95,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 95,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 95,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 95,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 95,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 95,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 96,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 97,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 98,
      c: 1,
      v: "20.   Is Facilities Capital Cost of Money (FCCM) allowable on this contract?",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 99,
      c: 1,
      v: "(FAR 52.215-30)(FAR 52.215-16) effective 10/10/97)",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 100,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 101,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 102,
      c: 1,
      v: "21. Does the contract contain the FAR Penalty Clause (52.242-3)?",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 103,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 104,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 105,
      c: 1,
      v: "22. Does the contract contain precontract or cost allowability restrictions?",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 106,
      c: 1,
      v: "If yes, identify the relevant portions of the contract.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 107,
      c: 1,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 7],
    },
    {
      r: 107,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 107,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 107,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 107,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 107,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 107,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 108,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 109,
      c: 1,
      v: "23. Does the contract contain restrictions on overtime (FAR 52.222-2)?",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 110,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 111,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 112,
      c: 1,
      v: "24. Does the contract contain restrictions or special requirements for ",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 113,
      c: 1,
      v: "subcontracts?  If yes, identify the relevant portions of the contract.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 115,
      c: 1,
      v: "TC-001 (07/19) Section 18 Assignments, Subcontracting, Organization Changes, and Place of Performance",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 116,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 117,
      c: 1,
      v: "25. Identify any costs made specifically unallowable by the terms of the contract.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 118,
      c: 1,
      v: "None",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 9],
    },
    {
      r: 118,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 118,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 118,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 118,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 118,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 118,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 118,
      c: 8,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 118,
      c: 9,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 119,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 120,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 121,
      c: 1,
      v: "26. Identify any profit or fee provisions in the contract.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 122,
      c: 1,
      v: "None",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 9],
    },
    {
      r: 122,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 122,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 122,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 122,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 122,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 122,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 122,
      c: 8,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 122,
      c: 9,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 123,
      c: 1,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 124,
      c: 1,
      v: "27. Identify other special provisions/limitations specified in the contract.",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: {},
      numfmt: "General",
    },
    {
      r: 124,
      c: 8,
      v: "",
      bg: null,
      font: "Times New Roman",
      size: 12.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "center",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 2],
    },
    {
      r: 124,
      c: 9,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 125,
      c: 1,
      v: "None",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: true,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
      merge: [1, 9],
    },
    {
      r: 125,
      c: 2,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 125,
      c: 3,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 125,
      c: 4,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 125,
      c: 5,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 125,
      c: 6,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 125,
      c: 7,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 125,
      c: 8,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
    {
      r: 125,
      c: 9,
      v: "",
      bg: null,
      font: "Arial",
      size: 10.0,
      bold: false,
      italic: false,
      underline: null,
      fontColor: "#000000",
      h: "left",
      vAlign: "bottom",
      wrap: false,
      indent: 0,
      borders: { bottom: "1px solid #000000" },
      numfmt: "General",
    },
  ],
  merges: [
    [5, 12, 5, 15],
    [6, 3, 6, 5],
    [7, 12, 7, 15],
    [8, 3, 8, 5],
    [8, 12, 8, 15],
    [9, 3, 9, 5],
    [10, 3, 10, 5],
    [13, 3, 13, 5],
    [19, 2, 19, 3],
    [19, 5, 19, 6],
    [21, 4, 21, 5],
    [23, 4, 23, 5],
    [23, 7, 23, 8],
    [26, 2, 26, 5],
    [28, 2, 28, 5],
    [30, 2, 30, 5],
    [31, 2, 31, 5],
    [32, 2, 32, 5],
    [34, 2, 34, 5],
    [35, 2, 35, 5],
    [37, 2, 37, 5],
    [38, 2, 38, 5],
    [39, 2, 39, 5],
    [41, 2, 41, 5],
    [46, 2, 46, 5],
    [47, 2, 47, 5],
    [48, 2, 48, 5],
    [49, 2, 49, 5],
    [50, 2, 50, 5],
    [52, 2, 52, 5],
    [55, 2, 55, 5],
    [57, 7, 57, 8],
    [60, 2, 60, 7],
    [62, 2, 62, 3],
    [62, 4, 62, 5],
    [62, 6, 62, 7],
    [63, 2, 63, 3],
    [63, 4, 63, 5],
    [63, 6, 63, 7],
    [66, 2, 66, 7],
    [72, 2, 72, 7],
    [73, 2, 73, 7],
    [74, 2, 74, 7],
    [75, 3, 75, 7],
    [78, 2, 78, 7],
    [95, 1, 95, 7],
    [107, 1, 107, 7],
    [118, 1, 118, 9],
    [122, 1, 122, 9],
    [124, 8, 124, 9],
    [125, 1, 125, 9],
  ],
  colWidths: [
    139.19, 47.19, 55.18, 93.6, 177.58, 69.58, 74.39, 148.78, 69.58, 87.19,
    69.58, 95.99, 161.58, 88.79, 76.78, 91.18, 81.59,
  ],
  rowHeights: [
    17.6, 20.0, 20.0, 17.6, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 35.19, 35.99,
    20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 13.0,
    20.0, 20.0, 13.0, 20.0, 13.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0,
    20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 17.6, 20.0, 20.0, 20.0, 20.0, 20.0,
    20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0,
    20.0, 17.6, 17.6, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0,
    20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0,
    20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0,
    20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0,
    20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0,
    20.0, 20.0, 20.0, 20.0, 20.0,
  ],
};

const cellKey = (r, c) => `${r}:${c}`;

const normalizeLabel = (value) =>
  String(value || "")
    .replace(/^\s*\d+\.\s*/, "")
    .replace(/[\s:]+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const EDITABLE_INPUT_CELLS = new Set([
  "5:12", // Contractor Name right
  "6:3", // 1. Contractor Name left
  "7:12", // Contract Number right
  "8:3", // 2. Contract Number left
  "8:8", // Date of Award
  "8:12", // Subcontract Number right
  "9:3", // Subcontract Number left
  "10:3", // Contractor Job No.
  "10:8", // FY Funds
  "13:3", // 3. Briefed through Mod. No.
  "13:8", // Dated
  "17:7", // 4. Contract Type Other (Specify)
  "19:2", // 5. Estimated Cost
  "19:5", // Estimated Fee
  "19:8", // Total Price
  "21:4", // 6. Period of Performance From
  "21:8", // Period of Performance To
  "26:2", // Prime Contractor Name
  "28:2", // Prime Contract Number
  "30:2", // Address Line 1
  "31:2", // Address Line 2
  "32:2", // Prime Contractor POC Name
  "32:7", // Prime Contractor POC Phone
  "34:2", // Cognizant DCAA Office
  "37:2", // Acquiring Agency Name
  "38:2", // Acquiring Agency Address 1
  "39:2", // Acquiring Agency Address 2
  "41:2", // Acquiring Agency POC Name
  "41:7", // Acquiring Agency POC Phone
  "46:2", // Admin Contracting Office
  "49:2", // Admin Contracting Office Address 1
  "50:2", // Admin Contracting Office Address 2
  "52:2", // Admin Contracting Office POC Name
  "52:7", // Admin Contracting Office POC Phone
  "57:7", // 8. Other Procurement Regulations
  "72:2", // 12. Statement of Work Details
  "115:1", // Subcontract Restrictions Details
  "118:1", // 17. Unallowable Costs
  "122:1", // 18. Profit or Fee Option
  "125:1", // 19. Special Limitations
]);

const pageStorageKey = "suppl-o-data";

const blankTableRow = (id, modNumber = "") => ({
  id,
  modificationNumber: modNumber,
  date: "",
  changeInFunding: "",
  totalFunding: "",
  cost: "",
  profitFee: "",
  total: "",
});

const ensureModRows = (existingMods = [], targetCount = 1) => {
  const count = Math.max(
    1,
    Math.min(TABLE_MODIFICATION_SHEET_ROWS.length, targetCount || 1),
  );
  const result = [];
  for (let i = 1; i <= count; i++) {
    const strI = String(i);
    const found =
      existingMods.find((m) => String(m.modificationNumber) === strI) ||
      existingMods[i - 1];
    if (found) {
      result.push({
        ...found,
        modificationNumber: found.modificationNumber || strI,
      });
    } else {
      result.push(
        blankTableRow(
          `mod-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 5)}`,
          strI,
        ),
      );
    }
  }
  return result;
};

const HIDDEN_YES_NO_LABELS = new Set(["76:8", "76:9", "83:8", "83:9"]);

const TABLE_ORIGINAL_ROW = 12;
const TABLE_MODIFICATION_SHEET_ROWS = [13, 14, 15, 16, 17, 18, 19, 20, 21];
const TABLE_NUMERIC_COLUMNS = [12, 13, 14, 15, 16];
const TABLE_DATE_COLUMN = 11;
const TABLE_DATA_COLUMNS = [10, 11, 12, 13, 14, 15, 16];
const TABLE_LEFT = SHEET.colWidths
  .slice(0, 9)
  .reduce((sum, width) => sum + width, 0);
const TABLE_COLUMN_WIDTHS = SHEET.colWidths.slice(9, 16);
const TABLE_WIDTH = TABLE_COLUMN_WIDTHS.reduce((sum, width) => sum + width, 0);
const TABLE_HEADER_TOP = SHEET.rowHeights
  .slice(0, 10)
  .reduce((sum, height) => sum + height, 0);
const TABLE_BODY_TOP = SHEET.rowHeights
  .slice(0, 11)
  .reduce((sum, height) => sum + height, 0);
const TABLE_ORIGINAL_HEIGHT = SHEET.rowHeights[11];
const TABLE_MODIFICATION_HEIGHT = SHEET.rowHeights[12];
const TABLE_SHEET_FRAME_END_ROW = 41;
const TABLE_VERTICAL_OFFSET = 35;
const TABLE_TOOLBAR_TOP = Math.max(
  0,
  TABLE_HEADER_TOP + TABLE_VERTICAL_OFFSET - 32,
);

const alignToItems = (h) => {
  if (h === "center") return "center";
  if (h === "right") return "flex-end";
  return "flex-start";
};

const verticalToContent = (v) => {
  if (v === "center") return "center";
  if (v === "top") return "flex-start";
  return "flex-end";
};

const findInputForLabel = (labelCell) => {
  for (let c = labelCell.c + 1; c <= SHEET.cols; c++) {
    if (EDITABLE_INPUT_CELLS.has(cellKey(labelCell.r, c)))
      return cellKey(labelCell.r, c);
  }
  for (
    let r = labelCell.r + 1;
    r <= Math.min(SHEET.rows, labelCell.r + 2);
    r++
  ) {
    for (let c = 1; c <= SHEET.cols; c++) {
      if (EDITABLE_INPUT_CELLS.has(cellKey(r, c))) return cellKey(r, c);
    }
  }
  return null;
};

const DUPLICATE_INPUT_LINKS = (() => {
  const groups = new Map();
  SHEET.cells.forEach((cell) => {
    if (!cell.v || EDITABLE_INPUT_CELLS.has(cellKey(cell.r, cell.c))) return;
    const label = normalizeLabel(cell.v);
    if (!label) return;
    const inputKey = findInputForLabel(cell);
    if (!inputKey) return;
    const list = groups.get(label) || [];
    if (!list.includes(inputKey)) list.push(inputKey);
    groups.set(label, list);
  });
  return new Map([...groups.entries()].filter(([, keys]) => keys.length > 1));
})();

const DUPLICATE_KEY_TO_GROUP = (() => {
  const out = new Map();
  DUPLICATE_INPUT_LINKS.forEach((keys) =>
    keys.forEach((key) => out.set(key, keys)),
  );
  return out;
})();

const CLOSE_TO_INPUT_LABELS = new Set([
  "contractor name",
  "contract number",
  "date of award",
  "fy funds",
  "dated",
  "(specify)",
  "est. fee",
  "total price",
  "to",
  "contract type",
  "phone",
]);

const CLOSE_LABEL_SHIFTS = {
  dated: 58,
  "est. fee": 12,
  "total price": 12,
  phone: 12,
};

const CHECKBOXES = [
  {
    id: "_x0000_s1071",
    left: 520.8,
    top: 1522.0,
    width: 32.0,
    height: 22.4,
    label: "",
  },
  {
    id: "_x0000_s1072",
    left: 603.2,
    top: 1522.0,
    width: 32.0,
    height: 22.4,
    label: "",
  },
  {
    id: "_x0000_s1025",
    left: 134.4,
    top: 316.0,
    width: 68.0,
    height: 23.2,
    label: "CPFF",
  },
  {
    id: "_x0000_s1026",
    left: 134.4,
    top: 336.0,
    width: 68.0,
    height: 22.4,
    label: "T&M",
  },
  {
    id: "_x0000_s1027",
    left: 186.4,
    top: 316.0,
    width: 63.2,
    height: 23.2,
    label: "CPIF",
  },
  {
    id: "_x0000_s1028",
    left: 186.4,
    top: 336.0,
    width: 63.2,
    height: 22.4,
    label: "FPI",
  },
  {
    id: "_x0000_s1029",
    left: 296.8,
    top: 316.0,
    width: 62.4,
    height: 23.2,
    label: "CS",
  },
  {
    id: "_x0000_s1030",
    left: 296.8,
    top: 336.0,
    width: 62.4,
    height: 22.4,
    label: "IDIQ",
  },
  {
    id: "_x0000_s1031",
    left: 242.4,
    top: 316.8,
    width: 63.2,
    height: 23.2,
    label: "CPAF",
  },
  {
    id: "_x0000_s1032",
    left: 244.0,
    top: 336.8,
    width: 61.6,
    height: 23.2,
    label: "FFP",
  },
  {
    id: "_x0000_s1033",
    left: 346.4,
    top: 316.0,
    width: 69.6,
    height: 23.2,
    label: "CR",
  },
  {
    id: "_x0000_s1034",
    left: 346.4,
    top: 336.0,
    width: 69.6,
    height: 22.4,
    label: "Other",
  },
  {
    id: "_x0000_s1035",
    left: 244.0,
    top: 468.6,
    width: 114.4,
    height: 23.2,
    label: "Yes (Go to Item 8)",
  },
  {
    id: "_x0000_s1036",
    left: 418.4,
    top: 468.6,
    width: 114.4,
    height: 23.2,
    label: "No (Go to Item 9)",
  },
  {
    id: "_x0000_s1037",
    left: 140,
    top: 1110.0,
    width: 48.8,
    height: 22.4,
    label: "FAR",
  },
  {
    id: "_x0000_s1038",
    left: 186.4,
    top: 1110.0,
    width: 52.0,
    height: 22.4,
    label: "DFARS",
  },
  {
    id: "_x0000_s1039",
    left: 241.6,
    top: 1110.0,
    width: 52.8,
    height: 22.4,
    label: "NASA",
  },
  {
    id: "_x0000_s1040",
    left: 296.8,
    top: 1110.0,
    width: 64.8,
    height: 22.4,
    label: "Other",
  },
  {
    id: "_x0000_s1041",
    left: 140.0,
    top: 1210.0,
    width: 93.6,
    height: 23.2,
    label: "FAR 52.230-1",
  },
  {
    id: "_x0000_s1042",
    left: 140.0,
    top: 1230.0,
    width: 93.6,
    height: 24.0,
    label: "FAR 52.230-4",
  },
  {
    id: "_x0000_s1043",
    left: 242.4,
    top: 1210.0,
    width: 91.2,
    height: 23.2,
    label: "FAR 52.230-2",
  },
  {
    id: "_x0000_s1044",
    left: 242.4,
    top: 1230.0,
    width: 91.2,
    height: 24.0,
    label: "FAR 52.230-5",
  },
  {
    id: "_x0000_s1045",
    left: 347.2,
    top: 1210.0,
    width: 97.6,
    height: 23.2,
    label: "FAR 52.230-3",
  },
  {
    id: "_x0000_s1046",
    left: 347.2,
    top: 1230.0,
    width: 97.6,
    height: 24.0,
    label: "FAR 52.230-6",
  },
  { id: "_x0000_s1047", left: 483.2, top: 1319.8, width: 34.4, height: 18.4 },
  { id: "_x0000_s1048", left: 483.2, top: 1339.8, width: 34.4, height: 18.4 },
  { id: "_x0000_s1049", left: 483.2, top: 1359.8, width: 34.4, height: 18.4 },
  { id: "_x0000_s1050", left: 483.2, top: 1379.8, width: 34.4, height: 18.4 },
  { id: "_x0000_s1051", left: 520.8, top: 1857.6, width: 32.0, height: 30.4 },
  { id: "_x0000_s1052", left: 603.2, top: 1857.6, width: 31.2, height: 30.4 },
  { id: "_x0000_s1053", left: 520.8, top: 1920.0, width: 32.0, height: 22.4 },
  { id: "_x0000_s1054", left: 603.2, top: 1920.0, width: 31.2, height: 22.4 },
  { id: "_x0000_s1055", left: 520.8, top: 2003.2, width: 32.0, height: 22.4 },
  { id: "_x0000_s1056", left: 603.2, top: 2003.2, width: 31.2, height: 22.4 },
  { id: "_x0000_s1057", left: 520.8, top: 2086.4, width: 32.0, height: 22.4 },
  { id: "_x0000_s1058", left: 603.2, top: 2086.4, width: 31.2, height: 22.4 },
  { id: "_x0000_s1059", left: 520.8, top: 2169.6, width: 32.0, height: 22.4 },
  { id: "_x0000_s1060", left: 603.2, top: 2169.6, width: 31.2, height: 22.4 },
  { id: "_x0000_s1061", left: 520.8, top: 2232.0, width: 32.0, height: 22.4 },
  { id: "_x0000_s1062", left: 603.2, top: 2232.0, width: 31.2, height: 22.4 },
  { id: "_x0000_s1065", left: 520.8, top: 1677.6, width: 32.0, height: 22.4 },
  { id: "_x0000_s1066", left: 603.2, top: 1677.6, width: 31.2, height: 22.4 },
  { id: "_x0000_s1067", left: 520.8, top: 1737.6, width: 32.0, height: 22.4 },
  { id: "_x0000_s1068", left: 603.2, top: 1737.6, width: 31.2, height: 22.4 },
  { id: "_x0000_s1069", left: 520.8, top: 1797.6, width: 32.0, height: 22.4 },
  { id: "_x0000_s1070", left: 603.2, top: 1797.6, width: 31.2, height: 22.4 },
];

const MULTI_SELECT_GROUPS = new Set([
  "regulations",
  "far-clause",
  "item-11-options",
]);

const CHECKBOX_GROUPS = {
  _x0000_s1071: "item-15-yes-no",
  _x0000_s1072: "item-15-yes-no",
  _x0000_s1025: "contract-type",
  _x0000_s1026: "contract-type",
  _x0000_s1027: "contract-type",
  _x0000_s1028: "contract-type",
  _x0000_s1029: "contract-type",
  _x0000_s1030: "contract-type",
  _x0000_s1031: "contract-type",
  _x0000_s1032: "contract-type",
  _x0000_s1033: "contract-type",
  _x0000_s1034: "contract-type",
  _x0000_s1035: "subcontract",
  _x0000_s1036: "subcontract",
  _x0000_s1037: "regulations",
  _x0000_s1038: "regulations",
  _x0000_s1039: "regulations",
  _x0000_s1040: "regulations",
  _x0000_s1041: "far-clause",
  _x0000_s1042: "far-clause",
  _x0000_s1043: "far-clause",
  _x0000_s1044: "far-clause",
  _x0000_s1045: "far-clause",
  _x0000_s1046: "far-clause",
  _x0000_s1047: "item-11-options",
  _x0000_s1048: "item-11-options",
  _x0000_s1049: "item-11-options",
  _x0000_s1050: "item-11-options",
  _x0000_s1051: "choice-1856",
  _x0000_s1052: "choice-1856",
  _x0000_s1053: "choice-1918",
  _x0000_s1054: "choice-1918",
  _x0000_s1055: "choice-2001",
  _x0000_s1056: "choice-2001",
  _x0000_s1057: "choice-2084",
  _x0000_s1058: "choice-2084",
  _x0000_s1059: "choice-2168",
  _x0000_s1060: "choice-2168",
  _x0000_s1061: "choice-2230",
  _x0000_s1062: "choice-2230",
  _x0000_s1065: "choice-1564",
  _x0000_s1066: "choice-1564",
  _x0000_s1067: "choice-1731",
  _x0000_s1068: "choice-1731",
  _x0000_s1069: "choice-1793",
  _x0000_s1070: "choice-1793",
};

const blankOriginalContract = () => ({
  date: "",
  changeInFunding: "",
  totalFunding: "",
  cost: "",
  profitFee: "",
  total: "",
});

function TableInput({
  type = "number",
  value,
  onChange,
  onFocus,
  ariaLabel,
  step,
}) {
  return (
    <input
      className={`sched-o-table-input sched-o-table-input-${type}`}
      type={type}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
      aria-label={ariaLabel}
      spellCheck={false}
      inputMode={type === "number" ? "decimal" : undefined}
      step={type === "number" ? step || "any" : undefined}
    />
  );
}

function ModificationTableBody({
  originalContract,
  modifications,
  selectedId,
  onOriginalChange,
  onRowChange,
  onRowFocus,
  onSelectModification,
}) {
  return (
    <div
      className="sched-o-table-body"
      style={{
        left: `${TABLE_LEFT}px`,
        top: `${TABLE_BODY_TOP + TABLE_VERTICAL_OFFSET}px`,
        width: `${TABLE_WIDTH}px`,
      }}
    >
      <div
        className="sched-o-table-data-row sched-o-table-original-row"
        style={{
          height: `${TABLE_ORIGINAL_HEIGHT}px`,
          gridTemplateColumns: TABLE_COLUMN_WIDTHS.map(
            (width) => `${width}px`,
          ).join(" "),
        }}
      >
        <div className="sched-o-table-static">Original Contract</div>
        <div
          className="sched-o-table-cell"
          style={{ position: "relative", overflow: "visible", zIndex: 14 }}
        >
          <DatePicker
            selected={parseDate(originalContract.date)}
            onChange={(date) =>
              onOriginalChange("date", date ? formatDateToString(date) : "")
            }
            onChangeRaw={(e) => {
              if (e?.target?.value !== undefined) {
                onOriginalChange("date", e.target.value);
              }
            }}
            onKeyDown={handleDateKeyDown}
            dateFormat="MM/dd/yyyy"
            placeholderText="MM/DD/YYYY"
            portalId="datepicker-portal"
            popperPlacement="bottom-start"
            popperClassName="sched-o-datepicker-popper"
            className="sched-o-table-input"
            renderCustomHeader={renderCustomHeader}
          />
        </div>
        <div className="sched-o-table-cell">
          <TableInput
            value={originalContract.changeInFunding}
            onChange={(value) => onOriginalChange("changeInFunding", value)}
            ariaLabel="Original Contract change in funding"
          />
        </div>
        <div className="sched-o-table-cell">
          <TableInput
            value={originalContract.totalFunding}
            onChange={(value) => onOriginalChange("totalFunding", value)}
            ariaLabel="Original Contract total funding"
          />
        </div>
        <div className="sched-o-table-cell">
          <TableInput
            value={originalContract.cost}
            onChange={(value) => onOriginalChange("cost", value)}
            ariaLabel="Original Contract cost"
          />
        </div>
        <div className="sched-o-table-cell">
          <TableInput
            value={originalContract.profitFee}
            onChange={(value) => onOriginalChange("profitFee", value)}
            ariaLabel="Original Contract profit or fee"
          />
        </div>
        <div className="sched-o-table-cell">
          <TableInput
            value={originalContract.total}
            onChange={(value) => onOriginalChange("total", value)}
            ariaLabel="Original Contract total"
          />
        </div>
      </div>

      {modifications.map((row, index) => (
        <div
          key={row.id}
          className={`sched-o-table-data-row${selectedId === row.id ? " is-selected" : ""}`}
          style={{
            top: `${TABLE_ORIGINAL_HEIGHT + index * TABLE_MODIFICATION_HEIGHT}px`,
            height: `${TABLE_MODIFICATION_HEIGHT}px`,
            gridTemplateColumns: TABLE_COLUMN_WIDTHS.map(
              (width) => `${width}px`,
            ).join(" "),
          }}
        >
          <div
            className="sched-o-table-cell"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 2px",
            }}
          >
            <input
              type="checkbox"
              checked={selectedId === row.id}
              onChange={() =>
                onSelectModification(selectedId === row.id ? null : row.id)
              }
              style={{
                width: "11px",
                height: "11px",
                cursor: "pointer",
                margin: 0,
                flexShrink: 0,
              }}
              aria-label={`Select modification ${row.modificationNumber || index + 1}`}
            />
            <TableInput
              value={row.modificationNumber}
              onChange={(value) =>
                onRowChange(row.id, "modificationNumber", value)
              }
              onFocus={() => onRowFocus(row.id)}
              ariaLabel={`Modification ${index + 1} number`}
              step="1"
            />
          </div>
          <div
            className="sched-o-table-cell"
            style={{ position: "relative", overflow: "visible", zIndex: 13 }}
          >
            <DatePicker
              selected={parseDate(row.date)}
              onChange={(date) =>
                onRowChange(
                  row.id,
                  "date",
                  date ? formatDateToString(date) : "",
                )
              }
              onChangeRaw={(e) => {
                if (e?.target?.value !== undefined) {
                  onRowChange(row.id, "date", e.target.value);
                }
              }}
              onKeyDown={handleDateKeyDown}
              dateFormat="MM/dd/yyyy"
              placeholderText="MM/DD/YYYY"
              portalId="datepicker-portal"
              popperPlacement="bottom-start"
              popperClassName="sched-o-datepicker-popper"
              className="sched-o-table-input"
              onFocus={() => onRowFocus(row.id)}
              renderCustomHeader={renderCustomHeader}
            />
          </div>
          <div className="sched-o-table-cell">
            <TableInput
              value={row.changeInFunding}
              onChange={(value) =>
                onRowChange(row.id, "changeInFunding", value)
              }
              onFocus={() => onRowFocus(row.id)}
              ariaLabel={`Modification ${index + 1} change in funding`}
            />
          </div>
          <div className="sched-o-table-cell">
            <TableInput
              value={row.totalFunding}
              onChange={(value) => onRowChange(row.id, "totalFunding", value)}
              onFocus={() => onRowFocus(row.id)}
              ariaLabel={`Modification ${index + 1} total funding`}
            />
          </div>
          <div className="sched-o-table-cell">
            <TableInput
              value={row.cost}
              onChange={(value) => onRowChange(row.id, "cost", value)}
              onFocus={() => onRowFocus(row.id)}
              ariaLabel={`Modification ${index + 1} cost`}
            />
          </div>
          <div className="sched-o-table-cell">
            <TableInput
              value={row.profitFee}
              onChange={(value) => onRowChange(row.id, "profitFee", value)}
              onFocus={() => onRowFocus(row.id)}
              ariaLabel={`Modification ${index + 1} profit or fee`}
            />
          </div>
          <div className="sched-o-table-cell">
            <TableInput
              value={row.total}
              onChange={(value) => onRowChange(row.id, "total", value)}
              onFocus={() => onRowFocus(row.id)}
              ariaLabel={`Modification ${index + 1} total`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Cell({
  cell,
  value,
  editable,
  onChange,
  onFocus,
  editorType = "text",
  selected = false,
}) {
  const normalizedCellLabel = normalizeLabel(cell.v);
  const isCloseLabel =
    !editable &&
    normalizedCellLabel &&
    CLOSE_TO_INPUT_LABELS.has(normalizedCellLabel);
  const linkedInputKey = isCloseLabel ? findInputForLabel(cell) : null;
  const linkedInputColumn = linkedInputKey
    ? Number(linkedInputKey.split(":")[1])
    : null;
  const labelGap = linkedInputColumn ? linkedInputColumn - cell.c : 0;
  const labelShift = isCloseLabel
    ? (CLOSE_LABEL_SHIFTS[normalizedCellLabel] ?? (labelGap >= 2 ? 28 : 0))
    : 0;
  const specifyShift =
    normalizedCellLabel === "(specify)"
      ? cell.r === 17 && cell.c === 6
        ? { x: -113, y: -10 }
        : cell.r === 57 && cell.c === 6
          ? { x: -167, y: -13 }
          : null
      : null;
  const specifyInputShift =
    cell.r === 17 && cell.c === 7
      ? { x: -113, y: -10 }
      : cell.r === 57 && cell.c === 7
        ? { x: -167, y: -13 }
        : null;

  const style = {
    gridColumn: `${cell.c} / span ${cell.merge ? cell.merge[1] : 1}`,
    gridRow: `${cell.r} / span ${cell.merge ? cell.merge[0] : 1}`,
    background: cell.bg || "transparent",
    color: cell.fontColor || "#000",
    fontFamily: cell.font || "Arial",
    fontSize: `${cell.size || 10}px`,
    fontWeight: cell.bold ? 700 : 400,
    fontStyle: cell.italic ? "italic" : "normal",
    textDecoration: cell.underline ? "underline" : "none",
    textAlign: isCloseLabel ? "right" : cell.h || "left",
    whiteSpace: cell.wrap ? "normal" : "nowrap",
    overflow: editable ? "hidden" : "visible",
    overflowWrap: cell.wrap ? "break-word" : "normal",
    wordBreak: cell.wrap ? "normal" : "normal",
    paddingLeft: `${1 + (cell.indent || 0) * 3}px`,
    paddingRight: "1px",
    paddingTop: "0px",
    paddingBottom: "0px",
    display: "flex",
    flexDirection: "column",
    alignItems: alignToItems(cell.h),
    justifyContent: verticalToContent(cell.vAlign),
    boxSizing: "border-box",
    lineHeight: "normal",
    position: "relative",
    zIndex:
      isCloseLabel ||
      (cell.v && cell.c <= 4 && /^(\d+\.|FAR 52\.)/.test(String(cell.v).trim()))
        ? 5
        : undefined,
    transform:
      cell.r === 11 && cell.c >= 10 && cell.c <= 16
        ? `translateY(${TABLE_VERTICAL_OFFSET}px)`
        : specifyShift
          ? `translate(${specifyShift.x}px, ${specifyShift.y}px)`
          : specifyInputShift
            ? `translate(${specifyInputShift.x}px, ${specifyInputShift.y}px)`
            : labelShift
              ? `translateX(${labelShift}px)`
              : undefined,
    ...Object.fromEntries(
      Object.entries(cell.borders || {}).map(([side, borderValue]) => [
        `border${side[0].toUpperCase() + side.slice(1)}`,
        borderValue,
      ]),
    ),
  };

  if (!editable) {
    return (
      <div className="sched-o-cell" style={style}>
        {cell.v ?? ""}
      </div>
    );
  }

  const isDateCell =
    (cell.r === 8 && cell.c === 8) ||
    (cell.r === 13 && cell.c === 8) ||
    (cell.r === 21 && (cell.c === 4 || cell.c === 8));
  const isPhoneCell =
    cell.c === 7 && (cell.r === 32 || cell.r === 41 || cell.r === 52);

  if (isDateCell) {
    return (
      <div
        className={`sched-o-cell is-editable${selected ? " is-selected-table-row" : ""}`}
        style={{ ...style, zIndex: 15, overflow: "visible" }}
      >
        <DatePicker
          selected={parseDate(value)}
          onChange={(date) =>
            onChange(cell, date ? formatDateToString(date) : "")
          }
          onChangeRaw={(e) => {
            if (e?.target?.value !== undefined) {
              onChange(cell, e.target.value);
            }
          }}
          onKeyDown={handleDateKeyDown}
          dateFormat="MM/dd/yyyy"
          placeholderText="MM/DD/YYYY"
          portalId="datepicker-portal"
          popperPlacement="bottom-start"
          popperClassName="sched-o-datepicker-popper"
          className="sched-o-cell-editor"
          onFocus={() => onFocus?.(cell)}
          renderCustomHeader={renderCustomHeader}
        />
      </div>
    );
  }

  if (isPhoneCell) {
    return (
      <div
        className={`sched-o-cell is-editable${selected ? " is-selected-table-row" : ""}`}
        style={style}
      >
        <input
          className="sched-o-cell-editor"
          type="text"
          value={value ?? ""}
          onChange={(event) => {
            const clean = event.target.value.replace(/[^0-9+() -]/g, "");
            onChange(cell, clean);
          }}
          onFocus={() => onFocus?.(cell)}
          spellCheck={false}
          aria-label={`Input row ${cell.r}, column ${cell.c}`}
        />
      </div>
    );
  }

  const commonProps = {
    className: `sched-o-cell-editor${editorType === "number" ? " is-number" : ""}`,
    value: value ?? "",
    onChange: (event) => onChange(cell, event.target.value),
    onFocus: () => onFocus?.(cell),
    spellCheck: false,
    "aria-label": `Input row ${cell.r}, column ${cell.c}`,
  };

  return (
    <div
      className={`sched-o-cell is-editable${selected ? " is-selected-table-row" : ""}`}
      style={style}
    >
      {cell.wrap && editorType === "text" ? (
        <textarea {...commonProps} />
      ) : (
        <input
          {...commonProps}
          type={editorType}
          min={editorType === "number" && cell.c === 10 ? 0 : undefined}
          step={editorType === "number" ? "any" : undefined}
        />
      )}
    </div>
  );
}

function CheckboxOverlays({ selectedByGroup, setSelectedByGroup }) {
  const REGULATION_IDS = [
    "_x0000_s1037",
    "_x0000_s1038",
    "_x0000_s1039",
    "_x0000_s1040",
  ];
  const CAS_IDS = [
    "_x0000_s1041",
    "_x0000_s1042",
    "_x0000_s1043",
    "_x0000_s1044",
    "_x0000_s1045",
    "_x0000_s1046",
  ];
  const TINA_IDS = [
    "_x0000_s1047",
    "_x0000_s1048",
    "_x0000_s1049",
    "_x0000_s1050",
  ];

  const toggleCheckbox = (boxId) => {
    const group = CHECKBOX_GROUPS[boxId] || boxId;
    if (MULTI_SELECT_GROUPS.has(group)) {
      setSelectedByGroup((current) => {
        const currentList = Array.isArray(current[group])
          ? current[group]
          : current[group]
            ? [current[group]]
            : [];
        const nextSet = new Set(currentList);
        if (nextSet.has(boxId)) {
          nextSet.delete(boxId);
        } else {
          nextSet.add(boxId);
        }
        return { ...current, [group]: Array.from(nextSet) };
      });
    } else {
      setSelectedByGroup((current) =>
        current[group] === boxId
          ? { ...current, [group]: null }
          : { ...current, [group]: boxId },
      );
    }
  };

  const isChecked = (boxId) => {
    const group = CHECKBOX_GROUPS[boxId] || boxId;
    if (MULTI_SELECT_GROUPS.has(group)) {
      const val = selectedByGroup[group];
      return Array.isArray(val) ? val.includes(boxId) : val === boxId;
    }
    return selectedByGroup[group] === boxId;
  };

  const toggleSelectAll = (group, allIds) => {
    setSelectedByGroup((current) => {
      const currentList = Array.isArray(current[group])
        ? current[group]
        : current[group]
          ? [current[group]]
          : [];
      const isAllSelected = allIds.every((id) => currentList.includes(id));
      return {
        ...current,
        [group]: isAllSelected ? [] : [...allIds],
      };
    });
  };

  const isGroupAllSelected = (group, allIds) => {
    const currentList = Array.isArray(selectedByGroup[group])
      ? selectedByGroup[group]
      : selectedByGroup[group]
        ? [selectedByGroup[group]]
        : [];
    return allIds.length > 0 && allIds.every((id) => currentList.includes(id));
  };

  return (
    <>
      <div className="sched-o-item15-yes-no-header" aria-hidden="true">
        <span style={{ left: "510.8px" }}>YES</span>
        <span style={{ left: "593.2px" }}>NO</span>
      </div>
      <div className="sched-o-yes-no-header" aria-hidden="true">
        <span style={{ left: "510.8px" }}>YES</span>
        <span style={{ left: "593.2px" }}>NO</span>
      </div>

      {/* Select All: Procurement Regulations (placed right after specify line) */}
      <button
        type="button"
        className="sched-o-checkbox"
        aria-label="Select All Procurement Regulations"
        onClick={() => toggleSelectAll("regulations", REGULATION_IDS)}
        style={{
          left: "640px",
          top: "1110.0px",
          height: "22.4px",
          fontWeight: 700,
        }}
      >
        <span
          className={`sched-o-checkbox-box${isGroupAllSelected("regulations", REGULATION_IDS) ? " checked" : ""}`}
        >
          {isGroupAllSelected("regulations", REGULATION_IDS) ? "✓" : ""}
        </span>
        <span
          className="sched-o-checkbox-label"
          style={{ fontWeight: 700, color: "#103f4d" }}
        >
          Select All
        </span>
      </button>

      {/* Select All: Cost Accounting Standards (CAS) */}
      <button
        type="button"
        className="sched-o-checkbox"
        aria-label="Select All Cost Accounting Standards"
        onClick={() => toggleSelectAll("far-clause", CAS_IDS)}
        style={{
          left: "460px",
          top: "1210.0px",
          height: "23.2px",
          fontWeight: 700,
        }}
      >
        <span
          className={`sched-o-checkbox-box${isGroupAllSelected("far-clause", CAS_IDS) ? " checked" : ""}`}
        >
          {isGroupAllSelected("far-clause", CAS_IDS) ? "✓" : ""}
        </span>
        <span
          className="sched-o-checkbox-label"
          style={{ fontWeight: 700, color: "#103f4d" }}
        >
          Select All
        </span>
      </button>

      {/* Select All: Truth in Negotiations Act (TINA) (placed cleanly next to checkboxes without header overlap) */}
      <button
        type="button"
        className="sched-o-checkbox"
        aria-label="Select All TINA Options"
        onClick={() => toggleSelectAll("item-11-options", TINA_IDS)}
        style={{
          left: "540px",
          top: "1345.0px",
          height: "20.0px",
          fontWeight: 700,
        }}
      >
        <span
          className={`sched-o-checkbox-box${isGroupAllSelected("item-11-options", TINA_IDS) ? " checked" : ""}`}
        >
          {isGroupAllSelected("item-11-options", TINA_IDS) ? "✓" : ""}
        </span>
        <span
          className="sched-o-checkbox-label"
          style={{ fontWeight: 700, color: "#103f4d" }}
        >
          Select All
        </span>
      </button>

      {CHECKBOXES.map((box) => {
        const checked = isChecked(box.id);
        return (
          <button
            type="button"
            key={box.id}
            className="sched-o-checkbox"
            aria-pressed={checked}
            role="checkbox"
            aria-checked={checked}
            aria-label={box.label || box.id}
            onClick={() => toggleCheckbox(box.id)}
            style={{
              left: `${box.left}px`,
              top: `${box.top}px`,
              width: `${box.width}px`,
              height: `${box.height}px`,
            }}
          >
            <span
              className={`sched-o-checkbox-box${checked ? " checked" : ""}`}
            >
              {checked ? "✓" : ""}
            </span>
            {box.label && (
              <span className="sched-o-checkbox-label">{box.label}</span>
            )}
          </button>
        );
      })}
    </>
  );
}

function SupplOSheet({
  tabId = "suppl-o",
  initialHdr = null,
  currentYear = null,
  fiscalYearEnd = "",
  onFiscalYearChange,
  onRegisterSave,
  onHeaderSaved,
}) {
  const tabStorageKey = `${pageStorageKey}:${tabId}`;
  const cells = useMemo(() => {
    const covered = new Set();
    SHEET.merges.forEach(([r1, c1, r2, c2]) => {
      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          if (r !== r1 || c !== c1) covered.add(cellKey(r, c));
        }
      }
    });

    return SHEET.cells
      .filter((cell) => !covered.has(cellKey(cell.r, cell.c)))
      .filter(
        (cell) =>
          !(
            cell.r >= TABLE_ORIGINAL_ROW &&
            cell.r <= TABLE_SHEET_FRAME_END_ROW &&
            cell.c >= 10 &&
            cell.c <= 16
          ),
      )
      .map((cell) => {
        const merge = SHEET.merges.find(
          ([r1, c1]) => r1 === cell.r && c1 === cell.c,
        );
        return merge
          ? {
              ...cell,
              merge: [merge[2] - merge[0] + 1, merge[3] - merge[1] + 1],
            }
          : cell;
      });
  }, []);

  const [cellValues, setCellValues] = useState(() => {
    const initial = {};
    SHEET.cells.forEach((cell) => {
      initial[cellKey(cell.r, cell.c)] = EDITABLE_INPUT_CELLS.has(
        cellKey(cell.r, cell.c),
      )
        ? ""
        : (cell.v ?? "");
    });
    return initial;
  });

  const [originalContract, setOriginalContract] = useState(
    blankOriginalContract,
  );
  const [modifications, setModifications] = useState(() =>
    ensureModRows([], 1),
  );
  const [selectedModificationId, setSelectedModificationId] = useState(null);
  const [selectedByGroup, setSelectedByGroup] = useState(() =>
    Object.fromEntries(
      Object.keys(CHECKBOX_GROUPS).map((id) => [CHECKBOX_GROUPS[id], null]),
    ),
  );
  const [saveState, setSaveState] = useState("");

  const getTargetKeys = useCallback(() => {
    let year = currentYear || new Date().getFullYear();
    const awardDt =
      cellValues["8:8"] ||
      originalContract.date ||
      cellValues["21:4"] ||
      cellValues["13:8"];
    if (awardDt) {
      const iso = formatDateToISO(awardDt);
      if (iso && iso.length >= 4) {
        const parsedY = parseInt(iso.slice(0, 4), 10);
        if (!isNaN(parsedY) && parsedY > 1900) year = parsedY;
      }
    }
    const cntrName = (cellValues["5:12"] || cellValues["6:3"] || "").trim();
    const primeCntrNo = (
      cellValues["7:12"] ||
      cellValues["8:3"] ||
      cellValues["28:2"] ||
      ""
    ).trim();
    return { year, cntrName, primeCntrNo };
  }, [cellValues, originalContract, currentYear]);

  const populateFromHeader = useCallback((hdr) => {
    if (!hdr) return;
    setCellValues((prev) => {
      const next = { ...prev };
      if (hdr.cntrName != null) {
        next["5:12"] = hdr.cntrName;
        next["6:3"] = hdr.cntrName;
      }
      if (hdr.primeCntrNo != null) {
        next["7:12"] = hdr.primeCntrNo;
        next["8:3"] = hdr.primeCntrNo;
        next["28:2"] = hdr.primeCntrNo;
      }
      if (hdr.subcntrNo != null) {
        next["8:12"] = hdr.subcntrNo;
        next["9:3"] = hdr.subcntrNo;
      }
      if (hdr.awardDt) next["8:8"] = hdr.awardDt;
      if (hdr.cntrJobNo != null) next["10:3"] = String(hdr.cntrJobNo);
      if (hdr.fyFunds != null) next["10:8"] = hdr.fyFunds ? "Yes" : "No";
      if (hdr.totModNo != null) {
        next["13:3"] = String(hdr.totModNo);
        const n = parseInt(hdr.totModNo, 10);
        if (!isNaN(n) && n > 0) {
          setModifications((current) => ensureModRows(current, n));
        }
      }
      if (hdr.lastModDt) next["13:8"] = hdr.lastModDt;
      if (hdr.cntrTypeDetl) next["17:7"] = hdr.cntrTypeDetl;
      if (hdr.estimatedCost != null) next["19:2"] = String(hdr.estimatedCost);
      if (hdr.estimatedFee != null) next["19:5"] = String(hdr.estimatedFee);
      if (hdr.totPrice != null) next["19:8"] = String(hdr.totPrice);
      if (hdr.popStartDt) next["21:4"] = hdr.popStartDt;
      if (hdr.popEndDt) next["21:8"] = hdr.popEndDt;
      if (hdr.primeCntrName != null) next["26:2"] = hdr.primeCntrName;
      if (hdr.primeCntrAdd1 != null) next["30:2"] = hdr.primeCntrAdd1;
      if (hdr.primeCntrAdd2 != null) next["31:2"] = hdr.primeCntrAdd2;
      if (hdr.primeCntrPocName != null) next["32:2"] = hdr.primeCntrPocName;
      if (hdr.primeCntrPocPhone != null) next["32:7"] = hdr.primeCntrPocPhone;
      if (hdr.cogDcaaOffice != null) next["34:2"] = hdr.cogDcaaOffice;
      if (hdr.acqAgencyName != null) next["37:2"] = hdr.acqAgencyName;
      if (hdr.acqAgencyAdd1 != null) next["38:2"] = hdr.acqAgencyAdd1;
      if (hdr.acqAgencyAdd2 != null) next["39:2"] = hdr.acqAgencyAdd2;
      if (hdr.acqAgencyPocName != null) next["41:2"] = hdr.acqAgencyPocName;
      if (hdr.acqAgencyPocPhone != null) next["41:7"] = hdr.acqAgencyPocPhone;
      if (hdr.adminCntrOff != null) next["46:2"] = hdr.adminCntrOff;
      if (hdr.adminCntrOffAdd1 != null) next["49:2"] = hdr.adminCntrOffAdd1;
      if (hdr.adminCntrOffAdd2 != null) next["50:2"] = hdr.adminCntrOffAdd2;
      if (hdr.adminCntrOffPocName != null)
        next["52:2"] = hdr.adminCntrOffPocName;
      if (hdr.adminCntrOffPocPhone != null)
        next["52:7"] = hdr.adminCntrOffPocPhone;
      if (hdr.prRequlationsDetl != null) next["57:7"] = hdr.prRequlationsDetl;
      if (hdr.sowDetl != null) next["72:2"] = hdr.sowDetl;
      if (hdr.unallowCost != null) next["118:1"] = hdr.unallowCost;
      if (hdr.profitFeeOpt != null) next["122:1"] = hdr.profitFeeOpt;
      if (hdr.speclLimit != null) next["125:1"] = hdr.speclLimit;
      return next;
    });

    setSelectedByGroup((prev) => {
      const next = { ...prev };
      const typeToId = {
        CPFF: "_x0000_s1025",
        "T&M": "_x0000_s1026",
        CPIF: "_x0000_s1027",
        FPI: "_x0000_s1028",
        CS: "_x0000_s1029",
        IDIQ: "_x0000_s1030",
        CPAF: "_x0000_s1031",
        FFP: "_x0000_s1032",
        CR: "_x0000_s1033",
        Other: "_x0000_s1034",
      };
      if (hdr.cntrType && typeToId[hdr.cntrType])
        next["contract-type"] = typeToId[hdr.cntrType];
      if (hdr.subcntrFl != null)
        next["subcontract"] = hdr.subcntrFl ? "_x0000_s1035" : "_x0000_s1036";

      const regs = [];
      if (hdr.prFar || (hdr.prRequlations && hdr.prRequlations.includes("FAR")))
        regs.push("_x0000_s1037");
      if (
        hdr.prDfars ||
        (hdr.prRequlations && hdr.prRequlations.includes("DFARS"))
      )
        regs.push("_x0000_s1038");
      if (
        hdr.prNasa ||
        (hdr.prRequlations && hdr.prRequlations.includes("NASA"))
      )
        regs.push("_x0000_s1039");
      if (
        hdr.prOther ||
        (hdr.prRequlations && hdr.prRequlations.includes("Other"))
      )
        regs.push("_x0000_s1040");
      next["regulations"] = regs;

      const cas = [];
      if (
        hdr.caFar2301 ||
        (hdr.costAcctStd && hdr.costAcctStd.includes("52.230-1"))
      )
        cas.push("_x0000_s1041");
      if (
        hdr.caFar2302 ||
        (hdr.costAcctStd && hdr.costAcctStd.includes("52.230-2"))
      )
        cas.push("_x0000_s1043");
      if (
        hdr.caFar2303 ||
        (hdr.costAcctStd && hdr.costAcctStd.includes("52.230-3"))
      )
        cas.push("_x0000_s1045");
      if (
        hdr.caFar2304 ||
        (hdr.costAcctStd && hdr.costAcctStd.includes("52.230-4"))
      )
        cas.push("_x0000_s1042");
      if (
        hdr.caFar2305 ||
        (hdr.costAcctStd && hdr.costAcctStd.includes("52.230-5"))
      )
        cas.push("_x0000_s1044");
      if (
        hdr.caFar2306 ||
        (hdr.costAcctStd && hdr.costAcctStd.includes("52.230-6"))
      )
        cas.push("_x0000_s1046");
      next["far-clause"] = cas;

      const tinas = [];
      if (hdr.tina22 === "Y" || hdr.tina22 === "true" || hdr.tina22 === true)
        tinas.push("_x0000_s1047");
      if (hdr.tina23 === "Y" || hdr.tina23 === "true" || hdr.tina23 === true)
        tinas.push("_x0000_s1048");
      if (hdr.tina24 === "Y" || hdr.tina24 === "true" || hdr.tina24 === true)
        tinas.push("_x0000_s1049");
      if (hdr.tina25 === "Y" || hdr.tina25 === "true" || hdr.tina25 === true)
        tinas.push("_x0000_s1050");
      next["item-11-options"] = tinas;

      if (hdr.farCntrClause != null)
        next["item-15-yes-no"] = hdr.farCntrClause
          ? "_x0000_s1071"
          : "_x0000_s1072";
      if (hdr.tmFl != null)
        next["choice-1564"] = hdr.tmFl ? "_x0000_s1065" : "_x0000_s1066";
      if (hdr.costSharingFl != null)
        next["choice-1731"] = hdr.costSharingFl
          ? "_x0000_s1067"
          : "_x0000_s1068";
      if (hdr.lvlEffFl != null)
        next["choice-1793"] = hdr.lvlEffFl ? "_x0000_s1069" : "_x0000_s1070";
      if (hdr.ceilIndirFl != null)
        next["choice-1856"] = hdr.ceilIndirFl ? "_x0000_s1051" : "_x0000_s1052";
      if (hdr.fccmAllowFl != null)
        next["choice-1918"] = hdr.fccmAllowFl ? "_x0000_s1053" : "_x0000_s1054";
      if (hdr.farPenaltyFl != null)
        next["choice-2001"] = hdr.farPenaltyFl
          ? "_x0000_s1055"
          : "_x0000_s1056";
      if (hdr.preCntrFl != null)
        next["choice-2084"] = hdr.preCntrFl ? "_x0000_s1057" : "_x0000_s1058";
      if (hdr.otRestricFl != null)
        next["choice-2168"] = hdr.otRestricFl ? "_x0000_s1059" : "_x0000_s1060";
      if (hdr.subcRestricFl != null)
        next["choice-2230"] = hdr.subcRestricFl
          ? "_x0000_s1061"
          : "_x0000_s1062";
      return next;
    });
  }, []);

  const fetchDetails = useCallback(
    async (year, cntrName, primeCntrNo, targetCount = 1) => {
      if (!cntrName && !primeCntrNo) return;
      try {
        const queryParams = new URLSearchParams();
        if (cntrName) queryParams.append("cntrName", cntrName);
        if (primeCntrNo) queryParams.append("primeCntrNo", primeCntrNo);
        if (year) queryParams.append("year", year);

        const detlUrl = `${BASE_URL}/api/SupplODetl?${queryParams.toString()}`;
        const detlRes = await fetch(detlUrl, { headers: getAuthHeaders() });

        if (detlRes.ok) {
          const detls = await detlRes.json();
          if (Array.isArray(detls) && detls.length > 0) {
            const origRec = detls.find((d) => d.modNo === 0);
            if (origRec) {
              setOriginalContract({
                date: origRec.modDt || "",
                changeInFunding:
                  origRec.fundChngAmt != null
                    ? String(origRec.fundChngAmt)
                    : "",
                totalFunding:
                  origRec.totFundAmt != null ? String(origRec.totFundAmt) : "",
                cost: origRec.costAmt != null ? String(origRec.costAmt) : "",
                profitFee:
                  origRec.profitFeeAmt != null
                    ? String(origRec.profitFeeAmt)
                    : "",
                total:
                  origRec.totFundAmt != null ? String(origRec.totFundAmt) : "",
              });
            }

            const modRecs = detls
              .filter((d) => d.modNo > 0)
              .sort((a, b) => a.modNo - b.modNo)
              .map((d) => ({
                id: `mod-${d.modNo}`,
                modificationNumber: String(d.modNo),
                date: d.modDt || "",
                changeInFunding:
                  d.fundChngAmt != null ? String(d.fundChngAmt) : "",
                totalFunding: d.totFundAmt != null ? String(d.totFundAmt) : "",
                cost: d.costAmt != null ? String(d.costAmt) : "",
                profitFee: d.profitFeeAmt != null ? String(d.profitFeeAmt) : "",
                total: d.totFundAmt != null ? String(d.totFundAmt) : "",
              }));

            const requiredCount = Math.max(targetCount, modRecs.length, 1);
            setModifications(ensureModRows(modRecs, requiredCount));
          }
        }
      } catch (err) {
        console.warn("Could not fetch detail records:", err);
      }
    },
    [],
  );

  const fetchedTabIdRef = useRef("");

  useEffect(() => {
    const currentKey = `${tabId}-${initialHdr?.year || currentYear}-${initialHdr?.cntrName || ""}-${initialHdr?.primeCntrNo || ""}`;
    if (fetchedTabIdRef.current === currentKey) return;
    fetchedTabIdRef.current = currentKey;

    if (initialHdr) {
      populateFromHeader(initialHdr);
      if (initialHdr.originalContract) {
        setOriginalContract(initialHdr.originalContract);
      }
      const initialModCount =
        parseInt(
          initialHdr.totModNo || (initialHdr.modifications?.length ?? 1),
          10,
        ) || 1;
      if (
        Array.isArray(initialHdr.modifications) &&
        initialHdr.modifications.length > 0
      ) {
        setModifications(
          ensureModRows(initialHdr.modifications, initialModCount),
        );
      } else {
        setModifications(ensureModRows([], initialModCount));
      }
      if (initialHdr.cntrName || initialHdr.primeCntrNo) {
        fetchDetails(
          initialHdr.year || currentYear,
          initialHdr.cntrName,
          initialHdr.primeCntrNo,
          initialModCount,
        );
      }
    } else {
      try {
        const saved =
          typeof window !== "undefined"
            ? window.localStorage.getItem(tabStorageKey)
            : null;
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.cellValues && typeof parsed.cellValues === "object") {
            setCellValues((current) => ({ ...current, ...parsed.cellValues }));
          }
          if (parsed?.originalContract) {
            setOriginalContract({
              ...blankOriginalContract(),
              ...parsed.originalContract,
            });
          }
          if (Array.isArray(parsed?.modifications)) {
            setModifications(
              ensureModRows(
                parsed.modifications,
                parsed.modifications.length || 1,
              ),
            );
          }
          if (
            parsed?.selectedByGroup &&
            typeof parsed.selectedByGroup === "object"
          ) {
            setSelectedByGroup((current) => ({
              ...current,
              ...parsed.selectedByGroup,
            }));
          }
        }
      } catch {
        // ignore
      }
    }
  }, [
    tabId,
    initialHdr,
    currentYear,
    populateFromHeader,
    fetchDetails,
    tabStorageKey,
  ]);

  const setValue = (key, value) => {
    setCellValues((current) => {
      const next = { ...current, [key]: value };
      if (key === "5:12") next["6:3"] = value;
      else if (key === "6:3") next["5:12"] = value;
      else if (key === "7:12") {
        next["8:3"] = value;
        next["28:2"] = value;
      } else if (key === "8:3") {
        next["7:12"] = value;
        next["28:2"] = value;
      }
      return next;
    });
    if (key === "13:3") {
      const n = parseInt(value, 10);
      if (!isNaN(n) && n > 0) {
        setModifications((prev) => ensureModRows(prev, n));
      }
    }
    setSaveState("");
  };

  const updateCell = (cell, value) => {
    setValue(cellKey(cell.r, cell.c), value);
  };

  const handleCellFocus = () => {
    setSelectedModificationId(null);
  };

  const recalculateModRows = (orig, mods) => {
    const origFunding = parseNumeric(orig.changeInFunding) || 0;
    const origCost = parseNumeric(orig.cost) || 0;
    const origFee = parseNumeric(orig.profitFee) || 0;
    const origTotal =
      orig.cost || orig.profitFee ? origCost + origFee : origFunding;

    const updatedOrig = {
      ...orig,
      totalFunding: orig.changeInFunding
        ? String(origFunding)
        : orig.totalFunding || "",
      total:
        orig.cost || orig.profitFee || orig.changeInFunding
          ? String(origTotal)
          : orig.total || "",
    };

    let runningTotalFunding = origFunding;
    const updatedMods = mods.map((row) => {
      const changeAmt = parseNumeric(row.changeInFunding) || 0;
      if (
        row.changeInFunding !== "" &&
        row.changeInFunding !== null &&
        row.changeInFunding !== undefined
      ) {
        runningTotalFunding += changeAmt;
      }
      const costAmt = parseNumeric(row.cost) || 0;
      const feeAmt = parseNumeric(row.profitFee) || 0;
      const rowTotal =
        row.cost || row.profitFee
          ? costAmt + feeAmt
          : row.changeInFunding
            ? runningTotalFunding
            : parseNumeric(row.total) || "";

      return {
        ...row,
        totalFunding: row.changeInFunding
          ? String(runningTotalFunding)
          : row.totalFunding || "",
        total:
          row.cost || row.profitFee || row.changeInFunding
            ? String(rowTotal)
            : row.total || "",
      };
    });

    return { updatedOrig, updatedMods };
  };

  const handleOriginalChange = (field, value) => {
    setOriginalContract((current) => {
      const next = { ...current, [field]: value };
      if (
        field === "changeInFunding" ||
        field === "cost" ||
        field === "profitFee"
      ) {
        const { updatedOrig, updatedMods } = recalculateModRows(
          next,
          modifications,
        );
        setModifications(updatedMods);
        return updatedOrig;
      }
      return next;
    });
    setSaveState("");
  };

  const handleRowChange = (id, field, value) => {
    setModifications((current) => {
      const next = current.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      );
      if (
        field === "changeInFunding" ||
        field === "cost" ||
        field === "profitFee"
      ) {
        const { updatedMods } = recalculateModRows(originalContract, next);
        return updatedMods;
      }
      return next;
    });
    setSaveState("");
  };

  const handleNew = () => {
    if (modifications.length >= TABLE_MODIFICATION_SHEET_ROWS.length) return;
    const nextModNo = modifications.length + 1;
    const id = `mod-${Date.now()}-${nextModNo}-${Math.random().toString(36).slice(2, 5)}`;
    setModifications((current) => [
      ...current,
      blankTableRow(id, String(nextModNo)),
    ]);
    setSelectedModificationId(id);
    setSaveState("");
  };

  const handleTableDelete = async () => {
    if (!selectedModificationId) return;
    const target = modifications.find(
      (row) => row.id === selectedModificationId,
    );
    setModifications((current) =>
      current.filter((row) => row.id !== selectedModificationId),
    );
    setSelectedModificationId(null);
    setSaveState("");

    if (target && target.modificationNumber) {
      const { year, cntrName, primeCntrNo } = getTargetKeys();
      const modNo = parseInt(target.modificationNumber, 10);
      if (cntrName && primeCntrNo && !isNaN(modNo)) {
        try {
          const res = await fetch(
            `${BASE_URL}/api/SupplODetl?year=${year}&cntrName=${encodeURIComponent(cntrName)}&primeCntrNo=${encodeURIComponent(primeCntrNo)}&modNo=${modNo}`,
            { method: "DELETE", headers: getAuthHeaders() },
          );
          if (res.ok) {
            toast.success(`Modification #${modNo} deleted successfully.`);
          }
        } catch (err) {
          console.error("Error deleting modification:", err);
        }
      }
    }
  };

  const handleTableClear = () => {
    setOriginalContract(blankOriginalContract());
    setModifications(ensureModRows([], 1));
    setSelectedModificationId(null);
    setSaveState("");
  };

  const saveCurrentRef = useRef(null);

  const handlePageSave = async () => {
    const { year, cntrName, primeCntrNo } = getTargetKeys();

    if (!cntrName || !primeCntrNo) {
      toast.warning(
        "Please enter Contractor Name and Prime Contract Number before saving.",
      );
      return;
    }

    try {
      window.localStorage.setItem(
        tabStorageKey,
        JSON.stringify({
          cellValues,
          originalContract,
          modifications,
          selectedByGroup,
        }),
      );
    } catch {
      // ignore
    }

    const idToType = {
      _x0000_s1025: "CPFF",
      _x0000_s1026: "T&M",
      _x0000_s1027: "CPIF",
      _x0000_s1028: "FPI",
      _x0000_s1029: "CS",
      _x0000_s1030: "IDIQ",
      _x0000_s1031: "CPAF",
      _x0000_s1032: "FFP",
      _x0000_s1033: "CR",
      _x0000_s1034: "Other",
    };
    const cntrType = idToType[selectedByGroup["contract-type"]] || null;

    const regList = Array.isArray(selectedByGroup["regulations"])
      ? selectedByGroup["regulations"]
      : selectedByGroup["regulations"]
        ? [selectedByGroup["regulations"]]
        : [];

    const prFar = regList.includes("_x0000_s1037");
    const prDfars = regList.includes("_x0000_s1038");
    const prNasa = regList.includes("_x0000_s1039");
    const prOther = regList.includes("_x0000_s1040");
    const prDetl = cellValues["57:7"]?.trim() || null;

    if (prOther && !prDetl) {
      toast.warning(
        "Please specify the Other Procurement Regulation before saving.",
      );
      return;
    }

    const casList = Array.isArray(selectedByGroup["far-clause"])
      ? selectedByGroup["far-clause"]
      : selectedByGroup["far-clause"]
        ? [selectedByGroup["far-clause"]]
        : [];

    const caFar2301 = casList.includes("_x0000_s1041");
    const caFar2304 = casList.includes("_x0000_s1042");
    const caFar2302 = casList.includes("_x0000_s1043");
    const caFar2305 = casList.includes("_x0000_s1044");
    const caFar2303 = casList.includes("_x0000_s1045");
    const caFar2306 = casList.includes("_x0000_s1046");

    const tinaList = Array.isArray(selectedByGroup["item-11-options"])
      ? selectedByGroup["item-11-options"]
      : selectedByGroup["item-11-options"]
        ? [selectedByGroup["item-11-options"]]
        : [];

    const tina22 = tinaList.includes("_x0000_s1047");
    const tina23 = tinaList.includes("_x0000_s1048");
    const tina24 = tinaList.includes("_x0000_s1049");
    const tina25 = tinaList.includes("_x0000_s1050");

    const subcntrFl =
      selectedByGroup["subcontract"] === "_x0000_s1035"
        ? true
        : selectedByGroup["subcontract"] === "_x0000_s1036"
          ? false
          : null;
    const farCntrClause =
      selectedByGroup["item-15-yes-no"] === "_x0000_s1071"
        ? true
        : selectedByGroup["item-15-yes-no"] === "_x0000_s1072"
          ? false
          : null;
    const tmFl =
      selectedByGroup["choice-1564"] === "_x0000_s1065"
        ? true
        : selectedByGroup["choice-1564"] === "_x0000_s1066"
          ? false
          : null;
    const costSharingFl =
      selectedByGroup["choice-1731"] === "_x0000_s1067"
        ? true
        : selectedByGroup["choice-1731"] === "_x0000_s1068"
          ? false
          : null;
    const lvlEffFl =
      selectedByGroup["choice-1793"] === "_x0000_s1069"
        ? true
        : selectedByGroup["choice-1793"] === "_x0000_s1070"
          ? false
          : null;
    const ceilIndirFl =
      selectedByGroup["choice-1856"] === "_x0000_s1051"
        ? true
        : selectedByGroup["choice-1856"] === "_x0000_s1052"
          ? false
          : null;
    const fccmAllowFl =
      selectedByGroup["choice-1918"] === "_x0000_s1053"
        ? true
        : selectedByGroup["choice-1918"] === "_x0000_s1054"
          ? false
          : null;
    const farPenaltyFl =
      selectedByGroup["choice-2001"] === "_x0000_s1055"
        ? true
        : selectedByGroup["choice-2001"] === "_x0000_s1056"
          ? false
          : null;
    const preCntrFl =
      selectedByGroup["choice-2084"] === "_x0000_s1057"
        ? true
        : selectedByGroup["choice-2084"] === "_x0000_s1058"
          ? false
          : null;
    const otRestricFl =
      selectedByGroup["choice-2168"] === "_x0000_s1059"
        ? true
        : selectedByGroup["choice-2168"] === "_x0000_s1060"
          ? false
          : null;
    const subcRestricFl =
      selectedByGroup["choice-2230"] === "_x0000_s1061"
        ? true
        : selectedByGroup["choice-2230"] === "_x0000_s1062"
          ? false
          : null;

    const hdrPayload = {
      year,
      cntrName,
      primeCntrNo,
      subcntrNo: cellValues["8:12"] || cellValues["9:3"] || null,
      awardDt: formatDateToISO(cellValues["8:8"]),
      cntrJobNo: parseInteger(cellValues["10:3"]),
      fyFunds: (cellValues["10:8"] || "").toLowerCase().includes("yes")
        ? true
        : (cellValues["10:8"] || "").toLowerCase().includes("no")
          ? false
          : null,
      totModNo: parseInteger(cellValues["13:3"]),
      lastModDt: formatDateToISO(cellValues["13:8"]),
      cntrType,
      cntrTypeDetl: cellValues["17:7"] || null,
      estimatedCost: parseNumeric(cellValues["19:2"]),
      estimatedFee: parseNumeric(cellValues["19:5"]),
      totPrice: parseNumeric(cellValues["19:8"]),
      popStartDt: formatDateToISO(cellValues["21:4"]),
      popEndDt: formatDateToISO(cellValues["21:8"]),
      subcntrFl,
      primeCntrName: cellValues["26:2"] || null,
      primeCntrAdd1: cellValues["30:2"] || null,
      primeCntrAdd2: cellValues["31:2"] || null,
      primeCntrPocName: cellValues["32:2"] || null,
      primeCntrPocPhone: cellValues["32:7"] || null,
      cogDcaaOffice: cellValues["34:2"] || null,
      acqAgencyName: cellValues["37:2"] || null,
      acqAgencyAdd1: cellValues["38:2"] || null,
      acqAgencyAdd2: cellValues["39:2"] || null,
      acqAgencyPocName: cellValues["41:2"] || null,
      acqAgencyPocPhone: cellValues["41:7"] || null,
      adminCntrOff: cellValues["46:2"] || null,
      adminCntrOffAdd1: cellValues["49:2"] || null,
      adminCntrOffAdd2: cellValues["50:2"] || null,
      adminCntrOffPocName: cellValues["52:2"] || null,
      adminCntrOffPocPhone: cellValues["52:7"] || null,
      prFar,
      prDfars,
      prNasa,
      prOther,
      prDetl,
      prRequlations: prFar
        ? "FAR"
        : prDfars
          ? "DFARS"
          : prNasa
            ? "NASA"
            : prOther
              ? "Other"
              : null,
      prRequlationsDetl: prDetl,
      caFar2301,
      caFar2302,
      caFar2303,
      caFar2304,
      caFar2305,
      caFar2306,
      tina22,
      tina23,
      tina24,
      tina25,
      sowDetl: cellValues["72:2"] || null,
      farCntrClause,
      tmFl,
      costSharingFl,
      lvlEffFl,
      lvlEffDetl: null,
      ceilIndirFl,
      ceilIndirDetl: null,
      fccmAllowFl,
      farPenaltyFl,
      preCntrFl,
      preCntrDetl: null,
      otRestricFl,
      subcRestricFl,
      subcRestricDetl: cellValues["115:1"] || null,
      unallowCost: cellValues["118:1"] || null,
      profitFeeOpt: cellValues["122:1"] || null,
      speclLimit: cellValues["125:1"] || null,
    };

    const detlPayload = [];
    const usedModNos = new Set();

    if (
      originalContract.date ||
      originalContract.changeInFunding ||
      originalContract.totalFunding ||
      originalContract.cost
    ) {
      detlPayload.push({
        year,
        cntrName,
        primeCntrNo,
        subcntrNo: cellValues["8:12"] || null,
        modNo: 0,
        modDt: formatDateToISO(originalContract.date),
        fundChngAmt: parseNumeric(originalContract.changeInFunding),
        totFundAmt: parseNumeric(originalContract.totalFunding),
        costAmt: parseNumeric(originalContract.cost),
        profitFeeAmt: parseNumeric(originalContract.profitFee),
      });
      usedModNos.add(0);
    }

    modifications.forEach((mod, idx) => {
      const hasData =
        mod.modificationNumber ||
        mod.date ||
        mod.changeInFunding ||
        mod.totalFunding ||
        mod.cost ||
        mod.profitFee;
      if (!hasData) return;

      let rawModNo = parseInteger(mod.modificationNumber);
      if (rawModNo === null || rawModNo <= 0 || usedModNos.has(rawModNo)) {
        let nextNo = idx + 1;
        while (usedModNos.has(nextNo)) {
          nextNo++;
        }
        rawModNo = nextNo;
      }
      usedModNos.add(rawModNo);

      detlPayload.push({
        year,
        cntrName,
        primeCntrNo,
        subcntrNo: cellValues["8:12"] || null,
        modNo: rawModNo,
        modDt: formatDateToISO(mod.date),
        fundChngAmt: parseNumeric(mod.changeInFunding),
        totFundAmt: parseNumeric(mod.totalFunding),
        costAmt: parseNumeric(mod.cost),
        profitFeeAmt: parseNumeric(mod.profitFee),
      });
    });

    try {
      const hdrRes = await fetch(`${BASE_URL}/api/SupplOHdr/upsert`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(hdrPayload),
      });

      let detlSuccess = true;
      if (detlPayload.length > 0) {
        const detlRes = await fetch(`${BASE_URL}/api/SupplODetl/bulk-upsert`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(detlPayload),
        });
        detlSuccess = detlRes.ok;
      }

      if (hdrRes.ok && detlSuccess) {
        setSaveState("Saved");
        toast.success("Supplemental O saved successfully!");
        onHeaderSaved?.(hdrPayload);
        window.setTimeout(() => setSaveState(""), 2500);
      } else {
        const errJson = await hdrRes.json().catch(() => ({}));
        setSaveState("Save failed");
        toast.error(
          errJson.message || "Failed to save Supplemental O. Please try again.",
        );
      }
    } catch (err) {
      console.error("Save error:", err);
      setSaveState("Saved locally");
      toast.info("Supplemental O saved locally.");
    }
  };

  saveCurrentRef.current = handlePageSave;

  useEffect(() => {
    if (!onRegisterSave) return undefined;
    onRegisterSave(tabId, () => saveCurrentRef.current?.());
    return () => onRegisterSave(tabId, null);
  }, [onRegisterSave, tabId]);

  return (
    <div className="sched-o-page">
      <div className="sched-o-scroll">
        <div
          style={{
            padding: "8px 12px 6px 12px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#fff",
            marginBottom: "6px",
          }}
        >
          <span
            style={{
              font: "bold 11px Arial, sans-serif",
              color: "#000",
              whiteSpace: "nowrap",
            }}
          >
            FISCAL YEAR ENDED
          </span>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderBottom: "1px solid #000",
              padding: "0 2px",
              height: "18px",
            }}
          >
            <DatePicker
              selected={parseDate(fiscalYearEnd)}
              onChange={(date) =>
                onFiscalYearChange?.(date ? formatDateToString(date) : "")
              }
              onChangeRaw={(e) => {
                if (e?.target?.value !== undefined) {
                  onFiscalYearChange?.(e.target.value);
                }
              }}
              onKeyDown={handleDateKeyDown}
              dateFormat="MM/dd/yyyy"
              placeholderText="MM/DD/YYYY"
              portalId="datepicker-portal"
              popperPlacement="bottom-start"
              popperClassName="sched-o-datepicker-popper"
              className="sched-o-fy-center-input"
              renderCustomHeader={renderCustomHeader}
            />
            <Calendar
              size={13}
              color="#000"
              style={{
                pointerEvents: "none",
                flexShrink: 0,
                marginLeft: "3px",
              }}
            />
          </div>
        </div>
        <div
          className="sched-o-sheet"
          style={{
            gridTemplateColumns: SHEET.colWidths.map((w) => `${w}px`).join(" "),
            gridTemplateRows: SHEET.rowHeights.map((h) => `${h}px`).join(" "),
          }}
        >
          {cells.map((cell) => {
            const key = cellKey(cell.r, cell.c);
            if (HIDDEN_YES_NO_LABELS.has(key)) return null;
            const editable =
              EDITABLE_INPUT_CELLS.has(key) &&
              !(
                cell.r >= TABLE_ORIGINAL_ROW &&
                cell.r <= TABLE_SHEET_FRAME_END_ROW &&
                cell.c >= 10 &&
                cell.c <= 16
              );
            return (
              <Cell
                key={key}
                cell={cell}
                value={cellValues[key] ?? ""}
                editable={editable}
                editorType="text"
                onFocus={handleCellFocus}
                onChange={updateCell}
              />
            );
          })}

          <ModificationTableBody
            originalContract={originalContract}
            modifications={modifications}
            selectedId={selectedModificationId}
            onOriginalChange={handleOriginalChange}
            onRowChange={handleRowChange}
            onRowFocus={setSelectedModificationId}
            onSelectModification={setSelectedModificationId}
          />

          <CheckboxOverlays
            selectedByGroup={selectedByGroup}
            setSelectedByGroup={setSelectedByGroup}
          />

          <div
            className="sched-o-table-toolbar"
            style={{
              left: `${TABLE_LEFT}px`,
              top: `${TABLE_TOOLBAR_TOP}px`,
            }}
            aria-label="Table actions"
          >
            <button
              className="sched-o-action-new"
              type="button"
              onClick={handleNew}
              disabled={
                modifications.length >= TABLE_MODIFICATION_SHEET_ROWS.length
              }
            >
              New
            </button>
            <button
              className="sched-o-action-delete"
              type="button"
              onClick={handleTableDelete}
              disabled={!selectedModificationId}
            >
              Delete
            </button>
            <button
              className="sched-o-action-clear"
              type="button"
              onClick={handleTableClear}
            >
              Clear
            </button>
            <button
              className="sched-o-action-save"
              type="button"
              onClick={handlePageSave}
            >
              Save
            </button>
            {saveState && (
              <span className="sched-o-save-status">{saveState}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupplO({ fiscalYearEnd }) {
  const sheetSaveFns = useRef({});
  const [fiscalYearEndDate, setFiscalYearEndDate] = useState(
    () => `${fiscalYearEnd}`,
  );
  const [tabs, setTabs] = useState([
    { id: "suppl-o", label: "Suppl O", hdrData: null },
  ]);
  const [activeTabId, setActiveTabId] = useState("suppl-o");

  const selectedYear = useMemo(() => {
    const d = parseDate(fiscalYearEndDate);
    return d && !isNaN(d.getFullYear())
      ? d.getFullYear()
      : new Date().getFullYear();
  }, [fiscalYearEndDate]);

  useEffect(() => {
    let isCancelled = false;
    const fetchHeadersForYear = async () => {
      try {
        const [supplRes, schedRes] = await Promise.allSettled([
          fetch(`${BASE_URL}/api/SupplOHdr?year=${selectedYear}`, {
            headers: getAuthHeaders(),
          }),
          fetch(`${BASE_URL}/api/ScheduleO?year=${selectedYear}`, {
            headers: getAuthHeaders(),
          }),
        ]);

        if (isCancelled) return;

        let supplList = [];
        if (supplRes.status === "fulfilled" && supplRes.value.ok) {
          const json = await supplRes.value.json().catch(() => []);
          if (Array.isArray(json)) supplList = json;
        }

        let schedList = [];
        if (schedRes.status === "fulfilled" && schedRes.value.ok) {
          const json = await schedRes.value.json().catch(() => []);
          if (Array.isArray(json)) schedList = json;
        }

        const combinedTabs = [];
        const seenContractKeys = new Set();

        // 1. Add existing DB records from SupplOHdr
        supplList.forEach((hdr, idx) => {
          const contractKey = (hdr.primeCntrNo || "").trim().toLowerCase();
          if (contractKey) seenContractKeys.add(contractKey);

          const tabId = `suppl-o-${selectedYear}-hdr-${idx}-${encodeURIComponent(hdr.primeCntrNo || hdr.cntrName || idx + 1)}`;
          const label = hdr.primeCntrNo
            ? `Suppl O (${hdr.primeCntrNo})`
            : hdr.cntrName
              ? `Suppl O (${hdr.cntrName})`
              : `Suppl O (${idx + 1})`;
          combinedTabs.push({ id: tabId, label, hdrData: hdr });
        });

        // 2. Add SchedO items (CostType & TimeMaterial) that do not yet have a SupplOHdr record
        schedList.forEach((item, idx) => {
          const contractNo = (item.contractNo || "").trim();
          const contractKey = contractNo.toLowerCase();
          if (contractKey && seenContractKeys.has(contractKey)) {
            return;
          }
          if (contractKey) seenContractKeys.add(contractKey);

          const isCost = item.projType === "CostType";
          const startDt = item.popStartDt
            ? formatDateToString(parseDate(item.popStartDt)) || item.popStartDt
            : "";
          const endDt = item.popEndDt
            ? formatDateToString(parseDate(item.popEndDt)) || item.popEndDt
            : "";

          const mappedHdr = {
            year: selectedYear,
            cntrName: item.notes || contractNo || `Contract ${idx + 1}`,
            primeCntrNo: contractNo,
            subcntrNo: item.orderNo || null,
            popStartDt: startDt,
            popEndDt: endDt,
            cntrType: isCost ? "CPFF" : "T&M",
            estimatedCost: isCost
              ? item.cntrCeilingAmt != null
                ? item.cntrCeilingAmt
                : null
              : null,
            estimatedFee: item.feeAmt != null ? item.feeAmt : null,
            totPrice: item.cntrCeilingAmt != null ? item.cntrCeilingAmt : null,
            cntrJobNo: null,
            fyFunds: null,
            totModNo: 1,
            modifications: [],
          };

          const tabId = `suppl-o-${selectedYear}-sched-${idx}-${encodeURIComponent(contractNo || idx + 1)}`;
          const label = contractNo
            ? `Suppl O (${contractNo})`
            : `Suppl O (${combinedTabs.length + 1})`;
          combinedTabs.push({ id: tabId, label, hdrData: mappedHdr });
        });

        if (combinedTabs.length > 0) {
          setTabs(combinedTabs);
          setActiveTabId(combinedTabs[0].id);
          return;
        }

        const defaultId = `suppl-o-${selectedYear}-1`;
        setTabs([{ id: defaultId, label: "Suppl O (1)", hdrData: null }]);
        setActiveTabId(defaultId);
      } catch (err) {
        if (isCancelled) return;
        console.warn("Could not fetch Suppl O / Sched O headers list:", err);
        const defaultId = `suppl-o-${selectedYear}-1`;
        setTabs([{ id: defaultId, label: "Suppl O (1)", hdrData: null }]);
        setActiveTabId(defaultId);
      }
    };
    fetchHeadersForYear();
    return () => {
      isCancelled = true;
    };
  }, [selectedYear]);

  const registerSave = (tabId, fn) => {
    if (fn) sheetSaveFns.current[tabId] = fn;
    else delete sheetSaveFns.current[tabId];
  };

  const saveActiveSchedule = () => {
    const currentSave = sheetSaveFns.current[activeTabId];
    if (currentSave) {
      currentSave();
    }
  };

  const handleHeaderSaved = (tabId, savedHdr) => {
    if (!savedHdr) return;
    setTabs((current) =>
      current.map((t) => {
        if (t.id !== tabId) return t;
        const newLabel = savedHdr.primeCntrNo
          ? `Suppl O (${savedHdr.primeCntrNo})`
          : savedHdr.cntrName
            ? `Suppl O (${savedHdr.cntrName})`
            : t.label;
        return { ...t, label: newLabel, hdrData: savedHdr };
      }),
    );
  };

  const addTab = () => {
    setTabs((current) => {
      const nextNumber = current.length + 1;
      const id = `suppl-o-${selectedYear}-new-${Date.now()}`;
      const nextTabs = [
        ...current,
        { id, label: `Suppl O (${nextNumber})`, hdrData: null },
      ];
      setActiveTabId(id);
      return nextTabs;
    });
  };

  const deleteTab = async (tabToDelete) => {
    if (!tabToDelete) return;
    const tabId = tabToDelete.id;

    if (tabToDelete.hdrData) {
      const { year, cntrName, primeCntrNo } = tabToDelete.hdrData;
      const targetYear = year || selectedYear;
      if (cntrName && primeCntrNo) {
        const confirmed = window.confirm(
          `Are you sure you want to delete Schedule for contract "${primeCntrNo}"?`,
        );
        if (!confirmed) return;

        try {
          const res = await fetch(
            `${BASE_URL}/api/SupplOHdr?year=${targetYear || ""}&cntrName=${encodeURIComponent(cntrName)}&primeCntrNo=${encodeURIComponent(primeCntrNo)}`,
            { method: "DELETE", headers: getAuthHeaders() },
          );
          if (res.ok) {
            toast.success("Schedule deleted successfully.");
          } else {
            toast.error("Failed to delete schedule. Please try again.");
            return;
          }
        } catch (err) {
          console.error("Error deleting schedule:", err);
          toast.error("Unable to connect to server. Please try again.");
          return;
        }
      }
    }

    setTabs((current) => {
      if (current.length <= 1) {
        return [
          {
            id: `suppl-o-${selectedYear}-${Date.now()}`,
            label: "Suppl O (1)",
            hdrData: null,
          },
        ];
      }
      const nextTabs = current.filter((tab) => tab.id !== tabId);
      setActiveTabId((currentActive) => {
        if (currentActive !== tabId) return currentActive;
        return nextTabs[nextTabs.length - 1]?.id || nextTabs[0]?.id;
      });
      delete sheetSaveFns.current[tabId];
      try {
        window.localStorage.removeItem(`${pageStorageKey}:${tabId}`);
      } catch {
        // ignore
      }
      return nextTabs;
    });
  };

  const deleteActiveSchedule = () => {
    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (activeTab) {
      deleteTab(activeTab);
    }
  };

  return (
    <div className="sched-o-tabbed-app">
      <div id="datepicker-portal" />
      <div
        className="sched-o-tabs"
        role="tablist"
        aria-label="Supplemental O schedules"
      >
        <div className="sched-o-tab-list">
          {tabs.map((tab) => {
            const active = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                role="tab"
                aria-selected={active}
                className={`sched-o-tab${active ? " is-active" : ""}`}
              >
                <button
                  type="button"
                  className="sched-o-tab-label"
                  onClick={() => setActiveTabId(tab.id)}
                >
                  {tab.label}
                </button>
                {tabs.length > 1 && (
                  <button
                    type="button"
                    className="sched-o-tab-delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteTab(tab);
                    }}
                    aria-label={`Delete ${tab.label}`}
                    title={`Delete ${tab.label}`}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
          <button
            type="button"
            className="sched-o-tab-add"
            onClick={addTab}
            aria-label="Add Supplemental O tab"
            title="Add Supplemental O"
          >
            +
          </button>
        </div>

        <div className="sched-o-top-actions">
          <button
            type="button"
            className="sched-o-schedule-delete"
            onClick={deleteActiveSchedule}
            aria-label="Delete active Supplemental O schedule"
          >
            Delete
          </button>
          <button
            type="button"
            className="sched-o-schedule-save"
            onClick={saveActiveSchedule}
            aria-label="Save Supplemental O schedule"
          >
            Save
          </button>
        </div>
      </div>

      <div className="sched-o-tab-panels">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="sched-o-tab-panel"
            role="tabpanel"
            hidden={tab.id !== activeTabId}
            aria-hidden={tab.id !== activeTabId}
          >
            <SupplOSheet
              key={tab.id}
              tabId={tab.id}
              currentYear={selectedYear}
              fiscalYearEnd={fiscalYearEndDate}
              onFiscalYearChange={setFiscalYearEndDate}
              initialHdr={tab.hdrData}
              onRegisterSave={registerSave}
              onHeaderSaved={(hdr) => handleHeaderSaved(tab.id, hdr)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const styleId = "sched-o-exact-styles";
if (!document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .sched-o-fy-center-input {
      width: 72px;
      border: 0;
      outline: 0;
      font: bold 11px Arial, sans-serif;
      color: #000;
      background: transparent;
      padding: 0;
      cursor: pointer;
      text-align: center;
    }

    #datepicker-portal {
      position: relative;
      z-index: 99999999 !important;
    }

    .sched-o-tabbed-app {
      width: 100%;
      min-height: 100%;
      background: #fff;
      box-sizing: border-box;
    }

    .sched-o-tabs {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 6px 8px;
      box-sizing: border-box;
      background: #fff;
    }

    .sched-o-top-fy-bar {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 8px;
      background: #f2f4f6;
      border-radius: 8px;
      flex: 0 0 auto;
    }

    .sched-o-top-fy-label {
      font: 700 11px Arial, sans-serif;
      color: #20313a;
      white-space: nowrap;
    }

    .sched-o-top-fy-picker {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      background: #fff;
      border: 1px solid #c0c6cc;
      border-radius: 4px;
      padding: 1px 6px;
      height: 22px;
      box-sizing: border-box;
    }

    .sched-o-top-fy-input {
      width: 76px;
      border: 0;
      outline: 0;
      font: 700 11px Arial, sans-serif;
      color: #103f4d;
      background: transparent;
      padding: 0;
      cursor: pointer;
      text-align: center;
    }

    .sched-o-tab-list {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1 1 auto;
      min-width: 0;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .sched-o-tab-list::-webkit-scrollbar {
      display: none;
    }

    .sched-o-tab,
    .sched-o-tab-label,
    .sched-o-tab-delete,
    .sched-o-tab-add,
    .sched-o-schedule-save,
    .sched-o-schedule-delete {
      appearance: none;
      border: 0;
      margin: 0;
      cursor: pointer;
      box-sizing: border-box;
      white-space: nowrap;
      font: 700 11px Arial, sans-serif;
    }

    .sched-o-tab {
      min-height: 28px;
      padding: 0 8px 0 11px;
      border-radius: 8px;
      background: #f2f4f6;
      color: #20313a;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }

    .sched-o-tab.is-active {
      background: #103f4d;
      color: #fff;
    }

    .sched-o-tab-label {
      background: transparent;
      color: inherit;
      padding: 0;
      min-height: 26px;
      line-height: 26px;
    }

    .sched-o-tab-delete {
      width: 18px;
      height: 18px;
      padding: 0;
      border-radius: 4px;
      background: transparent;
      color: inherit;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      opacity: 0.9;
    }

    .sched-o-tab-delete svg {
      display: block;
      pointer-events: none;
    }

    .sched-o-tab-delete:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .sched-o-tab-add {
      width: 28px;
      min-width: 28px;
      height: 28px;
      border-radius: 8px;
      background: #f2f4f6;
      color: #103f4d;
      font-size: 17px;
      line-height: 28px;
      flex: 0 0 28px;
    }

    .sched-o-top-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 0 0 auto;
    }

    .sched-o-schedule-delete {
      min-width: 50px;
      height: 24px;
      padding: 0 8px;
      border-radius: 12px;
      background: #c53030;
      color: #fff;
      font-size: 10px;
      line-height: 24px;
      flex: 0 0 auto;
    }

    .sched-o-schedule-save {
      min-width: 50px;
      height: 24px;
      padding: 0 8px;
      border-radius: 12px;
      background: #103f4d;
      color: #fff;
      font-size: 10px;
      line-height: 24px;
      flex: 0 0 auto;
    }

    .sched-o-tab:hover,
    .sched-o-tab-label:hover,
    .sched-o-tab-add:hover,
    .sched-o-schedule-save:hover,
    .sched-o-schedule-delete:hover {
      filter: brightness(0.98);
    }

    .sched-o-tab-panels {
      width: 100%;
      box-sizing: border-box;
    }

    .sched-o-tab-panel[hidden] {
      display: none;
    }

    .react-datepicker-popper,
    .sched-o-datepicker-popper {
      z-index: 99999999 !important;
    }

    .react-datepicker-wrapper {
      width: 100% !important;
      height: 100% !important;
      display: inline-block !important;
    }

    .react-datepicker__input-container {
      width: 100% !important;
      height: 100% !important;
      display: flex !important;
      align-items: center !important;
    }

    .react-datepicker {
      font-family: Arial, sans-serif !important;
      font-size: 11px !important;
      border: 1px solid #c9dce8 !important;
      border-radius: 6px !important;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2) !important;
      background-color: #fff !important;
      overflow: visible !important;
    }

    .react-datepicker__header {
      background: #f0f6fa !important;
      border-bottom: 1px solid #c9dce8 !important;
      padding-top: 6px !important;
      border-top-left-radius: 6px !important;
      border-top-right-radius: 6px !important;
    }

    .react-datepicker__day-name,
    .react-datepicker__day {
      width: 24px !important;
      line-height: 24px !important;
      margin: 2px !important;
      font-size: 11px !important;
    }

    .react-datepicker__day--selected,
    .react-datepicker__day--keyboard-selected {
      background-color: #103f4d !important;
      color: #fff !important;
      border-radius: 4px !important;
    }

    .sched-o-table-toolbar {
      z-index: 10;
    }

    .sched-o-page {
      width: 100%;
      min-height: 100%;
      background: #fff;
      color: #000;
      font-family: Arial, sans-serif;
      box-sizing: border-box;
    }

    .sched-o-scroll {
      width: 100%;
      overflow: auto;
      background: #fff;
      border: 0;
      box-sizing: border-box;
    }

    .sched-o-sheet {
      display: grid;
      position: relative;
      width: max-content;
      min-width: max-content;
      background: #fff;
      box-sizing: border-box;
    }

    .sched-o-cell {
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      font-variant-numeric: tabular-nums;
      cursor: default;
    }

    .sched-o-cell.is-editable {
      cursor: text;
      background: rgba(59, 130, 246, 0.02);
    }

    .sched-o-cell.is-editable:focus-within {
      z-index: 30;
      outline: 2px solid #2563eb;
      outline-offset: -2px;
      background: #fff !important;
    }

    .sched-o-cell.is-selected-table-row {
      box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.18);
    }

    .sched-o-cell-editor {
      width: 100%;
      min-width: 0;
      height: 100%;
      min-height: 0;
      margin: 0;
      padding: 0 1px;
      border: 0;
      outline: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      font-weight: inherit;
      font-style: inherit;
      text-align: inherit;
      line-height: inherit;
      resize: none;
      box-sizing: border-box;
      border-radius: 0;
    }

    .sched-o-cell-editor.is-number {
      appearance: textfield;
      -moz-appearance: textfield;
    }

    .sched-o-cell-editor.is-number::-webkit-outer-spin-button,
    .sched-o-cell-editor.is-number::-webkit-inner-spin-button {
      margin: 0;
    }


    .sched-o-item15-yes-no-header {
      position: absolute;
      top: 1502px;
      left: 0;
      z-index: 22;
      width: 100%;
      height: 16px;
      pointer-events: none;
      font: 700 10px Arial, sans-serif;
      text-decoration: underline;
    }

    .sched-o-item15-yes-no-header span {
      position: absolute;
      width: 32px;
      text-align: center;
    }

    .sched-o-yes-no-header {
      position: absolute;
      top: 1656px;
      left: 0;
      z-index: 22;
      width: 100%;
      height: 16px;
      pointer-events: none;
      font: 700 10px Arial, sans-serif;
      text-decoration: underline;
    }

    .sched-o-yes-no-header span {
      position: absolute;
      width: 32px;
      text-align: center;
    }

    .sched-o-checkbox {
      position: absolute;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      box-sizing: border-box;
      font-family: Tahoma, Arial, sans-serif;
      font-size: 10px;
      line-height: 1;
      color: #000;
      white-space: nowrap;
      pointer-events: auto;
      border: 0;
      padding: 0;
      background: transparent;
      cursor: pointer;
      text-align: left;
    }

    .sched-o-checkbox-box {
      width: 12px;
      height: 12px;
      flex: 0 0 12px;
      box-sizing: border-box;
      border: 1px solid #000;
      background: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      font-size: 10px;
      line-height: 10px;
    }

    .sched-o-checkbox-box.checked {
      font-weight: 700;
    }

    .sched-o-checkbox-label {
      margin-left: 3px;
      display: inline-block;
      font-family: Tahoma, Arial, sans-serif;
      font-size: 10px;
      line-height: 12px;
    }

    .sched-o-table-body {
      position: absolute;
      z-index: 25;
      pointer-events: none;
      overflow: visible;
    }

    .sched-o-table-data-row {
      position: absolute;
      left: 0;
      width: 100%;
      display: grid;
      box-sizing: border-box;
      pointer-events: auto;
    }

    .sched-o-table-cell,
    .sched-o-table-static {
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      border-right: 1px solid #000;
      border-bottom: 1px solid #000;
      background: #fff;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 2px;
      font: 10px Arial, sans-serif;
      color: #000;
    }

    .sched-o-table-cell:first-child,
    .sched-o-table-static:first-child {
      border-left: 1px solid #000;
    }

    .sched-o-table-static {
      justify-content: flex-start;
      font-family: Arial, sans-serif;
      font-weight: 400;
      padding-left: 3px;
    }

    .sched-o-table-original-row .sched-o-table-cell,
    .sched-o-table-original-row .sched-o-table-static {
      border-top: 0;
    }

    .sched-o-table-data-row.is-selected .sched-o-table-cell {
      background: rgba(16, 63, 77, 0.06);
    }

    .sched-o-table-input {
      width: 100%;
      height: 100%;
      min-width: 0;
      margin: 0;
      padding: 0 1px;
      border: 0;
      outline: 0;
      background: transparent;
      color: #000;
      font: 10px Arial, sans-serif;
      line-height: normal;
      text-align: center;
      box-sizing: border-box;
    }

    .sched-o-table-input:focus {
      outline: 2px solid #103f4d;
      outline-offset: -2px;
      background: #fff;
    }

    .sched-o-table-input-number {
      appearance: textfield;
      -moz-appearance: textfield;
    }

    .sched-o-table-input-number::-webkit-outer-spin-button,
    .sched-o-table-input-number::-webkit-inner-spin-button {
      margin: 0;
    }

    .sched-o-table-toolbar {
      position: absolute;
      z-index: 45;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 5px;
      padding: 0;
      background: transparent;
      white-space: nowrap;
    }

    .sched-o-table-toolbar button {
      appearance: none;
      width: 42px;
      min-width: 42px;
      height: 20px;
      padding: 0 5px;
      margin: 0;
      border: 0;
      border-radius: 10px;
      color: #fff;
      font: 700 9px Arial, sans-serif;
      line-height: 20px;
      text-align: center;
      box-sizing: border-box;
      cursor: pointer;
      box-shadow: none;
      flex: 0 0 42px;
    }

    .sched-o-table-toolbar button:hover:not(:disabled) {
      filter: brightness(0.96);
    }

    .sched-o-table-toolbar button:active:not(:disabled) {
      transform: translateY(1px);
    }

    .sched-o-table-toolbar button:disabled {
      opacity: 0.5;
      cursor: default;
    }

    .sched-o-action-new,
    .sched-o-action-clear,
    .sched-o-action-save {
      background: #103f4d;
    }

    .sched-o-action-delete {
      background: #f89a9d;
    }

    .sched-o-save-status {
      font: 700 12px Arial, sans-serif;
      white-space: nowrap;
      margin-left: 2px;
      color: #103f4d;
    }

    @media print {
      .sched-o-page {
        background: #fff;
      }
      .sched-o-scroll {
        border: 0;
        overflow: visible;
      }
      .sched-o-sheet {
        transform-origin: top left;
      }
      .sched-o-table-toolbar {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);
}
