// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Download, StickyNote } from "lucide-react";
// import { exportSchedulesToExcel } from "../utils/scheduleExcelExport";
// import ScheduleA from "../components/schedules/SchedA";
// import SchedB from "../components/schedules/SchedB";
// import SchedC1 from "../components/schedules/SchedC1";
// import SchedC2 from "../components/schedules/SchedC2";
// import SchedC6 from "../components/schedules/SchedC6";
// import SchedD1 from "../components/schedules/SchedD1";
// import SchedD2 from "../components/schedules/SchedD2";
// import SchedE from "../components/schedules/SchedE";
// import Fringe from "../components/schedules/Fringe";
// import SchedG from "../components/schedules/SchedG";
// import SchedG1 from "../components/schedules/SchedG-1";
// import SchedSummaryH from "../components/schedules/SummarySchedH";
// import SchedH from "../components/schedules/SchedH";
// import SchedHCont from "../components/schedules/SchedHCont";
// import SchedI from "../components/schedules/SchedI";
// import SchedJ from "../components/schedules/SchedJ";
// import SchedK from "../components/schedules/SchedK";
// import SchedL from "../components/schedules/SchedL";
// import SchedM from "../components/schedules/SchedM";
// import SchedM_FRPA_2025 from "../components/schedules/SchedM_FRPA_2025";
// import SchedN from "../components/schedules/SchedN";
// import SchedO from "../components/schedules/SchedO";
// import SupplA1 from "../components/schedules/SupplA1";
// import SupplA2 from "../components/schedules/SupplA2";
// import SupplA3 from "../components/schedules/SupplA3";
// import SupplA4 from "../components/schedules/SupplA4";
// import SupplB from "../components/schedules/SupplB";
// import SupplC from "../components/schedules/SupplC";
// import SupplO from "../components/schedules/SupplO";
// import TrialBalance from "../components/schedules/TrialBalance";
// import JobCostLedger from "../components/schedules/JobCostLedger";
// import IceSetup from "./schedules/ICESetup";
// import { backendUrl } from "./config";
// import { toast } from "react-toastify";
// import SchedKImport from "./schedules/SchedKImport";
// import ImportTabs from "./schedules/ImportTabs";

// // Configuration for tabs with custom category colors matching Excel sheets
// const TABS_CONFIG = [
//   { id: "ice_setup", label: "Setup", colorType: "cyan" },
//   { id: "sched_a", label: "Sched A", colorType: "cyan" },
//   { id: "sched_b", label: "Sched B", colorType: "cyan" },
//   { id: "sched_c1", label: "Sched C (1)", colorType: "cyan" },
//   { id: "sched_c2", label: "Sched C (2)", colorType: "cyan" },
//   { id: "sched_c3", label: "Sched C (3)", colorType: "cyan" },
//   { id: "sched_c4", label: "Sched C (4)", colorType: "cyan" },
//   { id: "sched_c5", label: "Sched C (5)", colorType: "cyan" },
//   { id: "sched_c6", label: "Sched C (6)", colorType: "cyan" },
//   { id: "sched_d1", label: "Sched D (1)", colorType: "cyan" },
//   { id: "sched_d2", label: "Sched D (2)", colorType: "cyan" },
//   { id: "sched_d3", label: "Sched D (3)", colorType: "cyan" },
//   { id: "sched_d4", label: "Sched D (4)", colorType: "cyan" },
//   { id: "sched_d5", label: "Sched D (5)", colorType: "cyan" },
//   { id: "sched_d6", label: "Sched D (6)", colorType: "cyan" },
//   { id: "sched_e", label: "Sched E", colorType: "cyan" },
//   { id: "sched_fringe", label: "Fringe", colorType: "cyan" },
//   { id: "sched_g", label: "Sched G", colorType: "cyan" },
//   { id: "sched_g1", label: "Sched G-1", colorType: "cyan" },
//   { id: "sched_summaryh", label: "Sched Summary H", colorType: "cyan" },
//   { id: "sched_h", label: "Sched H", colorType: "cyan" },
//   { id: "sched_hcont", label: "Sched H Cont", colorType: "cyan" },
//   { id: "sched_i", label: "Sched I", colorType: "cyan" },
//   { id: "sched_j", label: "Sched J", colorType: "cyan" },
//   { id: "sched_k", label: "Sched K", colorType: "blue" },
//   { id: "sched_l", label: "Sched L", colorType: "cyan" },
//   { id: "sched_m", label: "Sched M", colorType: "cyan" },
//   // { id: "sched_m_frpa_2025", label: "Sched M FRPA 2025", colorType: "cyan" },
//   { id: "sched_n", label: "Sched N", colorType: "cyan" },
//   { id: "sched_o", label: "Sched O", colorType: "cyan" },
//   { id: "suppl_a1", label: "Suppl A1", colorType: "cyan" },
//   { id: "suppl_a2", label: "Suppl A2", colorType: "cyan" },
//   { id: "suppl_a3", label: "Suppl A3", colorType: "cyan" },
//   { id: "suppl_a4", label: "Suppl A4", colorType: "cyan" },
//   { id: "suppl_b", label: "Suppl B", colorType: "cyan" },
//   { id: "suppl_c", label: "Suppl C", colorType: "cyan" },
//   { id: "suppl_o", label: "Suppl O", colorType: "cyan" },
//   { id: "sched_k_import", label: "Sched K Import", colorType: "blue" },
//   { id: "trial_balance", label: "Trial Balance", colorType: "blue" },
//   { id: "job_cost_ledger", label: "Job Cost Ledger", colorType: "blue" },
//   { id: "import_center", label: "Import", colorType: "blue" },
//   // { id: "proof_check", label: "Proof & Check", colorType: "purple" },
// ];

