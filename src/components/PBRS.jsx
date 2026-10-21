import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  BarChart3,
  Users,
  Clock,
  Database,
  FileSpreadsheet,
  CalendarDays,
  Settings2,
  Table as TableIcon,
  DollarSign,
  LayoutGrid,
  Calendar,
  ArrowUpDown,
  FileText,
  Activity,
  Package,
} from "lucide-react";

// --- DATA GENERATORS (100 Records Each) ---

const generateBTGLData = () => {
  return Array.from({ length: 100 }, (_, i) => ({
    status: i % 10 === 0 ? "Actual" : "Estimated",
    fy: 2026,
    pd: (i % 12) + 1,
    projId: i % 3 === 0 ? "OH001" : i % 3 === 1 ? "10090" : "10860",
    projName: i % 3 === 0 ? "OH" : i % 3 === 1 ? "ADAPT" : "ARES",
    accId: i % 2 === 0 ? "7010-001" : "5000-001",
    accName: i % 2 === 0 ? "OH RENT" : "DIRECT LABOR",
    desc: "Line Item Detail " + (i + 1),
    amount: (Math.random() * 1000).toFixed(2),
    increase: "0%",
    fy26Amt: (Math.random() * 1200).toFixed(2),
  }));
};

const generateLaborDistData = () => {
  return Array.from({ length: 100 }, (_, i) => {
    const obj = {
      emp:
        [
          "Albanese, Joseph",
          "Aldridge, Aaron",
          "Alessi, Noah",
          "Andres, Stefan",
          "Armstrong, Alan",
        ][i % 5] +
        " (" +
        (1000 + i) +
        ")",
      acc: i % 2 === 0 ? "5400-001" : "5000-001",
      sal: (50000 + Math.random() * 50000).toFixed(2),
    };
    // Sequential 1-12
    for (let m = 1; m <= 12; m++) {
      obj[m] = (Math.random() * 160).toFixed(1);
    }
    obj.total = (Math.random() * 2000).toFixed(1);
    obj.notes = i % 10 === 0 ? "Reallocated" : "";
    return obj;
  });
};

const generateNonLaborData = () => {
  return Array.from({ length: 100 }, (_, i) => ({
    projId: i % 3 === 0 ? "OH001" : i % 3 === 1 ? "10090" : "10860",
    projName: i % 3 === 0 ? "OH" : i % 3 === 1 ? "ADAPT" : "ARES",
    category: ["Travel", "Materials", "Supplies", "Consultants"][i % 4],
    vendor: ["Amazon", "Delta Air", "Staples", "General Tech"][i % 4],
    poNumber: "PO-2026-" + (5000 + i),
    fy25Actuals: (Math.random() * 5000).toFixed(2),
    fy26Estimates: (Math.random() * 6000).toFixed(2),
    variance: (Math.random() * 500).toFixed(2),
  }));
};

const generateGL25Data = () => {
  return Array.from({ length: 100 }, (_, i) => ({
    accId: "7000-001",
    accName: "OVERHEAD LABOR",
    mapping: "Overhead Labor",
    pool: "OVERHEAD",
    hl: "Labor",
    tag: "OH",
    beg: 0,
    prior: 0,
    orgId: "1.01.10",
    orgName: "DIRECT COSTS",
    pd: (i % 12) + 1,
    seq: i + 1,
    idName: "ID-" + (100 + i),
    empName: "Staff Member " + (i + 1),
    projName: "OH001.001.0" + (i % 9),
    btProj: "OH001",
    voucher: "",
    type: "Labor Posting",
    po: "",
    je: "LD",
    check: "",
    cash: "",
    inv: "",
    ts: "2025-01-01",
    desc: "LD Posting Detail",
    hrs: (Math.random() * 40).toFixed(1),
    amt: (Math.random() * 500).toFixed(2),
    tAmt: (Math.random() * 500).toFixed(2),
    crncy: "USD",
  }));
};

