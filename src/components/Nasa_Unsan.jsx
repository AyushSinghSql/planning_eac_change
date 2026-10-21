import React, { useState } from "react";

// ---------------------------------------------------------------------------
// NASA Contractor Task Report (NNG17HP01C) — fully editable recreation
// of pages 1 & 2 of the source PDF. Every field is a live <input>/<textarea>.
// ---------------------------------------------------------------------------

const MONTHS = [
  "Jan-25",
  "Feb-25",
  "Mar-25",
  "Apr-25",
  "May-25",
  "Jun-25",
  "Jul-25",
  "Aug-25",
  "Sep-25",
  "Oct-25",
  "Nov-25",
  "Dec-25",
];

const initialHeader = {
  contractNumber: "NNG17HP01C",
  contractorLine1: "Columbus Technologies, Inc.",
  contractorLine2: "California",
  date: "Aug 27, 2026",
  originator: "",
  placeOfPerformance: "NASA Goddard Space Flight Center",
  tpocName: "",
  tpocCode: "",
  taskDescription: "Modeling",
  taskNumber: "1",
  taskMod: "CY9_Rev 14",
  wbsNumber: "",
  taskStartDate: "March 1, 2025",
  continuation: "N",
  taskEndDate: "August 31, 2025",
  cumActualThru: "02/29/25",
};