// // List of schedule IDs where the Save Notes button should be displayed
// const ALLOWED_NOTE_TABS = [
//   "sched_b",
//   "sched_c1",
//   "sched_d1",
//   "sched_d2",
//   "sched_e",
//   "sched_fringe",
//   "sched_g",
//   "sched_summaryh",
//   "sched_h",
//   "sched_i",
//   "sched_j",
//   "sched_k",
//   "suppl_a1",
//   "suppl_a2",
//   "suppl_a3",
//   "suppl_a4",
// ];

// // Styling configurations based on Excel sheet status
// const getColorStyles = (colorType, isActive) => {
//   if (isActive) {
//     return "bg-white text-gray-900 font-semibold shadow-sm border-b-2 border-emerald-700";
//   }

//   switch (colorType) {
//     case "green":
//       return "bg-[#d1fadf] text-gray-900 hover:bg-[#bbf7d0]";
//     case "cyan":
//       return "bg-[#cff4fc] text-gray-900 hover:bg-[#a5f3fc]";
//     case "blue":
//       return "bg-[#93c5fd] text-gray-900 hover:bg-[#60a5fa]";
//     case "purple":
//       return "bg-[#d8b4fe] text-gray-900 hover:bg-[#c084fc]";
//     case "default":
//     default:
//       return "bg-[#262626] text-gray-200 hover:bg-[#333333]";
//   }
// };

// export default function ExcelTabNavigation() {
//   const [activeTab, setActiveTab] = useState("");
//   const [exporting, setExporting] = useState(false);

//   const [savingNotes, setSavingNotes] = useState(false);
//   const [explanatoryNote, setExplanatoryNote] = useState("");
//   const [noteId, setNoteId] = useState(0);

//   const currentYear = new Date().getFullYear();
//   const [selectedYear, setSelectedYear] = useState(currentYear);

//   // Generate dynamic array of years from (currentYear - 5) to (currentYear + 5)
//   const yearsList = useMemo(() => {
//     const years = [];
//     for (let y = currentYear - 5; y <= currentYear + 5; y++) {
//       years.push(y);
//     }
//     return years;
//   }, [currentYear]);

//   // const currentYear = 2026;

//   // Fetch notes centrally whenever the active tab changes
//   useEffect(() => {
//     // if (!activeTab) {
//     //   setExplanatoryNote("");
//     //   setNoteId(0);
//     //   return;
//     // }
//     if (!activeTab || !ALLOWED_NOTE_TABS.includes(activeTab)) {
//       setExplanatoryNote("");
//       setNoteId(0);
//       return;
//     }

//     const fetchNotes = async () => {
//       try {
//         const res = await fetch(
//           `${backendUrl}/api/IceScheduleNotes?scheduleName=${activeTab}&year=${currentYear}`,
//         );
//         if (res.ok) {
//           const data = await res.json();
//           setExplanatoryNote(data?.notes || "");
//           setNoteId(data?.id ?? 0);
//         } else {
//           // Reset if 404 or not found
//           setExplanatoryNote("");
//           setNoteId(0);
//         }
//       } catch (err) {
//         console.warn("Could not load notes:", err);
//         setExplanatoryNote("");
//         setNoteId(0);
//       }
//     };

//     fetchNotes();
//   }, [activeTab]);

//   // Unified Save function
//   const handleSaveNotes = async () => {
//     if (!activeTab) return;

//     try {
//       setSavingNotes(true);
//       const payload = {
//         id: noteId,
//         scheduleName: activeTab,
//         notes: explanatoryNote,
//         year: currentYear,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };

//       const response = await fetch(`${backendUrl}/api/IceScheduleNotes`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to save notes: ${response.status}`);
//       }

//       const resData = await response.json().catch(() => null);

//       // Update local noteId if the POST response returns the newly created record ID
//       if (resData && resData.id) {
//         setNoteId(resData.id);
//       }

//       toast.success(`Notes for ${activeTab} saved successfully!`);
//     } catch (err) {
//       console.error("Error saving notes:", err);
//       alert(`Error saving notes: ${err.message}`);
//     } finally {
//       setSavingNotes(false);
//     }
//   };

//   const companyName =
//     import.meta.env?.VITE_COMPANY_NAME || "Revolve FinTech LLC";
//   const companyAddress =
//     import.meta.env?.VITE_COMPANY_ADDRESS || "Vienna, VA 22182";