// --- STATIC DATA ---

// --- Updated PBR_REPORT_DATA with Revenue Section ---

const PBR_REPORT_DATA = [
  { level: 0, label: "Revenue:", value: null },
  { level: 2, label: "Program Revenue", value: 12450000.0 },
  { level: 2, label: "Grant Revenue", value: 850000.0 },
  { level: 2, label: "Other Operating Revenue", value: 125400.0 },
  { level: 0, label: "Total Revenue:", value: 13425400.0, isTotal: true },
  { level: 0, label: "", value: null }, // Spacer line
  { level: 0, label: "Overhead:", value: null },
  { level: 1, label: "Overhead Expenses:", value: null },
  { level: 2, label: "DESCRIPTION", value: "Provisional 2026", isHeader: true },
  { level: 2, label: "Labor Accounts", value: null, isSubHeader: true },
  { level: 3, label: "Overhead Labor", value: 2059486.58 },
  { level: 3, label: "Overhead Fringe", value: 863863.99 },
  { level: 2, label: "Total Labor Accounts", value: 2923350.57, isTotal: true },
  {
    level: 2,
    label: "Payroll Taxes and Fringes",
    value: null,
    isSubHeader: true,
  },
  { level: 3, label: "401k Company Match", value: 125005.45 },
  {
    level: 3,
    label: "FICA/FUTA/Unemployment Tax - Employer",
    value: 545415.31,
  },
  {
    level: 2,
    label: "Total Payroll Taxes & Fringes",
    value: 1067714.18,
    isTotal: true,
  },
  { level: 2, label: "OH Rates", value: "161.11%", isTotal: true },

  { level: 0, label: "G&A:", value: null },
  { level: 1, label: "G&A Expenses:", value: null },
  { level: 2, label: "DESCRIPTION", value: "Provisional 2026", isHeader: true },
  { level: 2, label: "Labor Accounts", value: null, isSubHeader: true },
  { level: 3, label: "G&A Labor", value: 2059486.58 },
  { level: 3, label: "G&A Fringe", value: 863863.99 },
  { level: 2, label: "Total Labor Accounts", value: 2923350.57, isTotal: true },
  {
    level: 2,
    label: "G&A Indirect Labor",
    value: "1,901,671",
    isSubHeader: true,
  },
  {
    level: 2,
    label: "G&A Other Indirect",
    value: "316,729",
    isSubHeader: true,
  },
  {
    level: 2,
    label: "G&A Travel",
    value: "316,729",
    isSubHeader: true,
  },
  {
    level: 2,
    label: "G&A Conference & Mtg.",
    value: "316,729",
    isSubHeader: true,
  },
  {
    level: 2,
    label: "G&A Business Meals",
    value: "316,729",
    isSubHeader: true,
  },
  { level: 3, label: "Total Labor", value: "2,218,399" },
  {
    level: 3,
    label: "FICA/FUTA/Unemployment Tax - Employer",
    value: 545415.31,
  },
  {
    level: 2,
    label: "Total Payroll Taxes & Fringes",
    value: 1067714.18,
    isTotal: true,
  },
  {
    level: 2,
    label: "G&A Rates",
    value: "79.89%",
    isTotal: true,
  },
];