const initialLaborRows = [
  {
    label: "Program Manager   M1PMO",
    hours: [
      "-0.4",
      "-1.3",
      "-1.2",
      "-1.2",
      "-1.3",
      "-1.2",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    rate: "99.24",
    cost: ["-6.6", "$0", "-$647", "$0"],
    cum: [""],
    total: "",
  },
  {
    label: "Dep Program Manager   M2PMO",
    hours: [
      "-0.4",
      "-1.5",
      "-1.4",
      "-1.3",
      "-1.5",
      "-1.4",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    rate: "98.89",
    cost: ["-7.5", "$0", "-$737", "$0"],
    cum: [""],
    total: "",
  },
  {
    label: "Sr. Contract Admin   M4PMO",
    hours: [
      "-0.6",
      "-1.9",
      "-1.8",
      "-1.7",
      "-1.9",
      "-1.8",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    rate: "47.48",
    cost: ["-9.6", "$0", "-$457", "$0"],
    cum: [""],
    total: "",
  },
  {
    label: "St. Contract Admin   M5PMO",
    hours: [
      "-0.1",
      "-0.3",
      "-0.3",
      "-0.3",
      "-0.3",
      "-0.3",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    rate: "35.69",
    cost: ["-1.6", "$0", "-$55", "$0"],
    cum: [""],
    total: "",
  },
  {
    label: "Sr. Admin Assistant   M6PMO",
    hours: [
      "-0.4",
      "-1.2",
      "-1.2",
      "-1.1",
      "-1.2",
      "-1.2",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    rate: "42.57",
    cost: ["-6.2", "$0", "-$264", "$0"],
    cum: [""],
    total: "",
  },
  {
    label: "St. Admin Assistant   M7PMO",
    hours: [
      "-0.4",
      "-1.2",
      "-1.2",
      "-1.1",
      "-1.2",
      "-1.2",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    rate: "33.22",
    cost: ["-6.2", "$0", "-$206", "$0"],
    cum: [""],
    total: "",
  },
  {
    label: "DP-B Oloso IDIQ   SS-CPLD",
    hours: [
      "-0.6",
      "-1.9",
      "-1.8",
      "-1.7",
      "-1.9",
      "-1.8",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    rate: "86.83",
    cost: ["-9.5", "-$825", "$0", "$0"],
    cum: [""],
    total: "",
  },
  {
    label: "Frazer, Michelle   FRA004629",
    hours: [
      "156.0",
      "163.0",
      "156.0",
      "148.0",
      "163.0",
      "157.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    rate: "48.08",
    cost: ["943.0", "$45,337", "$0", "$0"],
    cum: [""],
    total: "",
  },
  {
    label: "Khani, Sina   KHA004626",
    hours: [
      "156.0",
      "163.0",
      "156.0",
      "148.0",
      "163.0",
      "157.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    rate: "57.69",
    cost: ["943.0", "$54,404", "$0", "$0"],
    cum: [""],
    total: "",
  },
  {
    label: "Scientist II   SA-CSC2",
    hours: [
      "-312.0",
      "-326.0",
      "-312.0",
      "-296.0",
      "-326.0",
      "-314.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    rate: "80.78",
    cost: ["-1886.0", "-$152,351", "$0", "$0"],
    cum: [""],
    total: "",
  },
  {
    label: "Scientific Programmer/Analyst   SIPII3",
    hours: [
      "0.0",
      "-163.0",
      "-156.0",
      "-148.0",
      "-163.0",
      "-157.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    rate: "53.08",
    cost: ["-787.0", "$0", "-$41,774", "$0"],
    cum: [""],
    total: "",
  },
  {
    label: "Takacs, Lawrence L   SS-CSC4",
    hours: [
      "-70.2",
      "-73.4",
      "-70.2",
      "-66.6",
      "-73.4",
      "-70.7",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    rate: "74.84",
    cost: ["-424.4", "-$31,758", "$0", "$0"],
    cum: [""],
    total: "",
  },
  {
    label: "",
    hours: ["", "", "", "", "", "", "", "", "", "", "", ""],
    rate: "",
    cost: ["", "", "", ""],
    cum: [""],
  },
  {
    label: "",
    hours: ["", "", "", "", "", "", "", "", "", "", "", ""],
    rate: "",
    cost: ["", "", "", ""],
    cum: [""],
  },
];

const initialHourSummary = [
  {
    label: "Onsite DL Hours",
    values: [
      "241.2",
      "250.8",
      "240.0",
      "227.7",
      "250.8",
      "241.6",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Offsite DL Hours",
    values: [
      "-2.2",
      "-170.3",
      "-163.0",
      "-154.7",
      "-170.3",
      "-164.1",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Total Prime Direct Labor Hours",
    values: [
      "239.1",
      "80.5",
      "77.0",
      "73.1",
      "80.5",
      "77.5",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Onsite Subcontractor Hours",
    values: [
      "-312.0",
      "-326.0",
      "-312.0",
      "-296.0",
      "-326.0",
      "-314.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Total Subcontractor Hours",
    values: [
      "-312.0",
      "-326.0",
      "-312.0",
      "-296.0",
      "-326.0",
      "-314.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Total Hours",
    values: [
      "-72.9",
      "-245.5",
      "-235.0",
      "-222.9",
      "-245.5",
      "-236.5",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
      "0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "",
    values: ["", "", "", "", "", "", "", "", "", "", "", ""],
    cum: ["", ""],
  },
];

const initialDollarSummary = [
  {
    label: "Onsite DL Dollars",
    values: [
      "$11,195",
      "$11,590.0",
      "$11,092.0",
      "$10,523.0",
      "$11,590.0",
      "$11,163.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Offsite DL Dollars",
    values: [
      "-$137.0",
      "-$9,114.0",
      "-$8,723.0",
      "-$8,275.0",
      "-$9,114.0",
      "-$8,779.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Total Prime Direct Labor Dollars",
    values: [
      "$11,061.0",
      "$2,476.0",
      "$2,370.0",
      "$2,248.0",
      "$2,476.0",
      "$2,385.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "",
    values: ["", "", "", "", "", "", "", "", "", "", "", ""],
    cum: ["", ""],
  },
  // { label: "", values: ["", "", "", "", "", "", "", "", "", "", "", ""], cum: ["", "", "", ""], total: "" },
  {
    label: "Onsite Overhead",
    values: [
      "$4,345.7",
      "$4,499.0",
      "$4,306.0",
      "$4,085.0",
      "$4,499.0",
      "$4,334.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Offsite Overhead",
    values: [
      "-$62.1",
      "-$4,130.0",
      "-$3,953.0",
      "-$3,750.0",
      "-$4,130.0",
      "-$3,978.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Total Prime Overhead",
    values: [
      "$4,283.7",
      "$369.0",
      "$353.0",
      "$335.0",
      "$369.0",
      "$355.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "",
    values: ["", "", "", "", "", "", "", "", "", "", "", ""],
    cum: ["", ""],
  },
  // { label: "", values: ["", "", "", "", "", "", "", "", "", "", "", ""], cum: ["", "", "", ""], total: "" },
  {
    label: "Subcontractor - SAIC",
    values: [
      "-$25,203.0",
      "-$26,334.0",
      "-$25,203.0",
      "-$23,911.0",
      "-$26,334.0",
      "-$25,365.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Other",
    values: [
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Total ODCs",
    values: [
      "-$25,203.0",
      "-$26,334.0",
      "-$25,203.0",
      "-$23,911.0",
      "-$26,334.0",
      "-$25,365.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "",
    values: ["", "", "", "", "", "", "", "", "", "", "", ""],
    cum: ["", ""],
  },
  // { label: "", values: ["", "", "", "", "", "", "", "", "", "", "", ""], cum: ["", "", "", ""], total: "" },
  {
    label: "Subtotal (Labor, Overhead & ODCs)",
    values: [
      "-$9,858.3",
      "-$23,490.0",
      "-$22,481.0",
      "-$21,328.0",
      "-$23,490.0",
      "-$22,625.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "G&A Expense",
    values: [
      "$945.2",
      "$175.0",
      "$168.0",
      "$159.0",
      "$175.0",
      "$169.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Sub and Material Handling",
    values: [
      "-$305.0",
      "-$319.0",
      "-$305.0",
      "-$289.0",
      "-$319.0",
      "-$307.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Total Estimated Cost",
    values: [
      "-$9,217.0",
      "-$23,633.0",
      "-$22,618.0",
      "-$21,458.0",
      "-$23,633.0",
      "-$22,763.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Fixed Fee",
    values: [
      "-$571.5",
      "-$1,465.0",
      "-$1,402.0",
      "-$1,330.0",
      "-$1,465.0",
      "-$1,411.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
  {
    label: "Total Cost Plus Fixed Fee (CPFF)",
    values: [
      "-$9,788.5",
      "-$25,098.0",
      "-$24,021.0",
      "-$22,789.0",
      "-$25,098.0",
      "-$24,174.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
      "$0.0",
    ],
    cum: ["", ""],
  },
];

const initialCostSummary = [
  {
    no: "18.",
    label: "Direct Labor",
    sub: "",
    values: ["$67,157", "-$44,142", "$0", "$0", "$23,015"],
    cum: ["", "", "", ""],
    total: "",
  },
  {
    no: "19.",
    label: "Overhead",
    sub: "Onsite 38.82%   Offsite 45.32%   0.0%   0.0%",
    values: ["$26,070", "-$20,005", "$0", "$0", "$6,065"],
    cum: ["", "", "", ""],
    total: "",
  },
  {
    no: "20.",
    label: "Total Labor",
    sub: "",
    values: ["$93,227", "-$64,147", "$0", "$0", "$29,080"],
    cum: ["", "", "", ""],
    total: "",
  },
  {
    no: "21.",
    label: "Subcontractors",
    sub: "",
    values: ["-$152,351", "$0", "$0", "$0", "-$152,351"],
    cum: ["", "", "", ""],
    total: "",
  },
  {
    no: "22.",
    label: "Materials",
    sub: "",
    values: ["$0", "$0", "$0", "$0", "$0"],
    cum: ["", "", "", ""],
    total: "",
  },
  {
    no: "23.",
    label: "Travel",
    sub: "",
    values: ["$0", "$0", "$0", "$0", "$0"],
    cum: ["", "", "", ""],
    total: "",
  },
  {
    no: "24.",
    label: "Other",
    sub: "",
    values: ["$0", "$0", "$0", "$0", "$0"],
    cum: ["", "", "", ""],
    total: "",
  },
  {
    no: "25.",
    label: "Total ODCs",
    sub: "",
    values: ["-$152,351", "$0", "$0", "$0", "-$152,351"],
    cum: ["", "", "", ""],
    total: "",
  },
  {
    no: "26.",
    label: "Sub-Total",
    sub: "",
    values: ["-$59,124", "-$64,147", "$0", "$0", "-$123,270"],
    cum: ["", "", "", ""],
    total: "",
  },
  {
    no: "27.",
    label: "General & Administrative",
    sub: "6.16%",
    values: ["$5,743", "-$3,951", "$0", "$0", "$1,791"],
    cum: ["", "", "", ""],
    total: "",
  },
  {
    no: "28.",
    label: "Sub and Material Handling",
    sub: "1.21%",
    values: ["-$1,843", "$0", "$0", "$0", "-$1,843"],
    cum: ["", "", "", ""],
    total: "",
  },
  {
    no: "29.",
    label: "Total Cost",
    sub: "",
    values: ["-$55,225", "-$68,098", "$0", "$0", "-$123,323"],
    cum: ["", "", "", ""],
    total: "",
  },
  {
    no: "30.",
    label: "Fixed Fee",
    sub: "6.20%",
    values: ["-$3,424", "-$4,222", "$0", "$0", "-$7,646"],
    cum: ["", "", "", ""],
    total: "",
  },
  {
    no: "31.",
    label: "Total Price",
    sub: "",
    values: ["-$58,649", "-$72,320", "$0", "$0", "-$130,969"],
    cum: ["", "", "", ""],
    total: "",
  },
];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function useEditableRows(initial) {
  const [rows, setRows] = useState(initial);
  const update = (rowIdx, field, val, cellIdx = null) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== rowIdx) return r;
        if (cellIdx === null) return { ...r, [field]: val };
        const arr = [...r[field]];
        arr[cellIdx] = val;
        return { ...r, [field]: arr };
      }),
    );
  };
  return [rows, update];
}

function Cell({
  value,
  onChange,
  width = "w-14",
  align = "text-center",
  bold = false,
  placeholder = "",
}) {
  return (
    <td className="border border-black p-0 align-middle">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${width} ${align} block bg-transparent text-[8px] leading-tight outline-none focus:bg-yellow-100 px-0.5 py-[3px] placeholder:text-gray-300 ${
          bold ? "font-bold" : ""
        }`}
      />
    </td>
  );
}

function LabelCell({ value, onChange, width = "w-40", bold = false }) {
  return (
    <td className="border border-black p-0 align-middle bg-white">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${width} block bg-transparent text-[8px] leading-tight outline-none focus:bg-yellow-100 px-1 py-[3px] ${
          bold ? "font-bold" : ""
        }`}
      />
    </td>
  );
}

function Field({ label, value, onChange, className = "flex-1" }) {
  return (
    <div className={`flex items-baseline gap-1 px-1 py-0.5 ${className}`}>
      <span className="text-[7px] font-bold whitespace-nowrap text-black">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 bg-transparent border-b border-black text-[9px] outline-none focus:bg-yellow-100 px-1"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header block (repeats identically at the top of page 1 and page 2)
// ---------------------------------------------------------------------------

function FormHeader({ header, setHeader }) {
  const h = (key) => (val) => setHeader((prev) => ({ ...prev, [key]: val }));
  return (
    <div className="border-2 border-black text-black font-serif">
      <div className="text-center border-b-2 border-black py-1">
        <div className="text-[11px] font-bold tracking-wide">
          NATIONAL AERONAUTICS AND SPACE ADMINISTRATION
        </div>
        <div className="text-[10px] font-semibold">Contractor Task Report</div>
      </div>
      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-3 border-r border-black">
          <Field
            label="1. CONTRACT NUMBER:"
            value={header.contractNumber}
            onChange={h("contractNumber")}
          />
        </div>
        <div className="col-span-6 border-r border-black">
          <div className="flex items-baseline gap-1 px-1 py-0.5">
            <span className="text-[7px] font-bold whitespace-nowrap">
              2. CONTRACTOR NAME:
            </span>
            <input
              value={header.contractorLine1}
              onChange={(e) => h("contractorLine1")(e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-b border-black text-[9px] outline-none focus:bg-yellow-100 px-1"
            />
          </div>
          <div className="px-1 pb-0.5">
            <input
              value={header.contractorLine2}
              onChange={(e) => h("contractorLine2")(e.target.value)}
              className="w-full bg-transparent border-b border-black text-[9px] outline-none focus:bg-yellow-100 px-1 ml-16"
            />
          </div>
        </div>
        <div className="col-span-3">
          <Field label="3. DATE:" value={header.date} onChange={h("date")} />
        </div>
      </div>
      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-3 border-r border-black">
          <Field
            label="4. ORIGINATOR:"
            value={header.originator}
            onChange={h("originator")}
          />
        </div>
        <div className="col-span-4 border-r border-black">
          <Field
            label="5. PLACE OF PERFORMANCE:"
            value={header.placeOfPerformance}
            onChange={h("placeOfPerformance")}
          />
        </div>
        <div className="col-span-3 border-r border-black">
          <Field
            label="6. GOVT. TPOC Name:"
            value={header.tpocName}
            onChange={h("tpocName")}
          />
        </div>
        <div className="col-span-2">
          <Field
            label="6a. TPOC CODE:"
            value={header.tpocCode}
            onChange={h("tpocCode")}
          />
        </div>
      </div>
      <div className="border-b border-black">
        <Field
          label="7. TASK DESCRIPTION:"
          value={header.taskDescription}
          onChange={h("taskDescription")}
        />
      </div>
      <div className="grid grid-cols-12 border-b border-black">
        <div className="col-span-3 border-r border-black">
          <Field
            label="8. TASK NUMBER:"
            value={header.taskNumber}
            onChange={h("taskNumber")}
          />
        </div>
        <div className="col-span-4 border-r border-black">
          <Field
            label="8A. TASK MOD:"
            value={header.taskMod}
            onChange={h("taskMod")}
          />
        </div>
        <div className="col-span-5">
          <Field
            label="9. WBS NUMBER:"
            value={header.wbsNumber}
            onChange={h("wbsNumber")}
          />
        </div>
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-4 border-r border-black">
          <Field
            label="10. TASK START DATE:"
            value={header.taskStartDate}
            onChange={h("taskStartDate")}
          />
        </div>
        <div className="col-span-3 border-r border-black">
          <Field
            label="11. CONTINUATION (Y/N):"
            value={header.continuation}
            onChange={h("continuation")}
          />
        </div>
        <div className="col-span-5">
          <Field
            label="12. TASK END DATE:"
            value={header.taskEndDate}
            onChange={h("taskEndDate")}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function NASAContractorTaskReport() {
  const [header, setHeader] = useState(initialHeader);
  const [laborRows, updateLabor] = useEditableRows(initialLaborRows);
  const [hourSummary, updateHourSummary] = useEditableRows(initialHourSummary);
  const [dollarSummary, updateDollarSummary] =
    useEditableRows(initialDollarSummary);
  const [costSummary, updateCostSummary] = useEditableRows(initialCostSummary);
  const [remarks, setRemarks] = useState("");

  return (
    <div className="bg-gray-200 min-h-screen py-4 px-2 font-serif">
      {/* ================= PAGE 1 ================= */}
      <div
        className="bg-white mx-auto shadow-lg mb-10"
        style={{ width: "1500px" }}
      >
        <div className="text-right text-[8px] pb-1">Page 1 of 2</div>
        <FormHeader header={header} setHeader={setHeader} />

        <div className="overflow-x-auto mt-2">
          <table className="border-collapse border-2 border-black w-full table-fixed">
            <thead>
              <tr>
                <th
                  rowSpan={2}
                  className="border border-black bg-gray-100 text-[8px] font-bold w-40 px-1"
                >
                  13. REPORTING CATEGORY
                </th>
                <th
                  colSpan={12}
                  className="border border-black bg-gray-100 text-[8px] font-bold"
                >
                  14. Monthly Hours Detail
                </th>
                <th
                  rowSpan={2}
                  className="border border-black bg-gray-100 text-[8px] font-bold w-14"
                >
                  15. Avg $ Rate/Hr
                </th>
                <th
                  rowSpan={2}
                  className="border border-black bg-gray-100 text-[8px] font-bold w-16"
                >
                  m. TOTAL
                </th>
                <th
                  colSpan={4}
                  className="border border-black bg-gray-100 text-[8px] font-bold"
                >
                  16. ESTIMATED COST
                </th>
                <th
                  colSpan={1}
                  className="border border-black bg-gray-100 text-[8px] font-bold"
                >
                  <div className=" justify-center gap-1">
                    <span>17. Cum Actual Thru</span>
                    <input
                      value={header.cumActualThru}
                      onChange={(e) =>
                        setHeader((p) => ({
                          ...p,
                          cumActualThru: e.target.value,
                        }))
                      }
                      className="w-14 text-center bg-transparent border-b border-black outline-none focus:bg-yellow-100 text-[8px] font-bold"
                    />
                  </div>
                </th>
              </tr>
              <tr>
                {MONTHS.map((m) => (
                  <th
                    key={m}
                    className="border border-black bg-gray-100 text-[7px] font-bold w-12"
                  >
                    {m}
                  </th>
                ))}
                <th className="border border-black bg-gray-100 text-[7px] font-bold w-14">
                  a. Onsite
                </th>
                <th className="border border-black bg-gray-100 text-[7px] font-bold w-14">
                  b. Offsite
                </th>
                <th className="border border-black bg-gray-100 text-[7px] font-bold w-10">
                  c.
                </th>
                <th className="border border-black bg-gray-100 text-[7px] font-bold w-10">
                  d.
                </th>
                {/* <th className="border border-black bg-gray-100 text-[7px] font-bold w-16">a. Onsite</th> */}
                {/* <th className="border border-black bg-gray-100 text-[7px] font-bold w-16">b. Offsite</th>
                <th className="border border-black bg-gray-100 text-[7px] font-bold w-10">c.</th>
                <th className="border border-black bg-gray-100 text-[7px] font-bold w-10">d.</th> */}
              </tr>
            </thead>
            <tbody>
              {laborRows.map((row, ri) => (
                <tr key={ri}>
                  <LabelCell
                    value={row.label}
                    onChange={(v) => updateLabor(ri, "label", v)}
                  />
                  {row.hours.map((v, ci) => (
                    <Cell
                      key={ci}
                      value={v}
                      onChange={(val) => updateLabor(ri, "hours", val, ci)}
                      width="w-12"
                    />
                  ))}
                  <Cell
                    value={row.rate}
                    onChange={(v) => updateLabor(ri, "rate", v)}
                    width="w-14"
                  />
                  {row.cost.map((v, ci) => (
                    <Cell
                      key={ci}
                      value={v}
                      onChange={(val) => updateLabor(ri, "cost", val, ci)}
                      width="w-14"
                    />
                  ))}
                  {row.cum.map((v, ci) => (
                    <Cell
                      key={ci}
                      value={v}
                      onChange={(val) => updateLabor(ri, "cum", val, ci)}
                      width={ci < 2 ? "w-16" : "w-10"}
                      placeholder=""
                    />
                  ))}
                  <Cell
                    value={row.total}
                    onChange={(v) => updateLabor(ri, "total", v)}
                    width="w-16"
                    placeholder=""
                  />
                </tr>
              ))}

              {hourSummary.map((row, ri) => (
                <tr key={`hs-${ri}`}>
                  <LabelCell
                    value={row.label}
                    onChange={(v) => updateHourSummary(ri, "label", v)}
                    bold
                  />
                  {row.values.map((v, ci) => (
                    <Cell
                      key={ci}
                      value={v}
                      onChange={(val) =>
                        updateHourSummary(ri, "values", val, ci)
                      }
                      width="w-12"
                      bold
                    />
                  ))}
                  <Cell value="" onChange={() => {}} width="w-14" />
                  <Cell value="" onChange={() => {}} width="w-14" />
                  <Cell value="" onChange={() => {}} width="w-10" />
                  <Cell value="" onChange={() => {}} width="w-10" />
                  {row.cum.map((v, ci) => (
                    <Cell
                      key={ci}
                      value={v}
                      onChange={(val) => updateHourSummary(ri, "cum", val, ci)}
                      width={ci < 2 ? "w-16" : "w-10"}
                      bold
                      placeholder=""
                    />
                  ))}
                  <Cell
                    value={row.total}
                    onChange={(v) => updateHourSummary(ri, "total", v)}
                    width="w-16"
                    bold
                    placeholder=""
                  />
                </tr>
              ))}

              {dollarSummary.map((row, ri) => {
                const last = ri === dollarSummary.length - 1;
                return (
                  <tr key={`ds-${ri}`} className={last ? "bg-gray-100" : ""}>
                    <LabelCell
                      value={row.label}
                      onChange={(v) => updateDollarSummary(ri, "label", v)}
                      bold
                    />
                    {row.values.map((v, ci) => (
                      <Cell
                        key={ci}
                        value={v}
                        onChange={(val) =>
                          updateDollarSummary(ri, "values", val, ci)
                        }
                        width="w-12"
                        bold
                      />
                    ))}
                    <Cell value="" onChange={() => {}} width="w-14" />
                    <Cell value="" onChange={() => {}} width="w-14" />
                    <Cell value="" onChange={() => {}} width="w-10" />
                    <Cell value="" onChange={() => {}} width="w-10" />
                    {row.cum.map((v, ci) => (
                      <Cell
                        key={ci}
                        value={v}
                        onChange={(val) =>
                          updateDollarSummary(ri, "cum", val, ci)
                        }
                        width={ci < 2 ? "w-16" : "w-10"}
                        bold
                        placeholder=""
                      />
                    ))}
                    <Cell
                      value={row.total}
                      onChange={(v) => updateDollarSummary(ri, "total", v)}
                      width="w-16"
                      bold
                      placeholder=""
                    />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-[8px] italic px-1 pt-2 pb-1">
          Cumulative-actual figures above default to blank (task period began{" "}
          {header.taskStartDate || "the task start date"}, so no prior actuals
          were captured in the source report) — click any cell to enter the real
          cumulative-to-date value.
        </div>
      </div>

      {/* ================= PAGE 2 ================= */}
      <div
        className="bg-white mx-auto shadow-lg p-3"
        style={{ width: "1500px" }}
      >
        <div className="text-right text-[8px] pb-1">Page 2 of 2</div>
        <FormHeader header={header} setHeader={setHeader} />

        <div className="overflow-x-auto mt-4">
          <table className="border-collapse border-2 border-black">
            <thead>
              <tr>
                <th className="border border-black bg-gray-100 text-[8px] font-bold w-56 px-1">
                  COST ELEMENT
                </th>
                <th className="border border-black bg-gray-100 text-[7px] font-bold w-20">
                  a. Onsite
                </th>
                <th className="border border-black bg-gray-100 text-[7px] font-bold w-20">
                  b. Offsite
                </th>
                <th className="border border-black bg-gray-100 text-[7px] font-bold w-12">
                  c.
                </th>
                <th className="border border-black bg-gray-100 text-[7px] font-bold w-12">
                  d.
                </th>
                <th className="border border-black bg-gray-100 text-[7px] font-bold w-20">
                  m. TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {costSummary.map((row, ri) => {
                const emphasize = [
                  "Total Labor",
                  "Total ODCs",
                  "Sub-Total",
                  "Total Cost",
                  "Total Price",
                ].includes(row.label);
                return (
                  <tr key={ri} className={emphasize ? "bg-gray-100" : ""}>
                    <td className="border border-black p-0">
                      <div className="flex items-baseline gap-1 px-1">
                        <input
                          value={row.no}
                          onChange={(e) =>
                            updateCostSummary(ri, "no", e.target.value)
                          }
                          className="w-6 bg-transparent text-[8px] font-bold outline-none focus:bg-yellow-100"
                        />
                        <input
                          value={row.label}
                          onChange={(e) =>
                            updateCostSummary(ri, "label", e.target.value)
                          }
                          className={`flex-1 bg-transparent text-[8px] outline-none focus:bg-yellow-100 py-[3px] ${
                            emphasize ? "font-bold" : ""
                          }`}
                        />
                      </div>
                      {row.sub !== "" && (
                        <input
                          value={row.sub}
                          onChange={(e) =>
                            updateCostSummary(ri, "sub", e.target.value)
                          }
                          className="w-full bg-transparent text-[7px] italic outline-none focus:bg-yellow-100 px-1 pb-[2px]"
                        />
                      )}
                    </td>
                    {row.values.map((v, ci) => (
                      <Cell
                        key={ci}
                        value={v}
                        onChange={(val) =>
                          updateCostSummary(ri, "values", val, ci)
                        }
                        width="w-20"
                        bold={emphasize}
                      />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-2 border-black border-t-0 mt-0">
          <div className="text-[8px] font-bold px-1 py-0.5 border-b border-black">
            36. REMARKS:
          </div>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            className="w-full bg-transparent text-[9px] outline-none focus:bg-yellow-100 px-1 py-1 resize-y"
            placeholder="Enter remarks here..."
          />
        </div>
      </div>
    </div>
  );
}