//   const handleExport = async () => {
//     setExporting(true);
//     try {
//       await exportSchedulesToExcel();
//     } catch (error) {
//       console.error("Schedule workbook export failed:", error);
//       window.alert(error?.message || "Schedule workbook export failed.");
//     } finally {
//       setExporting(false);
//     }
//   };

//   return (
//     <div className="w-full min-h-screen bg-gray-100 flex flex-col">
//       {/* ----------------- Top Excel Tab Bar ----------------- */}
//       <div className="bg-[#1c1a17] px-4 py-2 flex items-center justify-between border-b border-gray-800 shadow-inner">
//         <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1">
//           {TABS_CONFIG.map((tab) => {
//             const isActive = activeTab === tab.id;
//             const colorClasses = getColorStyles(tab.colorType, isActive);

//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`relative px-4 py-1.5 text-xs font-medium rounded transition-all duration-150 whitespace-nowrap border-x border-gray-800/40 ${colorClasses}`}
//               >
//                 {tab.label}
//               </button>
//             );
//           })}
//         </div>
//         <button
//           type="button"
//           onClick={handleExport}
//           disabled={exporting}
//           className="ml-3 flex shrink-0 items-center gap-2 rounded border border-emerald-600 bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"
//         >
//           <Download size={14} />
//           {exporting ? "Exporting..." : "Export Workbook"}
//         </button>
//       </div>

//       {/* ----------------- Active Sheet Content View ----------------- */}
//       <div className="flex-1 p-6 flex flex-col">
//         {/* Top Right Controls: Year Filter + Save Button */}
//         <div className="flex justify-end items-center gap-3 mb-3">
//           <div className="flex items-center gap-2">
//             <label
//               htmlFor="year-filter"
//               className="text-xs font-medium text-gray-700"
//             >
//               Year:
//             </label>
//             <select
//               id="year-filter"
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(Number(e.target.value))}
//               className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//             >
//               {yearsList.map((y) => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {ALLOWED_NOTE_TABS.includes(activeTab) && (
//             <button
//               type="button"
//               onClick={handleSaveNotes}
//               disabled={savingNotes}
//               className="flex items-center gap-2 rounded border border-emerald-600 bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 transition-colors disabled:opacity-50"
//             >
//               <span>Save</span>
//             </button>
//           )}
//         </div>

//         {activeTab ? (
//           <TabContentRenderer
//             activeTab={activeTab}
//             onNavigate={setActiveTab}
//             companyName={companyName}
//             explanatoryNote={explanatoryNote}
//             setExplanatoryNote={setExplanatoryNote}
//             companyAddress={companyAddress}
//             selectedYear={selectedYear}
//             setSelectedYear={setSelectedYear}
//           />
//         ) : (
//           <div className="flex justify-center items-center h-64 text-gray-500 font-medium text-sm">
//             <p>Select Tab to View</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ---------------- Component to render specific tab data ----------------
// function TabContentRenderer({
//   activeTab,
//   onNavigate,
//   companyName,
//   companyAddress,
//   explanatoryNote,
//   setExplanatoryNote,
//   selectedYear,
//   setSelectedYear,
// }) {
//   const commonProps = {
//     onNavigate,
//     companyName,
//     companyAddress,
//     explanatoryNote,
//     setExplanatoryNote,
//     selectedYear,
//     setSelectedYear,
//     year: selectedYear,
//   };

//   switch (activeTab) {
//     case "ice_setup":
//       return <IceSetup {...commonProps} />;
//     case "sched_a":
//       return <ScheduleA {...commonProps} />;

//     case "sched_b":
//       return <SchedB {...commonProps} />;

//     case "sched_c1":
//       return <SchedC1 {...commonProps} />;

//     case "sched_c2":
//       return <SchedC2 {...commonProps} />;

//     case "sched_c6":
//       return <SchedC6 {...commonProps} />;

//     case "sched_d1":
//       return <SchedD1 {...commonProps} />;

//     case "sched_d2":
//       return <SchedD2 {...commonProps} />;

//     case "sched_e":
//       return <SchedE {...commonProps} />;

//     case "sched_fringe":
//       return <Fringe {...commonProps} />;

//     case "sched_g":
//       return <SchedG {...commonProps} />;

//     case "sched_g1":
//       return <SchedG1 {...commonProps} />;

//     case "sched_summaryh":
//       return <SchedSummaryH {...commonProps} />;

//     case "sched_h":
//       return <SchedH {...commonProps} />;

//     case "sched_hcont":
//       return <SchedHCont {...commonProps} />;

//     case "sched_i":
//       return <SchedI {...commonProps} />;

//     case "sched_j":
//       return <SchedJ {...commonProps} />;

//     case "sched_k":
//       return <SchedK {...commonProps} />;

//     case "sched_k_import":
//       return <SchedKImport {...commonProps} />;

//     case "sched_l":
//       return <SchedL {...commonProps} />;

//     case "sched_m":
//       return <SchedM {...commonProps} />;

//     case "sched_m_frpa_2025":
//       return <SchedM_FRPA_2025 {...commonProps} />;

//     case "sched_n":
//       return <SchedN {...commonProps} />;