const DRAFT_RATES_DATA = [
  {
    pool: "Overhead Pool",
    total: 8262278.15,
    p1: 567371.65,
    p2: 540262.38,
    p3: 434067.28,
    p4: 431897.94,
    p5: 378244.37,
    p6: 500407.04,
    p7: 607717.8,
    p8: 557383.93,
    p9: 453252.89,
    p10: 438350.3,
    p11: 481308.07,
    p12: 1111303.82,
  },
  {
    pool: "Overhead Base",
    total: 6082544.4,
    p1: 196863.88,
    p2: 272299.73,
    p3: 424734.56,
    p4: 339865.3,
    p5: 276091.26,
    p6: 264600.36,
    p7: 324068.26,
    p8: 335494.58,
    p9: 379776.53,
    p10: 410608.38,
    p11: 446469.91,
    p12: 393101.43,
  },
  {
    pool: "Overhead Rate %",
    total: 135.84,
    p1: 288.21,
    p2: 198.41,
    p3: 102.2,
    p4: 127.08,
    p5: 137.0,
    p6: 189.12,
    p7: 187.53,
    p8: 166.14,
    p9: 119.35,
    p10: 106.76,
    p11: 107.8,
    p12: 282.7,
  },
  {
    pool: "G&A Pool",
    total: 13022404.58,
    p1: 705571.68,
    p2: 630364.72,
    p3: 600591.97,
    p4: 439926.91,
    p5: 554073.78,
    p6: 454706.86,
    p7: 505087.4,
    p8: 517825.76,
    p9: 547085.32,
    p10: 707328.27,
    p11: 664485.46,
    p12: 999288.26,
  },
  {
    pool: "G&A Base",
    total: 5864458.33,
    p1: 491919.52,
    p2: 420004.39,
    p3: 328495.82,
    p4: 330921.9,
    p5: 383799.28,
    p6: 309956.84,
    p7: 318425.08,
    p8: 304165.33,
    p9: 354263.13,
    p10: 530551.79,
    p11: 464828.59,
    p12: 608257.06,
  },
  {
    pool: "G&A Rate %",
    total: 222.0,
    p1: 143.35,
    p2: 150.08,
    p3: 182.87,
    p4: 132.9,
    p5: 144.46,
    p6: 146.79,
    p7: 158.68,
    p8: 170.29,
    p9: 154.34,
    p10: 133.33,
    p11: 142.97,
    p12: 164.3,
  },
];

const TOTAL_HOURS_DATA = [
  {
    emp: "Albanese, Joseph",
    rif: "",
    avail: 20,
    direct: 20,
    ga: 0,
    oh: 0,
    ird: 0,
    util: "100%",
    assigned: 20,
    var: 0,
    notes: "Reallocated",
  },
  {
    emp: "ALDRIDGE, AARON M. (1063)",
    rif: "",
    avail: 803.8,
    direct: 0,
    ga: 803.8,
    oh: 0,
    ird: 0,
    util: "0%",
    assigned: 803.8,
    var: 0,
    notes: "",
  },
  {
    emp: "ALESSI, NOAH M. (253)",
    rif: "",
    avail: 2293,
    direct: 1741.5,
    ga: 0,
    oh: 200.32,
    ird: 352.5,
    util: "75.9%",
    assigned: 2294.32,
    var: -1.32,
    notes: "75% IR&D to ARES",
  },
];

// --- HELPER COMPONENTS ---

