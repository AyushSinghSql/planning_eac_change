// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { backendUrl } from "./config";
// import {
//   Download,
//   Table,
//   ArrowUpDown,
//   ArrowUp,
//   ArrowDown,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Info,
//   ArrowRight,
//   ChartNoAxesCombined,
//   Search,
//   X,
// } from "lucide-react";

// // Import Recharts for the Interactive Dashboard
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RechartsTooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// import { FcDataConfiguration } from "react-icons/fc";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import html2pdf from "html2pdf.js";

// // Year Definitions - Base Year 2027
// // NOTE: GL records are matched on fyCd. Only years inside ALL_YEARS are shown.
// const BASE_YEAR = "2025";
// const OPTION_YEARS = ["2026"];
// const ALL_YEARS = [BASE_YEAR, ...OPTION_YEARS];

// // Project ID prefixes treated as indirect when the Include Indirect Project
// // switch is OFF. These are applied directly to GL Post Detail data.
// const INDIRECT_PROJECT_PREFIXES = [
//   "FR",
//   "FA",
//   "GNA",
//   "IRD",
//   "LEAVE",
//   "OVH",
//   "SMH",
//   "SUB",
//   "UNA",
// ];

// const zeroRates = {
//   aeroFringe: 0,
//   nasaFringe: 0,
//   calInt: 0,
//   custOH: 0,
//   columbusOH: 0,
//   subkMH: 0,
//   ga: 0,
//   fee: 0,
// };

// const defaultEsc = {
//   rate: 0,
//   fromM: "01",
//   fromY: "2028",
//   toM: "12",
//   toY: "2032",
// };

// const initialEscalations = {
//   All: { rate: 0, fromM: "01", fromY: "2028", toM: "12", toY: "2032" },
//   aeroFringe: { ...defaultEsc },
//   nasaFringe: { ...defaultEsc },
//   calInt: { ...defaultEsc },
//   custOH: { ...defaultEsc },
//   columbusOH: { ...defaultEsc },
//   subkMH: { ...defaultEsc },
//   ga: { ...defaultEsc },
//   fee: { ...defaultEsc },
// };

// const months = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// // ==========================================
// // DFARS CHECKLIST DATA
// // ==========================================
// const checklistData = [
//   {
//     title: "1. General & Administrative Checklist Rules",
//     items: [
//       {
//         id: "Item 1",
//         req: "Table 15-2 Compliance: Proposal conforms to the format and instructions in FAR 15.408, Table 15-2.",
//         logic:
//           "Verifies all summary elements (Labor, Subcontract, Material, Indirects, Fee) roll into a standard 15-2 summary schedule.",
//       },
//       {
//         id: "Item 2",
//         req: "Cognizant Audit & Admin Offices: Disclose ACO and DCAA branch office addresses, POCs, and emails.",
//         logic:
//           "Validates company entity profile fields for Cognizant DCMA/ACO and DCAA offices, CAGE code, and UEI.",
//       },
//       {
//         id: "Item 3",
//         req: "Accounting System Adequacy: Statement regarding whether the accounting system has been approved by DCAA/DCMA.",
//         logic:
//           "Checks for system adequacy disclosure, audit report number, and approval date (e.g., DFARS 252.242-7005 status).",
//       },
//       {
//         id: "Item 4",
//         req: "Estimating System Adequacy: Statement confirming the estimating system meets DFARS 252.215-7002 criteria.",
//         logic:
//           "Checks for an affirmative disclosure of an approved estimating system or explicit rationale if not approved.",
//       },
//       {
//         id: "Item 5",
//         req: "CAS Disclosure Statement: Does the offeror have an active Cost Accounting Standards (CAS) Disclosure Statement (Form CASB DS-1)?",
//         logic:
//           "Checks if contract value meets CAS thresholds (e.g., TINA/Truth in Negotiations threshold) and verifies CAS status (Exempt, Modified, Full).",
//       },
//       {
//         id: "Item 6",
//         req: "Index of Cost or Pricing Data: Direct cross-reference index showing where all supporting data resides in the package.",
//         logic:
//           "Auto-generates a dynamic document index mapping every WBS/CLIN to its underlying BOE, payroll file, or vendor quote attachment.",
//       },
//     ],
//   },
//   {
//     title: "2. Direct Labor Checklist Rules",
//     items: [
//       {
//         id: "Item 11",
//         req: "Labor Category Basis: Basis of labor rates proposed (historical actuals, payroll records, market surveys, forward pricing).",
//         logic:
//           "Validates that every proposed LCAT has an assigned Rate Source flag (e.g., Costpoint Master Pay, Bureau of Labor Statistics, Salary.com).",
//       },
//       {
//         id: "Item 12",
//         req: "Labor Escalation Rationale: Specific methodology and historical basis used for out-year escalation.",
//         logic:
//           "Verifies an escalation factor is applied per Option Year and checks that the user has selected or written an escalation justification.",
//       },
//       {
//         id: "Item 13",
//         req: "Time-Phased Hours (BOE): Breakdown of hours by LCAT, task/WBS, and performance period.",
//         logic:
//           "Validates that total CLIN hours reconcile exactly with the sum of detailed task hours across all periods of performance.",
//       },
//     ],
//   },
//   {
//     title: "3. Indirect Rates & Cost Pools Rules",
//     items: [
//       {
//         id: "Item 14",
//         req: "Indirect Rate Status (FPRA/FPRP/PBR): Disclose whether indirect rates are based on an FPRA, FPRP, Provisional Billing Rates, or other estimates.",
//         logic:
//           "Inspects the Rate Schedule selector. If FPRA is selected, validates agreement date, expiration date, and ACO reference ID.",
//       },
//       {
//         id: "Item 15",
//         req: "Rate Base & Pool Description: Detailed explanation of allocation bases (e.g., Fringe on Direct Labor, G&A on Total Cost Input).",
//         logic:
//           "Ensures applied cost pools match Costpoint allocation logic and that no unburdened base elements are skipped.",
//       },
//       {
//         id: "Item 16",
//         req: "Indirect Pool Reconciliation: If FPRA does not exist, provide at least 3 years of historical actual pool rates, base amounts, and pool expenses.",
//         logic:
//           "Checks if non-FPRA mode has historical base/pool data attached or populated from Costpoint pool history.",
//       },
//     ],
//   },
//   {
//     title: "4. Subcontractors & Materials (High DCAA Scrutiny)",
//     items: [
//       {
//         id: "Item 17",
//         req: "Subcontract Price/Cost Analysis: Prime contractor's documented cost/price analysis for all subcontractors per FAR 15.404-3.",
//         logic:
//           'Requires user to tag each subcontract as "Commercial / Price Analysis" or "Cost-Reimbursable / Cost Analysis Performed."',
//       },
//       {
//         id: "Item 18",
//         req: "TINA Subcontract Threshold: Submission of certified cost or pricing data from subcontractors exceeding the TINA threshold ($2,000,000+).",
//         logic:
//           "Checks individual sub line items against the threshold; prompts for certified sub-tier package attachment.",
//       },
//       {
//         id: "Item 20",
//         req: "Consolidated Bill of Materials (CBOM): Materials priced over the threshold must include vendor quotes, purchase orders, or catalog pricing.",
//         logic:
//           "Validates that line-item materials link to a documented unit price source (Vendor Quote, Historical PO, Catalog Price).",
//       },
//     ],
//   },
//   {
//     title: "5. Other Direct Costs (ODCs) & Travel",
//     items: [
//       {
//         id: "Item 23",
//         req: "Travel Basis of Estimate: Travel costs broken down by origin, destination, number of trips, travelers, duration, and per diem.",
//         logic:
//           "Ensures travel lines are not entered as flat lump sums; verifies rate sources (GSA Per Diem, Fly America Act airfare estimates).",
//       },
//       {
//         id: "Item 25",
//         req: "Royalties & Special Equipment: Explanations for license fees, specialized testing facilities, or royalties.",
//         logic:
//           "If non-standard ODC accounts are used, verifies that narrative justification is entered.",
//       },
//     ],
//   },
// ];

// const formatDisplayType = (str) => {
//   if (!str) return "";
//   const s = String(str).trim().toLowerCase();
//   if (s === "non-labor" || s === "non labor") return "Non-Labor";
//   if (s === "labor") return "Labor";
//   return s.replace(/\b\w/g, (char) => char.toUpperCase());
// };

// // ==========================================
// // YEAR-BUCKET HELPERS (Labor / Non-Labor)
// // ==========================================
// const emptyLaborYear = () => ({
//   hrs: 0,
//   amt: 0,
//   monthly: Array(12).fill(0),
//   monthlyAmt: Array(12).fill(0),
// });
// const emptyNonLaborYear = () => ({ total: 0, monthly: Array(12).fill(0) });

// const addLaborYear = (target, src) => {
//   target.hrs += src.hrs;
//   target.amt += src.amt;
//   for (let m = 0; m < 12; m++) {
//     target.monthly[m] += src.monthly[m];
//     target.monthlyAmt[m] += src.monthlyAmt[m];
//   }
// };
// const addNonLaborYear = (target, src) => {
//   target.total += src.total;
//   for (let m = 0; m < 12; m++) target.monthly[m] += src.monthly[m];
// };

// // Converts a list of absolute months (year * 12 + monthIndex) into a readable
// // string, e.g. "Jan 2027 - Feb 2027, Jun 2027" (consecutive months are merged)
// const formatPeriods = (absMonths) => {
//   if (!absMonths || absMonths.length === 0) return "";
//   const sorted = [...new Set(absMonths)].sort((a, b) => a - b);
//   const fmt = (n) => `${months[n % 12]} ${Math.floor(n / 12)}`;
//   const ranges = [];
//   let start = sorted[0];
//   let prev = sorted[0];
//   for (let i = 1; i <= sorted.length; i++) {
//     const cur = sorted[i];
//     if (cur !== prev + 1) {
//       ranges.push(start === prev ? fmt(start) : `${fmt(start)} - ${fmt(prev)}`);
//       start = cur;
//     }
//     prev = cur;
//   }
//   return ranges.join(", ");
// };

// const ProjectPerformance = () => {
//   const exportDocumentToPDF = () => {
//     const previewElement = document.getElementById(
//       "propricer-preview-container",
//     );
//     if (!previewElement) return alert("Preview container not found.");
//     const opt = {
//       margin: 10,
//       filename: `Proposal_${selectedProject || "Document"}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2, useCORS: true },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//     };
//     html2pdf().from(previewElement).set(opt).save();
//   };

//   const [activeTab, setActiveTab] = useState("Dashboard");
//   const [dashboardView, setDashboardView] = useState("Overview");
//   const [selectedDashboardFilter, setSelectedDashboardFilter] = useState({
//     laborCategory: "",
//     employee: "",
//     vendor: "",
//   });

//   // Resizable sticky columns for Performance By Category / Performance By Employee
//   const [performanceColumnWidths, setPerformanceColumnWidths] = useState({
//     topLevel: 120,
//     task: 150,
//     type: 120,
//     category: 150,
//   });
//   const [resizingPerformanceColumn, setResizingPerformanceColumn] =
//     useState(null);
//   const [resizeStartX, setResizeStartX] = useState(0);
//   const [resizeStartWidth, setResizeStartWidth] = useState(0);

//   const performanceColumnLefts = useMemo(() => {
//     const w = performanceColumnWidths;
//     return {
//       topLevel: 0,
//       task: w.topLevel,
//       type: w.topLevel + w.task,
//       category: w.topLevel + w.task + w.type,
//     };
//   }, [performanceColumnWidths]);

//   const startPerformanceColumnResize = useCallback(
//     (e, column) => {
//       e.preventDefault();
//       e.stopPropagation();
//       setResizingPerformanceColumn(column);
//       setResizeStartX(e.clientX);
//       setResizeStartWidth(performanceColumnWidths[column]);
//     },
//     [performanceColumnWidths],
//   );

//   useEffect(() => {
//     if (!resizingPerformanceColumn) return;

//     const handleMouseMove = (e) => {
//       const delta = e.clientX - resizeStartX;
//       setPerformanceColumnWidths((prev) => ({
//         ...prev,
//         [resizingPerformanceColumn]: Math.max(80, resizeStartWidth + delta),
//       }));
//     };

//     const handleMouseUp = () => {
//       setResizingPerformanceColumn(null);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [resizingPerformanceColumn, resizeStartX, resizeStartWidth]);

//   // Master Data State
//   const [masterForecast, setMasterForecast] = useState([]);
//   const [laborData, setLaborData] = useState({ empMap: {} });
//   const [nonLaborData, setNonLaborData] = useState({
//     coa: {},
//     coaTypes: {},
//     coaGroups: {},
//   });
//   const [plcMap, setPlcMap] = useState({});
//   const [vendorMap, setVendorMap] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const [projectLevel] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(25);

//   // Project Filter State
//   // projectInput    = what the user is typing (does NOT filter the data)
//   // selectedProject = the applied filter (only changes when Search is clicked)
//   const [projectInput, setProjectInput] = useState("");
//   const [selectedProject, setSelectedProject] = useState("");
//   const [projectSearchResults, setProjectSearchResults] = useState([]);
//   const [showProjectDropdown, setShowProjectDropdown] = useState(false);
//   const [isSearchingProject, setIsSearchingProject] = useState(false);
//   const [includeIndirectProjects, setIncludeIndirectProjects] = useState(false);

//   // const handleSearch = () => {
//   //   setSelectedProject(projectInput.trim());
//   //   setCurrentPage(1);
//   //   setShowProjectDropdown(false);
//   // };
//   const handleSearch = () => {
//     const projectId = projectInput.trim();

//     if (!projectId) {
//       return;
//     }

//     const parts = projectId.split(".");

//     if (parts.length !== 2) {
//       alert("Please select a Level 2 Project ID, such as ABC.02.");
//       return;
//     }

//     setSelectedProject(projectId);
//     setCurrentPage(1);
//     setShowProjectDropdown(false);
//   };

//   const handleClearSearch = () => {
//     setProjectInput("");
//     setSelectedProject("");
//     setCurrentPage(1);
//     setShowProjectDropdown(false);
//   };

//   const [proPricerContent, setProPricerContent] = useState("");

//   const [docSections, setDocSections] = useState({
//     coverLetter: true,
//     vol1Admin: true,
//     vol2Tech: true,
//     vol3Mgmt: true,
//     vol4PastPerf: true,
//     vol5Price: true,
//     sec5_1: true,
//     sec5_2: true,
//     sec5_3: true,
//     sec5_4: true,
//     sec5_5: true,
//     sec5_6: true,
//     sec5_7: true,
//     repsAndCerts: true,
//   });

//   // DFARS State
//   const [checkedItems, setCheckedItems] = useState({});

//   const toggleCheck = (id) => {
//     setCheckedItems((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const [draftEscalations, setDraftEscalations] = useState(initialEscalations);
//   const [appliedEscalations, setAppliedEscalations] =
//     useState(initialEscalations);
//   const [showEscalationPanel, setShowEscalationPanel] = useState(false);
//   const [isEscalationCustom, setIsEscalationCustom] = useState(false);

//   const [showEscalationInfo, setShowEscalationInfo] = useState(false);

//   const handleDraftChange = (poolKey, field, value) => {
//     setDraftEscalations((prev) => {
//       const next = { ...prev };
//       next[poolKey] = { ...next[poolKey], [field]: value };
//       if (poolKey === "All") {
//         Object.keys(next).forEach((k) => {
//           if (k !== "All") next[k] = { ...next[k], [field]: value };
//         });
//       }
//       return next;
//     });
//   };

//   const applyEscalations = () => {
//     if (!isEscalationCustom) {
//       const allSettings = draftEscalations.All;
//       const synced = { ...draftEscalations };
//       Object.keys(synced).forEach((k) => {
//         if (k !== "All") synced[k] = { ...allSettings };
//       });
//       setAppliedEscalations(synced);
//     } else {
//       setAppliedEscalations(draftEscalations);
//     }
//     setShowEscalationPanel(false);
//   };

//   const resetEscalations = () => {
//     const resetState = {
//       All: { rate: 0, fromM: "01", fromY: "2028", toM: "12", toY: "2032" },
//       aeroFringe: { ...defaultEsc },
//       nasaFringe: { ...defaultEsc },
//       calInt: { ...defaultEsc },
//       custOH: { ...defaultEsc },
//       columbusOH: { ...defaultEsc },
//       subkMH: { ...defaultEsc },
//       ga: { ...defaultEsc },
//       fee: { ...defaultEsc },
//     };
//     setDraftEscalations(resetState);
//     setAppliedEscalations(resetState);
//     setShowEscalationPanel(false);
//   };

//   const [expandedRows, setExpandedRows] = useState(new Set());

//   const toggleExpand = (id) => {
//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [visibleYears, setVisibleYears] = useState(ALL_YEARS);
//   const [laborMetrics, setLaborMetrics] = useState({ hrs: true, amt: true });
//   const [globalFee, setGlobalFee] = useState("7.00");

//   const [templates, setTemplates] = useState([]);
//   const [targetTemplateId, setTargetTemplateId] = useState("");
//   const [burdenRates, setBurdenRates] = useState(null);
//   const [accountPoolsMap, setAccountPoolsMap] = useState({});

//   const formatNum = (n) =>
//     new Intl.NumberFormat("en-US", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(n || 0);
//   const formatCurrency = (n) =>
//     new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(n || 0);

//   const requestSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc")
//       direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key)
//       return <ArrowUpDown size={13} className="ml-1 text-gray-400 inline" />;
//     if (sortConfig.direction === "asc")
//       return <ArrowUp size={13} className="ml-1 text-green-700 inline" />;
//     return <ArrowDown size={13} className="ml-1 text-green-700 inline" />;
//   };

//   const getTask = useCallback(
//     (id) =>
//       projectLevel === "All"
//         ? id
//         : id?.split(".").slice(0, parseInt(projectLevel, 10)).join("."),
//     [projectLevel],
//   );

//   const toggleYear = (year) => {
//     setVisibleYears((prev) =>
//       prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
//     );
//   };

//   // ==========================================
//   // DATA FETCHING
//   // ==========================================
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const [foreRaw, plcRaw, coaRaw, empRaw, tplRaw, poolMapRaw, vendRaw] =
//           await Promise.all([
//             // SOURCE: GL Post Detail (replaces GetForecastView)
//             fetch(`${backendUrl}/api/ForecastReport/GetGlPostDetail`).then(
//               (r) => r.json(),
//             ),
//             fetch(`${backendUrl}/Project/GetAllPlcs/`).then((r) => r.json()),
//             fetch(`${backendUrl}/api/ChartOfAccounts`).then((r) => r.json()),
//             fetch(`${backendUrl}/api/ForecastReport/GetAllEmployee`).then((r) =>
//               r.json(),
//             ),
//             fetch(`${backendUrl}/Orgnization/GetAllTemplates`).then((r) =>
//               r.json(),
//             ),
//             fetch(
//               `${backendUrl}/Orgnization/GetAccountPools?Year=${BASE_YEAR}`,
//             ).then((r) => r.json()),
//             fetch(`${backendUrl}/VendorEmployee`)
//               .then((r) => r.json())
//               .catch(() => []),
//           ]);

//         const ensureArr = (d) =>
//           Array.isArray(d) ? d : d?.data || d?.items || d?.results || [];

//         // Normalize GL Post Detail rows into the shape the rest of the page uses.
//         //   sIdType === "E"  -> Labor, anything else -> Non-Labor
//         //   pdNo             -> month
//         //   amt1             -> amount (cost)
//         //   hrs1             -> hours
//         //   NBBUD records are never used.
//         const fore = ensureArr(foreRaw)
//           .filter((item) => {
//             const type = String(item.plType || item.pl_type || "")
//               .trim()
//               .toUpperCase();
//             const projectId = String(
//               item.projId || item.projectId || "",
//             ).trim();
//             const accountId = String(
//               item.acctId ?? item.accountId ?? "",
//             ).trim();

//             // Only include GL accounts starting with 5, 6, 7, 8, or 9.
//             // Excludes accounts starting with 0, 1, 2, 3, or 4.
//             const validAccountId = /^[5-9]/.test(accountId);

//             const isIndirectProject = INDIRECT_PROJECT_PREFIXES.some((prefix) =>
//               projectId.toUpperCase().startsWith(prefix),
//             );

//             return (
//               type !== "NBBUD" &&
//               projectId !== "" &&
//               validAccountId &&
//               (includeIndirectProjects || !isIndirectProject)
//             );
//           })
//           .map((item) => {
//             const sIdType = String(item.sIdType ?? item.sidType ?? "")
//               .trim()
//               .toUpperCase();
//             const sid = String(item.id ?? "").trim();
//             return {
//               ...item,
//               sIdType,
//               projId: item.projId,
//               acctId: item.acctId,
//               orgId: item.orgId,
//               year: String(item.fyCd ?? ""),
//               month: parseInt(item.pdNo, 10) || 1,
//               cost: parseFloat(item.amt1) || 0,
//               hours: parseFloat(item.hrs1) || 0,
//               emplId: sid,
//               vendId: sid,
//               plc: item.billLabCatCd,
//               empName: item.name || "",
//             };
//           });

//         const plc = ensureArr(plcRaw);
//         const coa = ensureArr(coaRaw);
//         const emp = ensureArr(empRaw);
//         const tpls = ensureArr(tplRaw);
//         const poolMaps = ensureArr(poolMapRaw);

//         setMasterForecast(fore);

//         setAccountPoolsMap(
//           poolMaps.reduce((acc, curr) => {
//             const acct = String(curr.acctId || "").trim();
//             const org = String(
//               curr.orgId || curr.org_id || curr.org || "",
//             ).trim();
//             return { ...acc, [`${acct}-${org}`]: curr };
//           }, {}),
//         );

//         setTemplates(tpls);

//         const defaultTpl =
//           tpls.find(
//             (t) => String(t.templateCode).toLowerCase() === "default",
//           ) || tpls[0];
//         const targetTpl =
//           tpls.find((t) =>
//             String(t.templateCode).toLowerCase().includes("target"),
//           ) ||
//           tpls.find((t) => String(t.id) === "2") ||
//           tpls[1] ||
//           defaultTpl;

//         setTargetTemplateId((prev) =>
//           prev ? prev : targetTpl ? String(targetTpl.id) : "",
//         );

//         setPlcMap(
//           plc.reduce((acc, curr) => {
//             const code = String(curr.laborCategoryCode || "")
//               .trim()
//               .toUpperCase();
//             const id = String(curr.id || curr.plcId || "")
//               .trim()
//               .toUpperCase();
//             const desc = curr.description || curr.name || "Labor Category";
//             if (code) acc[code] = desc;
//             if (id) acc[id] = desc;
//             return acc;
//           }, {}),
//         );

//         setLaborData({
//           empMap: emp.reduce(
//             (acc, curr) => ({ ...acc, [curr.emplId]: curr.firstName }),
//             {},
//           ),
//         });

//         const vend = ensureArr(vendRaw);
//         setVendorMap(
//           vend.reduce((acc, curr) => {
//             const vId = String(curr.vendId || curr.vendEmplId || "")
//               .trim()
//               .toUpperCase();
//             if (vId)
//               acc[vId] =
//                 curr.vendEmplName || `${curr.lastName}, ${curr.firstName}`;
//             return acc;
//           }, {}),
//         );

//         setNonLaborData({
//           coa: coa.reduce(
//             (acc, curr) => ({
//               ...acc,
//               [String(curr.accountId || curr.acctId).trim()]:
//                 curr.accountName || curr.acctName,
//             }),
//             {},
//           ),
//           coaTypes: coa.reduce(
//             (acc, curr) => ({
//               ...acc,
//               [String(curr.accountId || curr.acctId).trim()]: String(
//                 curr.accountType || curr.accountTypeName || "",
//               ).toUpperCase(),
//             }),
//             {},
//           ),
//           coaGroups: coa.reduce(
//             (acc, curr) => ({
//               ...acc,
//               [String(curr.accountId || curr.acctId).trim()]:
//                 curr.budgetSheet ||
//                 curr.accountType ||
//                 curr.accountTypeName ||
//                 curr.costType ||
//                 curr.budgetSheet,
//             }),
//             {},
//           ),
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     // Data is loaded once. The project filter is applied client-side
//     // when the Search button is clicked.
//     fetchData();
//   }, [includeIndirectProjects]);

//   // ==========================================
//   // PROJECT AUTO-SUGGEST (New Business & Projects)
//   // Driven by what the user is typing (projectInput). Results are sorted:
//   // exact match -> starts-with -> contains, then alphabetically.
//   // ==========================================
//   // useEffect(() => {
//   //   const fetchProjects = async () => {
//   //     setIsSearchingProject(true);

//   //     try {
//   useEffect(() => {
//     const fetchProjects = async () => {
//       const searchTarget = String(projectInput || "")
//         .trim()
//         .toUpperCase();

//       if (searchTarget.length < 4) {
//         setProjectSearchResults([]);
//         setIsSearchingProject(false);
//         return;
//       }

//       setIsSearchingProject(true);

//       try {
//         const searchTarget = String(projectInput || "")
//           .trim()
//           .toUpperCase();

//         // 1. Always fetch and filter New Business (NBBUD)
//         // const nbRes = await fetch(`${backendUrl}/GetAllNewBusiness`);
//         // const nbData = await nbRes.json();

//         // let nbArray = [];
//         // if (Array.isArray(nbData)) nbArray = nbData;
//         // else if (nbData && typeof nbData === "object")
//         //   nbArray =
//         //     nbData.results ||
//         //     nbData.data ||
//         //     nbData.items ||
//         //     (nbData.businessBudgetId ? [nbData] : []);

//         // const mappedNbArray = nbArray.map((nb) => ({
//         //   ...nb,
//         //   projectId: nb.businessBudgetId,
//         //   name: nb.description || "New Business",
//         //   burdenTemplateId: nb.burdenTemplateId,
//         //   customer: nb.customer,
//         //   contractTypes: nb.contractTypes,
//         //   startDate: nb.startDate,
//         //   endDate: nb.endDate,
//         // }));

//         // let filteredResults = mappedNbArray.filter((proj) => {
//         //   const projId = String(proj.projectId).trim().toUpperCase();
//         //   return searchTarget === "" || projId.includes(searchTarget);
//         // });
//         let filteredResults = [];
//         // 2. Fetch standard PROJECTs if user entered >= 4 characters
//         if (searchTarget.length >= 4) {
//           const projRes = await fetch(
//             `${backendUrl}/Project/GetAllProjectsForSearchV3?UserId=4&Role=ADMIN&type=PROJECT&ProjId=${encodeURIComponent(searchTarget)}&take=100`,
//           );
//           const projData = await projRes.json();

//           let projArray = [];
//           if (Array.isArray(projData)) projArray = projData;
//           else if (projData && typeof projData === "object") {
//             projArray =
//               projData.results || projData.data || projData.items || [];
//           }

//           const mappedProjArray = projArray
//             .map((p) => ({
//               ...p,
//               projectId: p.projectId || p.projId,
//               name: p.name || p.projectName || p.description || "",
//               type: p.type || "",
//             }))
//             .filter((p) => {
//               const projectId = String(p.projectId || "").trim();

//               // Always keep Level 2 projects
//               if (projectId.split(".").length !== 2) {
//                 return false;
//               }

//               // When Include Indirect Project is OFF,
//               // exclude projects whose API type is INDIRECT
//               if (
//                 !includeIndirectProjects &&
//                 String(p.type || "")
//                   .trim()
//                   .toUpperCase() === "INDIRECT"
//               ) {
//                 return false;
//               }

//               return true;
//             });
//           // Merge both sources and deduplicate by projectId
//           // const allResults = [...filteredResults, ...mappedProjArray];
//           // const uniqueMap = new Map();

//           // allResults.forEach((item) => {
//           //   if (item.projectId && !uniqueMap.has(item.projectId)) {
//           //     uniqueMap.set(item.projectId, item);
//           //   }
//           // });

//           // filteredResults = Array.from(uniqueMap.values());
//           const uniqueMap = new Map();

//           mappedProjArray.forEach((item) => {
//             if (item.projectId && !uniqueMap.has(item.projectId)) {
//               uniqueMap.set(item.projectId, item);
//             }
//           });

//           filteredResults = Array.from(uniqueMap.values());
//         }

//         // 3. Sort: exact -> starts-with -> contains -> alphabetical
//         const rank = (proj) => {
//           const id = String(proj.projectId || "")
//             .trim()
//             .toUpperCase();
//           if (searchTarget === "") return 3;
//           if (id === searchTarget) return 0;
//           if (id.startsWith(searchTarget)) return 1;
//           if (id.includes(searchTarget)) return 2;
//           return 3;
//         };
//         filteredResults.sort((a, b) => {
//           const ra = rank(a);
//           const rb = rank(b);
//           if (ra !== rb) return ra - rb;
//           return String(a.projectId).localeCompare(
//             String(b.projectId),
//             undefined,
//             { numeric: true, sensitivity: "base" },
//           );
//         });

//         setProjectSearchResults(filteredResults);
//       } catch (error) {
//         console.error("Error fetching projects", error);
//         setProjectSearchResults([]);
//       } finally {
//         setIsSearchingProject(false);
//       }
//     };

//     const timeoutId = setTimeout(fetchProjects, 300);
//     return () => clearTimeout(timeoutId);
//   }, [projectInput, includeIndirectProjects]);

//   // ==========================================
//   // AUTO-SET BURDEN TEMPLATE FROM PROJECT
//   // ==========================================
//   useEffect(() => {
//     if (selectedProject && projectSearchResults.length > 0) {
//       const proj = projectSearchResults.find(
//         (p) => p.projectId === selectedProject,
//       );
//       if (proj && proj.burdenTemplateId) {
//         setTargetTemplateId(String(proj.burdenTemplateId));
//       }
//     }
//   }, [selectedProject, projectSearchResults]);

//   // ==========================================
//   // CONCURRENT BATCH POOL RATES FETCH
//   // ==========================================
//   useEffect(() => {
//     const fetchPools = async () => {
//       if (!targetTemplateId) return;

//       try {
//         const allYears = [BASE_YEAR, ...OPTION_YEARS];
//         const poolToStateKey = {
//           AEROFR: "aeroFringe",
//           NFRNG: "nasaFringe",
//           CALINT: "calInt",
//           OVH30: "custOH",
//           OVH31: "columbusOH",
//           SMH50: "subkMH",
//           INTG40: "ga",
//           FEE: "fee",
//         };

//         const newRates = {};
//         allYears.forEach((y) => (newRates[y] = { ...zeroRates }));

//         const fetchPromises = allYears.map((year) =>
//           fetch(
//             `${backendUrl}/Orgnization/GetRatesByPoolsTemplateId?templateId=${targetTemplateId}&year=${year}`,
//           )
//             .then((r) => r.json())
//             .then((data) => ({ year, data }))
//             .catch(() => ({ year, data: null })),
//         );

//         const rateResults = await Promise.all(fetchPromises);

//         rateResults.forEach(({ year, data }) => {
//           if (data) {
//             const rateList = Array.isArray(data)
//               ? data
//               : data.data || data.items || data.results || [data];
//             rateList.forEach((poolData) => {
//               if (!poolData) return;
//               const poolId =
//                 poolData.poolId || poolData.poolCode || poolData.pool;
//               const stateKey = poolToStateKey[poolId];
//               if (stateKey) {
//                 const rawVal =
//                   poolData.targetRate ??
//                   poolData.escalationPercent ??
//                   poolData.rate ??
//                   0;
//                 newRates[year][stateKey] = parseFloat(rawVal) / 100;
//               }
//             });
//           }
//         });

//         allYears.forEach((y) => {
//           if (!newRates[y].fee && newRates[y].fee !== 0) newRates[y].fee = 0;
//         });

//         setBurdenRates(newRates);
//       } catch (e) {
//         console.error("Error in fetchPools chain:", e);
//       }
//     };

//     fetchPools();
//   }, [targetTemplateId]);

//   // ==========================================
//   // EXACT ABSOLUTE-MONTH ESCALATION MAP
//   // ==========================================
//   const escalatedRatesMap = useMemo(() => {
//     const ratesMap = {};

//     const getPoolData = (poolKey, yearStr) => {
//       const config = appliedEscalations[poolKey];
//       const rateVal = parseFloat(config.rate) / 100 || 0;
//       const fromY = parseInt(config.fromY);
//       const fromM = parseInt(config.fromM);
//       const toY = parseInt(config.toY);
//       const toM = parseInt(config.toM);
//       const y = parseInt(yearStr);

//       const base =
//         burdenRates?.[yearStr]?.[poolKey] ??
//         burdenRates?.[BASE_YEAR]?.[poolKey] ??
//         0;

//       let sum = 0;
//       let escRate = base;
//       let escMonth = null;

//       for (let m = 1; m <= 12; m++) {
//         const currentAbsoluteMonth = y * 12 + m;
//         const fromAbsoluteMonth = fromY * 12 + fromM;
//         const toAbsoluteMonth = toY * 12 + toM;

//         const isActive =
//           currentAbsoluteMonth >= fromAbsoluteMonth &&
//           currentAbsoluteMonth <= toAbsoluteMonth;
//         const mRate = isActive ? base * (1 + rateVal) : base;

//         sum += mRate;

//         if (isActive && escMonth === null) {
//           escMonth = m;
//           escRate = mRate;
//         }
//       }

//       return {
//         avgRate: sum / 12,
//         escRate: rateVal > 0 ? escRate : base,
//         escMonthLabel: rateVal > 0 && escMonth ? months[escMonth - 1] : "-",
//       };
//     };

//     OPTION_YEARS.forEach((yStr) => {
//       ratesMap[yStr] = {
//         avgRates: {
//           aeroFringe: getPoolData("aeroFringe", yStr).avgRate,
//           nasaFringe: getPoolData("nasaFringe", yStr).avgRate,
//           custOH: getPoolData("custOH", yStr).avgRate,
//           columbusOH: getPoolData("columbusOH", yStr).avgRate,
//           subkMH: getPoolData("subkMH", yStr).avgRate,
//           ga: getPoolData("ga", yStr).avgRate,
//           fee: getPoolData("fee", yStr).avgRate,
//         },
//         display: {
//           aeroFringe: getPoolData("aeroFringe", yStr),
//           nasaFringe: getPoolData("nasaFringe", yStr),
//           custOH: getPoolData("custOH", yStr),
//           columbusOH: getPoolData("columbusOH", yStr),
//           subkMH: getPoolData("subkMH", yStr),
//           ga: getPoolData("ga", yStr),
//           fee: getPoolData("fee", yStr),
//         },
//         monthly: {
//           aeroFringe: Array(12).fill(0),
//           nasaFringe: Array(12).fill(0),
//           custOH: Array(12).fill(0),
//           columbusOH: Array(12).fill(0),
//           subkMH: Array(12).fill(0),
//           ga: Array(12).fill(0),
//           fee: Array(12).fill(0),
//         },
//       };

//       const rebuildMonthly = (poolKey) => {
//         const config = appliedEscalations[poolKey];
//         const rateVal = parseFloat(config.rate) / 100 || 0;
//         const fromY = parseInt(config.fromY);
//         const fromM = parseInt(config.fromM);
//         const toY = parseInt(config.toY);
//         const toM = parseInt(config.toM);
//         const y = parseInt(yStr);
//         const base =
//           burdenRates?.[yStr]?.[poolKey] ??
//           burdenRates?.[BASE_YEAR]?.[poolKey] ??
//           0;
//         let arr = [];

//         for (let m = 1; m <= 12; m++) {
//           const currentAbsoluteMonth = y * 12 + m;
//           const fromAbsoluteMonth = fromY * 12 + fromM;
//           const toAbsoluteMonth = toY * 12 + toM;

//           const isActive =
//             currentAbsoluteMonth >= fromAbsoluteMonth &&
//             currentAbsoluteMonth <= toAbsoluteMonth;
//           arr.push(isActive ? base * (1 + rateVal) : base);
//         }
//         return arr;
//       };

//       ratesMap[yStr].monthly = {
//         aeroFringe: rebuildMonthly("aeroFringe"),
//         nasaFringe: rebuildMonthly("nasaFringe"),
//         custOH: rebuildMonthly("custOH"),
//         columbusOH: rebuildMonthly("columbusOH"),
//         subkMH: rebuildMonthly("subkMH"),
//         ga: rebuildMonthly("ga"),
//         fee: rebuildMonthly("fee"),
//       };
//     });
//     return ratesMap;
//   }, [appliedEscalations, burdenRates]);

//   // ==========================================
//   // FILTERED DATA ENGINE
//   // Labor = sIdType "E", everything else = Non-Labor.
//   // Project filter only applies after Search is clicked.
//   // ==========================================
//   const { validLabor, validNonLabor } = useMemo(() => {
//     if (!masterForecast) return { validLabor: [], validNonLabor: [] };

//     const vLab = [];
//     const vNonLab = [];
//     const target = String(selectedProject || "")
//       .trim()
//       .toUpperCase();

//     masterForecast.forEach((item) => {
//       const id = String(item.projId || item.projectId || "")
//         .trim()
//         .toUpperCase();

//       if (target === "" || id.startsWith(target)) {
//         if (item.sIdType === "E") vLab.push(item);
//         else vNonLab.push(item);
//       }
//     });
//     return { validLabor: vLab, validNonLabor: vNonLab };
//   }, [masterForecast, selectedProject]);

//   const getAccountType = useCallback(
//     (acctId) => {
//       const key = String(acctId || "").trim();
//       return formatDisplayType(
//         nonLaborData.coaGroups[key] || nonLaborData.coaTypes[key] || "Unknown",
//       );
//     },
//     [nonLaborData.coaGroups, nonLaborData.coaTypes],
//   );

//   // ==========================================
//   // MASTER TABLE DATA SEPARATION
//   // ==========================================

//   // 1. Elements Summary Data
//   const elementsSummaryData = useMemo(() => {
//     if (!masterForecast || masterForecast.length === 0) return null;
//     const summary = {
//       directCosts: {},
//       burdens: {
//         aeroFringe: {
//           name: "AERO Fringe",
//           base: 0,
//           opts: Array(OPTION_YEARS.length).fill(0),
//         },
//         nasaFringe: {
//           name: "NASA/NIH Fringe",
//           base: 0,
//           opts: Array(OPTION_YEARS.length).fill(0),
//         },
//         custOH: {
//           name: "Customer Site OH",
//           base: 0,
//           opts: Array(OPTION_YEARS.length).fill(0),
//         },
//         columbusOH: {
//           name: "Off - Site OH",
//           base: 0,
//           opts: Array(OPTION_YEARS.length).fill(0),
//         },
//         subkMH: {
//           name: "Subk M&H",
//           base: 0,
//           opts: Array(OPTION_YEARS.length).fill(0),
//         },
//         ga: { name: "G&A", base: 0, opts: Array(OPTION_YEARS.length).fill(0) },
//       },
//     };

//     const baseRatesMock = {
//       monthly: {
//         aeroFringe: Array(12).fill(burdenRates?.[BASE_YEAR]?.aeroFringe || 0),
//         nasaFringe: Array(12).fill(burdenRates?.[BASE_YEAR]?.nasaFringe || 0),
//         custOH: Array(12).fill(burdenRates?.[BASE_YEAR]?.custOH || 0),
//         columbusOH: Array(12).fill(burdenRates?.[BASE_YEAR]?.columbusOH || 0),
//         subkMH: Array(12).fill(burdenRates?.[BASE_YEAR]?.subkMH || 0),
//         ga: Array(12).fill(burdenRates?.[BASE_YEAR]?.ga || 0),
//         fee: Array(12).fill(0),
//       },
//     };

//     const processSummaryItem = (cost, acctId, orgId, yearStr, monthIdx) => {
//       if (!cost || cost === 0) return;
//       const type = getAccountType(acctId) || "Other Direct Cost";

//       if (!summary.directCosts[type]) {
//         summary.directCosts[type] = {
//           name: type,
//           base: 0,
//           opts: Array(OPTION_YEARS.length).fill(0),
//         };
//       }

//       const isBase = yearStr === BASE_YEAR;
//       const optIdx = OPTION_YEARS.indexOf(yearStr);
//       if (!isBase && optIdx === -1) return;

//       const yrRates = isBase ? baseRatesMock : escalatedRatesMap[yearStr];
//       const mIdx = monthIdx >= 0 && monthIdx < 12 ? monthIdx : 0;
//       const flags = accountPoolsMap[`${acctId}-${orgId}`] || {};

//       const getSafeRate = (pool) => {
//         if (
//           yrRates &&
//           yrRates.monthly &&
//           typeof yrRates.monthly[pool]?.[mIdx] === "number"
//         ) {
//           return yrRates.monthly[pool][mIdx];
//         }
//         return 0;
//       };

//       const aeroFringe = flags.AEROFR ? cost * getSafeRate("aeroFringe") : 0;
//       const nasaFringe = flags.NFRNG ? cost * getSafeRate("nasaFringe") : 0;
//       const totalFringe = aeroFringe + nasaFringe;

//       const ohBase = flags.FRINGEONOVERHEAD ? cost + totalFringe : cost;
//       const custOH = flags.OVH30 ? ohBase * getSafeRate("custOH") : 0;
//       const columbusOH = flags.OVH31 ? ohBase * getSafeRate("columbusOH") : 0;
//       const totalOH = custOH + columbusOH;

//       const subkMH = flags.SMH50 ? cost * getSafeRate("subkMH") : 0;

//       let gaBase = cost + subkMH;
//       if (flags.FRINGEONGNA) gaBase += totalFringe;
//       if (flags.OVERHEADONGNA) gaBase += totalOH;
//       const ga = flags.INTG40 ? gaBase * getSafeRate("ga") : 0;

//       if (isBase) {
//         summary.directCosts[type].base += cost;
//         summary.burdens.aeroFringe.base += aeroFringe;
//         summary.burdens.nasaFringe.base += nasaFringe;
//         summary.burdens.custOH.base += custOH;
//         summary.burdens.columbusOH.base += columbusOH;
//         summary.burdens.subkMH.base += subkMH;
//         summary.burdens.ga.base += ga;
//       } else {
//         summary.directCosts[type].opts[optIdx] += cost;
//         summary.burdens.aeroFringe.opts[optIdx] += aeroFringe;
//         summary.burdens.nasaFringe.opts[optIdx] += nasaFringe;
//         summary.burdens.custOH.opts[optIdx] += custOH;
//         summary.burdens.columbusOH.opts[optIdx] += columbusOH;
//         summary.burdens.subkMH.opts[optIdx] += subkMH;
//         summary.burdens.ga.opts[optIdx] += ga;
//       }
//     };

//     validLabor.forEach((i) =>
//       processSummaryItem(
//         parseFloat(i.cost || 0),
//         String(i.acctId || i.accountId || "").trim(),
//         String(i.orgId || i.org || "").trim(),
//         String(i.year || i.fyCd || i.fy || ""),
//         (parseInt(i.month || i.pd_no || i.period) || 1) - 1,
//       ),
//     );
//     validNonLabor.forEach((i) =>
//       processSummaryItem(
//         parseFloat(i.cost || 0),
//         String(i.acctId || i.accountId || "").trim(),
//         String(i.orgId || i.org || "").trim(),
//         String(i.year || i.fyCd || i.fy || ""),
//         (parseInt(i.month || i.pd_no || i.period) || 1) - 1,
//       ),
//     );

//     return summary;
//   }, [
//     masterForecast,
//     validLabor,
//     validNonLabor,
//     escalatedRatesMap,
//     burdenRates,
//     accountPoolsMap,
//     getAccountType,
//   ]);

//   // 2. Category Table Data (Also powers Dashboard and Proposal Package totals)
//   const categoryTableData = useMemo(() => {
//     if (!masterForecast || masterForecast.length === 0) return [];
//     const agg = {};

//     const baseRatesMock = {
//       monthly: {
//         aeroFringe: Array(12).fill(burdenRates?.[BASE_YEAR]?.aeroFringe || 0),
//         nasaFringe: Array(12).fill(burdenRates?.[BASE_YEAR]?.nasaFringe || 0),
//         custOH: Array(12).fill(burdenRates?.[BASE_YEAR]?.custOH || 0),
//         columbusOH: Array(12).fill(burdenRates?.[BASE_YEAR]?.columbusOH || 0),
//         subkMH: Array(12).fill(burdenRates?.[BASE_YEAR]?.subkMH || 0),
//         ga: Array(12).fill(burdenRates?.[BASE_YEAR]?.ga || 0),
//         fee: Array(12).fill(0),
//       },
//     };

//     const calcAnnualBurden = (
//       monthlyCosts,
//       monthlyHrs,
//       yearRatesData,
//       acctId,
//       orgId,
//     ) => {
//       let total = {
//         cost: 0,
//         hrs: 0,
//         aeroFringe: 0,
//         nasaFringe: 0,
//         custOH: 0,
//         columbusOH: 0,
//         subkMH: 0,
//         ga: 0,
//         fee: 0,
//         totalBurdenedCost: 0,
//         price: 0,
//       };
//       const flags = accountPoolsMap[`${acctId}-${orgId}`] || {};

//       const getRate = (pool, mIdx) => {
//         if (
//           yearRatesData &&
//           yearRatesData.monthly &&
//           typeof yearRatesData.monthly[pool]?.[mIdx] === "number"
//         ) {
//           return yearRatesData.monthly[pool][mIdx];
//         }
//         return 0;
//       };

//       for (let m = 0; m < 12; m++) {
//         const c = monthlyCosts[m] || 0;
//         const h = monthlyHrs[m] || 0;
//         if (c === 0 && h === 0) continue;

//         const aF = flags.AEROFR ? c * getRate("aeroFringe", m) : 0;
//         const nF = flags.NFRNG ? c * getRate("nasaFringe", m) : 0;
//         const tF = aF + nF;
//         const ohBase = flags.FRINGEONOVERHEAD ? c + tF : c;
//         const cuO = flags.OVH30 ? ohBase * getRate("custOH", m) : 0;
//         const coO = flags.OVH31 ? ohBase * getRate("columbusOH", m) : 0;
//         const tOH = cuO + coO;
//         const sM = flags.SMH50 ? c * getRate("subkMH", m) : 0;

//         let gaBase = c + sM;
//         if (flags.FRINGEONGNA) gaBase += tF;
//         if (flags.OVERHEADONGNA) gaBase += tOH;
//         const ga = flags.INTG40 ? gaBase * getRate("ga", m) : 0;

//         const totalBurdenedCost = c + tF + tOH + sM + ga;
//         const fee = totalBurdenedCost * (parseFloat(globalFee) / 100 || 0);
//         const price = totalBurdenedCost + fee;

//         total.cost += c;
//         total.hrs += h;
//         total.aeroFringe += aF;
//         total.nasaFringe += nF;
//         total.custOH += cuO;
//         total.columbusOH += coO;
//         total.subkMH += sM;
//         total.ga += ga;
//         total.fee += fee;
//         total.totalBurdenedCost += totalBurdenedCost;
//         total.price += price;
//       }
//       total.rate = total.hrs > 0 ? total.price / total.hrs : 0;
//       return total;
//     };

//     const emptyMonthly = () => Array(12).fill(0);
//     const emptyYearBucket = () => ({
//       mCost: emptyMonthly(),
//       mHrs: emptyMonthly(),
//     });

//     validLabor.forEach((i) => {
//       const task = getTask(i.projId || i.projectId);
//       const plcKey = String(
//         i.plc || i.billLabCatCd || i.laborCategoryCode || "",
//       )
//         .trim()
//         .toUpperCase();
//       const acctKey = String(i.acctId || "").trim();
//       const orgKey = String(i.orgId || i.org || "").trim();
//       const cat = formatDisplayType(plcMap[plcKey] || "Labor");
//       const key = `${task}-LABOR-${cat}-${acctKey}-${orgKey}`;

//       if (!agg[key])
//         agg[key] = {
//           id: key,
//           topLevel: task ? task.split(".")[0] : "",
//           orgId: orgKey,
//           isLabor: true,
//           task,
//           type: getAccountType(i.acctId) || "Direct Labor",
//           cat,
//           acctId: acctKey,
//           base: { mCost: emptyMonthly(), mHrs: emptyMonthly() },
//           opts: Array(OPTION_YEARS.length)
//             .fill(null)
//             .map(() => ({ mCost: emptyMonthly(), mHrs: emptyMonthly() })),
//           subItems: {},
//         };

//       const yearStr = String(i.year || i.fyCd || i.fy);
//       const yIndex = OPTION_YEARS.indexOf(yearStr);
//       const isBase = yearStr === BASE_YEAR;
//       const mIdx =
//         (parseInt(i.month || i.period || i.pdNo || i.pd_no) || 1) - 1;

//       if ((isBase || yIndex > -1) && mIdx >= 0 && mIdx < 12) {
//         const a = parseFloat(i.cost || 0);
//         const h = parseFloat(i.hours || i.forecastedHours || 0);
//         const target = isBase ? agg[key].base : agg[key].opts[yIndex];

//         target.mCost[mIdx] += a;
//         target.mHrs[mIdx] += h;

//         const empName = formatDisplayType(
//           i.empName || laborData.empMap[i.emplId] || "TBD",
//         );
//         const empKey = `${i.emplId}-${empName}`;
//         if (!agg[key].subItems[empKey])
//           agg[key].subItems[empKey] = {
//             name: empName,
//             emplId: i.emplId,
//             rate: parseFloat(i.hrly_rate || i.rate || i.perHourRate || 0),
//             base: { mCost: emptyMonthly(), mHrs: emptyMonthly() },
//             opts: Array(OPTION_YEARS.length)
//               .fill(null)
//               .map(() => ({ mCost: emptyMonthly(), mHrs: emptyMonthly() })),
//             rateItems: {},
//           };

//         const subObj = agg[key].subItems[empKey];
//         const subTarget = isBase ? subObj.base : subObj.opts[yIndex];
//         subTarget.mCost[mIdx] += a;
//         subTarget.mHrs[mIdx] += h;

//         // Hourly-rate breakdown for the same employee
//         // (a different rate in e.g. Mar-May creates its own line)
//         const recRate = h > 0 ? Math.round((a / h) * 100) / 100 : 0;
//         const rKey = recRate.toFixed(2);
//         if (!subObj.rateItems[rKey])
//           subObj.rateItems[rKey] = {
//             rate: recRate,
//             months: new Set(),
//             base: emptyYearBucket(),
//             opts: Array(OPTION_YEARS.length)
//               .fill(null)
//               .map(() => emptyYearBucket()),
//           };
//         const rateObj = subObj.rateItems[rKey];
//         const rateTarget = isBase ? rateObj.base : rateObj.opts[yIndex];
//         rateTarget.mCost[mIdx] += a;
//         rateTarget.mHrs[mIdx] += h;
//         rateObj.months.add(parseInt(yearStr, 10) * 12 + mIdx);
//       }
//     });

//     validNonLabor.forEach((i) => {
//       const task = getTask(i.projId);
//       const acctKey = String(i.acctId || "").trim();
//       const orgKey = String(i.orgId || i.org || "").trim();
//       const vendId = String(i.vendId || i.vendorId || i.emplId || "")
//         .trim()
//         .toUpperCase();
//       const vName = vendorMap[vendId] || i.empName || "";
//       const cat = formatDisplayType(
//         nonLaborData.coa[acctKey] || i.acctName || "Expense",
//       );
//       const key = `${task}-NONLABOR-${cat}-${acctKey}-${orgKey}-${vendId}`;

//       if (!agg[key])
//         agg[key] = {
//           id: key,
//           topLevel: task ? task.split(".")[0] : "",
//           orgId: orgKey,
//           isLabor: false,
//           task,
//           type: getAccountType(i.acctId),
//           cat,
//           vendorName: vName,
//           acctId: acctKey,
//           name: formatDisplayType(
//             nonLaborData.coa[acctKey] || i.acctName || "Expense",
//           ),
//           base: { mCost: emptyMonthly(), mHrs: emptyMonthly() },
//           opts: Array(OPTION_YEARS.length)
//             .fill(null)
//             .map(() => ({ mCost: emptyMonthly(), mHrs: emptyMonthly() })),
//         };

//       const yIndex = OPTION_YEARS.indexOf(String(i.year || i.fyCd || i.fy));
//       const isBase = String(i.year || i.fyCd || i.fy) === BASE_YEAR;
//       const mIdx =
//         (parseInt(i.month || i.period || i.pdNo || i.pd_no) || 1) - 1;

//       if ((isBase || yIndex > -1) && mIdx >= 0 && mIdx < 12) {
//         const target = isBase ? agg[key].base : agg[key].opts[yIndex];
//         target.mCost[mIdx] += parseFloat(i.cost || 0);
//       }
//     });

//     return Object.values(agg).map((r) => ({
//       ...r,
//       base: calcAnnualBurden(
//         r.base.mCost,
//         r.base.mHrs,
//         baseRatesMock,
//         r.acctId,
//         r.orgId,
//       ),
//       opts: r.opts.map((opt, idx) =>
//         calcAnnualBurden(
//           opt.mCost,
//           opt.mHrs,
//           escalatedRatesMap[OPTION_YEARS[idx]],
//           r.acctId,
//           r.orgId,
//         ),
//       ),
//       subItems: r.isLabor
//         ? Object.values(r.subItems)
//             .map((sub) => ({
//               ...sub,
//               base: calcAnnualBurden(
//                 sub.base.mCost,
//                 sub.base.mHrs,
//                 baseRatesMock,
//                 r.acctId,
//                 r.orgId,
//               ),
//               opts: sub.opts.map((opt, idx) =>
//                 calcAnnualBurden(
//                   opt.mCost,
//                   opt.mHrs,
//                   escalatedRatesMap[OPTION_YEARS[idx]],
//                   r.acctId,
//                   r.orgId,
//                 ),
//               ),
//               rateItems: Object.values(sub.rateItems).map((ri) => ({
//                 rate: ri.rate,
//                 months: [...ri.months],
//                 base: calcAnnualBurden(
//                   ri.base.mCost,
//                   ri.base.mHrs,
//                   baseRatesMock,
//                   r.acctId,
//                   r.orgId,
//                 ),
//                 opts: ri.opts.map((opt, idx) =>
//                   calcAnnualBurden(
//                     opt.mCost,
//                     opt.mHrs,
//                     escalatedRatesMap[OPTION_YEARS[idx]],
//                     r.acctId,
//                     r.orgId,
//                   ),
//                 ),
//               })),
//             }))
//             .sort((a, b) => a.name.localeCompare(b.name))
//         : [],
//     }));
//   }, [
//     masterForecast,
//     validLabor,
//     validNonLabor,
//     escalatedRatesMap,
//     burdenRates,
//     accountPoolsMap,
//     globalFee,
//     getTask,
//     getAccountType,
//     plcMap,
//     laborData.empMap,
//     nonLaborData.coa,
//     vendorMap,
//   ]);

//   // 2b. Performance By Employee (employee-level rows + per-hourly-rate breakdown)
//   const laborPerformanceData = useMemo(() => {
//     if (!Array.isArray(categoryTableData)) return [];

//     const numKeys = [
//       "cost",
//       "hrs",
//       "aeroFringe",
//       "nasaFringe",
//       "custOH",
//       "columbusOH",
//       "subkMH",
//       "ga",
//       "fee",
//       "totalBurdenedCost",
//       "price",
//     ];
//     const emptyY = () => numKeys.reduce((a, k) => ({ ...a, [k]: 0 }), {});
//     const addY = (t, s) => {
//       if (!s) return;
//       numKeys.forEach((k) => {
//         t[k] += s[k] || 0;
//       });
//     };

//     const agg = {};
//     categoryTableData.forEach((row) => {
//       if (!row.isLabor || !row.subItems) return;
//       row.subItems.forEach((sub) => {
//         const key = `${row.task}-${row.type}-${sub.emplId}-${sub.name}`;
//         if (!agg[key]) {
//           agg[key] = {
//             id: key,
//             topLevel: row.task ? row.task.split(".")[0] : "",
//             task: row.task,
//             type: row.type,
//             cat: sub.name, // shown in the 4th sticky column (Employee)
//             emplId: sub.emplId,
//             base: emptyY(),
//             opts: OPTION_YEARS.map(() => emptyY()),
//             rateRows: {},
//           };
//         }
//         addY(agg[key].base, sub.base);
//         sub.opts.forEach((o, i) => addY(agg[key].opts[i], o));

//         // Merge hourly-rate lines for this employee
//         (sub.rateItems || []).forEach((ri) => {
//           const rk = ri.rate.toFixed(2);
//           if (!agg[key].rateRows[rk]) {
//             agg[key].rateRows[rk] = {
//               rate: ri.rate,
//               months: new Set(),
//               base: emptyY(),
//               opts: OPTION_YEARS.map(() => emptyY()),
//             };
//           }
//           const rr = agg[key].rateRows[rk];
//           ri.months.forEach((m) => rr.months.add(m));
//           addY(rr.base, ri.base);
//           ri.opts.forEach((o, i) => addY(rr.opts[i], o));
//         });
//       });
//     });

//     const finalizeRate = (y) => {
//       y.rate = y.hrs > 0 ? y.price / y.hrs : 0;
//       // Employee-level Wrap Rate = Total Burdened Cost / Total Unburdened Cost.
//       y.wrapRate = y.cost > 0 ? y.totalBurdenedCost / y.cost : 0;
//       return y;
//     };

//     return Object.values(agg)
//       .map((r) => ({
//         ...r,
//         base: finalizeRate(r.base),
//         opts: r.opts.map(finalizeRate),
//         rateRows: Object.values(r.rateRows)
//           .map((rr) => ({
//             ...rr,
//             months: [...rr.months].sort((a, b) => a - b),
//             base: finalizeRate(rr.base),
//             opts: rr.opts.map(finalizeRate),
//           }))
//           .sort(
//             (a, b) =>
//               (a.months[0] ?? Infinity) - (b.months[0] ?? Infinity) ||
//               a.rate - b.rate,
//           ),
//       }))
//       .sort(
//         (a, b) =>
//           String(a.task).localeCompare(String(b.task)) ||
//           String(a.cat).localeCompare(String(b.cat)),
//       );
//   }, [categoryTableData]);

//   // 3. Labor Data (grouped per task / employee / PLC with per-year buckets)
//   const laborTableData = useMemo(() => {
//     if (!masterForecast || masterForecast.length === 0) return [];
//     const agg = {};

//     validLabor.forEach((i) => {
//       const y = String(i.year || i.fyCd || i.fy || "");
//       if (!visibleYears.includes(y)) return;
//       const isBase = y === BASE_YEAR;
//       const yIdx = OPTION_YEARS.indexOf(y);
//       if (!isBase && yIdx === -1) return;

//       const plcKey = String(
//         i.plc || i.billLabCatCd || i.laborCategoryCode || "",
//       )
//         .trim()
//         .toUpperCase();
//       const key = `${i.projId || i.projectId}-${i.emplId || i.id}-${plcKey}`;

//       if (!agg[key])
//         agg[key] = {
//           task: getTask(i.projId || i.projectId),
//           acctId: i.acctId || "N/A",
//           acctName: formatDisplayType(
//             nonLaborData.coa[String(i.acctId || "").trim()] || "Labor",
//           ),
//           org: i.orgId || i.org || "N/A",
//           type: getAccountType(i.acctId),
//           lcat: formatDisplayType(plcMap[plcKey] || "Labor Category"),
//           emplId: i.emplId || i.id,
//           emplName: formatDisplayType(
//             i.empName || laborData.empMap[String(i.emplId || i.id)] || "TBD",
//           ),
//           rate: parseFloat(i.hrly_rate || i.rate || i.perHourRate || 0),
//           hrs: 0,
//           fyAmt: 0,
//           base: emptyLaborYear(),
//           opts: OPTION_YEARS.map(() => emptyLaborYear()),
//         };

//       const h = parseFloat(i.hours || i.forecastedHours || 0);
//       const a = parseFloat(i.cost || 0);
//       const m = (parseInt(i.month || i.period || i.pdNo || i.pd_no) || 1) - 1;
//       const target = isBase ? agg[key].base : agg[key].opts[yIdx];

//       target.hrs += h;
//       target.amt += a;
//       if (m >= 0 && m < 12) {
//         target.monthly[m] += h;
//         target.monthlyAmt[m] += a;
//       }
//       agg[key].hrs += h;
//       agg[key].fyAmt += a;
//     });

//     return Object.values(agg)
//       .map((row) => {
//         if (!row.rate && row.hrs > 0) row.rate = row.fyAmt / row.hrs;
//         return row;
//       })
//       .sort(
//         (a, b) => String(a.task).localeCompare(String(b.task)) || b.hrs - a.hrs,
//       );
//   }, [
//     masterForecast,
//     validLabor,
//     visibleYears,
//     getTask,
//     getAccountType,
//     nonLaborData.coa,
//     plcMap,
//     laborData.empMap,
//   ]);

//   const laborTotals = useMemo(() => {
//     const totals = {
//       base: emptyLaborYear(),
//       opts: OPTION_YEARS.map(() => emptyLaborYear()),
//     };
//     laborTableData.forEach((row) => {
//       addLaborYear(totals.base, row.base);
//       row.opts.forEach((o, idx) => addLaborYear(totals.opts[idx], o));
//     });
//     return totals;
//   }, [laborTableData]);

//   // 4. Non-Labor Data (grouped per task / account / vendor with per-year buckets)
//   const nonLaborTableData = useMemo(() => {
//     if (!masterForecast || masterForecast.length === 0) return [];
//     const agg = {};

//     validNonLabor.forEach((i) => {
//       const y = String(i.year || i.fyCd || i.fy || "");
//       if (!visibleYears.includes(y)) return;
//       const isBase = y === BASE_YEAR;
//       const yIdx = OPTION_YEARS.indexOf(y);
//       if (!isBase && yIdx === -1) return;

//       const acctKey = String(i.acctId || i.accountId || "").trim();
//       const projKey = String(i.projId || i.projectId || "");
//       const vendId = String(i.vendId || i.vendorId || i.emplId || "")
//         .trim()
//         .toUpperCase();
//       const rawType = nonLaborData.coaTypes[acctKey];
//       const key = `${projKey}-${acctKey}-${vendId}`;

//       if (!agg[key])
//         agg[key] = {
//           task: getTask(projKey),
//           lcat: nonLaborData.coaGroups[acctKey] || rawType,
//           name: formatDisplayType(
//             nonLaborData.coa[acctKey] ||
//               i.acctName ||
//               i.accountName ||
//               "Expense",
//           ),
//           vendorName: vendorMap[vendId] || i.empName || "",
//           type: formatDisplayType(nonLaborData.coaGroups[acctKey] || rawType),
//           total: 0,
//           base: emptyNonLaborYear(),
//           opts: OPTION_YEARS.map(() => emptyNonLaborYear()),
//         };

//       const amt = parseFloat(i.cost || 0);
//       const rawMonth = i.month ?? i.period ?? i.pdNo ?? i.pd_no;
//       const parsedMonth = Number(rawMonth);
//       const m =
//         Number.isFinite(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
//           ? parsedMonth - 1
//           : -1;
//       const target = isBase ? agg[key].base : agg[key].opts[yIdx];

//       target.total += amt;
//       if (m >= 0 && m < 12) target.monthly[m] += amt;
//       agg[key].total += amt;
//     });

//     return Object.values(agg).sort(
//       (a, b) =>
//         String(a.task).localeCompare(String(b.task)) || b.total - a.total,
//     );
//   }, [
//     masterForecast,
//     validNonLabor,
//     visibleYears,
//     getTask,
//     vendorMap,
//     nonLaborData.coaTypes,
//     nonLaborData.coaGroups,
//     nonLaborData.coa,
//   ]);

//   const nonLaborTotals = useMemo(() => {
//     const totals = {
//       base: emptyNonLaborYear(),
//       opts: OPTION_YEARS.map(() => emptyNonLaborYear()),
//     };
//     nonLaborTableData.forEach((row) => {
//       addNonLaborYear(totals.base, row.base);
//       row.opts.forEach((o, idx) => addNonLaborYear(totals.opts[idx], o));
//     });
//     return totals;
//   }, [nonLaborTableData]);

//   // ==========================================
//   // DASHBOARD DATA AGGREGATION
//   // ==========================================
//   const dashboardStats = useMemo(() => {
//     if (!Array.isArray(categoryTableData) || categoryTableData.length === 0)
//       return null;

//     let totalDir = 0;
//     let totalBurd = 0;
//     let totalFee = 0;
//     let totalEvaluatedPrice = 0;

//     const yearMap = {};
//     const plcMap = {};
//     const empMap = {};
//     const venMap = {};

//     ALL_YEARS.forEach((y) => {
//       if (visibleYears.includes(y)) {
//         yearMap[y] = { name: y, "Direct Cost": 0, Burden: 0, Fee: 0, Total: 0 };
//       }
//     });

//     categoryTableData.forEach((row) => {
//       const processYear = (yData, yName) => {
//         if (!yData || !visibleYears.includes(yName)) return;

//         // const cost = yData.cost || 0;
//         // const fee = yData.fee || 0;
//         // const burd = (yData.totalBurdenedCost || 0) - cost;
//         // const price = yData.price || 0;
//         // const hrs = yData.hrs || 0;

//         const cost = Number(yData.cost || 0);
//         const fee = Number(yData.fee || 0);
//         const totalBurdenedCost = Number(yData.totalBurdenedCost || 0);

//         // Burden is the amount above direct cost.
//         const burd = Math.max(0, totalBurdenedCost - cost);

//         const price = Number(yData.price || 0);
//         const hrs = Number(yData.hrs || 0);

//         totalDir += cost;
//         totalBurd += burd;
//         totalFee += fee;
//         totalEvaluatedPrice += price;

//         yearMap[yName]["Direct Cost"] += cost;
//         yearMap[yName].Burden += burd;
//         yearMap[yName].Fee += fee;
//         yearMap[yName].Total += price;

//         if (row.isLabor) {
//           if (!plcMap[row.cat])
//             plcMap[row.cat] = { name: row.cat, Price: 0, Hours: 0 };
//           plcMap[row.cat].Price += price;
//           plcMap[row.cat].Hours += hrs;
//         } else {
//           const vName = row.vendorName || "Unassigned / General";
//           if (!venMap[vName]) venMap[vName] = { name: vName, Price: 0 };
//           venMap[vName].Price += price;
//         }
//       };

//       processYear(row.base, BASE_YEAR);
//       row.opts.forEach((opt, idx) => processYear(opt, OPTION_YEARS[idx]));

//       if (row.isLabor && row.subItems) {
//         row.subItems.forEach((sub) => {
//           const processSubYear = (yData, yName) => {
//             if (!yData || !visibleYears.includes(yName)) return;
//             const ePrice = yData.price || 0;
//             const eHrs = yData.hrs || 0;
//             if (!empMap[sub.name])
//               empMap[sub.name] = { name: sub.name, Price: 0, Hours: 0 };
//             empMap[sub.name].Price += ePrice;
//             empMap[sub.name].Hours += eHrs;
//           };
//           processSubYear(sub.base, BASE_YEAR);
//           sub.opts.forEach((opt, idx) =>
//             processSubYear(opt, OPTION_YEARS[idx]),
//           );
//         });
//       }
//     });

//     const barData = Object.values(yearMap);

//     const primaryPieData = [
//       { name: "Direct Cost", value: totalDir },
//       { name: "Burden Cost", value: totalBurd },
//       { name: "Fee", value: totalFee },
//     ].filter((d) => d.value > 0);

//     const burdenRate = totalDir > 0 ? (totalBurd / totalDir) * 100 : 0;

//     const getBurdTot = (poolKey) => {
//       let val = 0;
//       categoryTableData.forEach((row) => {
//         val += row.base[poolKey] || 0;
//         row.opts.forEach((opt, idx) => {
//           if (visibleYears.includes(OPTION_YEARS[idx]))
//             val += opt[poolKey] || 0;
//         });
//       });
//       return val;
//     };

//     const secondaryPieData = [
//       { name: "AERO", value: getBurdTot("aeroFringe"), fill: "#fcd34d" },
//       { name: "NASA", value: getBurdTot("nasaFringe"), fill: "#fbbf24" },
//       { name: "Cust OH", value: getBurdTot("custOH"), fill: "#f59e0b" },
//       {
//         name: "Off - Site OH",
//         value: getBurdTot("columbusOH"),
//         fill: "#d97706",
//       },
//       { name: "Subk M&H", value: getBurdTot("subkMH"), fill: "#b45309" },
//       { name: "G&A", value: getBurdTot("ga"), fill: "#92400e" },
//     ].filter((d) => d.value > 0);

//     const plcData = Object.values(plcMap)
//       .sort((a, b) => b.Price - a.Price)
//       .slice(0, 10);
//     const empDataList = Object.values(empMap)
//       .sort((a, b) => b.Price - a.Price)
//       .slice(0, 10);
//     const vendorDataList = Object.values(venMap)
//       .sort((a, b) => b.Price - a.Price)
//       .slice(0, 10);

//     return {
//       totalEvaluatedPrice,
//       totalDir,
//       totalBurd,
//       totalFee,
//       barData,
//       primaryPieData,
//       secondaryPieData,
//       burdenRate,
//       plcData,
//       empData: empDataList,
//       vendorData: vendorDataList,
//     };
//   }, [categoryTableData, visibleYears]);

//   const PIE_COLORS = [
//     "#3b82f6",
//     "#f59e0b",
//     "#8b5cf6",
//     "#10b981",
//     "#ef4444",
//     "#06b6d4",
//     "#84cc16",
//     "#ec4899",
//     "#6366f1",
//     "#f97316",
//   ];

//   const dashboardDetailData = useMemo(() => {
//     if (!dashboardStats) return null;
//     if (dashboardView === "Labor Categories") {
//       return (
//         dashboardStats.plcData.find(
//           (item) => item.name === selectedDashboardFilter.laborCategory,
//         ) || null
//       );
//     }
//     if (dashboardView === "Employees") {
//       return (
//         dashboardStats.empData.find(
//           (item) => item.name === selectedDashboardFilter.employee,
//         ) || null
//       );
//     }
//     if (dashboardView === "Vendors") {
//       return (
//         dashboardStats.vendorData.find(
//           (item) => item.name === selectedDashboardFilter.vendor,
//         ) || null
//       );
//     }
//     return null;
//   }, [dashboardStats, dashboardView, selectedDashboardFilter]);

//   const getDashboardDetailTotal = useCallback(() => {
//     if (!dashboardStats) return 0;
//     if (dashboardView === "Labor Categories")
//       return dashboardStats.plcData.reduce(
//         (sum, item) => sum + (item.Price || 0),
//         0,
//       );
//     if (dashboardView === "Employees")
//       return dashboardStats.empData.reduce(
//         (sum, item) => sum + (item.Price || 0),
//         0,
//       );
//     if (dashboardView === "Vendors")
//       return dashboardStats.vendorData.reduce(
//         (sum, item) => sum + (item.Price || 0),
//         0,
//       );
//     return 0;
//   }, [dashboardStats, dashboardView]);

//   // ==========================================
//   // EXPORT TO EXCEL
//   // ==========================================
//   const exportToExcel = async () => {
//     if (
//       !masterForecast ||
//       masterForecast.length === 0 ||
//       !elementsSummaryData
//     ) {
//       return alert("Please wait for data to load.");
//     }

//     const visibleYrs = ALL_YEARS.filter((y) => visibleYears.includes(y));

//     const wb = new ExcelJS.Workbook();
//     wb.creator = "Revolve Project Performance";
//     wb.created = new Date();

//     const borderAll = {
//       top: { style: "thin" },
//       left: { style: "thin" },
//       bottom: { style: "thin" },
//       right: { style: "thin" },
//     };
//     const fillGray = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFE5E7EB" },
//     };
//     const fillGrayLight = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFF3F4F6" },
//     };
//     const fillBlueHeader = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFDBEAFE" },
//     };
//     const fillBlueCell = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFEFF6FF" },
//     };
//     const fillBlueDark = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FF1E3A8A" },
//     };
//     const fillGreenHeader = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFDCFCE7" },
//     };
//     const fillGreenCell = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFF0FDF4" },
//     };
//     const fillAmber = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFFFFBEB" },
//     };
//     const fillIndigoLight = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFE0E7FF" },
//     };

//     const fontWhiteBold = { bold: true, color: { argb: "FFFFFFFF" } };
//     const fontAmberBold = { bold: true, color: { argb: "FF78350F" } };
//     const fontBold = { bold: true };

//     const getColLetter = (col) => {
//       let temp,
//         letter = "";
//       while (col > 0) {
//         temp = (col - 1) % 26;
//         letter = String.fromCharCode(temp + 65) + letter;
//         col = (col - temp - 1) / 26;
//       }
//       return letter;
//     };

//     // ==========================================
//     // TAB 1: SUMMARY (Performance By Elements)
//     // ==========================================
//     const wsSum = wb.addWorksheet("Performance By Elements");
//     wsSum.columns = [
//       { header: "Account Type", key: "type", width: 40 },
//       ...visibleYrs.map((y) => ({
//         header: `Total ${y}`,
//         key: `yr_${y}`,
//         width: 20,
//       })),
//     ];
//     wsSum.getRow(1).eachCell((cell) => {
//       cell.fill = fillGray;
//       cell.font = fontBold;
//       cell.border = borderAll;
//     });

//     const addSumRow = (name, base, opts, isHeader = false, isFinal = false) => {
//       const rowData = { type: name };
//       if (visibleYrs.includes(BASE_YEAR)) rowData[`yr_${BASE_YEAR}`] = base;
//       OPTION_YEARS.forEach((y, i) => {
//         if (visibleYrs.includes(y)) rowData[`yr_${y}`] = opts[i];
//       });
//       const row = wsSum.addRow(rowData);
//       row.eachCell((cell, colNum) => {
//         cell.border = borderAll;
//         if (colNum > 1) cell.numFmt = '"$"#,##0.00';
//         if (isHeader) {
//           cell.fill = fillGrayLight;
//           cell.font = fontBold;
//         }
//         if (isFinal) {
//           cell.fill = fillBlueDark;
//           cell.font = fontWhiteBold;
//         }
//       });
//     };

//     let tdBase = 0,
//       tdOpts = [0, 0, 0, 0, 0],
//       tbBase = 0,
//       tbOpts = [0, 0, 0, 0, 0];

//     wsSum.addRow({ type: "DIRECT COST" }).eachCell((c) => {
//       c.fill = fillGray;
//       c.font = fontBold;
//       c.border = borderAll;
//     });
//     Object.values(elementsSummaryData.directCosts).forEach((dc) => {
//       tdBase += dc.base;
//       dc.opts.forEach((o, i) => (tdOpts[i] += o));
//       addSumRow(dc.name, dc.base, dc.opts);
//     });
//     addSumRow("Total Direct Cost", tdBase, tdOpts, true);

//     wsSum.addRow({ type: "BURDEN COST" }).eachCell((c) => {
//       c.fill = fillGray;
//       c.font = fontBold;
//       c.border = borderAll;
//     });
//     Object.values(elementsSummaryData.burdens).forEach((bc) => {
//       tbBase += bc.base;
//       bc.opts.forEach((o, i) => (tbOpts[i] += o));
//       addSumRow(bc.name, bc.base, bc.opts);
//     });
//     addSumRow("Total Burden Cost", tbBase, tbOpts, true);

//     const tcBase = tdBase + tbBase;
//     const tcOpts = tdOpts.map((d, i) => d + tbOpts[i]);
//     addSumRow("Total Cost", tcBase, tcOpts, true);

//     const feeRate = parseFloat(globalFee) / 100 || 0;
//     const feeBase = tcBase * feeRate;
//     const feeOpts = tcOpts.map((c) => c * feeRate);
//     addSumRow(
//       `Fee (${Number(globalFee).toFixed(2)}%)`,
//       feeBase,
//       feeOpts,
//       false,
//       false,
//     );

//     const finalBase = tcBase + feeBase;
//     const finalOpts = tcOpts.map((c, i) => c + feeOpts[i]);
//     addSumRow("Revenue", finalBase, finalOpts, false, true);

//     // ==========================================
//     // TAB 2: Performance By Category
//     // ==========================================
//     const wsPrice = wb.addWorksheet("Performance By Category");

//     const headerRow1 = wsPrice.addRow(["Element Details", "", "", ""]);
//     const headerGroup = wsPrice.addRow(["", "", "", ""]);
//     const headerRow2 = wsPrice.addRow([
//       "Top Level",
//       "Task",
//       "Acct Type",
//       "Category",
//     ]);

//     wsPrice.mergeCells(1, 1, 2, 4);
//     let colIdx = 5;

//     const subCols = [
//       "Hrs",
//       "Unburdened",
//       "AERO",
//       "NASA",
//       "Cust OH",
//       "Off - Site OH",
//       "Subk M&H",
//       "G&A",
//       "Total Burdened Cost",
//       "Fee",
//       "Price",
//       "Burdened Rate",
//     ];

//     if (visibleYrs.includes(BASE_YEAR)) {
//       headerRow1.getCell(colIdx).value = `Base Year (${BASE_YEAR})`;
//       wsPrice.mergeCells(1, colIdx, 1, colIdx + 11);

//       headerGroup.getCell(colIdx).value = "Direct Charge";
//       wsPrice.mergeCells(2, colIdx, 2, colIdx + 1);
//       headerGroup.getCell(colIdx + 2).value = "Burden";
//       wsPrice.mergeCells(2, colIdx + 2, 2, colIdx + 7);
//       headerGroup.getCell(colIdx + 8).value = "Total Burdened Cost";
//       headerGroup.getCell(colIdx + 9).value = "Fee";
//       headerGroup.getCell(colIdx + 10).value = "Price";
//       wsPrice.mergeCells(2, colIdx + 10, 2, colIdx + 11);

//       subCols.forEach((col, i) => (headerRow2.getCell(colIdx + i).value = col));

//       for (let i = 0; i < 12; i++) {
//         headerRow1.getCell(colIdx + i).fill = fillBlueHeader;
//         headerGroup.getCell(colIdx + i).fill = fillBlueHeader;
//         headerRow2.getCell(colIdx + i).fill = fillBlueHeader;
//         headerGroup.getCell(colIdx + i).alignment = { horizontal: "center" };
//         headerRow2.getCell(colIdx + i).alignment = { horizontal: "center" };
//       }
//       colIdx += 12;
//     }

//     OPTION_YEARS.forEach((y, idx) => {
//       if (visibleYrs.includes(y)) {
//         headerRow1.getCell(colIdx).value = `Option Year ${idx + 1} (${y})`;
//         wsPrice.mergeCells(1, colIdx, 1, colIdx + 11);

//         headerGroup.getCell(colIdx).value = "Direct Charge";
//         wsPrice.mergeCells(2, colIdx, 2, colIdx + 1);
//         headerGroup.getCell(colIdx + 2).value = "Burden";
//         wsPrice.mergeCells(2, colIdx + 2, 2, colIdx + 7);
//         headerGroup.getCell(colIdx + 8).value = "Total Burdened Cost";
//         headerGroup.getCell(colIdx + 9).value = "Fee";
//         headerGroup.getCell(colIdx + 10).value = "Price";
//         wsPrice.mergeCells(2, colIdx + 10, 2, colIdx + 11);

//         subCols.forEach(
//           (col, i) => (headerRow2.getCell(colIdx + i).value = col),
//         );

//         for (let i = 0; i < 12; i++) {
//           headerRow1.getCell(colIdx + i).fill = fillGreenHeader;
//           headerGroup.getCell(colIdx + i).fill = fillGreenHeader;
//           headerRow2.getCell(colIdx + i).fill = fillGreenHeader;
//           headerGroup.getCell(colIdx + i).alignment = { horizontal: "center" };
//           headerRow2.getCell(colIdx + i).alignment = { horizontal: "center" };
//         }
//         colIdx += 12;
//       }
//     });

//     for (let i = 1; i <= 4; i++) {
//       headerRow1.getCell(i).fill = fillGray;
//       headerRow1.getCell(i).font = fontBold;
//       headerRow1.getCell(i).alignment = {
//         vertical: "middle",
//         horizontal: "center",
//       };
//       headerRow2.getCell(i).fill = fillGrayLight;
//       headerRow2.getCell(i).font = fontBold;
//     }
//     headerRow1.eachCell((c) => {
//       c.border = borderAll;
//       c.font = fontBold;
//       c.alignment = { horizontal: "center", vertical: "middle" };
//     });
//     headerGroup.eachCell((c) => {
//       c.border = borderAll;
//       c.font = fontBold;
//     });
//     headerRow2.eachCell((c) => {
//       c.border = borderAll;
//       c.font = fontBold;
//     });

//     const burdenRow1 = wsPrice.addRow(["Burden Rates %", "", "", ""]);
//     const burdenRow2 = wsPrice.addRow(["Escalated Rates", "", "", ""]);
//     const burdenRow3 = wsPrice.addRow(["Adjusted Rates", "", "", ""]);
//     wsPrice.mergeCells(4, 1, 4, 4);
//     wsPrice.mergeCells(5, 1, 5, 4);
//     wsPrice.mergeCells(6, 1, 6, 4);

//     let bColOffset = 5;

//     const applyExcelHeaders = (targetRow, dispObj, isAvg = false) => {
//       const vals = [
//         "-",
//         "-",
//         isAvg ? dispObj.aeroFringe : dispObj.aeroFringe?.escRate || 0,
//         isAvg ? dispObj.nasaFringe : dispObj.nasaFringe?.escRate || 0,
//         isAvg ? dispObj.custOH : dispObj.custOH?.escRate || 0,
//         isAvg ? dispObj.columbusOH : dispObj.columbusOH?.escRate || 0,
//         isAvg ? dispObj.subkMH : dispObj.subkMH?.escRate || 0,
//         isAvg ? dispObj.ga : dispObj.ga?.escRate || 0,
//         "-",
//         feeRate,
//         "-",
//         "-",
//       ];
//       vals.forEach((val, i) => {
//         const cell = targetRow.getCell(bColOffset + i);
//         if (typeof val === "number") {
//           cell.value = val;
//           cell.numFmt = "0.00%";
//         } else {
//           cell.value = val;
//           cell.alignment = { horizontal: "center" };
//         }
//       });
//     };

//     if (visibleYrs.includes(BASE_YEAR)) {
//       const bRates = burdenRates?.[BASE_YEAR] || zeroRates;
//       const bDisp = {
//         aeroFringe: { escRate: bRates.aeroFringe },
//         nasaFringe: { escRate: bRates.nasaFringe },
//         custOH: { escRate: bRates.custOH },
//         columbusOH: { escRate: bRates.columbusOH },
//         subkMH: { escRate: bRates.subkMH },
//         ga: { escRate: bRates.ga },
//       };
//       applyExcelHeaders(burdenRow1, bDisp, false);
//       applyExcelHeaders(burdenRow2, bDisp, false);
//       applyExcelHeaders(burdenRow3, bRates, true);
//       bColOffset += 12;
//     }

//     OPTION_YEARS.forEach((y) => {
//       if (visibleYrs.includes(y)) {
//         const yrMap = escalatedRatesMap[y] || {
//           display: {},
//           avgRates: zeroRates,
//         };
//         const bRates = burdenRates?.[y] || zeroRates;
//         const bDisp = {
//           aeroFringe: { escRate: bRates.aeroFringe },
//           nasaFringe: { escRate: bRates.nasaFringe },
//           custOH: { escRate: bRates.custOH },
//           columbusOH: { escRate: bRates.columbusOH },
//           subkMH: { escRate: bRates.subkMH },
//           ga: { escRate: bRates.ga },
//         };
//         applyExcelHeaders(burdenRow1, bDisp, false);
//         applyExcelHeaders(burdenRow2, yrMap.display, false);
//         applyExcelHeaders(burdenRow3, yrMap.avgRates, true);
//         bColOffset += 12;
//       }
//     });

//     burdenRow1.eachCell((c) => {
//       c.fill = fillAmber;
//       c.font = fontAmberBold;
//       c.border = borderAll;
//     });
//     burdenRow2.eachCell((c) => {
//       c.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FFFDE68A" },
//       };
//       c.font = fontAmberBold;
//       c.border = borderAll;
//     });
//     burdenRow3.eachCell((c) => {
//       c.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FFFEF3C7" },
//       };
//       c.font = fontAmberBold;
//       c.border = borderAll;
//     });

//     let pRowIdx = 7;

//     categoryTableData.forEach((row) => {
//       const excelRow = wsPrice.addRow([
//         row.topLevel,
//         row.task,
//         row.type,
//         row.cat,
//       ]);
//       const rFlags = accountPoolsMap[`${row.acctId}-${row.orgId}`] || {};
//       let colOffset = 5;

//       const applyExactValues = (dataGroup, colStart, isBase) => {
//         const cHrs = getColLetter(colStart);
//         const cCost = getColLetter(colStart + 1);
//         const cAero = getColLetter(colStart + 2);
//         const cNasa = getColLetter(colStart + 3);
//         const cCust = getColLetter(colStart + 4);
//         const cCol = getColLetter(colStart + 5);
//         const cSubk = getColLetter(colStart + 6);
//         const cGA = getColLetter(colStart + 7);
//         const cTotBurd = getColLetter(colStart + 8);
//         const cFee = getColLetter(colStart + 9);
//         const cPrice = getColLetter(colStart + 10);

//         const hrsCell = excelRow.getCell(colStart);
//         const costCell = excelRow.getCell(colStart + 1);

//         hrsCell.value = dataGroup.hrs;
//         if (dataGroup.hrs > 0) {
//           const implicitRate = dataGroup.cost / dataGroup.hrs;
//           costCell.value = {
//             formula: `${cHrs}${pRowIdx}*${implicitRate}`,
//             result: dataGroup.cost,
//           };
//         } else {
//           costCell.value = dataGroup.cost;
//         }

//         hrsCell.protection = { locked: false };
//         costCell.protection = { locked: false };

//         excelRow.getCell(colStart + 2).value = rFlags.AEROFR
//           ? { formula: `${cCost}${pRowIdx}*${cAero}$6` }
//           : 0;
//         excelRow.getCell(colStart + 3).value = rFlags.NFRNG
//           ? { formula: `${cCost}${pRowIdx}*${cNasa}$6` }
//           : 0;
//         const fringeStr = `(${cAero}${pRowIdx}+${cNasa}${pRowIdx})`;
//         const ohBaseStr = rFlags.FRINGEONOVERHEAD
//           ? `(${cCost}${pRowIdx}+${fringeStr})`
//           : `${cCost}${pRowIdx}`;

//         excelRow.getCell(colStart + 4).value = rFlags.OVH30
//           ? { formula: `${ohBaseStr}*${cCust}$6` }
//           : 0;
//         excelRow.getCell(colStart + 5).value = rFlags.OVH31
//           ? { formula: `${ohBaseStr}*${cCol}$6` }
//           : 0;
//         excelRow.getCell(colStart + 6).value = rFlags.SMH50
//           ? { formula: `${cCost}${pRowIdx}*${cSubk}$6` }
//           : 0;

//         let gaBaseStr = `${cCost}${pRowIdx}+${cSubk}${pRowIdx}`;
//         if (rFlags.FRINGEONGNA)
//           gaBaseStr += `+${cAero}${pRowIdx}+${cNasa}${pRowIdx}`;
//         if (rFlags.OVERHEADONGNA)
//           gaBaseStr += `+${cCust}${pRowIdx}+${cCol}${pRowIdx}`;

//         excelRow.getCell(colStart + 7).value = rFlags.INTG40
//           ? { formula: `(${gaBaseStr})*${cGA}$6` }
//           : 0;
//         excelRow.getCell(colStart + 8).value = {
//           formula: `SUM(${cCost}${pRowIdx}:${cGA}${pRowIdx})`,
//         };
//         excelRow.getCell(colStart + 9).value = {
//           formula: `${cTotBurd}${pRowIdx}*${feeRate}`,
//         };
//         excelRow.getCell(colStart + 10).value = {
//           formula: `${cTotBurd}${pRowIdx}+${cFee}${pRowIdx}`,
//         };
//         excelRow.getCell(colStart + 11).value = {
//           formula: `IF(${cHrs}${pRowIdx}>0, ${cPrice}${pRowIdx}/${cHrs}${pRowIdx}, 0)`,
//         };

//         for (let i = 0; i < 12; i++) {
//           const cell = excelRow.getCell(colStart + i);
//           if (i > 0) cell.numFmt = '"$"#,##0.00';
//           cell.fill = isBase ? fillBlueCell : fillGreenCell;
//         }
//         excelRow.getCell(colStart + 10).font = fontBold;
//         excelRow.getCell(colStart + 11).font = fontBold;
//       };

//       if (visibleYrs.includes(BASE_YEAR)) {
//         applyExactValues(row.base, colOffset, true);
//         colOffset += 12;
//       }
//       row.opts.forEach((optData, oIdx) => {
//         if (visibleYrs.includes(OPTION_YEARS[oIdx])) {
//           applyExactValues(optData, colOffset, false);
//           colOffset += 12;
//         }
//       });

//       for (let i = 1; i <= 4; i++) {
//         excelRow.getCell(i).fill = fillGrayLight;
//       }
//       excelRow.eachCell((c) => (c.border = borderAll));
//       pRowIdx++;
//     });

//     wsPrice.getColumn(1).width = 15;
//     wsPrice.getColumn(2).width = 25;
//     wsPrice.getColumn(3).width = 20;
//     wsPrice.getColumn(4).width = 30;

//     let expandColIdx = 5;
//     const subColWidths = [12, 16, 14, 14, 14, 14, 14, 14, 18, 14, 18, 14];
//     for (let y = 0; y < visibleYrs.length; y++) {
//       for (let i = 0; i < 12; i++) {
//         wsPrice.getColumn(expandColIdx + i).width = subColWidths[i];
//       }
//       expandColIdx += 12;
//     }

//     await wsPrice.protect("revolve");

//     // ==========================================
//     // TAB 3a: Performance By Employee (with hourly-rate breakdown lines)
//     // ==========================================
//     const wsLaborPerf = wb.addWorksheet("Performance By Employee");

//     const laborHeaderRow1 = wsLaborPerf.addRow(["Element Details", "", "", ""]);
//     const laborHeaderGroup = wsLaborPerf.addRow(["", "", "", ""]);
//     const laborHeaderRow2 = wsLaborPerf.addRow([
//       "Top Level",
//       "Task / Period",
//       "Acct Type",
//       "Employee",
//     ]);

//     wsLaborPerf.mergeCells(1, 1, 2, 4);

//     let laborColIdx = 5;

//     const laborSubCols = [
//       "Hrs",
//       "Unburdened",
//       "AERO",
//       "NASA",
//       "Cust OH",
//       "Off - Site OH",
//       "Subk M&H",
//       "G&A",
//       "Total Burdened Cost",
//       "Wrap Rate",
//       "Fee",
//       "Price",
//       "Burdened Rate",
//     ];

//     const laborYearCols = 13;

//     if (visibleYrs.includes(BASE_YEAR)) {
//       laborHeaderRow1.getCell(laborColIdx).value = `Base Year (${BASE_YEAR})`;
//       wsLaborPerf.mergeCells(
//         1,
//         laborColIdx,
//         1,
//         laborColIdx + laborYearCols - 1,
//       );

//       laborHeaderGroup.getCell(laborColIdx).value = "Direct Charge";
//       wsLaborPerf.mergeCells(2, laborColIdx, 2, laborColIdx + 1);

//       laborHeaderGroup.getCell(laborColIdx + 2).value = "Burden";
//       wsLaborPerf.mergeCells(2, laborColIdx + 2, 2, laborColIdx + 7);

//       laborHeaderGroup.getCell(laborColIdx + 8).value = "Total Burdened Cost";
//       laborHeaderGroup.getCell(laborColIdx + 9).value = "Wrap Rate";
//       laborHeaderGroup.getCell(laborColIdx + 10).value = "Fee";
//       laborHeaderGroup.getCell(laborColIdx + 11).value = "Price";
//       laborHeaderGroup.getCell(laborColIdx + 12).value = "Burdened Rate";

//       laborSubCols.forEach(
//         (col, i) => (laborHeaderRow2.getCell(laborColIdx + i).value = col),
//       );

//       for (let i = 0; i < laborYearCols; i++) {
//         laborHeaderRow1.getCell(laborColIdx + i).fill = fillBlueHeader;
//         laborHeaderGroup.getCell(laborColIdx + i).fill = fillBlueHeader;
//         laborHeaderRow2.getCell(laborColIdx + i).fill = fillBlueHeader;

//         laborHeaderGroup.getCell(laborColIdx + i).alignment = {
//           horizontal: "center",
//         };
//         laborHeaderRow2.getCell(laborColIdx + i).alignment = {
//           horizontal: "center",
//         };
//       }

//       laborColIdx += laborYearCols;
//     }

//     OPTION_YEARS.forEach((y, idx) => {
//       if (visibleYrs.includes(y)) {
//         laborHeaderRow1.getCell(laborColIdx).value =
//           `Option Year ${idx + 1} (${y})`;

//         wsLaborPerf.mergeCells(
//           1,
//           laborColIdx,
//           1,
//           laborColIdx + laborYearCols - 1,
//         );

//         laborHeaderGroup.getCell(laborColIdx).value = "Direct Charge";
//         wsLaborPerf.mergeCells(2, laborColIdx, 2, laborColIdx + 1);

//         laborHeaderGroup.getCell(laborColIdx + 2).value = "Burden";
//         wsLaborPerf.mergeCells(2, laborColIdx + 2, 2, laborColIdx + 7);

//         laborHeaderGroup.getCell(laborColIdx + 8).value = "Total Burdened Cost";
//         laborHeaderGroup.getCell(laborColIdx + 9).value = "Wrap Rate";
//         laborHeaderGroup.getCell(laborColIdx + 10).value = "Fee";
//         laborHeaderGroup.getCell(laborColIdx + 11).value = "Price";
//         laborHeaderGroup.getCell(laborColIdx + 12).value = "Burdened Rate";

//         laborSubCols.forEach(
//           (col, i) => (laborHeaderRow2.getCell(laborColIdx + i).value = col),
//         );

//         for (let i = 0; i < laborYearCols; i++) {
//           laborHeaderRow1.getCell(laborColIdx + i).fill = fillGreenHeader;
//           laborHeaderGroup.getCell(laborColIdx + i).fill = fillGreenHeader;
//           laborHeaderRow2.getCell(laborColIdx + i).fill = fillGreenHeader;

//           laborHeaderGroup.getCell(laborColIdx + i).alignment = {
//             horizontal: "center",
//           };
//           laborHeaderRow2.getCell(laborColIdx + i).alignment = {
//             horizontal: "center",
//           };
//         }

//         laborColIdx += laborYearCols;
//       }
//     });

//     laborHeaderRow1.eachCell((cell) => {
//       cell.border = borderAll;
//       cell.font = fontBold;
//     });

//     laborHeaderGroup.eachCell((cell) => {
//       cell.border = borderAll;
//       cell.font = fontBold;
//     });

//     laborHeaderRow2.eachCell((cell) => {
//       cell.border = borderAll;
//       cell.font = fontBold;
//     });

//     // Column numbers of every visible "Wrap Rate" column (10th col of each year block)
//     const wrapColSet = new Set();
//     {
//       let c = 5;
//       ALL_YEARS.forEach((y) => {
//         if (visibleYrs.includes(y)) {
//           wrapColSet.add(c + 9);
//           c += laborYearCols;
//         }
//       });
//     }

//     const addEmployeeExcelRow = (prefix, yearBlocks, isRateLine) => {
//       const row = [...prefix];
//       yearBlocks.forEach((y, i) => {
//         if (!visibleYrs.includes(ALL_YEARS[i])) return;
//         row.push(
//           y.hrs,
//           y.cost,
//           y.aeroFringe,
//           y.nasaFringe,
//           y.custOH,
//           y.columbusOH,
//           y.subkMH,
//           y.ga,
//           y.totalBurdenedCost,
//           y.cost > 0 ? y.totalBurdenedCost / y.cost : 0,
//           y.fee,
//           y.price,
//           y.rate,
//         );
//       });

//       const excelRow = wsLaborPerf.addRow(row);

//       excelRow.eachCell((cell, colNum) => {
//         cell.border = borderAll;
//         if (isRateLine) {
//           cell.fill = fillIndigoLight;
//           cell.font = { italic: true };
//         }
//         if (colNum >= 5) {
//           cell.numFmt = wrapColSet.has(colNum) ? "0.00" : "#,##0.00";
//         }
//       });
//     };

//     laborPerformanceData.forEach((r) => {
//       addEmployeeExcelRow(
//         [r.topLevel, r.task, r.type, r.cat],
//         [r.base, ...r.opts],
//         false,
//       );

//       // One extra line per distinct hourly rate for this employee
//       (r.rateRows || []).forEach((rr) => {
//         addEmployeeExcelRow(
//           [
//             "",
//             formatPeriods(rr.months),
//             r.type,
//             `   ↳ ${formatCurrency(rr.rate)} / hr`,
//           ],
//           [rr.base, ...rr.opts],
//           true,
//         );
//       });
//     });

//     wsLaborPerf.columns = [
//       { width: 15 },
//       { width: 28 },
//       { width: 18 },
//       { width: 30 },
//       ...Array(laborColIdx - 5).fill({ width: 16 }),
//     ];

//     // ==========================================
//     // TAB 3b: PLANNED LABOR (Year-over-Year Layout)
//     // ==========================================
//     const wsLab = wb.addWorksheet("Labor");

//     const labGroupRow = wsLab.addRow(["Element Details", "", "", "", "", ""]);
//     wsLab.mergeCells(1, 1, 2, 6);

//     const labHeaderRow = wsLab.addRow([
//       "Task",
//       "Acct Type",
//       "PLC",
//       "EMP ID",
//       "Name",
//       "Rate",
//     ]);

//     let lColIdx = 7;

//     const getLabSubCols = () => {
//       const cols = ["Total Hrs", "Total Amt"];
//       months.forEach((m) => {
//         if (laborMetrics.hrs) cols.push(`${m} Hrs`);
//         if (laborMetrics.amt) cols.push(`${m} Amt`);
//       });
//       return cols;
//     };
//     const labSubCols = getLabSubCols();

//     if (visibleYrs.includes(BASE_YEAR)) {
//       labGroupRow.getCell(lColIdx).value = `Base Year (${BASE_YEAR})`;
//       wsLab.mergeCells(1, lColIdx, 1, lColIdx + labSubCols.length - 1);
//       labSubCols.forEach(
//         (col, i) => (labHeaderRow.getCell(lColIdx + i).value = col),
//       );

//       for (let i = 0; i < labSubCols.length; i++) {
//         labGroupRow.getCell(lColIdx + i).fill = fillBlueHeader;
//         labGroupRow.getCell(lColIdx + i).font = fontBold;
//         labGroupRow.getCell(lColIdx + i).alignment = { horizontal: "center" };
//         labHeaderRow.getCell(lColIdx + i).fill = fillBlueHeader;
//         labHeaderRow.getCell(lColIdx + i).font = fontBold;
//       }
//       lColIdx += labSubCols.length;
//     }

//     OPTION_YEARS.forEach((y, idx) => {
//       if (visibleYrs.includes(y)) {
//         labGroupRow.getCell(lColIdx).value = `Option Year ${idx + 1} (${y})`;
//         wsLab.mergeCells(1, lColIdx, 1, lColIdx + labSubCols.length - 1);
//         labSubCols.forEach(
//           (col, i) => (labHeaderRow.getCell(lColIdx + i).value = col),
//         );

//         for (let i = 0; i < labSubCols.length; i++) {
//           labGroupRow.getCell(lColIdx + i).fill = fillGreenHeader;
//           labGroupRow.getCell(lColIdx + i).font = fontBold;
//           labGroupRow.getCell(lColIdx + i).alignment = { horizontal: "center" };
//           labHeaderRow.getCell(lColIdx + i).fill = fillGreenHeader;
//           labHeaderRow.getCell(lColIdx + i).font = fontBold;
//         }
//         lColIdx += labSubCols.length;
//       }
//     });

//     for (let i = 1; i <= 6; i++) {
//       labGroupRow.getCell(i).fill = fillGray;
//       labGroupRow.getCell(i).font = fontBold;
//       labGroupRow.getCell(i).alignment = {
//         vertical: "middle",
//         horizontal: "center",
//       };
//       labHeaderRow.getCell(i).fill = fillGrayLight;
//       labHeaderRow.getCell(i).font = fontBold;
//     }
//     labGroupRow.eachCell((c) => {
//       c.border = borderAll;
//     });
//     labHeaderRow.eachCell((c) => {
//       c.border = borderAll;
//     });

//     laborTableData.forEach((row) => {
//       const rowData = [
//         row.task,
//         row.type,
//         row.lcat,
//         row.emplId,
//         row.emplName,
//         row.rate,
//       ];
//       const fmts = [null, null, null, null, null, '"$"#,##0.00'];

//       [row.base, ...row.opts].forEach((yData, yIdx) => {
//         if (!visibleYrs.includes(ALL_YEARS[yIdx])) return;
//         rowData.push(yData.hrs > 0 ? yData.hrs : "");
//         fmts.push("#,##0.00");
//         rowData.push(yData.amt > 0 ? yData.amt : "");
//         fmts.push('"$"#,##0.00');
//         months.forEach((m, i) => {
//           if (laborMetrics.hrs) {
//             rowData.push(yData.monthly[i] > 0 ? yData.monthly[i] : "");
//             fmts.push("#,##0.00");
//           }
//           if (laborMetrics.amt) {
//             rowData.push(yData.monthlyAmt[i] > 0 ? yData.monthlyAmt[i] : "");
//             fmts.push('"$"#,##0.00');
//           }
//         });
//       });

//       const excelRow = wsLab.addRow(rowData);
//       rowData.forEach((_, idx) => {
//         const c = excelRow.getCell(idx + 1);
//         c.border = borderAll;
//         if (idx < 6) c.fill = fillGrayLight;
//         if (fmts[idx] && typeof c.value === "number") c.numFmt = fmts[idx];
//       });
//     });

//     // ==========================================
//     // TAB 4: Non-Labor (Year-over-Year Layout)
//     // ==========================================
//     const wsNL = wb.addWorksheet("Non-Labor");

//     const nlGroupRow = wsNL.addRow(["Element Details", "", "", ""]);
//     wsNL.mergeCells(1, 1, 2, 4);
//     const nlHeaderRow = wsNL.addRow([
//       "Task",
//       "Account Type",
//       "Account Name",
//       "Vendor Name",
//     ]);

//     let nColIdx = 5;
//     const nlSubCols = ["Total Cost", ...months];

//     if (visibleYrs.includes(BASE_YEAR)) {
//       nlGroupRow.getCell(nColIdx).value = `Base Year (${BASE_YEAR})`;
//       wsNL.mergeCells(1, nColIdx, 1, nColIdx + nlSubCols.length - 1);
//       nlSubCols.forEach(
//         (col, i) => (nlHeaderRow.getCell(nColIdx + i).value = col),
//       );

//       for (let i = 0; i < nlSubCols.length; i++) {
//         nlGroupRow.getCell(nColIdx + i).fill = fillBlueHeader;
//         nlGroupRow.getCell(nColIdx + i).font = fontBold;
//         nlGroupRow.getCell(nColIdx + i).alignment = { horizontal: "center" };
//         nlHeaderRow.getCell(nColIdx + i).fill = fillBlueHeader;
//         nlHeaderRow.getCell(nColIdx + i).font = fontBold;
//       }
//       nColIdx += nlSubCols.length;
//     }

//     OPTION_YEARS.forEach((y, idx) => {
//       if (visibleYrs.includes(y)) {
//         nlGroupRow.getCell(nColIdx).value = `Option Year ${idx + 1} (${y})`;
//         wsNL.mergeCells(1, nColIdx, 1, nColIdx + nlSubCols.length - 1);
//         nlSubCols.forEach(
//           (col, i) => (nlHeaderRow.getCell(nColIdx + i).value = col),
//         );

//         for (let i = 0; i < nlSubCols.length; i++) {
//           nlGroupRow.getCell(nColIdx + i).fill = fillGreenHeader;
//           nlGroupRow.getCell(nColIdx + i).font = fontBold;
//           nlGroupRow.getCell(nColIdx + i).alignment = { horizontal: "center" };
//           nlHeaderRow.getCell(nColIdx + i).fill = fillGreenHeader;
//           nlHeaderRow.getCell(nColIdx + i).font = fontBold;
//         }
//         nColIdx += nlSubCols.length;
//       }
//     });

//     for (let i = 1; i <= 4; i++) {
//       nlGroupRow.getCell(i).fill = fillGray;
//       nlGroupRow.getCell(i).font = fontBold;
//       nlGroupRow.getCell(i).alignment = {
//         vertical: "middle",
//         horizontal: "center",
//       };
//       nlHeaderRow.getCell(i).fill = fillGrayLight;
//       nlHeaderRow.getCell(i).font = fontBold;
//     }
//     nlGroupRow.eachCell((c) => {
//       c.border = borderAll;
//     });
//     nlHeaderRow.eachCell((c) => {
//       c.border = borderAll;
//     });

//     nonLaborTableData.forEach((row) => {
//       const rowData = [row.task, row.type, row.name, row.vendorName || "-"];

//       [row.base, ...row.opts].forEach((yData, yIdx) => {
//         if (!visibleYrs.includes(ALL_YEARS[yIdx])) return;
//         rowData.push(yData.total > 0 ? yData.total : "");
//         months.forEach((m, i) => {
//           rowData.push(yData.monthly[i] > 0 ? yData.monthly[i] : "");
//         });
//       });

//       const excelRow = wsNL.addRow(rowData);
//       rowData.forEach((_, idx) => {
//         const c = excelRow.getCell(idx + 1);
//         c.border = borderAll;
//         if (idx < 4) c.fill = fillGrayLight;
//         else if (typeof c.value === "number") c.numFmt = '"$"#,##0.00';
//       });
//     });

//     const buffer = await wb.xlsx.writeBuffer();
//     const blob = new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     saveAs(blob, `Project Performance_Export_${selectedProject || ""}.xlsx`);
//   };

//   // Auto-populate Proposal Package template
//   useEffect(() => {
//     if (activeTab === "Proposal Package") {
//       const currentProject =
//         projectSearchResults.find((p) => p.projectId === selectedProject) || {};
//       const projName = currentProject.name || "New Business";
//       const todayDate = new Date().toLocaleDateString();
//       const companyName = import.meta.env.VITE_CLIENT_ID || "[Company Name]";

//       const customerName = currentProject.customer || "[Agency Name]";
//       const contractType =
//         currentProject.contractTypes || "[FFP / T&M / Cost-Reimbursement]";
//       const startDate = currentProject.startDate
//         ? new Date(currentProject.startDate).toLocaleDateString()
//         : "[Start Date]";
//       const endDate = currentProject.endDate
//         ? new Date(currentProject.endDate).toLocaleDateString()
//         : "[End Date]";
//       const periodOfPerf =
//         currentProject.startDate && currentProject.endDate
//           ? `${startDate} - ${endDate}`
//           : "[Base Period and Option Periods]";

//       let laborRowsHTML = "";
//       let totalBasePrice = 0,
//         totalOpt1 = 0,
//         totalOpt2 = 0,
//         totalOpt3 = 0,
//         totalOpt4 = 0;
//       let totalOdcsCost = 0;

//       const clinTotals = {};

//       if (Array.isArray(categoryTableData)) {
//         categoryTableData.forEach((item) => {
//           if (item.base?.price) totalBasePrice += item.base.price;
//           if (item.opts?.[0]?.price) totalOpt1 += item.opts[0].price;
//           if (item.opts?.[1]?.price) totalOpt2 += item.opts[1].price;
//           if (item.opts?.[2]?.price) totalOpt3 += item.opts[2].price;
//           if (item.opts?.[3]?.price) totalOpt4 += item.opts[3].price;

//           const t = item.task || "0001";
//           if (!clinTotals[t])
//             clinTotals[t] = { base: 0, opt1: 0, opt2: 0, opt3: 0, opt4: 0 };
//           if (item.base?.price) clinTotals[t].base += item.base.price;
//           if (item.opts?.[0]?.price) clinTotals[t].opt1 += item.opts[0].price;
//           if (item.opts?.[1]?.price) clinTotals[t].opt2 += item.opts[1].price;
//           if (item.opts?.[2]?.price) clinTotals[t].opt3 += item.opts[2].price;
//           if (item.opts?.[3]?.price) clinTotals[t].opt4 += item.opts[3].price;

//           if (item.isLabor && item.base?.hrs > 0) {
//             laborRowsHTML += `<tr><td>Base Year</td><td>${item.cat}</td><td>${formatNum(item.base.hrs)}</td><td>${formatCurrency(item.base.rate)}</td><td>${formatCurrency(item.base.price)}</td></tr>`;
//           }
//           if (!item.isLabor) {
//             totalOdcsCost += item.base?.cost || 0;
//             item.opts.forEach((o) => {
//               totalOdcsCost += o?.cost || 0;
//             });
//           }
//         });
//       }

//       const totalEvaluatedPrice =
//         totalBasePrice + totalOpt1 + totalOpt2 + totalOpt3 + totalOpt4;

//       const buildSec = (key, title, content, pageBreak = false) => {
//         const isIncluded = docSections[key];
//         const boxStyle = isIncluded
//           ? ""
//           : "color: red; border: 2px dashed red; padding: 15px; margin-bottom: 20px; opacity: 0.5; background: #fff5f5;";
//         const cssClass = isIncluded ? "included-section" : "omitted-section";

//         let html = `<div class="${cssClass}" style="${boxStyle}">`;
//         if (!isIncluded) {
//           html += `<div style="color: red; font-weight: bold; font-size: 12px; margin-bottom: 10px;">[OMITTED FROM EXPORT: ${title}]</div>`;
//         }
//         html += content;
//         html += `</div>`;

//         if (isIncluded && pageBreak) {
//           html += `<hr class="included-section" style="page-break-after: always;" />`;
//         }
//         return html;
//       };

//       let templateHTML = `
//         <h1 style="text-align: center;">Proposal for U.S. Government Contract</h1>
//         <p><strong>Solicitation Number:</strong> [Solicitation Number]</p>
//         <p><strong>Project / Requirement Title:</strong> ${projName}</p>
//         <p><strong>Submitted To:</strong> ${customerName}</p>
//         <p><strong>Submitted By:</strong> ${companyName}</p>
//         <p><strong>Proposal Date:</strong> ${todayDate}</p>
//         <p><strong>Proposal Version:</strong> [Version Number]</p>
//         <p><strong>Offeror Legal Name:</strong> [Company Legal Name]</p>
//         <p><strong>UEI:</strong> [UEI Number] | <strong>CAGE Code:</strong> [CAGE Code]</p>
//         <p><strong>Address:</strong> [Company Address]</p>
//         <p><strong>Authorized Representative:</strong> [Name, Title] | <strong>Email:</strong> [Email] | <strong>Phone:</strong> [Phone Number]</p>
//         <hr />
//         <h3>Document Control</h3>
//         <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
//           <tr><th>Version</th><th>Date</th><th>Description</th><th>Prepared By</th><th>Reviewed By</th></tr>
//           <tr><td>Initial Draft</td><td>${todayDate}</td><td>Initial template generation</td><td>[Name]</td><td>[Name]</td></tr>
//           <tr><td>Final Proposal</td><td>[Date]</td><td>Final review</td><td>[Name]</td><td>[Name]</td></tr>
//         </table>
//         <br/>
//         <h3>Proposal Submission Checklist</h3>
//         <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
//           <tr><th>Item</th><th>Required?</th><th>Status</th><th>Notes</th></tr>
//           <tr><td>Signed SF 33 / SF 1449 / Required Form</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
//           <tr><td>Acknowledgement of Amendments</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
//           <tr><td>Technical Proposal</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
//           <tr><td>Past Performance Volume</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
//           <tr><td>Price Proposal</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
//           <tr><td>Representations and Certifications</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
//           <tr><td>Compliance Matrix</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
//         </table>
//         <hr style="page-break-after: always;" />
//       `;

//       templateHTML += buildSec(
//         "coverLetter",
//         "Cover Letter",
//         `
//         <h2>Cover Letter</h2>
//         <p><strong>Date:</strong> ${todayDate}</p>
//         <p><strong>To:</strong> [Contracting Officer Name], [Agency Name], [Agency Address]</p>
//         <p><strong>Subject:</strong> Proposal Submission for Solicitation No. [Solicitation Number]</p>
//         <p>Dear [Contracting Officer Name],</p>
//         <p>${companyName} is pleased to submit this proposal in response to Solicitation No. [Solicitation Number] for ${projName}. We have reviewed the solicitation, including all amendments, and submit this proposal in accordance with the instructions provided in the solicitation.</p>
//         <p>${companyName} confirms that this proposal is valid for [Number] calendar days from the proposal submission date, unless otherwise specified in the solicitation.</p>
//         <p>Our company is registered in SAM.gov and provides the following identifying information:</p>
//         <ul>
//           <li><strong>Legal Business Name:</strong> [Company Legal Name]</li>
//           <li><strong>UEI:</strong> [UEI]</li>
//           <li><strong>CAGE Code:</strong> [CAGE Code]</li>
//           <li><strong>NAICS Code:</strong> [NAICS Code]</li>
//           <li><strong>Business Size / Set-Aside Status:</strong> [Small Business / 8(a) / SDVOSB / WOSB / HUBZone / Other]</li>
//         </ul>
//         <p>Please contact [Contact Name] at [Email] or [Phone] regarding this proposal.</p>
//         <p>Sincerely,<br/>[Authorized Signatory Name]<br/>[Title]<br/>${companyName}</p>
//       `,
//         true,
//       );

//       templateHTML += buildSec(
//         "vol1Admin",
//         "Volume I: Administrative Information",
//         `
//         <h2>Volume I: Administrative Information</h2>
//         <h3>1.1 Offeror Information</h3>
//         <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
//           <tr><td><strong>Legal Business Name</strong></td><td>${companyName}</td></tr>
//           <tr><td><strong>Doing Business As</strong></td><td>[DBA, if applicable]</td></tr>
//           <tr><td><strong>UEI / CAGE Code</strong></td><td>[UEI] / [CAGE Code]</td></tr>
//           <tr><td><strong>TIN / EIN</strong></td><td>[TIN / EIN]</td></tr>
//           <tr><td><strong>SAM.gov Registration</strong></td><td>Active / Pending / Expiration Date: [Date]</td></tr>
//           <tr><td><strong>NAICS Code / Business Size</strong></td><td>[NAICS] / [Small / Other Than Small]</td></tr>
//           <tr><td><strong>Authorized Representative</strong></td><td>[Name, Title, Email, Phone]</td></tr>
//         </table>
//         <br/>
//         <h3>1.2 Solicitation Information</h3>
//         <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
//           <tr><td><strong>Solicitation Number</strong></td><td>[Solicitation Number]</td></tr>
//           <tr><td><strong>Agency / Contracting Office</strong></td><td>${customerName} / [Contracting Office]</td></tr>
//           <tr><td><strong>Contract Type</strong></td><td>${contractType}</td></tr>
//           <tr><td><strong>Set-Aside</strong></td><td>[Full and Open / Small Business / 8(a) / SDVOSB / Other]</td></tr>
//           <tr><td><strong>Period of Performance</strong></td><td>${periodOfPerf}</td></tr>
//           <tr><td><strong>Proposal Due Date</strong></td><td>[Due Date and Time]</td></tr>
//           <tr><td><strong>Submission Method</strong></td><td>[SAM.gov / Email / Procurement Portal / Other]</td></tr>
//         </table>
//         <br/>
//         <h3>1.3 Amendment Acknowledgement</h3>
//         <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
//           <tr><th>Amendment Number</th><th>Date</th><th>Acknowledged?</th><th>Notes</th></tr>
//           <tr><td>0001</td><td>[Date]</td><td>Yes / No</td><td>[Notes]</td></tr>
//         </table>
//         <br/>
//         <h3>Compliance Matrix</h3>
//         <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
//           <tr><th>Solicitation Reference</th><th>Requirement</th><th>Proposal Response Location</th><th>Status</th></tr>
//           <tr><td>Section L, [Reference]</td><td>[Requirement Description]</td><td>[Volume / Section / Page]</td><td>Compliant</td></tr>
//           <tr><td>Section M, [Reference]</td><td>[Evaluation Factor]</td><td>[Volume / Section / Page]</td><td>Compliant</td></tr>
//           <tr><td>PWS Section [Reference]</td><td>[Technical Requirement]</td><td>[Volume / Section / Page]</td><td>Compliant</td></tr>
//         </table>
//       `,
//         true,
//       );

//       templateHTML += buildSec(
//         "vol2Tech",
//         "Volume II: Technical Proposal",
//         `
//         <h2>Volume II: Technical Proposal</h2>
//         <h3>2.1 Understanding of Requirements</h3>
//         <p>${companyName} understands that ${customerName} requires [brief description of requirement]. The objective of this effort is to [describe the agency mission need, project goal, or service requirement]. Our understanding is based on the solicitation, Performance Work Statement / Statement of Work, attachments, amendments, and any government responses to questions.</p>
//         <h3>2.2 Technical Approach</h3>
//         <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
//           <tr><th>PWS/SOW Requirement</th><th>Proposed Approach</th><th>Expected Outcome</th></tr>
//           <tr><td>[Requirement 1]</td><td>[Approach]</td><td>[Outcome]</td></tr>
//           <tr><td>[Requirement 2]</td><td>[Approach]</td><td>[Outcome]</td></tr>
//         </table>
//         <h3>2.3 Work Plan</h3>
//         <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
//           <tr><th>Task Description</th><th>Responsible Role</th><th>Deliverable</th><th>Timeline</th></tr>
//           <tr><td>[Task 1]</td><td>[Role]</td><td>[Deliverable Name]</td><td>[Timeline / Due Date]</td></tr>
//           <tr><td>[Task 2]</td><td>[Role]</td><td>[Deliverable Name]</td><td>[Timeline / Due Date]</td></tr>
//         </table>
//         <h3>2.4 Deliverables</h3>
//         <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
//           <tr><th>Deliverable Name</th><th>Description</th><th>Frequency</th><th>Due Date</th></tr>
//           <tr><td>[Deliverable Name]</td><td>[Description]</td><td>[One-time / Monthly / Quarterly]</td><td>[Due Date]</td></tr>
//         </table>
//         <h3>2.5 Quality Control Approach</h3>
//         <p>[Describe how your company will monitor quality, review deliverables, correct deficiencies, and ensure compliance with contract requirements.]</p>
//         <h3>2.6 Risk Management</h3>
//         <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
//           <tr><th>Risk</th><th>Impact</th><th>Mitigation Strategy</th><th>Owner</th></tr>
//           <tr><td>[Risk 1]</td><td>[Low / Medium / High]</td><td>[Mitigation]</td><td>[Owner]</td></tr>
//         </table>
//       `,
//         true,
//       );

//       templateHTML += buildSec(
//         "vol3Mgmt",
//         "Volume III: Management and Staffing Plan",
//         `
//         <h2>Volume III: Management and Staffing Plan</h2>
//         <h3>3.1 Management Approach & Organization</h3>
//         <p>[Describe your project management structure, communication process, government coordination, reporting, issue escalation, and contract oversight. Insert organization chart or describe team structure.]</p>
//         <h3>3.2 Key Personnel & Staffing Plan</h3>
//         <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
//           <tr><th>Name / Labor Category</th><th>Role / Responsibilities</th><th>Qualifications / FTEs</th><th>Availability / Hours</th></tr>
//           <tr><td>[Name / Labor Category]</td><td>[Role / Responsibilities]</td><td>[Qualifications / FTE]</td><td>[Availability / Estimated Hours]</td></tr>
//         </table>
//         <h3>3.3 Transition Plan</h3>
//         <p>[Describe transition-in activities, onboarding, knowledge transfer, staffing readiness, government coordination, and schedule.]</p>
//       `,
//         true,
//       );

//       templateHTML += buildSec(
//         "vol4PastPerf",
//         "Volume IV: Past Performance",
//         `
//         <h2>Volume IV: Past Performance</h2>
//         <p>The following past performance references demonstrate relevant and recent experience similar in size, scope, and complexity to the current requirement.</p>
//         <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
//           <tr><td><strong>Customer / Agency</strong></td><td>[Customer Name]</td></tr>
//           <tr><td><strong>Contract Number / Title</strong></td><td>[Contract Number] - [Contract Title]</td></tr>
//           <tr><td><strong>Period of Performance</strong></td><td>[Start Date - End Date]</td></tr>
//           <tr><td><strong>Contract Value / Type</strong></td><td>$[Value] - [FFP / T&M / Cost Plus / Other]</td></tr>
//           <tr><td><strong>Scope Summary</strong></td><td>[Brief scope summary]</td></tr>
//           <tr><td><strong>Relevance</strong></td><td>[Explain similarity to current solicitation]</td></tr>
//           <tr><td><strong>Customer Contact</strong></td><td>[Name, Title, Email, Phone]</td></tr>
//           <tr><td><strong>CPARS / Performance Rating</strong></td><td>[Rating, if available]</td></tr>
//         </table>
//       `,
//         true,
//       );

//       let clinHTML = `<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;"><tr><th>Period</th><th>CLIN (Project Task)</th><th>Description</th><th>Total Price</th></tr>`;
//       Object.keys(clinTotals).forEach((task) => {
//         const ct = clinTotals[task];
//         clinHTML += `
//               <tr><td>Base Year</td><td>${task}</td><td>Labor Services & ODCs</td><td>${formatCurrency(ct.base)}</td></tr>
//               <tr><td>Base Year</td><td>${task}</td><td>Labor Services & ODCs</td><td>${formatCurrency(ct.base)}</td></tr>
//               <tr><td>Option Year 1</td><td>${task}</td><td>Labor Services  & ODCs </td><td>${formatCurrency(ct.opt1)}</td></tr>
//               <tr><td>Option Year 2</td><td>${task}</td><td>Labor Services  & ODCs</td><td>${formatCurrency(ct.opt2)}</td></tr>
//               <tr><td>Option Year 3</td><td>${task}</td><td>Labor Services  & ODCs</td><td>${formatCurrency(ct.opt3)}</td></tr>
//               <tr><td>Option Year 4</td><td>${task}</td><td>Labor Services  & ODCs</td><td>${formatCurrency(ct.opt4)}</td></tr>
//             `;
//       });
//       clinHTML += `</table>`;

//       let vol5HTML = `<h2>Volume V: Price Proposal</h2>`;
//       vol5HTML += buildSec(
//         "sec5_1",
//         "5.1 Price Summary",
//         `<h3>5.1 Price Summary</h3><table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;"><tr><th>Period</th><th>Total Price</th></tr><tr><td>Base Year</td><td>${formatCurrency(totalBasePrice)}</td></tr><tr><td>Option Year 1</td><td>${formatCurrency(totalOpt1)}</td></tr><tr><td>Option Year 2</td><td>${formatCurrency(totalOpt2)}</td></tr><tr><td>Option Year 3</td><td>${formatCurrency(totalOpt3)}</td></tr><tr><td>Option Year 4</td><td>${formatCurrency(totalOpt4)}</td></tr><tr><td>Other Direct Costs (ODCs)</td><td>${formatCurrency(totalOdcsCost)}</td></tr><tr><td><strong>Revenue</strong></td><td><strong>${formatCurrency(totalEvaluatedPrice)}</strong></td></tr></table><br/>`,
//       );
//       vol5HTML += buildSec(
//         "sec5_2",
//         "5.2 CLIN Pricing",
//         `<h3>5.2 CLIN Pricing</h3>${clinHTML}<br/>`,
//       );
//       vol5HTML += buildSec(
//         "sec5_3",
//         "5.3 Labor Pricing Detail",
//         `<h3>5.3 Labor Pricing Detail</h3><table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;"><tr><th>Period</th><th>Labor Category</th><th>Hours</th><th>Fully Burdened Rate</th><th>Total</th></tr>${laborRowsHTML || '<tr><td colspan="5" style="text-align: center;">No labor hours forecasted</td></tr>'}</table><br/>`,
//       );
//       vol5HTML += buildSec(
//         "sec5_4",
//         "5.4 Other Direct Costs (ODCs)",
//         `<h3>5.4 Other Direct Costs (ODCs)</h3><table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;"><tr><th>Expense Type</th><th>Total Evaluated Cost</th></tr><tr><td>Project Non-Labor / ODC Expenses</td><td>${formatCurrency(totalOdcsCost)}</td></tr></table><br/>`,
//       );
//       vol5HTML += buildSec(
//         "sec5_5",
//         "5.5 Basis of Estimate",
//         `<h3>5.5 Basis of Estimate</h3><p>Pricing is derived directly from live forecast database calculations including applicable fringe, overhead, and G&A pools.</p>`,
//       );
//       vol5HTML += buildSec(
//         "sec5_6",
//         "5.6 Pricing Assumptions",
//         `<h3>5.6 Pricing Assumptions</h3><p>The proposed period of performance aligns with forecast schedule specifications.</p>`,
//       );
//       vol5HTML += buildSec(
//         "sec5_7",
//         "5.7 Exceptions",
//         `<h3>5.7 Exceptions</h3><p>No exceptions are taken to the solicitation requirements.</p>`,
//       );

//       templateHTML += buildSec(
//         "vol5Price",
//         "Volume V: Price Proposal",
//         vol5HTML,
//         true,
//       );

//       templateHTML += buildSec(
//         "repsAndCerts",
//         "Reps & Certs",
//         `
//         <h2>Representations, Certifications, and Required Forms</h2>
//         <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
//           <tr><th>Form / Certification</th><th>Included?</th><th>Notes</th></tr>
//           <tr><td>SAM.gov Representations and Certifications</td><td>Yes / No</td><td>[Notes]</td></tr>
//           <tr><td>SF 33 / SF 1449 / Other Solicitation Form</td><td>Yes / No</td><td>[Notes]</td></tr>
//           <tr><td>Amendment Acknowledgements</td><td>Yes / No</td><td>[Notes]</td></tr>
//           <tr><td>Small Business Certification</td><td>Yes / No</td><td>[Notes]</td></tr>
//           <tr><td>Subcontracting Plan, if required</td><td>Yes / No / N/A</td><td>[Notes]</td></tr>
//         </table>
//         <br/><br/>
//         <h3>Authorized Signature</h3>
//         <p>By signing below, the authorized representative certifies that the information provided in this proposal is accurate to the best of their knowledge and that the proposal is submitted in accordance with the solicitation requirements.</p>
//         <p><br/><br/><strong>Signature:</strong> ______________________________ &nbsp;&nbsp;&nbsp; <strong>Date:</strong> ${todayDate}</p>
//         <p><strong>Authorized Representative Name:</strong> [Name]</p>
//         <p><strong>Title:</strong> [Title]</p>
//         <p><strong>Company:</strong> ${companyName}</p>
//       `,
//         false,
//       );

//       setProPricerContent(templateHTML);
//     }
//   }, [
//     activeTab,
//     selectedProject,
//     projectSearchResults,
//     docSections,
//     categoryTableData,
//     validNonLabor,
//   ]);

//   // ==========================================
//   // SORTING LOGIC
//   // ==========================================
//   const sortedData = useMemo(() => {
//     let sortableItems = [];
//     if (activeTab === "Performance By Category")
//       sortableItems = [...categoryTableData];
//     else if (activeTab === "Performance By Employee")
//       sortableItems = [...laborPerformanceData];
//     else if (activeTab === "Labor") sortableItems = [...laborTableData];
//     else if (activeTab === "Non-Labor") sortableItems = [...nonLaborTableData];

//     if (sortConfig.key !== null && sortableItems.length > 0) {
//       sortableItems.sort((a, b) => {
//         let aVal = a[sortConfig.key] || "";
//         let bVal = b[sortConfig.key] || "";
//         if (aVal.toString().toLowerCase() < bVal.toString().toLowerCase())
//           return sortConfig.direction === "asc" ? -1 : 1;
//         if (aVal.toString().toLowerCase() > bVal.toString().toLowerCase())
//           return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }
//     return sortableItems;
//   }, [
//     categoryTableData,
//     laborTableData,
//     nonLaborTableData,
//     laborPerformanceData,
//     sortConfig,
//     activeTab,
//   ]);

//   const paginated =
//     activeTab === "Dashboard" ||
//     activeTab === "Performance By Elements" ||
//     activeTab === "Proposal Package" ||
//     activeTab === "DFARS Adequacy Checklist"
//       ? []
//       : (sortedData || []).slice(
//           (currentPage - 1) * rowsPerPage,
//           currentPage * rowsPerPage,
//         );

//   const isLaborPerf = activeTab === "Performance By Employee";
//   const isPerfTab = activeTab === "Performance By Category" || isLaborPerf;

//   return (
//     <div className="bg-white h-screen font-sans text-[13px] text-gray-800 flex flex-col">
//       <div className="sticky top-0 z-50 flex flex-col w-full shadow-md bg-white">
//         {/* Top Ribbon / Toolbar */}
//         <div className="flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center px-4 py-3 bg-gray-50 border-b border-gray-300 gap-4 2xl:gap-2">
//           <div className="flex items-center gap-2">
//             <ChartNoAxesCombined className="text-green-700 h-5 w-5" />
//             <h1 className="text-base font-bold text-gray-900">
//               Project Performance
//             </h1>
//           </div>

//           <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3">
//             {/* Project ID Filter Area (search is applied only on button click / Enter) */}
//             <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm text-xs">
//               <label className="flex items-center gap-2 ml-4 cursor-pointer">
//                 <span className="text-sm font-medium">
//                   Include Indirect Project
//                 </span>

//                 <button
//                   type="button"
//                   onClick={() => setIncludeIndirectProjects((prev) => !prev)}
//                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                     includeIndirectProjects ? "bg-blue-600" : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                       includeIndirectProjects
//                         ? "translate-x-6"
//                         : "translate-x-1"
//                     }`}
//                   />
//                 </button>
//               </label>
//               <span className="font-semibold text-gray-700 tracking-wider">
//                 Project:
//               </span>
//               <div className="relative flex items-center">
//                 <input
//                   type="text"
//                   value={projectInput}
//                   onChange={(e) => {
//                     setProjectInput(e.target.value);
//                     setShowProjectDropdown(true);
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handleSearch();
//                   }}
//                   onFocus={() => {
//                     if (projectSearchResults.length > 0)
//                       setShowProjectDropdown(true);
//                   }}
//                   onBlur={() =>
//                     setTimeout(() => setShowProjectDropdown(false), 200)
//                   }
//                   className="w-48 border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-green-600 font-bold text-gray-800"
//                   placeholder="e.g. C1800..."
//                   autoComplete="off"
//                 />
//                 {showProjectDropdown && (
//                   <div className="absolute top-full left-0 mt-1 w-72 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-xl z-50">
//                     {isSearchingProject ? (
//                       <div className="px-3 py-2 text-xs text-gray-500 italic">
//                         Searching...
//                       </div>
//                     ) : !Array.isArray(projectSearchResults) ||
//                       projectSearchResults.length === 0 ? (
//                       <div className="px-3 py-2 text-xs text-gray-500">
//                         No matching projects
//                       </div>
//                     ) : (
//                       projectSearchResults.map((proj) => (
//                         <div
//                           key={proj.projectId}
//                           className="px-3 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-0"
//                           onMouseDown={() => {
//                             // Only fills the input. Click "Search" to apply.
//                             setProjectInput(proj.projectId);
//                             setShowProjectDropdown(false);
//                           }}
//                         >
//                           <div className="font-bold text-gray-800 text-xs">
//                             {proj.projectId}
//                           </div>
//                           <div className="text-gray-500 text-[10px] truncate">
//                             {proj.name}
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </div>
//               <button
//                 onClick={handleSearch}
//                 className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold rounded shadow-sm transition-colors focus:outline-none"
//                 title="Apply project filter"
//               >
//                 <Search size={12} />
//                 Search
//               </button>
//               {(selectedProject || projectInput) && (
//                 <button
//                   onClick={handleClearSearch}
//                   className="flex items-center gap-1 px-2 py-1 border border-gray-300 text-gray-600 hover:bg-gray-100 text-[11px] font-bold rounded transition-colors focus:outline-none"
//                   title="Clear project filter"
//                 >
//                   <X size={12} />
//                   Clear
//                 </button>
//               )}
//             </div>

//             {/* NEW: Burden Template Dropdown */}
//             <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm text-xs">
//               <span className="font-semibold text-gray-700 tracking-wider">
//                 Template:
//               </span>
//               <select
//                 value={targetTemplateId}
//                 onChange={(e) => setTargetTemplateId(e.target.value)}
//                 className="border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-green-600 font-bold text-gray-800 bg-gray-50 cursor-pointer"
//               >
//                 {templates.map((tpl) => (
//                   <option key={tpl.id} value={String(tpl.id)}>
//                     {tpl.templateCode ||
//                       tpl.templateName ||
//                       `Template ${tpl.id}`}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* NEW: Fee Input */}
//             <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm text-xs">
//               <span className="font-semibold text-gray-700 tracking-wider">
//                 Fee (%):
//               </span>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={globalFee}
//                 onChange={(e) => {
//                   let val = e.target.value;
//                   if (val.includes(".")) {
//                     val = val.substring(0, val.indexOf(".") + 3);
//                   }
//                   setGlobalFee(val);
//                 }}
//                 className="w-16 border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-green-600 font-bold text-gray-800 bg-gray-50 text-center"
//               />
//             </div>

//             {/* Escalation Config Area (Expandable Panel) */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowEscalationPanel(!showEscalationPanel)}
//                 className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm text-xs font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none"
//               >
//                 <span>Override Escalations</span>
//                 <ChevronDown
//                   size={14}
//                   className={`transform transition-transform ${showEscalationPanel ? "rotate-180" : ""}`}
//                 />
//               </button>

//               {showEscalationPanel && (
//                 <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-2xl z-50 w-[600px] p-4">
//                   <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
//                     <div className="flex items-center gap-2">
//                       <h3 className="font-bold text-gray-800 text-sm">
//                         Escalation Rates by Pool
//                       </h3>
//                       <button
//                         onClick={() =>
//                           setShowEscalationInfo(!showEscalationInfo)
//                         }
//                         className="text-blue-500 hover:text-blue-700 transition-colors focus:outline-none"
//                         title="How Escalation Works"
//                       >
//                         <Info size={16} />
//                       </button>
//                     </div>
//                     <button
//                       onClick={() => setShowEscalationPanel(false)}
//                       className="text-gray-400 hover:text-gray-700 font-bold"
//                     >
//                       ✕
//                     </button>
//                   </div>

//                   {showEscalationInfo && (
//                     <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-800 shadow-inner">
//                       <p className="font-bold mb-1 text-blue-900">
//                         How Escalation is Applied:
//                       </p>
//                       <ul className="list-disc pl-4 space-y-1">
//                         <li>
//                           <strong>Month-by-Month Precision:</strong> Escalation
//                           isn't a flat annual bump; it triggers exactly within
//                           your chosen Start and End months.
//                         </li>
//                         <li>
//                           <strong>Active Window:</strong> The percentage you
//                           enter is applied as a flat bump to every single month
//                           that falls inside your selected timeframe.
//                         </li>
//                         <li>
//                           <strong>Blended Averages:</strong> The 'Adjusted
//                           Rates' generated in your Excel exports are
//                           mathematically blended annual averages. This allows
//                           users to manually edit Hours/Costs in Excel without
//                           breaking the math.
//                         </li>
//                       </ul>
//                     </div>
//                   )}

//                   <div className="flex justify-center mb-4">
//                     <div className="bg-gray-100 p-1 rounded-md inline-flex">
//                       <button
//                         onClick={() => setIsEscalationCustom(false)}
//                         className={`px-4 py-1.5 text-xs font-bold rounded-sm transition-colors ${!isEscalationCustom ? "bg-white shadow-sm text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
//                       >
//                         Uniform Rate (Apply to All)
//                       </button>
//                       <button
//                         onClick={() => setIsEscalationCustom(true)}
//                         className={`px-4 py-1.5 text-xs font-bold rounded-sm transition-colors ${isEscalationCustom ? "bg-white shadow-sm text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
//                       >
//                         Custom Rates per Pool
//                       </button>
//                     </div>
//                   </div>

//                   <div className="max-h-[50vh] overflow-y-auto pr-2">
//                     <table className="w-full text-left text-xs border-collapse">
//                       <thead>
//                         <tr className="text-gray-500 border-b border-gray-200">
//                           <th className="pb-2 font-semibold w-1/4">
//                             Pool Name
//                           </th>
//                           <th className="pb-2 font-semibold">Rate %</th>
//                           <th className="pb-2 font-semibold">
//                             From (Month / Year)
//                           </th>
//                           <th className="pb-2 font-semibold">
//                             To (Month / Year)
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {(!isEscalationCustom
//                           ? [{ key: "All", label: "All Pools" }]
//                           : [
//                               { key: "aeroFringe", label: "AERO Fringe" },
//                               { key: "nasaFringe", label: "NASA/NIH Fringe" },
//                               { key: "custOH", label: "Customer Site OH" },
//                               // { key: "columbusOH", label: "Columbus Site OH" },
//                               { key: "columbusOH", label: "Off - Site OH" },
//                               { key: "subkMH", label: "Subk M&H" },
//                               { key: "ga", label: "G&A" },
//                             ]
//                         ).map((pool) => (
//                           <tr
//                             key={pool.key}
//                             className={`border-b border-gray-100 ${!isEscalationCustom ? "bg-indigo-50/30" : "hover:bg-gray-50"}`}
//                           >
//                             <td
//                               className={`py-2 pr-2 ${!isEscalationCustom ? "font-bold text-indigo-700" : "font-medium text-gray-700"}`}
//                             >
//                               {pool.label}
//                             </td>
//                             <td className="py-2 pr-2">
//                               <input
//                                 type="number"
//                                 value={draftEscalations[pool.key].rate}
//                                 onChange={(e) =>
//                                   handleDraftChange(
//                                     pool.key,
//                                     "rate",
//                                     e.target.value,
//                                   )
//                                 }
//                                 className="w-14 border border-gray-300 rounded px-1 py-1 text-center focus:outline-none focus:border-green-600 font-bold text-gray-800"
//                               />
//                             </td>
//                             <td className="py-2 pr-2">
//                               <div className="flex gap-1">
//                                 <select
//                                   value={draftEscalations[pool.key].fromM}
//                                   onChange={(e) =>
//                                     handleDraftChange(
//                                       pool.key,
//                                       "fromM",
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="border border-gray-300 rounded bg-gray-50 px-1 py-1 outline-none cursor-pointer"
//                                 >
//                                   {months.map((m, i) => (
//                                     <option
//                                       key={m}
//                                       value={String(i + 1).padStart(2, "0")}
//                                     >
//                                       {m}
//                                     </option>
//                                   ))}
//                                 </select>
//                                 <select
//                                   value={draftEscalations[pool.key].fromY}
//                                   onChange={(e) =>
//                                     handleDraftChange(
//                                       pool.key,
//                                       "fromY",
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="border border-gray-300 rounded bg-gray-50 px-1 py-1 outline-none cursor-pointer"
//                                 >
//                                   {OPTION_YEARS.map((y) => (
//                                     <option key={y} value={y}>
//                                       {y}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </div>
//                             </td>
//                             <td className="py-2">
//                               <div className="flex gap-1">
//                                 <select
//                                   value={draftEscalations[pool.key].toM}
//                                   onChange={(e) =>
//                                     handleDraftChange(
//                                       pool.key,
//                                       "toM",
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="border border-gray-300 rounded bg-gray-50 px-1 py-1 outline-none cursor-pointer"
//                                 >
//                                   {months.map((m, i) => (
//                                     <option
//                                       key={m}
//                                       value={String(i + 1).padStart(2, "0")}
//                                     >
//                                       {m}
//                                     </option>
//                                   ))}
//                                 </select>
//                                 <select
//                                   value={draftEscalations[pool.key].toY}
//                                   onChange={(e) =>
//                                     handleDraftChange(
//                                       pool.key,
//                                       "toY",
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="border border-gray-300 rounded bg-gray-50 px-1 py-1 outline-none cursor-pointer"
//                                 >
//                                   {OPTION_YEARS.map((y) => (
//                                     <option key={y} value={y}>
//                                       {y}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end gap-3">
//                     <button
//                       onClick={() => setShowEscalationPanel(false)}
//                       className="px-4 py-2 border border-gray-300 rounded text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={resetEscalations}
//                       className="px-4 py-2 border border-green-600 text-green-600 hover:bg-green-50 rounded text-xs font-bold transition-colors shadow-sm"
//                     >
//                       Reset Rates
//                     </button>
//                     <button
//                       onClick={applyEscalations}
//                       className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold transition-colors shadow-sm"
//                     >
//                       Apply Escalations
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Year Visibility Toggles */}
//             <div className="flex items-center gap-3 bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm text-xs">
//               <span className="font-semibold text-gray-700  tracking-wider">
//                 Years:
//               </span>
//               <div className="inline-flex rounded-md shadow-sm">
//                 {ALL_YEARS.map((y, index) => {
//                   const isActive = visibleYears.includes(y);
//                   const isFirst = index === 0;
//                   const isLast = index === ALL_YEARS.length - 1;
//                   const label =
//                     y === BASE_YEAR
//                       ? "Base Year"
//                       : `Option Year ${OPTION_YEARS.indexOf(y) + 1}`;

//                   return (
//                     <button
//                       key={y}
//                       onClick={() => toggleYear(y)}
//                       title={`Toggle ${y}`}
//                       className={`
//                       relative px-3 py-1 text-[11px] font-bold border transition-all focus:outline-none
//                       ${isFirst ? "rounded-l-md" : "-ml-px"}
//                       ${isLast ? "rounded-r-md" : ""}
//                       ${
//                         isActive
//                           ? "bg-green-600 text-white border-green-600 z-10"
//                           : "bg-gray-50 text-gray-500 border-gray-300 hover:bg-gray-200 hover:text-gray-800 z-0"
//                       }
//                     `}
//                     >
//                       {label}{" "}
//                       <span
//                         className={`font-medium ml-0.5 ${isActive ? "text-green-200" : "text-gray-400"}`}
//                       >
//                         '{y.slice(-2)}
//                       </span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Labor Metrics Toggles */}
//             {activeTab === "Labor" && (
//               <div className="flex items-center gap-3 bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm text-xs">
//                 <span className="font-semibold text-gray-700  tracking-wider">
//                   Show:
//                 </span>
//                 <div className="inline-flex rounded-md shadow-sm">
//                   <button
//                     onClick={() =>
//                       setLaborMetrics((p) => ({ ...p, hrs: !p.hrs }))
//                     }
//                     className={`relative px-3 py-1 text-[11px] font-bold border transition-all focus:outline-none rounded-l-md -ml-px ${laborMetrics.hrs ? "bg-green-600 text-white border-green-600 z-10" : "bg-gray-50 text-gray-500 border-gray-300 hover:bg-gray-200 z-0"}`}
//                   >
//                     Hours
//                   </button>
//                   <button
//                     onClick={() =>
//                       setLaborMetrics((p) => ({ ...p, amt: !p.amt }))
//                     }
//                     className={`relative px-3 py-1 text-[11px] font-bold border transition-all focus:outline-none rounded-r-md ${laborMetrics.amt ? "bg-green-600 text-white border-green-600 z-10" : "bg-gray-50 text-gray-500 border-gray-300 hover:bg-gray-200 z-0"}`}
//                   >
//                     Amount
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* TAB NAVIGATION & ACTION BAR */}
//         <div className="flex justify-between items-center px-4 pt-2 pb-2 bg-white">
//           <div className="flex bg-gray-100 border-b border-gray-300 px-2 pt-2 gap-1 overflow-x-auto">
//             {[
//               "Dashboard",
//               "Performance By Elements",
//               "Performance By Category",
//               "Performance By Employee",
//               "Labor",
//               "Non-Labor",
//             ].map((t) => (
//               <button
//                 key={t}
//                 onClick={() => {
//                   setActiveTab(t);
//                   setCurrentPage(1);
//                   setSortConfig({ key: null, direction: "asc" });
//                 }}
//                 className={`px-4 py-1.5 rounded-t-md border-t border-l border-r text-sm whitespace-nowrap transition-colors ${
//                   activeTab === t
//                     ? "bg-white font-bold text-green-800 border-gray-300 relative top-[1px] z-10 shadow-[0_-2px_0_0_#166534]"
//                     : "bg-gray-200 text-gray-600 border-transparent hover:bg-gray-300"
//                 }`}
//               >
//                 {t}
//               </button>
//             ))}
//           </div>

//           {activeTab === "Proposal Package" ? (
//             <button
//               onClick={exportDocumentToPDF}
//               className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded shadow-sm transition-colors"
//             >
//               <Download className="w-4 h-4" />
//               <span>Export Document (PDF)</span>
//             </button>
//           ) : activeTab === "DFARS Adequacy Checklist" ||
//             activeTab === "Dashboard" ? (
//             <button
//               disabled
//               className="flex items-center space-x-1.5 px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded cursor-not-allowed"
//             >
//               <span>Export Disabled</span>
//             </button>
//           ) : (
//             <button
//               onClick={exportToExcel}
//               className="flex items-center space-x-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded shadow-sm transition-colors"
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                 />
//               </svg>
//               <span>Export to Excel</span>
//             </button>
//           )}
//         </div>
//       </div>
//       {/* END STICKY TOP REGION */}

//       {/* Spreadsheet Grid Container */}
//       <div className="flex-1 min-h-0 bg-gray-200 p-2 overflow-hidden flex flex-col">
//         {activeTab === "Dashboard" ? (
//           <div className="flex-1 overflow-auto bg-slate-100 p-6 flex flex-col gap-6">
//             {isLoading ? (
//               <div className="flex justify-center items-center h-full text-gray-500 font-bold">
//                 Loading Dashboard Data...
//               </div>
//             ) : dashboardStats ? (
//               <>
//                 {/* View Toggles */}
//                 <div className="flex bg-white rounded-md shadow-sm border border-gray-200 p-1 w-max">
//                   {["Overview", "Labor Categories", "Employees", "Vendors"].map(
//                     (view) => (
//                       <button
//                         key={view}
//                         onClick={() => setDashboardView(view)}
//                         className={`px-4 py-1.5 text-xs font-bold rounded-sm transition-all ${dashboardView === view ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
//                       >
//                         {view}
//                       </button>
//                     ),
//                   )}
//                 </div>

//                 {/* KPI Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col justify-center items-center text-center">
//                     <h3 className="text-gray-500 text-xs font-bold  tracking-wider mb-1">
//                       Revenue
//                     </h3>
//                     <p className="text-2xl font-black text-green-700">
//                       {formatCurrency(dashboardStats.totalEvaluatedPrice)}
//                     </p>
//                   </div>
//                   <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col justify-center items-center text-center">
//                     <h3 className="text-gray-500 text-xs font-bold  tracking-wider mb-1">
//                       Total Direct Cost
//                     </h3>
//                     <p className="text-2xl font-black text-blue-600">
//                       {formatCurrency(dashboardStats.totalDir)}
//                     </p>
//                   </div>
//                   <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col justify-center items-center text-center">
//                     <h3 className="text-gray-500 text-xs font-bold  tracking-wider mb-1">
//                       Total Burden Cost
//                     </h3>
//                     <p className="text-2xl font-black text-amber-500">
//                       {formatCurrency(dashboardStats.totalBurd)}
//                     </p>
//                   </div>
//                   <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col justify-center items-center text-center">
//                     <h3 className="text-gray-500 text-xs font-bold  tracking-wider mb-1">
//                       Total Fee ({Number(globalFee).toFixed(2)}%)
//                     </h3>
//                     <p className="text-2xl font-black text-purple-600">
//                       {formatCurrency(dashboardStats.totalFee)}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Dynamic Charts Area */}
//                 {dashboardView === "Overview" && (
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[350px]">
//                     {/* Cost Breakdown Nested Pie Chart */}
//                     <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col relative">
//                       <h3 className="text-gray-700 font-bold mb-4">
//                         Cost Breakdown
//                       </h3>
//                       <div className="flex-1 w-full relative flex items-center justify-between">
//                         <ResponsiveContainer width="100%" height={350}>
//                           <PieChart>
//                             <RechartsTooltip
//                               formatter={(value) => formatCurrency(value)}
//                             />

//                             {/* Primary Pie (Left) */}
//                             <Pie
//                               data={dashboardStats.primaryPieData}
//                               cx="30%"
//                               cy="50%"
//                               outerRadius={100}
//                               dataKey="value"
//                               nameKey="name"
//                               label={({ name, percent }) =>
//                                 percent > 0.05
//                                   ? `${name} ${(percent * 100).toFixed(0)}%`
//                                   : ""
//                               }
//                             >
//                               {dashboardStats.primaryPieData.map(
//                                 (entry, index) => (
//                                   <Cell
//                                     key={`cell-${index}`}
//                                     fill={PIE_COLORS[index % PIE_COLORS.length]}
//                                   />
//                                 ),
//                               )}
//                             </Pie>

//                             {/* Secondary Pie (Burden Pools - Right) */}
//                             <Pie
//                               data={dashboardStats.secondaryPieData}
//                               cx="75%"
//                               cy="50%"
//                               innerRadius={20}
//                               outerRadius={90}
//                               dataKey="value"
//                               nameKey="name"
//                               label={({ name, percent }) =>
//                                 percent > 0.02
//                                   ? `${name} ${(percent * 100).toFixed(0)}%`
//                                   : ""
//                               }
//                             >
//                               {dashboardStats.secondaryPieData.map(
//                                 (entry, index) => (
//                                   <Cell
//                                     key={`cell-${index}`}
//                                     fill={entry.fill}
//                                   />
//                                 ),
//                               )}
//                             </Pie>
//                           </PieChart>
//                         </ResponsiveContainer>

//                         {/* Visual Connector Overlay */}
//                         <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
//                           <div className="flex flex-col items-center justify-left text-amber-500 bg-white/80 p-1 rounded-full shadow-sm ml-6">
//                             <span className="text-[8px] font-bold tracking-normal text-gray-500 leading-tight text-center">
//                               Burden
//                               <br />
//                               Breakdown
//                             </span>
//                             <ArrowRight size={12} />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Year-over-Year Stacked Bar Chart */}
//                     <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col">
//                       <h3 className="text-gray-700 font-bold mb-4">
//                         Evaluated Price by Year
//                       </h3>
//                       <div className="flex-1 w-full relative">
//                         <ResponsiveContainer width="100%" height={350}>
//                           <BarChart
//                             data={dashboardStats.barData}
//                             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                           >
//                             <CartesianGrid
//                               strokeDasharray="3 3"
//                               vertical={false}
//                               stroke="#E5E7EB"
//                             />
//                             <XAxis
//                               dataKey="name"
//                               tickLine={false}
//                               axisLine={false}
//                               tick={{ fill: "#6B7280", fontSize: 12 }}
//                             />
//                             <YAxis
//                               tickFormatter={(value) =>
//                                 `$${(value / 1000).toFixed(0)}k`
//                               }
//                               tickLine={false}
//                               axisLine={false}
//                               tick={{ fill: "#6B7280", fontSize: 12 }}
//                             />
//                             <RechartsTooltip
//                               formatter={(value) => formatCurrency(value)}
//                               cursor={{ fill: "#F3F4F6" }}
//                             />
//                             <Legend />
//                             <Bar
//                               dataKey="Direct Cost"
//                               stackId="a"
//                               fill="#3b82f6"
//                               radius={[0, 0, 4, 4]}
//                             />
//                             <Bar dataKey="Burden" stackId="a" fill="#f59e0b" />
//                             <Bar
//                               dataKey="Fee"
//                               stackId="a"
//                               fill="#8b5cf6"
//                               radius={[4, 4, 0, 0]}
//                             />
//                           </BarChart>
//                         </ResponsiveContainer>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {dashboardView === "Labor Categories" && (
//                   <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col">
//                     <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
//                       <div>
//                         <h3 className="text-gray-700 font-bold">
//                           Labor Categories
//                         </h3>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Select a labor category to view its pricing and hours
//                           details.
//                         </p>
//                       </div>
//                       <select
//                         value={selectedDashboardFilter.laborCategory}
//                         onChange={(e) =>
//                           setSelectedDashboardFilter((prev) => ({
//                             ...prev,
//                             laborCategory: e.target.value,
//                           }))
//                         }
//                         className="border border-gray-300 rounded px-3 py-2 text-sm bg-white min-w-[220px]"
//                       >
//                         <option value="">All Labor Categories</option>
//                         {dashboardStats.plcData.map((item) => (
//                           <option key={item.name} value={item.name}>
//                             {item.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="flex-1 w-full relative">
//                       <ResponsiveContainer width="100%" height={400}>
//                         <PieChart>
//                           <Pie
//                             data={dashboardStats.plcData}
//                             dataKey="Price"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={145}
//                             label={({ name, percent }) =>
//                               `${name} ${(percent * 100).toFixed(1)}%`
//                             }
//                             onClick={(data) => {
//                               const name =
//                                 data?.name || data?.payload?.name || "";
//                               setSelectedDashboardFilter((prev) => ({
//                                 ...prev,
//                                 laborCategory: name,
//                               }));
//                             }}
//                           >
//                             {dashboardStats.plcData.map((entry, index) => (
//                               <Cell
//                                 key={`plc-${index}`}
//                                 fill={PIE_COLORS[index % PIE_COLORS.length]}
//                                 stroke={
//                                   selectedDashboardFilter.laborCategory ===
//                                   entry.name
//                                     ? "#111827"
//                                     : "#fff"
//                                 }
//                                 strokeWidth={
//                                   selectedDashboardFilter.laborCategory ===
//                                   entry.name
//                                     ? 3
//                                     : 1
//                                 }
//                               />
//                             ))}
//                           </Pie>
//                           <RechartsTooltip
//                             formatter={(value) => [
//                               formatCurrency(value),
//                               "Price",
//                             ]}
//                           />
//                           <Legend />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>

//                     {dashboardDetailData && (
//                       <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-gray-200 pt-4">
//                         <div className="rounded-md bg-indigo-50 p-3">
//                           <div className="text-[11px] font-bold text-indigo-600 uppercase">
//                             Selected Category
//                           </div>
//                           <div className="text-sm font-semibold text-gray-800 mt-1 break-words">
//                             {dashboardDetailData.name}
//                           </div>
//                         </div>
//                         <div className="rounded-md bg-blue-50 p-3">
//                           <div className="text-[11px] font-bold text-blue-600 uppercase">
//                             Price
//                           </div>
//                           <div className="text-lg font-bold text-gray-800 mt-1">
//                             {formatCurrency(dashboardDetailData.Price)}
//                           </div>
//                         </div>
//                         <div className="rounded-md bg-green-50 p-3">
//                           <div className="text-[11px] font-bold text-green-600 uppercase">
//                             Hours / Share
//                           </div>
//                           <div className="text-sm font-bold text-gray-800 mt-1">
//                             {formatNum(dashboardDetailData.Hours)} hrs ·{" "}
//                             {getDashboardDetailTotal() > 0
//                               ? (
//                                   (dashboardDetailData.Price /
//                                     getDashboardDetailTotal()) *
//                                   100
//                                 ).toFixed(1)
//                               : "0.0"}
//                             %
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {dashboardView === "Employees" && (
//                   <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col">
//                     <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
//                       <div>
//                         <h3 className="text-gray-700 font-bold">Employees</h3>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Select an employee to view pricing, hours, and share
//                           of the displayed employee total.
//                         </p>
//                       </div>
//                       <select
//                         value={selectedDashboardFilter.employee}
//                         onChange={(e) =>
//                           setSelectedDashboardFilter((prev) => ({
//                             ...prev,
//                             employee: e.target.value,
//                           }))
//                         }
//                         className="border border-gray-300 rounded px-3 py-2 text-sm bg-white min-w-[220px]"
//                       >
//                         <option value="">All Employees</option>
//                         {dashboardStats.empData.map((item) => (
//                           <option key={item.name} value={item.name}>
//                             {item.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="flex-1 w-full relative">
//                       <ResponsiveContainer width="100%" height={400}>
//                         <PieChart>
//                           <Pie
//                             data={dashboardStats.empData}
//                             dataKey="Price"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={145}
//                             label={({ name, percent }) =>
//                               `${name} ${(percent * 100).toFixed(1)}%`
//                             }
//                             onClick={(data) => {
//                               const name =
//                                 data?.name || data?.payload?.name || "";
//                               setSelectedDashboardFilter((prev) => ({
//                                 ...prev,
//                                 employee: name,
//                               }));
//                             }}
//                           >
//                             {dashboardStats.empData.map((entry, index) => (
//                               <Cell
//                                 key={`emp-${index}`}
//                                 fill={PIE_COLORS[index % PIE_COLORS.length]}
//                                 stroke={
//                                   selectedDashboardFilter.employee ===
//                                   entry.name
//                                     ? "#111827"
//                                     : "#fff"
//                                 }
//                                 strokeWidth={
//                                   selectedDashboardFilter.employee ===
//                                   entry.name
//                                     ? 3
//                                     : 1
//                                 }
//                               />
//                             ))}
//                           </Pie>
//                           <RechartsTooltip
//                             formatter={(value) => [
//                               formatCurrency(value),
//                               "Price",
//                             ]}
//                           />
//                           <Legend />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>

//                     {dashboardDetailData && (
//                       <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-gray-200 pt-4">
//                         <div className="rounded-md bg-indigo-50 p-3">
//                           <div className="text-[11px] font-bold text-indigo-600 uppercase">
//                             Selected Employee
//                           </div>
//                           <div className="text-sm font-semibold text-gray-800 mt-1 break-words">
//                             {dashboardDetailData.name}
//                           </div>
//                         </div>
//                         <div className="rounded-md bg-blue-50 p-3">
//                           <div className="text-[11px] font-bold text-blue-600 uppercase">
//                             Price
//                           </div>
//                           <div className="text-lg font-bold text-gray-800 mt-1">
//                             {formatCurrency(dashboardDetailData.Price)}
//                           </div>
//                         </div>
//                         <div className="rounded-md bg-green-50 p-3">
//                           <div className="text-[11px] font-bold text-green-600 uppercase">
//                             Hours / Share
//                           </div>
//                           <div className="text-sm font-bold text-gray-800 mt-1">
//                             {formatNum(dashboardDetailData.Hours)} hrs ·{" "}
//                             {getDashboardDetailTotal() > 0
//                               ? (
//                                   (dashboardDetailData.Price /
//                                     getDashboardDetailTotal()) *
//                                   100
//                                 ).toFixed(1)
//                               : "0.0"}
//                             %
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {dashboardView === "Vendors" && (
//                   <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col">
//                     <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
//                       <div>
//                         <h3 className="text-gray-700 font-bold">Vendors</h3>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Select a vendor to view its evaluated cost and share
//                           of the displayed vendor total.
//                         </p>
//                       </div>
//                       <select
//                         value={selectedDashboardFilter.vendor}
//                         onChange={(e) =>
//                           setSelectedDashboardFilter((prev) => ({
//                             ...prev,
//                             vendor: e.target.value,
//                           }))
//                         }
//                         className="border border-gray-300 rounded px-3 py-2 text-sm bg-white min-w-[220px]"
//                       >
//                         <option value="">All Vendors</option>
//                         {dashboardStats.vendorData.map((item) => (
//                           <option key={item.name} value={item.name}>
//                             {item.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="flex-1 w-full relative">
//                       <ResponsiveContainer width="100%" height={400}>
//                         <PieChart>
//                           <Pie
//                             data={dashboardStats.vendorData}
//                             dataKey="Price"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={145}
//                             label={({ name, percent }) =>
//                               `${name} ${(percent * 100).toFixed(1)}%`
//                             }
//                             onClick={(data) => {
//                               const name =
//                                 data?.name || data?.payload?.name || "";
//                               setSelectedDashboardFilter((prev) => ({
//                                 ...prev,
//                                 vendor: name,
//                               }));
//                             }}
//                           >
//                             {dashboardStats.vendorData.map((entry, index) => (
//                               <Cell
//                                 key={`vendor-${index}`}
//                                 fill={PIE_COLORS[index % PIE_COLORS.length]}
//                                 stroke={
//                                   selectedDashboardFilter.vendor === entry.name
//                                     ? "#111827"
//                                     : "#fff"
//                                 }
//                                 strokeWidth={
//                                   selectedDashboardFilter.vendor === entry.name
//                                     ? 3
//                                     : 1
//                                 }
//                               />
//                             ))}
//                           </Pie>
//                           <RechartsTooltip
//                             formatter={(value) => [
//                               formatCurrency(value),
//                               "Price",
//                             ]}
//                           />
//                           <Legend />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>

//                     {dashboardDetailData && (
//                       <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-gray-200 pt-4">
//                         <div className="rounded-md bg-indigo-50 p-3">
//                           <div className="text-[11px] font-bold text-indigo-600 uppercase">
//                             Selected Vendor
//                           </div>
//                           <div className="text-sm font-semibold text-gray-800 mt-1 break-words">
//                             {dashboardDetailData.name}
//                           </div>
//                         </div>
//                         <div className="rounded-md bg-blue-50 p-3">
//                           <div className="text-[11px] font-bold text-blue-600 uppercase">
//                             Evaluated Cost
//                           </div>
//                           <div className="text-lg font-bold text-gray-800 mt-1">
//                             {formatCurrency(dashboardDetailData.Price)}
//                           </div>
//                         </div>
//                         <div className="rounded-md bg-green-50 p-3">
//                           <div className="text-[11px] font-bold text-green-600 uppercase">
//                             Share of Vendors
//                           </div>
//                           <div className="text-sm font-bold text-gray-800 mt-1">
//                             {getDashboardDetailTotal() > 0
//                               ? (
//                                   (dashboardDetailData.Price /
//                                     getDashboardDetailTotal()) *
//                                   100
//                                 ).toFixed(1)
//                               : "0.0"}
//                             %
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="flex justify-center items-center h-full text-gray-500">
//                 No project data available.
//               </div>
//             )}
//           </div>
//         ) : activeTab === "DFARS Adequacy Checklist" ? (
//           <div className="min-h-full bg-slate-50 text-gray-900 flex flex-col gap-y-6 p-6 overflow-auto">
//             <div className="max-w-5xl mx-auto w-full flex flex-col gap-y-6">
//               {/* DFARS Header */}
//               <div className="p-5 w-full flex flex-col justify-center rounded-md bg-white border border-slate-200 shadow-sm">
//                 <div className="flex items-center gap-3">
//                   <FcDataConfiguration size={28} />
//                   <h2 className="text-xl font-bold text-slate-800 tracking-tight">
//                     DFARS 252.215-7009 Proposal Adequacy Checklist
//                   </h2>
//                 </div>
//                 <p className="text-sm text-slate-500 mt-2 ml-10">
//                   Verify cost proposal compliance with FAR 15.408 Table 15-2.
//                 </p>
//               </div>

//               {/* DFARS Checklist Sections */}
//               <div className="flex flex-col gap-y-6">
//                 {checklistData.map((section, sIndex) => (
//                   <div
//                     key={sIndex}
//                     className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden"
//                   >
//                     <div className="bg-blue-50/50 border-b border-slate-200 px-5 py-3">
//                       <h3 className="text-md font-semibold text-blue-900">
//                         {section.title}
//                       </h3>
//                     </div>

//                     <div className="flex flex-col divide-y divide-slate-100">
//                       {section.items.map((item) => (
//                         <div
//                           key={item.id}
//                           className={`flex items-start gap-4 p-5 transition-colors duration-150 ${
//                             checkedItems[item.id]
//                               ? "bg-slate-50/70"
//                               : "hover:bg-slate-50/50"
//                           }`}
//                         >
//                           <div className="pt-0.5">
//                             <input
//                               type="checkbox"
//                               id={item.id}
//                               checked={!!checkedItems[item.id]}
//                               onChange={() => toggleCheck(item.id)}
//                               className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 cursor-pointer transition-all"
//                             />
//                           </div>
//                           <div className="flex flex-col gap-2 w-full">
//                             <label
//                               htmlFor={item.id}
//                               className="cursor-pointer text-sm text-slate-700 leading-relaxed"
//                             >
//                               <span className="font-bold text-slate-900 mr-2">
//                                 {item.id}:
//                               </span>
//                               {item.req}
//                             </label>
//                             <div className="mt-1 bg-emerald-50/50 border-l-4 border-emerald-400 p-3 rounded-r-md text-xs text-slate-600">
//                               <span className="font-semibold text-emerald-800 block mb-1">
//                                 FinAxis Validation Logic:
//                               </span>
//                               {item.logic}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ) : activeTab === "Proposal Package" ? (
//           <div className="flex gap-4 h-full overflow-hidden">
//             {/* 1. SIDEBAR: DOCUMENT OUTLINE */}
//             <div className="w-1/5 flex flex-col border border-gray-300 rounded shadow-sm bg-white h-full overflow-hidden min-w-[220px]">
//               <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 font-bold text-gray-700">
//                 Document Outline
//               </div>
//               <div className="p-4 flex-1 overflow-y-auto text-xs flex flex-col gap-3">
//                 <p className="text-red-500 italic text-[11px] leading-tight mb-2">
//                   * Toggling sections will reset manual edits.
//                 </p>

//                 <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
//                   <input
//                     type="checkbox"
//                     checked={docSections.coverLetter}
//                     onChange={() =>
//                       setDocSections((p) => ({
//                         ...p,
//                         coverLetter: !p.coverLetter,
//                       }))
//                     }
//                     className="accent-green-600 w-3.5 h-3.5"
//                   />{" "}
//                   Cover Letter
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
//                   <input
//                     type="checkbox"
//                     checked={docSections.vol1Admin}
//                     onChange={() =>
//                       setDocSections((p) => ({ ...p, vol1Admin: !p.vol1Admin }))
//                     }
//                     className="accent-green-600 w-3.5 h-3.5"
//                   />{" "}
//                   Volume I: Admin
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
//                   <input
//                     type="checkbox"
//                     checked={docSections.vol2Tech}
//                     onChange={() =>
//                       setDocSections((p) => ({ ...p, vol2Tech: !p.vol2Tech }))
//                     }
//                     className="accent-green-600 w-3.5 h-3.5"
//                   />{" "}
//                   Volume II: Technical
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
//                   <input
//                     type="checkbox"
//                     checked={docSections.vol3Mgmt}
//                     onChange={() =>
//                       setDocSections((p) => ({ ...p, vol3Mgmt: !p.vol3Mgmt }))
//                     }
//                     className="accent-green-600 w-3.5 h-3.5"
//                   />{" "}
//                   Volume III: Management
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
//                   <input
//                     type="checkbox"
//                     checked={docSections.vol4PastPerf}
//                     onChange={() =>
//                       setDocSections((p) => ({
//                         ...p,
//                         vol4PastPerf: !p.vol4PastPerf,
//                       }))
//                     }
//                     className="accent-green-600 w-3.5 h-3.5"
//                   />{" "}
//                   Volume IV: Past Perf.
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
//                   <input
//                     type="checkbox"
//                     checked={docSections.vol5Price}
//                     onChange={() =>
//                       setDocSections((p) => ({ ...p, vol5Price: !p.vol5Price }))
//                     }
//                     className="accent-green-600 w-3.5 h-3.5"
//                   />{" "}
//                   Volume V: Price
//                 </label>

//                 {/* Indented Subsections for Volume 5 */}
//                 <div className="ml-5 flex flex-col gap-2 border-l-2 border-gray-200 pl-3">
//                   <label
//                     className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={docSections.sec5_1}
//                       onChange={() =>
//                         setDocSections((p) => ({ ...p, sec5_1: !p.sec5_1 }))
//                       }
//                       disabled={!docSections.vol5Price}
//                       className="accent-green-600 w-3 h-3"
//                     />{" "}
//                     5.1 Price Summary
//                   </label>
//                   <label
//                     className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={docSections.sec5_2}
//                       onChange={() =>
//                         setDocSections((p) => ({ ...p, sec5_2: !p.sec5_2 }))
//                       }
//                       disabled={!docSections.vol5Price}
//                       className="accent-green-600 w-3 h-3"
//                     />{" "}
//                     5.2 CLIN Pricing
//                   </label>
//                   <label
//                     className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={docSections.sec5_3}
//                       onChange={() =>
//                         setDocSections((p) => ({ ...p, sec5_3: !p.sec5_3 }))
//                       }
//                       disabled={!docSections.vol5Price}
//                       className="accent-green-600 w-3 h-3"
//                     />{" "}
//                     5.3 Labor Detail
//                   </label>
//                   <label
//                     className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={docSections.sec5_4}
//                       onChange={() =>
//                         setDocSections((p) => ({ ...p, sec5_4: !p.sec5_4 }))
//                       }
//                       disabled={!docSections.vol5Price}
//                       className="accent-green-600 w-3 h-3"
//                     />{" "}
//                     5.4 ODCs
//                   </label>
//                   <label
//                     className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={docSections.sec5_5}
//                       onChange={() =>
//                         setDocSections((p) => ({ ...p, sec5_5: !p.sec5_5 }))
//                       }
//                       disabled={!docSections.vol5Price}
//                       className="accent-green-600 w-3 h-3"
//                     />{" "}
//                     5.5 Basis of Estimate
//                   </label>
//                   <label
//                     className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={docSections.sec5_6}
//                       onChange={() =>
//                         setDocSections((p) => ({ ...p, sec5_6: !p.sec5_6 }))
//                       }
//                       disabled={!docSections.vol5Price}
//                       className="accent-green-600 w-3 h-3"
//                     />{" "}
//                     5.6 Assumptions
//                   </label>
//                   <label
//                     className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={docSections.sec5_7}
//                       onChange={() =>
//                         setDocSections((p) => ({ ...p, sec5_7: !p.sec5_7 }))
//                       }
//                       disabled={!docSections.vol5Price}
//                       className="accent-green-600 w-3 h-3"
//                     />{" "}
//                     5.7 Exceptions
//                   </label>
//                 </div>

//                 <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 mt-1">
//                   <input
//                     type="checkbox"
//                     checked={docSections.repsAndCerts}
//                     onChange={() =>
//                       setDocSections((p) => ({
//                         ...p,
//                         repsAndCerts: !p.repsAndCerts,
//                       }))
//                     }
//                     className="accent-green-600 w-3.5 h-3.5"
//                   />{" "}
//                   Reps & Certs
//                 </label>
//               </div>
//             </div>

//             {/* 2. Editor Side */}
//             <div className="w-2/5 flex flex-col border border-gray-300 rounded shadow-sm bg-white h-full overflow-hidden">
//               <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 font-bold text-gray-700">
//                 Document Editor
//               </div>
//               <div className="p-2 flex-1 overflow-auto text-black prose max-w-none">
//                 <CKEditor
//                   editor={ClassicEditor}
//                   data={proPricerContent}
//                   onChange={(event, editor) => {
//                     setProPricerContent(editor.getData());
//                   }}
//                 />
//               </div>
//             </div>

//             {/* 3. Preview Side */}
//             <div className="w-2/5 flex flex-col border border-gray-300 rounded shadow-sm bg-white h-full overflow-hidden">
//               <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 font-bold text-gray-700">
//                 Live Preview
//               </div>
//               <div
//                 id="propricer-preview-container"
//                 className="p-6 flex-1 overflow-auto text-black prose max-w-none ck-content bg-white"
//                 dangerouslySetInnerHTML={{
//                   __html:
//                     `<style>
//                     #propricer-preview-container div[style*="dashed"],
//                     #propricer-preview-container div[style*="opacity"] {
//                       display: none !important;
//                     }
//                   </style>` + proPricerContent,
//                 }}
//               />
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white shadow-sm border border-gray-300 w-full flex-1 min-h-0 overflow-auto">
//             <table className="w-max min-w-full border-separate border-spacing-0 tabular-nums whitespace-nowrap [&_th]:border-t-0 [&_th]:border-l-0 [&_td]:border-t-0 [&_td]:border-l-0">
//               {/* SUMMARY HEADERS */}
//               {activeTab === "Performance By Elements" && (
//                 <thead className="sticky top-0 z-30">
//                   <tr className="bg-gray-200 text-gray-800 text-xs font-bold  tracking-wider shadow-[0_1px_0_0_#d1d5db]">
//                     <th className="px-4 py-2.5 border border-gray-300 text-left w-[300px]">
//                       Account Type
//                     </th>
//                     {visibleYears.includes(BASE_YEAR) && (
//                       <th className="px-4 py-2.5 border border-gray-300 text-right w-[140px]">
//                         Base Year {BASE_YEAR}
//                       </th>
//                     )}
//                     {OPTION_YEARS.map(
//                       (y, idx) =>
//                         visibleYears.includes(y) && (
//                           <th
//                             key={y}
//                             className="px-4 py-2.5 border border-gray-300 text-right w-[140px]"
//                           >
//                             Option Year {idx + 1} - {y}
//                           </th>
//                         ),
//                     )}
//                   </tr>
//                 </thead>
//               )}

//               {/* LABOR HEADERS */}
//               {activeTab === "Labor" && (
//                 <thead className="sticky top-0 z-30">
//                   <tr className="bg-gray-200 text-gray-800 text-xs font-bold  tracking-wider shadow-[0_1px_0_0_#d1d5db]">
//                     <th
//                       colSpan={6}
//                       className="px-3 py-2 border border-gray-300 text-left sticky left-0 z-40 bg-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)] border-r-2 border-r-gray-400"
//                     >
//                       Element Details
//                     </th>
//                     {visibleYears.includes(BASE_YEAR) && (
//                       <th
//                         colSpan={
//                           2 +
//                           (laborMetrics.hrs && laborMetrics.amt
//                             ? 24
//                             : laborMetrics.hrs || laborMetrics.amt
//                               ? 12
//                               : 0)
//                         }
//                         className="px-3 py-2 bg-blue-100 border border-gray-300 text-center text-blue-900 font-bold text-xs"
//                       >
//                         Base Year ({BASE_YEAR})
//                       </th>
//                     )}
//                     {OPTION_YEARS.map(
//                       (y, idx) =>
//                         visibleYears.includes(y) && (
//                           <th
//                             key={y}
//                             colSpan={
//                               2 +
//                               (laborMetrics.hrs && laborMetrics.amt
//                                 ? 24
//                                 : laborMetrics.hrs || laborMetrics.amt
//                                   ? 12
//                                   : 0)
//                             }
//                             className="px-3 py-2 bg-green-100 border border-gray-300 text-center text-green-900 font-bold text-xs"
//                           >
//                             Option Year {idx + 1} ({y})
//                           </th>
//                         ),
//                     )}
//                   </tr>
//                   <tr className="bg-gray-100 text-gray-700 text-xs font-bold tracking-wider">
//                     <th
//                       className="px-3 py-1.5 border border-gray-300 text-left sticky left-0 z-40 bg-gray-100 w-[150px] min-w-[150px] max-w-[150px] cursor-pointer hover:bg-gray-200"
//                       onClick={() => requestSort("task")}
//                     >
//                       <div className="flex items-center justify-between">
//                         Task {getSortIcon("task")}
//                       </div>
//                     </th>
//                     <th
//                       className="px-3 py-1.5 border border-gray-300 text-left sticky left-[150px] z-40 bg-gray-100 w-[120px] min-w-[120px] max-w-[120px] cursor-pointer hover:bg-gray-200"
//                       onClick={() => requestSort("type")}
//                     >
//                       <div className="flex items-center justify-between">
//                         Acct Type {getSortIcon("type")}
//                       </div>
//                     </th>
//                     <th className="px-3 py-1.5 border border-gray-300 text-left sticky left-[270px] z-40 bg-gray-100 w-[150px] min-w-[150px] max-w-[150px]">
//                       PLC
//                     </th>
//                     <th className="px-3 py-1.5 border border-gray-300 text-left sticky left-[420px] z-40 bg-gray-100 w-[100px] min-w-[100px] max-w-[100px]">
//                       EMP ID
//                     </th>
//                     <th className="px-3 py-1.5 border border-gray-300 text-left sticky left-[520px] z-40 bg-gray-100 w-[150px] min-w-[150px] max-w-[150px]">
//                       Name
//                     </th>
//                     <th className="px-3 py-1.5 border border-gray-300 text-right sticky left-[670px] z-40 bg-gray-100 w-[80px] min-w-[80px] max-w-[80px] border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]">
//                       Rate
//                     </th>
//                     {ALL_YEARS.map((y, i) => {
//                       if (!visibleYears.includes(y)) return null;
//                       return (
//                         <React.Fragment key={y}>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-right ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
//                           >
//                             Total Hrs
//                           </th>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-right ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
//                           >
//                             Total Amt
//                           </th>
//                           {months.map((m) => (
//                             <React.Fragment key={m}>
//                               {laborMetrics.hrs && (
//                                 <th
//                                   className={`px-2 py-1.5 border border-gray-300 text-right ${i === 0 ? "bg-blue-50/30" : "bg-green-50/30"}`}
//                                 >
//                                   {m} Hrs
//                                 </th>
//                               )}
//                               {laborMetrics.amt && (
//                                 <th
//                                   className={`px-2 py-1.5 border border-gray-300 text-right ${i === 0 ? "bg-blue-50/30" : "bg-green-50/30"}`}
//                                 >
//                                   {m} Amt
//                                 </th>
//                               )}
//                             </React.Fragment>
//                           ))}
//                         </React.Fragment>
//                       );
//                     })}
//                   </tr>
//                 </thead>
//               )}

//               {/* NON-LABOR HEADERS */}
//               {activeTab === "Non-Labor" && (
//                 <thead className="sticky top-0 z-30">
//                   <tr className="bg-gray-200 text-gray-800 text-xs font-bold  tracking-wider shadow-[0_1px_0_0_#d1d5db]">
//                     <th
//                       colSpan={4}
//                       className="px-3 py-2 border border-gray-300 text-left sticky left-0 z-40 bg-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)] border-r-2 border-r-gray-400"
//                     >
//                       Element Details
//                     </th>
//                     {visibleYears.includes(BASE_YEAR) && (
//                       <th
//                         colSpan={13}
//                         className="px-3 py-2 bg-blue-100 border border-gray-300 text-center text-blue-900 font-bold text-xs"
//                       >
//                         Base Year ({BASE_YEAR})
//                       </th>
//                     )}
//                     {OPTION_YEARS.map(
//                       (y, idx) =>
//                         visibleYears.includes(y) && (
//                           <th
//                             key={y}
//                             colSpan={13}
//                             className="px-3 py-2 bg-green-100 border border-gray-300 text-center text-green-900 font-bold text-xs"
//                           >
//                             Option Year {idx + 1} ({y})
//                           </th>
//                         ),
//                     )}
//                   </tr>
//                   <tr className="bg-gray-100 text-gray-700 text-xs font-bold tracking-wider">
//                     <th
//                       className="px-3 py-1.5 border border-gray-300 text-left sticky left-0 z-40 bg-gray-100 w-[150px] min-w-[150px] max-w-[150px] cursor-pointer hover:bg-gray-200"
//                       onClick={() => requestSort("task")}
//                     >
//                       <div className="flex items-center justify-between">
//                         Task {getSortIcon("task")}
//                       </div>
//                     </th>
//                     <th
//                       className="px-3 py-1.5 border border-gray-300 text-left sticky left-[150px] z-40 bg-gray-100 w-[150px] min-w-[150px] max-w-[150px] cursor-pointer hover:bg-gray-200"
//                       onClick={() => requestSort("type")}
//                     >
//                       <div className="flex items-center justify-between">
//                         Acct Type {getSortIcon("type")}
//                       </div>
//                     </th>
//                     <th className="px-3 py-1.5 border border-gray-300 text-left sticky left-[300px] z-40 bg-gray-100 w-[200px] min-w-[200px] max-w-[200px]">
//                       Account Name
//                     </th>
//                     <th className="px-3 py-1.5 border border-gray-300 text-left sticky left-[500px] z-40 bg-gray-100 w-[200px] min-w-[200px] max-w-[200px] border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]">
//                       Vendor Name
//                     </th>
//                     {ALL_YEARS.map((y, i) => {
//                       if (!visibleYears.includes(y)) return null;
//                       return (
//                         <React.Fragment key={y}>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-right ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
//                           >
//                             Total Cost
//                           </th>
//                           {months.map((m) => (
//                             <th
//                               key={m}
//                               className={`px-2 py-1.5 border border-gray-300 text-right ${i === 0 ? "bg-blue-50/30" : "bg-green-50/30"}`}
//                             >
//                               {m}
//                             </th>
//                           ))}
//                         </React.Fragment>
//                       );
//                     })}
//                   </tr>
//                 </thead>
//               )}

//               {/* PRICING ELEMENTS HEADERS */}
//               {isPerfTab && (
//                 <thead className="sticky top-0 z-30">
//                   <tr>
//                     <th
//                       colSpan={4}
//                       className="px-3 py-1.5 bg-gray-200 border border-gray-300 text-left text-gray-800 font-bold text-xs sticky left-0 z-40 border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]"
//                     >
//                       Element Details
//                     </th>
//                     {visibleYears.includes(BASE_YEAR) && (
//                       <th
//                         colSpan={isLaborPerf ? 13 : 12}
//                         className="px-3 py-1.5 bg-blue-100 border border-gray-300 text-center text-blue-900 font-bold text-xs"
//                       >
//                         Base Year ({BASE_YEAR})
//                       </th>
//                     )}
//                     {OPTION_YEARS.map(
//                       (y, idx) =>
//                         visibleYears.includes(y) && (
//                           <th
//                             key={y}
//                             colSpan={isLaborPerf ? 13 : 12}
//                             className="px-3 py-1.5 bg-green-100 border border-gray-300 text-center text-green-900 font-bold text-xs"
//                           >
//                             Option Year {idx + 1} ({y})
//                           </th>
//                         ),
//                     )}
//                   </tr>

//                   {/* NEW VISUAL GROUPING ROW */}
//                   <tr className="bg-gray-50 text-[10px] font-bold  tracking-wider text-gray-600 shadow-[0_1px_0_0_#d1d5db]">
//                     <th
//                       colSpan={4}
//                       className="px-3 py-1 border border-gray-300 sticky left-0 z-40 bg-gray-50 border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]"
//                     ></th>
//                     {ALL_YEARS.map((y) => {
//                       if (!visibleYears.includes(y)) return null;
//                       return (
//                         <React.Fragment key={`group-${y}`}>
//                           <th
//                             colSpan={2}
//                             className="px-2 py-1 border border-gray-300 text-center bg-blue-50/80 text-blue-800"
//                           >
//                             Direct Charge
//                           </th>
//                           <th
//                             colSpan={6}
//                             className="px-2 py-1 border border-gray-300 text-center bg-amber-50/80 text-amber-800"
//                           >
//                             Burden
//                           </th>
//                           <th
//                             colSpan={1}
//                             className="px-2 py-1 border border-gray-300 text-center bg-indigo-50/80 text-indigo-800"
//                           >
//                             Total Burdened Cost
//                           </th>
//                           {isLaborPerf && (
//                             <th
//                               colSpan={1}
//                               className="px-2 py-1 border border-gray-300 text-center bg-cyan-50/80 text-cyan-800"
//                             >
//                               Wrap Rate
//                             </th>
//                           )}
//                           <th
//                             colSpan={1}
//                             className="px-2 py-1 border border-gray-300 text-center bg-purple-50/80 text-purple-800"
//                           >
//                             Fee
//                           </th>
//                           <th
//                             colSpan={2}
//                             className="px-2 py-1 border border-gray-300 text-center bg-green-50/80 text-green-800"
//                           >
//                             Price
//                           </th>
//                         </React.Fragment>
//                       );
//                     })}
//                   </tr>

//                   <tr className="bg-gray-100 text-gray-700 text-xs font-semibold shadow-[0_1px_0_0_#d1d5db]">
//                     <th
//                       className="relative px-3 py-1.5 border border-gray-300 text-left cursor-pointer hover:bg-gray-200 transition-colors select-none sticky z-40 bg-gray-100"
//                       style={{
//                         left: performanceColumnLefts.topLevel,
//                         width: performanceColumnWidths.topLevel,
//                         minWidth: performanceColumnWidths.topLevel,
//                       }}
//                       onClick={() => requestSort("topLevel")}
//                     >
//                       <div className="flex items-center justify-between">
//                         Top Level {getSortIcon("topLevel")}
//                       </div>
//                       <div
//                         className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
//                         onMouseDown={(e) =>
//                           startPerformanceColumnResize(e, "topLevel")
//                         }
//                       />
//                     </th>
//                     <th
//                       className="relative px-3 py-1.5 border border-gray-300 text-left cursor-pointer hover:bg-gray-200 transition-colors select-none sticky z-40 bg-gray-100"
//                       style={{
//                         left: performanceColumnLefts.task,
//                         width: performanceColumnWidths.task,
//                         minWidth: performanceColumnWidths.task,
//                       }}
//                       onClick={() => requestSort("task")}
//                     >
//                       <div className="flex items-center justify-between">
//                         Task {getSortIcon("task")}
//                       </div>
//                       <div
//                         className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
//                         onMouseDown={(e) =>
//                           startPerformanceColumnResize(e, "task")
//                         }
//                       />
//                     </th>
//                     <th
//                       className="relative px-3 py-1.5 border border-gray-300 text-left cursor-pointer hover:bg-gray-200 transition-colors select-none sticky z-40 bg-gray-100"
//                       style={{
//                         left: performanceColumnLefts.type,
//                         width: performanceColumnWidths.type,
//                         minWidth: performanceColumnWidths.type,
//                       }}
//                       onClick={() => requestSort("type")}
//                     >
//                       <div className="flex items-center justify-between">
//                         Acct Type {getSortIcon("type")}
//                       </div>
//                       <div
//                         className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
//                         onMouseDown={(e) =>
//                           startPerformanceColumnResize(e, "type")
//                         }
//                       />
//                     </th>
//                     <th
//                       className="relative px-3 py-1.5 border border-gray-300 text-left cursor-pointer hover:bg-gray-200 transition-colors select-none sticky z-40 bg-gray-100 border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]"
//                       style={{
//                         left: performanceColumnLefts.category,
//                         width: performanceColumnWidths.category,
//                         minWidth: performanceColumnWidths.category,
//                       }}
//                       onClick={() => requestSort("cat")}
//                     >
//                       <div className="flex items-center justify-between">
//                         {isLaborPerf ? "Employee" : "Category"}{" "}
//                         {getSortIcon("cat")}
//                       </div>
//                       <div
//                         className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
//                         onMouseDown={(e) =>
//                           startPerformanceColumnResize(e, "category")
//                         }
//                       />
//                     </th>
//                     {ALL_YEARS.map((y, i) => {
//                       if (!visibleYears.includes(y)) return null;
//                       return (
//                         <React.Fragment key={y}>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
//                           >
//                             Hrs
//                           </th>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
//                           >
//                             Unburdened
//                           </th>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
//                           >
//                             AERO Fringe
//                           </th>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
//                           >
//                             NASA/NIH Fringe
//                           </th>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
//                           >
//                             Cust OH
//                           </th>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
//                           >
//                             {/* Columbus OH */}
//                             Off Site OH
//                           </th>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
//                           >
//                             Subk M&H
//                           </th>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
//                           >
//                             G&A
//                           </th>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-indigo-50/50" : "bg-indigo-50/50"}`}
//                           >
//                             Total Burdened Cost
//                           </th>
//                           {isLaborPerf && (
//                             <th
//                               className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-cyan-50/50" : "bg-cyan-50/50"}`}
//                             >
//                               Wrap Rate
//                             </th>
//                           )}
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-purple-50/50" : "bg-purple-50/50"}`}
//                           >
//                             Fee
//                           </th>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-center font-bold ${i === 0 ? "bg-blue-100/50" : "bg-green-100/50"}`}
//                           >
//                             Price
//                           </th>
//                           <th
//                             className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
//                           >
//                             Burdened Rate
//                           </th>
//                         </React.Fragment>
//                       );
//                     })}
//                   </tr>
//                 </thead>
//               )}

//               <tbody className="bg-white">
//                 {isLoading ? (
//                   <tr>
//                     <td
//                       colSpan={25}
//                       className="p-8 text-center text-gray-500 border border-gray-300"
//                     >
//                       Loading spreadsheet data...
//                     </td>
//                   </tr>
//                 ) : activeTab === "Performance By Elements" && !isLoading ? (
//                   (() => {
//                     const sum = elementsSummaryData;
//                     if (!sum || !sum.directCosts) return null;

//                     const renderRow = (
//                       label,
//                       baseVal,
//                       optsArr,
//                       rowClass = "",
//                       valClass = "",
//                     ) => (
//                       <tr
//                         key={label}
//                         className={`transition-colors ${rowClass}`}
//                       >
//                         <td className="px-4 py-2 border border-gray-300 font-medium text-gray-700 truncate max-w-[300px]">
//                           {label}
//                         </td>
//                         {visibleYears.includes(BASE_YEAR) && (
//                           <td
//                             className={`px-4 py-2 border border-gray-300 text-right font-semibold ${valClass}`}
//                           >
//                             {formatCurrency(baseVal)}
//                           </td>
//                         )}
//                         {optsArr.map(
//                           (optVal, idx) =>
//                             visibleYears.includes(OPTION_YEARS[idx]) && (
//                               <td
//                                 key={idx}
//                                 className={`px-4 py-2 border border-gray-300 text-right font-semibold ${valClass}`}
//                               >
//                                 {formatCurrency(optVal)}
//                               </td>
//                             ),
//                         )}
//                       </tr>
//                     );

//                     let totalDirBase = 0;
//                     let totalDirOpts = Array(OPTION_YEARS.length).fill(0);
//                     Object.values(sum.directCosts).forEach((dc) => {
//                       totalDirBase += dc.base;
//                       dc.opts.forEach((o, i) => (totalDirOpts[i] += o));
//                     });

//                     let totalBurdBase = 0;
//                     let totalBurdOpts = Array(OPTION_YEARS.length).fill(0);
//                     Object.values(sum.burdens).forEach((bc) => {
//                       totalBurdBase += bc.base;
//                       bc.opts.forEach((o, i) => (totalBurdOpts[i] += o));
//                     });

//                     const totalCostBase = totalDirBase + totalBurdBase;
//                     const totalCostOpts = totalDirOpts.map(
//                       (d, i) => d + totalBurdOpts[i],
//                     );

//                     const colCount =
//                       1 +
//                       (visibleYears.includes(BASE_YEAR) ? 1 : 0) +
//                       OPTION_YEARS.filter((y) => visibleYears.includes(y))
//                         .length;

//                     return (
//                       <>
//                         <tr className="bg-gray-200 text-gray-900 border-t-2 border-t-gray-400">
//                           <td
//                             colSpan={colCount}
//                             className="px-4 py-2 border border-gray-300 font-extrabold  tracking-wide text-xs"
//                           >
//                             Direct Cost
//                           </td>
//                         </tr>
//                         {Object.values(sum.directCosts)
//                           .sort((a, b) => a.name.localeCompare(b.name))
//                           .map((dc) =>
//                             renderRow(
//                               dc.name,
//                               dc.base,
//                               dc.opts,
//                               "hover:bg-blue-50/60 even:bg-gray-50/50",
//                               "text-gray-800",
//                             ),
//                           )}
//                         {renderRow(
//                           "Total Direct Cost",
//                           totalDirBase,
//                           totalDirOpts,
//                           "bg-gray-100 border-t border-t-gray-400",
//                           "text-gray-900 font-extrabold",
//                         )}

//                         <tr className="bg-gray-200 text-gray-900 border-t-4 border-t-white">
//                           <td
//                             colSpan={colCount}
//                             className="px-4 py-2 border border-gray-300 font-extrabold  tracking-wide text-xs"
//                           >
//                             Burden Cost
//                           </td>
//                         </tr>
//                         {Object.values(sum.burdens).map((bc) =>
//                           renderRow(
//                             bc.name,
//                             bc.base,
//                             bc.opts,
//                             "hover:bg-blue-50/60 even:bg-gray-50/50",
//                             "text-gray-800",
//                           ),
//                         )}
//                         {renderRow(
//                           "Total Burden Cost",
//                           totalBurdBase,
//                           totalBurdOpts,
//                           "bg-gray-100 border-t border-t-gray-400",
//                           "text-gray-900 font-extrabold",
//                         )}

//                         {renderRow(
//                           "Total Cost",
//                           totalCostBase,
//                           totalCostOpts,
//                           "bg-gray-200 border-t-4 border-t-white",
//                           "text-gray-900 font-black",
//                         )}

//                         {/* Insert Live Fee Row */}
//                         {renderRow(
//                           `Fee (${Number(globalFee).toFixed(2)}%)`,
//                           totalCostBase * (parseFloat(globalFee) / 100 || 0),
//                           totalCostOpts.map(
//                             (c) => c * (parseFloat(globalFee) / 100 || 0),
//                           ),
//                           "bg-purple-50 border-t border-t-gray-300",
//                           "text-purple-900 font-bold",
//                         )}

//                         {/* Updated Final Price Row */}
//                         <tr className="bg-blue-100 text-blue-900 border-t-4 border-t-blue-300 shadow-md">
//                           <td className="px-4 py-3 border border-blue-300 font-extrabold  tracking-wider text-[14px]">
//                             Revenue
//                           </td>
//                           {visibleYears.includes(BASE_YEAR) && (
//                             <td className="px-4 py-3 border border-blue-300 text-right font-extrabold text-[14px]">
//                               {formatCurrency(
//                                 totalCostBase *
//                                   (1 + (parseFloat(globalFee) / 100 || 0)),
//                               )}
//                             </td>
//                           )}
//                           {totalCostOpts.map(
//                             (optVal, idx) =>
//                               visibleYears.includes(OPTION_YEARS[idx]) && (
//                                 <td
//                                   key={idx}
//                                   className="px-4 py-3 border border-blue-300 text-right font-extrabold text-[14px]"
//                                 >
//                                   {formatCurrency(
//                                     optVal *
//                                       (1 + (parseFloat(globalFee) / 100 || 0)),
//                                   )}
//                                 </td>
//                               ),
//                           )}
//                         </tr>
//                       </>
//                     );
//                   })()
//                 ) : (
//                   <>
//                     {isPerfTab && !isLoading && (
//                       <>
//                         {/* HEADER 1: BASE RATE */}
//                         <tr className="bg-amber-50 font-semibold text-amber-900 text-xs border-b border-amber-200">
//                           <td
//                             className="px-3 py-1.5 border border-gray-300 sticky left-0 z-20 bg-amber-50 border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]"
//                             colSpan={4}
//                           >
//                             Burden Rates %
//                           </td>

//                           {visibleYears.includes(BASE_YEAR) &&
//                             (() => {
//                               const bRates =
//                                 burdenRates?.[BASE_YEAR] || zeroRates;
//                               return (
//                                 <>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                     -
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                     -
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {(bRates.aeroFringe * 100).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {(bRates.nasaFringe * 100).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {(bRates.custOH * 100).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {(bRates.columbusOH * 100).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {(bRates.subkMH * 100).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {(bRates.ga * 100).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                     -
//                                   </td>
//                                   {isLaborPerf && (
//                                     <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                       -
//                                     </td>
//                                   )}
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {Number(globalFee).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                     -
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                     -
//                                   </td>
//                                 </>
//                               );
//                             })()}

//                           {OPTION_YEARS.map((y) => {
//                             if (!visibleYears.includes(y)) return null;
//                             return (
//                               <React.Fragment key={y}>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                   -
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                   -
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                   {(
//                                     burdenRates?.[y]?.aeroFringe * 100 || 0
//                                   ).toFixed(2)}
//                                   %
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                   {(
//                                     burdenRates?.[y]?.nasaFringe * 100 || 0
//                                   ).toFixed(2)}
//                                   %
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                   {(
//                                     burdenRates?.[y]?.custOH * 100 || 0
//                                   ).toFixed(2)}
//                                   %
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                   {(
//                                     burdenRates?.[y]?.columbusOH * 100 || 0
//                                   ).toFixed(2)}
//                                   %
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                   {(
//                                     burdenRates?.[y]?.subkMH * 100 || 0
//                                   ).toFixed(2)}
//                                   %
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                   {(burdenRates?.[y]?.ga * 100 || 0).toFixed(2)}
//                                   %
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                   -
//                                 </td>
//                                 {isLaborPerf && (
//                                   <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                     -
//                                   </td>
//                                 )}
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                   {Number(globalFee).toFixed(2)}%
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                   -
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                   -
//                                 </td>
//                               </React.Fragment>
//                             );
//                           })}
//                         </tr>

//                         {/* HEADER 2: ESCALATED RATE WITH DYNAMIC MONTH */}
//                         <tr className="bg-amber-100 font-bold text-amber-900 text-xs border-b border-amber-200">
//                           <td
//                             className="px-3 py-1.5 border border-gray-300 sticky left-0 z-20 bg-amber-100 border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]"
//                             colSpan={4}
//                           >
//                             Escalated Rates
//                           </td>

//                           {visibleYears.includes(BASE_YEAR) &&
//                             (() => {
//                               const bRates =
//                                 burdenRates?.[BASE_YEAR] || zeroRates;
//                               return (
//                                 <>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                     -
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                     -
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {(bRates.aeroFringe * 100).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {(bRates.nasaFringe * 100).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {(bRates.custOH * 100).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {(bRates.columbusOH * 100).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {(bRates.subkMH * 100).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {(bRates.ga * 100).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                     -
//                                   </td>
//                                   {isLaborPerf && (
//                                     <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                       -
//                                     </td>
//                                   )}
//                                   <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                     {Number(globalFee).toFixed(2)}%
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                     -
//                                   </td>
//                                   <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                     -
//                                   </td>
//                                 </>
//                               );
//                             })()}

//                           {OPTION_YEARS.map((y) => {
//                             if (!visibleYears.includes(y)) return null;
//                             const yrMap = escalatedRatesMap[y];
//                             const disp = yrMap?.display || {};

//                             return (
//                               <React.Fragment key={y}>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                   -
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                   -
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
//                                   {(
//                                     disp.aeroFringe?.escRate * 100 || 0
//                                   ).toFixed(2)}
//                                   %{" "}
//                                   {disp.aeroFringe?.escMonthLabel !== "-" ? (
//                                     <span className="text-[10px] text-amber-700">
//                                       ({disp.aeroFringe?.escMonthLabel})
//                                     </span>
//                                   ) : (
//                                     ""
//                                   )}
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
//                                   {(
//                                     disp.nasaFringe?.escRate * 100 || 0
//                                   ).toFixed(2)}
//                                   %{" "}
//                                   {disp.nasaFringe?.escMonthLabel !== "-" ? (
//                                     <span className="text-[10px] text-amber-700">
//                                       ({disp.nasaFringe?.escMonthLabel})
//                                     </span>
//                                   ) : (
//                                     ""
//                                   )}
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
//                                   {(disp.custOH?.escRate * 100 || 0).toFixed(2)}
//                                   %{" "}
//                                   {disp.custOH?.escMonthLabel !== "-" ? (
//                                     <span className="text-[10px] text-amber-700">
//                                       ({disp.custOH?.escMonthLabel})
//                                     </span>
//                                   ) : (
//                                     ""
//                                   )}
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
//                                   {(
//                                     disp.columbusOH?.escRate * 100 || 0
//                                   ).toFixed(2)}
//                                   %{" "}
//                                   {disp.columbusOH?.escMonthLabel !== "-" ? (
//                                     <span className="text-[10px] text-amber-700">
//                                       ({disp.columbusOH?.escMonthLabel})
//                                     </span>
//                                   ) : (
//                                     ""
//                                   )}
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
//                                   {(disp.subkMH?.escRate * 100 || 0).toFixed(2)}
//                                   %{" "}
//                                   {disp.subkMH?.escMonthLabel !== "-" ? (
//                                     <span className="text-[10px] text-amber-700">
//                                       ({disp.subkMH?.escMonthLabel})
//                                     </span>
//                                   ) : (
//                                     ""
//                                   )}
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
//                                   {(disp.ga?.escRate * 100 || 0).toFixed(2)}%{" "}
//                                   {disp.ga?.escMonthLabel !== "-" ? (
//                                     <span className="text-[10px] text-amber-700">
//                                       ({disp.ga?.escMonthLabel})
//                                     </span>
//                                   ) : (
//                                     ""
//                                   )}
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                   -
//                                 </td>
//                                 {isLaborPerf && (
//                                   <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                     -
//                                   </td>
//                                 )}
//                                 <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
//                                   {Number(globalFee).toFixed(2)}%
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                   -
//                                 </td>
//                                 <td className="px-2 py-1.5 border border-gray-300 text-center">
//                                   -
//                                 </td>
//                               </React.Fragment>
//                             );
//                           })}
//                         </tr>
//                       </>
//                     )}

//                     {/* PAGINATED DATA ROWS */}
//                     {paginated.map((r, idx) => {
//                       return (
//                         <React.Fragment key={idx}>
//                           <tr className="group hover:bg-blue-50/50 even:bg-gray-50/30">
//                             {activeTab === "Labor" && (
//                               <>
//                                 <td className="px-3 py-1.5 border border-gray-300 sticky left-0 z-20 bg-white group-hover:bg-blue-50 w-[150px] min-w-[150px] max-w-[150px] truncate font-medium">
//                                   {r.task}
//                                 </td>
//                                 <td className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs sticky left-[150px] z-20 bg-white group-hover:bg-blue-50 w-[120px] min-w-[120px] max-w-[120px] truncate">
//                                   {r.type}
//                                 </td>
//                                 <td className="px-3 py-1.5 border border-gray-300 sticky left-[270px] z-20 bg-white group-hover:bg-blue-50 w-[150px] min-w-[150px] max-w-[150px] truncate">
//                                   {r.lcat}
//                                 </td>
//                                 <td className="px-3 py-1.5 border border-gray-300 text-gray-500 sticky left-[420px] z-20 bg-white group-hover:bg-blue-50 w-[100px] min-w-[100px] max-w-[100px] truncate">
//                                   {r.emplId}
//                                 </td>
//                                 <td className="px-3 py-1.5 border border-gray-300 sticky left-[520px] z-20 bg-white group-hover:bg-blue-50 w-[150px] min-w-[150px] max-w-[150px] truncate">
//                                   {r.emplName}
//                                 </td>
//                                 <td className="px-3 py-1.5 border border-gray-300 text-right text-gray-600 sticky left-[670px] z-20 bg-white group-hover:bg-blue-50 w-[80px] min-w-[80px] max-w-[80px] border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]">
//                                   {formatCurrency(r.rate)}
//                                 </td>

//                                 {/* Map Year Columns */}
//                                 {[r.base, ...r.opts].map((yData, yIdx) => {
//                                   if (!visibleYears.includes(ALL_YEARS[yIdx]))
//                                     return null;
//                                   return (
//                                     <React.Fragment key={yIdx}>
//                                       <td className="px-3 py-1.5 border border-gray-300 text-right font-medium">
//                                         {yData.hrs > 0
//                                           ? formatNum(yData.hrs)
//                                           : ""}
//                                       </td>
//                                       <td className="px-3 py-1.5 border border-gray-300 text-right font-semibold bg-gray-50/50">
//                                         {yData.amt > 0
//                                           ? formatCurrency(yData.amt)
//                                           : ""}
//                                       </td>
//                                       {months.map((m, mIdx) => (
//                                         <React.Fragment key={mIdx}>
//                                           {laborMetrics.hrs && (
//                                             <td className="px-3 py-1.5 border border-gray-300 text-right text-gray-600">
//                                               {yData.monthly[mIdx] > 0
//                                                 ? formatNum(yData.monthly[mIdx])
//                                                 : ""}
//                                             </td>
//                                           )}
//                                           {laborMetrics.amt && (
//                                             <td className="px-3 py-1.5 border border-gray-300 text-right text-indigo-700 font-medium">
//                                               {yData.monthlyAmt[mIdx] > 0
//                                                 ? formatCurrency(
//                                                     yData.monthlyAmt[mIdx],
//                                                   )
//                                                 : ""}
//                                             </td>
//                                           )}
//                                         </React.Fragment>
//                                       ))}
//                                     </React.Fragment>
//                                   );
//                                 })}
//                               </>
//                             )}

//                             {activeTab === "Non-Labor" && (
//                               <>
//                                 <td className="px-3 py-1.5 border border-gray-300 font-medium sticky left-0 z-20 bg-white group-hover:bg-blue-50 w-[150px] min-w-[150px] max-w-[150px] truncate">
//                                   {r.task}
//                                 </td>
//                                 <td className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs sticky left-[150px] z-20 bg-white group-hover:bg-blue-50 w-[150px] min-w-[150px] max-w-[150px] truncate">
//                                   {r.type}
//                                 </td>
//                                 <td className="px-3 py-1.5 border border-gray-300 sticky left-[300px] z-20 bg-white group-hover:bg-blue-50 w-[200px] min-w-[200px] max-w-[200px] truncate">
//                                   {r.name}
//                                 </td>
//                                 <td className="px-3 py-1.5 border border-gray-300 text-gray-600 sticky left-[500px] z-20 bg-white group-hover:bg-blue-50 w-[200px] min-w-[200px] max-w-[200px] truncate border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]">
//                                   {r.vendorName || "-"}
//                                 </td>

//                                 {/* Map Year Columns */}
//                                 {[r.base, ...r.opts].map((yData, yIdx) => {
//                                   if (!visibleYears.includes(ALL_YEARS[yIdx]))
//                                     return null;
//                                   return (
//                                     <React.Fragment key={yIdx}>
//                                       <td className="px-3 py-1.5 border border-gray-300 text-right font-bold bg-gray-50/50">
//                                         {yData.total > 0
//                                           ? formatCurrency(yData.total)
//                                           : ""}
//                                       </td>
//                                       {months.map((m, mIdx) => (
//                                         <td
//                                           key={mIdx}
//                                           className="px-3 py-1.5 border border-gray-300 text-right text-gray-600"
//                                         >
//                                           {yData.monthly[mIdx] !== 0
//                                             ? formatCurrency(
//                                                 yData.monthly[mIdx],
//                                               )
//                                             : ""}
//                                         </td>
//                                       ))}
//                                     </React.Fragment>
//                                   );
//                                 })}
//                               </>
//                             )}

//                             {isPerfTab && (
//                               <>
//                                 <td
//                                   className="px-3 py-1.5 border border-gray-300 font-bold text-gray-700 sticky z-20 bg-white group-hover:bg-blue-50 truncate"
//                                   style={{
//                                     left: performanceColumnLefts.topLevel,
//                                     width: performanceColumnWidths.topLevel,
//                                     minWidth: performanceColumnWidths.topLevel,
//                                   }}
//                                 >
//                                   {r.topLevel}
//                                 </td>
//                                 <td
//                                   className="px-3 py-1.5 border border-gray-300 font-medium sticky z-20 bg-white group-hover:bg-blue-50 truncate"
//                                   style={{
//                                     left: performanceColumnLefts.task,
//                                     width: performanceColumnWidths.task,
//                                     minWidth: performanceColumnWidths.task,
//                                   }}
//                                 >
//                                   {r.task}
//                                 </td>
//                                 <td
//                                   className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs sticky z-20 bg-white group-hover:bg-blue-50 truncate"
//                                   style={{
//                                     left: performanceColumnLefts.type,
//                                     width: performanceColumnWidths.type,
//                                     minWidth: performanceColumnWidths.type,
//                                   }}
//                                 >
//                                   {r.type}
//                                 </td>

//                                 <td
//                                   className="px-3 py-1.5 border border-gray-300 text-xs sticky z-20 bg-white group-hover:bg-blue-50 truncate border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]"
//                                   style={{
//                                     left: performanceColumnLefts.category,
//                                     width: performanceColumnWidths.category,
//                                     minWidth: performanceColumnWidths.category,
//                                   }}
//                                 >
//                                   {activeTab === "Performance By Employee" ? (
//                                     // Employee dropdown -> hourly-rate breakdown lines
//                                     <button
//                                       onClick={() => toggleExpand(r.id)}
//                                       className="flex items-center gap-1 w-full text-blue-700 hover:text-blue-900 hover:underline focus:outline-none text-left font-semibold"
//                                       title={
//                                         r.rateRows && r.rateRows.length > 1
//                                           ? `${r.rateRows.length} different hourly rates`
//                                           : "Show hourly rate breakdown"
//                                       }
//                                     >
//                                       {expandedRows.has(r.id) ? (
//                                         <ChevronDown
//                                           size={14}
//                                           className="shrink-0 text-gray-500"
//                                         />
//                                       ) : (
//                                         <ChevronRight
//                                           size={14}
//                                           className="shrink-0 text-gray-500"
//                                         />
//                                       )}
//                                       <span className="truncate">{r.cat}</span>
//                                       {r.rateRows && r.rateRows.length > 1 && (
//                                         <span className="shrink-0 ml-auto text-[9px] font-bold bg-amber-100 text-amber-800 rounded px-1">
//                                           {r.rateRows.length} rates
//                                         </span>
//                                       )}
//                                     </button>
//                                   ) : r.isLabor ? (
//                                     <button
//                                       onClick={() => toggleExpand(r.id)}
//                                       className="flex items-center gap-1 w-full text-blue-600 hover:text-blue-800 hover:underline focus:outline-none text-left font-semibold"
//                                     >
//                                       {expandedRows.has(r.id) ? (
//                                         <ChevronDown
//                                           size={14}
//                                           className="shrink-0 text-gray-500"
//                                         />
//                                       ) : (
//                                         <ChevronRight
//                                           size={14}
//                                           className="shrink-0 text-gray-500"
//                                         />
//                                       )}
//                                       <span className="truncate">{r.cat}</span>
//                                     </button>
//                                   ) : (
//                                     <span className="text-gray-600 block pl-[18px] truncate">
//                                       {r.cat}
//                                     </span>
//                                   )}
//                                 </td>

//                                 {[r.base, ...r.opts].map((y, i) => {
//                                   if (!visibleYears.includes(ALL_YEARS[i]))
//                                     return null;
//                                   return (
//                                     <React.Fragment key={i}>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                         {y.hrs > 0 ? formatNum(y.hrs) : ""}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right">
//                                         {formatCurrency(y.cost)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-gray-600">
//                                         {formatNum(y.aeroFringe)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-gray-600">
//                                         {formatNum(y.nasaFringe)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-gray-600">
//                                         {formatNum(y.custOH)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-gray-600">
//                                         {formatNum(y.columbusOH)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-gray-600">
//                                         {formatNum(y.subkMH)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-gray-600">
//                                         {formatNum(y.ga)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right font-semibold text-indigo-800">
//                                         {formatCurrency(y.totalBurdenedCost)}
//                                       </td>
//                                       {activeTab ===
//                                         "Performance By Employee" && (
//                                         <td className="px-2 py-1.5 border border-gray-300 text-right font-semibold text-cyan-700">
//                                           {y.cost > 0
//                                             ? y.wrapRate.toFixed(2)
//                                             : ""}
//                                         </td>
//                                       )}
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-purple-700 font-medium">
//                                         {formatCurrency(y.fee)}
//                                       </td>
//                                       <td
//                                         className={`px-2 py-1.5 border border-gray-300 text-right font-bold ${i === 0 ? "bg-blue-100/50" : "bg-green-100/50"}`}
//                                       >
//                                         {formatCurrency(y.price)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-green-700 font-medium">
//                                         {formatCurrency(y.rate)}
//                                       </td>
//                                     </React.Fragment>
//                                   );
//                                 })}
//                               </>
//                             )}
//                           </tr>

//                           {/* EXPANDED HOURLY-RATE BREAKDOWN (Performance By Employee) */}
//                           {activeTab === "Performance By Employee" &&
//                             expandedRows.has(r.id) &&
//                             (r.rateRows || []).map((rr, rIdx) => (
//                               <tr
//                                 key={`${r.id}-rate-${rIdx}`}
//                                 className="group bg-indigo-50/50 hover:bg-indigo-100/50 text-gray-700"
//                               >
//                                 <td
//                                   className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100"
//                                   style={{
//                                     left: performanceColumnLefts.topLevel,
//                                     width: performanceColumnWidths.topLevel,
//                                     minWidth: performanceColumnWidths.topLevel,
//                                   }}
//                                 ></td>
//                                 <td
//                                   className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100 truncate pl-7 text-[11px] font-medium text-indigo-900 border-l-4 border-l-indigo-400"
//                                   style={{
//                                     left: performanceColumnLefts.task,
//                                     width: performanceColumnWidths.task,
//                                     minWidth: performanceColumnWidths.task,
//                                   }}
//                                   title={formatPeriods(rr.months)}
//                                 >
//                                   ↳ {formatPeriods(rr.months)}
//                                 </td>
//                                 <td
//                                   className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100 truncate text-xs text-indigo-800"
//                                   style={{
//                                     left: performanceColumnLefts.type,
//                                     width: performanceColumnWidths.type,
//                                     minWidth: performanceColumnWidths.type,
//                                   }}
//                                 >
//                                   {r.type}
//                                 </td>
//                                 <td
//                                   className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100 truncate border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)] text-xs font-semibold text-indigo-800"
//                                   style={{
//                                     left: performanceColumnLefts.category,
//                                     width: performanceColumnWidths.category,
//                                     minWidth: performanceColumnWidths.category,
//                                   }}
//                                 >
//                                   {formatCurrency(rr.rate)} / hr
//                                 </td>

//                                 {[rr.base, ...rr.opts].map((y, i) => {
//                                   if (!visibleYears.includes(ALL_YEARS[i]))
//                                     return null;
//                                   return (
//                                     <React.Fragment key={i}>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-900">
//                                         {y.hrs > 0 ? formatNum(y.hrs) : ""}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-900">
//                                         {formatCurrency(y.cost)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
//                                         {formatNum(y.aeroFringe)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
//                                         {formatNum(y.nasaFringe)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
//                                         {formatNum(y.custOH)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
//                                         {formatNum(y.columbusOH)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
//                                         {formatNum(y.subkMH)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
//                                         {formatNum(y.ga)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right font-semibold text-indigo-800">
//                                         {formatCurrency(y.totalBurdenedCost)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right font-semibold text-cyan-700">
//                                         {y.cost > 0
//                                           ? y.wrapRate.toFixed(2)
//                                           : ""}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-purple-700 font-medium">
//                                         {formatCurrency(y.fee)}
//                                       </td>
//                                       <td
//                                         className={`px-2 py-1.5 border border-gray-300 text-right font-bold ${i === 0 ? "bg-blue-100/50" : "bg-green-100/50"}`}
//                                       >
//                                         {formatCurrency(y.price)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-green-700 font-medium">
//                                         {formatCurrency(y.rate)}
//                                       </td>
//                                     </React.Fragment>
//                                   );
//                                 })}
//                               </tr>
//                             ))}

//                           {/* EXPANDED EMPLOYEE SUB-ROWS */}
//                           {activeTab === "Performance By Category" &&
//                             r.isLabor &&
//                             expandedRows.has(r.id) &&
//                             r.subItems.map((sub, sIdx) => (
//                               <tr
//                                 key={`${r.id}-sub-${sIdx}`}
//                                 className="group bg-indigo-50/50 hover:bg-indigo-100/50 text-gray-700"
//                               >
//                                 <td
//                                   className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100"
//                                   style={{
//                                     left: performanceColumnLefts.topLevel,
//                                     width: performanceColumnWidths.topLevel,
//                                     minWidth: performanceColumnWidths.topLevel,
//                                   }}
//                                 ></td>
//                                 <td
//                                   className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100 truncate pl-7 text-xs font-medium text-indigo-900 border-l-4 border-l-indigo-400"
//                                   style={{
//                                     left: performanceColumnLefts.task,
//                                     width: performanceColumnWidths.task,
//                                     minWidth: performanceColumnWidths.task,
//                                   }}
//                                 >
//                                   ↳ {sub.name}
//                                 </td>
//                                 <td
//                                   className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100 truncate text-xs text-indigo-800"
//                                   style={{
//                                     left: performanceColumnLefts.type,
//                                     width: performanceColumnWidths.type,
//                                     minWidth: performanceColumnWidths.type,
//                                   }}
//                                 >
//                                   {r.type}
//                                 </td>
//                                 <td
//                                   className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100 truncate border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)] text-xs text-indigo-800"
//                                   style={{
//                                     left: performanceColumnLefts.category,
//                                     width: performanceColumnWidths.category,
//                                     minWidth: performanceColumnWidths.category,
//                                   }}
//                                 >
//                                   {r.cat}
//                                 </td>

//                                 {[sub.base, ...sub.opts].map((y, i) => {
//                                   if (!visibleYears.includes(ALL_YEARS[i]))
//                                     return null;
//                                   return (
//                                     <React.Fragment key={i}>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-900">
//                                         {y.hrs > 0 ? formatNum(y.hrs) : ""}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-900">
//                                         {formatCurrency(y.cost)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
//                                         {formatNum(y.aeroFringe)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
//                                         {formatNum(y.nasaFringe)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
//                                         {formatNum(y.custOH)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
//                                         {formatNum(y.columbusOH)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
//                                         {formatNum(y.subkMH)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
//                                         {formatNum(y.ga)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right font-semibold text-indigo-800">
//                                         {formatCurrency(y.totalBurdenedCost)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-purple-700 font-medium">
//                                         {formatCurrency(y.fee)}
//                                       </td>
//                                       <td
//                                         className={`px-2 py-1.5 border border-gray-300 text-right font-bold ${i === 0 ? "bg-blue-100/50" : "bg-green-100/50"}`}
//                                       >
//                                         {formatCurrency(y.price)}
//                                       </td>
//                                       <td className="px-2 py-1.5 border border-gray-300 text-right text-green-700 font-medium">
//                                         {formatCurrency(y.rate)}
//                                       </td>
//                                     </React.Fragment>
//                                   );
//                                 })}
//                               </tr>
//                             ))}
//                         </React.Fragment>
//                       );
//                     })}
//                   </>
//                 )}
//               </tbody>

//               {/* TOTALS FOOTER ROWS */}
//               {activeTab === "Labor" && laborTotals && (
//                 <tfoot className="sticky bottom-0 z-30 shadow-[0_-1px_2px_rgba(0,0,0,0.1)]">
//                   <tr className="bg-blue-50 text-blue-900">
//                     <td
//                       colSpan={6}
//                       className="px-3 py-2.5 border border-blue-200 text-right font-bold text-[11px] tracking-wider  sticky left-0 z-40 border-r-2 border-r-blue-300 bg-blue-50"
//                     >
//                       Total
//                     </td>
//                     {[laborTotals.base, ...laborTotals.opts].map(
//                       (yData, yIdx) => {
//                         if (!visibleYears.includes(ALL_YEARS[yIdx]))
//                           return null;
//                         return (
//                           <React.Fragment key={`tot-${yIdx}`}>
//                             <td className="px-3 py-2.5 border border-blue-200 text-right font-bold">
//                               {yData.hrs > 0 ? formatNum(yData.hrs) : ""}
//                             </td>
//                             <td className="px-3 py-2.5 border border-blue-200 text-right font-bold text-blue-800">
//                               {yData.amt > 0 ? formatCurrency(yData.amt) : ""}
//                             </td>
//                             {months.map((m, mIdx) => (
//                               <React.Fragment key={mIdx}>
//                                 {laborMetrics.hrs && (
//                                   <td className="px-3 py-2.5 border border-blue-200 text-right font-semibold">
//                                     {yData.monthly[mIdx] > 0
//                                       ? formatNum(yData.monthly[mIdx])
//                                       : ""}
//                                   </td>
//                                 )}
//                                 {laborMetrics.amt && (
//                                   <td className="px-3 py-2.5 border border-blue-200 text-right font-semibold text-indigo-800">
//                                     {yData.monthlyAmt[mIdx] > 0
//                                       ? formatCurrency(yData.monthlyAmt[mIdx])
//                                       : ""}
//                                   </td>
//                                 )}
//                               </React.Fragment>
//                             ))}
//                           </React.Fragment>
//                         );
//                       },
//                     )}
//                   </tr>
//                 </tfoot>
//               )}

//               {activeTab === "Non-Labor" && nonLaborTotals && (
//                 <tfoot className="sticky bottom-0 z-30 shadow-[0_-1px_2px_rgba(0,0,0,0.1)]">
//                   <tr className="bg-blue-50 text-blue-900">
//                     <td
//                       colSpan={4}
//                       className="px-3 py-2.5 border border-blue-200 text-right font-bold text-[11px] tracking-wider  sticky left-0 z-40 bg-blue-50 border-r-2 border-r-blue-300"
//                     >
//                       Total
//                     </td>
//                     {[nonLaborTotals.base, ...nonLaborTotals.opts].map(
//                       (yData, yIdx) => {
//                         if (!visibleYears.includes(ALL_YEARS[yIdx]))
//                           return null;
//                         return (
//                           <React.Fragment key={`totNL-${yIdx}`}>
//                             <td className="px-3 py-2.5 border border-blue-200 text-right font-bold text-blue-800">
//                               {yData.total > 0
//                                 ? formatCurrency(yData.total)
//                                 : ""}
//                             </td>
//                             {months.map((m, mIdx) => (
//                               <td
//                                 key={mIdx}
//                                 className="px-3 py-2.5 border border-blue-200 text-right font-semibold"
//                               >
//                                 {yData.monthly[mIdx] !== 0
//                                   ? formatCurrency(yData.monthly[mIdx])
//                                   : ""}
//                               </td>
//                             ))}
//                           </React.Fragment>
//                         );
//                       },
//                     )}
//                   </tr>
//                 </tfoot>
//               )}
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Pagination / Status Bar */}
//       <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-t border-gray-300 text-xs text-gray-600 font-medium">
//         <span>
//           {activeTab === "Performance By Elements"
//             ? `Ready - ${Object.keys(elementsSummaryData?.directCosts || {}).length} Types`
//             : activeTab === "Proposal Package"
//               ? `Ready - Document Editor`
//               : activeTab === "DFARS Adequacy Checklist"
//                 ? `Ready - DFARS Checklist`
//                 : activeTab === "Dashboard"
//                   ? `Ready - Dashboard Overview`
//                   : `Showing rows ${(currentPage - 1) * rowsPerPage + 1} to ${Math.min(currentPage * rowsPerPage, (sortedData || []).length)} of ${(sortedData || []).length}`}
//           {selectedProject ? ` | Filter: ${selectedProject}` : ""}
//         </span>

//         <div className="flex items-center gap-4 ml-auto">
//           {activeTab !== "Performance By Elements" &&
//             activeTab !== "Proposal Package" &&
//             activeTab !== "Dashboard" &&
//             activeTab !== "DFARS Adequacy Checklist" &&
//             sortedData.length > 0 && (
//               <div className="flex items-center gap-2">
//                 <label
//                   htmlFor="rowsPerPage"
//                   className="font-semibold  tracking-wider text-[10px] text-gray-500"
//                 >
//                   Rows per page:
//                 </label>
//                 <select
//                   id="rowsPerPage"
//                   value={rowsPerPage}
//                   onChange={(e) => {
//                     setRowsPerPage(Number(e.target.value));
//                     setCurrentPage(1);
//                   }}
//                   className="border border-gray-300 rounded bg-white px-1 py-0.5 outline-none cursor-pointer focus:border-green-600"
//                 >
//                   <option value={10}>10</option>
//                   <option value={25}>25</option>
//                   <option value={50}>50</option>
//                   <option value={100}>100</option>
//                   <option value={500}>500</option>
//                 </select>
//               </div>
//             )}

//           {activeTab !== "Performance By Elements" &&
//             activeTab !== "Proposal Package" &&
//             activeTab !== "Dashboard" &&
//             activeTab !== "DFARS Adequacy Checklist" &&
//             sortedData.length > 0 && (
//               <div className="flex items-center gap-1">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                   className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:bg-transparent transition-colors"
//                 >
//                   <ChevronLeft size={14} />
//                 </button>
//                 <span className="px-2">
//                   Page {currentPage} of{" "}
//                   {Math.max(1, Math.ceil(sortedData.length / rowsPerPage))}
//                 </span>
//                 <button
//                   onClick={() => setCurrentPage((p) => p + 1)}
//                   disabled={currentPage * rowsPerPage >= sortedData.length}
//                   className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:bg-transparent transition-colors"
//                 >
//                   <ChevronRight size={14} />
//                 </button>
//               </div>
//             )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectPerformance;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { backendUrl } from "./config";
import {
  Download,
  Table,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  ArrowRight,
  ChartNoAxesCombined,
  Search,
  X,
} from "lucide-react";

// Import Recharts for the Interactive Dashboard
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { FcDataConfiguration } from "react-icons/fc";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import html2pdf from "html2pdf.js";

// Year Definitions - Base Year 2027
// NOTE: GL records are matched on fyCd. Only years inside ALL_YEARS are shown.
const BASE_YEAR = "2025";
const OPTION_YEARS = ["2026"];
const ALL_YEARS = [BASE_YEAR, ...OPTION_YEARS];

// Project ID prefixes treated as indirect when the Include Indirect Project
// switch is OFF. These are applied directly to GL Post Detail data.
const INDIRECT_PROJECT_PREFIXES = [
  "FR",
  "FA",
  "GNA",
  "IRD",
  "LEAVE",
  "OVH",
  "SMH",
  "SUB",
  "UNA",
];

const zeroRates = {
  aeroFringe: 0,
  nasaFringe: 0,
  calInt: 0,
  custOH: 0,
  columbusOH: 0,
  subkMH: 0,
  ga: 0,
  fee: 0,
};

const defaultEsc = {
  rate: 0,
  fromM: "01",
  fromY: "2028",
  toM: "12",
  toY: "2032",
};

const initialEscalations = {
  All: { rate: 0, fromM: "01", fromY: "2028", toM: "12", toY: "2032" },
  aeroFringe: { ...defaultEsc },
  nasaFringe: { ...defaultEsc },
  calInt: { ...defaultEsc },
  custOH: { ...defaultEsc },
  columbusOH: { ...defaultEsc },
  subkMH: { ...defaultEsc },
  ga: { ...defaultEsc },
  fee: { ...defaultEsc },
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ==========================================
// DFARS CHECKLIST DATA
// ==========================================
const checklistData = [
  {
    title: "1. General & Administrative Checklist Rules",
    items: [
      {
        id: "Item 1",
        req: "Table 15-2 Compliance: Proposal conforms to the format and instructions in FAR 15.408, Table 15-2.",
        logic:
          "Verifies all summary elements (Labor, Subcontract, Material, Indirects, Fee) roll into a standard 15-2 summary schedule.",
      },
      {
        id: "Item 2",
        req: "Cognizant Audit & Admin Offices: Disclose ACO and DCAA branch office addresses, POCs, and emails.",
        logic:
          "Validates company entity profile fields for Cognizant DCMA/ACO and DCAA offices, CAGE code, and UEI.",
      },
      {
        id: "Item 3",
        req: "Accounting System Adequacy: Statement regarding whether the accounting system has been approved by DCAA/DCMA.",
        logic:
          "Checks for system adequacy disclosure, audit report number, and approval date (e.g., DFARS 252.242-7005 status).",
      },
      {
        id: "Item 4",
        req: "Estimating System Adequacy: Statement confirming the estimating system meets DFARS 252.215-7002 criteria.",
        logic:
          "Checks for an affirmative disclosure of an approved estimating system or explicit rationale if not approved.",
      },
      {
        id: "Item 5",
        req: "CAS Disclosure Statement: Does the offeror have an active Cost Accounting Standards (CAS) Disclosure Statement (Form CASB DS-1)?",
        logic:
          "Checks if contract value meets CAS thresholds (e.g., TINA/Truth in Negotiations threshold) and verifies CAS status (Exempt, Modified, Full).",
      },
      {
        id: "Item 6",
        req: "Index of Cost or Pricing Data: Direct cross-reference index showing where all supporting data resides in the package.",
        logic:
          "Auto-generates a dynamic document index mapping every WBS/CLIN to its underlying BOE, payroll file, or vendor quote attachment.",
      },
    ],
  },
  {
    title: "2. Direct Labor Checklist Rules",
    items: [
      {
        id: "Item 11",
        req: "Labor Category Basis: Basis of labor rates proposed (historical actuals, payroll records, market surveys, forward pricing).",
        logic:
          "Validates that every proposed LCAT has an assigned Rate Source flag (e.g., Costpoint Master Pay, Bureau of Labor Statistics, Salary.com).",
      },
      {
        id: "Item 12",
        req: "Labor Escalation Rationale: Specific methodology and historical basis used for out-year escalation.",
        logic:
          "Verifies an escalation factor is applied per Option Year and checks that the user has selected or written an escalation justification.",
      },
      {
        id: "Item 13",
        req: "Time-Phased Hours (BOE): Breakdown of hours by LCAT, task/WBS, and performance period.",
        logic:
          "Validates that total CLIN hours reconcile exactly with the sum of detailed task hours across all periods of performance.",
      },
    ],
  },
  {
    title: "3. Indirect Rates & Cost Pools Rules",
    items: [
      {
        id: "Item 14",
        req: "Indirect Rate Status (FPRA/FPRP/PBR): Disclose whether indirect rates are based on an FPRA, FPRP, Provisional Billing Rates, or other estimates.",
        logic:
          "Inspects the Rate Schedule selector. If FPRA is selected, validates agreement date, expiration date, and ACO reference ID.",
      },
      {
        id: "Item 15",
        req: "Rate Base & Pool Description: Detailed explanation of allocation bases (e.g., Fringe on Direct Labor, G&A on Total Cost Input).",
        logic:
          "Ensures applied cost pools match Costpoint allocation logic and that no unburdened base elements are skipped.",
      },
      {
        id: "Item 16",
        req: "Indirect Pool Reconciliation: If FPRA does not exist, provide at least 3 years of historical actual pool rates, base amounts, and pool expenses.",
        logic:
          "Checks if non-FPRA mode has historical base/pool data attached or populated from Costpoint pool history.",
      },
    ],
  },
  {
    title: "4. Subcontractors & Materials (High DCAA Scrutiny)",
    items: [
      {
        id: "Item 17",
        req: "Subcontract Price/Cost Analysis: Prime contractor's documented cost/price analysis for all subcontractors per FAR 15.404-3.",
        logic:
          'Requires user to tag each subcontract as "Commercial / Price Analysis" or "Cost-Reimbursable / Cost Analysis Performed."',
      },
      {
        id: "Item 18",
        req: "TINA Subcontract Threshold: Submission of certified cost or pricing data from subcontractors exceeding the TINA threshold ($2,000,000+).",
        logic:
          "Checks individual sub line items against the threshold; prompts for certified sub-tier package attachment.",
      },
      {
        id: "Item 20",
        req: "Consolidated Bill of Materials (CBOM): Materials priced over the threshold must include vendor quotes, purchase orders, or catalog pricing.",
        logic:
          "Validates that line-item materials link to a documented unit price source (Vendor Quote, Historical PO, Catalog Price).",
      },
    ],
  },
  {
    title: "5. Other Direct Costs (ODCs) & Travel",
    items: [
      {
        id: "Item 23",
        req: "Travel Basis of Estimate: Travel costs broken down by origin, destination, number of trips, travelers, duration, and per diem.",
        logic:
          "Ensures travel lines are not entered as flat lump sums; verifies rate sources (GSA Per Diem, Fly America Act airfare estimates).",
      },
      {
        id: "Item 25",
        req: "Royalties & Special Equipment: Explanations for license fees, specialized testing facilities, or royalties.",
        logic:
          "If non-standard ODC accounts are used, verifies that narrative justification is entered.",
      },
    ],
  },
];

const formatDisplayType = (str) => {
  if (!str) return "";
  const s = String(str).trim().toLowerCase();
  if (s === "non-labor" || s === "non labor") return "Non-Labor";
  if (s === "labor") return "Labor";
  return s.replace(/\b\w/g, (char) => char.toUpperCase());
};

// ==========================================
// YEAR-BUCKET HELPERS (Labor / Non-Labor)
// ==========================================
const emptyLaborYear = () => ({
  hrs: 0,
  amt: 0,
  monthly: Array(12).fill(0),
  monthlyAmt: Array(12).fill(0),
});
const emptyNonLaborYear = () => ({ total: 0, monthly: Array(12).fill(0) });

const addLaborYear = (target, src) => {
  target.hrs += src.hrs;
  target.amt += src.amt;
  for (let m = 0; m < 12; m++) {
    target.monthly[m] += src.monthly[m];
    target.monthlyAmt[m] += src.monthlyAmt[m];
  }
};
const addNonLaborYear = (target, src) => {
  target.total += src.total;
  for (let m = 0; m < 12; m++) target.monthly[m] += src.monthly[m];
};

// Converts a list of absolute months (year * 12 + monthIndex) into a readable
// string, e.g. "Jan 2027 - Feb 2027, Jun 2027" (consecutive months are merged)
const formatPeriods = (absMonths) => {
  if (!absMonths || absMonths.length === 0) return "";
  const sorted = [...new Set(absMonths)].sort((a, b) => a - b);
  const fmt = (n) => `${months[n % 12]} ${Math.floor(n / 12)}`;
  const ranges = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    const cur = sorted[i];
    if (cur !== prev + 1) {
      ranges.push(start === prev ? fmt(start) : `${fmt(start)} - ${fmt(prev)}`);
      start = cur;
    }
    prev = cur;
  }
  return ranges.join(", ");
};

const ProjectPerformance = () => {
  const exportDocumentToPDF = () => {
    const previewElement = document.getElementById(
      "propricer-preview-container",
    );
    if (!previewElement) return alert("Preview container not found.");
    const opt = {
      margin: 10,
      filename: `Proposal_${selectedProject || "Document"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(previewElement).set(opt).save();
  };

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [dashboardView, setDashboardView] = useState("Overview");
  const [selectedDashboardFilter, setSelectedDashboardFilter] = useState({
    laborCategory: "",
    employee: "",
    vendor: "",
  });

  // Resizable sticky columns for Performance By Category / Performance By Employee
  const [performanceColumnWidths, setPerformanceColumnWidths] = useState({
    topLevel: 120,
    task: 150,
    type: 120,
    category: 150,
  });
  const [resizingPerformanceColumn, setResizingPerformanceColumn] =
    useState(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);

  const performanceColumnLefts = useMemo(() => {
    const w = performanceColumnWidths;
    return {
      topLevel: 0,
      task: w.topLevel,
      type: w.topLevel + w.task,
      category: w.topLevel + w.task + w.type,
    };
  }, [performanceColumnWidths]);

  const startPerformanceColumnResize = useCallback(
    (e, column) => {
      e.preventDefault();
      e.stopPropagation();
      setResizingPerformanceColumn(column);
      setResizeStartX(e.clientX);
      setResizeStartWidth(performanceColumnWidths[column]);
    },
    [performanceColumnWidths],
  );

  useEffect(() => {
    if (!resizingPerformanceColumn) return;

    const handleMouseMove = (e) => {
      const delta = e.clientX - resizeStartX;
      setPerformanceColumnWidths((prev) => ({
        ...prev,
        [resizingPerformanceColumn]: Math.max(80, resizeStartWidth + delta),
      }));
    };

    const handleMouseUp = () => {
      setResizingPerformanceColumn(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingPerformanceColumn, resizeStartX, resizeStartWidth]);

  // Master Data State
  const [masterForecast, setMasterForecast] = useState([]);
  // Active employee master records are sourced from the Employee API, not GL Post Detail.
  const [activeEmployeeRecords, setActiveEmployeeRecords] = useState([]);
  const [standardHours, setStandardHours] = useState(2080);
  const [laborData, setLaborData] = useState({ empMap: {} });
  const [nonLaborData, setNonLaborData] = useState({
    coa: {},
    coaTypes: {},
    coaGroups: {},
  });
  const [plcMap, setPlcMap] = useState({});
  const [vendorMap, setVendorMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [projectLevel] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Project Filter State
  // projectInput    = what the user is typing (does NOT filter the data)
  // selectedProject = the applied filter (only changes when Search is clicked)
  const [projectInput, setProjectInput] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [projectSearchResults, setProjectSearchResults] = useState([]);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [isSearchingProject, setIsSearchingProject] = useState(false);
  const [includeIndirectProjects, setIncludeIndirectProjects] = useState(false);

  // const handleSearch = () => {
  //   setSelectedProject(projectInput.trim());
  //   setCurrentPage(1);
  //   setShowProjectDropdown(false);
  // };
  const handleSearch = () => {
    const projectId = projectInput.trim();

    if (!projectId) {
      return;
    }

    const parts = projectId.split(".").filter(Boolean);

    // Allow Level 1 (ABC) and Level 2 (ABC.02) project IDs.
    if (parts.length < 1 || parts.length > 2) {
      alert(
        "Please enter a Level 1 or Level 2 Project ID, such as ABC or ABC.02.",
      );
      return;
    }

    setSelectedProject(projectId);
    setCurrentPage(1);
    setShowProjectDropdown(false);
  };

  const handleClearSearch = () => {
    setProjectInput("");
    setSelectedProject("");
    setCurrentPage(1);
    setShowProjectDropdown(false);
  };

  const [proPricerContent, setProPricerContent] = useState("");

  const [docSections, setDocSections] = useState({
    coverLetter: true,
    vol1Admin: true,
    vol2Tech: true,
    vol3Mgmt: true,
    vol4PastPerf: true,
    vol5Price: true,
    sec5_1: true,
    sec5_2: true,
    sec5_3: true,
    sec5_4: true,
    sec5_5: true,
    sec5_6: true,
    sec5_7: true,
    repsAndCerts: true,
  });

  // DFARS State
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [draftEscalations, setDraftEscalations] = useState(initialEscalations);
  const [appliedEscalations, setAppliedEscalations] =
    useState(initialEscalations);
  const [showEscalationPanel, setShowEscalationPanel] = useState(false);
  const [isEscalationCustom, setIsEscalationCustom] = useState(false);

  const [showEscalationInfo, setShowEscalationInfo] = useState(false);

  const handleDraftChange = (poolKey, field, value) => {
    setDraftEscalations((prev) => {
      const next = { ...prev };
      next[poolKey] = { ...next[poolKey], [field]: value };
      if (poolKey === "All") {
        Object.keys(next).forEach((k) => {
          if (k !== "All") next[k] = { ...next[k], [field]: value };
        });
      }
      return next;
    });
  };

  const applyEscalations = () => {
    if (!isEscalationCustom) {
      const allSettings = draftEscalations.All;
      const synced = { ...draftEscalations };
      Object.keys(synced).forEach((k) => {
        if (k !== "All") synced[k] = { ...allSettings };
      });
      setAppliedEscalations(synced);
    } else {
      setAppliedEscalations(draftEscalations);
    }
    setShowEscalationPanel(false);
  };

  const resetEscalations = () => {
    const resetState = {
      All: { rate: 0, fromM: "01", fromY: "2028", toM: "12", toY: "2032" },
      aeroFringe: { ...defaultEsc },
      nasaFringe: { ...defaultEsc },
      calInt: { ...defaultEsc },
      custOH: { ...defaultEsc },
      columbusOH: { ...defaultEsc },
      subkMH: { ...defaultEsc },
      ga: { ...defaultEsc },
      fee: { ...defaultEsc },
    };
    setDraftEscalations(resetState);
    setAppliedEscalations(resetState);
    setShowEscalationPanel(false);
  };

  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleExpand = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [visibleYears, setVisibleYears] = useState(ALL_YEARS);
  const [laborMetrics, setLaborMetrics] = useState({ hrs: true, amt: true });
  const [globalFee, setGlobalFee] = useState("7.00");

  const [templates, setTemplates] = useState([]);
  const [targetTemplateId, setTargetTemplateId] = useState("");
  const [burdenRates, setBurdenRates] = useState(null);
  const [accountPoolsMap, setAccountPoolsMap] = useState({});

  const formatNum = (n) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n || 0);
  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n || 0);

  // Shared indirect-pool and bifurcation definitions used by the three new views.
  const poolDefinitions = [
    { key: "aeroFringe", flag: "AEROFR", label: "AERO Fringe" },
    { key: "nasaFringe", flag: "NFRNG", label: "NASA/NIH Fringe" },
    // { key: "calInt", flag: "CALINT", label: "California Interest" },
    { key: "custOH", flag: "OVH30", label: "Customer Site OH" },
    { key: "columbusOH", flag: "OVH31", label: "Off-Site OH" },
    { key: "subkMH", flag: "SMH50", label: "Subcontract M&H" },
    { key: "ga", flag: "INTG40", label: "G&A" },
    { key: "fee", flag: "FEE", label: "Fee" },
  ];
  const wrapRatePoolDefinitions = poolDefinitions.filter(
    (pool) => pool.key !== "calInt",
  );
  const bifurcationDefinitions = [
    { key: "FRINGEONOVERHEAD", label: "Fringe on OH" },
    { key: "FRINGEONGNA", label: "Fringe on G&A" },
    { key: "OVERHEADONGNA", label: "OH on G&A" },
    { key: "NFRNG", label: "NFRNG" },
    { key: "INTG40", label: "INTG40" },
    { key: "OVH30", label: "OVH30" },
    { key: "AEROFR", label: "AEROFR" },
    { key: "SMH50", label: "SMH50" },
    { key: "OVH31", label: "OVH31" },
  ];
  const isPoolFlagOn = (value) =>
    value === true ||
    ["Y", "YES", "TRUE", "1"].includes(
      String(value ?? "")
        .trim()
        .toUpperCase(),
    );
  const getAccountPoolFlags = (acctId, orgId) =>
    accountPoolsMap[
      `${String(acctId || "").trim()}-${String(orgId || "").trim()}`
    ] || {};
  const getPoolRateSet = (year) => {
    const rates =
      String(year) === BASE_YEAR
        ? burdenRates?.[BASE_YEAR] || zeroRates
        : escalatedRatesMap?.[String(year)]?.avgRates || zeroRates;
    return {
      aeroFringe: Number(rates.aeroFringe) || 0,
      nasaFringe: Number(rates.nasaFringe) || 0,
      calInt: Number(rates.calInt) || 0,
      custOH: Number(rates.custOH) || 0,
      columbusOH: Number(rates.columbusOH) || 0,
      subkMH: Number(rates.subkMH) || 0,
      ga: Number(rates.ga) || 0,
      fee: Number(rates.fee) || 0,
    };
  };
  const calculatePoolBreakdown = (baseAmount, flags, rates) => {
    const base = Number(baseAmount) || 0;
    const aeroFringe = isPoolFlagOn(flags.AEROFR) ? base * rates.aeroFringe : 0;
    const nasaFringe = isPoolFlagOn(flags.NFRNG) ? base * rates.nasaFringe : 0;
    const totalFringe = aeroFringe + nasaFringe;
    const ohBase = isPoolFlagOn(flags.FRINGEONOVERHEAD)
      ? base + totalFringe
      : base;
    const custOH = isPoolFlagOn(flags.OVH30) ? ohBase * rates.custOH : 0;
    const columbusOH = isPoolFlagOn(flags.OVH31)
      ? ohBase * rates.columbusOH
      : 0;
    const totalOH = custOH + columbusOH;
    const subkMH = isPoolFlagOn(flags.SMH50) ? base * rates.subkMH : 0;
    let gaBase = base + subkMH;
    if (isPoolFlagOn(flags.FRINGEONGNA)) gaBase += totalFringe;
    if (isPoolFlagOn(flags.OVERHEADONGNA)) gaBase += totalOH;
    const ga = isPoolFlagOn(flags.INTG40) ? gaBase * rates.ga : 0;
    // CALINT has a configured rate but no account-level application flag in the supplied mapping.
    const calInt = 0;
    const burdened =
      base +
      aeroFringe +
      nasaFringe +
      custOH +
      columbusOH +
      subkMH +
      ga +
      calInt;
    const fee = burdened * (Number(globalFee) / 100 || 0);
    return {
      aeroFringe,
      nasaFringe,
      calInt,
      custOH,
      columbusOH,
      subkMH,
      ga,
      fee,
      loadedAmount: burdened + fee,
    };
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown size={13} className="ml-1 text-gray-400 inline" />;
    if (sortConfig.direction === "asc")
      return <ArrowUp size={13} className="ml-1 text-green-700 inline" />;
    return <ArrowDown size={13} className="ml-1 text-green-700 inline" />;
  };

  const getTask = useCallback(
    (id) =>
      projectLevel === "All"
        ? id
        : id?.split(".").slice(0, parseInt(projectLevel, 10)).join("."),
    [projectLevel],
  );

  const toggleYear = (year) => {
    setVisibleYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );
  };

  // ==========================================
  // DATA FETCHING
  // ==========================================
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [foreRaw, plcRaw, coaRaw, empRaw, tplRaw, poolMapRaw, vendRaw] =
          await Promise.all([
            // SOURCE: GL Post Detail (replaces GetForecastView)
            fetch(`${backendUrl}/api/ForecastReport/GetGlPostDetail`).then(
              (r) => r.json(),
            ),
            fetch(`${backendUrl}/Project/GetAllPlcs/`).then((r) => r.json()),
            fetch(`${backendUrl}/api/ChartOfAccounts`).then((r) => r.json()),
            fetch(`${backendUrl}/api/ForecastReport/GetAllEmployee`).then((r) =>
              r.json(),
            ),
            fetch(`${backendUrl}/Orgnization/GetAllTemplates`).then((r) =>
              r.json(),
            ),
            fetch(
              `${backendUrl}/Orgnization/GetAccountPools?Year=${BASE_YEAR}`,
            ).then((r) => r.json()),
            fetch(`${backendUrl}/VendorEmployee`)
              .then((r) => r.json())
              .catch(() => []),
          ]);

        const ensureArr = (d) =>
          Array.isArray(d) ? d : d?.data || d?.items || d?.results || [];

        // Normalize GL Post Detail rows into the shape the rest of the page uses.
        //   sIdType === "E"  -> Labor, anything else -> Non-Labor
        //   pdNo             -> month
        //   amt1             -> amount (cost)
        //   hrs1             -> hours
        //   NBBUD records are never used.
        const fore = ensureArr(foreRaw)
          .filter((item) => {
            const type = String(item.plType || item.pl_type || "")
              .trim()
              .toUpperCase();
            const projectId = String(
              item.projId || item.projectId || "",
            ).trim();
            const accountId = String(
              item.acctId ?? item.accountId ?? "",
            ).trim();

            // Only include GL accounts starting with 5, 6, 7, 8, or 9.
            // Excludes accounts starting with 0, 1, 2, 3, or 4.
            const validAccountId = /^[5-9]/.test(accountId);

            const isIndirectProject = INDIRECT_PROJECT_PREFIXES.some((prefix) =>
              projectId.toUpperCase().startsWith(prefix),
            );

            return (
              type !== "NBBUD" &&
              projectId !== "" &&
              validAccountId &&
              (includeIndirectProjects || !isIndirectProject)
            );
          })
          .map((item) => {
            const sIdType = String(item.sIdType ?? item.sidType ?? "")
              .trim()
              .toUpperCase();
            const sid = String(item.id ?? "").trim();
            return {
              ...item,
              sIdType,
              projId: item.projId,
              acctId: item.acctId,
              orgId: item.orgId,
              year: String(item.fyCd ?? ""),
              month: parseInt(item.pdNo, 10) || 1,
              cost: parseFloat(item.amt1) || 0,
              hours: parseFloat(item.hrs1) || 0,
              emplId: sid,
              vendId: sid,
              plc: item.billLabCatCd,
              empName: item.name || "",
            };
          });

        const plc = ensureArr(plcRaw);
        const coa = ensureArr(coaRaw);
        const emp = ensureArr(empRaw);
        // The wrap-rate screen must use active Employee API rates only.
        setActiveEmployeeRecords(
          emp
            .filter(
              (employee) =>
                String(employee.status || "")
                  .trim()
                  .toUpperCase() === "ACT",
            )
            .map((employee) => ({
              ...employee,
              emplId: String(employee.emplId || "").trim(),
              perHourRate: Number.parseFloat(employee.perHourRate) || 0,
              plcCode: String(employee.genl_Lab_Cat_CD || "").trim(),
            }))
            .filter((employee) => employee.emplId),
        );
        const tpls = ensureArr(tplRaw);
        const poolMaps = ensureArr(poolMapRaw);

        setMasterForecast(fore);

        setAccountPoolsMap(
          poolMaps.reduce((acc, curr) => {
            const acct = String(curr.acctId || "").trim();
            const org = String(
              curr.orgId || curr.org_id || curr.org || "",
            ).trim();
            return { ...acc, [`${acct}-${org}`]: curr };
          }, {}),
        );

        setTemplates(tpls);

        const defaultTpl =
          tpls.find(
            (t) => String(t.templateCode).toLowerCase() === "default",
          ) || tpls[0];
        const targetTpl =
          tpls.find((t) =>
            String(t.templateCode).toLowerCase().includes("target"),
          ) ||
          tpls.find((t) => String(t.id) === "2") ||
          tpls[1] ||
          defaultTpl;

        setTargetTemplateId((prev) =>
          prev ? prev : targetTpl ? String(targetTpl.id) : "",
        );

        setPlcMap(
          plc.reduce((acc, curr) => {
            const code = String(curr.laborCategoryCode || "")
              .trim()
              .toUpperCase();
            const id = String(curr.id || curr.plcId || "")
              .trim()
              .toUpperCase();
            const desc = curr.description || curr.name || "Labor Category";
            if (code) acc[code] = desc;
            if (id) acc[id] = desc;
            return acc;
          }, {}),
        );

        setLaborData({
          empMap: emp.reduce(
            (acc, curr) => ({ ...acc, [curr.emplId]: curr.firstName }),
            {},
          ),
        });

        const vend = ensureArr(vendRaw);
        setVendorMap(
          vend.reduce((acc, curr) => {
            const vId = String(curr.vendId || curr.vendEmplId || "")
              .trim()
              .toUpperCase();
            if (vId)
              acc[vId] =
                curr.vendEmplName || `${curr.lastName}, ${curr.firstName}`;
            return acc;
          }, {}),
        );

        setNonLaborData({
          coa: coa.reduce(
            (acc, curr) => ({
              ...acc,
              [String(curr.accountId || curr.acctId).trim()]:
                curr.accountName || curr.acctName,
            }),
            {},
          ),
          coaTypes: coa.reduce(
            (acc, curr) => ({
              ...acc,
              [String(curr.accountId || curr.acctId).trim()]: String(
                curr.accountType || curr.accountTypeName || "",
              ).toUpperCase(),
            }),
            {},
          ),
          coaGroups: coa.reduce(
            (acc, curr) => ({
              ...acc,
              [String(curr.accountId || curr.acctId).trim()]:
                curr.budgetSheet ||
                curr.accountType ||
                curr.accountTypeName ||
                curr.costType ||
                curr.budgetSheet,
            }),
            {},
          ),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Data is loaded once. The project filter is applied client-side
    // when the Search button is clicked.
    fetchData();
  }, [includeIndirectProjects]);

  // ==========================================
  // PROJECT AUTO-SUGGEST (New Business & Projects)
  // Driven by what the user is typing (projectInput). Results are sorted:
  // exact match -> starts-with -> contains, then alphabetically.
  // ==========================================
  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     setIsSearchingProject(true);

  //     try {
  useEffect(() => {
    const fetchProjects = async () => {
      const searchTarget = String(projectInput || "")
        .trim()
        .toUpperCase();

      if (searchTarget.length < 4) {
        setProjectSearchResults([]);
        setIsSearchingProject(false);
        return;
      }

      setIsSearchingProject(true);

      try {
        const searchTarget = String(projectInput || "")
          .trim()
          .toUpperCase();

        // 1. Always fetch and filter New Business (NBBUD)
        // const nbRes = await fetch(`${backendUrl}/GetAllNewBusiness`);
        // const nbData = await nbRes.json();

        // let nbArray = [];
        // if (Array.isArray(nbData)) nbArray = nbData;
        // else if (nbData && typeof nbData === "object")
        //   nbArray =
        //     nbData.results ||
        //     nbData.data ||
        //     nbData.items ||
        //     (nbData.businessBudgetId ? [nbData] : []);

        // const mappedNbArray = nbArray.map((nb) => ({
        //   ...nb,
        //   projectId: nb.businessBudgetId,
        //   name: nb.description || "New Business",
        //   burdenTemplateId: nb.burdenTemplateId,
        //   customer: nb.customer,
        //   contractTypes: nb.contractTypes,
        //   startDate: nb.startDate,
        //   endDate: nb.endDate,
        // }));

        // let filteredResults = mappedNbArray.filter((proj) => {
        //   const projId = String(proj.projectId).trim().toUpperCase();
        //   return searchTarget === "" || projId.includes(searchTarget);
        // });
        let filteredResults = [];
        // Fetch projects for Level 1 as well as Level 2 searches.
        if (searchTarget.length >= 1) {
          const projRes = await fetch(
            `${backendUrl}/Project/GetAllProjectsForSearchV3?UserId=4&Role=ADMIN&type=PROJECT&ProjId=${encodeURIComponent(searchTarget)}&take=100`,
          );
          const projData = await projRes.json();

          let projArray = [];
          if (Array.isArray(projData)) projArray = projData;
          else if (projData && typeof projData === "object") {
            projArray =
              projData.results || projData.data || projData.items || [];
          }

          const mappedProjArray = projArray
            .map((p) => ({
              ...p,
              projectId: p.projectId || p.projId,
              name: p.name || p.projectName || p.description || "",
              type: p.type || "",
            }))
            .filter((p) => {
              const projectId = String(p.projectId || "").trim();

              // Keep Level 1 and Level 2 projects; exclude deeper task levels.
              const projectDepth = projectId.split(".").filter(Boolean).length;
              if (projectDepth < 1 || projectDepth > 2) {
                return false;
              }

              // When Include Indirect Project is OFF,
              // exclude projects whose API type is INDIRECT
              if (
                !includeIndirectProjects &&
                String(p.type || "")
                  .trim()
                  .toUpperCase() === "INDIRECT"
              ) {
                return false;
              }

              return true;
            });
          // Merge both sources and deduplicate by projectId
          // const allResults = [...filteredResults, ...mappedProjArray];
          // const uniqueMap = new Map();

          // allResults.forEach((item) => {
          //   if (item.projectId && !uniqueMap.has(item.projectId)) {
          //     uniqueMap.set(item.projectId, item);
          //   }
          // });

          // filteredResults = Array.from(uniqueMap.values());
          const uniqueMap = new Map();

          mappedProjArray.forEach((item) => {
            if (item.projectId && !uniqueMap.has(item.projectId)) {
              uniqueMap.set(item.projectId, item);
            }
          });

          filteredResults = Array.from(uniqueMap.values());
        }

        // 3. Sort: exact -> starts-with -> contains -> alphabetical
        const rank = (proj) => {
          const id = String(proj.projectId || "")
            .trim()
            .toUpperCase();
          if (searchTarget === "") return 3;
          if (id === searchTarget) return 0;
          if (id.startsWith(searchTarget)) return 1;
          if (id.includes(searchTarget)) return 2;
          return 3;
        };
        filteredResults.sort((a, b) => {
          const ra = rank(a);
          const rb = rank(b);
          if (ra !== rb) return ra - rb;
          return String(a.projectId).localeCompare(
            String(b.projectId),
            undefined,
            { numeric: true, sensitivity: "base" },
          );
        });

        setProjectSearchResults(filteredResults);
      } catch (error) {
        console.error("Error fetching projects", error);
        setProjectSearchResults([]);
      } finally {
        setIsSearchingProject(false);
      }
    };

    const timeoutId = setTimeout(fetchProjects, 300);
    return () => clearTimeout(timeoutId);
  }, [projectInput, includeIndirectProjects]);

  // ==========================================
  // AUTO-SET BURDEN TEMPLATE FROM PROJECT
  // ==========================================
  useEffect(() => {
    if (selectedProject && projectSearchResults.length > 0) {
      const proj = projectSearchResults.find(
        (p) => p.projectId === selectedProject,
      );
      if (proj && proj.burdenTemplateId) {
        setTargetTemplateId(String(proj.burdenTemplateId));
      }
    }
  }, [selectedProject, projectSearchResults]);

  // ==========================================
  // CONCURRENT BATCH POOL RATES FETCH
  // ==========================================
  useEffect(() => {
    const fetchPools = async () => {
      if (!targetTemplateId) return;

      try {
        const allYears = [BASE_YEAR, ...OPTION_YEARS];
        const poolToStateKey = {
          AEROFR: "aeroFringe",
          NFRNG: "nasaFringe",
          CALINT: "calInt",
          OVH30: "custOH",
          OVH31: "columbusOH",
          SMH50: "subkMH",
          INTG40: "ga",
          FEE: "fee",
        };

        const newRates = {};
        allYears.forEach((y) => (newRates[y] = { ...zeroRates }));

        const fetchPromises = allYears.map((year) =>
          fetch(
            `${backendUrl}/Orgnization/GetRatesByPoolsTemplateId?templateId=${targetTemplateId}&year=${year}`,
          )
            .then((r) => r.json())
            .then((data) => ({ year, data }))
            .catch(() => ({ year, data: null })),
        );

        const rateResults = await Promise.all(fetchPromises);

        rateResults.forEach(({ year, data }) => {
          if (data) {
            const rateList = Array.isArray(data)
              ? data
              : data.data || data.items || data.results || [data];
            rateList.forEach((poolData) => {
              if (!poolData) return;
              const poolId =
                poolData.poolId || poolData.poolCode || poolData.pool;
              const stateKey = poolToStateKey[poolId];
              if (stateKey) {
                const rawVal =
                  poolData.targetRate ??
                  poolData.escalationPercent ??
                  poolData.rate ??
                  0;
                newRates[year][stateKey] = parseFloat(rawVal) / 100;
              }
            });
          }
        });

        allYears.forEach((y) => {
          if (!newRates[y].fee && newRates[y].fee !== 0) newRates[y].fee = 0;
        });

        setBurdenRates(newRates);
      } catch (e) {
        console.error("Error in fetchPools chain:", e);
      }
    };

    fetchPools();
  }, [targetTemplateId]);

  // ==========================================
  // EXACT ABSOLUTE-MONTH ESCALATION MAP
  // ==========================================
  const escalatedRatesMap = useMemo(() => {
    const ratesMap = {};

    const getPoolData = (poolKey, yearStr) => {
      const config = appliedEscalations[poolKey];
      const rateVal = parseFloat(config.rate) / 100 || 0;
      const fromY = parseInt(config.fromY);
      const fromM = parseInt(config.fromM);
      const toY = parseInt(config.toY);
      const toM = parseInt(config.toM);
      const y = parseInt(yearStr);

      const base =
        burdenRates?.[yearStr]?.[poolKey] ??
        burdenRates?.[BASE_YEAR]?.[poolKey] ??
        0;

      let sum = 0;
      let escRate = base;
      let escMonth = null;

      for (let m = 1; m <= 12; m++) {
        const currentAbsoluteMonth = y * 12 + m;
        const fromAbsoluteMonth = fromY * 12 + fromM;
        const toAbsoluteMonth = toY * 12 + toM;

        const isActive =
          currentAbsoluteMonth >= fromAbsoluteMonth &&
          currentAbsoluteMonth <= toAbsoluteMonth;
        const mRate = isActive ? base * (1 + rateVal) : base;

        sum += mRate;

        if (isActive && escMonth === null) {
          escMonth = m;
          escRate = mRate;
        }
      }

      return {
        avgRate: sum / 12,
        escRate: rateVal > 0 ? escRate : base,
        escMonthLabel: rateVal > 0 && escMonth ? months[escMonth - 1] : "-",
      };
    };

    OPTION_YEARS.forEach((yStr) => {
      ratesMap[yStr] = {
        avgRates: {
          aeroFringe: getPoolData("aeroFringe", yStr).avgRate,
          nasaFringe: getPoolData("nasaFringe", yStr).avgRate,
          calInt: getPoolData("calInt", yStr).avgRate,
          custOH: getPoolData("custOH", yStr).avgRate,
          columbusOH: getPoolData("columbusOH", yStr).avgRate,
          subkMH: getPoolData("subkMH", yStr).avgRate,
          ga: getPoolData("ga", yStr).avgRate,
          fee: getPoolData("fee", yStr).avgRate,
        },
        display: {
          aeroFringe: getPoolData("aeroFringe", yStr),
          nasaFringe: getPoolData("nasaFringe", yStr),
          calInt: getPoolData("calInt", yStr),
          custOH: getPoolData("custOH", yStr),
          columbusOH: getPoolData("columbusOH", yStr),
          subkMH: getPoolData("subkMH", yStr),
          ga: getPoolData("ga", yStr),
          fee: getPoolData("fee", yStr),
        },
        monthly: {
          aeroFringe: Array(12).fill(0),
          nasaFringe: Array(12).fill(0),
          calInt: Array(12).fill(0),
          custOH: Array(12).fill(0),
          columbusOH: Array(12).fill(0),
          subkMH: Array(12).fill(0),
          ga: Array(12).fill(0),
          fee: Array(12).fill(0),
        },
      };

      const rebuildMonthly = (poolKey) => {
        const config = appliedEscalations[poolKey];
        const rateVal = parseFloat(config.rate) / 100 || 0;
        const fromY = parseInt(config.fromY);
        const fromM = parseInt(config.fromM);
        const toY = parseInt(config.toY);
        const toM = parseInt(config.toM);
        const y = parseInt(yStr);
        const base =
          burdenRates?.[yStr]?.[poolKey] ??
          burdenRates?.[BASE_YEAR]?.[poolKey] ??
          0;
        let arr = [];

        for (let m = 1; m <= 12; m++) {
          const currentAbsoluteMonth = y * 12 + m;
          const fromAbsoluteMonth = fromY * 12 + fromM;
          const toAbsoluteMonth = toY * 12 + toM;

          const isActive =
            currentAbsoluteMonth >= fromAbsoluteMonth &&
            currentAbsoluteMonth <= toAbsoluteMonth;
          arr.push(isActive ? base * (1 + rateVal) : base);
        }
        return arr;
      };

      ratesMap[yStr].monthly = {
        aeroFringe: rebuildMonthly("aeroFringe"),
        nasaFringe: rebuildMonthly("nasaFringe"),
        calInt: rebuildMonthly("calInt"),
        custOH: rebuildMonthly("custOH"),
        columbusOH: rebuildMonthly("columbusOH"),
        subkMH: rebuildMonthly("subkMH"),
        ga: rebuildMonthly("ga"),
        fee: rebuildMonthly("fee"),
      };
    });
    return ratesMap;
  }, [appliedEscalations, burdenRates]);

  // ==========================================
  // FILTERED DATA ENGINE
  // Labor = sIdType "E", everything else = Non-Labor.
  // Project filter only applies after Search is clicked.
  // ==========================================
  const { validLabor, validNonLabor } = useMemo(() => {
    if (!masterForecast) return { validLabor: [], validNonLabor: [] };

    const vLab = [];
    const vNonLab = [];
    const target = String(selectedProject || "")
      .trim()
      .toUpperCase();

    masterForecast.forEach((item) => {
      const id = String(item.projId || item.projectId || "")
        .trim()
        .toUpperCase();

      if (target === "" || id.startsWith(target)) {
        if (item.sIdType === "E") vLab.push(item);
        else vNonLab.push(item);
      }
    });
    return { validLabor: vLab, validNonLabor: vNonLab };
  }, [masterForecast, selectedProject]);

  const getAccountType = useCallback(
    (acctId) => {
      const key = String(acctId || "").trim();
      return formatDisplayType(
        nonLaborData.coaGroups[key] || nonLaborData.coaTypes[key] || "Unknown",
      );
    },
    [nonLaborData.coaGroups, nonLaborData.coaTypes],
  );

  // ==========================================
  // MASTER TABLE DATA SEPARATION
  // ==========================================

  // 1. Elements Summary Data
  const elementsSummaryData = useMemo(() => {
    if (!masterForecast || masterForecast.length === 0) return null;
    const summary = {
      directCosts: {},
      burdens: {
        aeroFringe: {
          name: "AERO Fringe",
          base: 0,
          opts: Array(OPTION_YEARS.length).fill(0),
        },
        nasaFringe: {
          name: "NASA/NIH Fringe",
          base: 0,
          opts: Array(OPTION_YEARS.length).fill(0),
        },
        custOH: {
          name: "Customer Site OH",
          base: 0,
          opts: Array(OPTION_YEARS.length).fill(0),
        },
        columbusOH: {
          name: "Off - Site OH",
          base: 0,
          opts: Array(OPTION_YEARS.length).fill(0),
        },
        subkMH: {
          name: "Subk M&H",
          base: 0,
          opts: Array(OPTION_YEARS.length).fill(0),
        },
        ga: { name: "G&A", base: 0, opts: Array(OPTION_YEARS.length).fill(0) },
      },
    };

    const baseRatesMock = {
      monthly: {
        aeroFringe: Array(12).fill(burdenRates?.[BASE_YEAR]?.aeroFringe || 0),
        nasaFringe: Array(12).fill(burdenRates?.[BASE_YEAR]?.nasaFringe || 0),
        calInt: Array(12).fill(burdenRates?.[BASE_YEAR]?.calInt || 0),
        custOH: Array(12).fill(burdenRates?.[BASE_YEAR]?.custOH || 0),
        columbusOH: Array(12).fill(burdenRates?.[BASE_YEAR]?.columbusOH || 0),
        subkMH: Array(12).fill(burdenRates?.[BASE_YEAR]?.subkMH || 0),
        ga: Array(12).fill(burdenRates?.[BASE_YEAR]?.ga || 0),
        fee: Array(12).fill(0),
      },
    };

    const processSummaryItem = (cost, acctId, orgId, yearStr, monthIdx) => {
      if (!cost || cost === 0) return;
      const type = getAccountType(acctId) || "Other Direct Cost";

      if (!summary.directCosts[type]) {
        summary.directCosts[type] = {
          name: type,
          base: 0,
          opts: Array(OPTION_YEARS.length).fill(0),
        };
      }

      const isBase = yearStr === BASE_YEAR;
      const optIdx = OPTION_YEARS.indexOf(yearStr);
      if (!isBase && optIdx === -1) return;

      const yrRates = isBase ? baseRatesMock : escalatedRatesMap[yearStr];
      const mIdx = monthIdx >= 0 && monthIdx < 12 ? monthIdx : 0;
      const flags = accountPoolsMap[`${acctId}-${orgId}`] || {};

      const getSafeRate = (pool) => {
        if (
          yrRates &&
          yrRates.monthly &&
          typeof yrRates.monthly[pool]?.[mIdx] === "number"
        ) {
          return yrRates.monthly[pool][mIdx];
        }
        return 0;
      };

      const aeroFringe = flags.AEROFR ? cost * getSafeRate("aeroFringe") : 0;
      const nasaFringe = flags.NFRNG ? cost * getSafeRate("nasaFringe") : 0;
      const totalFringe = aeroFringe + nasaFringe;

      const ohBase = flags.FRINGEONOVERHEAD ? cost + totalFringe : cost;
      const custOH = flags.OVH30 ? ohBase * getSafeRate("custOH") : 0;
      const columbusOH = flags.OVH31 ? ohBase * getSafeRate("columbusOH") : 0;
      const totalOH = custOH + columbusOH;

      const subkMH = flags.SMH50 ? cost * getSafeRate("subkMH") : 0;

      let gaBase = cost + subkMH;
      if (flags.FRINGEONGNA) gaBase += totalFringe;
      if (flags.OVERHEADONGNA) gaBase += totalOH;
      const ga = flags.INTG40 ? gaBase * getSafeRate("ga") : 0;

      if (isBase) {
        summary.directCosts[type].base += cost;
        summary.burdens.aeroFringe.base += aeroFringe;
        summary.burdens.nasaFringe.base += nasaFringe;
        summary.burdens.custOH.base += custOH;
        summary.burdens.columbusOH.base += columbusOH;
        summary.burdens.subkMH.base += subkMH;
        summary.burdens.ga.base += ga;
      } else {
        summary.directCosts[type].opts[optIdx] += cost;
        summary.burdens.aeroFringe.opts[optIdx] += aeroFringe;
        summary.burdens.nasaFringe.opts[optIdx] += nasaFringe;
        summary.burdens.custOH.opts[optIdx] += custOH;
        summary.burdens.columbusOH.opts[optIdx] += columbusOH;
        summary.burdens.subkMH.opts[optIdx] += subkMH;
        summary.burdens.ga.opts[optIdx] += ga;
      }
    };

    validLabor.forEach((i) =>
      processSummaryItem(
        parseFloat(i.cost || 0),
        String(i.acctId || i.accountId || "").trim(),
        String(i.orgId || i.org || "").trim(),
        String(i.year || i.fyCd || i.fy || ""),
        (parseInt(i.month || i.pd_no || i.period) || 1) - 1,
      ),
    );
    validNonLabor.forEach((i) =>
      processSummaryItem(
        parseFloat(i.cost || 0),
        String(i.acctId || i.accountId || "").trim(),
        String(i.orgId || i.org || "").trim(),
        String(i.year || i.fyCd || i.fy || ""),
        (parseInt(i.month || i.pd_no || i.period) || 1) - 1,
      ),
    );

    return summary;
  }, [
    masterForecast,
    validLabor,
    validNonLabor,
    escalatedRatesMap,
    burdenRates,
    accountPoolsMap,
    getAccountType,
  ]);

  // 2. Category Table Data (Also powers Dashboard and Proposal Package totals)
  const categoryTableData = useMemo(() => {
    if (!masterForecast || masterForecast.length === 0) return [];
    const agg = {};

    const baseRatesMock = {
      monthly: {
        aeroFringe: Array(12).fill(burdenRates?.[BASE_YEAR]?.aeroFringe || 0),
        nasaFringe: Array(12).fill(burdenRates?.[BASE_YEAR]?.nasaFringe || 0),
        calInt: Array(12).fill(burdenRates?.[BASE_YEAR]?.calInt || 0),
        custOH: Array(12).fill(burdenRates?.[BASE_YEAR]?.custOH || 0),
        columbusOH: Array(12).fill(burdenRates?.[BASE_YEAR]?.columbusOH || 0),
        subkMH: Array(12).fill(burdenRates?.[BASE_YEAR]?.subkMH || 0),
        ga: Array(12).fill(burdenRates?.[BASE_YEAR]?.ga || 0),
        fee: Array(12).fill(0),
      },
    };

    const calcAnnualBurden = (
      monthlyCosts,
      monthlyHrs,
      yearRatesData,
      acctId,
      orgId,
    ) => {
      let total = {
        cost: 0,
        hrs: 0,
        aeroFringe: 0,
        nasaFringe: 0,
        custOH: 0,
        columbusOH: 0,
        subkMH: 0,
        ga: 0,
        fee: 0,
        totalBurdenedCost: 0,
        price: 0,
      };
      const flags = accountPoolsMap[`${acctId}-${orgId}`] || {};

      const getRate = (pool, mIdx) => {
        if (
          yearRatesData &&
          yearRatesData.monthly &&
          typeof yearRatesData.monthly[pool]?.[mIdx] === "number"
        ) {
          return yearRatesData.monthly[pool][mIdx];
        }
        return 0;
      };

      for (let m = 0; m < 12; m++) {
        const c = monthlyCosts[m] || 0;
        const h = monthlyHrs[m] || 0;
        if (c === 0 && h === 0) continue;

        const aF = flags.AEROFR ? c * getRate("aeroFringe", m) : 0;
        const nF = flags.NFRNG ? c * getRate("nasaFringe", m) : 0;
        const tF = aF + nF;
        const ohBase = flags.FRINGEONOVERHEAD ? c + tF : c;
        const cuO = flags.OVH30 ? ohBase * getRate("custOH", m) : 0;
        const coO = flags.OVH31 ? ohBase * getRate("columbusOH", m) : 0;
        const tOH = cuO + coO;
        const sM = flags.SMH50 ? c * getRate("subkMH", m) : 0;

        let gaBase = c + sM;
        if (flags.FRINGEONGNA) gaBase += tF;
        if (flags.OVERHEADONGNA) gaBase += tOH;
        const ga = flags.INTG40 ? gaBase * getRate("ga", m) : 0;

        const totalBurdenedCost = c + tF + tOH + sM + ga;
        const fee = totalBurdenedCost * (parseFloat(globalFee) / 100 || 0);
        const price = totalBurdenedCost + fee;

        total.cost += c;
        total.hrs += h;
        total.aeroFringe += aF;
        total.nasaFringe += nF;
        total.custOH += cuO;
        total.columbusOH += coO;
        total.subkMH += sM;
        total.ga += ga;
        total.fee += fee;
        total.totalBurdenedCost += totalBurdenedCost;
        total.price += price;
      }
      total.rate = total.hrs > 0 ? total.price / total.hrs : 0;
      return total;
    };

    const emptyMonthly = () => Array(12).fill(0);
    const emptyYearBucket = () => ({
      mCost: emptyMonthly(),
      mHrs: emptyMonthly(),
    });

    validLabor.forEach((i) => {
      const task = getTask(i.projId || i.projectId);
      const plcKey = String(
        i.plc || i.billLabCatCd || i.laborCategoryCode || "",
      )
        .trim()
        .toUpperCase();
      const acctKey = String(i.acctId || "").trim();
      const orgKey = String(i.orgId || i.org || "").trim();
      const cat = formatDisplayType(plcMap[plcKey] || "Labor");
      const key = `${task}-LABOR-${cat}-${acctKey}-${orgKey}`;

      if (!agg[key])
        agg[key] = {
          id: key,
          topLevel: task ? task.split(".")[0] : "",
          orgId: orgKey,
          isLabor: true,
          task,
          type: getAccountType(i.acctId) || "Direct Labor",
          cat,
          acctId: acctKey,
          base: { mCost: emptyMonthly(), mHrs: emptyMonthly() },
          opts: Array(OPTION_YEARS.length)
            .fill(null)
            .map(() => ({ mCost: emptyMonthly(), mHrs: emptyMonthly() })),
          subItems: {},
        };

      const yearStr = String(i.year || i.fyCd || i.fy);
      const yIndex = OPTION_YEARS.indexOf(yearStr);
      const isBase = yearStr === BASE_YEAR;
      const mIdx =
        (parseInt(i.month || i.period || i.pdNo || i.pd_no) || 1) - 1;

      if ((isBase || yIndex > -1) && mIdx >= 0 && mIdx < 12) {
        const a = parseFloat(i.cost || 0);
        const h = parseFloat(i.hours || i.forecastedHours || 0);
        const target = isBase ? agg[key].base : agg[key].opts[yIndex];

        target.mCost[mIdx] += a;
        target.mHrs[mIdx] += h;

        const empName = formatDisplayType(
          i.empName || laborData.empMap[i.emplId] || "TBD",
        );
        const empKey = `${i.emplId}-${empName}`;
        if (!agg[key].subItems[empKey])
          agg[key].subItems[empKey] = {
            name: empName,
            emplId: i.emplId,
            rate: parseFloat(i.hrly_rate || i.rate || i.perHourRate || 0),
            base: { mCost: emptyMonthly(), mHrs: emptyMonthly() },
            opts: Array(OPTION_YEARS.length)
              .fill(null)
              .map(() => ({ mCost: emptyMonthly(), mHrs: emptyMonthly() })),
            rateItems: {},
          };

        const subObj = agg[key].subItems[empKey];
        const subTarget = isBase ? subObj.base : subObj.opts[yIndex];
        subTarget.mCost[mIdx] += a;
        subTarget.mHrs[mIdx] += h;

        // Hourly-rate breakdown for the same employee
        // (a different rate in e.g. Mar-May creates its own line)
        const recRate = h > 0 ? Math.round((a / h) * 100) / 100 : 0;
        const rKey = recRate.toFixed(2);
        if (!subObj.rateItems[rKey])
          subObj.rateItems[rKey] = {
            rate: recRate,
            months: new Set(),
            base: emptyYearBucket(),
            opts: Array(OPTION_YEARS.length)
              .fill(null)
              .map(() => emptyYearBucket()),
          };
        const rateObj = subObj.rateItems[rKey];
        const rateTarget = isBase ? rateObj.base : rateObj.opts[yIndex];
        rateTarget.mCost[mIdx] += a;
        rateTarget.mHrs[mIdx] += h;
        rateObj.months.add(parseInt(yearStr, 10) * 12 + mIdx);
      }
    });

    validNonLabor.forEach((i) => {
      const task = getTask(i.projId);
      const acctKey = String(i.acctId || "").trim();
      const orgKey = String(i.orgId || i.org || "").trim();
      const vendId = String(i.vendId || i.vendorId || i.emplId || "")
        .trim()
        .toUpperCase();
      const vName = vendorMap[vendId] || i.empName || "";
      const cat = formatDisplayType(
        nonLaborData.coa[acctKey] || i.acctName || "Expense",
      );
      const key = `${task}-NONLABOR-${cat}-${acctKey}-${orgKey}-${vendId}`;

      if (!agg[key])
        agg[key] = {
          id: key,
          topLevel: task ? task.split(".")[0] : "",
          orgId: orgKey,
          isLabor: false,
          task,
          type: getAccountType(i.acctId),
          cat,
          vendorName: vName,
          acctId: acctKey,
          name: formatDisplayType(
            nonLaborData.coa[acctKey] || i.acctName || "Expense",
          ),
          base: { mCost: emptyMonthly(), mHrs: emptyMonthly() },
          opts: Array(OPTION_YEARS.length)
            .fill(null)
            .map(() => ({ mCost: emptyMonthly(), mHrs: emptyMonthly() })),
        };

      const yIndex = OPTION_YEARS.indexOf(String(i.year || i.fyCd || i.fy));
      const isBase = String(i.year || i.fyCd || i.fy) === BASE_YEAR;
      const mIdx =
        (parseInt(i.month || i.period || i.pdNo || i.pd_no) || 1) - 1;

      if ((isBase || yIndex > -1) && mIdx >= 0 && mIdx < 12) {
        const target = isBase ? agg[key].base : agg[key].opts[yIndex];
        target.mCost[mIdx] += parseFloat(i.cost || 0);
      }
    });

    return Object.values(agg).map((r) => ({
      ...r,
      base: calcAnnualBurden(
        r.base.mCost,
        r.base.mHrs,
        baseRatesMock,
        r.acctId,
        r.orgId,
      ),
      opts: r.opts.map((opt, idx) =>
        calcAnnualBurden(
          opt.mCost,
          opt.mHrs,
          escalatedRatesMap[OPTION_YEARS[idx]],
          r.acctId,
          r.orgId,
        ),
      ),
      subItems: r.isLabor
        ? Object.values(r.subItems)
            .map((sub) => ({
              ...sub,
              base: calcAnnualBurden(
                sub.base.mCost,
                sub.base.mHrs,
                baseRatesMock,
                r.acctId,
                r.orgId,
              ),
              opts: sub.opts.map((opt, idx) =>
                calcAnnualBurden(
                  opt.mCost,
                  opt.mHrs,
                  escalatedRatesMap[OPTION_YEARS[idx]],
                  r.acctId,
                  r.orgId,
                ),
              ),
              rateItems: Object.values(sub.rateItems).map((ri) => ({
                rate: ri.rate,
                months: [...ri.months],
                base: calcAnnualBurden(
                  ri.base.mCost,
                  ri.base.mHrs,
                  baseRatesMock,
                  r.acctId,
                  r.orgId,
                ),
                opts: ri.opts.map((opt, idx) =>
                  calcAnnualBurden(
                    opt.mCost,
                    opt.mHrs,
                    escalatedRatesMap[OPTION_YEARS[idx]],
                    r.acctId,
                    r.orgId,
                  ),
                ),
              })),
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        : [],
    }));
  }, [
    masterForecast,
    validLabor,
    validNonLabor,
    escalatedRatesMap,
    burdenRates,
    accountPoolsMap,
    globalFee,
    getTask,
    getAccountType,
    plcMap,
    laborData.empMap,
    nonLaborData.coa,
    vendorMap,
  ]);

  // 2b. Performance By Employee (employee-level rows + per-hourly-rate breakdown)
  const laborPerformanceData = useMemo(() => {
    if (!Array.isArray(categoryTableData)) return [];

    const numKeys = [
      "cost",
      "hrs",
      "aeroFringe",
      "nasaFringe",
      "custOH",
      "columbusOH",
      "subkMH",
      "ga",
      "fee",
      "totalBurdenedCost",
      "price",
    ];
    const emptyY = () => numKeys.reduce((a, k) => ({ ...a, [k]: 0 }), {});
    const addY = (t, s) => {
      if (!s) return;
      numKeys.forEach((k) => {
        t[k] += s[k] || 0;
      });
    };

    const agg = {};
    categoryTableData.forEach((row) => {
      if (!row.isLabor || !row.subItems) return;
      row.subItems.forEach((sub) => {
        const key = `${row.task}-${row.type}-${sub.emplId}-${sub.name}`;
        if (!agg[key]) {
          agg[key] = {
            id: key,
            topLevel: row.task ? row.task.split(".")[0] : "",
            task: row.task,
            type: row.type,
            cat: sub.name, // shown in the 4th sticky column (Employee)
            emplId: sub.emplId,
            base: emptyY(),
            opts: OPTION_YEARS.map(() => emptyY()),
            rateRows: {},
          };
        }
        addY(agg[key].base, sub.base);
        sub.opts.forEach((o, i) => addY(agg[key].opts[i], o));

        // Merge hourly-rate lines for this employee
        (sub.rateItems || []).forEach((ri) => {
          const rk = ri.rate.toFixed(2);
          if (!agg[key].rateRows[rk]) {
            agg[key].rateRows[rk] = {
              rate: ri.rate,
              months: new Set(),
              base: emptyY(),
              opts: OPTION_YEARS.map(() => emptyY()),
            };
          }
          const rr = agg[key].rateRows[rk];
          ri.months.forEach((m) => rr.months.add(m));
          addY(rr.base, ri.base);
          ri.opts.forEach((o, i) => addY(rr.opts[i], o));
        });
      });
    });

    const finalizeRate = (y) => {
      y.rate = y.hrs > 0 ? y.price / y.hrs : 0;
      // Employee-level Wrap Rate = Total Burdened Cost / Total Unburdened Cost.
      y.wrapRate = y.cost > 0 ? y.totalBurdenedCost / y.cost : 0;
      return y;
    };

    return Object.values(agg)
      .map((r) => ({
        ...r,
        base: finalizeRate(r.base),
        opts: r.opts.map(finalizeRate),
        rateRows: Object.values(r.rateRows)
          .map((rr) => ({
            ...rr,
            months: [...rr.months].sort((a, b) => a - b),
            base: finalizeRate(rr.base),
            opts: rr.opts.map(finalizeRate),
          }))
          .sort(
            (a, b) =>
              (a.months[0] ?? Infinity) - (b.months[0] ?? Infinity) ||
              a.rate - b.rate,
          ),
      }))
      .sort(
        (a, b) =>
          String(a.task).localeCompare(String(b.task)) ||
          String(a.cat).localeCompare(String(b.cat)),
      );
  }, [categoryTableData]);

  // Employee Wrap Rate uses Employee API hourly rates as the unburdened base.
  // Forecast rows are used only to resolve project/PLC and account-pool applicability;
  // the GL cost/hourly amount is never used as the employee's base pay rate.
  // const employeeWrapRateData = useMemo(() => {
  //   const employeeById = new Map((activeEmployeeRecords || []).map((e) => [String(e.emplId || "").trim(), e]));
  //   const candidates = new Map();
  //   (validLabor || []).forEach((record) => {
  //     const id = String(record.emplId || record.sid || record.employeeId || "").trim();
  //     const employee = employeeById.get(id);
  //     if (!employee) return;
  //     const project = String(record.projId || record.projectId || "-").trim() || "-";
  //     const plcCode = String(record.plc || record.billLabCatCd || record.laborCategoryCode || employee.plcCode || "").trim();
  //     const acctId = String(record.acctId || record.accountId || "").trim();
  //     const orgId = String(record.orgId || record.org || "").trim();
  //     const key = `${id}|${project}|${plcCode}|${acctId}|${orgId}`;
  //     if (!candidates.has(key)) candidates.set(key, { employee, project, plcCode, acctId, orgId });
  //   });
  //   if (!candidates.size) {
  //     (activeEmployeeRecords || []).forEach((employee) => {
  //       const id = String(employee.emplId || "").trim();
  //       if (id) candidates.set(`${id}|-|-||`, { employee, project: "-", plcCode: employee.plcCode || "", acctId: "", orgId: "" });
  //     });
  //   }
  //   return [...candidates.values()].map(({ employee, project, plcCode, acctId, orgId }) => {
  //     const hourlyRate = Number(employee.perHourRate) || 0;
  //     const hours = Math.max(0, Number(standardHours) || 0);
  //     const baseAmount = hourlyRate * hours;
  //     const flags = getAccountPoolFlags(acctId, orgId);
  //     const years = ALL_YEARS.map((year) => {
  //       const rates = getPoolRateSet(year);
  //       const wrapRates = { ...rates, calInt: 0 };
  //       const pools = calculatePoolBreakdown(baseAmount, flags, wrapRates);
  //       const loadedHourlyRate = hours > 0 ? pools.loadedAmount / hours : 0;
  //       return { year, rates, pools, loadedHourlyRate, loadedAmount: pools.loadedAmount, wrapRate: hourlyRate > 0 ? loadedHourlyRate / hourlyRate : 0 };
  //     });
  //     return {
  //       id: `${employee.emplId}-${project}-${plcCode}-${acctId}-${orgId}`,
  //       employee: employee.firstName || employee.employeeName || employee.name || employee.emplId || "Unassigned",
  //       emplId: String(employee.emplId || ""), project, plc: plcMap[plcCode.toUpperCase()] || plcCode || "-", plcCode, acctId, orgId,
  //       hourlyRate, standardHours: hours, baseAmount, flags, years,
  //     };
  //   }).sort((a, b) => String(a.employee).localeCompare(String(b.employee), undefined, { sensitivity: "base" }) || String(a.project).localeCompare(String(b.project), undefined, { numeric: true }) || String(a.plc).localeCompare(String(b.plc), undefined, { numeric: true }));
  // }, [activeEmployeeRecords, standardHours, plcMap, validLabor, accountPoolsMap, burdenRates, escalatedRatesMap, globalFee]);

  const employeeWrapRateData = useMemo(() => {
    const hours = Math.max(0, Number(standardHours) || 0);

    // Forecast rows are used only to find the acct/org that drives pool flags,
    // and to respect the project filter (first record per employee wins).
    const poolSource = new Map();
    (validLabor || []).forEach((record) => {
      const id = String(record.emplId || "").trim();
      if (!id || poolSource.has(id)) return;
      poolSource.set(id, {
        acctId: String(record.acctId || record.accountId || "").trim(),
        orgId: String(record.orgId || record.org || "").trim(),
      });
    });

    // activeEmployeeRecords is already status === "ACT" only, perHourRate parsed
    const employees = poolSource.size
      ? activeEmployeeRecords.filter((e) => poolSource.has(e.emplId))
      : activeEmployeeRecords;

    return employees
      .map((employee) => {
        const src = poolSource.get(employee.emplId) || {
          acctId: "",
          orgId: "",
        };
        const hourlyRate = Number(employee.perHourRate) || 0;
        const baseAmount = hourlyRate * hours;
        const flags = getAccountPoolFlags(src.acctId, src.orgId);

        const years = ALL_YEARS.map((year) => {
          const rates = { ...getPoolRateSet(year), calInt: 0 };
          const pools = calculatePoolBreakdown(baseAmount, flags, rates);
          const fee = pools.fee;
          const totalBurdenedCost = pools.loadedAmount - fee; // loadedAmount includes fee, so remove it
          const loadedLaborRate =
            hours > 0 ? (totalBurdenedCost + fee) / hours : 0;
          return {
            year,
            rates,
            pools,
            fee,
            totalBurdenedCost,
            loadedAmount: pools.loadedAmount,
            loadedLaborRate,
            wrapRate: baseAmount > 0 ? totalBurdenedCost / baseAmount : 0,
          };
        });

        return {
          id: employee.emplId,
          employee: employee.firstName || employee.emplId || "Unassigned",
          emplId: employee.emplId,
          hourlyRate,
          standardHours: hours,
          baseAmount,
          flags,
          years,
        };
      })
      .sort((a, b) =>
        String(a.employee).localeCompare(String(b.employee), undefined, {
          sensitivity: "base",
        }),
      );
  }, [
    activeEmployeeRecords,
    standardHours,
    validLabor,
    accountPoolsMap,
    burdenRates,
    escalatedRatesMap,
    globalFee,
  ]);

  // Use the highest period number (PDNO) in the relevant selected-project/year data.
  const burnPeriodCount = useMemo(() => {
    const rows = (masterForecast || []).filter((row) => {
      const year = String(row.year || row.fyCd || row.fy || "");
      const project = String(row.projId || row.projectId || "").trim();
      return (
        visibleYears.includes(year) &&
        (!selectedProject ||
          project === selectedProject ||
          project.startsWith(`${selectedProject}.`))
      );
    });
    const maxPdNo = rows.reduce((max, row) => {
      const pdNo = Number.parseInt(
        row.pdNo ?? row.month ?? row.period ?? row.pd_no,
        10,
      );
      return Number.isFinite(pdNo) && pdNo > max ? pdNo : max;
    }, 0);
    return Math.min(12, Math.max(1, maxPdNo || 12));
  }, [masterForecast, visibleYears, selectedProject]);

  const makePoolView = (source, yearKey, row) => {
    const flags = getAccountPoolFlags(row.acctId, row.orgId);
    const rates = getPoolRateSet(yearKey);
    // For burn screens use the same fully accumulated annual pool dollars already
    // calculated by categoryTableData (including month-specific escalation).
    const calculated = {
      cost: Number(source?.cost) || 0, // ADD
      totalBurdenedCost: Number(source?.totalBurdenedCost) || 0,
      aeroFringe: Number(source?.aeroFringe) || 0,
      nasaFringe: Number(source?.nasaFringe) || 0,
      calInt: 0,
      custOH: Number(source?.custOH) || 0,
      columbusOH: Number(source?.columbusOH) || 0,
      subkMH: Number(source?.subkMH) || 0,
      ga: Number(source?.ga) || 0,
      fee: Number(source?.fee) || 0,
      loadedAmount:
        Number(source?.price) ||
        (Number(source?.totalBurdenedCost) || 0) + (Number(source?.fee) || 0),
    };
    return { ...calculated, rates, flags };
  };

  // Labor Dollar Burn Rate preserves the existing annual price/monthly burn values and adds
  // every configured pool's rate/amount plus the full account-pool bifurcation flags.
  const laborDollarBurnData = useMemo(
    () =>
      (categoryTableData || [])
        .filter((row) => row.isLabor)
        .map((row) => {
          const years = [row.base, ...(row.opts || [])].map((year, idx) => {
            const yearKey = [BASE_YEAR, ...OPTION_YEARS][idx];
            const price = Number(year?.price) || 0;
            const poolView = makePoolView(year, yearKey, row);
            return {
              price,
              monthlyBurn: price / burnPeriodCount,
              pools: poolView,
            };
          });
          return {
            id: row.id,
            project: row.task || "-",
            category: row.cat || "-",
            accountType: row.type || "-",
            acctId: row.acctId || "",
            orgId: row.orgId || "",
            flags: getAccountPoolFlags(row.acctId, row.orgId),
            years,
          };
        })
        .sort(
          (a, b) =>
            String(a.project).localeCompare(String(b.project), undefined, {
              numeric: true,
            }) || String(a.category).localeCompare(String(b.category)),
        ),
    [
      categoryTableData,
      burnPeriodCount,
      accountPoolsMap,
      burdenRates,
      escalatedRatesMap,
      globalFee,
    ],
  );

  // Labor Hours Burn Rate keeps productive hours/monthly burn and adds pool bifurcation and
  // the corresponding employee's account-level pool rates/amounts.
  const laborHoursBurnData = useMemo(() => {
    const grouped = new Map();
    (categoryTableData || [])
      .filter((row) => row.isLabor && Array.isArray(row.subItems))
      .forEach((projectRow) => {
        projectRow.subItems.forEach((employee) => {
          const key = `${employee.emplId || employee.name}-${projectRow.task}-${projectRow.cat}-${projectRow.acctId}-${projectRow.orgId}`;
          if (!grouped.has(key))
            grouped.set(key, {
              id: key,
              employee: employee.name || employee.emplId || "Unassigned",
              emplId: employee.emplId || "",
              project: projectRow.task || "-",
              plc: projectRow.cat || "-",
              acctId: projectRow.acctId || "",
              orgId: projectRow.orgId || "",
              flags: getAccountPoolFlags(projectRow.acctId, projectRow.orgId),
              years: [BASE_YEAR, ...OPTION_YEARS].map((yearKey, idx) => ({
                directHours: 0,
                monthlyHoursBurn: 0,
                pools: makePoolView(
                  idx === 0 ? employee.base : employee.opts?.[idx - 1],
                  yearKey,
                  projectRow,
                ),
              })),
            });
          const target = grouped.get(key);
          [employee.base, ...(employee.opts || [])].forEach((bucket, idx) => {
            if (target.years[idx]) {
              target.years[idx].directHours += Number(bucket?.hrs) || 0;
              target.years[idx].pools = makePoolView(
                bucket,
                [BASE_YEAR, ...OPTION_YEARS][idx],
                projectRow,
              );
            }
          });
        });
      });
    return [...grouped.values()]
      .map((row) => ({
        ...row,
        years: row.years.map((year) => ({
          ...year,
          monthlyHoursBurn: year.directHours / burnPeriodCount,
        })),
      }))
      .sort(
        (a, b) =>
          String(a.employee).localeCompare(String(b.employee), undefined, {
            sensitivity: "base",
          }) ||
          String(a.project).localeCompare(String(b.project), undefined, {
            numeric: true,
          }) ||
          String(a.plc).localeCompare(String(b.plc)),
      );
  }, [
    categoryTableData,
    burnPeriodCount,
    accountPoolsMap,
    burdenRates,
    escalatedRatesMap,
    globalFee,
  ]);

  const BURN_SUM_KEYS = [
    "cost",
    "totalBurdenedCost",
    "aeroFringe",
    "nasaFringe",
    "calInt",
    "custOH",
    "columbusOH",
    "subkMH",
    "ga",
    "fee",
    "loadedAmount",
  ];

  // One parent row per employee; the Project/PLC rows become its children.
  const laborBurnByEmployee = useMemo(() => {
    const emptyYear = () => ({
      directHours: 0,
      pools: BURN_SUM_KEYS.reduce((a, k) => ({ ...a, [k]: 0 }), {}),
    });
    const groups = new Map();

    (laborHoursBurnData || []).forEach((row) => {
      const key = row.emplId || row.employee;
      if (!groups.has(key)) {
        groups.set(key, {
          id: `emp-${key}`,
          employee: row.employee,
          emplId: row.emplId,
          years: ALL_YEARS.map(emptyYear),
          children: [],
        });
      }
      const g = groups.get(key);
      g.children.push(row);
      row.years.forEach((y, i) => {
        if (!g.years[i]) return;
        g.years[i].directHours += Number(y.directHours) || 0;
        BURN_SUM_KEYS.forEach((k) => {
          g.years[i].pools[k] += Number(y.pools?.[k]) || 0;
        });
      });
    });

    return [...groups.values()]
      .map((g) => ({
        ...g,
        projectCount: new Set(g.children.map((c) => c.project)).size,
        plcCount: new Set(g.children.map((c) => c.plc)).size,
      }))
      .sort((a, b) =>
        String(a.employee).localeCompare(String(b.employee), undefined, {
          sensitivity: "base",
        }),
      );
  }, [laborHoursBurnData]);

  // 3. Labor Data (grouped per task / employee / PLC with per-year buckets)
  const laborTableData = useMemo(() => {
    if (!masterForecast || masterForecast.length === 0) return [];
    const agg = {};

    validLabor.forEach((i) => {
      const y = String(i.year || i.fyCd || i.fy || "");
      if (!visibleYears.includes(y)) return;
      const isBase = y === BASE_YEAR;
      const yIdx = OPTION_YEARS.indexOf(y);
      if (!isBase && yIdx === -1) return;

      const plcKey = String(
        i.plc || i.billLabCatCd || i.laborCategoryCode || "",
      )
        .trim()
        .toUpperCase();
      const key = `${i.projId || i.projectId}-${i.emplId || i.id}-${plcKey}`;

      if (!agg[key])
        agg[key] = {
          task: getTask(i.projId || i.projectId),
          acctId: i.acctId || "N/A",
          acctName: formatDisplayType(
            nonLaborData.coa[String(i.acctId || "").trim()] || "Labor",
          ),
          org: i.orgId || i.org || "N/A",
          type: getAccountType(i.acctId),
          lcat: formatDisplayType(plcMap[plcKey] || "Labor Category"),
          emplId: i.emplId || i.id,
          emplName: formatDisplayType(
            i.empName || laborData.empMap[String(i.emplId || i.id)] || "TBD",
          ),
          rate: parseFloat(i.hrly_rate || i.rate || i.perHourRate || 0),
          hrs: 0,
          fyAmt: 0,
          base: emptyLaborYear(),
          opts: OPTION_YEARS.map(() => emptyLaborYear()),
        };

      const h = parseFloat(i.hours || i.forecastedHours || 0);
      const a = parseFloat(i.cost || 0);
      const m = (parseInt(i.month || i.period || i.pdNo || i.pd_no) || 1) - 1;
      const target = isBase ? agg[key].base : agg[key].opts[yIdx];

      target.hrs += h;
      target.amt += a;
      if (m >= 0 && m < 12) {
        target.monthly[m] += h;
        target.monthlyAmt[m] += a;
      }
      agg[key].hrs += h;
      agg[key].fyAmt += a;
    });

    return Object.values(agg)
      .map((row) => {
        if (!row.rate && row.hrs > 0) row.rate = row.fyAmt / row.hrs;
        return row;
      })
      .sort(
        (a, b) => String(a.task).localeCompare(String(b.task)) || b.hrs - a.hrs,
      );
  }, [
    masterForecast,
    validLabor,
    visibleYears,
    getTask,
    getAccountType,
    nonLaborData.coa,
    plcMap,
    laborData.empMap,
  ]);

  const laborTotals = useMemo(() => {
    const totals = {
      base: emptyLaborYear(),
      opts: OPTION_YEARS.map(() => emptyLaborYear()),
    };
    laborTableData.forEach((row) => {
      addLaborYear(totals.base, row.base);
      row.opts.forEach((o, idx) => addLaborYear(totals.opts[idx], o));
    });
    return totals;
  }, [laborTableData]);

  // 4. Non-Labor Data (grouped per task / account / vendor with per-year buckets)
  const nonLaborTableData = useMemo(() => {
    if (!masterForecast || masterForecast.length === 0) return [];
    const agg = {};

    validNonLabor.forEach((i) => {
      const y = String(i.year || i.fyCd || i.fy || "");
      if (!visibleYears.includes(y)) return;
      const isBase = y === BASE_YEAR;
      const yIdx = OPTION_YEARS.indexOf(y);
      if (!isBase && yIdx === -1) return;

      const acctKey = String(i.acctId || i.accountId || "").trim();
      const projKey = String(i.projId || i.projectId || "");
      const vendId = String(i.vendId || i.vendorId || i.emplId || "")
        .trim()
        .toUpperCase();
      const rawType = nonLaborData.coaTypes[acctKey];
      const key = `${projKey}-${acctKey}-${vendId}`;

      if (!agg[key])
        agg[key] = {
          task: getTask(projKey),
          lcat: nonLaborData.coaGroups[acctKey] || rawType,
          name: formatDisplayType(
            nonLaborData.coa[acctKey] ||
              i.acctName ||
              i.accountName ||
              "Expense",
          ),
          vendorName: vendorMap[vendId] || i.empName || "",
          type: formatDisplayType(nonLaborData.coaGroups[acctKey] || rawType),
          total: 0,
          base: emptyNonLaborYear(),
          opts: OPTION_YEARS.map(() => emptyNonLaborYear()),
        };

      const amt = parseFloat(i.cost || 0);
      const rawMonth = i.month ?? i.period ?? i.pdNo ?? i.pd_no;
      const parsedMonth = Number(rawMonth);
      const m =
        Number.isFinite(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
          ? parsedMonth - 1
          : -1;
      const target = isBase ? agg[key].base : agg[key].opts[yIdx];

      target.total += amt;
      if (m >= 0 && m < 12) target.monthly[m] += amt;
      agg[key].total += amt;
    });

    return Object.values(agg).sort(
      (a, b) =>
        String(a.task).localeCompare(String(b.task)) || b.total - a.total,
    );
  }, [
    masterForecast,
    validNonLabor,
    visibleYears,
    getTask,
    vendorMap,
    nonLaborData.coaTypes,
    nonLaborData.coaGroups,
    nonLaborData.coa,
  ]);

  const nonLaborTotals = useMemo(() => {
    const totals = {
      base: emptyNonLaborYear(),
      opts: OPTION_YEARS.map(() => emptyNonLaborYear()),
    };
    nonLaborTableData.forEach((row) => {
      addNonLaborYear(totals.base, row.base);
      row.opts.forEach((o, idx) => addNonLaborYear(totals.opts[idx], o));
    });
    return totals;
  }, [nonLaborTableData]);

  // ==========================================
  // DASHBOARD DATA AGGREGATION
  // ==========================================
  const dashboardStats = useMemo(() => {
    if (!Array.isArray(categoryTableData) || categoryTableData.length === 0)
      return null;

    let totalDir = 0;
    let totalBurd = 0;
    let totalFee = 0;
    let totalEvaluatedPrice = 0;

    const yearMap = {};
    const plcMap = {};
    const empMap = {};
    const venMap = {};

    const BD_KEYS = [
      "cost",
      "aeroFringe",
      "nasaFringe",
      "custOH",
      "columbusOH",
      "subkMH",
      "ga",
      "totalBurdenedCost",
      "fee",
      "price",
      "hrs",
    ];
    const emptyBD = () => BD_KEYS.reduce((a, k) => ({ ...a, [k]: 0 }), {});
    const addBD = (t, s) =>
      BD_KEYS.forEach((k) => {
        t[k] += Number(s?.[k]) || 0;
      });

    ALL_YEARS.forEach((y) => {
      if (visibleYears.includes(y)) {
        yearMap[y] = { name: y, "Direct Cost": 0, Burden: 0, Fee: 0, Total: 0 };
      }
    });

    categoryTableData.forEach((row) => {
      const processYear = (yData, yName) => {
        if (!yData || !visibleYears.includes(yName)) return;

        // const cost = yData.cost || 0;
        // const fee = yData.fee || 0;
        // const burd = (yData.totalBurdenedCost || 0) - cost;
        // const price = yData.price || 0;
        // const hrs = yData.hrs || 0;

        const cost = Number(yData.cost || 0);
        const fee = Number(yData.fee || 0);
        const totalBurdenedCost = Number(yData.totalBurdenedCost || 0);

        // Burden is the amount above direct cost.
        const burd = Math.max(0, totalBurdenedCost - cost);

        const price = Number(yData.price || 0);
        const hrs = Number(yData.hrs || 0);

        totalDir += cost;
        totalBurd += burd;
        totalFee += fee;
        totalEvaluatedPrice += price;

        yearMap[yName]["Direct Cost"] += cost;
        yearMap[yName].Burden += burd;
        yearMap[yName].Fee += fee;
        yearMap[yName].Total += price;

        if (row.isLabor) {
          // if (!plcMap[row.cat])
          //   plcMap[row.cat] = { name: row.cat, Price: 0, Hours: 0 };
          if (!plcMap[row.cat])
            plcMap[row.cat] = {
              name: row.cat,
              Price: 0,
              Hours: 0,
              ...emptyBD(),
            };
          plcMap[row.cat].Price += price;
          plcMap[row.cat].Hours += hrs;
          addBD(plcMap[row.cat], yData);
        } else {
          const vName = row.vendorName || "Unassigned / General";
          // if (!venMap[vName]) venMap[vName] = { name: vName, Price: 0 };
          if (!venMap[vName])
            venMap[vName] = { name: vName, Price: 0, ...emptyBD() };
          venMap[vName].Price += price;
          addBD(venMap[vName], yData);
        }
      };

      processYear(row.base, BASE_YEAR);
      row.opts.forEach((opt, idx) => processYear(opt, OPTION_YEARS[idx]));

      if (row.isLabor && row.subItems) {
        row.subItems.forEach((sub) => {
          const processSubYear = (yData, yName) => {
            if (!yData || !visibleYears.includes(yName)) return;
            const ePrice = yData.price || 0;
            const eHrs = yData.hrs || 0;
            // if (!empMap[sub.name])
            //   empMap[sub.name] = { name: sub.name, Price: 0, Hours: 0 };
            if (!empMap[sub.name])
              empMap[sub.name] = {
                name: sub.name,
                Price: 0,
                Hours: 0,
                ...emptyBD(),
              };
            empMap[sub.name].Price += ePrice;
            empMap[sub.name].Hours += eHrs;
            addBD(empMap[sub.name], yData);
          };
          processSubYear(sub.base, BASE_YEAR);
          sub.opts.forEach((opt, idx) =>
            processSubYear(opt, OPTION_YEARS[idx]),
          );
        });
      }
    });

    const barData = Object.values(yearMap);

    const primaryPieData = [
      { name: "Direct Cost", value: totalDir },
      { name: "Burden Cost", value: totalBurd },
      { name: "Fee", value: totalFee },
    ].filter((d) => d.value > 0);

    const burdenRate = totalDir > 0 ? (totalBurd / totalDir) * 100 : 0;

    const getBurdTot = (poolKey) => {
      let val = 0;
      categoryTableData.forEach((row) => {
        val += row.base[poolKey] || 0;
        row.opts.forEach((opt, idx) => {
          if (visibleYears.includes(OPTION_YEARS[idx]))
            val += opt[poolKey] || 0;
        });
      });
      return val;
    };

    const secondaryPieData = [
      { name: "AERO", value: getBurdTot("aeroFringe"), fill: "#fcd34d" },
      { name: "NASA", value: getBurdTot("nasaFringe"), fill: "#fbbf24" },
      { name: "Cust OH", value: getBurdTot("custOH"), fill: "#f59e0b" },
      {
        name: "Off - Site OH",
        value: getBurdTot("columbusOH"),
        fill: "#d97706",
      },
      { name: "Subk M&H", value: getBurdTot("subkMH"), fill: "#b45309" },
      { name: "G&A", value: getBurdTot("ga"), fill: "#92400e" },
    ].filter((d) => d.value > 0);

    const plcData = Object.values(plcMap)
      .sort((a, b) => b.Price - a.Price)
      .slice(0, 10);
    const empDataList = Object.values(empMap)
      .sort((a, b) => b.Price - a.Price)
      .slice(0, 10);
    const vendorDataList = Object.values(venMap)
      .sort((a, b) => b.Price - a.Price)
      .slice(0, 10);

    return {
      totalEvaluatedPrice,
      totalDir,
      totalBurd,
      totalFee,
      barData,
      primaryPieData,
      secondaryPieData,
      burdenRate,
      plcData,
      empData: empDataList,
      vendorData: vendorDataList,
    };
  }, [categoryTableData, visibleYears]);

  const PIE_COLORS = [
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#10b981",
    "#ef4444",
    "#06b6d4",
    "#84cc16",
    "#ec4899",
    "#6366f1",
    "#f97316",
  ];

  const dashboardDetailData = useMemo(() => {
    if (!dashboardStats) return null;
    if (dashboardView === "Labor Categories") {
      return (
        dashboardStats.plcData.find(
          (item) => item.name === selectedDashboardFilter.laborCategory,
        ) || null
      );
    }
    if (dashboardView === "Employees") {
      return (
        dashboardStats.empData.find(
          (item) => item.name === selectedDashboardFilter.employee,
        ) || null
      );
    }
    if (dashboardView === "Vendors") {
      return (
        dashboardStats.vendorData.find(
          (item) => item.name === selectedDashboardFilter.vendor,
        ) || null
      );
    }
    return null;
  }, [dashboardStats, dashboardView, selectedDashboardFilter]);

  const getDashboardDetailTotal = useCallback(() => {
    if (!dashboardStats) return 0;
    if (dashboardView === "Labor Categories")
      return dashboardStats.plcData.reduce(
        (sum, item) => sum + (item.Price || 0),
        0,
      );
    if (dashboardView === "Employees")
      return dashboardStats.empData.reduce(
        (sum, item) => sum + (item.Price || 0),
        0,
      );
    if (dashboardView === "Vendors")
      return dashboardStats.vendorData.reduce(
        (sum, item) => sum + (item.Price || 0),
        0,
      );
    return 0;
  }, [dashboardStats, dashboardView]);

  const renderDetailBreakdown = (d) => {
    if (!d) return null;
    const cost = d.cost || 0;
    const lines = [
      { label: "Direct Cost", amt: d.cost },
      { label: "AERO Fringe", amt: d.aeroFringe },
      { label: "NASA/NIH Fringe", amt: d.nasaFringe },
      { label: "Customer Site OH", amt: d.custOH },
      { label: "Off - Site OH", amt: d.columbusOH },
      { label: "Subk M&H", amt: d.subkMH },
      { label: "G&A", amt: d.ga },
    ].filter((l) => l.label === "Direct Cost" || (l.amt || 0) !== 0);

    const wrap = cost > 0 ? (d.totalBurdenedCost / cost).toFixed(2) : "-";
    const feePct = `${Number(globalFee).toFixed(2)}%`;

    return (
      <div className="md:col-span-3 mt-2 overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-3 py-1.5 border border-gray-200 text-left">
                Component
              </th>
              <th className="px-3 py-1.5 border border-gray-200 text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.label}>
                <td className="px-3 py-1.5 border border-gray-200">
                  {l.label}
                </td>
                <td className="px-3 py-1.5 border border-gray-200 text-right">
                  {formatCurrency(l.amt)}
                </td>
              </tr>
            ))}
            <tr className="bg-indigo-50 font-semibold">
              <td className="px-3 py-1.5 border border-gray-200">
                Total Burdened Cost (Wrap Rate {wrap})
              </td>
              <td className="px-3 py-1.5 border border-gray-200 text-right">
                {formatCurrency(d.totalBurdenedCost)}
              </td>
            </tr>
            <tr className="bg-purple-50">
              <td className="px-3 py-1.5 border border-gray-200">
                Fee ({feePct})
              </td>
              <td className="px-3 py-1.5 border border-gray-200 text-right">
                {formatCurrency(d.fee)}
              </td>
            </tr>
            <tr className="bg-green-50 font-bold">
              <td className="px-3 py-1.5 border border-gray-200">Price</td>
              <td className="px-3 py-1.5 border border-gray-200 text-right">
                {formatCurrency(d.price)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // ==========================================
  // EXPORT TO EXCEL
  // ==========================================
  const exportToExcel = async () => {
    if (
      !masterForecast ||
      masterForecast.length === 0 ||
      !elementsSummaryData
    ) {
      return alert("Please wait for data to load.");
    }

    const visibleYrs = ALL_YEARS.filter((y) => visibleYears.includes(y));

    const wb = new ExcelJS.Workbook();
    wb.creator = "Revolve Project Performance";
    wb.created = new Date();

    const borderAll = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    const fillGray = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE5E7EB" },
    };
    const fillGrayLight = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF3F4F6" },
    };
    const fillBlueHeader = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDBEAFE" },
    };
    const fillBlueCell = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEFF6FF" },
    };
    const fillBlueDark = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E3A8A" },
    };
    const fillGreenHeader = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDCFCE7" },
    };
    const fillGreenCell = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF0FDF4" },
    };
    const fillAmber = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFBEB" },
    };
    const fillIndigoLight = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E7FF" },
    };

    const fontWhiteBold = { bold: true, color: { argb: "FFFFFFFF" } };
    const fontAmberBold = { bold: true, color: { argb: "FF78350F" } };
    const fontBold = { bold: true };

    const getColLetter = (col) => {
      let temp,
        letter = "";
      while (col > 0) {
        temp = (col - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        col = (col - temp - 1) / 26;
      }
      return letter;
    };

    // ==========================================
    // TAB 1: SUMMARY (Performance By Elements)
    // ==========================================
    const wsSum = wb.addWorksheet("Performance By Elements");
    wsSum.columns = [
      { header: "Account Type", key: "type", width: 40 },
      ...visibleYrs.map((y) => ({
        header: `Total ${y}`,
        key: `yr_${y}`,
        width: 20,
      })),
    ];
    wsSum.getRow(1).eachCell((cell) => {
      cell.fill = fillGray;
      cell.font = fontBold;
      cell.border = borderAll;
    });

    const addSumRow = (name, base, opts, isHeader = false, isFinal = false) => {
      const rowData = { type: name };
      if (visibleYrs.includes(BASE_YEAR)) rowData[`yr_${BASE_YEAR}`] = base;
      OPTION_YEARS.forEach((y, i) => {
        if (visibleYrs.includes(y)) rowData[`yr_${y}`] = opts[i];
      });
      const row = wsSum.addRow(rowData);
      row.eachCell((cell, colNum) => {
        cell.border = borderAll;
        if (colNum > 1) cell.numFmt = '"$"#,##0.00';
        if (isHeader) {
          cell.fill = fillGrayLight;
          cell.font = fontBold;
        }
        if (isFinal) {
          cell.fill = fillBlueDark;
          cell.font = fontWhiteBold;
        }
      });
    };

    let tdBase = 0,
      tdOpts = [0, 0, 0, 0, 0],
      tbBase = 0,
      tbOpts = [0, 0, 0, 0, 0];

    wsSum.addRow({ type: "DIRECT COST" }).eachCell((c) => {
      c.fill = fillGray;
      c.font = fontBold;
      c.border = borderAll;
    });
    Object.values(elementsSummaryData.directCosts).forEach((dc) => {
      tdBase += dc.base;
      dc.opts.forEach((o, i) => (tdOpts[i] += o));
      addSumRow(dc.name, dc.base, dc.opts);
    });
    addSumRow("Total Direct Cost", tdBase, tdOpts, true);

    wsSum.addRow({ type: "BURDEN COST" }).eachCell((c) => {
      c.fill = fillGray;
      c.font = fontBold;
      c.border = borderAll;
    });
    Object.values(elementsSummaryData.burdens).forEach((bc) => {
      tbBase += bc.base;
      bc.opts.forEach((o, i) => (tbOpts[i] += o));
      addSumRow(bc.name, bc.base, bc.opts);
    });
    addSumRow("Total Burden Cost", tbBase, tbOpts, true);

    const tcBase = tdBase + tbBase;
    const tcOpts = tdOpts.map((d, i) => d + tbOpts[i]);
    addSumRow("Total Cost", tcBase, tcOpts, true);

    const feeRate = parseFloat(globalFee) / 100 || 0;
    const feeBase = tcBase * feeRate;
    const feeOpts = tcOpts.map((c) => c * feeRate);
    addSumRow(
      `Fee (${Number(globalFee).toFixed(2)}%)`,
      feeBase,
      feeOpts,
      false,
      false,
    );

    const finalBase = tcBase + feeBase;
    const finalOpts = tcOpts.map((c, i) => c + feeOpts[i]);
    addSumRow("Revenue", finalBase, finalOpts, false, true);

    // ==========================================
    // TAB 2: Performance By Category
    // ==========================================
    const wsPrice = wb.addWorksheet("Performance By Category");

    const headerRow1 = wsPrice.addRow(["Element Details", "", "", ""]);
    const headerGroup = wsPrice.addRow(["", "", "", ""]);
    const headerRow2 = wsPrice.addRow([
      "Top Level",
      "Task",
      "Acct Type",
      "Category",
    ]);

    wsPrice.mergeCells(1, 1, 2, 4);
    let colIdx = 5;

    const subCols = [
      "Hrs",
      "Unburdened",
      "AERO",
      "NASA",
      "Cust OH",
      "Off - Site OH",
      "Subk M&H",
      "G&A",
      "Total Burdened Cost",
      "Fee",
      "Price",
      "Burdened Rate",
    ];

    if (visibleYrs.includes(BASE_YEAR)) {
      headerRow1.getCell(colIdx).value = `Base Year (${BASE_YEAR})`;
      wsPrice.mergeCells(1, colIdx, 1, colIdx + 11);

      headerGroup.getCell(colIdx).value = "Direct Charge";
      wsPrice.mergeCells(2, colIdx, 2, colIdx + 1);
      headerGroup.getCell(colIdx + 2).value = "Burden";
      wsPrice.mergeCells(2, colIdx + 2, 2, colIdx + 7);
      headerGroup.getCell(colIdx + 8).value = "Total Burdened Cost";
      headerGroup.getCell(colIdx + 9).value = "Fee";
      headerGroup.getCell(colIdx + 10).value = "Price";
      wsPrice.mergeCells(2, colIdx + 10, 2, colIdx + 11);

      subCols.forEach((col, i) => (headerRow2.getCell(colIdx + i).value = col));

      for (let i = 0; i < 12; i++) {
        headerRow1.getCell(colIdx + i).fill = fillBlueHeader;
        headerGroup.getCell(colIdx + i).fill = fillBlueHeader;
        headerRow2.getCell(colIdx + i).fill = fillBlueHeader;
        headerGroup.getCell(colIdx + i).alignment = { horizontal: "center" };
        headerRow2.getCell(colIdx + i).alignment = { horizontal: "center" };
      }
      colIdx += 12;
    }

    OPTION_YEARS.forEach((y, idx) => {
      if (visibleYrs.includes(y)) {
        headerRow1.getCell(colIdx).value = `Option Year ${idx + 1} (${y})`;
        wsPrice.mergeCells(1, colIdx, 1, colIdx + 11);

        headerGroup.getCell(colIdx).value = "Direct Charge";
        wsPrice.mergeCells(2, colIdx, 2, colIdx + 1);
        headerGroup.getCell(colIdx + 2).value = "Burden";
        wsPrice.mergeCells(2, colIdx + 2, 2, colIdx + 7);
        headerGroup.getCell(colIdx + 8).value = "Total Burdened Cost";
        headerGroup.getCell(colIdx + 9).value = "Fee";
        headerGroup.getCell(colIdx + 10).value = "Price";
        wsPrice.mergeCells(2, colIdx + 10, 2, colIdx + 11);

        subCols.forEach(
          (col, i) => (headerRow2.getCell(colIdx + i).value = col),
        );

        for (let i = 0; i < 12; i++) {
          headerRow1.getCell(colIdx + i).fill = fillGreenHeader;
          headerGroup.getCell(colIdx + i).fill = fillGreenHeader;
          headerRow2.getCell(colIdx + i).fill = fillGreenHeader;
          headerGroup.getCell(colIdx + i).alignment = { horizontal: "center" };
          headerRow2.getCell(colIdx + i).alignment = { horizontal: "center" };
        }
        colIdx += 12;
      }
    });

    for (let i = 1; i <= 4; i++) {
      headerRow1.getCell(i).fill = fillGray;
      headerRow1.getCell(i).font = fontBold;
      headerRow1.getCell(i).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      headerRow2.getCell(i).fill = fillGrayLight;
      headerRow2.getCell(i).font = fontBold;
    }
    headerRow1.eachCell((c) => {
      c.border = borderAll;
      c.font = fontBold;
      c.alignment = { horizontal: "center", vertical: "middle" };
    });
    headerGroup.eachCell((c) => {
      c.border = borderAll;
      c.font = fontBold;
    });
    headerRow2.eachCell((c) => {
      c.border = borderAll;
      c.font = fontBold;
    });

    const burdenRow1 = wsPrice.addRow(["Burden Rates %", "", "", ""]);
    const burdenRow2 = wsPrice.addRow(["Escalated Rates", "", "", ""]);
    const burdenRow3 = wsPrice.addRow(["Adjusted Rates", "", "", ""]);
    wsPrice.mergeCells(4, 1, 4, 4);
    wsPrice.mergeCells(5, 1, 5, 4);
    wsPrice.mergeCells(6, 1, 6, 4);

    let bColOffset = 5;

    const applyExcelHeaders = (targetRow, dispObj, isAvg = false) => {
      const vals = [
        "-",
        "-",
        isAvg ? dispObj.aeroFringe : dispObj.aeroFringe?.escRate || 0,
        isAvg ? dispObj.nasaFringe : dispObj.nasaFringe?.escRate || 0,
        isAvg ? dispObj.custOH : dispObj.custOH?.escRate || 0,
        isAvg ? dispObj.columbusOH : dispObj.columbusOH?.escRate || 0,
        isAvg ? dispObj.subkMH : dispObj.subkMH?.escRate || 0,
        isAvg ? dispObj.ga : dispObj.ga?.escRate || 0,
        "-",
        feeRate,
        "-",
        "-",
      ];
      vals.forEach((val, i) => {
        const cell = targetRow.getCell(bColOffset + i);
        if (typeof val === "number") {
          cell.value = val;
          cell.numFmt = "0.00%";
        } else {
          cell.value = val;
          cell.alignment = { horizontal: "center" };
        }
      });
    };

    if (visibleYrs.includes(BASE_YEAR)) {
      const bRates = burdenRates?.[BASE_YEAR] || zeroRates;
      const bDisp = {
        aeroFringe: { escRate: bRates.aeroFringe },
        nasaFringe: { escRate: bRates.nasaFringe },
        custOH: { escRate: bRates.custOH },
        columbusOH: { escRate: bRates.columbusOH },
        subkMH: { escRate: bRates.subkMH },
        ga: { escRate: bRates.ga },
      };
      applyExcelHeaders(burdenRow1, bDisp, false);
      applyExcelHeaders(burdenRow2, bDisp, false);
      applyExcelHeaders(burdenRow3, bRates, true);
      bColOffset += 12;
    }

    OPTION_YEARS.forEach((y) => {
      if (visibleYrs.includes(y)) {
        const yrMap = escalatedRatesMap[y] || {
          display: {},
          avgRates: zeroRates,
        };
        const bRates = burdenRates?.[y] || zeroRates;
        const bDisp = {
          aeroFringe: { escRate: bRates.aeroFringe },
          nasaFringe: { escRate: bRates.nasaFringe },
          custOH: { escRate: bRates.custOH },
          columbusOH: { escRate: bRates.columbusOH },
          subkMH: { escRate: bRates.subkMH },
          ga: { escRate: bRates.ga },
        };
        applyExcelHeaders(burdenRow1, bDisp, false);
        applyExcelHeaders(burdenRow2, yrMap.display, false);
        applyExcelHeaders(burdenRow3, yrMap.avgRates, true);
        bColOffset += 12;
      }
    });

    burdenRow1.eachCell((c) => {
      c.fill = fillAmber;
      c.font = fontAmberBold;
      c.border = borderAll;
    });
    burdenRow2.eachCell((c) => {
      c.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFDE68A" },
      };
      c.font = fontAmberBold;
      c.border = borderAll;
    });
    burdenRow3.eachCell((c) => {
      c.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFEF3C7" },
      };
      c.font = fontAmberBold;
      c.border = borderAll;
    });

    let pRowIdx = 7;

    categoryTableData.forEach((row) => {
      const excelRow = wsPrice.addRow([
        row.topLevel,
        row.task,
        row.type,
        row.cat,
      ]);
      const rFlags = accountPoolsMap[`${row.acctId}-${row.orgId}`] || {};
      let colOffset = 5;

      const applyExactValues = (dataGroup, colStart, isBase) => {
        const cHrs = getColLetter(colStart);
        const cCost = getColLetter(colStart + 1);
        const cAero = getColLetter(colStart + 2);
        const cNasa = getColLetter(colStart + 3);
        const cCust = getColLetter(colStart + 4);
        const cCol = getColLetter(colStart + 5);
        const cSubk = getColLetter(colStart + 6);
        const cGA = getColLetter(colStart + 7);
        const cTotBurd = getColLetter(colStart + 8);
        const cFee = getColLetter(colStart + 9);
        const cPrice = getColLetter(colStart + 10);

        const hrsCell = excelRow.getCell(colStart);
        const costCell = excelRow.getCell(colStart + 1);

        hrsCell.value = dataGroup.hrs;
        if (dataGroup.hrs > 0) {
          const implicitRate = dataGroup.cost / dataGroup.hrs;
          costCell.value = {
            formula: `${cHrs}${pRowIdx}*${implicitRate}`,
            result: dataGroup.cost,
          };
        } else {
          costCell.value = dataGroup.cost;
        }

        hrsCell.protection = { locked: false };
        costCell.protection = { locked: false };

        excelRow.getCell(colStart + 2).value = rFlags.AEROFR
          ? { formula: `${cCost}${pRowIdx}*${cAero}$6` }
          : 0;
        excelRow.getCell(colStart + 3).value = rFlags.NFRNG
          ? { formula: `${cCost}${pRowIdx}*${cNasa}$6` }
          : 0;
        const fringeStr = `(${cAero}${pRowIdx}+${cNasa}${pRowIdx})`;
        const ohBaseStr = rFlags.FRINGEONOVERHEAD
          ? `(${cCost}${pRowIdx}+${fringeStr})`
          : `${cCost}${pRowIdx}`;

        excelRow.getCell(colStart + 4).value = rFlags.OVH30
          ? { formula: `${ohBaseStr}*${cCust}$6` }
          : 0;
        excelRow.getCell(colStart + 5).value = rFlags.OVH31
          ? { formula: `${ohBaseStr}*${cCol}$6` }
          : 0;
        excelRow.getCell(colStart + 6).value = rFlags.SMH50
          ? { formula: `${cCost}${pRowIdx}*${cSubk}$6` }
          : 0;

        let gaBaseStr = `${cCost}${pRowIdx}+${cSubk}${pRowIdx}`;
        if (rFlags.FRINGEONGNA)
          gaBaseStr += `+${cAero}${pRowIdx}+${cNasa}${pRowIdx}`;
        if (rFlags.OVERHEADONGNA)
          gaBaseStr += `+${cCust}${pRowIdx}+${cCol}${pRowIdx}`;

        excelRow.getCell(colStart + 7).value = rFlags.INTG40
          ? { formula: `(${gaBaseStr})*${cGA}$6` }
          : 0;
        excelRow.getCell(colStart + 8).value = {
          formula: `SUM(${cCost}${pRowIdx}:${cGA}${pRowIdx})`,
        };
        excelRow.getCell(colStart + 9).value = {
          formula: `${cTotBurd}${pRowIdx}*${feeRate}`,
        };
        excelRow.getCell(colStart + 10).value = {
          formula: `${cTotBurd}${pRowIdx}+${cFee}${pRowIdx}`,
        };
        excelRow.getCell(colStart + 11).value = {
          formula: `IF(${cHrs}${pRowIdx}>0, ${cPrice}${pRowIdx}/${cHrs}${pRowIdx}, 0)`,
        };

        for (let i = 0; i < 12; i++) {
          const cell = excelRow.getCell(colStart + i);
          if (i > 0) cell.numFmt = '"$"#,##0.00';
          cell.fill = isBase ? fillBlueCell : fillGreenCell;
        }
        excelRow.getCell(colStart + 10).font = fontBold;
        excelRow.getCell(colStart + 11).font = fontBold;
      };

      if (visibleYrs.includes(BASE_YEAR)) {
        applyExactValues(row.base, colOffset, true);
        colOffset += 12;
      }
      row.opts.forEach((optData, oIdx) => {
        if (visibleYrs.includes(OPTION_YEARS[oIdx])) {
          applyExactValues(optData, colOffset, false);
          colOffset += 12;
        }
      });

      for (let i = 1; i <= 4; i++) {
        excelRow.getCell(i).fill = fillGrayLight;
      }
      excelRow.eachCell((c) => (c.border = borderAll));
      pRowIdx++;
    });

    wsPrice.getColumn(1).width = 15;
    wsPrice.getColumn(2).width = 25;
    wsPrice.getColumn(3).width = 20;
    wsPrice.getColumn(4).width = 30;

    let expandColIdx = 5;
    const subColWidths = [12, 16, 14, 14, 14, 14, 14, 14, 18, 14, 18, 14];
    for (let y = 0; y < visibleYrs.length; y++) {
      for (let i = 0; i < 12; i++) {
        wsPrice.getColumn(expandColIdx + i).width = subColWidths[i];
      }
      expandColIdx += 12;
    }

    await wsPrice.protect("revolve");

    // ==========================================
    // TAB 3a: Performance By Employee (with hourly-rate breakdown lines)
    // ==========================================
    const wsLaborPerf = wb.addWorksheet("Performance By Employee");

    const laborHeaderRow1 = wsLaborPerf.addRow(["Element Details", "", "", ""]);
    const laborHeaderGroup = wsLaborPerf.addRow(["", "", "", ""]);
    const laborHeaderRow2 = wsLaborPerf.addRow([
      "Top Level",
      "Task / Period",
      "Acct Type",
      "Employee",
    ]);

    wsLaborPerf.mergeCells(1, 1, 2, 4);

    let laborColIdx = 5;

    const laborSubCols = [
      "Hrs",
      "Unburdened",
      "AERO",
      "NASA",
      "Cust OH",
      "Off - Site OH",
      "Subk M&H",
      "G&A",
      "Total Burdened Cost",
      "Wrap Rate",
      "Fee",
      "Price",
      "Burdened Rate",
    ];

    const laborYearCols = 13;

    if (visibleYrs.includes(BASE_YEAR)) {
      laborHeaderRow1.getCell(laborColIdx).value = `Base Year (${BASE_YEAR})`;
      wsLaborPerf.mergeCells(
        1,
        laborColIdx,
        1,
        laborColIdx + laborYearCols - 1,
      );

      laborHeaderGroup.getCell(laborColIdx).value = "Direct Charge";
      wsLaborPerf.mergeCells(2, laborColIdx, 2, laborColIdx + 1);

      laborHeaderGroup.getCell(laborColIdx + 2).value = "Burden";
      wsLaborPerf.mergeCells(2, laborColIdx + 2, 2, laborColIdx + 7);

      laborHeaderGroup.getCell(laborColIdx + 8).value = "Total Burdened Cost";
      laborHeaderGroup.getCell(laborColIdx + 9).value = "Wrap Rate";
      laborHeaderGroup.getCell(laborColIdx + 10).value = "Fee";
      laborHeaderGroup.getCell(laborColIdx + 11).value = "Price";
      laborHeaderGroup.getCell(laborColIdx + 12).value = "Burdened Rate";

      laborSubCols.forEach(
        (col, i) => (laborHeaderRow2.getCell(laborColIdx + i).value = col),
      );

      for (let i = 0; i < laborYearCols; i++) {
        laborHeaderRow1.getCell(laborColIdx + i).fill = fillBlueHeader;
        laborHeaderGroup.getCell(laborColIdx + i).fill = fillBlueHeader;
        laborHeaderRow2.getCell(laborColIdx + i).fill = fillBlueHeader;

        laborHeaderGroup.getCell(laborColIdx + i).alignment = {
          horizontal: "center",
        };
        laborHeaderRow2.getCell(laborColIdx + i).alignment = {
          horizontal: "center",
        };
      }

      laborColIdx += laborYearCols;
    }

    OPTION_YEARS.forEach((y, idx) => {
      if (visibleYrs.includes(y)) {
        laborHeaderRow1.getCell(laborColIdx).value =
          `Option Year ${idx + 1} (${y})`;

        wsLaborPerf.mergeCells(
          1,
          laborColIdx,
          1,
          laborColIdx + laborYearCols - 1,
        );

        laborHeaderGroup.getCell(laborColIdx).value = "Direct Charge";
        wsLaborPerf.mergeCells(2, laborColIdx, 2, laborColIdx + 1);

        laborHeaderGroup.getCell(laborColIdx + 2).value = "Burden";
        wsLaborPerf.mergeCells(2, laborColIdx + 2, 2, laborColIdx + 7);

        laborHeaderGroup.getCell(laborColIdx + 8).value = "Total Burdened Cost";
        laborHeaderGroup.getCell(laborColIdx + 9).value = "Wrap Rate";
        laborHeaderGroup.getCell(laborColIdx + 10).value = "Fee";
        laborHeaderGroup.getCell(laborColIdx + 11).value = "Price";
        laborHeaderGroup.getCell(laborColIdx + 12).value = "Burdened Rate";

        laborSubCols.forEach(
          (col, i) => (laborHeaderRow2.getCell(laborColIdx + i).value = col),
        );

        for (let i = 0; i < laborYearCols; i++) {
          laborHeaderRow1.getCell(laborColIdx + i).fill = fillGreenHeader;
          laborHeaderGroup.getCell(laborColIdx + i).fill = fillGreenHeader;
          laborHeaderRow2.getCell(laborColIdx + i).fill = fillGreenHeader;

          laborHeaderGroup.getCell(laborColIdx + i).alignment = {
            horizontal: "center",
          };
          laborHeaderRow2.getCell(laborColIdx + i).alignment = {
            horizontal: "center",
          };
        }

        laborColIdx += laborYearCols;
      }
    });

    laborHeaderRow1.eachCell((cell) => {
      cell.border = borderAll;
      cell.font = fontBold;
    });

    laborHeaderGroup.eachCell((cell) => {
      cell.border = borderAll;
      cell.font = fontBold;
    });

    laborHeaderRow2.eachCell((cell) => {
      cell.border = borderAll;
      cell.font = fontBold;
    });

    // Column numbers of every visible "Wrap Rate" column (10th col of each year block)
    const wrapColSet = new Set();
    {
      let c = 5;
      ALL_YEARS.forEach((y) => {
        if (visibleYrs.includes(y)) {
          wrapColSet.add(c + 9);
          c += laborYearCols;
        }
      });
    }

    const addEmployeeExcelRow = (prefix, yearBlocks, isRateLine) => {
      const row = [...prefix];
      yearBlocks.forEach((y, i) => {
        if (!visibleYrs.includes(ALL_YEARS[i])) return;
        row.push(
          y.hrs,
          y.cost,
          y.aeroFringe,
          y.nasaFringe,
          y.custOH,
          y.columbusOH,
          y.subkMH,
          y.ga,
          y.totalBurdenedCost,
          y.cost > 0 ? y.totalBurdenedCost / y.cost : 0,
          y.fee,
          y.price,
          y.rate,
        );
      });

      const excelRow = wsLaborPerf.addRow(row);

      excelRow.eachCell((cell, colNum) => {
        cell.border = borderAll;
        if (isRateLine) {
          cell.fill = fillIndigoLight;
          cell.font = { italic: true };
        }
        if (colNum >= 5) {
          cell.numFmt = wrapColSet.has(colNum) ? "0.00" : "#,##0.00";
        }
      });
    };

    laborPerformanceData.forEach((r) => {
      addEmployeeExcelRow(
        [r.topLevel, r.task, r.type, r.cat],
        [r.base, ...r.opts],
        false,
      );

      // One extra line per distinct hourly rate for this employee
      (r.rateRows || []).forEach((rr) => {
        addEmployeeExcelRow(
          [
            "",
            formatPeriods(rr.months),
            r.type,
            `   ↳ ${formatCurrency(rr.rate)} / hr`,
          ],
          [rr.base, ...rr.opts],
          true,
        );
      });
    });

    wsLaborPerf.columns = [
      { width: 15 },
      { width: 28 },
      { width: 18 },
      { width: 30 },
      ...Array(laborColIdx - 5).fill({ width: 16 }),
    ];

    // ==========================================
    // TAB 3b: PLANNED LABOR (Year-over-Year Layout)
    // ==========================================
    const wsLab = wb.addWorksheet("Labor");

    const labGroupRow = wsLab.addRow(["Element Details", "", "", "", "", ""]);
    wsLab.mergeCells(1, 1, 2, 6);

    const labHeaderRow = wsLab.addRow([
      "Task",
      "Acct Type",
      "PLC",
      "EMP ID",
      "Name",
      "Rate",
    ]);

    let lColIdx = 7;

    const getLabSubCols = () => {
      const cols = ["Total Hrs", "Total Amt"];
      months.forEach((m) => {
        if (laborMetrics.hrs) cols.push(`${m} Hrs`);
        if (laborMetrics.amt) cols.push(`${m} Amt`);
      });
      return cols;
    };
    const labSubCols = getLabSubCols();

    if (visibleYrs.includes(BASE_YEAR)) {
      labGroupRow.getCell(lColIdx).value = `Base Year (${BASE_YEAR})`;
      wsLab.mergeCells(1, lColIdx, 1, lColIdx + labSubCols.length - 1);
      labSubCols.forEach(
        (col, i) => (labHeaderRow.getCell(lColIdx + i).value = col),
      );

      for (let i = 0; i < labSubCols.length; i++) {
        labGroupRow.getCell(lColIdx + i).fill = fillBlueHeader;
        labGroupRow.getCell(lColIdx + i).font = fontBold;
        labGroupRow.getCell(lColIdx + i).alignment = { horizontal: "center" };
        labHeaderRow.getCell(lColIdx + i).fill = fillBlueHeader;
        labHeaderRow.getCell(lColIdx + i).font = fontBold;
      }
      lColIdx += labSubCols.length;
    }

    OPTION_YEARS.forEach((y, idx) => {
      if (visibleYrs.includes(y)) {
        labGroupRow.getCell(lColIdx).value = `Option Year ${idx + 1} (${y})`;
        wsLab.mergeCells(1, lColIdx, 1, lColIdx + labSubCols.length - 1);
        labSubCols.forEach(
          (col, i) => (labHeaderRow.getCell(lColIdx + i).value = col),
        );

        for (let i = 0; i < labSubCols.length; i++) {
          labGroupRow.getCell(lColIdx + i).fill = fillGreenHeader;
          labGroupRow.getCell(lColIdx + i).font = fontBold;
          labGroupRow.getCell(lColIdx + i).alignment = { horizontal: "center" };
          labHeaderRow.getCell(lColIdx + i).fill = fillGreenHeader;
          labHeaderRow.getCell(lColIdx + i).font = fontBold;
        }
        lColIdx += labSubCols.length;
      }
    });

    for (let i = 1; i <= 6; i++) {
      labGroupRow.getCell(i).fill = fillGray;
      labGroupRow.getCell(i).font = fontBold;
      labGroupRow.getCell(i).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      labHeaderRow.getCell(i).fill = fillGrayLight;
      labHeaderRow.getCell(i).font = fontBold;
    }
    labGroupRow.eachCell((c) => {
      c.border = borderAll;
    });
    labHeaderRow.eachCell((c) => {
      c.border = borderAll;
    });

    laborTableData.forEach((row) => {
      const rowData = [
        row.task,
        row.type,
        row.lcat,
        row.emplId,
        row.emplName,
        row.rate,
      ];
      const fmts = [null, null, null, null, null, '"$"#,##0.00'];

      [row.base, ...row.opts].forEach((yData, yIdx) => {
        if (!visibleYrs.includes(ALL_YEARS[yIdx])) return;
        rowData.push(yData.hrs > 0 ? yData.hrs : "");
        fmts.push("#,##0.00");
        rowData.push(yData.amt > 0 ? yData.amt : "");
        fmts.push('"$"#,##0.00');
        months.forEach((m, i) => {
          if (laborMetrics.hrs) {
            rowData.push(yData.monthly[i] > 0 ? yData.monthly[i] : "");
            fmts.push("#,##0.00");
          }
          if (laborMetrics.amt) {
            rowData.push(yData.monthlyAmt[i] > 0 ? yData.monthlyAmt[i] : "");
            fmts.push('"$"#,##0.00');
          }
        });
      });

      const excelRow = wsLab.addRow(rowData);
      rowData.forEach((_, idx) => {
        const c = excelRow.getCell(idx + 1);
        c.border = borderAll;
        if (idx < 6) c.fill = fillGrayLight;
        if (fmts[idx] && typeof c.value === "number") c.numFmt = fmts[idx];
      });
    });

    // ==========================================
    // TAB 4: Non-Labor (Year-over-Year Layout)
    // ==========================================
    const wsNL = wb.addWorksheet("Non-Labor");

    const nlGroupRow = wsNL.addRow(["Element Details", "", "", ""]);
    wsNL.mergeCells(1, 1, 2, 4);
    const nlHeaderRow = wsNL.addRow([
      "Task",
      "Account Type",
      "Account Name",
      "Vendor Name",
    ]);

    let nColIdx = 5;
    const nlSubCols = ["Total Cost", ...months];

    if (visibleYrs.includes(BASE_YEAR)) {
      nlGroupRow.getCell(nColIdx).value = `Base Year (${BASE_YEAR})`;
      wsNL.mergeCells(1, nColIdx, 1, nColIdx + nlSubCols.length - 1);
      nlSubCols.forEach(
        (col, i) => (nlHeaderRow.getCell(nColIdx + i).value = col),
      );

      for (let i = 0; i < nlSubCols.length; i++) {
        nlGroupRow.getCell(nColIdx + i).fill = fillBlueHeader;
        nlGroupRow.getCell(nColIdx + i).font = fontBold;
        nlGroupRow.getCell(nColIdx + i).alignment = { horizontal: "center" };
        nlHeaderRow.getCell(nColIdx + i).fill = fillBlueHeader;
        nlHeaderRow.getCell(nColIdx + i).font = fontBold;
      }
      nColIdx += nlSubCols.length;
    }

    OPTION_YEARS.forEach((y, idx) => {
      if (visibleYrs.includes(y)) {
        nlGroupRow.getCell(nColIdx).value = `Option Year ${idx + 1} (${y})`;
        wsNL.mergeCells(1, nColIdx, 1, nColIdx + nlSubCols.length - 1);
        nlSubCols.forEach(
          (col, i) => (nlHeaderRow.getCell(nColIdx + i).value = col),
        );

        for (let i = 0; i < nlSubCols.length; i++) {
          nlGroupRow.getCell(nColIdx + i).fill = fillGreenHeader;
          nlGroupRow.getCell(nColIdx + i).font = fontBold;
          nlGroupRow.getCell(nColIdx + i).alignment = { horizontal: "center" };
          nlHeaderRow.getCell(nColIdx + i).fill = fillGreenHeader;
          nlHeaderRow.getCell(nColIdx + i).font = fontBold;
        }
        nColIdx += nlSubCols.length;
      }
    });

    for (let i = 1; i <= 4; i++) {
      nlGroupRow.getCell(i).fill = fillGray;
      nlGroupRow.getCell(i).font = fontBold;
      nlGroupRow.getCell(i).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      nlHeaderRow.getCell(i).fill = fillGrayLight;
      nlHeaderRow.getCell(i).font = fontBold;
    }
    nlGroupRow.eachCell((c) => {
      c.border = borderAll;
    });
    nlHeaderRow.eachCell((c) => {
      c.border = borderAll;
    });

    nonLaborTableData.forEach((row) => {
      const rowData = [row.task, row.type, row.name, row.vendorName || "-"];

      [row.base, ...row.opts].forEach((yData, yIdx) => {
        if (!visibleYrs.includes(ALL_YEARS[yIdx])) return;
        rowData.push(yData.total > 0 ? yData.total : "");
        months.forEach((m, i) => {
          rowData.push(yData.monthly[i] > 0 ? yData.monthly[i] : "");
        });
      });

      const excelRow = wsNL.addRow(rowData);
      rowData.forEach((_, idx) => {
        const c = excelRow.getCell(idx + 1);
        c.border = borderAll;
        if (idx < 4) c.fill = fillGrayLight;
        else if (typeof c.value === "number") c.numFmt = '"$"#,##0.00';
      });
    });

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Project Performance_Export_${selectedProject || ""}.xlsx`);
  };

  // Auto-populate Proposal Package template
  useEffect(() => {
    if (activeTab === "Proposal Package") {
      const currentProject =
        projectSearchResults.find((p) => p.projectId === selectedProject) || {};
      const projName = currentProject.name || "New Business";
      const todayDate = new Date().toLocaleDateString();
      const companyName = import.meta.env.VITE_CLIENT_ID || "[Company Name]";

      const customerName = currentProject.customer || "[Agency Name]";
      const contractType =
        currentProject.contractTypes || "[FFP / T&M / Cost-Reimbursement]";
      const startDate = currentProject.startDate
        ? new Date(currentProject.startDate).toLocaleDateString()
        : "[Start Date]";
      const endDate = currentProject.endDate
        ? new Date(currentProject.endDate).toLocaleDateString()
        : "[End Date]";
      const periodOfPerf =
        currentProject.startDate && currentProject.endDate
          ? `${startDate} - ${endDate}`
          : "[Base Period and Option Periods]";

      let laborRowsHTML = "";
      let totalBasePrice = 0,
        totalOpt1 = 0,
        totalOpt2 = 0,
        totalOpt3 = 0,
        totalOpt4 = 0;
      let totalOdcsCost = 0;

      const clinTotals = {};

      if (Array.isArray(categoryTableData)) {
        categoryTableData.forEach((item) => {
          if (item.base?.price) totalBasePrice += item.base.price;
          if (item.opts?.[0]?.price) totalOpt1 += item.opts[0].price;
          if (item.opts?.[1]?.price) totalOpt2 += item.opts[1].price;
          if (item.opts?.[2]?.price) totalOpt3 += item.opts[2].price;
          if (item.opts?.[3]?.price) totalOpt4 += item.opts[3].price;

          const t = item.task || "0001";
          if (!clinTotals[t])
            clinTotals[t] = { base: 0, opt1: 0, opt2: 0, opt3: 0, opt4: 0 };
          if (item.base?.price) clinTotals[t].base += item.base.price;
          if (item.opts?.[0]?.price) clinTotals[t].opt1 += item.opts[0].price;
          if (item.opts?.[1]?.price) clinTotals[t].opt2 += item.opts[1].price;
          if (item.opts?.[2]?.price) clinTotals[t].opt3 += item.opts[2].price;
          if (item.opts?.[3]?.price) clinTotals[t].opt4 += item.opts[3].price;

          if (item.isLabor && item.base?.hrs > 0) {
            laborRowsHTML += `<tr><td>Base Year</td><td>${item.cat}</td><td>${formatNum(item.base.hrs)}</td><td>${formatCurrency(item.base.rate)}</td><td>${formatCurrency(item.base.price)}</td></tr>`;
          }
          if (!item.isLabor) {
            totalOdcsCost += item.base?.cost || 0;
            item.opts.forEach((o) => {
              totalOdcsCost += o?.cost || 0;
            });
          }
        });
      }

      const totalEvaluatedPrice =
        totalBasePrice + totalOpt1 + totalOpt2 + totalOpt3 + totalOpt4;

      const buildSec = (key, title, content, pageBreak = false) => {
        const isIncluded = docSections[key];
        const boxStyle = isIncluded
          ? ""
          : "color: red; border: 2px dashed red; padding: 15px; margin-bottom: 20px; opacity: 0.5; background: #fff5f5;";
        const cssClass = isIncluded ? "included-section" : "omitted-section";

        let html = `<div class="${cssClass}" style="${boxStyle}">`;
        if (!isIncluded) {
          html += `<div style="color: red; font-weight: bold; font-size: 12px; margin-bottom: 10px;">[OMITTED FROM EXPORT: ${title}]</div>`;
        }
        html += content;
        html += `</div>`;

        if (isIncluded && pageBreak) {
          html += `<hr class="included-section" style="page-break-after: always;" />`;
        }
        return html;
      };

      let templateHTML = `
        <h1 style="text-align: center;">Proposal for U.S. Government Contract</h1>
        <p><strong>Solicitation Number:</strong> [Solicitation Number]</p>
        <p><strong>Project / Requirement Title:</strong> ${projName}</p>
        <p><strong>Submitted To:</strong> ${customerName}</p>
        <p><strong>Submitted By:</strong> ${companyName}</p>
        <p><strong>Proposal Date:</strong> ${todayDate}</p>
        <p><strong>Proposal Version:</strong> [Version Number]</p>
        <p><strong>Offeror Legal Name:</strong> [Company Legal Name]</p>
        <p><strong>UEI:</strong> [UEI Number] | <strong>CAGE Code:</strong> [CAGE Code]</p>
        <p><strong>Address:</strong> [Company Address]</p>
        <p><strong>Authorized Representative:</strong> [Name, Title] | <strong>Email:</strong> [Email] | <strong>Phone:</strong> [Phone Number]</p>
        <hr />
        <h3>Document Control</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
          <tr><th>Version</th><th>Date</th><th>Description</th><th>Prepared By</th><th>Reviewed By</th></tr>
          <tr><td>Initial Draft</td><td>${todayDate}</td><td>Initial template generation</td><td>[Name]</td><td>[Name]</td></tr>
          <tr><td>Final Proposal</td><td>[Date]</td><td>Final review</td><td>[Name]</td><td>[Name]</td></tr>
        </table>
        <br/>
        <h3>Proposal Submission Checklist</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
          <tr><th>Item</th><th>Required?</th><th>Status</th><th>Notes</th></tr>
          <tr><td>Signed SF 33 / SF 1449 / Required Form</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
          <tr><td>Acknowledgement of Amendments</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
          <tr><td>Technical Proposal</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
          <tr><td>Past Performance Volume</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
          <tr><td>Price Proposal</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
          <tr><td>Representations and Certifications</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
          <tr><td>Compliance Matrix</td><td>Yes / No</td><td>Pending</td><td>[Notes]</td></tr>
        </table>
        <hr style="page-break-after: always;" />
      `;

      templateHTML += buildSec(
        "coverLetter",
        "Cover Letter",
        `
        <h2>Cover Letter</h2>
        <p><strong>Date:</strong> ${todayDate}</p>
        <p><strong>To:</strong> [Contracting Officer Name], [Agency Name], [Agency Address]</p>
        <p><strong>Subject:</strong> Proposal Submission for Solicitation No. [Solicitation Number]</p>
        <p>Dear [Contracting Officer Name],</p>
        <p>${companyName} is pleased to submit this proposal in response to Solicitation No. [Solicitation Number] for ${projName}. We have reviewed the solicitation, including all amendments, and submit this proposal in accordance with the instructions provided in the solicitation.</p>
        <p>${companyName} confirms that this proposal is valid for [Number] calendar days from the proposal submission date, unless otherwise specified in the solicitation.</p>
        <p>Our company is registered in SAM.gov and provides the following identifying information:</p>
        <ul>
          <li><strong>Legal Business Name:</strong> [Company Legal Name]</li>
          <li><strong>UEI:</strong> [UEI]</li>
          <li><strong>CAGE Code:</strong> [CAGE Code]</li>
          <li><strong>NAICS Code:</strong> [NAICS Code]</li>
          <li><strong>Business Size / Set-Aside Status:</strong> [Small Business / 8(a) / SDVOSB / WOSB / HUBZone / Other]</li>
        </ul>
        <p>Please contact [Contact Name] at [Email] or [Phone] regarding this proposal.</p>
        <p>Sincerely,<br/>[Authorized Signatory Name]<br/>[Title]<br/>${companyName}</p>
      `,
        true,
      );

      templateHTML += buildSec(
        "vol1Admin",
        "Volume I: Administrative Information",
        `
        <h2>Volume I: Administrative Information</h2>
        <h3>1.1 Offeror Information</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
          <tr><td><strong>Legal Business Name</strong></td><td>${companyName}</td></tr>
          <tr><td><strong>Doing Business As</strong></td><td>[DBA, if applicable]</td></tr>
          <tr><td><strong>UEI / CAGE Code</strong></td><td>[UEI] / [CAGE Code]</td></tr>
          <tr><td><strong>TIN / EIN</strong></td><td>[TIN / EIN]</td></tr>
          <tr><td><strong>SAM.gov Registration</strong></td><td>Active / Pending / Expiration Date: [Date]</td></tr>
          <tr><td><strong>NAICS Code / Business Size</strong></td><td>[NAICS] / [Small / Other Than Small]</td></tr>
          <tr><td><strong>Authorized Representative</strong></td><td>[Name, Title, Email, Phone]</td></tr>
        </table>
        <br/>
        <h3>1.2 Solicitation Information</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
          <tr><td><strong>Solicitation Number</strong></td><td>[Solicitation Number]</td></tr>
          <tr><td><strong>Agency / Contracting Office</strong></td><td>${customerName} / [Contracting Office]</td></tr>
          <tr><td><strong>Contract Type</strong></td><td>${contractType}</td></tr>
          <tr><td><strong>Set-Aside</strong></td><td>[Full and Open / Small Business / 8(a) / SDVOSB / Other]</td></tr>
          <tr><td><strong>Period of Performance</strong></td><td>${periodOfPerf}</td></tr>
          <tr><td><strong>Proposal Due Date</strong></td><td>[Due Date and Time]</td></tr>
          <tr><td><strong>Submission Method</strong></td><td>[SAM.gov / Email / Procurement Portal / Other]</td></tr>
        </table>
        <br/>
        <h3>1.3 Amendment Acknowledgement</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
          <tr><th>Amendment Number</th><th>Date</th><th>Acknowledged?</th><th>Notes</th></tr>
          <tr><td>0001</td><td>[Date]</td><td>Yes / No</td><td>[Notes]</td></tr>
        </table>
        <br/>
        <h3>Compliance Matrix</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
          <tr><th>Solicitation Reference</th><th>Requirement</th><th>Proposal Response Location</th><th>Status</th></tr>
          <tr><td>Section L, [Reference]</td><td>[Requirement Description]</td><td>[Volume / Section / Page]</td><td>Compliant</td></tr>
          <tr><td>Section M, [Reference]</td><td>[Evaluation Factor]</td><td>[Volume / Section / Page]</td><td>Compliant</td></tr>
          <tr><td>PWS Section [Reference]</td><td>[Technical Requirement]</td><td>[Volume / Section / Page]</td><td>Compliant</td></tr>
        </table>
      `,
        true,
      );

      templateHTML += buildSec(
        "vol2Tech",
        "Volume II: Technical Proposal",
        `
        <h2>Volume II: Technical Proposal</h2>
        <h3>2.1 Understanding of Requirements</h3>
        <p>${companyName} understands that ${customerName} requires [brief description of requirement]. The objective of this effort is to [describe the agency mission need, project goal, or service requirement]. Our understanding is based on the solicitation, Performance Work Statement / Statement of Work, attachments, amendments, and any government responses to questions.</p>
        <h3>2.2 Technical Approach</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
          <tr><th>PWS/SOW Requirement</th><th>Proposed Approach</th><th>Expected Outcome</th></tr>
          <tr><td>[Requirement 1]</td><td>[Approach]</td><td>[Outcome]</td></tr>
          <tr><td>[Requirement 2]</td><td>[Approach]</td><td>[Outcome]</td></tr>
        </table>
        <h3>2.3 Work Plan</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
          <tr><th>Task Description</th><th>Responsible Role</th><th>Deliverable</th><th>Timeline</th></tr>
          <tr><td>[Task 1]</td><td>[Role]</td><td>[Deliverable Name]</td><td>[Timeline / Due Date]</td></tr>
          <tr><td>[Task 2]</td><td>[Role]</td><td>[Deliverable Name]</td><td>[Timeline / Due Date]</td></tr>
        </table>
        <h3>2.4 Deliverables</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
          <tr><th>Deliverable Name</th><th>Description</th><th>Frequency</th><th>Due Date</th></tr>
          <tr><td>[Deliverable Name]</td><td>[Description]</td><td>[One-time / Monthly / Quarterly]</td><td>[Due Date]</td></tr>
        </table>
        <h3>2.5 Quality Control Approach</h3>
        <p>[Describe how your company will monitor quality, review deliverables, correct deficiencies, and ensure compliance with contract requirements.]</p>
        <h3>2.6 Risk Management</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
          <tr><th>Risk</th><th>Impact</th><th>Mitigation Strategy</th><th>Owner</th></tr>
          <tr><td>[Risk 1]</td><td>[Low / Medium / High]</td><td>[Mitigation]</td><td>[Owner]</td></tr>
        </table>
      `,
        true,
      );

      templateHTML += buildSec(
        "vol3Mgmt",
        "Volume III: Management and Staffing Plan",
        `
        <h2>Volume III: Management and Staffing Plan</h2>
        <h3>3.1 Management Approach & Organization</h3>
        <p>[Describe your project management structure, communication process, government coordination, reporting, issue escalation, and contract oversight. Insert organization chart or describe team structure.]</p>
        <h3>3.2 Key Personnel & Staffing Plan</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
          <tr><th>Name / Labor Category</th><th>Role / Responsibilities</th><th>Qualifications / FTEs</th><th>Availability / Hours</th></tr>
          <tr><td>[Name / Labor Category]</td><td>[Role / Responsibilities]</td><td>[Qualifications / FTE]</td><td>[Availability / Estimated Hours]</td></tr>
        </table>
        <h3>3.3 Transition Plan</h3>
        <p>[Describe transition-in activities, onboarding, knowledge transfer, staffing readiness, government coordination, and schedule.]</p>
      `,
        true,
      );

      templateHTML += buildSec(
        "vol4PastPerf",
        "Volume IV: Past Performance",
        `
        <h2>Volume IV: Past Performance</h2>
        <p>The following past performance references demonstrate relevant and recent experience similar in size, scope, and complexity to the current requirement.</p>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
          <tr><td><strong>Customer / Agency</strong></td><td>[Customer Name]</td></tr>
          <tr><td><strong>Contract Number / Title</strong></td><td>[Contract Number] - [Contract Title]</td></tr>
          <tr><td><strong>Period of Performance</strong></td><td>[Start Date - End Date]</td></tr>
          <tr><td><strong>Contract Value / Type</strong></td><td>$[Value] - [FFP / T&M / Cost Plus / Other]</td></tr>
          <tr><td><strong>Scope Summary</strong></td><td>[Brief scope summary]</td></tr>
          <tr><td><strong>Relevance</strong></td><td>[Explain similarity to current solicitation]</td></tr>
          <tr><td><strong>Customer Contact</strong></td><td>[Name, Title, Email, Phone]</td></tr>
          <tr><td><strong>CPARS / Performance Rating</strong></td><td>[Rating, if available]</td></tr>
        </table>
      `,
        true,
      );

      let clinHTML = `<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;"><tr><th>Period</th><th>CLIN (Project Task)</th><th>Description</th><th>Total Price</th></tr>`;
      Object.keys(clinTotals).forEach((task) => {
        const ct = clinTotals[task];
        clinHTML += `
              <tr><td>Base Year</td><td>${task}</td><td>Labor Services & ODCs</td><td>${formatCurrency(ct.base)}</td></tr>
              <tr><td>Base Year</td><td>${task}</td><td>Labor Services & ODCs</td><td>${formatCurrency(ct.base)}</td></tr>
              <tr><td>Option Year 1</td><td>${task}</td><td>Labor Services  & ODCs </td><td>${formatCurrency(ct.opt1)}</td></tr>
              <tr><td>Option Year 2</td><td>${task}</td><td>Labor Services  & ODCs</td><td>${formatCurrency(ct.opt2)}</td></tr>
              <tr><td>Option Year 3</td><td>${task}</td><td>Labor Services  & ODCs</td><td>${formatCurrency(ct.opt3)}</td></tr>
              <tr><td>Option Year 4</td><td>${task}</td><td>Labor Services  & ODCs</td><td>${formatCurrency(ct.opt4)}</td></tr>
            `;
      });
      clinHTML += `</table>`;

      let vol5HTML = `<h2>Volume V: Price Proposal</h2>`;
      vol5HTML += buildSec(
        "sec5_1",
        "5.1 Price Summary",
        `<h3>5.1 Price Summary</h3><table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;"><tr><th>Period</th><th>Total Price</th></tr><tr><td>Base Year</td><td>${formatCurrency(totalBasePrice)}</td></tr><tr><td>Option Year 1</td><td>${formatCurrency(totalOpt1)}</td></tr><tr><td>Option Year 2</td><td>${formatCurrency(totalOpt2)}</td></tr><tr><td>Option Year 3</td><td>${formatCurrency(totalOpt3)}</td></tr><tr><td>Option Year 4</td><td>${formatCurrency(totalOpt4)}</td></tr><tr><td>Other Direct Costs (ODCs)</td><td>${formatCurrency(totalOdcsCost)}</td></tr><tr><td><strong>Revenue</strong></td><td><strong>${formatCurrency(totalEvaluatedPrice)}</strong></td></tr></table><br/>`,
      );
      vol5HTML += buildSec(
        "sec5_2",
        "5.2 CLIN Pricing",
        `<h3>5.2 CLIN Pricing</h3>${clinHTML}<br/>`,
      );
      vol5HTML += buildSec(
        "sec5_3",
        "5.3 Labor Pricing Detail",
        `<h3>5.3 Labor Pricing Detail</h3><table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;"><tr><th>Period</th><th>Labor Category</th><th>Hours</th><th>Fully Burdened Rate</th><th>Total</th></tr>${laborRowsHTML || '<tr><td colspan="5" style="text-align: center;">No labor hours forecasted</td></tr>'}</table><br/>`,
      );
      vol5HTML += buildSec(
        "sec5_4",
        "5.4 Other Direct Costs (ODCs)",
        `<h3>5.4 Other Direct Costs (ODCs)</h3><table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;"><tr><th>Expense Type</th><th>Total Evaluated Cost</th></tr><tr><td>Project Non-Labor / ODC Expenses</td><td>${formatCurrency(totalOdcsCost)}</td></tr></table><br/>`,
      );
      vol5HTML += buildSec(
        "sec5_5",
        "5.5 Basis of Estimate",
        `<h3>5.5 Basis of Estimate</h3><p>Pricing is derived directly from live forecast database calculations including applicable fringe, overhead, and G&A pools.</p>`,
      );
      vol5HTML += buildSec(
        "sec5_6",
        "5.6 Pricing Assumptions",
        `<h3>5.6 Pricing Assumptions</h3><p>The proposed period of performance aligns with forecast schedule specifications.</p>`,
      );
      vol5HTML += buildSec(
        "sec5_7",
        "5.7 Exceptions",
        `<h3>5.7 Exceptions</h3><p>No exceptions are taken to the solicitation requirements.</p>`,
      );

      templateHTML += buildSec(
        "vol5Price",
        "Volume V: Price Proposal",
        vol5HTML,
        true,
      );

      templateHTML += buildSec(
        "repsAndCerts",
        "Reps & Certs",
        `
        <h2>Representations, Certifications, and Required Forms</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
          <tr><th>Form / Certification</th><th>Included?</th><th>Notes</th></tr>
          <tr><td>SAM.gov Representations and Certifications</td><td>Yes / No</td><td>[Notes]</td></tr>
          <tr><td>SF 33 / SF 1449 / Other Solicitation Form</td><td>Yes / No</td><td>[Notes]</td></tr>
          <tr><td>Amendment Acknowledgements</td><td>Yes / No</td><td>[Notes]</td></tr>
          <tr><td>Small Business Certification</td><td>Yes / No</td><td>[Notes]</td></tr>
          <tr><td>Subcontracting Plan, if required</td><td>Yes / No / N/A</td><td>[Notes]</td></tr>
        </table>
        <br/><br/>
        <h3>Authorized Signature</h3>
        <p>By signing below, the authorized representative certifies that the information provided in this proposal is accurate to the best of their knowledge and that the proposal is submitted in accordance with the solicitation requirements.</p>
        <p><br/><br/><strong>Signature:</strong> ______________________________ &nbsp;&nbsp;&nbsp; <strong>Date:</strong> ${todayDate}</p>
        <p><strong>Authorized Representative Name:</strong> [Name]</p>
        <p><strong>Title:</strong> [Title]</p>
        <p><strong>Company:</strong> ${companyName}</p>
      `,
        false,
      );

      setProPricerContent(templateHTML);
    }
  }, [
    activeTab,
    selectedProject,
    projectSearchResults,
    docSections,
    categoryTableData,
    validNonLabor,
  ]);

  // ==========================================
  // SORTING LOGIC
  // ==========================================
  const sortedData = useMemo(() => {
    let sortableItems = [];
    if (activeTab === "Performance By Category")
      sortableItems = [...categoryTableData];
    else if (activeTab === "Performance By Employee")
      sortableItems = [...laborPerformanceData];
    else if (activeTab === "Employee Wrap Rate")
      sortableItems = [...employeeWrapRateData];
    else if (activeTab === "Labor Dollar Burn Rate")
      sortableItems = [...laborDollarBurnData];
    else if (activeTab === "Labor Hours Burn Rate")
      sortableItems = [...laborHoursBurnData];
    else if (activeTab === "Labor") sortableItems = [...laborTableData];
    else if (activeTab === "Non-Labor") sortableItems = [...nonLaborTableData];

    if (activeTab === "Non-Labor" && sortConfig.key === null) {
      sortableItems.sort((a, b) => {
        const av = String(a.vendorName || "").trim();
        const bv = String(b.vendorName || "").trim();

        // rows WITH a vendor name come first
        if (av && !bv) return -1;
        if (!av && bv) return 1;

        // both have vendors: alphabetical by vendor, then by task
        if (av && bv) {
          const byVendor = av.localeCompare(bv, undefined, {
            numeric: true,
            sensitivity: "base",
          });
          if (byVendor !== 0) return byVendor;
        }
        return String(a.task || "").localeCompare(
          String(b.task || ""),
          undefined,
          { numeric: true },
        );
      });
    }

    if (sortConfig.key !== null && sortableItems.length > 0) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key] || "";
        let bVal = b[sortConfig.key] || "";
        if (aVal.toString().toLowerCase() < bVal.toString().toLowerCase())
          return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal.toString().toLowerCase() > bVal.toString().toLowerCase())
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [
    categoryTableData,
    laborTableData,
    nonLaborTableData,
    laborPerformanceData,
    employeeWrapRateData,
    laborDollarBurnData,
    laborHoursBurnData,
    sortConfig,
    activeTab,
  ]);

  const paginated =
    activeTab === "Dashboard" ||
    activeTab === "Employee Wrap Rate" ||
    activeTab === "Labor Dollar Burn Rate" ||
    activeTab === "Labor Hours Burn Rate" ||
    activeTab === "Performance By Elements" ||
    activeTab === "Proposal Package" ||
    activeTab === "DFARS Adequacy Checklist"
      ? []
      : (sortedData || []).slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage,
        );

  const isLaborPerf = activeTab === "Performance By Employee";
  const isPerfTab = activeTab === "Performance By Category" || isLaborPerf;

  return (
    <div className="bg-white h-screen font-sans text-[13px] text-gray-800 flex flex-col">
      <div className="sticky top-0 z-50 flex flex-col w-full shadow-md bg-white">
        {/* Top Ribbon / Toolbar */}
        <div className="flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center px-4 py-3 bg-gray-50 border-b border-gray-300 gap-4 2xl:gap-2">
          <div className="flex items-center gap-2">
            <ChartNoAxesCombined className="text-green-700 h-5 w-5" />
            <h1 className="text-base font-bold text-gray-900">
              Project Performance
            </h1>
          </div>

          <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3">
            {/* Project ID Filter Area (search is applied only on button click / Enter) */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm text-xs">
              <label className="flex items-center gap-2 ml-4 cursor-pointer">
                <span className="text-sm font-medium">
                  Include Indirect Project
                </span>

                <button
                  type="button"
                  onClick={() => setIncludeIndirectProjects((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    includeIndirectProjects ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      includeIndirectProjects
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </label>
              <span className="font-semibold text-gray-700 tracking-wider">
                Project:
              </span>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={projectInput}
                  onChange={(e) => {
                    setProjectInput(e.target.value);
                    setShowProjectDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  onFocus={() => {
                    if (projectSearchResults.length > 0)
                      setShowProjectDropdown(true);
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowProjectDropdown(false), 200)
                  }
                  className="w-48 border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-green-600 font-bold text-gray-800"
                  placeholder="e.g. C1800..."
                  autoComplete="off"
                />
                {showProjectDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-72 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-xl z-50">
                    {isSearchingProject ? (
                      <div className="px-3 py-2 text-xs text-gray-500 italic">
                        Searching...
                      </div>
                    ) : !Array.isArray(projectSearchResults) ||
                      projectSearchResults.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-gray-500">
                        No matching projects
                      </div>
                    ) : (
                      projectSearchResults.map((proj) => (
                        <div
                          key={proj.projectId}
                          className="px-3 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-0"
                          onMouseDown={() => {
                            // Only fills the input. Click "Search" to apply.
                            setProjectInput(proj.projectId);
                            setShowProjectDropdown(false);
                          }}
                        >
                          <div className="font-bold text-gray-800 text-xs">
                            {proj.projectId}
                          </div>
                          <div className="text-gray-500 text-[10px] truncate">
                            {proj.name}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold rounded shadow-sm transition-colors focus:outline-none"
                title="Apply project filter"
              >
                <Search size={12} />
                Search
              </button>
              {(selectedProject || projectInput) && (
                <button
                  onClick={handleClearSearch}
                  className="flex items-center gap-1 px-2 py-1 border border-gray-300 text-gray-600 hover:bg-gray-100 text-[11px] font-bold rounded transition-colors focus:outline-none"
                  title="Clear project filter"
                >
                  <X size={12} />
                  Clear
                </button>
              )}
            </div>

            {/* NEW: Burden Template Dropdown */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm text-xs">
              <span className="font-semibold text-gray-700 tracking-wider">
                Template:
              </span>
              <select
                value={targetTemplateId}
                onChange={(e) => setTargetTemplateId(e.target.value)}
                className="border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-green-600 font-bold text-gray-800 bg-gray-50 cursor-pointer"
              >
                {templates.map((tpl) => (
                  <option key={tpl.id} value={String(tpl.id)}>
                    {tpl.templateCode ||
                      tpl.templateName ||
                      `Template ${tpl.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* NEW: Fee Input */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm text-xs">
              <span className="font-semibold text-gray-700 tracking-wider">
                Fee (%):
              </span>
              <input
                type="number"
                step="0.01"
                value={globalFee}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val.includes(".")) {
                    val = val.substring(0, val.indexOf(".") + 3);
                  }
                  setGlobalFee(val);
                }}
                className="w-16 border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-green-600 font-bold text-gray-800 bg-gray-50 text-center"
              />
            </div>

            {/* Escalation Config Area (Expandable Panel) */}
            <div className="relative">
              <button
                onClick={() => setShowEscalationPanel(!showEscalationPanel)}
                className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm text-xs font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                <span>Override Escalations</span>
                <ChevronDown
                  size={14}
                  className={`transform transition-transform ${showEscalationPanel ? "rotate-180" : ""}`}
                />
              </button>

              {showEscalationPanel && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-2xl z-50 w-[600px] p-4">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800 text-sm">
                        Escalation Rates by Pool
                      </h3>
                      <button
                        onClick={() =>
                          setShowEscalationInfo(!showEscalationInfo)
                        }
                        className="text-blue-500 hover:text-blue-700 transition-colors focus:outline-none"
                        title="How Escalation Works"
                      >
                        <Info size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowEscalationPanel(false)}
                      className="text-gray-400 hover:text-gray-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {showEscalationInfo && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-800 shadow-inner">
                      <p className="font-bold mb-1 text-blue-900">
                        How Escalation is Applied:
                      </p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>
                          <strong>Month-by-Month Precision:</strong> Escalation
                          isn't a flat annual bump; it triggers exactly within
                          your chosen Start and End months.
                        </li>
                        <li>
                          <strong>Active Window:</strong> The percentage you
                          enter is applied as a flat bump to every single month
                          that falls inside your selected timeframe.
                        </li>
                        <li>
                          <strong>Blended Averages:</strong> The 'Adjusted
                          Rates' generated in your Excel exports are
                          mathematically blended annual averages. This allows
                          users to manually edit Hours/Costs in Excel without
                          breaking the math.
                        </li>
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 p-1 rounded-md inline-flex">
                      <button
                        onClick={() => setIsEscalationCustom(false)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-sm transition-colors ${!isEscalationCustom ? "bg-white shadow-sm text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        Uniform Rate (Apply to All)
                      </button>
                      <button
                        onClick={() => setIsEscalationCustom(true)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-sm transition-colors ${isEscalationCustom ? "bg-white shadow-sm text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        Custom Rates per Pool
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[50vh] overflow-y-auto pr-2">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-200">
                          <th className="pb-2 font-semibold w-1/4">
                            Pool Name
                          </th>
                          <th className="pb-2 font-semibold">Rate %</th>
                          <th className="pb-2 font-semibold">
                            From (Month / Year)
                          </th>
                          <th className="pb-2 font-semibold">
                            To (Month / Year)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(!isEscalationCustom
                          ? [{ key: "All", label: "All Pools" }]
                          : [
                              { key: "aeroFringe", label: "AERO Fringe" },
                              { key: "nasaFringe", label: "NASA/NIH Fringe" },
                              { key: "custOH", label: "Customer Site OH" },
                              // { key: "columbusOH", label: "Columbus Site OH" },
                              { key: "columbusOH", label: "Off - Site OH" },
                              { key: "subkMH", label: "Subk M&H" },
                              { key: "ga", label: "G&A" },
                            ]
                        ).map((pool) => (
                          <tr
                            key={pool.key}
                            className={`border-b border-gray-100 ${!isEscalationCustom ? "bg-indigo-50/30" : "hover:bg-gray-50"}`}
                          >
                            <td
                              className={`py-2 pr-2 ${!isEscalationCustom ? "font-bold text-indigo-700" : "font-medium text-gray-700"}`}
                            >
                              {pool.label}
                            </td>
                            <td className="py-2 pr-2">
                              <input
                                type="number"
                                value={draftEscalations[pool.key].rate}
                                onChange={(e) =>
                                  handleDraftChange(
                                    pool.key,
                                    "rate",
                                    e.target.value,
                                  )
                                }
                                className="w-14 border border-gray-300 rounded px-1 py-1 text-center focus:outline-none focus:border-green-600 font-bold text-gray-800"
                              />
                            </td>
                            <td className="py-2 pr-2">
                              <div className="flex gap-1">
                                <select
                                  value={draftEscalations[pool.key].fromM}
                                  onChange={(e) =>
                                    handleDraftChange(
                                      pool.key,
                                      "fromM",
                                      e.target.value,
                                    )
                                  }
                                  className="border border-gray-300 rounded bg-gray-50 px-1 py-1 outline-none cursor-pointer"
                                >
                                  {months.map((m, i) => (
                                    <option
                                      key={m}
                                      value={String(i + 1).padStart(2, "0")}
                                    >
                                      {m}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  value={draftEscalations[pool.key].fromY}
                                  onChange={(e) =>
                                    handleDraftChange(
                                      pool.key,
                                      "fromY",
                                      e.target.value,
                                    )
                                  }
                                  className="border border-gray-300 rounded bg-gray-50 px-1 py-1 outline-none cursor-pointer"
                                >
                                  {OPTION_YEARS.map((y) => (
                                    <option key={y} value={y}>
                                      {y}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="flex gap-1">
                                <select
                                  value={draftEscalations[pool.key].toM}
                                  onChange={(e) =>
                                    handleDraftChange(
                                      pool.key,
                                      "toM",
                                      e.target.value,
                                    )
                                  }
                                  className="border border-gray-300 rounded bg-gray-50 px-1 py-1 outline-none cursor-pointer"
                                >
                                  {months.map((m, i) => (
                                    <option
                                      key={m}
                                      value={String(i + 1).padStart(2, "0")}
                                    >
                                      {m}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  value={draftEscalations[pool.key].toY}
                                  onChange={(e) =>
                                    handleDraftChange(
                                      pool.key,
                                      "toY",
                                      e.target.value,
                                    )
                                  }
                                  className="border border-gray-300 rounded bg-gray-50 px-1 py-1 outline-none cursor-pointer"
                                >
                                  {OPTION_YEARS.map((y) => (
                                    <option key={y} value={y}>
                                      {y}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end gap-3">
                    <button
                      onClick={() => setShowEscalationPanel(false)}
                      className="px-4 py-2 border border-gray-300 rounded text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={resetEscalations}
                      className="px-4 py-2 border border-green-600 text-green-600 hover:bg-green-50 rounded text-xs font-bold transition-colors shadow-sm"
                    >
                      Reset Rates
                    </button>
                    <button
                      onClick={applyEscalations}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold transition-colors shadow-sm"
                    >
                      Apply Escalations
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Year Visibility Toggles */}
            <div className="flex items-center gap-3 bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm text-xs">
              <span className="font-semibold text-gray-700  tracking-wider">
                Years:
              </span>
              <div className="inline-flex rounded-md shadow-sm">
                {ALL_YEARS.map((y, index) => {
                  const isActive = visibleYears.includes(y);
                  const isFirst = index === 0;
                  const isLast = index === ALL_YEARS.length - 1;
                  const label =
                    y === BASE_YEAR
                      ? "Base Year"
                      : `Option Year ${OPTION_YEARS.indexOf(y) + 1}`;

                  return (
                    <button
                      key={y}
                      onClick={() => toggleYear(y)}
                      title={`Toggle ${y}`}
                      className={`
                      relative px-3 py-1 text-[11px] font-bold border transition-all focus:outline-none
                      ${isFirst ? "rounded-l-md" : "-ml-px"}
                      ${isLast ? "rounded-r-md" : ""}
                      ${
                        isActive
                          ? "bg-green-600 text-white border-green-600 z-10"
                          : "bg-gray-50 text-gray-500 border-gray-300 hover:bg-gray-200 hover:text-gray-800 z-0"
                      }
                    `}
                    >
                      {label}{" "}
                      <span
                        className={`font-medium ml-0.5 ${isActive ? "text-green-200" : "text-gray-400"}`}
                      >
                        '{y.slice(-2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Labor Metrics Toggles */}
            {activeTab === "Labor" && (
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 border border-gray-300 rounded shadow-sm text-xs">
                <span className="font-semibold text-gray-700  tracking-wider">
                  Show:
                </span>
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() =>
                      setLaborMetrics((p) => ({ ...p, hrs: !p.hrs }))
                    }
                    className={`relative px-3 py-1 text-[11px] font-bold border transition-all focus:outline-none rounded-l-md -ml-px ${laborMetrics.hrs ? "bg-green-600 text-white border-green-600 z-10" : "bg-gray-50 text-gray-500 border-gray-300 hover:bg-gray-200 z-0"}`}
                  >
                    Hours
                  </button>
                  <button
                    onClick={() =>
                      setLaborMetrics((p) => ({ ...p, amt: !p.amt }))
                    }
                    className={`relative px-3 py-1 text-[11px] font-bold border transition-all focus:outline-none rounded-r-md ${laborMetrics.amt ? "bg-green-600 text-white border-green-600 z-10" : "bg-gray-50 text-gray-500 border-gray-300 hover:bg-gray-200 z-0"}`}
                  >
                    Amount
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TAB NAVIGATION & ACTION BAR */}
        <div className="flex justify-between items-center px-4 pt-2 pb-2 bg-white">
          <div className="flex bg-gray-100 border-b border-gray-300 px-2 pt-2 gap-1 overflow-x-auto">
            {[
              "Dashboard",
              "Performance By Elements",
              "Performance By Category",
              "Performance By Employee",
              "Employee Wrap Rate",
              "Labor Dollar Burn Rate",
              "Labor Hours Burn Rate",
              "Labor",
              "Non-Labor",
            ].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTab(t);
                  setCurrentPage(1);
                  setSortConfig({ key: null, direction: "asc" });
                }}
                className={`px-4 py-1.5 rounded-t-md border-t border-l border-r text-sm whitespace-nowrap transition-colors ${
                  activeTab === t
                    ? "bg-white font-bold text-green-800 border-gray-300 relative top-[1px] z-10 shadow-[0_-2px_0_0_#166534]"
                    : "bg-gray-200 text-gray-600 border-transparent hover:bg-gray-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {activeTab === "Proposal Package" ? (
            <button
              onClick={exportDocumentToPDF}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Document (PDF)</span>
            </button>
          ) : activeTab === "DFARS Adequacy Checklist" ||
            activeTab === "Dashboard" ? (
            <button
              disabled
              className="flex items-center space-x-1.5 px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded cursor-not-allowed"
            >
              <span>Export Disabled</span>
            </button>
          ) : (
            <button
              onClick={exportToExcel}
              className="flex items-center space-x-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded shadow-sm transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Export to Excel</span>
            </button>
          )}
        </div>
      </div>
      {/* END STICKY TOP REGION */}

      {/* Spreadsheet Grid Container */}
      <div className="flex-1 min-h-0 bg-gray-200 p-2 overflow-hidden flex flex-col">
        {activeTab === "Dashboard" ? (
          <div className="flex-1 overflow-auto bg-slate-100 p-6 flex flex-col gap-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-full text-gray-500 font-bold">
                Loading Dashboard Data...
              </div>
            ) : dashboardStats ? (
              <>
                {/* View Toggles */}
                <div className="flex bg-white rounded-md shadow-sm border border-gray-200 p-1 w-max">
                  {["Overview", "Labor Categories", "Employees", "Vendors"].map(
                    (view) => (
                      <button
                        key={view}
                        onClick={() => setDashboardView(view)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-sm transition-all ${dashboardView === view ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                      >
                        {view}
                      </button>
                    ),
                  )}
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col justify-center items-center text-center">
                    <h3 className="text-gray-500 text-xs font-bold  tracking-wider mb-1">
                      Revenue
                    </h3>
                    <p className="text-2xl font-black text-green-700">
                      {formatCurrency(dashboardStats.totalEvaluatedPrice)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col justify-center items-center text-center">
                    <h3 className="text-gray-500 text-xs font-bold  tracking-wider mb-1">
                      Total Direct Cost
                    </h3>
                    <p className="text-2xl font-black text-blue-600">
                      {formatCurrency(dashboardStats.totalDir)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col justify-center items-center text-center">
                    <h3 className="text-gray-500 text-xs font-bold  tracking-wider mb-1">
                      Total Burden Cost
                    </h3>
                    <p className="text-2xl font-black text-amber-500">
                      {formatCurrency(dashboardStats.totalBurd)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col justify-center items-center text-center">
                    <h3 className="text-gray-500 text-xs font-bold  tracking-wider mb-1">
                      Total Fee ({Number(globalFee).toFixed(2)}%)
                    </h3>
                    <p className="text-2xl font-black text-purple-600">
                      {formatCurrency(dashboardStats.totalFee)}
                    </p>
                  </div>
                </div>

                {/* Dynamic Charts Area */}
                {dashboardView === "Overview" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[350px]">
                    {/* Cost Breakdown Nested Pie Chart */}
                    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col relative">
                      <h3 className="text-gray-700 font-bold mb-4">
                        Cost Breakdown
                      </h3>
                      <div className="flex-1 w-full relative flex items-center justify-between">
                        <ResponsiveContainer width="100%" height={350}>
                          <PieChart>
                            <RechartsTooltip
                              formatter={(value) => formatCurrency(value)}
                            />

                            {/* Primary Pie (Left) */}
                            <Pie
                              data={dashboardStats.primaryPieData}
                              cx="30%"
                              cy="50%"
                              outerRadius={100}
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) =>
                                percent > 0.05
                                  ? `${name} ${(percent * 100).toFixed(0)}%`
                                  : ""
                              }
                            >
                              {dashboardStats.primaryPieData.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                                  />
                                ),
                              )}
                            </Pie>

                            {/* Secondary Pie (Burden Pools - Right) */}
                            <Pie
                              data={dashboardStats.secondaryPieData}
                              cx="75%"
                              cy="50%"
                              innerRadius={20}
                              outerRadius={90}
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) =>
                                percent > 0.02
                                  ? `${name} ${(percent * 100).toFixed(0)}%`
                                  : ""
                              }
                            >
                              {dashboardStats.secondaryPieData.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.fill}
                                  />
                                ),
                              )}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>

                        {/* Visual Connector Overlay */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="flex flex-col items-center justify-left text-amber-500 bg-white/80 p-1 rounded-full shadow-sm ml-6">
                            <span className="text-[8px] font-bold tracking-normal text-gray-500 leading-tight text-center">
                              Burden
                              <br />
                              Breakdown
                            </span>
                            <ArrowRight size={12} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Year-over-Year Stacked Bar Chart */}
                    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col">
                      <h3 className="text-gray-700 font-bold mb-4">
                        Evaluated Price by Year
                      </h3>
                      <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height={350}>
                          <BarChart
                            data={dashboardStats.barData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#E5E7EB"
                            />
                            <XAxis
                              dataKey="name"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "#6B7280", fontSize: 12 }}
                            />
                            <YAxis
                              tickFormatter={(value) =>
                                `$${(value / 1000).toFixed(0)}k`
                              }
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "#6B7280", fontSize: 12 }}
                            />
                            <RechartsTooltip
                              formatter={(value) => formatCurrency(value)}
                              cursor={{ fill: "#F3F4F6" }}
                            />
                            <Legend />
                            <Bar
                              dataKey="Direct Cost"
                              stackId="a"
                              fill="#3b82f6"
                              radius={[0, 0, 4, 4]}
                            />
                            <Bar dataKey="Burden" stackId="a" fill="#f59e0b" />
                            <Bar
                              dataKey="Fee"
                              stackId="a"
                              fill="#8b5cf6"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {dashboardView === "Labor Categories" && (
                  <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col">
                    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                      <div>
                        <h3 className="text-gray-700 font-bold">
                          Labor Categories
                        </h3>
                        {/* <p className="text-xs text-gray-500 mt-1">
                          Select a labor category to view its pricing and hours
                          details.
                        </p> */}
                      </div>
                      <select
                        value={selectedDashboardFilter.laborCategory}
                        onChange={(e) =>
                          setSelectedDashboardFilter((prev) => ({
                            ...prev,
                            laborCategory: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded px-3 py-2 text-sm bg-white min-w-[220px]"
                      >
                        <option value="">All Labor Categories</option>
                        {dashboardStats.plcData.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 w-full relative">
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={dashboardStats.plcData}
                            dataKey="Price"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={145}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(1)}%`
                            }
                            onClick={(data) => {
                              const name =
                                data?.name || data?.payload?.name || "";
                              setSelectedDashboardFilter((prev) => ({
                                ...prev,
                                laborCategory: name,
                              }));
                            }}
                          >
                            {dashboardStats.plcData.map((entry, index) => (
                              <Cell
                                key={`plc-${index}`}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                                stroke={
                                  selectedDashboardFilter.laborCategory ===
                                  entry.name
                                    ? "#111827"
                                    : "#fff"
                                }
                                strokeWidth={
                                  selectedDashboardFilter.laborCategory ===
                                  entry.name
                                    ? 3
                                    : 1
                                }
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value) => [
                              formatCurrency(value),
                              "Price",
                            ]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {dashboardDetailData && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-gray-200 pt-4">
                        <div className="rounded-md bg-indigo-50 p-3">
                          <div className="text-[11px] font-bold text-indigo-600 uppercase">
                            Selected Category
                          </div>
                          <div className="text-sm font-semibold text-gray-800 mt-1 break-words">
                            {dashboardDetailData.name}
                          </div>
                        </div>
                        <div className="rounded-md bg-blue-50 p-3">
                          <div className="text-[11px] font-bold text-blue-600 uppercase">
                            Price
                          </div>
                          <div className="text-lg font-bold text-gray-800 mt-1">
                            {formatCurrency(dashboardDetailData.Price)}
                          </div>
                        </div>
                        <div className="rounded-md bg-green-50 p-3">
                          <div className="text-[11px] font-bold text-green-600 uppercase">
                            Hours / Share
                          </div>
                          <div className="text-sm font-bold text-gray-800 mt-1">
                            {formatNum(dashboardDetailData.Hours)} hrs ·{" "}
                            {getDashboardDetailTotal() > 0
                              ? (
                                  (dashboardDetailData.Price /
                                    getDashboardDetailTotal()) *
                                  100
                                ).toFixed(1)
                              : "0.0"}
                            %
                          </div>
                        </div>
                        {renderDetailBreakdown(dashboardDetailData)}
                      </div>
                    )}
                  </div>
                )}

                {dashboardView === "Employees" && (
                  <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col">
                    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                      <div>
                        <h3 className="text-gray-700 font-bold">Employees</h3>
                        {/* <p className="text-xs text-gray-500 mt-1">
                          Select an employee to view pricing, hours, and share
                          of the displayed employee total.
                        </p> */}
                      </div>
                      <select
                        value={selectedDashboardFilter.employee}
                        onChange={(e) =>
                          setSelectedDashboardFilter((prev) => ({
                            ...prev,
                            employee: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded px-3 py-2 text-sm bg-white min-w-[220px]"
                      >
                        <option value="">All Employees</option>
                        {dashboardStats.empData.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 w-full relative">
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={dashboardStats.empData}
                            dataKey="Price"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={145}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(1)}%`
                            }
                            onClick={(data) => {
                              const name =
                                data?.name || data?.payload?.name || "";
                              setSelectedDashboardFilter((prev) => ({
                                ...prev,
                                employee: name,
                              }));
                            }}
                          >
                            {dashboardStats.empData.map((entry, index) => (
                              <Cell
                                key={`emp-${index}`}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                                stroke={
                                  selectedDashboardFilter.employee ===
                                  entry.name
                                    ? "#111827"
                                    : "#fff"
                                }
                                strokeWidth={
                                  selectedDashboardFilter.employee ===
                                  entry.name
                                    ? 3
                                    : 1
                                }
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value) => [
                              formatCurrency(value),
                              "Price",
                            ]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {dashboardDetailData && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-gray-200 pt-4">
                        <div className="rounded-md bg-indigo-50 p-3">
                          <div className="text-[11px] font-bold text-indigo-600 ">
                            Selected Employee
                          </div>
                          <div className="text-sm font-semibold text-gray-800 mt-1 break-words">
                            {dashboardDetailData.name}
                          </div>
                        </div>
                        <div className="rounded-md bg-blue-50 p-3">
                          <div className="text-[11px] font-bold text-blue-600 ">
                            Price
                          </div>
                          <div className="text-lg font-bold text-gray-800 mt-1">
                            {formatCurrency(dashboardDetailData.Price)}
                          </div>
                        </div>
                        <div className="rounded-md bg-green-50 p-3">
                          <div className="text-[11px] font-bold text-green-600 ">
                            Hours / Share
                          </div>
                          <div className="text-sm font-bold text-gray-800 mt-1">
                            {formatNum(dashboardDetailData.Hours)} hrs ·{" "}
                            {getDashboardDetailTotal() > 0
                              ? (
                                  (dashboardDetailData.Price /
                                    getDashboardDetailTotal()) *
                                  100
                                ).toFixed(1)
                              : "0.0"}
                            %
                          </div>
                        </div>
                        {renderDetailBreakdown(dashboardDetailData)}
                      </div>
                    )}
                  </div>
                )}

                {dashboardView === "Vendors" && (
                  <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 flex flex-col">
                    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                      <div>
                        <h3 className="text-gray-700 font-bold">Vendors</h3>
                        {/* <p className="text-xs text-gray-500 mt-1">
                          Select a vendor to view its evaluated cost and share
                          of the displayed vendor total.
                        </p> */}
                      </div>
                      <select
                        value={selectedDashboardFilter.vendor}
                        onChange={(e) =>
                          setSelectedDashboardFilter((prev) => ({
                            ...prev,
                            vendor: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded px-3 py-2 text-sm bg-white min-w-[220px]"
                      >
                        <option value="">All Vendors</option>
                        {dashboardStats.vendorData.map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 w-full relative">
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={dashboardStats.vendorData}
                            dataKey="Price"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={145}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(1)}%`
                            }
                            onClick={(data) => {
                              const name =
                                data?.name || data?.payload?.name || "";
                              setSelectedDashboardFilter((prev) => ({
                                ...prev,
                                vendor: name,
                              }));
                            }}
                          >
                            {dashboardStats.vendorData.map((entry, index) => (
                              <Cell
                                key={`vendor-${index}`}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                                stroke={
                                  selectedDashboardFilter.vendor === entry.name
                                    ? "#111827"
                                    : "#fff"
                                }
                                strokeWidth={
                                  selectedDashboardFilter.vendor === entry.name
                                    ? 3
                                    : 1
                                }
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value) => [
                              formatCurrency(value),
                              "Price",
                            ]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {dashboardDetailData && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-gray-200 pt-4">
                        <div className="rounded-md bg-indigo-50 p-3">
                          <div className="text-[11px] font-bold text-indigo-600 uppercase">
                            Selected Vendor
                          </div>
                          <div className="text-sm font-semibold text-gray-800 mt-1 break-words">
                            {dashboardDetailData.name}
                          </div>
                        </div>
                        <div className="rounded-md bg-blue-50 p-3">
                          <div className="text-[11px] font-bold text-blue-600 uppercase">
                            Evaluated Cost
                          </div>
                          <div className="text-lg font-bold text-gray-800 mt-1">
                            {formatCurrency(dashboardDetailData.Price)}
                          </div>
                        </div>
                        <div className="rounded-md bg-green-50 p-3">
                          <div className="text-[11px] font-bold text-green-600 uppercase">
                            Share of Vendors
                          </div>
                          <div className="text-sm font-bold text-gray-800 mt-1">
                            {getDashboardDetailTotal() > 0
                              ? (
                                  (dashboardDetailData.Price /
                                    getDashboardDetailTotal()) *
                                  100
                                ).toFixed(1)
                              : "0.0"}
                            %
                          </div>
                        </div>
                        {renderDetailBreakdown(dashboardDetailData)}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                No project data available.
              </div>
            )}
          </div>
        ) : activeTab === "DFARS Adequacy Checklist" ? (
          <div className="min-h-full bg-slate-50 text-gray-900 flex flex-col gap-y-6 p-6 overflow-auto">
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-y-6">
              {/* DFARS Header */}
              <div className="p-5 w-full flex flex-col justify-center rounded-md bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <FcDataConfiguration size={28} />
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                    DFARS 252.215-7009 Proposal Adequacy Checklist
                  </h2>
                </div>
                <p className="text-sm text-slate-500 mt-2 ml-10">
                  Verify cost proposal compliance with FAR 15.408 Table 15-2.
                </p>
              </div>

              {/* DFARS Checklist Sections */}
              <div className="flex flex-col gap-y-6">
                {checklistData.map((section, sIndex) => (
                  <div
                    key={sIndex}
                    className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden"
                  >
                    <div className="bg-blue-50/50 border-b border-slate-200 px-5 py-3">
                      <h3 className="text-md font-semibold text-blue-900">
                        {section.title}
                      </h3>
                    </div>

                    <div className="flex flex-col divide-y divide-slate-100">
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-start gap-4 p-5 transition-colors duration-150 ${
                            checkedItems[item.id]
                              ? "bg-slate-50/70"
                              : "hover:bg-slate-50/50"
                          }`}
                        >
                          <div className="pt-0.5">
                            <input
                              type="checkbox"
                              id={item.id}
                              checked={!!checkedItems[item.id]}
                              onChange={() => toggleCheck(item.id)}
                              className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 cursor-pointer transition-all"
                            />
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <label
                              htmlFor={item.id}
                              className="cursor-pointer text-sm text-slate-700 leading-relaxed"
                            >
                              <span className="font-bold text-slate-900 mr-2">
                                {item.id}:
                              </span>
                              {item.req}
                            </label>
                            <div className="mt-1 bg-emerald-50/50 border-l-4 border-emerald-400 p-3 rounded-r-md text-xs text-slate-600">
                              <span className="font-semibold text-emerald-800 block mb-1">
                                FinAxis Validation Logic:
                              </span>
                              {item.logic}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === "Proposal Package" ? (
          <div className="flex gap-4 h-full overflow-hidden">
            {/* 1. SIDEBAR: DOCUMENT OUTLINE */}
            <div className="w-1/5 flex flex-col border border-gray-300 rounded shadow-sm bg-white h-full overflow-hidden min-w-[220px]">
              <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 font-bold text-gray-700">
                Document Outline
              </div>
              <div className="p-4 flex-1 overflow-y-auto text-xs flex flex-col gap-3">
                <p className="text-red-500 italic text-[11px] leading-tight mb-2">
                  * Toggling sections will reset manual edits.
                </p>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={docSections.coverLetter}
                    onChange={() =>
                      setDocSections((p) => ({
                        ...p,
                        coverLetter: !p.coverLetter,
                      }))
                    }
                    className="accent-green-600 w-3.5 h-3.5"
                  />{" "}
                  Cover Letter
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={docSections.vol1Admin}
                    onChange={() =>
                      setDocSections((p) => ({ ...p, vol1Admin: !p.vol1Admin }))
                    }
                    className="accent-green-600 w-3.5 h-3.5"
                  />{" "}
                  Volume I: Admin
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={docSections.vol2Tech}
                    onChange={() =>
                      setDocSections((p) => ({ ...p, vol2Tech: !p.vol2Tech }))
                    }
                    className="accent-green-600 w-3.5 h-3.5"
                  />{" "}
                  Volume II: Technical
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={docSections.vol3Mgmt}
                    onChange={() =>
                      setDocSections((p) => ({ ...p, vol3Mgmt: !p.vol3Mgmt }))
                    }
                    className="accent-green-600 w-3.5 h-3.5"
                  />{" "}
                  Volume III: Management
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={docSections.vol4PastPerf}
                    onChange={() =>
                      setDocSections((p) => ({
                        ...p,
                        vol4PastPerf: !p.vol4PastPerf,
                      }))
                    }
                    className="accent-green-600 w-3.5 h-3.5"
                  />{" "}
                  Volume IV: Past Perf.
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={docSections.vol5Price}
                    onChange={() =>
                      setDocSections((p) => ({ ...p, vol5Price: !p.vol5Price }))
                    }
                    className="accent-green-600 w-3.5 h-3.5"
                  />{" "}
                  Volume V: Price
                </label>

                {/* Indented Subsections for Volume 5 */}
                <div className="ml-5 flex flex-col gap-2 border-l-2 border-gray-200 pl-3">
                  <label
                    className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
                  >
                    <input
                      type="checkbox"
                      checked={docSections.sec5_1}
                      onChange={() =>
                        setDocSections((p) => ({ ...p, sec5_1: !p.sec5_1 }))
                      }
                      disabled={!docSections.vol5Price}
                      className="accent-green-600 w-3 h-3"
                    />{" "}
                    5.1 Price Summary
                  </label>
                  <label
                    className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
                  >
                    <input
                      type="checkbox"
                      checked={docSections.sec5_2}
                      onChange={() =>
                        setDocSections((p) => ({ ...p, sec5_2: !p.sec5_2 }))
                      }
                      disabled={!docSections.vol5Price}
                      className="accent-green-600 w-3 h-3"
                    />{" "}
                    5.2 CLIN Pricing
                  </label>
                  <label
                    className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
                  >
                    <input
                      type="checkbox"
                      checked={docSections.sec5_3}
                      onChange={() =>
                        setDocSections((p) => ({ ...p, sec5_3: !p.sec5_3 }))
                      }
                      disabled={!docSections.vol5Price}
                      className="accent-green-600 w-3 h-3"
                    />{" "}
                    5.3 Labor Detail
                  </label>
                  <label
                    className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
                  >
                    <input
                      type="checkbox"
                      checked={docSections.sec5_4}
                      onChange={() =>
                        setDocSections((p) => ({ ...p, sec5_4: !p.sec5_4 }))
                      }
                      disabled={!docSections.vol5Price}
                      className="accent-green-600 w-3 h-3"
                    />{" "}
                    5.4 ODCs
                  </label>
                  <label
                    className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
                  >
                    <input
                      type="checkbox"
                      checked={docSections.sec5_5}
                      onChange={() =>
                        setDocSections((p) => ({ ...p, sec5_5: !p.sec5_5 }))
                      }
                      disabled={!docSections.vol5Price}
                      className="accent-green-600 w-3 h-3"
                    />{" "}
                    5.5 Basis of Estimate
                  </label>
                  <label
                    className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
                  >
                    <input
                      type="checkbox"
                      checked={docSections.sec5_6}
                      onChange={() =>
                        setDocSections((p) => ({ ...p, sec5_6: !p.sec5_6 }))
                      }
                      disabled={!docSections.vol5Price}
                      className="accent-green-600 w-3 h-3"
                    />{" "}
                    5.6 Assumptions
                  </label>
                  <label
                    className={`flex items-center gap-2 cursor-pointer ${docSections.vol5Price ? "text-gray-700" : "text-gray-400 opacity-50"}`}
                  >
                    <input
                      type="checkbox"
                      checked={docSections.sec5_7}
                      onChange={() =>
                        setDocSections((p) => ({ ...p, sec5_7: !p.sec5_7 }))
                      }
                      disabled={!docSections.vol5Price}
                      className="accent-green-600 w-3 h-3"
                    />{" "}
                    5.7 Exceptions
                  </label>
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 mt-1">
                  <input
                    type="checkbox"
                    checked={docSections.repsAndCerts}
                    onChange={() =>
                      setDocSections((p) => ({
                        ...p,
                        repsAndCerts: !p.repsAndCerts,
                      }))
                    }
                    className="accent-green-600 w-3.5 h-3.5"
                  />{" "}
                  Reps & Certs
                </label>
              </div>
            </div>

            {/* 2. Editor Side */}
            <div className="w-2/5 flex flex-col border border-gray-300 rounded shadow-sm bg-white h-full overflow-hidden">
              <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 font-bold text-gray-700">
                Document Editor
              </div>
              <div className="p-2 flex-1 overflow-auto text-black prose max-w-none">
                <CKEditor
                  editor={ClassicEditor}
                  data={proPricerContent}
                  onChange={(event, editor) => {
                    setProPricerContent(editor.getData());
                  }}
                />
              </div>
            </div>

            {/* 3. Preview Side */}
            <div className="w-2/5 flex flex-col border border-gray-300 rounded shadow-sm bg-white h-full overflow-hidden">
              <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 font-bold text-gray-700">
                Live Preview
              </div>
              <div
                id="propricer-preview-container"
                className="p-6 flex-1 overflow-auto text-black prose max-w-none ck-content bg-white"
                dangerouslySetInnerHTML={{
                  __html:
                    `<style>
                    #propricer-preview-container div[style*="dashed"],
                    #propricer-preview-container div[style*="opacity"] { 
                      display: none !important; 
                    }
                  </style>` + proPricerContent,
                }}
              />
            </div>
          </div>
        ) : activeTab === "Labor Dollar Burn Rate" ? (
          (() => {
            const yrs = ALL_YEARS.filter((y) => visibleYears.includes(y));
            const poolCols = poolDefinitions.filter((p) => p.key !== "fee");
            const perYear = 2 + poolCols.length + 3; // Hrs, Unburdened, pools, TBC, Fee, Burn
            const yrHead = (y) =>
              y === BASE_YEAR
                ? "bg-blue-100 text-blue-900"
                : "bg-green-100 text-green-900";
            const yrSub = (y) =>
              y === BASE_YEAR ? "bg-blue-50/60" : "bg-green-50/60";
            const cell = "px-3 py-1.5 border border-gray-300 text-right";
            const head = "px-3 py-2 border border-gray-300 text-right";
            return (
              <div className="bg-white shadow-sm border border-gray-300 w-full flex-1 min-h-0 overflow-auto">
                {/* <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-xs text-gray-600">
          One row per Employee / Project / PLC. Burn Rate = Annual Price ÷ {burnPeriodCount} month(s).
        </div> */}
                <table className="w-max min-w-full border-separate border-spacing-0 tabular-nums whitespace-nowrap text-xs">
                  <thead className="sticky top-0 z-30">
                    {/* Row 1: year groups */}
                    <tr className="text-center font-bold">
                      <th
                        colSpan={5}
                        className="px-3 py-1.5 border border-gray-300 bg-slate-200 text-left sticky left-0 z-40"
                      >
                        Element Details
                      </th>
                      {yrs.map((y) => (
                        <th
                          key={y}
                          colSpan={perYear}
                          className={`px-3 py-1.5 border border-gray-300 ${yrHead(y)}`}
                        >
                          {y === BASE_YEAR
                            ? `Base Year (${y})`
                            : `Option Year ${OPTION_YEARS.indexOf(y) + 1} (${y})`}
                        </th>
                      ))}
                    </tr>
                    {/* Row 2: column names */}
                    <tr className="bg-slate-100 text-gray-700 font-bold">
                      <th className="px-3 py-2 border border-gray-300 text-left sticky left-0 z-40 bg-slate-100 min-w-[170px]">
                        Employee
                      </th>
                      <th className="px-3 py-2 border border-gray-300 text-left min-w-[200px]">
                        Project
                      </th>
                      <th className="px-3 py-2 border border-gray-300 text-left">
                        PLC
                      </th>
                      <th className="px-3 py-2 border border-gray-300 text-left">
                        Account ID
                      </th>
                      <th className="px-3 py-2 border border-gray-300 text-left">
                        Org ID
                      </th>
                      {yrs.map((y) => (
                        <React.Fragment key={`sub-${y}`}>
                          <th className={`${head} ${yrSub(y)}`}>Hrs</th>
                          <th className={`${head} ${yrSub(y)}`}>Unburdened</th>
                          {poolCols.map((p) => (
                            <th key={p.key} className={`${head} ${yrSub(y)}`}>
                              {p.label}
                            </th>
                          ))}
                          <th className={`${head} bg-indigo-50`}>
                            Total Burdened Cost
                          </th>
                          <th className={`${head} bg-purple-50`}>Fee</th>
                          <th className={`${head} bg-cyan-50`}>Burn Rate </th>
                        </React.Fragment>
                      ))}
                    </tr>
                    {/* Row 3: ONE rate row, cells aligned under each year */}
                    <tr className="bg-amber-100 text-amber-900">
                      <td
                        colSpan={5}
                        className="px-3 py-1 border border-gray-300 font-semibold sticky left-0 z-40 bg-amber-100"
                      >
                        Pool Template Rates %
                      </td>
                      {yrs.map((y) => {
                        const r = getPoolRateSet(y);
                        return (
                          <React.Fragment key={`rate-${y}`}>
                            <td className="px-3 py-1 border border-gray-300 text-center">
                              —
                            </td>
                            <td className="px-3 py-1 border border-gray-300 text-center">
                              —
                            </td>
                            {poolCols.map((p) => (
                              <td
                                key={p.key}
                                className="px-3 py-1 border border-gray-300 text-right"
                              >
                                {formatNum((r[p.key] || 0) * 100)}%
                              </td>
                            ))}
                            <td className="px-3 py-1 border border-gray-300 text-center">
                              —
                            </td>
                            <td className="px-3 py-1 border border-gray-300 text-right">
                              {formatNum(
                                (r.fee || Number(globalFee) / 100 || 0) * 100,
                              )}
                              %
                            </td>
                            <td className="px-3 py-1 border border-gray-300 text-center">
                              —
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {laborBurnByEmployee.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5 + yrs.length * perYear}
                          className="p-8 text-center text-gray-500"
                        >
                          No labor dollar burn data available.
                        </td>
                      </tr>
                    ) : (
                      laborBurnByEmployee.flatMap((emp) => {
                        const rowKey = `dollar-${emp.id}`;
                        const open = expandedRows.has(rowKey);

                        const yearCells = (years, prefix, bold) =>
                          yrs.map((y) => {
                            const d = years[ALL_YEARS.indexOf(y)] || {};
                            const p = d.pools || {};
                            const price = Number(p.loadedAmount) || 0;
                            return (
                              <React.Fragment key={`${prefix}-${y}`}>
                                <td className={cell}>
                                  {formatNum(d.directHours || 0)}
                                </td>
                                <td className={cell}>
                                  {formatCurrency(p.cost || 0)}
                                </td>
                                {poolCols.map((pc) => (
                                  <td key={pc.key} className={cell}>
                                    {formatCurrency(p[pc.key] || 0)}
                                  </td>
                                ))}
                                <td
                                  className={`${cell} font-semibold text-indigo-800`}
                                >
                                  {formatCurrency(p.totalBurdenedCost || 0)}
                                </td>
                                <td className={`${cell} text-purple-700`}>
                                  {formatCurrency(p.fee || 0)}
                                </td>
                                <td
                                  className={`${cell} ${bold ? "font-bold" : "font-medium"} text-cyan-800`}
                                >
                                  {formatCurrency(price / burnPeriodCount)}
                                </td>
                              </React.Fragment>
                            );
                          });

                        const parent = (
                          <tr
                            key={emp.id}
                            className="hover:bg-blue-50/60 bg-white"
                          >
                            <td className="px-3 py-1.5 border border-gray-300 sticky left-0 z-20 bg-white">
                              <button
                                onClick={() => toggleExpand(rowKey)}
                                className="flex items-center gap-1 w-full text-blue-700 hover:text-blue-900 hover:underline focus:outline-none text-left font-semibold"
                              >
                                {open ? (
                                  <ChevronDown
                                    size={14}
                                    className="shrink-0 text-gray-500"
                                  />
                                ) : (
                                  <ChevronRight
                                    size={14}
                                    className="shrink-0 text-gray-500"
                                  />
                                )}
                                <span className="truncate">
                                  {emp.employee}
                                  {emp.emplId ? ` (${emp.emplId})` : ""}
                                </span>
                                {emp.children.length > 1 && (
                                  <span className="shrink-0 ml-auto text-[9px] font-bold bg-amber-100 text-amber-800 rounded px-1">
                                    {emp.children.length} rows
                                  </span>
                                )}
                              </button>
                            </td>
                            <td className="px-3 py-1.5 border border-gray-300 text-gray-500">
                              {emp.projectCount} project(s)
                            </td>
                            <td className="px-3 py-1.5 border border-gray-300 text-gray-500">
                              {emp.plcCount} PLC(s)
                            </td>
                            <td className="px-3 py-1.5 border border-gray-300 text-gray-400">
                              —
                            </td>
                            <td className="px-3 py-1.5 border border-gray-300 text-gray-400">
                              —
                            </td>
                            {yearCells(emp.years, emp.id, true)}
                          </tr>
                        );

                        const children = open
                          ? emp.children.map((row) => (
                              <tr
                                key={`${emp.id}-${row.id}`}
                                className="bg-indigo-50/50 hover:bg-indigo-100/50 text-gray-700"
                              >
                                <td className="px-3 py-1.5 border border-gray-300 sticky left-0 z-10 bg-indigo-50 pl-7 text-[11px] text-indigo-900 border-l-4 border-l-indigo-400">
                                  ↳
                                </td>
                                <td className="px-3 py-1.5 border border-gray-300">
                                  {row.project}
                                </td>
                                <td className="px-3 py-1.5 border border-gray-300">
                                  {row.plc}
                                </td>
                                <td className="px-3 py-1.5 border border-gray-300">
                                  {row.acctId || "-"}
                                </td>
                                <td className="px-3 py-1.5 border border-gray-300">
                                  {row.orgId || "-"}
                                </td>
                                {yearCells(row.years, row.id, false)}
                              </tr>
                            ))
                          : [];

                        return [parent, ...children];
                      })
                    )}
                  </tbody>
                </table>
              </div>
            );
          })()
        ) : activeTab === "Labor Hours Burn Rate" ? (
          <div className="bg-white shadow-sm border border-gray-300 w-full flex-1 min-h-0 overflow-auto">
            {/* <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-xs text-gray-600">One row per Employee / Project / PLC, with Base Year and each selected Option Year grouped across the columns. Pool rates follow the selected Pool Template. Monthly Hours Burn = Direct Productive Hours ÷ {burnPeriodCount} month(s).</div> */}
            <table className="w-max min-w-full border-separate border-spacing-0 tabular-nums whitespace-nowrap text-xs">
              {/* <thead className="sticky top-0 z-30">
  <tr className="text-center font-bold text-blue-800">
    <th rowSpan={2} className="px-3 py-2 border border-gray-300 bg-slate-200 text-left sticky left-0 z-40 min-w-[170px]">Employee</th>
    <th rowSpan={2} className="px-3 py-2 border border-gray-300 bg-slate-200 text-left min-w-[220px]">Project</th>
    <th rowSpan={2} className="px-3 py-2 border border-gray-300 bg-slate-200 text-left">PLC</th>
    <th rowSpan={2} className="px-3 py-2 border border-gray-300 bg-slate-200 text-left">Account ID</th>
    <th rowSpan={2} className="px-3 py-2 border border-gray-300 bg-slate-200 text-left">Org ID</th>
    {ALL_YEARS.filter((year) => visibleYears.includes(year)).map((year) => (
      <th
        key={`year-group-${year}`}
        colSpan={2}
        className={`px-3 py-1.5 border border-gray-300 ${year === BASE_YEAR ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"}`}
      >
        {year === BASE_YEAR ? `Base Year (${year})` : `Option Year ${OPTION_YEARS.indexOf(year) + 1} (${year})`}
      </th>
    ))}
  </tr>
  <tr className="bg-slate-100 text-gray-700 font-bold">
    {ALL_YEARS.filter((year) => visibleYears.includes(year)).map((year) => (
      <React.Fragment key={`subhead-${year}`}>
        <th className="px-3 py-2 border border-gray-300 text-right bg-blue-50">Direct Productive Hours</th>
        <th className="px-3 py-2 border border-gray-300 text-right bg-cyan-50">Monthly Hours Burn</th>
      </React.Fragment>
    ))}
  </tr>
</thead> */}
              <thead className="sticky top-0 z-30">
                <tr className="text-center font-bold text-blue-800">
                  <th
                    rowSpan={2}
                    className="px-3 py-2 border border-gray-300 bg-slate-200 text-left sticky left-0 z-40 min-w-[170px]"
                  >
                    Employee
                  </th>
                  <th
                    rowSpan={2}
                    className="px-3 py-2 border border-gray-300 bg-slate-200 text-left min-w-[220px]"
                  >
                    Project
                  </th>
                  <th
                    rowSpan={2}
                    className="px-3 py-2 border border-gray-300 bg-slate-200 text-left"
                  >
                    PLC
                  </th>
                  <th
                    rowSpan={2}
                    className="px-3 py-2 border border-gray-300 bg-slate-200 text-left"
                  >
                    Account ID
                  </th>
                  <th
                    rowSpan={2}
                    className="px-3 py-2 border border-gray-300 bg-slate-200 text-left"
                  >
                    Org ID
                  </th>
                  {ALL_YEARS.filter((year) => visibleYears.includes(year)).map(
                    (year) => (
                      <th
                        key={`year-group-${year}`}
                        colSpan={2}
                        className={`px-3 py-1.5 border border-gray-300 ${year === BASE_YEAR ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"}`}
                      >
                        {year === BASE_YEAR
                          ? `Base Year (${year})`
                          : `Option Year ${OPTION_YEARS.indexOf(year) + 1} (${year})`}
                      </th>
                    ),
                  )}
                </tr>
                <tr className="bg-slate-100 text-gray-700 font-bold">
                  {ALL_YEARS.filter((year) => visibleYears.includes(year)).map(
                    (year) => (
                      <React.Fragment key={`subhead-${year}`}>
                        <th className="px-3 py-2 border border-gray-300 text-right bg-blue-50">
                          Direct Productive Hours
                        </th>
                        <th className="px-3 py-2 border border-gray-300 text-right bg-cyan-50">
                          Monthly Hours Burn
                        </th>
                      </React.Fragment>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const yrs = ALL_YEARS.filter((year) =>
                    visibleYears.includes(year),
                  );
                  const poolCols = poolDefinitions.filter(
                    (p) => p.key !== "fee",
                  );
                  const cell = "px-3 py-1.5 border border-gray-300 text-right";

                  if (laborBurnByEmployee.length === 0) {
                    return (
                      <tr>
                        <td
                          colSpan={5 + yrs.length * 2}
                          className="p-8 text-center text-gray-500"
                        >
                          No labor hours burn data available.
                        </td>
                      </tr>
                    );
                  }

                  return laborBurnByEmployee.flatMap((emp) => {
                    const rowKey = `hours-${emp.id}`;
                    const open = expandedRows.has(rowKey);

                    const yearCells = (years, prefix) =>
                      yrs.map((year) => {
                        const y = years[ALL_YEARS.indexOf(year)] || {};
                        return (
                          <React.Fragment key={`${prefix}-${year}`}>
                            <td className={cell}>
                              {formatNum(y.directHours || 0)}
                            </td>
                            <td className={`${cell} font-bold text-cyan-800`}>
                              {formatNum(
                                (y.directHours || 0) / burnPeriodCount,
                              )}
                            </td>
                          </React.Fragment>
                        );
                      });

                    const parent = (
                      <tr key={emp.id} className="hover:bg-blue-50/60 bg-white">
                        <td className="px-3 py-1.5 border border-gray-300 sticky left-0 z-20 bg-white">
                          <button
                            onClick={() => toggleExpand(rowKey)}
                            className="flex items-center gap-1 w-full text-blue-700 hover:text-blue-900 hover:underline focus:outline-none text-left font-semibold"
                          >
                            {open ? (
                              <ChevronDown
                                size={14}
                                className="shrink-0 text-gray-500"
                              />
                            ) : (
                              <ChevronRight
                                size={14}
                                className="shrink-0 text-gray-500"
                              />
                            )}
                            <span className="truncate">
                              {emp.employee}
                              {emp.emplId ? ` (${emp.emplId})` : ""}
                            </span>
                            {emp.children.length > 1 && (
                              <span className="shrink-0 ml-auto text-[9px] font-bold bg-amber-100 text-amber-800 rounded px-1">
                                {emp.children.length} rows
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-1.5 border border-gray-300 text-gray-500">
                          {emp.projectCount} project(s)
                        </td>
                        <td className="px-3 py-1.5 border border-gray-300 text-gray-500">
                          {emp.plcCount} PLC(s)
                        </td>
                        <td className="px-3 py-1.5 border border-gray-300 text-gray-400">
                          —
                        </td>
                        <td className="px-3 py-1.5 border border-gray-300 text-gray-400">
                          —
                        </td>
                        {yearCells(emp.years, emp.id)}
                      </tr>
                    );

                    const children = open
                      ? emp.children.map((row) => (
                          <tr
                            key={`${emp.id}-${row.id}`}
                            className="bg-indigo-50/50 hover:bg-indigo-100/50 text-gray-700"
                          >
                            <td className="px-3 py-1.5 border border-gray-300 sticky left-0 z-10 bg-indigo-50 pl-7 text-[11px] text-indigo-900 border-l-4 border-l-indigo-400">
                              ↳
                            </td>
                            <td className="px-3 py-1.5 border border-gray-300">
                              {row.project}
                            </td>
                            <td className="px-3 py-1.5 border border-gray-300">
                              {row.plc}
                            </td>
                            <td className="px-3 py-1.5 border border-gray-300">
                              {row.acctId || "-"}
                            </td>
                            <td className="px-3 py-1.5 border border-gray-300">
                              {row.orgId || "-"}
                            </td>
                            {yearCells(row.years, row.id)}
                          </tr>
                        ))
                      : [];

                    return [parent, ...children];
                  });
                })()}
              </tbody>
            </table>
          </div>
        ) : activeTab === "Employee Wrap Rate" ? (
          (() => {
            const yrs = ALL_YEARS.filter((y) => visibleYears.includes(y));
            const poolCols = wrapRatePoolDefinitions.filter(
              (p) => p.key !== "fee",
            );
            // const perYear = 2 + poolCols.length + 2; // Hrs, Unburdened, pools, TBC, Wrap
            const perYear = 2 + poolCols.length + 4;
            const yrHead = (y) =>
              y === BASE_YEAR
                ? "bg-blue-100 text-blue-900"
                : "bg-green-100 text-green-900";
            const yrSub = (y) =>
              y === BASE_YEAR ? "bg-blue-50/60" : "bg-green-50/60";
            const cell = "px-3 py-1.5 border border-gray-300 text-right";
            const head = "px-3 py-2 border border-gray-300 text-right";
            return (
              <div className="bg-white shadow-sm border border-gray-300 w-full flex-1 min-h-0 overflow-auto">
                <div className="flex flex-wrap items-center gap-4 px-4 py-3 border-b border-gray-200 bg-gray-50 text-xs text-gray-700">
                  {/* <span>
            Base hourly rate comes from Employee API. Loaded Hourly Rate = Loaded Annual Amount ÷ Standard Hours; Wrap Rate = Loaded Hourly Rate ÷ Base Hourly Rate.
          </span> */}
                  <label className="flex items-center gap-2 font-semibold">
                    Standard Hours
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={standardHours}
                      onChange={(e) =>
                        setStandardHours(
                          Math.max(0, Number(e.target.value) || 0),
                        )
                      }
                      className="w-28 rounded border border-gray-300 bg-white px-2 py-1 text-right"
                      aria-label="Standard hours"
                    />
                  </label>
                </div>
                <table className="w-max min-w-full border-separate border-spacing-0 tabular-nums whitespace-nowrap text-xs">
                  <thead className="sticky top-0 z-30">
                    <tr className="text-center font-bold">
                      <th
                        colSpan={2}
                        className="px-3 py-1.5 border border-gray-300 bg-slate-200 text-left sticky left-0 z-40"
                      >
                        Element Details
                      </th>
                      {yrs.map((y) => (
                        <th
                          key={y}
                          colSpan={perYear}
                          className={`px-3 py-1.5 border border-gray-300 ${yrHead(y)}`}
                        >
                          {y === BASE_YEAR
                            ? `Base Year (${y})`
                            : `Option Year ${OPTION_YEARS.indexOf(y) + 1} (${y})`}
                        </th>
                      ))}
                    </tr>
                    <tr className="bg-slate-100 text-gray-700 font-bold">
                      <th className="px-3 py-2 border border-gray-300 text-left sticky left-0 z-40 bg-slate-100 min-w-[220px]">
                        Employee
                      </th>
                      <th className="px-3 py-2 border border-gray-300 text-right min-w-[110px]">
                        Hourly Rate
                      </th>
                      {/* <th className="px-3 py-2 border border-gray-300 text-left min-w-[200px]">Project</th>
              <th className="px-3 py-2 border border-gray-300 text-left">PLC</th> */}
                      {yrs.map((y) => (
                        <React.Fragment key={`sub-${y}`}>
                          <th className={`${head} ${yrSub(y)}`}>Hrs</th>
                          <th className={`${head} ${yrSub(y)}`}>Unburdened</th>
                          {poolCols.map((p) => (
                            <th key={p.key} className={`${head} ${yrSub(y)}`}>
                              {p.label}
                            </th>
                          ))}
                          {/* <th className={`${head} bg-indigo-50`}>Total Burdened Cost</th>
                  <th className={`${head} bg-cyan-50`}>Wrap Rate</th> */}
                          <th className={`${head} bg-indigo-50`}>
                            Total Burdened Cost
                          </th>
                          <th className={`${head} bg-purple-50`}>Fee</th>
                          <th className={`${head} bg-emerald-50`}>
                            Loaded Labor Rate
                          </th>
                          <th className={`${head} bg-cyan-50`}>Wrap Rate</th>
                        </React.Fragment>
                      ))}
                    </tr>
                    <tr className="bg-amber-100 text-amber-900">
                      <td
                        colSpan={2}
                        className="px-3 py-1 border border-gray-300 font-semibold sticky left-0 z-40 bg-amber-100"
                      >
                        Burden Rates %
                      </td>
                      {yrs.map((y) => {
                        const r = getPoolRateSet(y);
                        return (
                          <React.Fragment key={`rate-${y}`}>
                            <td className="px-3 py-1 border border-gray-300 text-center">
                              —
                            </td>
                            <td className="px-3 py-1 border border-gray-300 text-center">
                              —
                            </td>
                            {poolCols.map((p) => (
                              <td
                                key={p.key}
                                className="px-3 py-1 border border-gray-300 text-right"
                              >
                                {formatNum((r[p.key] || 0) * 100)}%
                              </td>
                            ))}
                            <td className="px-3 py-1 border border-gray-300 text-center">
                              —
                            </td>
                            <td className="px-3 py-1 border border-gray-300 text-right">
                              {formatNum(Number(globalFee) || 0)}%
                            </td>
                            <td className="px-3 py-1 border border-gray-300 text-center">
                              —
                            </td>
                            <td className="px-3 py-1 border border-gray-300 text-center">
                              —
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={3 + yrs.length * perYear}
                          className="p-8 text-center text-gray-500"
                        >
                          Loading Employee API data...
                        </td>
                      </tr>
                    ) : employeeWrapRateData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3 + yrs.length * perYear}
                          className="p-8 text-center text-gray-500"
                        >
                          No Employee API records with Status = ACT were
                          returned.
                        </td>
                      </tr>
                    ) : (
                      employeeWrapRateData.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-blue-50/60 even:bg-gray-50/40"
                        >
                          <td className="px-3 py-1.5 border border-gray-300 sticky left-0 z-20 bg-white font-semibold">
                            {row.employee}
                            {row.emplId ? ` (${row.emplId})` : ""}
                          </td>
                          {/* <td className="px-3 py-1.5 border border-gray-300">{row.project || "-"}</td>
                  <td className="px-3 py-1.5 border border-gray-300">{row.plc || "-"}</td> */}
                          <td className="px-3 py-1.5 border border-gray-300 text-right font-semibold text-gray-800">
                            {formatCurrency(row.hourlyRate)}
                          </td>
                          {yrs.map((year) => {
                            const y = row.years.find((v) => v.year === year);
                            return (
                              <React.Fragment key={`${row.id}-${year}`}>
                                <td className={cell}>
                                  {formatNum(row.standardHours)}
                                </td>
                                <td className={cell}>
                                  {formatCurrency(row.baseAmount)}
                                </td>
                                {poolCols.map((p) => (
                                  <td key={p.key} className={cell}>
                                    {formatCurrency(y?.pools?.[p.key] || 0)}
                                  </td>
                                ))}
                                {/* <td className={`${cell} font-semibold text-indigo-800`}>{formatCurrency(y?.loadedAmount || 0)}</td>
                        <td className={`${cell} font-bold text-cyan-800`}>{formatNum(y?.wrapRate || 0)}x</td> */}
                                <td
                                  className={`${cell} font-semibold text-indigo-800`}
                                >
                                  {formatCurrency(y?.totalBurdenedCost || 0)}
                                </td>
                                <td className={`${cell} text-purple-700`}>
                                  {formatCurrency(y?.fee || 0)}
                                </td>
                                <td
                                  className={`${cell} font-semibold text-emerald-700`}
                                >
                                  {formatCurrency(y?.loadedLaborRate || 0)}
                                </td>
                                <td
                                  className={`${cell} font-bold text-cyan-800`}
                                >
                                  {formatNum(y?.wrapRate || 0)}x
                                </td>
                              </React.Fragment>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            );
          })()
        ) : (
          <div className="bg-white shadow-sm border border-gray-300 w-full flex-1 min-h-0 overflow-auto">
            <table className="w-max min-w-full border-separate border-spacing-0 tabular-nums whitespace-nowrap [&_th]:border-t-0 [&_th]:border-l-0 [&_td]:border-t-0 [&_td]:border-l-0">
              {/* SUMMARY HEADERS */}
              {activeTab === "Performance By Elements" && (
                <thead className="sticky top-0 z-30">
                  <tr className="bg-gray-200 text-gray-800 text-xs font-bold  tracking-wider shadow-[0_1px_0_0_#d1d5db]">
                    <th className="px-4 py-2.5 border border-gray-300 text-left w-[300px]">
                      Account Type
                    </th>
                    {visibleYears.includes(BASE_YEAR) && (
                      <th className="px-4 py-2.5 border border-gray-300 text-right w-[140px]">
                        Base Year {BASE_YEAR}
                      </th>
                    )}
                    {OPTION_YEARS.map(
                      (y, idx) =>
                        visibleYears.includes(y) && (
                          <th
                            key={y}
                            className="px-4 py-2.5 border border-gray-300 text-right w-[140px]"
                          >
                            Option Year {idx + 1} - {y}
                          </th>
                        ),
                    )}
                  </tr>
                </thead>
              )}

              {/* LABOR HEADERS */}
              {activeTab === "Labor" && (
                <thead className="sticky top-0 z-30">
                  <tr className="bg-gray-200 text-gray-800 text-xs font-bold  tracking-wider shadow-[0_1px_0_0_#d1d5db]">
                    <th
                      colSpan={6}
                      className="px-3 py-2 border border-gray-300 text-left sticky left-0 z-40 bg-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)] border-r-2 border-r-gray-400"
                    >
                      Element Details
                    </th>
                    {visibleYears.includes(BASE_YEAR) && (
                      <th
                        colSpan={
                          2 +
                          (laborMetrics.hrs && laborMetrics.amt
                            ? 24
                            : laborMetrics.hrs || laborMetrics.amt
                              ? 12
                              : 0)
                        }
                        className="px-3 py-2 bg-blue-100 border border-gray-300 text-center text-blue-900 font-bold text-xs"
                      >
                        Base Year ({BASE_YEAR})
                      </th>
                    )}
                    {OPTION_YEARS.map(
                      (y, idx) =>
                        visibleYears.includes(y) && (
                          <th
                            key={y}
                            colSpan={
                              2 +
                              (laborMetrics.hrs && laborMetrics.amt
                                ? 24
                                : laborMetrics.hrs || laborMetrics.amt
                                  ? 12
                                  : 0)
                            }
                            className="px-3 py-2 bg-green-100 border border-gray-300 text-center text-green-900 font-bold text-xs"
                          >
                            Option Year {idx + 1} ({y})
                          </th>
                        ),
                    )}
                  </tr>
                  <tr className="bg-gray-100 text-gray-700 text-xs font-bold tracking-wider">
                    <th
                      className="px-3 py-1.5 border border-gray-300 text-left sticky left-0 z-40 bg-gray-100 w-[150px] min-w-[150px] max-w-[150px] cursor-pointer hover:bg-gray-200"
                      onClick={() => requestSort("task")}
                    >
                      <div className="flex items-center justify-between">
                        Task {getSortIcon("task")}
                      </div>
                    </th>
                    <th
                      className="px-3 py-1.5 border border-gray-300 text-left sticky left-[150px] z-40 bg-gray-100 w-[120px] min-w-[120px] max-w-[120px] cursor-pointer hover:bg-gray-200"
                      onClick={() => requestSort("type")}
                    >
                      <div className="flex items-center justify-between">
                        Acct Type {getSortIcon("type")}
                      </div>
                    </th>
                    <th className="px-3 py-1.5 border border-gray-300 text-left sticky left-[270px] z-40 bg-gray-100 w-[150px] min-w-[150px] max-w-[150px]">
                      PLC
                    </th>
                    <th className="px-3 py-1.5 border border-gray-300 text-left sticky left-[420px] z-40 bg-gray-100 w-[100px] min-w-[100px] max-w-[100px]">
                      EMP ID
                    </th>
                    <th className="px-3 py-1.5 border border-gray-300 text-left sticky left-[520px] z-40 bg-gray-100 w-[150px] min-w-[150px] max-w-[150px]">
                      Name
                    </th>
                    <th className="px-3 py-1.5 border border-gray-300 text-right sticky left-[670px] z-40 bg-gray-100 w-[80px] min-w-[80px] max-w-[80px] border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]">
                      Rate
                    </th>
                    {ALL_YEARS.map((y, i) => {
                      if (!visibleYears.includes(y)) return null;
                      return (
                        <React.Fragment key={y}>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-right ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
                          >
                            Total Hrs
                          </th>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-right ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
                          >
                            Total Amt
                          </th>
                          {months.map((m) => (
                            <React.Fragment key={m}>
                              {laborMetrics.hrs && (
                                <th
                                  className={`px-2 py-1.5 border border-gray-300 text-right ${i === 0 ? "bg-blue-50/30" : "bg-green-50/30"}`}
                                >
                                  {m} Hrs
                                </th>
                              )}
                              {laborMetrics.amt && (
                                <th
                                  className={`px-2 py-1.5 border border-gray-300 text-right ${i === 0 ? "bg-blue-50/30" : "bg-green-50/30"}`}
                                >
                                  {m} Amt
                                </th>
                              )}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tr>
                </thead>
              )}

              {/* NON-LABOR HEADERS */}
              {activeTab === "Non-Labor" && (
                <thead className="sticky top-0 z-30">
                  <tr className="bg-gray-200 text-gray-800 text-xs font-bold  tracking-wider shadow-[0_1px_0_0_#d1d5db]">
                    <th
                      colSpan={4}
                      className="px-3 py-2 border border-gray-300 text-left sticky left-0 z-40 bg-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)] border-r-2 border-r-gray-400"
                    >
                      Element Details
                    </th>
                    {visibleYears.includes(BASE_YEAR) && (
                      <th
                        colSpan={13}
                        className="px-3 py-2 bg-blue-100 border border-gray-300 text-center text-blue-900 font-bold text-xs"
                      >
                        Base Year ({BASE_YEAR})
                      </th>
                    )}
                    {OPTION_YEARS.map(
                      (y, idx) =>
                        visibleYears.includes(y) && (
                          <th
                            key={y}
                            colSpan={13}
                            className="px-3 py-2 bg-green-100 border border-gray-300 text-center text-green-900 font-bold text-xs"
                          >
                            Option Year {idx + 1} ({y})
                          </th>
                        ),
                    )}
                  </tr>
                  <tr className="bg-gray-100 text-gray-700 text-xs font-bold tracking-wider">
                    <th
                      className="px-3 py-1.5 border border-gray-300 text-left sticky left-0 z-40 bg-gray-100 w-[150px] min-w-[150px] max-w-[150px] cursor-pointer hover:bg-gray-200"
                      onClick={() => requestSort("task")}
                    >
                      <div className="flex items-center justify-between">
                        Task {getSortIcon("task")}
                      </div>
                    </th>
                    <th
                      className="px-3 py-1.5 border border-gray-300 text-left sticky left-[150px] z-40 bg-gray-100 w-[150px] min-w-[150px] max-w-[150px] cursor-pointer hover:bg-gray-200"
                      onClick={() => requestSort("type")}
                    >
                      <div className="flex items-center justify-between">
                        Acct Type {getSortIcon("type")}
                      </div>
                    </th>
                    <th className="px-3 py-1.5 border border-gray-300 text-left sticky left-[300px] z-40 bg-gray-100 w-[200px] min-w-[200px] max-w-[200px]">
                      Account Name
                    </th>
                    <th className="px-3 py-1.5 border border-gray-300 text-left sticky left-[500px] z-40 bg-gray-100 w-[200px] min-w-[200px] max-w-[200px] border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]">
                      Vendor Name
                    </th>
                    {ALL_YEARS.map((y, i) => {
                      if (!visibleYears.includes(y)) return null;
                      return (
                        <React.Fragment key={y}>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-right ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
                          >
                            Total Cost
                          </th>
                          {months.map((m) => (
                            <th
                              key={m}
                              className={`px-2 py-1.5 border border-gray-300 text-right ${i === 0 ? "bg-blue-50/30" : "bg-green-50/30"}`}
                            >
                              {m}
                            </th>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tr>
                </thead>
              )}

              {/* PRICING ELEMENTS HEADERS */}
              {isPerfTab && (
                <thead className="sticky top-0 z-30">
                  <tr>
                    <th
                      colSpan={4}
                      className="px-3 py-1.5 bg-gray-200 border border-gray-300 text-left text-gray-800 font-bold text-xs sticky left-0 z-40 border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]"
                    >
                      Element Details
                    </th>
                    {visibleYears.includes(BASE_YEAR) && (
                      <th
                        colSpan={isLaborPerf ? 13 : 12}
                        className="px-3 py-1.5 bg-blue-100 border border-gray-300 text-center text-blue-900 font-bold text-xs"
                      >
                        Base Year ({BASE_YEAR})
                      </th>
                    )}
                    {OPTION_YEARS.map(
                      (y, idx) =>
                        visibleYears.includes(y) && (
                          <th
                            key={y}
                            colSpan={isLaborPerf ? 13 : 12}
                            className="px-3 py-1.5 bg-green-100 border border-gray-300 text-center text-green-900 font-bold text-xs"
                          >
                            Option Year {idx + 1} ({y})
                          </th>
                        ),
                    )}
                  </tr>

                  {/* NEW VISUAL GROUPING ROW */}
                  <tr className="bg-gray-50 text-[10px] font-bold  tracking-wider text-gray-600 shadow-[0_1px_0_0_#d1d5db]">
                    <th
                      colSpan={4}
                      className="px-3 py-1 border border-gray-300 sticky left-0 z-40 bg-gray-50 border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]"
                    ></th>
                    {ALL_YEARS.map((y) => {
                      if (!visibleYears.includes(y)) return null;
                      return (
                        <React.Fragment key={`group-${y}`}>
                          <th
                            colSpan={2}
                            className="px-2 py-1 border border-gray-300 text-center bg-blue-50/80 text-blue-800"
                          >
                            Direct Charge
                          </th>
                          <th
                            colSpan={6}
                            className="px-2 py-1 border border-gray-300 text-center bg-amber-50/80 text-amber-800"
                          >
                            Burden
                          </th>
                          <th
                            colSpan={1}
                            className="px-2 py-1 border border-gray-300 text-center bg-indigo-50/80 text-indigo-800"
                          >
                            Total Burdened Cost
                          </th>
                          {isLaborPerf && (
                            <th
                              colSpan={1}
                              className="px-2 py-1 border border-gray-300 text-center bg-cyan-50/80 text-cyan-800"
                            >
                              Wrap Rate
                            </th>
                          )}
                          <th
                            colSpan={1}
                            className="px-2 py-1 border border-gray-300 text-center bg-purple-50/80 text-purple-800"
                          >
                            Fee
                          </th>
                          <th
                            colSpan={2}
                            className="px-2 py-1 border border-gray-300 text-center bg-green-50/80 text-green-800"
                          >
                            Price
                          </th>
                        </React.Fragment>
                      );
                    })}
                  </tr>

                  <tr className="bg-gray-100 text-gray-700 text-xs font-semibold shadow-[0_1px_0_0_#d1d5db]">
                    <th
                      className="relative px-3 py-1.5 border border-gray-300 text-left cursor-pointer hover:bg-gray-200 transition-colors select-none sticky z-40 bg-gray-100"
                      style={{
                        left: performanceColumnLefts.topLevel,
                        width: performanceColumnWidths.topLevel,
                        minWidth: performanceColumnWidths.topLevel,
                      }}
                      onClick={() => requestSort("topLevel")}
                    >
                      <div className="flex items-center justify-between">
                        Top Level {getSortIcon("topLevel")}
                      </div>
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
                        onMouseDown={(e) =>
                          startPerformanceColumnResize(e, "topLevel")
                        }
                      />
                    </th>
                    <th
                      className="relative px-3 py-1.5 border border-gray-300 text-left cursor-pointer hover:bg-gray-200 transition-colors select-none sticky z-40 bg-gray-100"
                      style={{
                        left: performanceColumnLefts.task,
                        width: performanceColumnWidths.task,
                        minWidth: performanceColumnWidths.task,
                      }}
                      onClick={() => requestSort("task")}
                    >
                      <div className="flex items-center justify-between">
                        Task {getSortIcon("task")}
                      </div>
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
                        onMouseDown={(e) =>
                          startPerformanceColumnResize(e, "task")
                        }
                      />
                    </th>
                    <th
                      className="relative px-3 py-1.5 border border-gray-300 text-left cursor-pointer hover:bg-gray-200 transition-colors select-none sticky z-40 bg-gray-100"
                      style={{
                        left: performanceColumnLefts.type,
                        width: performanceColumnWidths.type,
                        minWidth: performanceColumnWidths.type,
                      }}
                      onClick={() => requestSort("type")}
                    >
                      <div className="flex items-center justify-between">
                        Acct Type {getSortIcon("type")}
                      </div>
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
                        onMouseDown={(e) =>
                          startPerformanceColumnResize(e, "type")
                        }
                      />
                    </th>
                    <th
                      className="relative px-3 py-1.5 border border-gray-300 text-left cursor-pointer hover:bg-gray-200 transition-colors select-none sticky z-40 bg-gray-100 border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]"
                      style={{
                        left: performanceColumnLefts.category,
                        width: performanceColumnWidths.category,
                        minWidth: performanceColumnWidths.category,
                      }}
                      onClick={() => requestSort("cat")}
                    >
                      <div className="flex items-center justify-between">
                        {isLaborPerf ? "Employee" : "Category"}{" "}
                        {getSortIcon("cat")}
                      </div>
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500"
                        onMouseDown={(e) =>
                          startPerformanceColumnResize(e, "category")
                        }
                      />
                    </th>
                    {ALL_YEARS.map((y, i) => {
                      if (!visibleYears.includes(y)) return null;
                      return (
                        <React.Fragment key={y}>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
                          >
                            Hrs
                          </th>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
                          >
                            Unburdened
                          </th>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
                          >
                            AERO Fringe
                          </th>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
                          >
                            NASA/NIH Fringe
                          </th>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
                          >
                            Cust OH
                          </th>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
                          >
                            {/* Columbus OH */}
                            Off Site OH
                          </th>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
                          >
                            Subk M&H
                          </th>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
                          >
                            G&A
                          </th>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-indigo-50/50" : "bg-indigo-50/50"}`}
                          >
                            Total Burdened Cost
                          </th>
                          {isLaborPerf && (
                            <th
                              className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-cyan-50/50" : "bg-cyan-50/50"}`}
                            >
                              Wrap Rate
                            </th>
                          )}
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-purple-50/50" : "bg-purple-50/50"}`}
                          >
                            Fee
                          </th>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-center font-bold ${i === 0 ? "bg-blue-100/50" : "bg-green-100/50"}`}
                          >
                            Price
                          </th>
                          <th
                            className={`px-2 py-1.5 border border-gray-300 text-center ${i === 0 ? "bg-blue-50/50" : "bg-green-50/50"}`}
                          >
                            Burdened Rate
                          </th>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                </thead>
              )}

              <tbody className="bg-white">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={25}
                      className="p-8 text-center text-gray-500 border border-gray-300"
                    >
                      Loading spreadsheet data...
                    </td>
                  </tr>
                ) : activeTab === "Performance By Elements" && !isLoading ? (
                  (() => {
                    const sum = elementsSummaryData;
                    if (!sum || !sum.directCosts) return null;

                    const renderRow = (
                      label,
                      baseVal,
                      optsArr,
                      rowClass = "",
                      valClass = "",
                    ) => (
                      <tr
                        key={label}
                        className={`transition-colors ${rowClass}`}
                      >
                        <td className="px-4 py-2 border border-gray-300 font-medium text-gray-700 truncate max-w-[300px]">
                          {label}
                        </td>
                        {visibleYears.includes(BASE_YEAR) && (
                          <td
                            className={`px-4 py-2 border border-gray-300 text-right font-semibold ${valClass}`}
                          >
                            {formatCurrency(baseVal)}
                          </td>
                        )}
                        {optsArr.map(
                          (optVal, idx) =>
                            visibleYears.includes(OPTION_YEARS[idx]) && (
                              <td
                                key={idx}
                                className={`px-4 py-2 border border-gray-300 text-right font-semibold ${valClass}`}
                              >
                                {formatCurrency(optVal)}
                              </td>
                            ),
                        )}
                      </tr>
                    );

                    let totalDirBase = 0;
                    let totalDirOpts = Array(OPTION_YEARS.length).fill(0);
                    Object.values(sum.directCosts).forEach((dc) => {
                      totalDirBase += dc.base;
                      dc.opts.forEach((o, i) => (totalDirOpts[i] += o));
                    });

                    let totalBurdBase = 0;
                    let totalBurdOpts = Array(OPTION_YEARS.length).fill(0);
                    Object.values(sum.burdens).forEach((bc) => {
                      totalBurdBase += bc.base;
                      bc.opts.forEach((o, i) => (totalBurdOpts[i] += o));
                    });

                    const totalCostBase = totalDirBase + totalBurdBase;
                    const totalCostOpts = totalDirOpts.map(
                      (d, i) => d + totalBurdOpts[i],
                    );

                    const colCount =
                      1 +
                      (visibleYears.includes(BASE_YEAR) ? 1 : 0) +
                      OPTION_YEARS.filter((y) => visibleYears.includes(y))
                        .length;

                    return (
                      <>
                        <tr className="bg-gray-200 text-gray-900 border-t-2 border-t-gray-400">
                          <td
                            colSpan={colCount}
                            className="px-4 py-2 border border-gray-300 font-extrabold  tracking-wide text-xs"
                          >
                            Direct Cost
                          </td>
                        </tr>
                        {Object.values(sum.directCosts)
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((dc) =>
                            renderRow(
                              dc.name,
                              dc.base,
                              dc.opts,
                              "hover:bg-blue-50/60 even:bg-gray-50/50",
                              "text-gray-800",
                            ),
                          )}
                        {renderRow(
                          "Total Direct Cost",
                          totalDirBase,
                          totalDirOpts,
                          "bg-gray-100 border-t border-t-gray-400",
                          "text-gray-900 font-extrabold",
                        )}

                        <tr className="bg-gray-200 text-gray-900 border-t-4 border-t-white">
                          <td
                            colSpan={colCount}
                            className="px-4 py-2 border border-gray-300 font-extrabold  tracking-wide text-xs"
                          >
                            Burden Cost
                          </td>
                        </tr>
                        {Object.values(sum.burdens).map((bc) =>
                          renderRow(
                            bc.name,
                            bc.base,
                            bc.opts,
                            "hover:bg-blue-50/60 even:bg-gray-50/50",
                            "text-gray-800",
                          ),
                        )}
                        {renderRow(
                          "Total Burden Cost",
                          totalBurdBase,
                          totalBurdOpts,
                          "bg-gray-100 border-t border-t-gray-400",
                          "text-gray-900 font-extrabold",
                        )}

                        {renderRow(
                          "Total Cost",
                          totalCostBase,
                          totalCostOpts,
                          "bg-gray-200 border-t-4 border-t-white",
                          "text-gray-900 font-black",
                        )}

                        {/* Insert Live Fee Row */}
                        {renderRow(
                          `Fee (${Number(globalFee).toFixed(2)}%)`,
                          totalCostBase * (parseFloat(globalFee) / 100 || 0),
                          totalCostOpts.map(
                            (c) => c * (parseFloat(globalFee) / 100 || 0),
                          ),
                          "bg-purple-50 border-t border-t-gray-300",
                          "text-purple-900 font-bold",
                        )}

                        {/* Updated Final Price Row */}
                        <tr className="bg-blue-100 text-blue-900 border-t-4 border-t-blue-300 shadow-md">
                          <td className="px-4 py-3 border border-blue-300 font-extrabold  tracking-wider text-[14px]">
                            Revenue
                          </td>
                          {visibleYears.includes(BASE_YEAR) && (
                            <td className="px-4 py-3 border border-blue-300 text-right font-extrabold text-[14px]">
                              {formatCurrency(
                                totalCostBase *
                                  (1 + (parseFloat(globalFee) / 100 || 0)),
                              )}
                            </td>
                          )}
                          {totalCostOpts.map(
                            (optVal, idx) =>
                              visibleYears.includes(OPTION_YEARS[idx]) && (
                                <td
                                  key={idx}
                                  className="px-4 py-3 border border-blue-300 text-right font-extrabold text-[14px]"
                                >
                                  {formatCurrency(
                                    optVal *
                                      (1 + (parseFloat(globalFee) / 100 || 0)),
                                  )}
                                </td>
                              ),
                          )}
                        </tr>
                      </>
                    );
                  })()
                ) : (
                  <>
                    {isPerfTab && !isLoading && (
                      <>
                        {/* HEADER 1: BASE RATE */}
                        <tr className="bg-amber-50 font-semibold text-amber-900 text-xs border-b border-amber-200">
                          <td
                            className="px-3 py-1.5 border border-gray-300 sticky left-0 z-20 bg-amber-50 border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]"
                            colSpan={4}
                          >
                            Burden Rates %
                          </td>

                          {visibleYears.includes(BASE_YEAR) &&
                            (() => {
                              const bRates =
                                burdenRates?.[BASE_YEAR] || zeroRates;
                              return (
                                <>
                                  <td className="px-2 py-1.5 border border-gray-300 text-center">
                                    -
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-center">
                                    -
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {(bRates.aeroFringe * 100).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {(bRates.nasaFringe * 100).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {(bRates.custOH * 100).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {(bRates.columbusOH * 100).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {(bRates.subkMH * 100).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {(bRates.ga * 100).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-center">
                                    -
                                  </td>
                                  {isLaborPerf && (
                                    <td className="px-2 py-1.5 border border-gray-300 text-center">
                                      -
                                    </td>
                                  )}
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {Number(globalFee).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-center">
                                    -
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-center">
                                    -
                                  </td>
                                </>
                              );
                            })()}

                          {OPTION_YEARS.map((y) => {
                            if (!visibleYears.includes(y)) return null;
                            return (
                              <React.Fragment key={y}>
                                <td className="px-2 py-1.5 border border-gray-300 text-center">
                                  -
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-center">
                                  -
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-right">
                                  {(
                                    burdenRates?.[y]?.aeroFringe * 100 || 0
                                  ).toFixed(2)}
                                  %
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-right">
                                  {(
                                    burdenRates?.[y]?.nasaFringe * 100 || 0
                                  ).toFixed(2)}
                                  %
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-right">
                                  {(
                                    burdenRates?.[y]?.custOH * 100 || 0
                                  ).toFixed(2)}
                                  %
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-right">
                                  {(
                                    burdenRates?.[y]?.columbusOH * 100 || 0
                                  ).toFixed(2)}
                                  %
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-right">
                                  {(
                                    burdenRates?.[y]?.subkMH * 100 || 0
                                  ).toFixed(2)}
                                  %
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-right">
                                  {(burdenRates?.[y]?.ga * 100 || 0).toFixed(2)}
                                  %
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-center">
                                  -
                                </td>
                                {isLaborPerf && (
                                  <td className="px-2 py-1.5 border border-gray-300 text-center">
                                    -
                                  </td>
                                )}
                                <td className="px-2 py-1.5 border border-gray-300 text-right">
                                  {Number(globalFee).toFixed(2)}%
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-center">
                                  -
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-center">
                                  -
                                </td>
                              </React.Fragment>
                            );
                          })}
                        </tr>

                        {/* HEADER 2: ESCALATED RATE WITH DYNAMIC MONTH */}
                        <tr className="bg-amber-100 font-bold text-amber-900 text-xs border-b border-amber-200">
                          <td
                            className="px-3 py-1.5 border border-gray-300 sticky left-0 z-20 bg-amber-100 border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]"
                            colSpan={4}
                          >
                            Escalated Rates
                          </td>

                          {visibleYears.includes(BASE_YEAR) &&
                            (() => {
                              const bRates =
                                burdenRates?.[BASE_YEAR] || zeroRates;
                              return (
                                <>
                                  <td className="px-2 py-1.5 border border-gray-300 text-center">
                                    -
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-center">
                                    -
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {(bRates.aeroFringe * 100).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {(bRates.nasaFringe * 100).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {(bRates.custOH * 100).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {(bRates.columbusOH * 100).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {(bRates.subkMH * 100).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {(bRates.ga * 100).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-center">
                                    -
                                  </td>
                                  {isLaborPerf && (
                                    <td className="px-2 py-1.5 border border-gray-300 text-center">
                                      -
                                    </td>
                                  )}
                                  <td className="px-2 py-1.5 border border-gray-300 text-right">
                                    {Number(globalFee).toFixed(2)}%
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-center">
                                    -
                                  </td>
                                  <td className="px-2 py-1.5 border border-gray-300 text-center">
                                    -
                                  </td>
                                </>
                              );
                            })()}

                          {OPTION_YEARS.map((y) => {
                            if (!visibleYears.includes(y)) return null;
                            const yrMap = escalatedRatesMap[y];
                            const disp = yrMap?.display || {};

                            return (
                              <React.Fragment key={y}>
                                <td className="px-2 py-1.5 border border-gray-300 text-center">
                                  -
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-center">
                                  -
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
                                  {(
                                    disp.aeroFringe?.escRate * 100 || 0
                                  ).toFixed(2)}
                                  %{" "}
                                  {disp.aeroFringe?.escMonthLabel !== "-" ? (
                                    <span className="text-[10px] text-amber-700">
                                      ({disp.aeroFringe?.escMonthLabel})
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
                                  {(
                                    disp.nasaFringe?.escRate * 100 || 0
                                  ).toFixed(2)}
                                  %{" "}
                                  {disp.nasaFringe?.escMonthLabel !== "-" ? (
                                    <span className="text-[10px] text-amber-700">
                                      ({disp.nasaFringe?.escMonthLabel})
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
                                  {(disp.custOH?.escRate * 100 || 0).toFixed(2)}
                                  %{" "}
                                  {disp.custOH?.escMonthLabel !== "-" ? (
                                    <span className="text-[10px] text-amber-700">
                                      ({disp.custOH?.escMonthLabel})
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
                                  {(
                                    disp.columbusOH?.escRate * 100 || 0
                                  ).toFixed(2)}
                                  %{" "}
                                  {disp.columbusOH?.escMonthLabel !== "-" ? (
                                    <span className="text-[10px] text-amber-700">
                                      ({disp.columbusOH?.escMonthLabel})
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
                                  {(disp.subkMH?.escRate * 100 || 0).toFixed(2)}
                                  %{" "}
                                  {disp.subkMH?.escMonthLabel !== "-" ? (
                                    <span className="text-[10px] text-amber-700">
                                      ({disp.subkMH?.escMonthLabel})
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
                                  {(disp.ga?.escRate * 100 || 0).toFixed(2)}%{" "}
                                  {disp.ga?.escMonthLabel !== "-" ? (
                                    <span className="text-[10px] text-amber-700">
                                      ({disp.ga?.escMonthLabel})
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-center">
                                  -
                                </td>
                                {isLaborPerf && (
                                  <td className="px-2 py-1.5 border border-gray-300 text-center">
                                    -
                                  </td>
                                )}
                                <td className="px-2 py-1.5 border border-gray-300 text-right text-amber-900">
                                  {Number(globalFee).toFixed(2)}%
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-center">
                                  -
                                </td>
                                <td className="px-2 py-1.5 border border-gray-300 text-center">
                                  -
                                </td>
                              </React.Fragment>
                            );
                          })}
                        </tr>
                      </>
                    )}

                    {/* PAGINATED DATA ROWS */}
                    {paginated.map((r, idx) => {
                      return (
                        <React.Fragment key={idx}>
                          <tr className="group hover:bg-blue-50/50 even:bg-gray-50/30">
                            {activeTab === "Labor" && (
                              <>
                                <td className="px-3 py-1.5 border border-gray-300 sticky left-0 z-20 bg-white group-hover:bg-blue-50 w-[150px] min-w-[150px] max-w-[150px] truncate font-medium">
                                  {r.task}
                                </td>
                                <td className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs sticky left-[150px] z-20 bg-white group-hover:bg-blue-50 w-[120px] min-w-[120px] max-w-[120px] truncate">
                                  {r.type}
                                </td>
                                <td className="px-3 py-1.5 border border-gray-300 sticky left-[270px] z-20 bg-white group-hover:bg-blue-50 w-[150px] min-w-[150px] max-w-[150px] truncate">
                                  {r.lcat}
                                </td>
                                <td className="px-3 py-1.5 border border-gray-300 text-gray-500 sticky left-[420px] z-20 bg-white group-hover:bg-blue-50 w-[100px] min-w-[100px] max-w-[100px] truncate">
                                  {r.emplId}
                                </td>
                                <td className="px-3 py-1.5 border border-gray-300 sticky left-[520px] z-20 bg-white group-hover:bg-blue-50 w-[150px] min-w-[150px] max-w-[150px] truncate">
                                  {r.emplName}
                                </td>
                                <td className="px-3 py-1.5 border border-gray-300 text-right text-gray-600 sticky left-[670px] z-20 bg-white group-hover:bg-blue-50 w-[80px] min-w-[80px] max-w-[80px] border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]">
                                  {formatCurrency(r.rate)}
                                </td>

                                {/* Map Year Columns */}
                                {[r.base, ...r.opts].map((yData, yIdx) => {
                                  if (!visibleYears.includes(ALL_YEARS[yIdx]))
                                    return null;
                                  return (
                                    <React.Fragment key={yIdx}>
                                      <td className="px-3 py-1.5 border border-gray-300 text-right font-medium">
                                        {yData.hrs > 0
                                          ? formatNum(yData.hrs)
                                          : ""}
                                      </td>
                                      <td className="px-3 py-1.5 border border-gray-300 text-right font-semibold bg-gray-50/50">
                                        {yData.amt > 0
                                          ? formatCurrency(yData.amt)
                                          : ""}
                                      </td>
                                      {months.map((m, mIdx) => (
                                        <React.Fragment key={mIdx}>
                                          {laborMetrics.hrs && (
                                            <td className="px-3 py-1.5 border border-gray-300 text-right text-gray-600">
                                              {yData.monthly[mIdx] > 0
                                                ? formatNum(yData.monthly[mIdx])
                                                : ""}
                                            </td>
                                          )}
                                          {laborMetrics.amt && (
                                            <td className="px-3 py-1.5 border border-gray-300 text-right text-indigo-700 font-medium">
                                              {yData.monthlyAmt[mIdx] > 0
                                                ? formatCurrency(
                                                    yData.monthlyAmt[mIdx],
                                                  )
                                                : ""}
                                            </td>
                                          )}
                                        </React.Fragment>
                                      ))}
                                    </React.Fragment>
                                  );
                                })}
                              </>
                            )}

                            {activeTab === "Non-Labor" && (
                              <>
                                <td className="px-3 py-1.5 border border-gray-300 font-medium sticky left-0 z-20 bg-white group-hover:bg-blue-50 w-[150px] min-w-[150px] max-w-[150px] truncate">
                                  {r.task}
                                </td>
                                <td className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs sticky left-[150px] z-20 bg-white group-hover:bg-blue-50 w-[150px] min-w-[150px] max-w-[150px] truncate">
                                  {r.type}
                                </td>
                                <td className="px-3 py-1.5 border border-gray-300 sticky left-[300px] z-20 bg-white group-hover:bg-blue-50 w-[200px] min-w-[200px] max-w-[200px] truncate">
                                  {r.name}
                                </td>
                                <td className="px-3 py-1.5 border border-gray-300 text-gray-600 sticky left-[500px] z-20 bg-white group-hover:bg-blue-50 w-[200px] min-w-[200px] max-w-[200px] truncate border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]">
                                  {r.vendorName || "-"}
                                </td>

                                {/* Map Year Columns */}
                                {[r.base, ...r.opts].map((yData, yIdx) => {
                                  if (!visibleYears.includes(ALL_YEARS[yIdx]))
                                    return null;
                                  return (
                                    <React.Fragment key={yIdx}>
                                      <td className="px-3 py-1.5 border border-gray-300 text-right font-bold bg-gray-50/50">
                                        {yData.total > 0
                                          ? formatCurrency(yData.total)
                                          : ""}
                                      </td>
                                      {months.map((m, mIdx) => (
                                        <td
                                          key={mIdx}
                                          className="px-3 py-1.5 border border-gray-300 text-right text-gray-600"
                                        >
                                          {yData.monthly[mIdx] !== 0
                                            ? formatCurrency(
                                                yData.monthly[mIdx],
                                              )
                                            : ""}
                                        </td>
                                      ))}
                                    </React.Fragment>
                                  );
                                })}
                              </>
                            )}

                            {isPerfTab && (
                              <>
                                <td
                                  className="px-3 py-1.5 border border-gray-300 font-bold text-gray-700 sticky z-20 bg-white group-hover:bg-blue-50 truncate"
                                  style={{
                                    left: performanceColumnLefts.topLevel,
                                    width: performanceColumnWidths.topLevel,
                                    minWidth: performanceColumnWidths.topLevel,
                                  }}
                                >
                                  {r.topLevel}
                                </td>
                                <td
                                  className="px-3 py-1.5 border border-gray-300 font-medium sticky z-20 bg-white group-hover:bg-blue-50 truncate"
                                  style={{
                                    left: performanceColumnLefts.task,
                                    width: performanceColumnWidths.task,
                                    minWidth: performanceColumnWidths.task,
                                  }}
                                >
                                  {r.task}
                                </td>
                                <td
                                  className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs sticky z-20 bg-white group-hover:bg-blue-50 truncate"
                                  style={{
                                    left: performanceColumnLefts.type,
                                    width: performanceColumnWidths.type,
                                    minWidth: performanceColumnWidths.type,
                                  }}
                                >
                                  {r.type}
                                </td>

                                <td
                                  className="px-3 py-1.5 border border-gray-300 text-xs sticky z-20 bg-white group-hover:bg-blue-50 truncate border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)]"
                                  style={{
                                    left: performanceColumnLefts.category,
                                    width: performanceColumnWidths.category,
                                    minWidth: performanceColumnWidths.category,
                                  }}
                                >
                                  {activeTab === "Performance By Employee" ? (
                                    // Employee dropdown -> hourly-rate breakdown lines
                                    <button
                                      onClick={() => toggleExpand(r.id)}
                                      className="flex items-center gap-1 w-full text-blue-700 hover:text-blue-900 hover:underline focus:outline-none text-left font-semibold"
                                      title={
                                        r.rateRows && r.rateRows.length > 1
                                          ? `${r.rateRows.length} different hourly rates`
                                          : "Show hourly rate breakdown"
                                      }
                                    >
                                      {expandedRows.has(r.id) ? (
                                        <ChevronDown
                                          size={14}
                                          className="shrink-0 text-gray-500"
                                        />
                                      ) : (
                                        <ChevronRight
                                          size={14}
                                          className="shrink-0 text-gray-500"
                                        />
                                      )}
                                      <span className="truncate">{r.cat}</span>
                                      {r.rateRows && r.rateRows.length > 1 && (
                                        <span className="shrink-0 ml-auto text-[9px] font-bold bg-amber-100 text-amber-800 rounded px-1">
                                          {r.rateRows.length} rates
                                        </span>
                                      )}
                                    </button>
                                  ) : r.isLabor ? (
                                    <button
                                      onClick={() => toggleExpand(r.id)}
                                      className="flex items-center gap-1 w-full text-blue-600 hover:text-blue-800 hover:underline focus:outline-none text-left font-semibold"
                                    >
                                      {expandedRows.has(r.id) ? (
                                        <ChevronDown
                                          size={14}
                                          className="shrink-0 text-gray-500"
                                        />
                                      ) : (
                                        <ChevronRight
                                          size={14}
                                          className="shrink-0 text-gray-500"
                                        />
                                      )}
                                      <span className="truncate">{r.cat}</span>
                                    </button>
                                  ) : (
                                    <span className="text-gray-600 block pl-[18px] truncate">
                                      {r.cat}
                                    </span>
                                  )}
                                </td>

                                {[r.base, ...r.opts].map((y, i) => {
                                  if (!visibleYears.includes(ALL_YEARS[i]))
                                    return null;
                                  return (
                                    <React.Fragment key={i}>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right">
                                        {y.hrs > 0 ? formatNum(y.hrs) : ""}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right">
                                        {formatCurrency(y.cost)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-gray-600">
                                        {formatNum(y.aeroFringe)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-gray-600">
                                        {formatNum(y.nasaFringe)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-gray-600">
                                        {formatNum(y.custOH)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-gray-600">
                                        {formatNum(y.columbusOH)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-gray-600">
                                        {formatNum(y.subkMH)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-gray-600">
                                        {formatNum(y.ga)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right font-semibold text-indigo-800">
                                        {formatCurrency(y.totalBurdenedCost)}
                                      </td>
                                      {activeTab ===
                                        "Performance By Employee" && (
                                        <td className="px-2 py-1.5 border border-gray-300 text-right font-semibold text-cyan-700">
                                          {y.cost > 0
                                            ? y.wrapRate.toFixed(2)
                                            : ""}
                                        </td>
                                      )}
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-purple-700 font-medium">
                                        {formatCurrency(y.fee)}
                                      </td>
                                      <td
                                        className={`px-2 py-1.5 border border-gray-300 text-right font-bold ${i === 0 ? "bg-blue-100/50" : "bg-green-100/50"}`}
                                      >
                                        {formatCurrency(y.price)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-green-700 font-medium">
                                        {formatCurrency(y.rate)}
                                      </td>
                                    </React.Fragment>
                                  );
                                })}
                              </>
                            )}
                          </tr>

                          {/* EXPANDED HOURLY-RATE BREAKDOWN (Performance By Employee) */}
                          {activeTab === "Performance By Employee" &&
                            expandedRows.has(r.id) &&
                            (r.rateRows || []).map((rr, rIdx) => (
                              <tr
                                key={`${r.id}-rate-${rIdx}`}
                                className="group bg-indigo-50/50 hover:bg-indigo-100/50 text-gray-700"
                              >
                                <td
                                  className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100"
                                  style={{
                                    left: performanceColumnLefts.topLevel,
                                    width: performanceColumnWidths.topLevel,
                                    minWidth: performanceColumnWidths.topLevel,
                                  }}
                                ></td>
                                <td
                                  className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100 truncate pl-7 text-[11px] font-medium text-indigo-900 border-l-4 border-l-indigo-400"
                                  style={{
                                    left: performanceColumnLefts.task,
                                    width: performanceColumnWidths.task,
                                    minWidth: performanceColumnWidths.task,
                                  }}
                                  title={formatPeriods(rr.months)}
                                >
                                  ↳ {formatPeriods(rr.months)}
                                </td>
                                <td
                                  className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100 truncate text-xs text-indigo-800"
                                  style={{
                                    left: performanceColumnLefts.type,
                                    width: performanceColumnWidths.type,
                                    minWidth: performanceColumnWidths.type,
                                  }}
                                >
                                  {r.type}
                                </td>
                                <td
                                  className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100 truncate border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)] text-xs font-semibold text-indigo-800"
                                  style={{
                                    left: performanceColumnLefts.category,
                                    width: performanceColumnWidths.category,
                                    minWidth: performanceColumnWidths.category,
                                  }}
                                >
                                  {formatCurrency(rr.rate)} / hr
                                </td>

                                {[rr.base, ...rr.opts].map((y, i) => {
                                  if (!visibleYears.includes(ALL_YEARS[i]))
                                    return null;
                                  return (
                                    <React.Fragment key={i}>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-900">
                                        {y.hrs > 0 ? formatNum(y.hrs) : ""}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-900">
                                        {formatCurrency(y.cost)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
                                        {formatNum(y.aeroFringe)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
                                        {formatNum(y.nasaFringe)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
                                        {formatNum(y.custOH)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
                                        {formatNum(y.columbusOH)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
                                        {formatNum(y.subkMH)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
                                        {formatNum(y.ga)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right font-semibold text-indigo-800">
                                        {formatCurrency(y.totalBurdenedCost)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right font-semibold text-cyan-700">
                                        {y.cost > 0
                                          ? y.wrapRate.toFixed(2)
                                          : ""}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-purple-700 font-medium">
                                        {formatCurrency(y.fee)}
                                      </td>
                                      <td
                                        className={`px-2 py-1.5 border border-gray-300 text-right font-bold ${i === 0 ? "bg-blue-100/50" : "bg-green-100/50"}`}
                                      >
                                        {formatCurrency(y.price)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-green-700 font-medium">
                                        {formatCurrency(y.rate)}
                                      </td>
                                    </React.Fragment>
                                  );
                                })}
                              </tr>
                            ))}

                          {/* EXPANDED EMPLOYEE SUB-ROWS */}
                          {activeTab === "Performance By Category" &&
                            r.isLabor &&
                            expandedRows.has(r.id) &&
                            r.subItems.map((sub, sIdx) => (
                              <tr
                                key={`${r.id}-sub-${sIdx}`}
                                className="group bg-indigo-50/50 hover:bg-indigo-100/50 text-gray-700"
                              >
                                <td
                                  className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100"
                                  style={{
                                    left: performanceColumnLefts.topLevel,
                                    width: performanceColumnWidths.topLevel,
                                    minWidth: performanceColumnWidths.topLevel,
                                  }}
                                ></td>
                                <td
                                  className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100 truncate pl-7 text-xs font-medium text-indigo-900 border-l-4 border-l-indigo-400"
                                  style={{
                                    left: performanceColumnLefts.task,
                                    width: performanceColumnWidths.task,
                                    minWidth: performanceColumnWidths.task,
                                  }}
                                >
                                  ↳ {sub.name}
                                </td>
                                <td
                                  className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100 truncate text-xs text-indigo-800"
                                  style={{
                                    left: performanceColumnLefts.type,
                                    width: performanceColumnWidths.type,
                                    minWidth: performanceColumnWidths.type,
                                  }}
                                >
                                  {r.type}
                                </td>
                                <td
                                  className="px-3 py-1.5 border border-gray-300 sticky z-10 bg-indigo-50 group-hover:bg-indigo-100 truncate border-r-2 border-r-gray-400 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.2)] text-xs text-indigo-800"
                                  style={{
                                    left: performanceColumnLefts.category,
                                    width: performanceColumnWidths.category,
                                    minWidth: performanceColumnWidths.category,
                                  }}
                                >
                                  {r.cat}
                                </td>

                                {[sub.base, ...sub.opts].map((y, i) => {
                                  if (!visibleYears.includes(ALL_YEARS[i]))
                                    return null;
                                  return (
                                    <React.Fragment key={i}>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-900">
                                        {y.hrs > 0 ? formatNum(y.hrs) : ""}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-900">
                                        {formatCurrency(y.cost)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
                                        {formatNum(y.aeroFringe)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
                                        {formatNum(y.nasaFringe)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
                                        {formatNum(y.custOH)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
                                        {formatNum(y.columbusOH)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
                                        {formatNum(y.subkMH)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-indigo-700/70">
                                        {formatNum(y.ga)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right font-semibold text-indigo-800">
                                        {formatCurrency(y.totalBurdenedCost)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-purple-700 font-medium">
                                        {formatCurrency(y.fee)}
                                      </td>
                                      <td
                                        className={`px-2 py-1.5 border border-gray-300 text-right font-bold ${i === 0 ? "bg-blue-100/50" : "bg-green-100/50"}`}
                                      >
                                        {formatCurrency(y.price)}
                                      </td>
                                      <td className="px-2 py-1.5 border border-gray-300 text-right text-green-700 font-medium">
                                        {formatCurrency(y.rate)}
                                      </td>
                                    </React.Fragment>
                                  );
                                })}
                              </tr>
                            ))}
                        </React.Fragment>
                      );
                    })}
                  </>
                )}
              </tbody>

              {/* TOTALS FOOTER ROWS */}
              {activeTab === "Labor" && laborTotals && (
                <tfoot className="sticky bottom-0 z-30 shadow-[0_-1px_2px_rgba(0,0,0,0.1)]">
                  <tr className="bg-blue-50 text-blue-900">
                    <td
                      colSpan={6}
                      className="px-3 py-2.5 border border-blue-200 text-right font-bold text-[11px] tracking-wider  sticky left-0 z-40 border-r-2 border-r-blue-300 bg-blue-50"
                    >
                      Total
                    </td>
                    {[laborTotals.base, ...laborTotals.opts].map(
                      (yData, yIdx) => {
                        if (!visibleYears.includes(ALL_YEARS[yIdx]))
                          return null;
                        return (
                          <React.Fragment key={`tot-${yIdx}`}>
                            <td className="px-3 py-2.5 border border-blue-200 text-right font-bold">
                              {yData.hrs > 0 ? formatNum(yData.hrs) : ""}
                            </td>
                            <td className="px-3 py-2.5 border border-blue-200 text-right font-bold text-blue-800">
                              {yData.amt > 0 ? formatCurrency(yData.amt) : ""}
                            </td>
                            {months.map((m, mIdx) => (
                              <React.Fragment key={mIdx}>
                                {laborMetrics.hrs && (
                                  <td className="px-3 py-2.5 border border-blue-200 text-right font-semibold">
                                    {yData.monthly[mIdx] > 0
                                      ? formatNum(yData.monthly[mIdx])
                                      : ""}
                                  </td>
                                )}
                                {laborMetrics.amt && (
                                  <td className="px-3 py-2.5 border border-blue-200 text-right font-semibold text-indigo-800">
                                    {yData.monthlyAmt[mIdx] > 0
                                      ? formatCurrency(yData.monthlyAmt[mIdx])
                                      : ""}
                                  </td>
                                )}
                              </React.Fragment>
                            ))}
                          </React.Fragment>
                        );
                      },
                    )}
                  </tr>
                </tfoot>
              )}

              {activeTab === "Non-Labor" && nonLaborTotals && (
                <tfoot className="sticky bottom-0 z-30 shadow-[0_-1px_2px_rgba(0,0,0,0.1)]">
                  <tr className="bg-blue-50 text-blue-900">
                    <td
                      colSpan={4}
                      className="px-3 py-2.5 border border-blue-200 text-right font-bold text-[11px] tracking-wider  sticky left-0 z-40 bg-blue-50 border-r-2 border-r-blue-300"
                    >
                      Total
                    </td>
                    {[nonLaborTotals.base, ...nonLaborTotals.opts].map(
                      (yData, yIdx) => {
                        if (!visibleYears.includes(ALL_YEARS[yIdx]))
                          return null;
                        return (
                          <React.Fragment key={`totNL-${yIdx}`}>
                            <td className="px-3 py-2.5 border border-blue-200 text-right font-bold text-blue-800">
                              {yData.total > 0
                                ? formatCurrency(yData.total)
                                : ""}
                            </td>
                            {months.map((m, mIdx) => (
                              <td
                                key={mIdx}
                                className="px-3 py-2.5 border border-blue-200 text-right font-semibold"
                              >
                                {yData.monthly[mIdx] !== 0
                                  ? formatCurrency(yData.monthly[mIdx])
                                  : ""}
                              </td>
                            ))}
                          </React.Fragment>
                        );
                      },
                    )}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>

      {/* Pagination / Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-t border-gray-300 text-xs text-gray-600 font-medium">
        <span>
          {activeTab === "Performance By Elements"
            ? `Ready - ${Object.keys(elementsSummaryData?.directCosts || {}).length} Types`
            : activeTab === "Proposal Package"
              ? `Ready - Document Editor`
              : activeTab === "DFARS Adequacy Checklist"
                ? `Ready - DFARS Checklist`
                : activeTab === "Dashboard"
                  ? `Ready - Dashboard Overview`
                  : activeTab === "Employee Wrap Rate"
                    ? `Ready - ${employeeWrapRateData.length} active Employee API records`
                    : activeTab === "Labor Dollar Burn Rate"
                      ? // ? `Ready - ${laborDollarBurnData.length} labor category rows; ${burnPeriodCount} periods`
                        `Ready - ${laborHoursBurnData.length} employee / project / PLC rows; ${burnPeriodCount} periods`
                      : activeTab === "Labor Hours Burn Rate"
                        ? `Ready - ${laborHoursBurnData.length} employee / project / PLC rows; ${burnPeriodCount} periods`
                        : `Showing rows ${(currentPage - 1) * rowsPerPage + 1} to ${Math.min(currentPage * rowsPerPage, (sortedData || []).length)} of ${(sortedData || []).length}`}
          {selectedProject ? ` | Filter: ${selectedProject}` : ""}
        </span>

        <div className="flex items-center gap-4 ml-auto">
          {activeTab !== "Performance By Elements" &&
            activeTab !== "Proposal Package" &&
            activeTab !== "Dashboard" &&
            activeTab !== "Employee Wrap Rate" &&
            activeTab !== "Labor Dollar Burn Rate" &&
            activeTab !== "Labor Hours Burn Rate" &&
            activeTab !== "DFARS Adequacy Checklist" &&
            sortedData.length > 0 && (
              <div className="flex items-center gap-2">
                <label
                  htmlFor="rowsPerPage"
                  className="font-semibold  tracking-wider text-[10px] text-gray-500"
                >
                  Rows per page:
                </label>
                <select
                  id="rowsPerPage"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded bg-white px-1 py-0.5 outline-none cursor-pointer focus:border-green-600"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                </select>
              </div>
            )}

          {activeTab !== "Performance By Elements" &&
            activeTab !== "Proposal Package" &&
            activeTab !== "Dashboard" &&
            activeTab !== "DFARS Adequacy Checklist" &&
            sortedData.length > 0 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:bg-transparent transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-2">
                  Page {currentPage} of{" "}
                  {Math.max(1, Math.ceil(sortedData.length / rowsPerPage))}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage * rowsPerPage >= sortedData.length}
                  className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:bg-transparent transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPerformance;