//     case "sched_o":
//       return <SchedO {...commonProps} />;

//     case "suppl_a1":
//       return <SupplA1 {...commonProps} />;

//     case "suppl_a2":
//       return <SupplA2 {...commonProps} />;

//     case "suppl_a3":
//       return <SupplA3 {...commonProps} />;

//     case "suppl_a4":
//       return <SupplA4 {...commonProps} />;

//     case "suppl_b":
//       return <SupplB {...commonProps} />;

//     case "suppl_c":
//       return <SupplC {...commonProps} />;

//     case "suppl_o":
//       return <SupplO {...commonProps} />;

//     case "trial_balance":
//       return <TrialBalance {...commonProps} />;

//     case "job_cost_ledger":
//       return <JobCostLedger {...commonProps} />;

//     case "import_center":
//       return <ImportTabs {...commonProps} />;

//     // case "proof_check":
//     //   return <ProofCheck />;

//     default:
//       return;
//   }
// }

// // Generic Placeholder component for tabs awaiting detailed tables
// function SchedulePlaceholder({ title }) {
//   return (
//     <div className="max-w-4xl mx-auto bg-white p-8 rounded border border-gray-300 shadow-sm text-center">
//       <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
//       <p className="text-sm text-gray-500">
//         {/* Data grid and calculations for this sheet are loaded dynamically. */}
//       </p>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Download, RefreshCw, StickyNote } from "lucide-react";
import { exportSchedulesToExcel } from "../utils/scheduleExcelExport";
import ScheduleA from "../components/schedules/SchedA";
import SchedB from "../components/schedules/SchedB";
import SchedC1 from "../components/schedules/SchedC1";
import SchedC2 from "../components/schedules/SchedC2";
import SchedC6 from "../components/schedules/SchedC6";
import SchedD1 from "../components/schedules/SchedD1";
import SchedD2 from "../components/schedules/SchedD2";
import SchedE from "../components/schedules/SchedE";
import Fringe from "../components/schedules/Fringe";
import SchedG from "../components/schedules/SchedG";
import SchedG1 from "../components/schedules/SchedG-1";
import SchedSummaryH from "../components/schedules/SummarySchedH";
import SchedH from "../components/schedules/SchedH";
import SchedHCont from "../components/schedules/SchedHCont";
import SchedI from "../components/schedules/SchedI";
import SchedJ from "../components/schedules/SchedJ";
import SchedK from "../components/schedules/SchedK";
import SchedL from "../components/schedules/SchedL";
import SchedM from "../components/schedules/SchedM";
import SchedM_FRPA_2025 from "../components/schedules/SchedM_FRPA_2025";
import SchedN from "../components/schedules/SchedN";
import SchedO from "../components/schedules/SchedO";
import SupplA1 from "../components/schedules/SupplA1";
import SupplA2 from "../components/schedules/SupplA2";
import SupplA3 from "../components/schedules/SupplA3";
import SupplA4 from "../components/schedules/SupplA4";
import SupplB from "../components/schedules/SupplB";
import SupplC from "../components/schedules/SupplC";
import SupplO from "../components/schedules/SupplO";
import TrialBalance from "../components/schedules/TrialBalance";
import JobCostLedger from "../components/schedules/JobCostLedger";
import IceSetup from "./schedules/ICESetup";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import SchedKImport from "./schedules/SchedKImport";
// import ImportTabs from "./schedules/ImportTabs";
import FileManager from "./schedules/FileManager";
import OrgAccountPoolMapping from "./schedules/OrgAccountPoolMapping";
// import SchedD3 from "./schedules/SchedD3";
// import SchedD4 from "./schedules/SchedD4";
// import SchedD5 from "./schedules/SchedD5";
// import SchedD6 from "./schedules/SchedD6";