const PBRReportABC = ({ data }) => (
  <div className="bg-white p-16 max-w-5xl mx-auto shadow-2xl border border-slate-200 font-serif min-h-screen my-8">
    <div className="text-center mb-10 space-y-1 border-b-2 border-slate-900 pb-6 ">
      <h2 className="text-xl font-bold tracking-[0.2em]">
        PIASECKI AIRCRAFT CORPORATION
      </h2>
      <h3 className="text-lg font-bold underline">
        INDIRECT RATE CALCULATIONS
      </h3>
    </div>
    <table className="w-full">
      <tbody>
        {data.map((row, i) => (
          <tr
            key={i}
            className={
              row.isHeader ? "border-b-2 border-slate-900 font-bold" : ""
            }
          >
            <td
              className={`py-1 text-[13px] ${row.level === 0 ? "font-black" : ""} ${row.level === 1 ? "font-bold pl-4  text-slate-600" : ""} ${row.level === 2 ? "pl-8 font-semibold" : ""} ${row.level === 3 ? "pl-12 italic text-slate-500" : ""}`}
            >
              {row.label}
            </td>
            <td
              className={`text-right py-1 text-[13px] font-mono w-48 ${row.isTotal ? "border-t-2 border-slate-900 font-black" : ""} ${row.isHeader ? "text-slate-400 font-bold  text-[10px]" : ""}`}
            >
              {typeof row.value === "number"
                ? `$${row.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                : row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const UniversalGrid = ({
  columns,
  data,
  searchTerm,
  hideCurrencySymbol = false,
}) => {
  const [sort, setSort] = useState({ key: null, dir: "asc" });

  const processedData = useMemo(() => {
    let result = [...data];
    if (searchTerm) {
      result = result.filter((row) =>
        Object.values(row).some((v) =>
          String(v).toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }
    if (sort.key) {
      result.sort((a, b) => {
        const aV = a[sort.key] ?? "",
          bV = b[sort.key] ?? "";
        return sort.dir === "asc" ? (aV > bV ? 1 : -1) : aV < bV ? 1 : -1;
      });
    }
    return result;
  }, [data, sort, searchTerm]);

  return (
    <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-lg h-[650px]">
      <table className="w-full text-left border-collapse min-w-max">
        <thead className="bg-slate-50 border-b-2 border-slate-200 sticky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() =>
                  setSort({
                    key: col.key,
                    dir: sort.dir === "asc" ? "desc" : "asc",
                  })
                }
                className="px-4 py-4 text-[10px] font-black text-slate-500  tracking-widest cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {col.label} <ArrowUpDown className="w-3 h-3 opacity-30" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono text-xs">
          {processedData.map((row, i) => (
            <tr
              key={i}
              className={`hover:bg-blue-50/40 transition-colors ${row.pool && row.pool.includes("Rate") ? "bg-blue-50/20 italic" : ""}`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3.5 text-slate-700 ${row.pool && (row.pool.includes("Pool") || row.pool.includes("Base")) ? "font-bold" : ""}`}
                >
                  {col.format === "currency" && typeof row[col.key] === "number"
                    ? hideCurrencySymbol
                      ? row[col.key].toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })
                      : `$${row[col.key].toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function ControllerDashboard() {
  const [activeTab, setActiveTab] = useState("pbr");
  const [search, setSearch] = useState("");

  // Instantiate Large Datasets
  const gl26Data = useMemo(() => generateBTGLData(), []);
  const laborData = useMemo(() => generateLaborDistData(), []);
  const gl25Data = useMemo(() => generateGL25Data(), []);
  const nonLaborData = useMemo(() => generateNonLaborData(), []);

  const tabs = [
    { id: "pbr", label: "FY27 PBR", icon: DollarSign },
    { id: "rates", label: "FY27 Provisional Rates", icon: TableIcon },
    // { id: "gl", label: "BT FY27 GL", icon: FileSpreadsheet },
    { id: "labdist", label: "Labor Distribution", icon: Users },
    { id: "nonlabor", label: "Non-Labor", icon: Package },
    // { id: "hours", label: "Total Hours", icon: Clock },
    { id: "gl25", label: "FY26 GL Detail", icon: LayoutGrid },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-10 py-6 sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-50">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 ">
              PBR
            </h1>
            {/* <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] mt-0.5 ">PAC Controller Division | Ref: 10-02-2025</p> */}
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="text"
              placeholder="Filter records..."
              className="w-full pl-11 pr-4 py-3 border border-slate-100 rounded-2xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none text-sm font-medium transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-xs font-black tracking-widest flex items-center gap-2">
            <Download className="w-4 h-4" /> EXPORT
          </button>
        </div>
      </header>

      {/* Content Container */}
      <div className="p-8 lg:p-12 max-w-[1900px] mx-auto space-y-10">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black text-[11px]  tracking-[0.2em] transition-all border-2 ${activeTab === t.id ? "bg-slate-900 text-white border-slate-900 shadow-2xl scale-105" : "bg-white text-slate-400 border-slate-100 hover:border-blue-200"}`}
            >
              <t.icon
                className={`w-4 h-4 ${activeTab === t.id ? "text-blue-400" : "text-slate-300"}`}
              />{" "}
              {t.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in duration-700">
          {activeTab === "pbr" && <PBRReport data={PBR_REPORT_DATA} />}

          {activeTab === "rates" && (
            <UniversalGrid
              searchTerm={search}
              data={DRAFT_RATES_DATA}
              hideCurrencySymbol={true}
              columns={[
                { key: "pool", label: "Overhead Pool" },
                { key: "total", label: "Total Year", format: "currency" },
                ...Array.from({ length: 12 }, (_, i) => ({
                  key: `p${i + 1}`,
                  label: `P${i + 1}`,
                  format: "currency",
                })),
              ]}
            />
          )}

          {activeTab === "gl" && (
            <UniversalGrid
              searchTerm={search}
              data={gl26Data}
              columns={[
                { key: "status", label: "Estimated / Actuals" },
                { key: "fy", label: "FY" },
                { key: "pd", label: "Period" },
                { key: "projId", label: "Project ID" },
                { key: "projName", label: "Project Name" },
                { key: "accId", label: "Account ID" },
                { key: "accName", label: "Account Name" },
                { key: "desc", label: "Description" },
                { key: "amount", label: "Amount" },
                { key: "increase", label: "% Increase" },
                { key: "fy26Amt", label: "FY26 Amount", format: "currency" },
              ]}
            />
          )}

          {activeTab === "labdist" && (
            <UniversalGrid
              searchTerm={search}
              data={laborData}
              columns={[
                { key: "emp", label: "Employee" },
                { key: "acc", label: "Account ID" },
                { key: "sal", label: "Adj Salary", format: "currency" },
                ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => ({
                  key: String(n),
                  label: `P${n}`,
                })),
                { key: "total", label: "Total" },
                { key: "notes", label: "Notes" },
              ]}
            />
          )}

          {activeTab === "nonlabor" && (
            <UniversalGrid
              searchTerm={search}
              data={nonLaborData}
              columns={[
                { key: "projId", label: "Project ID" },
                { key: "projName", label: "Project Name" },
                { key: "category", label: "Category" },
                { key: "vendor", label: "Vendor" },
                { key: "poNumber", label: "PO Number" },
                {
                  key: "fy25Actuals",
                  label: "FY25 Actuals",
                  format: "currency",
                },
                {
                  key: "fy26Estimates",
                  label: "FY26 Estimates",
                  format: "currency",
                },
                { key: "variance", label: "Variance", format: "currency" },
              ]}
            />
          )}

          {activeTab === "hours" && (
            <UniversalGrid
              searchTerm={search}
              data={TOTAL_HOURS_DATA}
              columns={[
                { key: "emp", label: "Employee" },
                { key: "rif", label: "RIF?" },
                { key: "avail", label: "Total Available Hours" },
                { key: "direct", label: "Total Direct" },
                { key: "ga", label: "Total G&A" },
                { key: "oh", label: "Total OH" },
                { key: "ird", label: "Total IR&D/B&P" },
                { key: "util", label: "Utilization" },
                { key: "assigned", label: "Total Assigned Hours" },
                { key: "var", label: "Variance" },
                { key: "notes", label: "Notes" },
              ]}
            />
          )}

          {activeTab === "gl25" && (
            <UniversalGrid
              searchTerm={search}
              data={gl25Data}
              columns={[
                { key: "accId", label: "Account ID" },
                { key: "accName", label: "Account Name" },
                { key: "mapping", label: "PBR Account Mapping" },
                { key: "pool", label: "PBR Pool Mapping" },
                { key: "pd", label: "Pd" },
                { key: "empName", label: "Employee Name" },
                { key: "btProj", label: "BT Proj ID" },
                { key: "ts", label: "Time Stamp" },
                { key: "amt", label: "Amount", format: "currency" },
                { key: "crncy", label: "Crncy" },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