// Base master configuration for all tabs
const MASTER_TABS = [
  { id: "ice_setup", label: "Setup", colorType: "cyan" },
  { id: "sched_a", label: "Sched A", colorType: "cyan" },
  { id: "sched_b", label: "Sched B", colorType: "cyan" },

  // Dynamic Sched C tabs (1-5 + 6)
  {
    id: "sched_c1",
    label: "Sched C (1)",
    colorType: "cyan",
    group: "C",
    index: 1,
  },
  {
    id: "sched_c2",
    label: "Sched C (2)",
    colorType: "cyan",
    group: "C",
    index: 2,
  },
  // {
  //   id: "sched_c3",
  //   label: "Sched C (3)",
  //   colorType: "cyan",
  //   group: "C",
  //   index: 3,
  // },
  // {
  //   id: "sched_c4",
  //   label: "Sched C (4)",
  //   colorType: "cyan",
  //   group: "C",
  //   index: 4,
  // },
  // {
  //   id: "sched_c5",
  //   label: "Sched C (5)",
  //   colorType: "cyan",
  //   group: "C",
  //   index: 5,
  // },
  {
    id: "sched_c6",
    label: "Sched C (6)",
    colorType: "cyan",
    // group: "C",
    // index: 6,
  },

  // Dynamic Sched D tabs (1-6)
  {
    id: "sched_d1",
    label: "Sched D (1)",
    colorType: "cyan",
    group: "D",
    index: 1,
  },
  {
    id: "sched_d2",
    label: "Sched D (2)",
    colorType: "cyan",
    group: "D",
    index: 2,
  },
  // {
  //   id: "sched_d3",
  //   label: "Sched D (3)",
  //   colorType: "cyan",
  //   group: "D",
  //   index: 3,
  // },
  // {
  //   id: "sched_d4",
  //   label: "Sched D (4)",
  //   colorType: "cyan",
  //   group: "D",
  //   index: 4,
  // },
  // {
  //   id: "sched_d5",
  //   label: "Sched D (5)",
  //   colorType: "cyan",
  //   group: "D",
  //   index: 5,
  // },
  // {
  //   id: "sched_d6",
  //   label: "Sched D (6)",
  //   colorType: "cyan",
  //   group: "D",
  //   index: 6,
  // },

  { id: "sched_e", label: "Sched E", colorType: "cyan" },
  { id: "sched_fringe", label: "Fringe", colorType: "cyan" },
  { id: "sched_g", label: "Sched G", colorType: "cyan" },
  { id: "sched_g1", label: "Sched G-1", colorType: "cyan" },
  { id: "sched_summaryh", label: "Sched Summary H", colorType: "cyan" },
  { id: "sched_h", label: "Sched H", colorType: "cyan" },
  { id: "sched_hcont", label: "Sched H Cont", colorType: "cyan" },
  { id: "sched_i", label: "Sched I", colorType: "cyan" },
  { id: "sched_j", label: "Sched J", colorType: "cyan" },
  { id: "sched_k", label: "Sched K", colorType: "cyan" },
  { id: "sched_l", label: "Sched L", colorType: "cyan" },
  { id: "sched_m", label: "Sched M", colorType: "cyan" },
  { id: "sched_n", label: "Sched N", colorType: "cyan" },
  { id: "sched_o", label: "Sched O", colorType: "cyan" },
  { id: "suppl_a1", label: "Suppl A1", colorType: "cyan" },
  { id: "suppl_a2", label: "Suppl A2", colorType: "cyan" },
  { id: "suppl_a3", label: "Suppl A3", colorType: "cyan" },
  { id: "suppl_a4", label: "Suppl A4", colorType: "cyan" },
  { id: "suppl_b", label: "Suppl B", colorType: "cyan" },
  { id: "suppl_c", label: "Suppl C", colorType: "cyan" },
  { id: "suppl_o", label: "Suppl O", colorType: "cyan" },
  { id: "sched_k_import", label: "Sched K Import", colorType: "blue" },
  { id: "trial_balance", label: "Trial Balance", colorType: "blue" },
  { id: "job_cost_ledger", label: "Job Cost Ledger", colorType: "blue" },
  // { id: "import_center", label: "Import", colorType: "blue" },
  { id: "file_manager", label: "ICE History", colorType: "blue" },
  // { id: "orgacctpoool", label: "OrgAcctPool Mapping", colorType: "blue" },
];

const SCHEDULE_ENDPOINTS = {
  sched_b: `${backendUrl}/api/TrialBalance/AddScheduleMappingFromSchedule`,
  sched_c1: `${backendUrl}/api/TrialBalance/scheduleC_cost`,
  sched_d1: `${backendUrl}/api/TrialBalance/scheduleD1_cost`,
  sched_d2: `${backendUrl}/api/TrialBalance/scheduleD2_cost`,
  sched_e: `${backendUrl}/api/TrialBalance/scheduleE_cost`,
  sched_h: `${backendUrl}/api/TrialBalance/scheduleH_cost`,
  // Add additional schedules and endpoints here as needed
};

const ALLOWED_NOTE_TABS = [
  "sched_b",
  "sched_c1",
  "sched_d1",
  "sched_d2",
  "sched_e",
  "sched_fringe",
  "sched_g",
  "sched_summaryh",
  "sched_h",
  "sched_i",
  "sched_j",
  "sched_k",
  "suppl_a1",
  "suppl_a2",
  "suppl_a3",
  "suppl_a4",
];

const getColorStyles = (colorType, isActive) => {
  if (isActive) {
    return "bg-white text-gray-900 font-semibold shadow-sm border-b-2 border-emerald-700";
  }

  switch (colorType) {
    case "green":
      return "bg-[#d1fadf] text-gray-900 hover:bg-[#bbf7d0]";
    case "cyan":
      return "bg-[#cff4fc] text-gray-900 hover:bg-[#a5f3fc]";
    case "blue":
      return "bg-[#93c5fd] text-gray-900 hover:bg-[#60a5fa]";
    case "purple":
      return "bg-[#d8b4fe] text-gray-900 hover:bg-[#c084fc]";
    default:
      return "bg-[#262626] text-gray-200 hover:bg-[#333333]";
  }
};

export default function ExcelTabNavigation() {
  const [activeTab, setActiveTab] = useState("ice_setup");
  const [exporting, setExporting] = useState(false);
  const [loadingSetup, setLoadingSetup] = useState(false);
  const [setupData, setSetupData] = useState(null);

  const [savingNotes, setSavingNotes] = useState(false);
  const [explanatoryNote, setExplanatoryNote] = useState("");
  const [noteId, setNoteId] = useState(0);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState();
  const [selectedEndDate, setSelectedEndDate] = useState("");

  const yearsList = useMemo(() => {
    const years = [];
    for (let y = currentYear - 5; y <= currentYear + 5; y++) {
      years.push(y);
    }
    return years;
  }, [currentYear]);

  const activeTabRef = useRef(null);

  const fetchSetupData = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/IceReportSetUp`);
      if (res.ok) {
        const data = await res.json();
        // If response is an array, take the first record; otherwise, use as object
        setSetupData(Array.isArray(data) ? data[0] : data);
        const setup = Array.isArray(data) ? data[0] : data;
        if (setup?.fiscalYearEndDate) {
          const year = setup.fiscalYearEndDate.split("-")[0];
          setSelectedYear(year);
        }
      }
    } catch (err) {
      console.error("Error fetching ICE Report setup:", err);
    }
  };

  // Fetch setup configuration from API
  useEffect(() => {
    fetchSetupData();
  }, [selectedYear]);

  console.log(selectedEndDate);

  // Compute visible tabs dynamically based on setupData
  // Compute visible tabs dynamically based on setupData
  const visibleTabs = useMemo(() => {
    if (!setupData) return MASTER_TABS;

    const numC = setupData.numberOfIndirectLaborPools ?? 1;
    const numD = setupData.numberOfIntermediatePools ?? 0;
    const pools = Array.isArray(setupData.pools) ? setupData.pools : [];

    // Sort pools by displayOrder to ensure accurate index matching
    const primaryIndirectPools = pools
      .filter((p) => p.poolType === "PRIMARY_INDIRECT")
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    const intermediatePools = pools
      .filter((p) => p.poolType === "INTERMEDIATE")
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    const fringePool = pools.find((p) => p.poolType === "FRINGE");

    return MASTER_TABS.filter((tab) => {
      if (tab.id === "sched_fringe" || tab.group === "FRINGE") {
        return fringePool ? fringePool.isUsed : false;
      }
      // 1. Filter Schedule C tabs
      // if (tab.group === "C") {
      //   // First check: Must be within numberOfIndirectLaborPools count
      //   const isWithinCount = tab.index <= Math.min(numC, 5);
      //   if (!isWithinCount) return false;

      //   // Second check: Must have isUsed === true in the corresponding pool
      //   // Note: primaryIndirectPools[0] is G&A, primaryIndirectPools[1] is C1, primaryIndirectPools[2] is C2, etc.
      //   const pool = primaryIndirectPools[tab.index];
      //   return pool ? pool.isUsed : false;
      // }
      // 1. Filter Schedule C tabs
      // Schedule C Tabs
      if (tab.group === "C") {
        // 1. Sched C (1) - Specific pool check
        if (tab.id === "sched_c1" || tab.index === 1) {
          const pool = primaryIndirectPools[1];
          return pool ? pool.isUsed : false;
        }

        // 2. Sched C (2) - Specific pool check
        if (tab.id === "sched_c2" || tab.index === 2) {
          const pool = primaryIndirectPools[2];
          return pool ? pool.isUsed : false;
        }

        // 3. Sched C (6) - Specific pool check (Subk/Material)
        if (tab.id === "sched_c6" || tab.index === 6) {
          const pool = primaryIndirectPools[3];
          return pool ? pool.isUsed : false;
        }

        // 4. All other C tabs (including C3, C4, C5): strictly based on numC count
        return tab.index <= Math.min(numC, 5);
      }

      if (tab.group === "D") {
        // Check: Must be within numberOfIntermediatePools count (max 6)
        return tab.index <= Math.min(numD, 6);
      }
      // // 2. Filter Schedule D tabs
      // if (tab.group === "D") {
      //   // First check: Must be within numberOfIntermediatePools count
      //   const isWithinCount = tab.index <= Math.min(numD, 6);
      //   if (!isWithinCount) return false;

      //   // Second check: Must have isUsed === true
      //   const pool = intermediatePools[tab.index - 1];
      //   return pool ? pool.isUsed : false;
      // }

      return true;
    });
  }, [setupData]);

  const fiscalYearEndDate = setupData?.fiscalYearEndDate?.split("T")[0];

  const [year, month, day] = fiscalYearEndDate?.split("-") || [];

  const formattedFiscalYearEndDate = fiscalYearEndDate
    ? `${month}/${day}/${year}`
    : "";

  // Fetch schedule notes when active tab changes
  useEffect(() => {
    if (!activeTab || !ALLOWED_NOTE_TABS.includes(activeTab)) {
      setExplanatoryNote("");
      setNoteId(0);
      return;
    }

    const fetchNotes = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/IceScheduleNotes?scheduleName=${activeTab}&year=${selectedYear}`,
        );
        if (res.ok) {
          const data = await res.json();
          setExplanatoryNote(data?.notes || "");
          setNoteId(data?.id ?? 0);
        } else {
          setExplanatoryNote("");
          setNoteId(0);
        }
      } catch (err) {
        console.warn("Could not load notes:", err);
        setExplanatoryNote("");
        setNoteId(0);
      }
    };

    fetchNotes();
  }, [activeTab, selectedYear]);

  const handleSaveNotes = async () => {
    if (!activeTab) return;

    try {
      setSavingNotes(true);

      // 1. Save Explanatory Notes (Dynamic for any active schedule)
      const notesPayload = {
        id: noteId,
        scheduleName: activeTab,
        notes: explanatoryNote,
        year: selectedYear,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const notesResponse = await fetch(`${backendUrl}/api/IceScheduleNotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notesPayload),
      });

      if (!notesResponse.ok) {
        throw new Error(`Failed to save notes: ${notesResponse.status}`);
      }

      const resData = await notesResponse.json().catch(() => null);
      if (resData && resData.id) {
        setNoteId(resData.id);
      }

      // 2. Dynamically Save Schedule Data if endpoint and ref payload method exist
      const endpoint = `${backendUrl}/api/TrialBalance/AddScheduleMappingFromSchedule`;
      // const endpoint = SCHEDULE_ENDPOINTS[activeTab];
      const hasPayloadGetter =
        activeTabRef.current &&
        typeof activeTabRef.current.getPayload === "function";

      // if (endpoint && hasPayloadGetter) {
      //   const schedulePayload = activeTabRef.current.getPayload();

      //   // const scheduleResponse = await fetch(endpoint, {
      //   //   method: "POST",
      //   //   headers: { "Content-Type": "application/json" },
      //   //   body: JSON.stringify(schedulePayload),
      //   // });
      //   const scheduleResponse = await fetch(
      //     `${endpoint}/${activeTab}?add=${schedulePayload[0].isAdd}`,
      //     {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify(schedulePayload),
      //     },
      //   );

      //   if (!scheduleResponse.ok) {
      //     throw new Error(
      //       `Failed to save ${activeTab} data: ${scheduleResponse.status}`,
      //     );
      //   }
      // }

      if (endpoint && hasPayloadGetter) {
        const schedulePayload = activeTabRef.current.getPayload();

        // Only make the request if there are changes to save
        if (Array.isArray(schedulePayload) && schedulePayload.length > 0) {
          const scheduleResponse = await fetch(
            `${endpoint}/${activeTab}?add=${schedulePayload[0].isAdd}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(schedulePayload),
            },
          );

          if (!scheduleResponse.ok) {
            throw new Error(
              `Failed to save ${activeTab} data: ${scheduleResponse.status}`,
            );
          }
        }
      }

      toast.success(
        `Data and notes for ${activeTab.toUpperCase()} saved successfully!`,
      );
    } catch (err) {
      console.error(`Error saving data for ${activeTab}:`, err);
      alert(`Error saving: ${err.message}`);
    } finally {
      setSavingNotes(false);
    }
  };

  // const handleSaveNotes = async () => {
  //   if (!activeTab) return;

  //   try {
  //     setSavingNotes(true);
  //     const payload = {
  //       id: noteId,
  //       scheduleName: activeTab,
  //       notes: explanatoryNote,
  //       year: selectedYear,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     };

  //     const response = await fetch(`${backendUrl}/api/IceScheduleNotes`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to save notes: ${response.status}`);
  //     }

  //     const resData = await response.json().catch(() => null);
  //     if (resData && resData.id) {
  //       setNoteId(resData.id);
  //     }

  //     toast.success(`Notes for ${activeTab} saved successfully!`);
  //   } catch (err) {
  //     console.error("Error saving notes:", err);
  //     alert(`Error saving notes: ${err.message}`);
  //   } finally {
  //     setSavingNotes(false);
  //   }
  // };

  const companyName =
    import.meta.env?.VITE_COMPANY_NAME || "Revolve FinTech LLC";
  const companyAddress =
    import.meta.env?.VITE_COMPANY_ADDRESS || "Vienna, VA 22182";

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportSchedulesToExcel();
    } catch (error) {
      console.error("Schedule workbook export failed:", error);
      window.alert(error?.message || "Schedule workbook export failed.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">
      {/* Dynamic Tab Bar */}
      <div className="bg-[#1c1a17] px-4 py-2 flex items-center justify-between border-b border-gray-800 shadow-inner">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {visibleTabs.map((tab) => {
            // {MASTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const colorClasses = getColorStyles(tab.colorType, isActive);

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-1.5 text-xs font-medium rounded transition-all duration-150 whitespace-nowrap border-x border-gray-800/40 ${colorClasses}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {/* <button
            type="button"
            onClick={fetchSetupData}
            disabled={loadingSetup}
            title="Refresh Setup and Tabs"
            className="flex items-center gap-1.5 rounded border border-gray-600 bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-200 hover:bg-gray-700 hover:text-white disabled:opacity-60 transition-colors"
          >
            <RefreshCw
              size={14}
              className={loadingSetup ? "animate-spin" : ""}
            />
            <span>Refresh</span>
          </button> */}
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="ml-1 flex shrink-0 items-center gap-2 rounded border border-emerald-600 bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"
          >
            <Download size={14} />
            {exporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>

      {/* Content View */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-end items-center gap-3 mb-3">
          {/* <div className="flex items-center gap-2">
            <label
              htmlFor="year-filter"
              className="text-xs font-medium text-gray-700"
            >
              Year:
            </label>
            <select
              id="year-filter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {yearsList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div> */}

          {/* {ALLOWED_NOTE_TABS.includes(activeTab) && ( */}
          <button
            type="button"
            onClick={handleSaveNotes}
            disabled={savingNotes}
            className="flex items-center gap-2 rounded border border-emerald-600 bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 transition-colors disabled:opacity-50"
          >
            <span>Save</span>
          </button>
          {/* )} */}
        </div>

        {activeTab ? (
          <TabContentRenderer
            activeTab={activeTab}
            onNavigate={setActiveTab}
            companyName={companyName}
            explanatoryNote={explanatoryNote}
            setExplanatoryNote={setExplanatoryNote}
            companyAddress={companyAddress}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            setupData={setupData}
            onSaveSuccess={fetchSetupData}
            fiscalYearEnd={formattedFiscalYearEndDate}
            activeTabRef={activeTabRef}
            masterTabs={MASTER_TABS}
          />
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500 font-medium text-sm">
            <p>Select Tab to View</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TabContentRenderer({
  activeTab,
  onNavigate,
  companyName,
  companyAddress,
  explanatoryNote,
  setExplanatoryNote,
  selectedYear,
  setSelectedYear,
  setupData,
  onSaveSuccess,
  fiscalYearEnd,
  activeTabRef,
  masterTabs,
}) {
  const commonProps = {
    onNavigate,
    companyName,
    companyAddress,
    explanatoryNote,
    setExplanatoryNote,
    selectedYear,
    setSelectedYear,
    year: selectedYear,
    setupData,
    onSaveSuccess,
    fiscalYearEnd: fiscalYearEnd,
    ref: activeTabRef,
    masterTabs,
  };

  switch (activeTab) {
    case "ice_setup":
      return <IceSetup {...commonProps} />;
    case "sched_a":
      return <ScheduleA {...commonProps} />;
    case "sched_b":
      return <SchedB {...commonProps} />;
    case "sched_c1":
      return <SchedC1 {...commonProps} />;
    case "sched_c2":
      return <SchedC2 {...commonProps} />;
    case "sched_c3":
      return <SchedC2 {...commonProps} />;
    case "sched_c4":
      return <SchedC2 {...commonProps} />;
    case "sched_c5":
      return <SchedC2 {...commonProps} />;
    case "sched_c6":
      return <SchedC6 {...commonProps} />;
    case "sched_d1":
      return <SchedD1 {...commonProps} />;
    case "sched_d2":
      return <SchedD2 {...commonProps} />;
    case "sched_d3":
      return <SchedD3 {...commonProps} />;
    case "sched_d4":
      return <SchedD4 {...commonProps} />;
    case "sched_d5":
      return <SchedD5 {...commonProps} />;
    case "sched_d6":
      return <SchedD6 {...commonProps} />;
    case "sched_e":
      return <SchedE {...commonProps} />;
    case "sched_fringe":
      return <Fringe {...commonProps} />;
    case "sched_g":
      return <SchedG {...commonProps} />;
    case "sched_g1":
      return <SchedG1 {...commonProps} />;
    case "sched_summaryh":
      return <SchedSummaryH {...commonProps} />;
    case "sched_h":
      return <SchedH {...commonProps} />;
    case "sched_hcont":
      return <SchedHCont {...commonProps} />;
    case "sched_i":
      return <SchedI {...commonProps} />;
    case "sched_j":
      return <SchedJ {...commonProps} />;
    case "sched_k":
      return <SchedK {...commonProps} />;
    case "sched_k_import":
      return <SchedKImport {...commonProps} />;
    case "sched_l":
      return <SchedL {...commonProps} />;
    case "sched_m":
      return <SchedM {...commonProps} />;
    case "sched_n":
      return <SchedN {...commonProps} />;
    case "sched_o":
      return <SchedO {...commonProps} />;
    case "suppl_a1":
      return <SupplA1 {...commonProps} />;
    case "suppl_a2":
      return <SupplA2 {...commonProps} />;
    case "suppl_a3":
      return <SupplA3 {...commonProps} />;
    case "suppl_a4":
      return <SupplA4 {...commonProps} />;
    case "suppl_b":
      return <SupplB {...commonProps} />;
    case "suppl_c":
      return <SupplC {...commonProps} />;
    case "suppl_o":
      return <SupplO {...commonProps} />;
    case "trial_balance":
      return <TrialBalance {...commonProps} />;
    case "job_cost_ledger":
      return <JobCostLedger {...commonProps} />;
    case "import_center":
      return <ImportTabs {...commonProps} />;
    case "file_manager":
      return <FileManager {...commonProps} />;
    case "orgacctpoool":
      return <OrgAccountPoolMapping {...commonProps} />;
    default:
      return null;
  }
}
