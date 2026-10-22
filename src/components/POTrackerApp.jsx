// // import React, { useState, useMemo, useRef, useEffect } from "react";
// // import { backendUrl } from "./config";

// // // --- Static Fallback Dataset (from your API responses) ---
// // const INITIAL_DATA = [
// //   //   {
// //   //     id: "5200-0160",
// //   //     name: "ENOVA FACILITIES MANAGEMENT SERVICES LLC",
// //   //     po: "10161",
// //   //     date: "2025-09-09",
// //   //     wf: "Completed",
// //   //     st: "Closed",
// //   //     vendor: "ENOVA FACILITIES MANAGEMENT SERVICES LLC",
// //   //     vcode: "v0000234",
// //   //     entity: "rfm3000",
// //   //     desc: "RFM_Consumables/spares for (July 2025)\r\nMark Up Amount 10%",
// //   //     prs: [
// //   //       {
// //   //         no: "9232",
// //   //         desc: "RFM_Consumables/spares for (July 2025)\r\nMark Up Amount 10%",
// //   //         value: 11350.59,
// //   //       },
// //   //     ],
// //   //     lines: [
// //   //       {
// //   //         item: "Mark Up Amount 10%",
// //   //         acct: "5200-0160",
// //   //         acctDesc: "Electro Mechanical",
// //   //         qty: 1,
// //   //         up: 1031.87,
// //   //         cost: 1031.87,
// //   //         inv: 1031.87,
// //   //         paid: 1031.87,
// //   //       },
// //   //       {
// //   //         item: "RFM_Consumables/spares for (July 2025)",
// //   //         acct: "5200-0160",
// //   //         acctDesc: "Electro Mechanical",
// //   //         qty: 1,
// //   //         up: 10318.72,
// //   //         cost: 10318.72,
// //   //         inv: 10318.72,
// //   //         paid: 10318.72,
// //   //       },
// //   //     ],
// //   //     grns: [{ no: "24318", date: "11/09/2025" }],
// //   //     invs: [{ no: "AE01_INV_00012914", date: "08/10/2025" }],
// //   //   },
// //   //   {
// //   //     id: "5200-0330",
// //   //     name: "TARGET DESIGN DECOR CONT.",
// //   //     po: "10163",
// //   //     date: "2025-09-09",
// //   //     wf: "Completed",
// //   //     st: "Closed",
// //   //     vendor: "TARGET DESIGN DECOR CONT.",
// //   //     vcode: "v0000535",
// //   //     entity: "rfm3000",
// //   //     desc: "RFM/L2/20 Giordano - Hoarding rates with full graphics Height 4m",
// //   //     prs: [
// //   //       {
// //   //         no: "9238",
// //   //         desc: "RFM/L2/20 Giordano - Hoarding rates with full graphics Height 4m",
// //   //         value: 5671.0,
// //   //       },
// //   //     ],
// //   //     lines: [
// //   //       {
// //   //         item: "RFM/L2/20 Giordano - Hoarding rates with full graphics Height 4m",
// //   //         acct: "5200-0330",
// //   //         acctDesc: "Hoarding Cost",
// //   //         qty: 10.7,
// //   //         up: 530.0,
// //   //         cost: 5671.0,
// //   //         inv: 5671.0,
// //   //         paid: 5671.0,
// //   //       },
// //   //     ],
// //   //     grns: [{ no: "24597", date: "29/09/2025" }],
// //   //     invs: [{ no: "22192", date: "17/10/2025" }],
// //   //   },
// // ];

// // // Helper to sanitize date strings from API (handles "DD/MM/YYYY" and "YYYY-MM-DD")
// // const parseCleanDate = (raw) => {
// //   if (!raw) return "N/A";
// //   const trimmed = String(raw).trim();
// //   if (trimmed.includes("/")) {
// //     const [d, m, y] = trimmed.split("/");
// //     return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
// //   }
// //   return trimmed;
// // };

// // export default function PRToPOTrackerLight() {
// //   const [poList, setPoList] = useState(INITIAL_DATA);
// //   const [activePO, setActivePO] = useState("");
// //   const [currentRecord, setCurrentRecord] = useState(INITIAL_DATA[0]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [tlView, setTlView] = useState("lanes");

// //   // Dropdown UI States
// //   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
// //   const [filterQuery, setFilterQuery] = useState("");
// //   const dropdownRef = useRef(null);

// //   // --- API 1: Fetch List of POs for Dropdown on Mount ---
// //   useEffect(() => {
// //     async function fetchDashboardList() {
// //       try {
// //         const res = await fetch(
// //           `${backendUrl}/api/PrPoDashboard/GetDashboardV1`,
// //         );
// //         if (res.ok) {
// //           const data = await res.json();
// //           if (Array.isArray(data) && data.length > 0) {
// //             // Map list format into clean project option items
// //             const cleaned = data.map((item) => ({
// //               ...item,
// //               id: item.lines[0]?.acct || `PO-${item.po}`,
// //               name: item.vendor || item.desc || "Purchase Order",
// //               entity: (item.entity || "").trim(),
// //               desc: item.prs[0]?.desc || item.desc || "",
// //             }));
// //             setPoList(cleaned);
// //           }
// //         }
// //       } catch (err) {
// //         console.warn("Using fallback static data. API fetch error:", err);
// //       }
// //     }
// //     fetchDashboardList();
// //   }, []);

// //   // --- API 2: Fetch Specific PO Details on Selection ---
// //   useEffect(() => {
// //     async function fetchPoDetail() {
// //       if (!activePO) return;
// //       setIsLoading(true);
// //       try {
// //         const res = await fetch(
// //           `${backendUrl}/api/PrPoDashboard/po/${activePO}`,
// //         );
// //         if (res.ok) {
// //           const data = await res.json();
// //           setCurrentRecord({
// //             ...data,
// //             id: data.id || data.lines[0]?.acct || `PO-${data.po}`,
// //             name: data.name || data.vendor,
// //             entity: (data.entity || "").trim(),
// //             grns: (data.grns || []).map((g) => ({
// //               ...g,
// //               date: parseCleanDate(g.date),
// //             })),
// //             invs: (data.invs || []).map((i) => ({
// //               ...i,
// //               date: parseCleanDate(i.date),
// //             })),
// //           });
// //         } else {
// //           // Fallback to local item if detail API fails
// //           const match = poList.find((p) => p.po === activePO);
// //           if (match) setCurrentRecord(match);
// //         }
// //       } catch (err) {
// //         console.warn("Failed fetching PO detail, using local match:", err);
// //         const match = poList.find((p) => p.po === activePO);
// //         if (match) setCurrentRecord(match);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     }
// //     fetchPoDetail();
// //   }, [activePO, poList]);

// //   // Click Outside Listener for Dropdown
// //   useEffect(() => {
// //     function handleClickOutside(event) {
// //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// //         setIsDropdownOpen(false);
// //       }
// //     }
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   // Filter projects/POs inside the dropdown
// //   const filteredProjects = useMemo(() => {
// //     if (!filterQuery.trim()) return poList;
// //     const q = filterQuery.toLowerCase().trim();
// //     return poList.filter(
// //       (item) =>
// //         item.po.toLowerCase().includes(q) ||
// //         (item.id && item.id.toLowerCase().includes(q)) ||
// //         (item.vendor && item.vendor.toLowerCase().includes(q)) ||
// //         (item.desc && item.desc.toLowerCase().includes(q)),
// //     );
// //   }, [filterQuery, poList]);

// //   // Financial Metrics Calculations
// //   const stats = useMemo(() => {
// //     if (!currentRecord) return null;
// //     const poTotal = (currentRecord.lines || []).reduce(
// //       (s, l) => s + (l.cost || 0),
// //       0,
// //     );
// //     const invTotal = (currentRecord.lines || []).reduce(
// //       (s, l) => s + (l.inv || 0),
// //       0,
// //     );
// //     const paidTotal = (currentRecord.lines || []).reduce(
// //       (s, l) => s + (l.paid || 0),
// //       0,
// //     );
// //     const prTotal = (currentRecord.prs || []).reduce(
// //       (s, p) => s + (p.value || 0),
// //       0,
// //     );

// //     const invPercent = poTotal > 0 ? Math.round((invTotal / poTotal) * 100) : 0;
// //     const paidPoPercent =
// //       poTotal > 0 ? Math.round((paidTotal / poTotal) * 100) : 0;
// //     const paidInvPercent =
// //       invTotal > 0 ? Math.round((paidTotal / invTotal) * 100) : 0;

// //     return {
// //       poTotal,
// //       invTotal,
// //       paidTotal,
// //       prTotal,
// //       invPercent,
// //       paidPoPercent,
// //       paidInvPercent,
// //     };
// //   }, [currentRecord]);

// //   return (
// //     <div className="min-h-screen text-slate-800 font-sans p-2">
// //       <div className="w-full mx-auto space-y-6">
// //         {/* Header Bar with Search & Select Dropdown */}
// //         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
// //           <div className="flex items-baseline gap-2">
// //             <h1 className="text-xl font-bold text-slate-900 tracking-tight">
// //               PR → PO Tracker
// //             </h1>
// //             <span className="text-xs text-slate-400 font-medium">
// //               Reef Mall · {currentRecord?.entity || ""}
// //             </span>
// //           </div>

// //           {/* Search & Select Custom Dropdown */}
// //           <div className="relative w-full md:w-80" ref={dropdownRef}>
// //             <label className="block text-[11px] font-bold text-slate-700 mb-1">
// //               Search & Select PO
// //             </label>

// //             {/* Trigger Button */}
// //             <div
// //               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
// //               className="bg-slate-100/90 text-xs border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-700 cursor-pointer flex justify-between items-center select-none shadow-xs hover:bg-slate-100 transition-colors"
// //             >
// //               <span className="truncate">
// //                 {currentRecord ? (
// //                   <span>
// //                     <strong className="text-slate-900">
// //                       PO #{currentRecord.po}
// //                     </strong>{" "}
// //                     - {currentRecord.vendor}
// //                   </span>
// //                 ) : (
// //                   "Select a Project..."
// //                 )}
// //               </span>
// //               <span className="text-slate-400 text-[10px] ml-2">▼</span>
// //             </div>

// //             {/* Dropdown Menu Overlay */}
// //             {isDropdownOpen && (
// //               <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 shadow-xl rounded-xl z-50 p-2 space-y-2">
// //                 <input
// //                   type="text"
// //                   placeholder="Type ID or Name to Filter..."
// //                   value={filterQuery}
// //                   onChange={(e) => setFilterQuery(e.target.value)}
// //                   onClick={(e) => e.stopPropagation()}
// //                   className="w-full text-xs border border-blue-500 rounded-lg p-2 outline-none ring-2 ring-blue-100 bg-slate-50 font-medium text-slate-800 placeholder:text-slate-400"
// //                   autoFocus
// //                 />

// //                 <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 flex flex-col gap-0.5">
// //                   {filteredProjects.length > 0 ? (
// //                     filteredProjects.map((p) => (
// //                       <div
// //                         key={p.po}
// //                         onClick={() => {
// //                           setActivePO(p.po);
// //                           setIsDropdownOpen(false);
// //                           setFilterQuery("");
// //                         }}
// //                         className={`text-xs p-2.5 rounded-lg cursor-pointer transition-colors ${
// //                           activePO === p.po
// //                             ? "bg-blue-50/80 text-blue-900 font-semibold"
// //                             : "text-slate-700 hover:bg-slate-50"
// //                         }`}
// //                       >
// //                         <div className="text-slate-900">
// //                           <span className="font-bold">PO #{p.po}</span> -{" "}
// //                           {p.vendor}
// //                         </div>
// //                         <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
// //                           PR #{p.prs[0]?.no} ·{" "}
// //                           {p.prs[0]?.desc?.replace(/\r?\n|\r/g, " ")}
// //                         </div>
// //                       </div>
// //                     ))
// //                   ) : (
// //                     <div className="text-[11px] text-slate-400 p-3 italic text-center">
// //                       No matching project found
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {isLoading ? (
// //           <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
// //             <p className="text-xs text-slate-500 font-semibold animate-pulse">
// //               Loading Purchase Order #{activePO}...
// //             </p>
// //           </div>
// //         ) : currentRecord && stats ? (
// //           <div className="space-y-6">
// //             {/* PO Info Header Card */}
// //             <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
// //               <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
// //                 <div>
// //                   <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
// //                     Purchase Order Details
// //                   </div>
// //                   <h2 className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight mt-0.5">
// //                     <span className="text-slate-400 font-normal text-xl mr-1">
// //                       PO
// //                     </span>
// //                     {currentRecord.po}
// //                   </h2>
// //                   <div className="flex items-center gap-2 mt-2">
// //                     {(currentRecord.prs || []).map((p) => (
// //                       <span
// //                         key={p.no}
// //                         className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold px-2.5 py-0.5 rounded-md"
// //                       >
// //                         PR {p.no} · AED {(p.value || 0).toLocaleString()}
// //                       </span>
// //                     ))}
// //                   </div>
// //                   <p className="text-xs text-slate-600 mt-3 font-medium max-w-2xl leading-relaxed whitespace-pre-line">
// //                     {currentRecord.desc || currentRecord.prs[0]?.desc}
// //                   </p>
// //                 </div>

// //                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs grid grid-cols-2 gap-y-2 gap-x-4 min-w-[280px]">
// //                   <span className="text-slate-400 font-medium">Vendor</span>
// //                   <span className="font-semibold text-slate-800 text-right truncate">
// //                     {currentRecord.vendor}{" "}
// //                     <span className="font-mono text-slate-400">
// //                       ({currentRecord.vcode})
// //                     </span>
// //                   </span>

// //                   <span className="text-slate-400 font-medium">Status</span>
// //                   <div className="text-right flex justify-end gap-1">
// //                     <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
// //                       ● {currentRecord.st}
// //                     </span>
// //                     <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
// //                       ● {currentRecord.wf}
// //                     </span>
// //                   </div>

// //                   <span className="text-slate-400 font-medium">Created</span>
// //                   <span className="font-mono text-slate-700 text-right">
// //                     {currentRecord.date}
// //                   </span>

// //                   <span className="text-slate-400 font-medium">Account</span>
// //                   <span className="font-mono text-slate-700 text-right">
// //                     {currentRecord.lines[0]?.acct} ·{" "}
// //                     {currentRecord.lines[0]?.acctDesc}
// //                   </span>

// //                   <span className="text-slate-400 font-medium">Entity</span>
// //                   <span className="font-mono text-slate-700 text-right">
// //                     {currentRecord.entity}
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* 5-Stage Lifecycle Stepper Cards */}
// //             <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
// //               <div className="bg-white p-4 rounded-2xl border-t-4 border-t-emerald-500 border-x border-b border-slate-200/80 shadow-sm">
// //                 <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
// //                   <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">
// //                     ✓
// //                   </span>
// //                   <span>PR raised</span>
// //                 </div>
// //                 <div className="text-lg font-bold text-slate-900 font-mono mt-3">
// //                   AED{" "}
// //                   {stats.prTotal.toLocaleString("en-US", {
// //                     minimumFractionDigits: 2,
// //                   })}
// //                 </div>
// //                 <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
// //                   PR {currentRecord.prs[0]?.no}
// //                 </div>
// //               </div>

// //               <div className="bg-white p-4 rounded-2xl border-t-4 border-t-blue-500 border-x border-b border-slate-200/80 shadow-sm">
// //                 <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold">
// //                   <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">
// //                     ✓
// //                   </span>
// //                   <span>PO approved</span>
// //                 </div>
// //                 <div className="text-lg font-bold text-slate-900 font-mono mt-3">
// //                   AED{" "}
// //                   {stats.poTotal.toLocaleString("en-US", {
// //                     minimumFractionDigits: 2,
// //                   })}
// //                 </div>
// //                 <div className="text-[11px] text-slate-400 mt-0.5">
// //                   {currentRecord.wf} · {currentRecord.date}
// //                 </div>
// //               </div>

// //               <div className="bg-white p-4 rounded-2xl border-t-4 border-t-teal-500 border-x border-b border-slate-200/80 shadow-sm">
// //                 <div className="flex items-center gap-1.5 text-teal-600 text-xs font-bold">
// //                   <span className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center text-[10px]">
// //                     ✓
// //                   </span>
// //                   <span>Goods / service received</span>
// //                 </div>
// //                 <div className="text-lg font-bold text-slate-900 font-mono mt-3">
// //                   {(currentRecord.grns || []).length} GRNs
// //                 </div>
// //                 <div className="text-[11px] text-slate-400 mt-0.5">
// //                   Last on{" "}
// //                   {currentRecord.grns?.[currentRecord.grns.length - 1]?.date ||
// //                     "N/A"}
// //                 </div>
// //               </div>

// //               <div className="bg-white p-4 rounded-2xl border-t-4 border-t-amber-500 border-x border-b border-slate-200/80 shadow-sm">
// //                 <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold">
// //                   <span className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center text-[10px]">
// //                     4
// //                   </span>
// //                   <span>Invoiced</span>
// //                 </div>
// //                 <div className="text-lg font-bold text-slate-900 font-mono mt-3">
// //                   AED{" "}
// //                   {stats.invTotal.toLocaleString("en-US", {
// //                     minimumFractionDigits: 2,
// //                   })}
// //                 </div>
// //                 <div className="text-[11px] text-slate-400 mt-0.5">
// //                   {(currentRecord.invs || []).length} invoices ·{" "}
// //                   {stats.invPercent}% of PO
// //                 </div>
// //               </div>

// //               <div className="bg-white p-4 rounded-2xl border-t-4 border-t-emerald-600 border-x border-b border-slate-200/80 shadow-sm">
// //                 <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
// //                   <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">
// //                     5
// //                   </span>
// //                   <span>Paid</span>
// //                 </div>
// //                 <div className="text-lg font-bold text-slate-900 font-mono mt-3">
// //                   AED{" "}
// //                   {stats.paidTotal.toLocaleString("en-US", {
// //                     minimumFractionDigits: 2,
// //                   })}
// //                 </div>
// //                 <div className="text-[11px] text-slate-400 mt-0.5">
// //                   {stats.paidPoPercent}% of PO · {stats.paidInvPercent}% of
// //                   billed
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Financial Funnel & Cycle KPIs */}
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //               <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h3 className="text-sm font-bold text-slate-900">
// //                     Where the money is
// //                   </h3>
// //                   <span className="text-[11px] text-slate-400 font-medium">
// //                     AED, transaction currency
// //                   </span>
// //                 </div>
// //                 <div className="space-y-3.5 text-xs">
// //                   {[
// //                     {
// //                       label: "PR value",
// //                       val: stats.prTotal,
// //                       color: "bg-emerald-500",
// //                     },
// //                     {
// //                       label: "PO value",
// //                       val: stats.poTotal,
// //                       color: "bg-blue-500",
// //                     },
// //                     {
// //                       label: "Invoiced",
// //                       val: stats.invTotal,
// //                       color: "bg-amber-500",
// //                     },
// //                     {
// //                       label: "Paid",
// //                       val: stats.paidTotal,
// //                       color: "bg-emerald-600",
// //                     },
// //                   ].map((row, i) => (
// //                     <div key={i} className="flex items-center gap-3">
// //                       <span className="w-20 font-medium text-slate-600">
// //                         {row.label}
// //                       </span>
// //                       <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
// //                         <div
// //                           className={`h-full ${row.color} rounded-full transition-all duration-500`}
// //                           style={{
// //                             width: `${stats.prTotal > 0 ? (row.val / stats.prTotal) * 100 : 0}%`,
// //                           }}
// //                         />
// //                       </div>
// //                       <span className="w-20 text-right font-mono font-bold text-slate-900">
// //                         {Math.round(row.val).toLocaleString()}
// //                       </span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h3 className="text-sm font-bold text-slate-900">
// //                     Cycle time
// //                   </h3>
// //                   <span className="text-[11px] text-slate-400 font-medium">
// //                     days
// //                   </span>
// //                 </div>
// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div className="border-l-2 border-emerald-500 pl-3 py-1">
// //                     <div className="text-2xl font-bold font-mono text-slate-900">
// //                       36
// //                       <small className="text-xs font-normal text-slate-400 ml-0.5">
// //                         d
// //                       </small>
// //                     </div>
// //                     <div className="text-[11px] text-slate-500 font-medium mt-0.5">
// //                       PO created → first GRN
// //                     </div>
// //                   </div>
// //                   <div className="border-l-2 border-blue-500 pl-3 py-1">
// //                     <div className="text-2xl font-bold font-mono text-slate-900">
// //                       37
// //                       <small className="text-xs font-normal text-slate-400 ml-0.5">
// //                         d
// //                       </small>
// //                     </div>
// //                     <div className="text-[11px] text-slate-500 font-medium mt-0.5">
// //                       PO created → first invoice
// //                     </div>
// //                   </div>
// //                   <div className="border-l-2 border-amber-500 pl-3 py-1">
// //                     <div className="text-2xl font-bold font-mono text-slate-900">
// //                       10
// //                       <small className="text-xs font-normal text-slate-400 ml-0.5">
// //                         d
// //                       </small>
// //                     </div>
// //                     <div className="text-[11px] text-slate-500 font-medium mt-0.5">
// //                       Avg GRN → invoice upload
// //                     </div>
// //                   </div>
// //                   <div className="border-l-2 border-slate-300 pl-3 py-1">
// //                     <div className="text-2xl font-bold font-mono text-slate-900">
// //                       26
// //                       <small className="text-xs font-normal text-slate-400 ml-0.5">
// //                         d
// //                       </small>
// //                     </div>
// //                     <div className="text-[11px] text-slate-500 font-medium mt-0.5">
// //                       Since last activity
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Visual Timeline Swimlane */}
// //             <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
// //               <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
// //                 <h3 className="text-sm font-bold text-slate-900">Timeline</h3>

// //                 <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
// //                   {["lanes", "feed", "month", "pairs"].map((v) => (
// //                     <button
// //                       key={v}
// //                       onClick={() => setTlView(v)}
// //                       className={`px-3 py-1 rounded-lg transition-all ${
// //                         tlView === v
// //                           ? "bg-white shadow-xs text-slate-900"
// //                           : "text-slate-500 hover:text-slate-800"
// //                       }`}
// //                     >
// //                       {v === "lanes"
// //                         ? "Swimlane"
// //                         : v === "feed"
// //                           ? "Activity feed"
// //                           : v === "month"
// //                             ? "Month by month"
// //                             : "Receipt → invoice"}
// //                     </button>
// //                   ))}
// //                 </div>

// //                 <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
// //                   <span className="flex items-center gap-1">
// //                     <i className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block"></i>{" "}
// //                     PO
// //                   </span>
// //                   <span className="flex items-center gap-1">
// //                     <i className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block"></i>{" "}
// //                     GRN
// //                   </span>
// //                   <span className="flex items-center gap-1">
// //                     <i className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></i>{" "}
// //                     Invoice
// //                   </span>
// //                 </div>
// //               </div>

// //               <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 overflow-x-auto">
// //                 <svg
// //                   viewBox="0 0 900 120"
// //                   className="w-full min-w-[600px] text-xs"
// //                 >
// //                   {["Sep 25", "Oct 25", "Nov 25", "Dec 25"].map((m, idx) => {
// //                     const x = 200 + idx * 200;
// //                     return (
// //                       <g key={idx}>
// //                         <line
// //                           x1={x}
// //                           y1="10"
// //                           x2={x}
// //                           y2="90"
// //                           stroke="#e2e8f0"
// //                           strokeDasharray="2 4"
// //                         />
// //                         <text
// //                           x={x}
// //                           y="110"
// //                           textAnchor="middle"
// //                           fill="#94a3b8"
// //                           className="text-[10px] font-mono"
// //                         >
// //                           {m}
// //                         </text>
// //                       </g>
// //                     );
// //                   })}

// //                   <text
// //                     x="20"
// //                     y="30"
// //                     fill="#475569"
// //                     className="font-semibold text-[11px]"
// //                   >
// //                     PO
// //                   </text>
// //                   <rect
// //                     x="130"
// //                     y="22"
// //                     width="12"
// //                     height="12"
// //                     rx="2"
// //                     fill="#3b82f6"
// //                   />

// //                   <text
// //                     x="20"
// //                     y="60"
// //                     fill="#475569"
// //                     className="font-semibold text-[11px]"
// //                   >
// //                     GRN
// //                   </text>
// //                   {(currentRecord.grns || []).map((_, i) => (
// //                     <circle
// //                       key={i}
// //                       cx={220 + i * 70}
// //                       cy="56"
// //                       r="5"
// //                       fill="#14b8a6"
// //                     />
// //                   ))}

// //                   <text
// //                     x="20"
// //                     y="90"
// //                     fill="#475569"
// //                     className="font-semibold text-[11px]"
// //                   >
// //                     Invoice
// //                   </text>
// //                   {(currentRecord.invs || []).map((_, i) => (
// //                     <circle
// //                       key={i}
// //                       cx={230 + i * 70}
// //                       cy="86"
// //                       r="5"
// //                       fill="#f59e0b"
// //                     />
// //                   ))}
// //                 </svg>
// //               </div>
// //             </div>

// //             {/* Line Items Table */}
// //             <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
// //               <div className="p-5 border-b border-slate-100 flex justify-between items-center">
// //                 <h3 className="text-sm font-bold text-slate-900">Line items</h3>
// //                 <span className="text-xs text-slate-400 font-medium">
// //                   {(currentRecord.lines || []).length} lines
// //                 </span>
// //               </div>
// //               <div className="overflow-x-auto">
// //                 <table className="w-full text-left border-collapse text-xs">
// //                   <thead>
// //                     <tr className="bg-slate-50/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 text-[10px]">
// //                       <th className="p-4">Item</th>
// //                       <th className="p-4 text-right">Qty</th>
// //                       <th className="p-4 text-right">Unit Price</th>
// //                       <th className="p-4 text-right">Line Value</th>
// //                       <th className="p-4 text-right">Invoiced</th>
// //                       <th className="p-4 text-right">Paid</th>
// //                       <th className="p-4 text-right">Billed</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody className="divide-y divide-slate-100 text-slate-700">
// //                     {(currentRecord.lines || []).map((line, idx) => {
// //                       const billedPct =
// //                         line.cost > 0
// //                           ? Math.round((line.inv / line.cost) * 100)
// //                           : 0;
// //                       return (
// //                         <tr
// //                           key={idx}
// //                           className="hover:bg-slate-50/50 transition-colors"
// //                         >
// //                           <td className="p-4 font-medium text-slate-900">
// //                             {line.item}
// //                             <div className="text-[11px] text-slate-400 font-mono mt-0.5">
// //                               {line.acct} · {line.acctDesc}
// //                             </div>
// //                           </td>
// //                           <td className="p-4 text-right font-mono">
// //                             {(line.qty || 0).toLocaleString()}
// //                           </td>
// //                           <td className="p-4 text-right font-mono">
// //                             {(line.up || 0).toFixed(2)}
// //                           </td>
// //                           <td className="p-4 text-right font-mono font-bold text-slate-900">
// //                             {Math.round(line.cost || 0).toLocaleString()}
// //                           </td>
// //                           <td className="p-4 text-right font-mono">
// //                             {Math.round(line.inv || 0).toLocaleString()}
// //                           </td>
// //                           <td className="p-4 text-right font-mono">
// //                             {Math.round(line.paid || 0).toLocaleString()}
// //                           </td>
// //                           <td className="p-4 text-right">
// //                             <div className="flex items-center justify-end gap-2">
// //                               <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
// //                                 <div
// //                                   className="bg-emerald-500 h-full rounded-full"
// //                                   style={{ width: `${billedPct}%` }}
// //                                 />
// //                               </div>
// //                               <span className="font-mono text-[11px] font-bold text-slate-800">
// //                                 {billedPct}%
// //                               </span>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       );
// //                     })}
// //                   </tbody>
// //                   <tfoot>
// //                     <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
// //                       <td colSpan="3" className="p-4">
// //                         Total
// //                       </td>
// //                       <td className="p-4 text-right font-mono">
// //                         {Math.round(stats.poTotal).toLocaleString()}
// //                       </td>
// //                       <td className="p-4 text-right font-mono">
// //                         {Math.round(stats.invTotal).toLocaleString()}
// //                       </td>
// //                       <td className="p-4 text-right font-mono">
// //                         {Math.round(stats.paidTotal).toLocaleString()}
// //                       </td>
// //                       <td></td>
// //                     </tr>
// //                   </tfoot>
// //                 </table>
// //               </div>
// //             </div>

// //             {/* Goods Receipts & Invoices */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h3 className="text-sm font-bold text-slate-900">
// //                     Goods receipts
// //                   </h3>
// //                   <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
// //                     {(currentRecord.grns || []).length}
// //                   </span>
// //                 </div>
// //                 <div className="space-y-2 text-xs">
// //                   {(currentRecord.grns || []).map((grn) => (
// //                     <div
// //                       key={grn.no}
// //                       className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50/80 border border-slate-100"
// //                     >
// //                       <span className="font-mono font-bold text-slate-800">
// //                         GRN #{grn.no}
// //                       </span>
// //                       <span className="font-mono text-slate-400">
// //                         {grn.date}
// //                       </span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h3 className="text-sm font-bold text-slate-900">
// //                     Vendor invoices
// //                   </h3>
// //                   <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
// //                     {(currentRecord.invs || []).length}
// //                   </span>
// //                 </div>
// //                 <div className="space-y-2 text-xs">
// //                   {(currentRecord.invs || []).map((inv) => (
// //                     <div
// //                       key={inv.no}
// //                       className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50/80 border border-slate-100"
// //                     >
// //                       <span className="font-mono font-bold text-slate-800">
// //                         {inv.no}
// //                       </span>
// //                       <span className="font-mono text-slate-400">
// //                         Uploaded {inv.date}
// //                       </span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         ) : null}
// //       </div>
// //     </div>
// //   );
// // }

// import React, {
//   useState,
//   useMemo,
//   useEffect,
//   useCallback,
//   useRef,
// } from "react";
// import { backendUrl } from "./config";

// // ============================================================================
// // 1. ENTERPRISE VECTOR ICON SYSTEM
// // ============================================================================
// const Icons = {
//   Dashboard: ({ className = "w-4 h-4" }) => (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <rect x="3" y="3" width="7" height="9" rx="1.5" />
//       <rect x="14" y="3" width="7" height="5" rx="1.5" />
//       <rect x="14" y="12" width="7" height="9" rx="1.5" />
//       <rect x="3" y="16" width="7" height="5" rx="1.5" />
//     </svg>
//   ),
//   TableRegister: ({ className = "w-4 h-4" }) => (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <path d="M3 6h18" />
//       <path d="M3 12h18" />
//       <path d="M3 18h18" />
//       <rect x="3" y="3" width="18" height="18" rx="2" />
//     </svg>
//   ),
//   Inspector: ({ className = "w-4 h-4" }) => (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//       <polyline points="14 2 14 8 20 8" />
//       <line x1="16" y1="13" x2="8" y2="13" />
//       <line x1="16" y1="17" x2="8" y2="17" />
//     </svg>
//   ),
//   ArrowUpRight: ({ className = "w-4 h-4" }) => (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <path d="M7 17L17 7" />
//       <path d="M7 7h10v10" />
//     </svg>
//   ),
//   ArrowLeft: ({ className = "w-4 h-4" }) => (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <path d="M19 12H5" />
//       <path d="M12 19l-7-7 7-7" />
//     </svg>
//   ),
//   ChevronDown: ({ className = "w-4 h-4" }) => (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <path d="M6 9l6 6 6-6" />
//     </svg>
//   ),
//   ChevronRight: ({ className = "w-4 h-4" }) => (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <path d="M9 18l6-6-6-6" />
//     </svg>
//   ),
//   Search: ({ className = "w-4 h-4" }) => (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <circle cx="11" cy="11" r="8" />
//       <path d="M21 21l-4.35-4.35" />
//     </svg>
//   ),
//   Check: ({ className = "w-3.5 h-3.5" }) => (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <polyline points="20 6 9 17 4 12" />
//     </svg>
//   ),
//   Refresh: ({ className = "w-4 h-4" }) => (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
//       <path d="M3 3v5h5" />
//       <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
//       <path d="M16 16h5v5" />
//     </svg>
//   ),
//   Cube3D: ({ className = "w-4 h-4" }) => (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.75"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
//       <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
//       <line x1="12" y1="22.08" x2="12" y2="12" />
//     </svg>
//   ),
// };

// // ============================================================================
// // 2. ROBUST DATE NORMALIZATION & BUSINESS METRIC FORMULAS
// // ============================================================================
// const MONTH_NAMES = [
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

// const parseCleanDate = (raw) => {
//   if (!raw) return null;
//   const trimmed = String(raw).trim();
//   if (!trimmed || trimmed.toLowerCase() === "nan") return null;

//   const isoMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
//   if (isoMatch) {
//     const [, y, m, d] = isoMatch;
//     return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
//   }

//   const dmyMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
//   if (dmyMatch) {
//     const [, p1, p2, y] = dmyMatch;
//     const n2 = parseInt(p2, 10);
//     const d = n2 > 12 ? p2 : p1;
//     const m = n2 > 12 ? p1 : p2;
//     return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
//   }

//   const myMatch = trimmed.match(/^(\d{1,2})[-/](\d{4})$/);
//   if (myMatch) {
//     const [, m, y] = myMatch;
//     return `${y}-${m.padStart(2, "0")}-01`;
//   }

//   const ymMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})$/);
//   if (ymMatch) {
//     const [, y, m] = ymMatch;
//     return `${y}-${m.padStart(2, "0")}-01`;
//   }

//   const parsed = new Date(trimmed);
//   if (!Number.isNaN(parsed.getTime())) {
//     return parsed.toISOString().slice(0, 10);
//   }
//   return null;
// };

// const toTimestamp = (cleanDate) => {
//   if (!cleanDate || cleanDate === "N/A") return null;
//   const [y, m, d] = cleanDate.split("-").map(Number);
//   if (!y || !m || !d) return null;
//   return Date.UTC(y, m - 1, d);
// };

// const formatDisplayDate = (cleanDate) => {
//   if (!cleanDate || cleanDate === "N/A") return "N/A";
//   const parts = cleanDate.split("-");
//   if (parts.length !== 3) return cleanDate;
//   const [y, m, d] = parts;
//   const mIdx = parseInt(m, 10) - 1;
//   if (Number.isNaN(mIdx) || mIdx < 0 || mIdx > 11) return cleanDate;
//   return `${d} ${MONTH_NAMES[mIdx]} ${y}`;
// };

// const formatShortMonthYear = (year, monthZeroIndexed) =>
//   `${MONTH_NAMES[monthZeroIndexed]} '${String(year).slice(-2)}`;

// const daysBetween = (startRaw, endRaw) => {
//   const c1 = parseCleanDate(startRaw);
//   const c2 = parseCleanDate(endRaw);
//   const t1 = toTimestamp(c1);
//   const t2 = toTimestamp(c2);
//   if (t1 === null || t2 === null) return null;
//   return Math.round((t2 - t1) / 86400000);
// };

// const formatAED = (val) =>
//   `AED ${Number(val || 0).toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;

// const formatCompact = (val) => {
//   const n = Number(val || 0);
//   if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
//   if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
//   return n.toFixed(0);
// };

// const enrichRecord = (item) => {
//   if (!item || typeof item !== "object") return null;
//   // FIX: ignore null / non-object entries so a single bad row can't throw
//   const onlyObjects = (arr) =>
//     (Array.isArray(arr) ? arr : []).filter((x) => x && typeof x === "object");
//   const lines = onlyObjects(item.lines);
//   const prs = onlyObjects(item.prs);

//   const grns = onlyObjects(item.grns)
//     .map((g) => {
//       const cleanDate = parseCleanDate(g.date);
//       return {
//         ...g,
//         no: String(g.no ?? "").trim(),
//         cleanDate,
//         ts: toTimestamp(cleanDate) ?? Number.MAX_SAFE_INTEGER,
//       };
//     })
//     .sort((a, b) => a.ts - b.ts || a.no.localeCompare(b.no));

//   const invs = onlyObjects(item.invs)
//     .map((i) => {
//       const cleanDate = parseCleanDate(i.date);
//       return {
//         ...i,
//         no: String(i.no ?? "").trim(),
//         cleanDate,
//         ts: toTimestamp(cleanDate) ?? Number.MAX_SAFE_INTEGER,
//       };
//     })
//     .sort((a, b) => a.ts - b.ts || a.no.localeCompare(b.no));

//   const prTotal = prs.reduce((sum, p) => sum + (Number(p.value) || 0), 0);
//   const poTotal = lines.reduce((sum, l) => sum + (Number(l.cost) || 0), 0);
//   const invTotal = lines.reduce((sum, l) => sum + (Number(l.inv) || 0), 0);
//   const paidTotal = lines.reduce((sum, l) => sum + (Number(l.paid) || 0), 0);
//   const remainingUnbilled = Math.max(0, poTotal - invTotal);
//   const remainingUnpaid = Math.max(0, invTotal - paidTotal);

//   const cleanPoDate = parseCleanDate(item.date);
//   const firstGrnDate = grns[0]?.cleanDate || null;
//   const firstInvDate = invs[0]?.cleanDate || null;

//   const allValidDates = [
//     cleanPoDate,
//     ...grns.map((g) => g.cleanDate),
//     ...invs.map((i) => i.cleanDate),
//   ]
//     .filter(Boolean)
//     .sort();

//   const lastActivityDate =
//     allValidDates.length > 0
//       ? allValidDates[allValidDates.length - 1]
//       : cleanPoDate;

//   const todayIso = new Date().toISOString().slice(0, 10);
//   const daysSinceLastActivity = lastActivityDate
//     ? Math.max(0, daysBetween(lastActivityDate, todayIso) ?? 0)
//     : null;

//   let pairDiffSum = 0;
//   let pairDiffCount = 0;
//   const pairLen = Math.min(grns.length, invs.length);
//   for (let idx = 0; idx < pairLen; idx += 1) {
//     const d = daysBetween(grns[idx].cleanDate, invs[idx].cleanDate);
//     if (d !== null) {
//       pairDiffSum += d;
//       pairDiffCount += 1;
//     }
//   }

//   return {
//     ...item,
//     po: String(item.po ?? ""),
//     date: cleanPoDate || "N/A",
//     poTs: toTimestamp(cleanPoDate),
//     vendor: (item.vendor || "Unassigned Vendor").trim(),
//     vcode: (item.vcode || "").trim(),
//     entity: (item.entity || "").trim(),
//     wf: (item.wf || "Pending").trim(),
//     st: (item.st || "Open").trim(),
//     desc: prs[0]?.desc || item.desc || "",
//     primaryAcct: lines[0]?.acct || "N/A",
//     primaryAcctDesc: lines[0]?.acctDesc || "General",
//     lines,
//     prs,
//     grns,
//     invs,
//     prTotal,
//     poTotal,
//     invTotal,
//     paidTotal,
//     remainingUnbilled,
//     remainingUnpaid,
//     invPct: poTotal > 0 ? Math.round((invTotal / poTotal) * 100) : 0,
//     paidPct: poTotal > 0 ? Math.round((paidTotal / poTotal) * 100) : 0,
//     paidOfInvPct: invTotal > 0 ? Math.round((paidTotal / invTotal) * 100) : 0,
//     poToGrnDays:
//       firstGrnDate && cleanPoDate
//         ? daysBetween(cleanPoDate, firstGrnDate)
//         : null,
//     poToInvDays:
//       firstInvDate && cleanPoDate
//         ? daysBetween(cleanPoDate, firstInvDate)
//         : null,
//     grnToInvDays:
//       pairDiffCount > 0
//         ? Math.round(pairDiffSum / pairDiffCount)
//         : firstGrnDate && firstInvDate
//         ? daysBetween(firstGrnDate, firstInvDate)
//         : null,
//     lastActivityDate,
//     daysSinceLastActivity,
//   };
// };

// // ============================================================================
// // 3. SEARCHABLE MULTI-SELECT & SINGLE-SELECT DROPDOWNS
// // ============================================================================
// function SearchableMultiSelect({
//   label,
//   placeholder = "All Selected",
//   options = [],
//   selectedValues = [],
//   onChange,
//   accent = "indigo",
// }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const containerRef = useRef(null);

//   useEffect(() => {
//     function handleOutsideClick(e) {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, []);

//   const filteredOptions = useMemo(() => {
//     const q = query.toLowerCase().trim();
//     if (!q) return options;
//     return options.filter(
//       (o) =>
//         o.label.toLowerCase().includes(q) ||
//         String(o.value).toLowerCase().includes(q) ||
//         (o.subLabel && o.subLabel.toLowerCase().includes(q))
//     );
//   }, [options, query]);

//   const toggleOption = (val) => {
//     if (selectedValues.includes(val)) {
//       onChange(selectedValues.filter((v) => v !== val));
//     } else {
//       onChange([...selectedValues, val]);
//     }
//   };

//   const selectAllFiltered = () => {
//     const merged = Array.from(
//       new Set([...selectedValues, ...filteredOptions.map((o) => o.value)])
//     );
//     onChange(merged);
//   };

//   const clearAll = () => {
//     onChange([]);
//     setQuery("");
//   };

//   const accentBadgeMap = {
//     indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
//     sky: "bg-sky-50 text-sky-700 border-sky-200/80",
//     teal: "bg-teal-50 text-teal-700 border-teal-200/80",
//     amber: "bg-amber-50 text-amber-700 border-amber-200/80",
//   };

//   return (
//     <div className="relative" ref={containerRef}>
//       {label && (
//         <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
//           {label}
//         </label>
//       )}
//       <button
//         type="button"
//         onClick={() => setIsOpen((prev) => !prev)}
//         className={`w-full flex items-center justify-between gap-2 text-xs rounded-xl px-3 py-2 border transition-all text-left ${
//           selectedValues.length > 0
//             ? "bg-indigo-50/40 border-indigo-200 text-slate-900 font-semibold"
//             : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100/60"
//         }`}
//       >
//         <div className="flex items-center gap-1.5 truncate">
//           {selectedValues.length === 0 ? (
//             <span className="text-slate-500 truncate">{placeholder}</span>
//           ) : selectedValues.length === 1 ? (
//             <span className="truncate">
//               {options.find((o) => o.value === selectedValues[0])?.label ||
//                 selectedValues[0]}
//             </span>
//           ) : (
//             <span className="truncate">{selectedValues.length} selected</span>
//           )}
//         </div>

//         <div className="flex items-center gap-1 shrink-0">
//           {selectedValues.length > 0 && (
//             <span
//               className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md border ${
//                 accentBadgeMap[accent] || accentBadgeMap.indigo
//               }`}
//             >
//               {selectedValues.length}
//             </span>
//           )}
//           <Icons.ChevronDown
//             className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
//               isOpen ? "rotate-180" : ""
//             }`}
//           />
//         </div>
//       </button>

//       {isOpen && (
//         <div className="absolute left-0 right-0 sm:w-72 mt-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-2.5 space-y-2">
//           <div className="relative">
//             <Icons.Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder={`Search ${label || "options"}...`}
//               autoFocus
//               className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-1.5 outline-none focus:border-indigo-500 focus:bg-white"
//             />
//           </div>

//           <div className="flex items-center justify-between px-1 text-[11px]">
//             <button
//               type="button"
//               onClick={selectAllFiltered}
//               className="text-indigo-600 hover:text-indigo-800 font-semibold"
//             >
//               Select All ({filteredOptions.length})
//             </button>
//             {selectedValues.length > 0 && (
//               <button
//                 type="button"
//                 onClick={clearAll}
//                 className="text-rose-600 hover:text-rose-700 font-semibold"
//               >
//                 Clear ({selectedValues.length})
//               </button>
//             )}
//           </div>

//           <div className="max-h-56 overflow-y-auto divide-y divide-slate-100/70 pr-0.5">
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((opt) => {
//                 const isChecked = selectedValues.includes(opt.value);
//                 return (
//                   <div
//                     key={opt.value}
//                     onClick={() => toggleOption(opt.value)}
//                     className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer transition-colors text-xs ${
//                       isChecked
//                         ? "bg-indigo-50/70 text-indigo-950 font-semibold"
//                         : "hover:bg-slate-50 text-slate-700"
//                     }`}
//                   >
//                     <div
//                       className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
//                         isChecked
//                           ? "bg-indigo-600 border-indigo-600 text-white"
//                           : "bg-white border-slate-300"
//                       }`}
//                     >
//                       {isChecked && <Icons.Check className="w-3 h-3" />}
//                     </div>
//                     <div className="truncate flex-1">
//                       <div className="truncate">{opt.label}</div>
//                       {opt.subLabel && (
//                         <div className="text-[10px] font-mono text-slate-400 truncate">
//                           {opt.subLabel}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="py-6 text-center text-[11px] text-slate-400">
//                 No matching options found
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function SearchablePOPicker({ poList, activePO, onSelectPO }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const pickerRef = useRef(null);

//   useEffect(() => {
//     function handleOutside(e) {
//       if (pickerRef.current && !pickerRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleOutside);
//     return () => document.removeEventListener("mousedown", handleOutside);
//   }, []);

//   const filtered = useMemo(() => {
//     const q = query.toLowerCase().trim();
//     if (!q) return poList.slice(0, 100);
//     return poList
//       .filter(
//         (p) =>
//           p.po.toLowerCase().includes(q) ||
//           p.vendor.toLowerCase().includes(q) ||
//           (p.prs[0]?.no && String(p.prs[0].no).toLowerCase().includes(q)) ||
//           p.primaryAcct.toLowerCase().includes(q)
//       )
//       .slice(0, 100);
//   }, [poList, query]);

//   const activeObj = poList.find((p) => p.po === activePO);

//   return (
//     <div className="relative" ref={pickerRef}>
//       <button
//         type="button"
//         onClick={() => setIsOpen((prev) => !prev)}
//         className="flex items-center justify-between gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl px-3.5 py-2 shadow-2xs transition-colors min-w-[200px]"
//       >
//         <span className="truncate">
//           {activeObj
//             ? `PO #${activeObj.po} · ${activeObj.vendor.slice(0, 16)}`
//             : "Search & Inspect PO..."}
//         </span>
//         <Icons.ChevronDown className="w-3.5 h-3.5 text-indigo-200 shrink-0" />
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2.5 space-y-2">
//           <div className="relative">
//             <Icons.Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Type PO #, PR #, Vendor, or GL..."
//               autoFocus
//               className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-1.5 outline-none focus:border-indigo-500 focus:bg-white text-slate-800"
//             />
//           </div>

//           <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
//             {filtered.length > 0 ? (
//               filtered.map((p) => (
//                 <div
//                   key={p.po}
//                   onClick={() => {
//                     onSelectPO(p.po);
//                     setIsOpen(false);
//                     setQuery("");
//                   }}
//                   className={`p-2 rounded-xl cursor-pointer transition-colors text-xs ${
//                     activePO === p.po
//                       ? "bg-indigo-50 text-indigo-950 font-semibold"
//                       : "hover:bg-slate-50 text-slate-700"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="font-mono font-bold text-indigo-700">
//                       PO #{p.po}
//                     </span>
//                     <span className="font-mono text-[10px] text-slate-400">
//                       {p.date}
//                     </span>
//                   </div>
//                   <div className="text-slate-800 truncate mt-0.5">
//                     {p.vendor}
//                   </div>
//                   <div className="text-[10px] font-mono text-slate-400 truncate">
//                     PR #{p.prs[0]?.no || "—"} · {p.primaryAcctDesc}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="py-5 text-center text-xs text-slate-400">
//                 No matching PO found
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ============================================================================
// // 4. SMOOTH ANIMATED METRIC COUNTER
// // ============================================================================
// function AnimatedMetricValue({
//   value,
//   formatter = formatAED,
//   duration = 380,
// }) {
//   const [displayValue, setDisplayValue] = useState(value);
//   const previousRef = useRef(value);

//   useEffect(() => {
//     const startValue = Number(previousRef.current) || 0;
//     const endValue = Number(value) || 0;
//     if (Math.abs(endValue - startValue) < 0.01) {
//       setDisplayValue(endValue);
//       return;
//     }

//     let rafId;
//     const startTime = performance.now();

//     const step = (now) => {
//       const progress = Math.min(1, (now - startTime) / duration);
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setDisplayValue(startValue + (endValue - startValue) * eased);
//       if (progress < 1) {
//         rafId = requestAnimationFrame(step);
//       } else {
//         setDisplayValue(endValue);
//         previousRef.current = endValue;
//       }
//     };

//     rafId = requestAnimationFrame(step);
//     return () => cancelAnimationFrame(rafId);
//   }, [value, duration]);

//   return <span>{formatter(displayValue)}</span>;
// }

// // ============================================================================
// // 5. EXACT 4-TAB TIMELINE ENGINE (FIXED FOR SAME-DATE & DENSE MULTI-RECORDS)
// // ============================================================================

// // FIX: Error boundary so any render-time exception inside the timeline can no
// // longer take the whole section down silently. It resets whenever the PO changes.
// class TimelineErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, message: "" };
//   }

//   static getDerivedStateFromError(error) {
//     return {
//       hasError: true,
//       message: (error && error.message) || "Unknown timeline error",
//     };
//   }

//   componentDidUpdate(prevProps) {
//     if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
//       this.setState({ hasError: false, message: "" });
//     }
//   }

//   componentDidCatch(error) {
//     // eslint-disable-next-line no-console
//     console.error("Timeline render failed:", error);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-200 text-center space-y-2">
//           <div className="text-xs font-bold text-rose-700">
//             The timeline could not be rendered for this PO.
//           </div>
//           <div className="text-[11px] font-mono text-rose-600/80">
//             {this.state.message}
//           </div>
//           <button
//             type="button"
//             onClick={() => this.setState({ hasError: false, message: "" })}
//             className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
//           >
//             Retry
//           </button>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// const DocumentTimelineSection = React.memo(function DocumentTimelineSection({
//   record,
// }) {
//   const [tlView, setTlView] = useState("lanes"); // "lanes" | "feed" | "month" | "pairs"
//   const [hoveredNode, setHoveredNode] = useState(null);

//   const timelineData = useMemo(() => {
//     if (!record) return null;

//     const rawEvents = [];

//     if (record.date && record.date !== "N/A" && record.poTs !== null) {
//       const prNos = (record.prs || [])
//         .map((p) => p.no)
//         .filter((n) => n && String(n).toLowerCase() !== "nan");
//       rawEvents.push({
//         id: `po-${record.po}`,
//         type: "po",
//         laneIndex: 0,
//         title: `PO ${record.po} created`,
//         shortLabel: `PO ${record.po}`,
//         docNo: record.po,
//         date: record.date,
//         ts: record.poTs,
//         sub: `${formatAED(record.poTotal)}${
//           prNos.length > 0 ? ` · PR ${prNos.join(", ")}` : ""
//         } · ${record.wf}`,
//         color: "#4f46e5",
//         dotClass: "bg-indigo-600",
//         pillClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
//       });
//     }

//     (record.grns || []).forEach((g, idx) => {
//       if (!g.cleanDate || g.ts === Number.MAX_SAFE_INTEGER) return;
//       const diffFromPo =
//         record.date !== "N/A" ? daysBetween(record.date, g.cleanDate) : null;
//       const relPoText =
//         diffFromPo === null
//           ? ""
//           : diffFromPo > 0
//           ? `${diffFromPo}d after PO`
//           : diffFromPo < 0
//           ? `${Math.abs(diffFromPo)}d before PO`
//           : "same day as PO";

//       rawEvents.push({
//         id: `grn-${g.no}-${idx}`,
//         type: "grn",
//         laneIndex: 1,
//         grnIndex: idx,
//         title: `GRN ${g.no}`,
//         shortLabel: `GRN ${g.no}`,
//         docNo: String(g.no || ""),
//         date: g.cleanDate,
//         ts: g.ts,
//         diffFromPo,
//         sub: `Goods receipt #${idx + 1} of ${record.grns.length}${
//           relPoText ? ` · ${relPoText}` : ""
//         }`,
//         color: "#0d9488",
//         dotClass: "bg-teal-600",
//         pillClass: "bg-teal-50 text-teal-700 border-teal-200",
//       });
//     });

//     (record.invs || []).forEach((inv, idx) => {
//       if (!inv.cleanDate || inv.ts === Number.MAX_SAFE_INTEGER) return;
//       const diffFromPo =
//         record.date !== "N/A" ? daysBetween(record.date, inv.cleanDate) : null;
//       const pairedGrn = record.grns?.[idx] || null;
//       const diffFromGrn =
//         pairedGrn?.cleanDate
//           ? daysBetween(pairedGrn.cleanDate, inv.cleanDate)
//           : null;

//       const relParts = [`Invoice #${idx + 1} of ${record.invs.length}`];
//       if (diffFromPo !== null) {
//         relParts.push(
//           diffFromPo >= 0
//             ? `${diffFromPo}d after PO`
//             : `${Math.abs(diffFromPo)}d before PO`
//         );
//       }
//       if (pairedGrn && diffFromGrn !== null) {
//         relParts.push(
//           diffFromGrn >= 0
//             ? `${diffFromGrn}d after GRN ${pairedGrn.no}`
//             : `${Math.abs(diffFromGrn)}d before GRN ${pairedGrn.no}`
//         );
//       }

//       rawEvents.push({
//         id: `inv-${inv.no}-${idx}`,
//         type: "inv",
//         laneIndex: 2,
//         invIndex: idx,
//         title: `Invoice ${inv.no}`,
//         shortLabel: String(inv.no || ""),
//         docNo: String(inv.no || ""),
//         date: inv.cleanDate,
//         ts: inv.ts,
//         diffFromPo,
//         diffFromGrn,
//         sub: relParts.join(" · "),
//         color: "#d97706",
//         dotClass: "bg-amber-500",
//         pillClass: "bg-amber-50 text-amber-800 border-amber-200",
//       });
//     });

//     // Strict Chronological Sort by Timestamp across all document types
//     const typePriority = { po: 1, grn: 2, inv: 3 };
//     const events = [...rawEvents].sort((a, b) => {
//       if (a.ts !== b.ts) return a.ts - b.ts;
//       return (typePriority[a.type] || 9) - (typePriority[b.type] || 9);
//     });

//     const todayIso = new Date().toISOString().slice(0, 10);
//     const todayTs = toTimestamp(todayIso);

//     const allTs = events.map((e) => e.ts);
//     const minEventTs = allTs.length > 0 ? Math.min(...allTs) : todayTs;
//     const maxEventTs = allTs.length > 0 ? Math.max(...allTs) : todayTs;

//     const minDateObj = new Date(minEventTs);
//     const maxDateObj = new Date(maxEventTs);

//     const startMonthDate = new Date(
//       Date.UTC(minDateObj.getUTCFullYear(), minDateObj.getUTCMonth(), 1)
//     );
//     const endMonthDate = new Date(
//       Date.UTC(maxDateObj.getUTCFullYear(), maxDateObj.getUTCMonth() + 1, 0)
//     );

//     // When all events occur in a single day or narrow window, pad domain so nodes sit cleanly inside the track
//     const rawSpanMs = endMonthDate.getTime() - startMonthDate.getTime();
//     const domainStartMs = startMonthDate.getTime();
//     const domainEndMs = Math.max(
//       endMonthDate.getTime(),
//       domainStartMs + 28 * 86400000
//     );
//     const domainSpanMs = Math.max(28 * 86400000, rawSpanMs);

//     // FIX: always returns a finite number so SVG coordinates can never become NaN
//     const xOfTs = (ts) => {
//       if (!Number.isFinite(ts)) return 145;
//       if (maxEventTs === minEventTs && events.length > 0 && ts === minEventTs) {
//         return 480; // Center perfectly if every single event in the PO shares the exact same timestamp
//       }
//       const ratio = Math.max(
//         0,
//         Math.min(1, (ts - domainStartMs) / domainSpanMs)
//       );
//       const x = 145 + ratio * 695;
//       return Number.isFinite(x) ? x : 145;
//     };

//     const months = [];
//     const cursor = new Date(
//       Date.UTC(startMonthDate.getUTCFullYear(), startMonthDate.getUTCMonth(), 1)
//     );
//     let safety = 0;
//     while (cursor.getTime() <= endMonthDate.getTime() && safety < 60) {
//       const y = cursor.getUTCFullYear();
//       const m = cursor.getUTCMonth();
//       const ymKey = `${y}-${String(m + 1).padStart(2, "0")}`;
//       const mEvents = events.filter((ev) => ev.date.startsWith(ymKey));
//       const tickX =
//         maxEventTs === minEventTs
//           ? 145 + (safety / Math.max(1, 1)) * 695
//           : 145 +
//             Math.max(
//               0,
//               Math.min(1, (cursor.getTime() - domainStartMs) / domainSpanMs)
//             ) *
//               695;

//       months.push({
//         key: ymKey,
//         label: formatShortMonthYear(y, m),
//         fullLabel: `${MONTH_NAMES[m]} ${y}`,
//         events: mEvents,
//         tickX: Number.isFinite(tickX) ? tickX : 145,
//       });

//       cursor.setUTCMonth(cursor.getUTCMonth() + 1);
//       safety += 1;
//     }

//     // Proximity-Aware Lane Clustering: merges same-date OR ultra-close (< 18px) events in the same lane
//     // so circles and text never collide on dense bursts of GRNs/Invoices.
//     const buildLaneClusters = (laneType) => {
//       const laneEvents = events.filter((e) => e.type === laneType);
//       const rawByDate = new Map();
//       laneEvents.forEach((ev) => {
//         if (!rawByDate.has(ev.date)) {
//           rawByDate.set(ev.date, []);
//         }
//         rawByDate.get(ev.date).push(ev);
//       });

//       const dateGroups = Array.from(rawByDate.entries())
//         .map(([date, list]) => ({
//           date,
//           endDate: date,
//           ts: list[0].ts,
//           x: xOfTs(list[0].ts),
//           items: list,
//         }))
//         .sort((a, b) => a.x - b.x);

//       // Merge adjacent date groups that are closer than 18px on the SVG axis
//       // const mergedClusters = [];
//       // dateGroups.forEach((grp) => {
//       //   const prev = mergedClusters[mergedClusters.length - 1];
//       //   if (prev && Math.abs(grp.x - prev.x) < 18) {
//       //     prev.items = [...prev.items, ...grp.items];
//       //     prev.endDate = grp.date;
//       //     prev.x = (prev.x + grp.x) / 2;
//       //   } else {
//       //     mergedClusters.push({ ...grp });
//       //   }
//       // });

//       // Merge nearby date groups safely.
//       // Keep the cluster coordinate weighted by the number of events,
//       // instead of repeatedly averaging two coordinates.
//       const mergedClusters = [];

//       dateGroups.forEach((grp) => {
//         const prev = mergedClusters[mergedClusters.length - 1];

//         if (prev && Math.abs(grp.x - prev.x) < 24) {
//           const previousCount = prev.items.length;
//           const incomingCount = grp.items.length;
//           const totalCount = previousCount + incomingCount;

//           prev.x =
//             (prev.x * previousCount + grp.x * incomingCount) /
//             totalCount;

//           prev.items.push(...grp.items);
//           prev.endDate =
//             grp.date > prev.endDate ? grp.date : prev.endDate;
//           prev.ts = Math.min(prev.ts, grp.ts);
//         } else {
//           mergedClusters.push({
//             ...grp,
//             items: [...grp.items],
//           });
//         }
//       });

//       // Format cluster metadata and assign 4-level stagger + horizontal anchor nudging
//       let lastX = -999;
//       let staggerStep = 0;

//       return mergedClusters.map((cl, idx) => {
//         const count = cl.items.length;
//         const firstDoc = String(cl.items[0]?.docNo || "");
//         const shortDoc =
//           firstDoc.length > 12 ? `${firstDoc.slice(0, 10)}…` : firstDoc;

//         if (cl.x - lastX < 88) {
//           staggerStep = (staggerStep + 1) % 4;
//         } else {
//           staggerStep = 0;
//         }
//         lastX = cl.x;

//         const dateRangeLabel =
//           cl.date === cl.endDate
//             ? formatDisplayDate(cl.date)
//             : `${formatDisplayDate(cl.date)} → ${formatDisplayDate(cl.endDate)}`;

//         return {
//           ...cl,
//           clusterId: `${laneType}-cl-${idx}-${cl.date}`,
//           count,
//           dateRangeLabel,
//           stagger: staggerStep,
//           primaryLabel:
//             count === 1 ? shortDoc : `${shortDoc} +${count - 1}`,
//         };
//       });
//     };

//     const poClusters = buildLaneClusters("po");
//     const grnClusters = buildLaneClusters("grn");
//     const invClusters = buildLaneClusters("inv");

//     // Helper to find the cluster X coordinate for a given timestamp
//     const findClusterX = (clusters, ts) => {
//       if (!ts || clusters.length === 0) return null;
//       const match = clusters.find((cl) =>
//         cl.items.some((item) => item.ts === ts)
//       );
//       return match ? match.x : xOfTs(ts);
//     };

//     // const maxPairs = Math.max(record.grns.length, record.invs.length);
//     // const pairs = [];
//     // for (let i = 0; i < maxPairs; i += 1) {
//     //   const g = record.grns[i] || null;
//     //   const inv = record.invs[i] || null;
//     const maxPairs = Math.max(record.grns.length, record.invs.length);
// const pairs = [];

// for (let i = 0; i < maxPairs; i += 1) {
//   const g = record.grns[i] || null;
//   const inv = record.invs[i] || null;
//       const lagDays =
//         g?.cleanDate && inv?.cleanDate
//           ? daysBetween(g.cleanDate, inv.cleanDate)
//           : null;
//       const poToGrn =
//         g?.cleanDate && record.date !== "N/A"
//           ? daysBetween(record.date, g.cleanDate)
//           : null;

//       const rawGrnX =
//         g?.ts && g.ts !== Number.MAX_SAFE_INTEGER ? xOfTs(g.ts) : null;
//       const rawInvX =
//         inv?.ts && inv.ts !== Number.MAX_SAFE_INTEGER ? xOfTs(inv.ts) : null;

//       pairs.push({
//         index: i + 1,
//         grn: g,
//         inv,
//         grnX: rawGrnX,
//         invX: rawInvX,
//         laneGrnX:
//           g?.ts && g.ts !== Number.MAX_SAFE_INTEGER
//             ? findClusterX(grnClusters, g.ts)
//             : null,
//         laneInvX:
//           inv?.ts && inv.ts !== Number.MAX_SAFE_INTEGER
//             ? findClusterX(invClusters, inv.ts)
//             : null,
//         lagDays,
//         poToGrn,
//       });
//     }

//     // Deduplicated Bezier links between GRN clusters and Invoice clusters
//     const uniqueBezierMap = new Map();
//     pairs.forEach((p) => {
//       if (p.laneGrnX !== null && p.laneInvX !== null) {
//         const key = `${Math.round(p.laneGrnX)}-${Math.round(p.laneInvX)}`;
//         if (!uniqueBezierMap.has(key)) {
//           uniqueBezierMap.set(key, {
//             key,
//             x1: p.laneGrnX,
//             x2: p.laneInvX,
//             count: 1,
//           });
//         } else {
//           uniqueBezierMap.get(key).count += 1;
//         }
//       }
//     });
//     const uniqueBeziers = Array.from(uniqueBezierMap.values());

//     const maxPairLag = Math.max(
//       ...pairs.map((p) => (p.lagDays !== null ? Math.abs(p.lagDays) : 0)),
//       1
//     );

//     return {
//       events,
//       months,
//       poClusters,
//       grnClusters,
//       invClusters,
//       pairs,
//       uniqueBeziers,
//       maxPairLag,
//       todayX:
//         todayTs >= domainStartMs && todayTs <= domainEndMs
//           ? xOfTs(todayTs)
//           : null,
//       totalDaysSpan: Math.max(
//         1,
//         Math.round((maxEventTs - minEventTs) / 86400000)
//       ),
//     };
//   }, [record]);

//   // Hook MUST be called unconditionally before early return to prevent React Hook violation crashes
//   const visibleTickMonths = useMemo(() => {
//     const months = timelineData?.months || [];
//     if (months.length <= 9) return months;
//     const step = Math.ceil(months.length / 8);
//     return months.filter(
//       (_, idx) => idx % step === 0 || idx === months.length - 1
//     );
//   }, [timelineData]);

//   if (!record || !timelineData) return null;

//   const {
//     events,
//     months,
//     poClusters,
//     grnClusters,
//     invClusters,
//     pairs,
//     uniqueBeziers,
//     maxPairLag,
//     todayX,
//     totalDaysSpan,
//   } = timelineData;

//   const quietMonthsCount = months.filter((m) => m.events.length === 0).length;

//   // Dynamic height for Receipt -> Invoice SVG Pair Canvas
//   const pairSvgHeight = Math.max(165, 76 + pairs.length * 46);

//   return (
//     <div className="bg-white p-5 rounded-2xl border border-indigo-100/90 shadow-2xs space-y-4">
//       {/* Header Bar */}
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
//         <div>
//           <div className="flex items-center gap-2">
//             <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
//             <h2 className="text-sm font-bold text-slate-900">Timeline</h2>
//             <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
//               {events.length} milestones · {totalDaysSpan}d span
//             </span>
//           </div>
//           <p className="text-[11px] text-slate-500 mt-0.5">
//             Chronologically interleaved across PO creation, goods receipts, and
//             vendor invoices
//           </p>
//         </div>

//         {/* 4 Segmented Sub-Tabs */}
//         <div
//           className="inline-flex flex-wrap bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 text-xs font-semibold"
//           role="group"
//           aria-label="Timeline view"
//         >
//           {[
//             { id: "lanes", label: "Swimlane" },
//             { id: "feed", label: "Activity feed" },
//             { id: "month", label: "Month by month" },
//             { id: "pairs", label: "Receipt → invoice" },
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               type="button"
//               onClick={() => setTlView(tab.id)}
//               aria-pressed={tlView === tab.id}
//               className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
//                 tlView === tab.id
//                   ? "bg-white text-indigo-700 shadow-2xs font-bold"
//                   : "text-slate-600 hover:text-slate-900"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-600 font-medium">
//           <span className="flex items-center gap-1.5">
//             <i className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block" />
//             <span>PO</span>
//           </span>
//           <span className="flex items-center gap-1.5">
//             <i className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
//             <span>GRN ({record.grns.length})</span>
//           </span>
//           <span className="flex items-center gap-1.5">
//             <i className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
//             <span>Invoice ({record.invs.length})</span>
//           </span>
//         </div>
//       </div>

//       {/* ====================================================================
//           SUB-TAB 1: SWIMLANE ("lanes")
//       ==================================================================== */}
//       {tlView === "lanes" && (
//         <div className="space-y-2.5">
//           <div className="bg-gradient-to-b from-slate-50/60 via-white to-indigo-50/20 p-4 rounded-xl border border-slate-200/80 overflow-x-auto">
//             <svg
//               viewBox="0 0 920 240"
//               className="w-full min-w-[700px] select-none"
//             >
//               {visibleTickMonths.map((m) => (
//                 <g key={m.key}>
//                   <line
//                     x1={m.tickX}
//                     y1="20"
//                     x2={m.tickX}
//                     y2="205"
//                     stroke="#e2e8f0"
//                     strokeDasharray="2 3"
//                   />
//                   <text
//                     x={m.tickX}
//                     y="224"
//                     textAnchor="middle"
//                     className="text-[10px] font-mono fill-slate-400"
//                   >
//                     {m.label}
//                   </text>
//                 </g>
//               ))}

//               {[
//                 { label: "PO", sub: "1 order", y: 46, color: "#4f46e5" },
//                 {
//                   label: "GRN",
//                   sub: `${record.grns.length} receipt${
//                     record.grns.length === 1 ? "" : "s"
//                   }`,
//                   y: 112,
//                   color: "#0d9488",
//                 },
//                 {
//                   label: "Invoice",
//                   sub: `${record.invs.length} billed`,
//                   y: 178,
//                   color: "#d97706",
//                 },
//               ].map((lane) => (
//                 <g key={lane.label}>
//                   <line
//                     x1="120"
//                     y1={lane.y}
//                     x2="880"
//                     y2={lane.y}
//                     stroke="#e2e8f0"
//                     strokeWidth="1.5"
//                   />
//                   <text
//                     x="14"
//                     y={lane.y - 2}
//                     fill={lane.color}
//                     className="text-[11px] font-bold"
//                   >
//                     {lane.label}
//                   </text>
//                   <text
//                     x="14"
//                     y={lane.y + 11}
//                     className="text-[9.5px] font-mono fill-slate-400"
//                   >
//                     {lane.sub}
//                   </text>
//                 </g>
//               ))}

//               {todayX !== null && (
//                 <g>
//                   <line
//                     x1={todayX}
//                     y1="18"
//                     x2={todayX}
//                     y2="205"
//                     stroke="#94a3b8"
//                     strokeWidth="1.2"
//                     strokeDasharray="4 3"
//                   />
//                   <text
//                     x={todayX}
//                     y="13"
//                     textAnchor="middle"
//                     className="text-[9px] font-mono fill-slate-400"
//                   >
//                     Today
//                   </text>
//                 </g>
//               )}

//               {/* PO -> First GRN Connector */}
//               {poClusters[0] && grnClusters[0] && (
//                 <path
//                   d={`M ${poClusters[0].x} 46 C ${poClusters[0].x} 79, ${grnClusters[0].x} 79, ${grnClusters[0].x} 112`}
//                   fill="none"
//                   stroke="#cbd5e1"
//                   strokeWidth="1.3"
//                   strokeDasharray="3 3"
//                 />
//               )}

//               {/* Deduplicated GRN Cluster -> Invoice Cluster Bezier Connectors */}
//               {uniqueBeziers.map((bz) => (
//                 <path
//                   key={`bezier-${bz.key}`}
//                   d={`M ${bz.x1} 112 C ${bz.x1} 145, ${bz.x2} 145, ${bz.x2} 178`}
//                   fill="none"
//                   stroke="#5eead4"
//                   strokeWidth={bz.count > 1 ? "2.4" : "1.6"}
//                   opacity={bz.count > 1 ? "0.9" : "0.75"}
//                 />
//               ))}

//               {/* PO Lane Nodes */}
//               {poClusters.map((cl) => (
//                 <g
//                   key={cl.clusterId}
//                   className="cursor-pointer"
//                   onMouseEnter={() =>
//                     setHoveredNode({
//                       badge: "PO",
//                       title: `PO #${record.po}`,
//                       date: cl.dateRangeLabel,
//                       info: formatAED(record.poTotal),
//                     })
//                   }
//                   onMouseLeave={() => setHoveredNode(null)}
//                 >
//                   <rect
//                     x={cl.x - 7}
//                     y={46 - 7}
//                     width="14"
//                     height="14"
//                     rx="3"
//                     fill="#4f46e5"
//                     stroke="#ffffff"
//                     strokeWidth="2"
//                   />
//                   <text
//                     x={Math.max(175, Math.min(835, cl.x))}
//                     y={30}
//                     textAnchor="middle"
//                     className="text-[10px] font-mono font-bold fill-indigo-900"
//                   >
//                     #{record.po} · {cl.dateRangeLabel}
//                   </text>
//                 </g>
//               ))}

//               {/* GRN Lane Clusters (4-Tier Staggering + Multi-Count Pill) */}
//               {grnClusters.map((cl) => {
//                 const offsets = [-17, 21, -29, 32];
//                 const dy = offsets[cl.stagger] || -17;
//                 const labelY = 112 + dy;
//                 const isFar = Math.abs(dy) > 22;
//                 const pillW = cl.count > 1 ? 22 : 14;

//                 return (
//                   <g
//                     key={cl.clusterId}
//                     className="cursor-pointer"
//                     onMouseEnter={() =>
//                       setHoveredNode({
//                         badge: `GRN (${cl.count})`,
//                         title:
//                           cl.count <= 4
//                             ? cl.items.map((i) => `GRN #${i.docNo}`).join(", ")
//                             : `${cl.items
//                                 .slice(0, 3)
//                                 .map((i) => `GRN #${i.docNo}`)
//                                 .join(", ")} +${cl.count - 3} more`,
//                         date: cl.dateRangeLabel,
//                         info:
//                           cl.count === 1
//                             ? cl.items[0]?.sub || ""
//                             : `${cl.count} goods receipts logged`,
//                       })
//                     }
//                     onMouseLeave={() => setHoveredNode(null)}
//                   >
//                     {isFar && grnClusters.length <= 18 && (
//                       <line
//                         x1={cl.x}
//                         y1={dy < 0 ? 104 : 120}
//                         x2={cl.x}
//                         y2={dy < 0 ? labelY + 3 : labelY - 8}
//                         stroke="#99f6e4"
//                         strokeWidth="1"
//                       />
//                     )}
//                     <rect
//                       x={cl.x - pillW / 2}
//                       y={112 - 7}
//                       width={pillW}
//                       height="14"
//                       rx="7"
//                       fill="#0d9488"
//                       stroke="#ffffff"
//                       strokeWidth="2"
//                     />
//                     {cl.count > 1 && (
//                       <text
//                         x={cl.x}
//                         y="115"
//                         textAnchor="middle"
//                         className="text-[8.5px] font-mono font-bold fill-white"
//                       >
//                         ×{cl.count}
//                       </text>
//                     )}
//                     {grnClusters.length <= 8 && (
//                       <text
//                         x={Math.max(150, Math.min(860, cl.x))}
//                         y={labelY}
//                         textAnchor="middle"
//                         className="text-[9.5px] font-mono font-semibold fill-teal-800"
//                       >
//                         {cl.primaryLabel}
//                       </text>
//                     )}
//                   </g>
//                 );
//               })}

//               {/* Invoice Lane Clusters (4-Tier Staggering + Multi-Count Pill) */}
//               {invClusters.map((cl) => {
//                 const offsets = [20, -16, 31, -28];
//                 const dy = offsets[cl.stagger] || 20;
//                 const labelY = 178 + dy;
//                 const isFar = Math.abs(dy) > 22;
//                 const pillW = cl.count > 1 ? 22 : 14;

//                 return (
//                   <g
//                     key={cl.clusterId}
//                     className="cursor-pointer"
//                     onMouseEnter={() =>
//                       setHoveredNode({
//                         badge: `INV (${cl.count})`,
//                         title:
//                           cl.count <= 4
//                             ? cl.items
//                                 .map((i) => `Invoice ${i.docNo}`)
//                                 .join(", ")
//                             : `${cl.items
//                                 .slice(0, 3)
//                                 .map((i) => `Invoice ${i.docNo}`)
//                                 .join(", ")} +${cl.count - 3} more`,
//                         date: cl.dateRangeLabel,
//                         info:
//                           cl.count === 1
//                             ? cl.items[0]?.sub || ""
//                             : `${cl.count} vendor invoices logged`,
//                       })
//                     }
//                     onMouseLeave={() => setHoveredNode(null)}
//                   >
//                     {isFar && invClusters.length <= 18 && (
//                       <line
//                         x1={cl.x}
//                         y1={dy < 0 ? 170 : 186}
//                         x2={cl.x}
//                         y2={dy < 0 ? labelY + 3 : labelY - 8}
//                         stroke="#fde68a"
//                         strokeWidth="1"
//                       />
//                     )}
//                     <rect
//                       x={cl.x - pillW / 2}
//                       y={178 - 7}
//                       width={pillW}
//                       height="14"
//                       rx="7"
//                       fill="#d97706"
//                       stroke="#ffffff"
//                       strokeWidth="2"
//                     />
//                     {cl.count > 1 && (
//                       <text
//                         x={cl.x}
//                         y="181"
//                         textAnchor="middle"
//                         className="text-[8.5px] font-mono font-bold fill-white"
//                       >
//                         ×{cl.count}
//                       </text>
//                     )}
//                     {invClusters.length <= 8 && (
//                       <text
//                         x={Math.max(150, Math.min(860, cl.x))}
//                         y={labelY}
//                         textAnchor="middle"
//                         className="text-[9.5px] font-mono font-semibold fill-amber-800"
//                       >
//                         {cl.primaryLabel}
//                       </text>
//                     )}
//                   </g>
//                 );
//               })}
//             </svg>
//           </div>

//           <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 px-1">
//             <span>
//               Timeline spans{" "}
//               <strong className="text-slate-800">
//                 {months[0]?.fullLabel}
//               </strong>{" "}
//               →{" "}
//               <strong className="text-slate-800">
//                 {months[months.length - 1]?.fullLabel}
//               </strong>{" "}
//               ({months.length} month{months.length === 1 ? "" : "s"})
//             </span>
//             {hoveredNode ? (
//               <div className="inline-flex flex-wrap items-center gap-2 bg-indigo-50/90 text-indigo-950 border border-indigo-200 px-3 py-1 rounded-lg text-xs font-mono">
//                 <span className="font-bold text-indigo-700">
//                   [{hoveredNode.badge}]
//                 </span>
//                 <strong>{hoveredNode.title}</strong>
//                 <span>· {hoveredNode.date}</span>
//                 {hoveredNode.info && (
//                   <span className="text-slate-600">({hoveredNode.info})</span>
//                 )}
//               </div>
//             ) : (
//               <span className="text-[11px] text-slate-400">
//                 Hover over any PO, GRN, or Invoice milestone node for details
//               </span>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ====================================================================
//           SUB-TAB 2: ACTIVITY FEED ("feed")
//       ==================================================================== */}
//       {tlView === "feed" && (
//         <div className="bg-gradient-to-b from-slate-50/60 to-white p-5 rounded-xl border border-slate-200/80 max-h-[540px] overflow-y-auto">
//           <ol className="list-none m-0 p-0 max-w-2xl">
//             {events.map((ev, idx) => {
//               const prevEv = idx > 0 ? events[idx - 1] : null;
//               const gapDays =
//                 prevEv && prevEv.date && ev.date
//                   ? Math.max(0, daysBetween(prevEv.date, ev.date) ?? 0)
//                   : 0;
//               const isSameDateAsPrev = prevEv && prevEv.date === ev.date;

//               return (
//                 <React.Fragment key={ev.id}>
//                   {idx > 0 && gapDays > 0 && (
//                     <li className="grid grid-cols-[110px_22px_1fr] gap-3 min-h-[26px]">
//                       <div />
//                       <div className="flex justify-center">
//                         <div className="w-0.5 bg-slate-200 h-full" />
//                       </div>
//                       <span className="self-center font-mono text-[11px] font-medium text-slate-400">
//                         +{gapDays}d
//                       </span>
//                     </li>
//                   )}

//                   {idx > 0 && isSameDateAsPrev && (
//                     <li className="grid grid-cols-[110px_22px_1fr] gap-3 min-h-[10px]">
//                       <div />
//                       <div className="flex justify-center">
//                         <div className="w-0.5 bg-indigo-200/70 h-full" />
//                       </div>
//                       <div />
//                     </li>
//                   )}

//                   <li className="grid grid-cols-[110px_22px_1fr] gap-3 items-center py-1">
//                     <span className="text-right font-mono text-xs text-slate-500 tabular-nums">
//                       {isSameDateAsPrev ? (
//                         <span className="text-[10px] text-slate-400">
//                           Same day
//                         </span>
//                       ) : (
//                         formatDisplayDate(ev.date)
//                       )}
//                     </span>
//                     <span
//                       className={`w-3.5 h-3.5 rounded-full justify-self-center ${ev.dotClass} ring-4 ring-white shadow-2xs`}
//                     />
//                     <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/75 shadow-2xs hover:-translate-y-0.5 hover:shadow-md transition-all">
//                       <div className="min-w-0">
//                         <b className="block text-xs font-bold text-slate-900 font-mono">
//                           {ev.title}
//                         </b>
//                         <small className="text-[11px] text-slate-500 block truncate">
//                           {ev.sub}
//                         </small>
//                       </div>
//                       <span
//                         className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border uppercase ${ev.pillClass}`}
//                       >
//                         {ev.type}
//                       </span>
//                     </div>
//                   </li>
//                 </React.Fragment>
//               );
//             })}

//             {record.daysSinceLastActivity !== null && (
//               <>
//                 <li className="grid grid-cols-[110px_22px_1fr] gap-3 min-h-[26px]">
//                   <div />
//                   <div className="flex justify-center">
//                     <div className="w-0.5 bg-slate-200 h-full" />
//                   </div>
//                   <span className="self-center font-mono text-[11px] font-medium text-slate-400">
//                     +{record.daysSinceLastActivity}d
//                   </span>
//                 </li>
//                 <li className="grid grid-cols-[110px_22px_1fr] gap-3 items-center py-1.5">
//                   <span className="text-right font-mono text-xs text-slate-400">
//                     Today
//                   </span>
//                   <span className="w-3.5 h-3.5 rounded-full justify-self-center bg-white border-2 border-dashed border-slate-400" />
//                   <div className="text-xs text-slate-500">
//                     <b className="font-semibold text-slate-700">
//                       Status: {record.st}
//                     </b>{" "}
//                     <small className="text-slate-400 block">
//                       {record.daysSinceLastActivity}d since last recorded
//                       activity
//                     </small>
//                   </div>
//                 </li>
//               </>
//             )}
//           </ol>
//         </div>
//       )}

//       {/* ====================================================================
//           SUB-TAB 3: MONTH BY MONTH ("month")
//       ==================================================================== */}
//       {tlView === "month" && (
//         <div className="space-y-3">
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
//             {months.map((m) => {
//               const isQuiet = m.events.length === 0;
//               return (
//                 <div
//                   key={m.key}
//                   className={`rounded-xl p-3 border grid gap-1.5 content-start min-w-0 transition-all duration-200 ${
//                     isQuiet
//                       ? "bg-slate-50/80 border-dashed border-slate-200 text-slate-400"
//                       : "bg-gradient-to-b from-indigo-50/35 to-white border-indigo-300 border-[1.5px] shadow-2xs hover:-translate-y-1 hover:shadow-md"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span
//                       className={`text-xs font-bold ${
//                         isQuiet ? "text-slate-400" : "text-slate-900"
//                       }`}
//                     >
//                       {m.fullLabel}
//                     </span>
//                     {!isQuiet && (
//                       <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">
//                         {m.events.length}
//                       </span>
//                     )}
//                   </div>

//                   {isQuiet ? (
//                     <div className="text-[11px] text-slate-400">
//                       No activity
//                     </div>
//                   ) : (
//                     <div className="space-y-1 pt-0.5 max-h-44 overflow-y-auto pr-0.5">
//                       {m.events.map((ev) => {
//                         const dayPart = ev.date.split("-")[2];
//                         const mIdx = parseInt(ev.date.split("-")[1], 10) - 1;
//                         return (
//                           <div
//                             key={ev.id}
//                             className="flex items-center gap-1.5 text-xs flex-nowrap min-w-0"
//                           >
//                             <i
//                               className={`w-2 h-2 rounded-full shrink-0 ${ev.dotClass}`}
//                             />
//                             <span className="font-mono text-[11px] text-slate-800 font-medium truncate">
//                               {ev.shortLabel}
//                             </span>
//                             <span className="ml-auto font-mono text-[10px] text-slate-400 shrink-0">
//                               {dayPart} {MONTH_NAMES[mIdx]}
//                             </span>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           <p className="text-xs text-slate-500">
//             Active in{" "}
//             <strong className="text-slate-800">
//               {months.length - quietMonthsCount}
//             </strong>{" "}
//             of <strong className="text-slate-800">{months.length}</strong>{" "}
//             months ({quietMonthsCount} quiet month
//             {quietMonthsCount === 1 ? "" : "s"}).
//           </p>
//         </div>
//       )}

//       {/* ====================================================================
//           SUB-TAB 4: RECEIPT -> INVOICE ("pairs" — Collision-Proof SVG Swimlane + Table)
//       ==================================================================== */}
//       {tlView === "pairs" && (
//         <div className="space-y-4">
//           {pairs.length === 0 ? (
//             <div className="p-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
//               No Goods Receipts (GRNs) or Invoices have been logged for PO #
//               {record.po}.
//             </div>
//           ) : (
//             <>
//               {/* Visual SVG Receipt -> Invoice Pair Swimlane (Collision-Proof on Same-Day / Short Frame) */}
//               <div className="bg-gradient-to-b from-teal-50/25 via-white to-amber-50/25 p-4 rounded-xl border border-teal-100/80 overflow-x-auto max-h-[440px] overflow-y-auto">
//                 <svg
//                   viewBox={`0 0 920 ${pairSvgHeight}`}
//                   className="w-full min-w-[700px] select-none"
//                 >
//                   {/* Month Grid Ticks */}
//                   {visibleTickMonths.map((m) => (
//                     <g key={`pair-tick-${m.key}`}>
//                       <line
//                         x1={m.tickX}
//                         y1="20"
//                         x2={m.tickX}
//                         y2={pairSvgHeight - 28}
//                         stroke="#e2e8f0"
//                         strokeDasharray="2 3"
//                       />
//                       <text
//                         x={m.tickX}
//                         y={pairSvgHeight - 10}
//                         textAnchor="middle"
//                         className="text-[10px] font-mono fill-slate-400"
//                       >
//                         {m.label}
//                       </text>
//                     </g>
//                   ))}

//                   {/* PO Reference Vertical Line */}
//                   {poClusters[0] && (
//                     <g>
//                       <line
//                         x1={poClusters[0].x}
//                         y1="20"
//                         x2={poClusters[0].x}
//                         y2={pairSvgHeight - 28}
//                         stroke="#6366f1"
//                         strokeWidth="1.5"
//                         strokeDasharray="3 3"
//                       />
//                       <text
//                         x={Math.min(780, poClusters[0].x + 6)}
//                         y="28"
//                         className="text-[10px] font-mono font-bold fill-indigo-600"
//                       >
//                         PO #{record.po} ({formatDisplayDate(record.date)})
//                       </text>
//                     </g>
//                   )}

//                   {/* Paired Rows: GRN Node ---- [ +Xd Lag Bar ] ----> Invoice Node */}
//                   {pairs.map((p, idx) => {
//                     const rowY = 54 + idx * 52;
//                     const rawX1 = p.grnX;
//                     const rawX2 = p.invX;

//                     // Prevent circle & label collision when GRN and Invoice occur on the same date or within a few days
//                     let drawX1 = rawX1;
//                     let drawX2 = rawX2;
//                     if (rawX1 !== null && rawX2 !== null) {
//                       const diff = rawX2 - rawX1;
//                       const minSep = 30;
//                       if (Math.abs(diff) < minSep) {
//                         const center = (rawX1 + rawX2) / 2;
//                         const dir = diff < 0 ? -1 : 1;
//                         drawX1 = center - (dir * minSep) / 2;
//                         drawX2 = center + (dir * minSep) / 2;
//                       }
//                     }

//                     const leftX =
//                       drawX1 !== null && drawX2 !== null
//                         ? Math.min(drawX1, drawX2)
//                         : drawX1 ?? drawX2;
//                     const rightX =
//                       drawX1 !== null && drawX2 !== null
//                         ? Math.max(drawX1, drawX2)
//                         : drawX1 ?? drawX2;
//                     const spanW =
//                       drawX1 !== null && drawX2 !== null
//                         ? Math.max(8, rightX - leftX)
//                         : 0;
//                     const midX =
//                       drawX1 !== null && drawX2 !== null
//                         ? (drawX1 + drawX2) / 2
//                         : drawX1 ?? drawX2;

//                     const grnIsLeft =
//                       drawX1 !== null && drawX2 !== null
//                         ? drawX1 <= drawX2
//                         : true;

//                     const grnShort = p.grn
//                       ? `GRN ${
//                           String(p.grn.no).length > 10
//                             ? `${String(p.grn.no).slice(0, 9)}…`
//                             : p.grn.no
//                         }`
//                       : "";
//                     const invShort = p.inv
//                       ? String(p.inv.no).length > 12
//                         ? `${String(p.inv.no).slice(0, 10)}…`
//                         : String(p.inv.no)
//                       : "";

//                     return (
//                       <g key={`pair-row-${p.index}`}>
//                         {/* Horizontal Row Track */}
//                         <line
//                           x1="120"
//                           y1={rowY}
//                           x2="880"
//                           y2={rowY}
//                           stroke="#f1f5f9"
//                           strokeWidth="1"
//                         />
//                         <text
//                           x="16"
//                           y={rowY + 4}
//                           className="text-[10.5px] font-mono font-bold fill-slate-600"
//                         >
//                           Pair #{p.index}
//                         </text>

//                         {/* Duration Span Bar between GRN and Invoice */}
//                         {drawX1 !== null && drawX2 !== null && (
//                           <>
//                             <rect
//                               x={leftX}
//                               y={rowY - 5}
//                               width={spanW}
//                               height="10"
//                               rx="5"
//                               fill={p.lagDays < 0 ? "#fde68a" : "#99f6e4"}
//                               opacity="0.8"
//                             />
//                             <line
//                               x1={drawX1}
//                               y1={rowY}
//                               x2={drawX2}
//                               y2={rowY}
//                               stroke={p.lagDays < 0 ? "#d97706" : "#0d9488"}
//                               strokeWidth="2"
//                             />
//                             <rect
//                               x={midX - 21}
//                               y={rowY - 21}
//                               width="42"
//                               height="14"
//                               rx="4"
//                               fill="#ffffff"
//                               stroke="#cbd5e1"
//                             />
//                             <text
//                               x={midX}
//                               y={rowY - 11}
//                               textAnchor="middle"
//                               className="text-[9.5px] font-mono font-bold fill-slate-700"
//                             >
//                               {p.lagDays >= 0
//                                 ? `+${p.lagDays}d`
//                                 : `${p.lagDays}d`}
//                             </text>
//                           </>
//                         )}

//                         {/* GRN Circle + Outer Label */}
//                         {drawX1 !== null && (
//                           <g>
//                             <circle
//                               cx={drawX1}
//                               cy={rowY}
//                               r="6"
//                               fill="#0d9488"
//                               stroke="#ffffff"
//                               strokeWidth="1.8"
//                             />
//                             <text
//                               x={grnIsLeft ? drawX1 - 10 : drawX1 + 10}
//                               y={rowY + 3.5}
//                               textAnchor={grnIsLeft ? "end" : "start"}
//                               className="text-[9.5px] font-mono font-semibold fill-teal-800"
//                             >
//                               {grnShort}
//                             </text>
//                           </g>
//                         )}

//                         {/* Invoice Circle + Outer Label */}
//                         {drawX2 !== null && (
//                           <g>
//                             <circle
//                               cx={drawX2}
//                               cy={rowY}
//                               r="6"
//                               fill="#d97706"
//                               stroke="#ffffff"
//                               strokeWidth="1.8"
//                             />
//                             <text
//                               x={grnIsLeft ? drawX2 + 10 : drawX2 - 10}
//                               y={rowY + 3.5}
//                               textAnchor={grnIsLeft ? "start" : "end"}
//                               className="text-[9.5px] font-mono font-semibold fill-amber-900"
//                             >
//                               {invShort}
//                             </text>
//                           </g>
//                         )}
//                       </g>
//                     );
//                   })}
//                 </svg>
//               </div>

//               {/* Detailed Reconciliation Table */}
//               <div className="overflow-x-auto rounded-xl border border-indigo-100/80">
//                 <table className="w-full text-left border-collapse text-xs">
//                   <thead>
//                     <tr className="bg-indigo-50/40 text-slate-500 uppercase text-[10px] font-bold border-b border-indigo-100/70">
//                       <th className="py-2.5 px-4">#</th>
//                       <th className="py-2.5 px-4">Receipt (GRN)</th>
//                       <th className="py-2.5 px-4">GRN Date</th>
//                       <th className="py-2.5 px-4">Invoice</th>
//                       <th className="py-2.5 px-4">Invoice Date</th>
//                       <th className="py-2.5 px-4">Receipt → Invoice Lag</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100 text-slate-700">
//                     {pairs.map((p) => {
//                       const barWidthPct =
//                         p.lagDays !== null
//                           ? Math.max(
//                               6,
//                               Math.round(
//                                 (Math.abs(p.lagDays) / maxPairLag) * 100
//                               )
//                             )
//                           : 0;

//                       return (
//                         <tr
//                           key={p.index}
//                           className="hover:bg-indigo-50/20 transition-colors"
//                         >
//                           <td className="py-2.5 px-4 font-mono text-slate-400">
//                             {p.index}
//                           </td>
//                           <td className="py-2.5 px-4 font-mono font-bold text-teal-800">
//                             {p.grn ? (
//                               <span className="inline-flex items-center gap-1.5">
//                                 <i className="w-2 h-2 rounded-full bg-teal-600" />
//                                 GRN {p.grn.no}
//                               </span>
//                             ) : (
//                               <span className="text-amber-600 font-normal italic">
//                                 No receipt
//                               </span>
//                             )}
//                           </td>
//                           <td className="py-2.5 px-4 font-mono text-slate-600">
//                             {p.grn ? formatDisplayDate(p.grn.cleanDate) : "—"}
//                           </td>
//                           <td className="py-2.5 px-4 font-mono font-bold text-amber-900">
//                             {p.inv ? (
//                               <span className="inline-flex items-center gap-1.5">
//                                 <i className="w-2 h-2 rounded-full bg-amber-500" />
//                                 {p.inv.no}
//                               </span>
//                             ) : (
//                               <span className="text-amber-600 font-normal italic">
//                                 Awaiting invoice
//                               </span>
//                             )}
//                           </td>
//                           <td className="py-2.5 px-4 font-mono text-slate-600">
//                             {p.inv ? formatDisplayDate(p.inv.cleanDate) : "—"}
//                           </td>
//                           <td className="py-2.5 px-4">
//                             {p.lagDays !== null ? (
//                               <div className="flex items-center gap-2.5 min-w-[140px]">
//                                 <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
//                                   <div
//                                     className={`h-full rounded-full ${
//                                       p.lagDays < 0
//                                         ? "bg-amber-500"
//                                         : p.lagDays <= 14
//                                         ? "bg-teal-500"
//                                         : "bg-indigo-500"
//                                     }`}
//                                     style={{ width: `${barWidthPct}%` }}
//                                   />
//                                 </div>
//                                 <span className="font-mono text-xs font-bold text-slate-800 w-12 text-right">
//                                   {p.lagDays >= 0
//                                     ? `+${p.lagDays}d`
//                                     : `${p.lagDays}d`}
//                                 </span>
//                               </div>
//                             ) : (
//                               <span className="text-amber-600 text-[11px] font-medium">
//                                 Unpaired
//                               </span>
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}

//           <p className="text-xs text-slate-500">
//             Each row pairs receipt #n with invoice #n in chronological order to
//             measure billing velocity.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// });

// // ============================================================================
// // 6. REDESIGNED 3D VISUALIZATION COMPONENTS (ZERO WHITE SPACE & CLEAN 3D)
// // ============================================================================

// /**
//  * 1. Committed vs. Settled Expenditure Chart (No extra top whitespace, fills container)
//  */
// const InteractiveSpendChart = React.memo(function InteractiveSpendChart({
//   data,
//   onSelectKey,
//   selectedKeys = [],
//   is3D = true,
// }) {
//   const [hoveredKey, setHoveredKey] = useState(null);

//   const displayData = useMemo(() => {
//     if (!Array.isArray(data) || data.length === 0) return [];
//     if (data.length <= 8) return data;
//     const top = data.slice(0, 7);
//     const rest = data.slice(7);
//     const others = rest.reduce(
//       (acc, item) => {
//         acc.poTotal += item.poTotal;
//         acc.invTotal += item.invTotal;
//         acc.paidTotal += item.paidTotal;
//         acc.count += item.count;
//         return acc;
//       },
//       {
//         key: "__OTHERS__",
//         label: `Others (${rest.length})`,
//         poTotal: 0,
//         invTotal: 0,
//         paidTotal: 0,
//         count: 0,
//       }
//     );
//     others.paidPct =
//       others.poTotal > 0
//         ? Math.round((others.paidTotal / others.poTotal) * 100)
//         : 0;
//     return [...top, others];
//   }, [data]);

//   const maxVal = Math.max(...displayData.map((d) => d.poTotal), 1);
//   const chartHeight = 205;
//   const baseLineY = 250;
//   const dx = is3D ? 12 : 0;
//   const dy = is3D ? -9 : 0;

//   if (displayData.length === 0) {
//     return (
//       <div className="h-64 flex items-center justify-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
//         No expenditure records match the current filter selection.
//       </div>
//     );
//   }

//   return (
//     <div className="w-full overflow-x-auto bg-gradient-to-b from-indigo-50/30 via-white to-sky-50/25 rounded-xl p-3 border border-indigo-100/70">
//       <svg viewBox="0 0 800 305" className="w-full min-w-[540px] select-none">
//         <defs>
//           <linearGradient id="entCommitFront" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="0%" stopColor="#6366f1" />
//             <stop offset="100%" stopColor="#4f46e5" />
//           </linearGradient>
//           <linearGradient id="entCommitSide" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="0%" stopColor="#4338ca" />
//             <stop offset="100%" stopColor="#312e81" />
//           </linearGradient>

//           <linearGradient id="entSettledFront" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="0%" stopColor="#14b8a6" />
//             <stop offset="100%" stopColor="#0d9488" />
//           </linearGradient>
//           <linearGradient id="entSettledSide" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="0%" stopColor="#0f766e" />
//             <stop offset="100%" stopColor="#115e59" />
//           </linearGradient>
//         </defs>

//         {/* Isometric Plinth */}
//         <polygon
//           points={`58,${baseLineY} 755,${baseLineY} ${755 + dx},${
//             baseLineY + dy
//           } ${58 + dx},${baseLineY + dy}`}
//           fill="#eef2ff"
//           stroke="#c7d2fe"
//           strokeWidth="1"
//         />

//         {[0.25, 0.5, 0.75, 1].map((ratio) => {
//           const y = baseLineY - ratio * chartHeight;
//           return (
//             <g key={ratio}>
//               {is3D && (
//                 <line
//                   x1="58"
//                   y1={y}
//                   x2={58 + dx}
//                   y2={y + dy}
//                   stroke="#e0e7ff"
//                   strokeWidth="1"
//                 />
//               )}
//               <line
//                 x1={58 + dx}
//                 y1={y + dy}
//                 x2={755 + dx}
//                 y2={y + dy}
//                 stroke="#e0e7ff"
//                 strokeDasharray="4 4"
//               />
//               <text
//                 x="50"
//                 y={y + 3}
//                 textAnchor="end"
//                 className="text-[10px] font-mono fill-slate-400"
//               >
//                 {formatCompact(maxVal * ratio)}
//               </text>
//             </g>
//           );
//         })}

//         {displayData.map((item, idx) => {
//           const slotWidth = 685 / Math.max(displayData.length, 1);
//           const groupX = 80 + idx * slotWidth;
//           const barW = 21;

//           const poH = Math.max(5, (item.poTotal / maxVal) * chartHeight);
//           const paidH = Math.max(5, (item.paidTotal / maxVal) * chartHeight);

//           const poY = baseLineY - poH;
//           const paidY = baseLineY - paidH;
//           const isSelected = selectedKeys.includes(item.key);
//           const isHovered = hoveredKey === item.key;
//           const isDimmed =
//             selectedKeys.length > 0 &&
//             !isSelected &&
//             item.key !== "__OTHERS__";

//           return (
//             <g
//               key={item.key}
//               onClick={() =>
//                 item.key !== "__OTHERS__" && onSelectKey && onSelectKey(item.key)
//               }
//               onMouseEnter={() => setHoveredKey(item.key)}
//               onMouseLeave={() => setHoveredKey(null)}
//               style={{
//                 cursor: item.key === "__OTHERS__" ? "default" : "pointer",
//                 transform: isHovered
//                   ? "translate3d(0, -6px, 0)"
//                   : "translate3d(0, 0, 0)",
//                 transition:
//                   "transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms ease",
//                 opacity: isDimmed ? 0.35 : 1,
//               }}
//             >
//               {/* Committed Bar */}
//               <g>
//                 <rect
//                   x={groupX}
//                   y={poY}
//                   width={barW}
//                   height={poH}
//                   rx={is3D ? 0 : 3}
//                   fill="url(#entCommitFront)"
//                 />
//                 {is3D && (
//                   <>
//                     <polygon
//                       points={`${groupX},${poY} ${groupX + dx},${poY + dy} ${
//                         groupX + barW + dx
//                       },${poY + dy} ${groupX + barW},${poY}`}
//                       fill="#a5b4fc"
//                     />
//                     <polygon
//                       points={`${groupX + barW},${poY} ${groupX + barW + dx},${
//                         poY + dy
//                       } ${groupX + barW + dx},${baseLineY + dy} ${
//                         groupX + barW
//                       },${baseLineY}`}
//                       fill="url(#entCommitSide)"
//                     />
//                   </>
//                 )}
//               </g>

//               {/* Settled Bar */}
//               <g>
//                 <rect
//                   x={groupX + barW + 6}
//                   y={paidY}
//                   width={barW}
//                   height={paidH}
//                   rx={is3D ? 0 : 3}
//                   fill="url(#entSettledFront)"
//                 />
//                 {is3D && (
//                   <>
//                     <polygon
//                       points={`${groupX + barW + 6},${paidY} ${
//                         groupX + barW + 6 + dx
//                       },${paidY + dy} ${groupX + barW * 2 + 6 + dx},${
//                         paidY + dy
//                       } ${groupX + barW * 2 + 6},${paidY}`}
//                       fill="#5eead4"
//                     />
//                     <polygon
//                       points={`${groupX + barW * 2 + 6},${paidY} ${
//                         groupX + barW * 2 + 6 + dx
//                       },${paidY + dy} ${groupX + barW * 2 + 6 + dx},${
//                         baseLineY + dy
//                       } ${groupX + barW * 2 + 6},${baseLineY}`}
//                       fill="url(#entSettledSide)"
//                     />
//                   </>
//                 )}
//               </g>

//               {(isHovered || isSelected) && (
//                 <g>
//                   <rect
//                     x={groupX - 24}
//                     y={Math.min(poY, paidY) - 42}
//                     width="110"
//                     height="28"
//                     rx="6"
//                     fill="#1e1b4b"
//                   />
//                   <text
//                     x={groupX + 31}
//                     y={Math.min(poY, paidY) - 29}
//                     textAnchor="middle"
//                     className="text-[10px] font-mono font-semibold fill-white"
//                   >
//                     PO: {formatCompact(item.poTotal)}
//                   </text>
//                   <text
//                     x={groupX + 31}
//                     y={Math.min(poY, paidY) - 18}
//                     textAnchor="middle"
//                     className="text-[9px] font-mono fill-teal-300"
//                   >
//                     Paid: {formatCompact(item.paidTotal)} ({item.paidPct}%)
//                   </text>
//                 </g>
//               )}

//               <text
//                 x={groupX + barW + 3}
//                 y={baseLineY + 20}
//                 textAnchor="middle"
//                 className={`text-[10px] ${
//                   isSelected
//                     ? "fill-indigo-600 font-bold"
//                     : "fill-slate-600 font-medium"
//                 }`}
//               >
//                 {item.label.length > 13
//                   ? `${item.label.slice(0, 12)}…`
//                   : item.label}
//               </text>
//               <text
//                 x={groupX + barW + 3}
//                 y={baseLineY + 33}
//                 textAnchor="middle"
//                 className="text-[9px] font-mono fill-slate-400"
//               >
//                 {item.count} PO{item.count > 1 ? "s" : ""} · {item.paidPct}%
//               </text>
//             </g>
//           );
//         })}
//       </svg>
//     </div>
//   );
// });

// /**
//  * 2. Redesigned Capital Conversion Pipeline ("Where the money is" 3D Isometric Bars + Variance Footer)
//  * Matches the horizontal funnel & gap metrics in `PR to PO Tracker.html` with 3D depth & hover popups.
//  */
// const FinancialPipeline3D = React.memo(function FinancialPipeline3D({
//   prTotal,
//   poTotal,
//   invTotal,
//   paidTotal,
//   is3D = true,
// }) {
//   const maxVal = Math.max(prTotal, poTotal, invTotal, paidTotal, 1);

//   const stages = [
//     {
//       label: "PR value",
//       val: prTotal,
//       pct: 100,
//       front: "from-sky-500 to-sky-600",
//       top: "#7dd3fc",
//       badge: "bg-sky-50 text-sky-700 border-sky-200",
//     },
//     {
//       label: "PO value",
//       val: poTotal,
//       pct: prTotal > 0 ? Math.round((poTotal / prTotal) * 100) : 100,
//       front: "from-indigo-500 to-indigo-600",
//       top: "#a5b4fc",
//       badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
//     },
//     {
//       label: "Invoiced",
//       val: invTotal,
//       pct: poTotal > 0 ? Math.round((invTotal / poTotal) * 100) : 0,
//       front: "from-amber-500 to-amber-600",
//       top: "#fcd34d",
//       badge: "bg-amber-50 text-amber-800 border-amber-200",
//     },
//     {
//       label: "Paid",
//       val: paidTotal,
//       pct: invTotal > 0 ? Math.round((paidTotal / invTotal) * 100) : 0,
//       front: "from-teal-500 to-teal-600",
//       top: "#5eead4",
//       badge: "bg-teal-50 text-teal-700 border-teal-200",
//     },
//   ];

//   const poVsPrDiff = poTotal - prTotal;
//   const unbilledVal = Math.max(0, poTotal - invTotal);
//   const unpaidVal = Math.max(0, invTotal - paidTotal);

//   return (
//     <div className="space-y-3 bg-gradient-to-br from-sky-50/30 via-white to-indigo-50/25 p-3.5 rounded-xl border border-sky-100/80">
//       {/* 4 Horizontal 3D Extruded Funnel Rows (.funnel / .frow) */}
//       <div className="space-y-2.5">
//         {stages.map((st) => {
//           const widthPct = Math.max(4, Math.round((st.val / maxVal) * 100));
//           return (
//             <div
//               key={st.label}
//               className="group grid grid-cols-[78px_1fr_115px] items-center gap-2.5 p-1.5 rounded-xl hover:bg-white hover:shadow-xs transition-all duration-200"
//             >
//               <div className="flex items-center justify-between pr-1">
//                 <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">
//                   {st.label}
//                 </span>
//               </div>

//               {/* 3D Isometric Extruded Bar Track */}
//               <div className="relative h-6 bg-slate-100/90 rounded-lg p-0.5 overflow-hidden border border-slate-200/60">
//                 <div
//                   className={`relative h-full rounded-md bg-gradient-to-r ${st.front} transition-all duration-500 group-hover:brightness-105`}
//                   style={{
//                     width: `${widthPct}%`,
//                     boxShadow: is3D
//                       ? `0 -3px 0 ${st.top} inset, 2px 2px 4px rgba(15, 23, 42, 0.12)`
//                       : "none",
//                   }}
//                 />
//                 <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-500">
//                   {st.pct}%
//                 </span>
//               </div>

//               <div className="text-right font-mono text-xs font-bold text-slate-900 tabular-nums">
//                 {Math.round(st.val).toLocaleString("en-US")}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* 3 Variance Gap Mini-Cards (.gaps / .gap from PR to PO Tracker.html) */}
//       <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-200/70 text-xs">
//         <div className="bg-white/90 p-2 rounded-lg border border-slate-200/60 hover:-translate-y-0.5 transition-transform">
//           <div className="text-[10px] text-slate-400 font-semibold">
//             PO vs PR
//           </div>
//           <div
//             className={`font-mono font-bold text-xs mt-0.5 ${
//               poVsPrDiff > 0 ? "text-amber-700" : "text-slate-800"
//             }`}
//           >
//             {poVsPrDiff >= 0 ? "+" : ""}
//             {formatCompact(poVsPrDiff)}
//           </div>
//         </div>

//         <div className="bg-white/90 p-2 rounded-lg border border-slate-200/60 hover:-translate-y-0.5 transition-transform">
//           <div className="text-[10px] text-slate-400 font-semibold">
//             Unbilled on PO
//           </div>
//           <div
//             className={`font-mono font-bold text-xs mt-0.5 ${
//               unbilledVal > 0 ? "text-amber-700" : "text-teal-700"
//             }`}
//           >
//             {formatCompact(unbilledVal)}
//           </div>
//         </div>

//         <div className="bg-white/90 p-2 rounded-lg border border-slate-200/60 hover:-translate-y-0.5 transition-transform">
//           <div className="text-[10px] text-slate-400 font-semibold">
//             Unpaid on billed
//           </div>
//           <div
//             className={`font-mono font-bold text-xs mt-0.5 ${
//               unpaidVal > 0 ? "text-rose-600" : "text-emerald-700"
//             }`}
//           >
//             {formatCompact(unpaidVal)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// /**
//  * 3. Redesigned GL Cost Pool Share (Crisp 3D Isometric Stacked Allocation Bar + Interactive Hover Cards)
//  * Replaces the distorted 2.5D sphere/ellipse with an executive 3D segmented bar and interactive tiles.
//  */
// const CostPool3DDonut = React.memo(function CostPool3DDonut({
//   accounts,
//   onSelectAccount,
//   selectedAccounts = [],
//   is3D = true,
// }) {
//   const displayAccounts = useMemo(() => {
//     if (!Array.isArray(accounts) || accounts.length === 0) return [];
//     if (accounts.length <= 5) return accounts;
//     const top = accounts.slice(0, 4);
//     const rest = accounts.slice(4);
//     const othersVal = rest.reduce((s, a) => s + a.value, 0);
//     const othersCount = rest.reduce((s, a) => s + (a.count || 1), 0);
//     return [
//       ...top,
//       {
//         acct: "__OTHERS__",
//         acctDesc: `Other Cost Pools (${rest.length})`,
//         value: othersVal,
//         count: othersCount,
//       },
//     ];
//   }, [accounts]);

//   const total = displayAccounts.reduce((s, a) => s + a.value, 0) || 1;
//   const palette = [
//     {
//       bar: "bg-indigo-600",
//       top: "#a5b4fc",
//       dot: "bg-indigo-600",
//       tint: "bg-indigo-50/80 border-indigo-300",
//       badge: "bg-indigo-50 text-indigo-700",
//     },
//     {
//       bar: "bg-sky-500",
//       top: "#7dd3fc",
//       dot: "bg-sky-500",
//       tint: "bg-sky-50/80 border-sky-300",
//       badge: "bg-sky-50 text-sky-700",
//     },
//     {
//       bar: "bg-teal-500",
//       top: "#5eead4",
//       dot: "bg-teal-500",
//       tint: "bg-teal-50/80 border-teal-300",
//       badge: "bg-teal-50 text-teal-700",
//     },
//     {
//       bar: "bg-amber-500",
//       top: "#fcd34d",
//       dot: "bg-amber-500",
//       tint: "bg-amber-50/80 border-amber-300",
//       badge: "bg-amber-50 text-amber-800",
//     },
//     {
//       bar: "bg-slate-400",
//       top: "#cbd5e1",
//       dot: "bg-slate-400",
//       tint: "bg-slate-100 border-slate-300",
//       badge: "bg-slate-100 text-slate-600",
//     },
//   ];

//   const items = displayAccounts.map((acc, idx) => ({
//     ...acc,
//     pct: Math.max(1, Math.round((acc.value / total) * 100)),
//     theme: palette[idx % palette.length],
//   }));

//   if (items.length === 0) {
//     return (
//       <div className="h-40 flex items-center justify-center text-xs text-slate-400">
//         No GL account data available
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3 bg-gradient-to-r from-violet-50/25 via-white to-indigo-50/25 p-3.5 rounded-xl border border-indigo-100/70">
//       {/* 3D Segmented Master Allocation Bar */}
//       <div className="space-y-1.5">
//         <div className="flex justify-between text-[11px] text-slate-500 font-medium">
//           <span>Total Distributed Across {accounts.length} GL Accounts</span>
//           <span className="font-mono font-bold text-slate-800">
//             {formatCompact(total)} AED
//           </span>
//         </div>
//         <div className="h-5 w-full rounded-xl bg-slate-100 p-0.5 flex gap-0.5 overflow-hidden border border-slate-200/80">
//           {items.map((s) => (
//             <div
//               key={`${s.acct}-seg`}
//               onClick={() =>
//                 s.acct !== "__OTHERS__" && onSelectAccount(s.acct)
//               }
//               title={`${s.acctDesc}: AED ${Math.round(
//                 s.value
//               ).toLocaleString()} (${s.pct}%)`}
//               className={`h-full ${s.theme.bar} first:rounded-l-lg last:rounded-r-lg transition-all duration-300 hover:brightness-110 ${
//                 s.acct === "__OTHERS__" ? "cursor-default" : "cursor-pointer"
//               }`}
//               style={{
//                 width: `${s.pct}%`,
//                 boxShadow: is3D ? `0 -3px 0 ${s.theme.top} inset` : "none",
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Interactive 3D Hover Cards for Each Cost Pool */}
//       <div className="space-y-1.5 text-xs">
//         {items.map((s) => {
//           const active = selectedAccounts.includes(s.acct);
//           return (
//             <div
//               key={s.acct}
//               onClick={() =>
//                 s.acct !== "__OTHERS__" && onSelectAccount(s.acct)
//               }
//               className={`group flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-200 ${
//                 s.acct === "__OTHERS__"
//                   ? "cursor-default"
//                   : "cursor-pointer hover:-translate-y-0.5 hover:shadow-sm"
//               } ${
//                 active
//                   ? `${s.theme.tint} font-bold text-slate-900 shadow-2xs`
//                   : "bg-white/95 border-slate-200/70 hover:border-indigo-200 text-slate-700"
//               }`}
//             >
//               <div className="flex items-center gap-2.5 min-w-0 flex-1">
//                 <span
//                   className={`w-3 h-3 rounded-md shrink-0 ${s.theme.dot} shadow-2xs`}
//                 />
//                 <div className="truncate">
//                   <div className="truncate font-semibold text-slate-800 group-hover:text-indigo-950">
//                     {s.acctDesc}
//                   </div>
//                   {s.acct !== "__OTHERS__" && (
//                     <div className="text-[10px] font-mono text-slate-400">
//                       GL {s.acct}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center gap-2.5 shrink-0 ml-2">
//                 <span className="font-mono text-xs font-bold text-slate-800">
//                   {formatCompact(s.value)}
//                 </span>
//                 <span
//                   className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md ${s.theme.badge} w-11 text-center`}
//                 >
//                   {s.pct}%
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// });

// // ============================================================================
// // 7. MAIN CONTAINER-ADAPTIVE ENTERPRISE APPLICATION
// // ============================================================================
// export default function POTrackerApp() {
//   const [rawList, setRawList] = useState([]);
//   const [activeWorkspace, setActiveWorkspace] = useState("overview");
//   const [isRegisterOpen, setIsRegisterOpen] = useState(false);
//   const [is3DEnabled, setIs3DEnabled] = useState(true);

//   const [activePO, setActivePO] = useState("");
//   const [detailRecord, setDetailRecord] = useState(null);
//   const [isLoadingList, setIsLoadingList] = useState(true);
//   const [isLoadingDetail, setIsLoadingDetail] = useState(false);
//   const [apiError, setApiError] = useState(null);

//   // --- Multi-Select & Search Filter States ---
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedVendors, setSelectedVendors] = useState([]);
//   const [selectedAccounts, setSelectedAccounts] = useState([]);
//   const [selectedStatuses, setSelectedStatuses] = useState([]);
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [sortBy, setSortBy] = useState("po_desc");
//   const [chartDimension, setChartDimension] = useState("vendor");

//   // --- Pagination State ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(15);

//   // --- API 1: Fetch Portfolio List ---
//   const fetchDashboardList = useCallback(async () => {
//     setIsLoadingList(true);
//     setApiError(null);
//     try {
//       const res = await fetch(`${backendUrl}/api/PrPoDashboard/GetDashboardV1`);
//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status}: Failed to fetch dashboard data`);
//       }
//       const data = await res.json();
//       setRawList(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setApiError(
//         err.message || "Unable to connect to /api/PrPoDashboard/GetDashboardV1"
//       );
//       setRawList([]);
//     } finally {
//       setIsLoadingList(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDashboardList();
//   }, [fetchDashboardList]);

//   const poList = useMemo(
//     () => rawList.map(enrichRecord).filter(Boolean),
//     [rawList]
//   );

//   // --- API 2: Fetch Single PO Detail ---
//   // FIX: stale responses (from a previously selected PO) are ignored, and a null
//   // enrichment result never replaces the current record. This prevents the
//   // timeline from flipping to a different PO / disappearing mid-render.
//   useEffect(() => {
//     if (!activePO) return undefined;
//     let cancelled = false;

//     const fallbackToList = () => {
//       const match = poList.find((p) => p.po === activePO);
//       if (match) setDetailRecord(match);
//     };

//     async function fetchPoDetail() {
//       setIsLoadingDetail(true);
//       try {
//         const res = await fetch(
//           `${backendUrl}/api/PrPoDashboard/po/${activePO}`
//         );
//         if (cancelled) return;
//         if (res.ok) {
//           const data = await res.json();
//           if (cancelled) return;
//           const enriched = enrichRecord(data);
//           if (enriched) {
//             setDetailRecord(enriched);
//           } else {
//             fallbackToList();
//           }
//         } else {
//           fallbackToList();
//         }
//       } catch {
//         if (!cancelled) fallbackToList();
//       } finally {
//         if (!cancelled) setIsLoadingDetail(false);
//       }
//     }
//     fetchPoDetail();

//     return () => {
//       cancelled = true;
//     };
//   }, [activePO, poList]);

//   const filterOptions = useMemo(() => {
//     const vendorCounts = new Map();
//     const statusCounts = new Map();
//     const acctMap = new Map();

//     poList.forEach((p) => {
//       vendorCounts.set(p.vendor, (vendorCounts.get(p.vendor) || 0) + 1);
//       statusCounts.set(p.st, (statusCounts.get(p.st) || 0) + 1);
//       p.lines.forEach((l) => {
//         if (l.acct) {
//           acctMap.set(l.acct, {
//             value: l.acct,
//             label: `${l.acctDesc || "Account"}`,
//             subLabel: `GL Code: ${l.acct}`,
//           });
//         }
//       });
//     });

//     const vendors = Array.from(vendorCounts.entries())
//       .sort((a, b) => a[0].localeCompare(b[0]))
//       .map(([v, count]) => ({
//         value: v,
//         label: v,
//         subLabel: `${count} Purchase Order${count > 1 ? "s" : ""}`,
//       }));

//     const statuses = Array.from(statusCounts.entries())
//       .sort((a, b) => a[0].localeCompare(b[0]))
//       .map(([st, count]) => ({
//         value: st,
//         label: st,
//         subLabel: `${count} Record${count > 1 ? "s" : ""}`,
//       }));

//     const accounts = Array.from(acctMap.values()).sort((a, b) =>
//       a.value.localeCompare(b.value)
//     );

//     return { vendors, statuses, accounts };
//   }, [poList]);

//   const filteredPOs = useMemo(() => {
//     const q = searchQuery.toLowerCase().trim();
//     return poList
//       .filter((item) => {
//         if (
//           selectedVendors.length > 0 &&
//           !selectedVendors.includes(item.vendor)
//         ) {
//           return false;
//         }
//         if (
//           selectedStatuses.length > 0 &&
//           !selectedStatuses.includes(item.st)
//         ) {
//           return false;
//         }
//         if (
//           selectedAccounts.length > 0 &&
//           !item.lines.some((l) => selectedAccounts.includes(l.acct))
//         ) {
//           return false;
//         }
//         if (dateFrom && item.date !== "N/A" && item.date < dateFrom) {
//           return false;
//         }
//         if (dateTo && item.date !== "N/A" && item.date > dateTo) {
//           return false;
//         }

//         if (q) {
//           const matchPO = item.po.toLowerCase().includes(q);
//           const matchVendor = item.vendor.toLowerCase().includes(q);
//           const matchPR = item.prs.some(
//             (pr) =>
//               String(pr.no).toLowerCase().includes(q) ||
//               (pr.desc || "").toLowerCase().includes(q)
//           );
//           const matchLine = item.lines.some(
//             (l) =>
//               (l.item || "").toLowerCase().includes(q) ||
//               (l.acct || "").toLowerCase().includes(q) ||
//               (l.acctDesc || "").toLowerCase().includes(q)
//           );
//           const matchGRN = item.grns.some((g) =>
//             String(g.no).toLowerCase().includes(q)
//           );
//           const matchINV = item.invs.some((i) =>
//             String(i.no).toLowerCase().includes(q)
//           );
//           return (
//             matchPO ||
//             matchVendor ||
//             matchPR ||
//             matchLine ||
//             matchGRN ||
//             matchINV
//           );
//         }
//         return true;
//       })
//       .sort((a, b) => {
//         if (sortBy === "val_desc") return b.poTotal - a.poTotal;
//         if (sortBy === "val_asc") return a.poTotal - b.poTotal;
//         if (sortBy === "date_desc") return b.date.localeCompare(a.date);
//         return b.po.localeCompare(a.po);
//       });
//   }, [
//     poList,
//     searchQuery,
//     selectedVendors,
//     selectedAccounts,
//     selectedStatuses,
//     dateFrom,
//     dateTo,
//     sortBy,
//   ]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [
//     searchQuery,
//     selectedVendors,
//     selectedAccounts,
//     selectedStatuses,
//     dateFrom,
//     dateTo,
//     sortBy,
//   ]);

//   const totalPages = Math.max(1, Math.ceil(filteredPOs.length / pageSize));
//   const paginatedPOs = useMemo(() => {
//     const start = (currentPage - 1) * pageSize;
//     return filteredPOs.slice(start, start + pageSize);
//   }, [filteredPOs, currentPage, pageSize]);

//   const overviewStats = useMemo(() => {
//     const totals = filteredPOs.reduce(
//       (acc, p) => {
//         acc.pr += p.prTotal;
//         acc.po += p.poTotal;
//         acc.inv += p.invTotal;
//         acc.paid += p.paidTotal;
//         acc.unbilled += p.remainingUnbilled;
//         acc.unpaid += p.remainingUnpaid;
//         acc.grnCount += p.grns.length;
//         acc.invCount += p.invs.length;
//         if (p.st.toLowerCase() === "open") acc.openPoCount += 1;
//         if (p.poToGrnDays !== null && p.poToGrnDays >= 0) {
//           acc.grnDaysSum += p.poToGrnDays;
//           acc.grnDaysCount += 1;
//         }
//         if (p.grnToInvDays !== null && p.grnToInvDays >= 0) {
//           acc.invDaysSum += p.grnToInvDays;
//           acc.invDaysCount += 1;
//         }
//         return acc;
//       },
//       {
//         pr: 0,
//         po: 0,
//         inv: 0,
//         paid: 0,
//         unbilled: 0,
//         unpaid: 0,
//         grnCount: 0,
//         invCount: 0,
//         openPoCount: 0,
//         grnDaysSum: 0,
//         grnDaysCount: 0,
//         invDaysSum: 0,
//         invDaysCount: 0,
//       }
//     );

//     const vendorMap = new Map();
//     const acctMap = new Map();

//     filteredPOs.forEach((p) => {
//       const vPrev = vendorMap.get(p.vendor) || {
//         key: p.vendor,
//         label: p.vendor,
//         poTotal: 0,
//         invTotal: 0,
//         paidTotal: 0,
//         count: 0,
//       };
//       vPrev.poTotal += p.poTotal;
//       vPrev.invTotal += p.invTotal;
//       vPrev.paidTotal += p.paidTotal;
//       vPrev.count += 1;
//       vPrev.paidPct =
//         vPrev.poTotal > 0
//           ? Math.round((vPrev.paidTotal / vPrev.poTotal) * 100)
//           : 0;
//       vendorMap.set(p.vendor, vPrev);

//       p.lines.forEach((l) => {
//         const key = l.acct || "Unassigned";
//         const aPrev = acctMap.get(key) || {
//           key,
//           acct: key,
//           acctDesc: l.acctDesc || "General",
//           label: `${key} ${l.acctDesc || ""}`,
//           value: 0,
//           poTotal: 0,
//           invTotal: 0,
//           paidTotal: 0,
//           count: 0,
//         };
//         aPrev.value += Number(l.cost) || 0;
//         aPrev.poTotal += Number(l.cost) || 0;
//         aPrev.invTotal += Number(l.inv) || 0;
//         aPrev.paidTotal += Number(l.paid) || 0;
//         aPrev.count += 1;
//         aPrev.paidPct =
//           aPrev.poTotal > 0
//             ? Math.round((aPrev.paidTotal / aPrev.poTotal) * 100)
//             : 0;
//         acctMap.set(key, aPrev);
//       });
//     });

//     return {
//       ...totals,
//       utilizationPct:
//         totals.pr > 0 ? Math.round((totals.po / totals.pr) * 100) : 0,
//       billedPct:
//         totals.po > 0 ? Math.round((totals.inv / totals.po) * 100) : 0,
//       settlementPct:
//         totals.po > 0 ? Math.round((totals.paid / totals.po) * 100) : 0,
//       avgPoToGrn:
//         totals.grnDaysCount > 0
//           ? Math.round(totals.grnDaysSum / totals.grnDaysCount)
//           : null,
//       avgGrnToInv:
//         totals.invDaysCount > 0
//           ? Math.round(totals.invDaysSum / totals.invDaysCount)
//           : null,
//       vendorBars: Array.from(vendorMap.values()).sort(
//         (a, b) => b.poTotal - a.poTotal
//       ),
//       accountBars: Array.from(acctMap.values()).sort(
//         (a, b) => b.poTotal - a.poTotal
//       ),
//     };
//   }, [filteredPOs]);

//   const inspectPO = (poNumber) => {
//     setActivePO(poNumber);
//     const match = poList.find((p) => p.po === poNumber);
//     if (match) setDetailRecord(match);
//     setActiveWorkspace("inspector");
//   };

//   const toggleMultiFilterItem = (setter, key) => {
//     setter((prev) =>
//       prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
//     );
//   };

//   const resetAllFilters = () => {
//     setSearchQuery("");
//     setSelectedVendors([]);
//     setSelectedAccounts([]);
//     setSelectedStatuses([]);
//     setDateFrom("");
//     setDateTo("");
//   };

//   const activeFilterCount =
//     (searchQuery.trim() ? 1 : 0) +
//     selectedVendors.length +
//     selectedAccounts.length +
//     selectedStatuses.length +
//     (dateFrom ? 1 : 0) +
//     (dateTo ? 1 : 0);

//   const currentRecord = detailRecord || filteredPOs[0] || poList[0] || null;

//   return (
//     <div className="w-full min-h-full bg-white text-slate-800 font-sans antialiased">
//       <div className="w-full max-w-full mx-auto p-3 sm:p-5 space-y-4">
//         {/* ====================================================================
//             TOP NAVIGATION TAB BAR & COMMAND HEADER
//         ==================================================================== */}
//         <header className="bg-gradient-to-r from-indigo-50/50 via-white to-sky-50/50 rounded-2xl border border-indigo-100/80 p-4 shadow-2xs space-y-4">
//           <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs shrink-0">
//                 PO
//               </div>
//               <div>
//                 <div className="flex flex-wrap items-center gap-2">
//                   <h1 className="text-base font-bold text-slate-900 tracking-tight">
//                     PR → PO Financial Analytics
//                   </h1>
//                   <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/70 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full">
//                     {filteredPOs.length} of {poList.length} Orders
//                   </span>
//                 </div>
//                 {/* <p className="text-xs text-slate-500">
//                   Interactive capital conversion, vendor spend, and fulfillment
//                   telemetry
//                 </p> */}
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-2">
//               <div className="inline-flex bg-slate-100/90 p-1 rounded-xl border border-slate-200/70">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setActiveWorkspace("overview");
//                     setIsRegisterOpen(false);
//                   }}
//                   className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
//                     activeWorkspace === "overview" && !isRegisterOpen
//                       ? "bg-white text-indigo-700 shadow-2xs"
//                       : "text-slate-600 hover:text-slate-900"
//                   }`}
//                 >
//                   <Icons.Dashboard className="w-3.5 h-3.5" />
//                   <span>Executive Overview</span>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setActiveWorkspace("overview");
//                     setIsRegisterOpen((prev) => !prev);
//                   }}
//                   className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
//                     activeWorkspace === "overview" && isRegisterOpen
//                       ? "bg-white text-indigo-700 shadow-2xs"
//                       : "text-slate-600 hover:text-slate-900"
//                   }`}
//                 >
//                   <Icons.TableRegister className="w-3.5 h-3.5" />
//                   <span>PO Register</span>
//                   <span className="bg-indigo-50 text-indigo-700 text-[10px] font-mono px-1.5 py-0.2 rounded-md">
//                     {filteredPOs.length}
//                   </span>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (!activePO && currentRecord)
//                       setActivePO(currentRecord.po);
//                     setActiveWorkspace("inspector");
//                   }}
//                   disabled={!currentRecord}
//                   className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 ${
//                     activeWorkspace === "inspector"
//                       ? "bg-white text-indigo-700 shadow-2xs"
//                       : "text-slate-600 hover:text-slate-900"
//                   }`}
//                 >
//                   <Icons.Inspector className="w-3.5 h-3.5" />
//                   <span>
//                     PO Inspector{" "}
//                     {currentRecord ? `(#${currentRecord.po})` : ""}
//                   </span>
//                 </button>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setIs3DEnabled((prev) => !prev)}
//                 className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
//                   is3DEnabled
//                     ? "bg-indigo-50 text-indigo-700 border-indigo-200"
//                     : "bg-white text-slate-600 border-slate-200"
//                 }`}
//               >
//                 <Icons.Cube3D className="w-3.5 h-3.5" />
//                 <span>{is3DEnabled ? "3D View" : "2D View"}</span>
//               </button>

//               <SearchablePOPicker
//                 poList={filteredPOs}
//                 activePO={activePO || currentRecord?.po || ""}
//                 onSelectPO={inspectPO}
//               />

//               <button
//                 type="button"
//                 onClick={fetchDashboardList}
//                 title="Refresh Live API Data"
//                 className="p-2 rounded-xl bg-white border border-slate-200/90 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
//               >
//                 <Icons.Refresh
//                   className={`w-4 h-4 ${
//                     isLoadingList ? "animate-spin text-indigo-600" : ""
//                   }`}
//                 />
//               </button>
//             </div>
//           </div>

//           {/* Multi-Select & Searchable Filter Bar */}
//           <div className="pt-3 border-t border-indigo-100/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 items-end">
//             <div className="lg:col-span-2">
//               <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
//                 Global  Search
//               </label>
//               <div className="relative">
//                 <Icons.Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search PO #, PR #, vendor, item, GRN, invoice..."
//                   className="w-full text-xs bg-slate-50/70 border border-slate-200/80 rounded-xl pl-8 pr-3 py-2 outline-none focus:border-indigo-500 focus:bg-white transition-colors"
//                 />
//               </div>
//             </div>

//             <SearchableMultiSelect
//               label="Vendors "
//               placeholder={`All Vendors (${filterOptions.vendors.length})`}
//               options={filterOptions.vendors}
//               selectedValues={selectedVendors}
//               onChange={setSelectedVendors}
//               accent="indigo"
//             />

//             <SearchableMultiSelect
//               label="GL Accounts "
//               placeholder={`All GL Accounts (${filterOptions.accounts.length})`}
//               options={filterOptions.accounts}
//               selectedValues={selectedAccounts}
//               onChange={setSelectedAccounts}
//               accent="sky"
//             />

//             <SearchableMultiSelect
//               label="PO Status "
//               placeholder="All Statuses"
//               options={filterOptions.statuses}
//               selectedValues={selectedStatuses}
//               onChange={setSelectedStatuses}
//               accent="teal"
//             />

//             <div className="flex items-center gap-1.5">
//               <div className="flex-1">
//                 <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
//                   From Date
//                 </label>
//                 <input
//                   type="date"
//                   value={dateFrom}
//                   onChange={(e) => setDateFrom(e.target.value)}
//                   className="w-full text-[11px] font-mono bg-slate-50/70 border border-slate-200/80 rounded-xl px-2 py-1.5 text-slate-700 outline-none focus:border-indigo-500"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
//                   To Date
//                 </label>
//                 <input
//                   type="date"
//                   value={dateTo}
//                   onChange={(e) => setDateTo(e.target.value)}
//                   className="w-full text-[11px] font-mono bg-slate-50/70 border border-slate-200/80 rounded-xl px-2 py-1.5 text-slate-700 outline-none focus:border-indigo-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {activeFilterCount > 0 && (
//             <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
//               <div className="flex flex-wrap items-center gap-1.5">
//                 <span className="text-[11px] font-semibold text-slate-400 mr-1">
//                   Active Filters:
//                 </span>
//                 {selectedVendors.map((v) => (
//                   <span
//                     key={v}
//                     className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1"
//                   >
//                     Vendor: {v.slice(0, 18)}
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setSelectedVendors((prev) =>
//                           prev.filter((item) => item !== v)
//                         )
//                       }
//                       className="font-bold hover:text-indigo-950"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}
//                 {selectedAccounts.map((a) => (
//                   <span
//                     key={a}
//                     className="bg-sky-50 text-sky-700 border border-sky-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1"
//                   >
//                     GL: {a}
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setSelectedAccounts((prev) =>
//                           prev.filter((item) => item !== a)
//                         )
//                       }
//                       className="font-bold hover:text-sky-950"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}
//                 {selectedStatuses.map((s) => (
//                   <span
//                     key={s}
//                     className="bg-teal-50 text-teal-700 border border-teal-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1"
//                   >
//                     Status: {s}
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setSelectedStatuses((prev) =>
//                           prev.filter((item) => item !== s)
//                         )
//                       }
//                       className="font-bold hover:text-teal-950"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}
//               </div>

//               <button
//                 type="button"
//                 onClick={resetAllFilters}
//                 className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/70 px-2.5 py-1 rounded-lg transition-colors"
//               >
//                 Reset All Filters
//               </button>
//             </div>
//           )}
//         </header>

//         {/* ====================================================================
//             MAIN WORKSPACE CONTENT
//         ==================================================================== */}
//         {isLoadingList ? (
//           <div className="h-80 bg-slate-50/50 rounded-2xl border border-slate-200/70 flex flex-col items-center justify-center gap-3">
//             <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//             <p className="text-xs font-medium text-slate-500">
//               Synchronizing live procurement telemetry from API...
//             </p>
//           </div>
//         ) : apiError ? (
//           <div className="bg-rose-50/50 p-10 rounded-2xl border border-rose-200 text-center space-y-3">
//             <div className="text-xs font-bold text-rose-700">
//               API Connection Error: {apiError}
//             </div>
//             <button
//               type="button"
//               onClick={fetchDashboardList}
//               className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs"
//             >
//               <Icons.Refresh className="w-3.5 h-3.5" />
//               <span>Retry API Connection</span>
//             </button>
//           </div>
//         ) : poList.length === 0 ? (
//           <div className="bg-slate-50/50 p-12 rounded-2xl border border-slate-200/70 text-center">
//             <p className="text-xs text-slate-500">
//               No Purchase Order records returned by{" "}
//               <code className="font-mono">
//                 /api/PrPoDashboard/GetDashboardV1
//               </code>
//               .
//             </p>
//           </div>
//         ) : activeWorkspace === "overview" ? (
//           /* ==================================================================
//               WORKSPACE 1: EXECUTIVE SUMMARY OVERVIEW
//           ================================================================== */
//           <div className="space-y-4">
//             {/* 5 Interactive Hover Pop-Up KPI Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
//               {/* Card 1: PR Requisitioned */}
//               <div className="group relative bg-gradient-to-b from-sky-50/70 to-white p-4 rounded-2xl border border-sky-200/70 border-t-4 border-t-sky-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg hover:border-sky-300 transition-all duration-300 ease-out cursor-pointer">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800">
//                     PR Requisitioned
//                   </span>
//                   <span className="bg-sky-100 text-sky-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
//                     Budget
//                   </span>
//                 </div>
//                 <div className="text-lg font-extrabold text-slate-900 font-mono mt-2">
//                   <AnimatedMetricValue value={overviewStats.pr} />
//                 </div>
//                 <div className="text-[11px] text-sky-700/80 font-medium mt-1">
//                   Across {filteredPOs.length} purchase orders
//                 </div>

//                 {/* Hover Pop-Up Telemetry Detail */}
//                 <div className="opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 absolute left-0 right-0 top-full mt-2 z-30 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-[11px] space-y-1">
//                   <div className="font-bold text-sky-300">
//                     Requisition Breakdown
//                   </div>
//                   <div className="flex justify-between font-mono">
//                     <span className="text-slate-400">Avg PR / Order:</span>
//                     <span>
//                       {formatCompact(
//                         filteredPOs.length > 0
//                           ? overviewStats.pr / filteredPOs.length
//                           : 0
//                       )}
//                     </span>
//                   </div>
//                   <div className="flex justify-between font-mono">
//                     <span className="text-slate-400">Active Vendors:</span>
//                     <span>{overviewStats.vendorBars.length}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Card 2: Committed PO Spend */}
//               <div className="group relative bg-gradient-to-b from-indigo-50/70 to-white p-4 rounded-2xl border border-indigo-200/70 border-t-4 border-t-indigo-600 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg hover:border-indigo-300 transition-all duration-300 ease-out cursor-pointer">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">
//                     Committed PO Spend
//                   </span>
//                   <span className="bg-indigo-100 text-indigo-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
//                     {overviewStats.utilizationPct}%
//                   </span>
//                 </div>
//                 <div className="text-lg font-extrabold text-slate-900 font-mono mt-2">
//                   <AnimatedMetricValue value={overviewStats.po} />
//                 </div>
//                 <div className="text-[11px] text-indigo-700/80 font-medium mt-1">
//                   {overviewStats.utilizationPct}% of PR budget utilized
//                 </div>

//                 <div className="opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 absolute left-0 right-0 top-full mt-2 z-30 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-[11px] space-y-1">
//                   <div className="font-bold text-indigo-300">
//                     Commitment Variance
//                   </div>
//                   <div className="flex justify-between font-mono">
//                     <span className="text-slate-400">PO vs PR Delta:</span>
//                     <span>
//                       {formatCompact(overviewStats.po - overviewStats.pr)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between font-mono">
//                     <span className="text-slate-400">GL Cost Pools:</span>
//                     <span>{overviewStats.accountBars.length}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Card 3: Invoiced Total */}
//               <div className="group relative bg-gradient-to-b from-amber-50/70 to-white p-4 rounded-2xl border border-amber-200/70 border-t-4 border-t-amber-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg hover:border-amber-300 transition-all duration-300 ease-out cursor-pointer">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
//                     Invoiced Total
//                   </span>
//                   <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
//                     {overviewStats.invCount} Invs
//                   </span>
//                 </div>
//                 <div className="text-lg font-extrabold text-slate-900 font-mono mt-2">
//                   <AnimatedMetricValue value={overviewStats.inv} />
//                 </div>
//                 <div className="text-[11px] text-amber-800/80 font-medium mt-1">
//                   {overviewStats.billedPct}% of PO value billed
//                 </div>

//                 <div className="opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 absolute left-0 right-0 top-full mt-2 z-30 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-[11px] space-y-1">
//                   <div className="font-bold text-amber-300">
//                     Billing Velocity
//                   </div>
//                   <div className="flex justify-between font-mono">
//                     <span className="text-slate-400">Avg GRN → Inv:</span>
//                     <span>{overviewStats.avgGrnToInv ?? "—"} days</span>
//                   </div>
//                   <div className="flex justify-between font-mono">
//                     <span className="text-slate-400">Unbilled PO:</span>
//                     <span>{formatCompact(overviewStats.unbilled)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Card 4: Paid / Settled */}
//               <div className="group relative bg-gradient-to-b from-teal-50/70 to-white p-4 rounded-2xl border border-teal-200/70 border-t-4 border-t-teal-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg hover:border-teal-300 transition-all duration-300 ease-out cursor-pointer">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900">
//                     Paid / Settled
//                   </span>
//                   <span className="bg-teal-100 text-teal-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
//                     {overviewStats.settlementPct}%
//                   </span>
//                 </div>
//                 <div className="text-lg font-extrabold text-slate-900 font-mono mt-2">
//                   <AnimatedMetricValue value={overviewStats.paid} />
//                 </div>
//                 <div className="text-[11px] text-teal-800/80 font-medium mt-1">
//                   {overviewStats.grnCount} GRNs received
//                 </div>

//                 <div className="opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 absolute left-0 right-0 top-full mt-2 z-30 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-[11px] space-y-1">
//                   <div className="font-bold text-teal-300">
//                     Settlement Telemetry
//                   </div>
//                   <div className="flex justify-between font-mono">
//                     <span className="text-slate-400">Unpaid on Billed:</span>
//                     <span>{formatCompact(overviewStats.unpaid)}</span>
//                   </div>
//                   <div className="flex justify-between font-mono">
//                     <span className="text-slate-400">Total Receipts:</span>
//                     <span>{overviewStats.grnCount} GRNs</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Card 5: Unbilled Balance */}
//               <div className="group relative bg-gradient-to-b from-violet-50/70 to-white p-4 rounded-2xl border border-violet-200/70 border-t-4 border-t-violet-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg hover:border-violet-300 transition-all duration-300 ease-out cursor-pointer">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[11px] font-bold uppercase tracking-wider text-violet-900">
//                     Unbilled Balance
//                   </span>
//                   <span className="bg-violet-100 text-violet-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
//                     {overviewStats.openPoCount} Open
//                   </span>
//                 </div>
//                 <div className="text-lg font-extrabold text-slate-900 font-mono mt-2">
//                   <AnimatedMetricValue value={overviewStats.unbilled} />
//                 </div>
//                 <div className="text-[11px] text-violet-800/80 font-medium mt-1">
//                   Avg cycle: {overviewStats.avgPoToGrn ?? "—"}d PO → GRN
//                 </div>

//                 <div className="opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 absolute left-0 right-0 top-full mt-2 z-30 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-[11px] space-y-1">
//                   <div className="font-bold text-violet-300">
//                     Open Liability Exposure
//                   </div>
//                   <div className="flex justify-between font-mono">
//                     <span className="text-slate-400">Open Status POs:</span>
//                     <span>{overviewStats.openPoCount} orders</span>
//                   </div>
//                   <div className="flex justify-between font-mono">
//                     <span className="text-slate-400">Avg Delivery Lead:</span>
//                     <span>{overviewStats.avgPoToGrn ?? "—"} days</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Primary Analytical Grid (No extra white gap) */}
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
//               {/* Left 7 Columns: Committed vs Settled Expenditure */}
//               <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-indigo-100/90 shadow-2xs space-y-3">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
//                       <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
//                         Committed vs. Settled Expenditure
//                       </h2>
//                     </div>
//                     {/* <p className="text-[11px] text-slate-500 mt-0.5">
//                       Click any bar to toggle multi-select filtering by{" "}
//                       {chartDimension === "vendor" ? "Vendor" : "GL Cost Pool"}
//                     </p> */}
//                   </div>

//                   <div className="flex items-center gap-2.5">
//                     <div className="hidden sm:flex items-center gap-3 text-[11px] font-medium text-slate-500">
//                       <span className="flex items-center gap-1">
//                         <i className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block" />
//                         Committed
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <i className="w-2.5 h-2.5 rounded-xs bg-teal-500 inline-block" />
//                         Paid
//                       </span>
//                     </div>

//                     <div className="inline-flex bg-indigo-50/80 p-0.5 rounded-xl border border-indigo-100 text-[11px] font-semibold">
//                       <button
//                         type="button"
//                         onClick={() => setChartDimension("vendor")}
//                         className={`px-3 py-1 rounded-lg transition-all ${
//                           chartDimension === "vendor"
//                             ? "bg-white text-indigo-700 shadow-2xs"
//                             : "text-slate-600"
//                         }`}
//                       >
//                         By Vendor
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setChartDimension("account")}
//                         className={`px-3 py-1 rounded-lg transition-all ${
//                           chartDimension === "account"
//                             ? "bg-white text-indigo-700 shadow-2xs"
//                             : "text-slate-600"
//                         }`}
//                       >
//                         By GL Account
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Compact Inline Context Strip (Eliminates Empty White Space & Adds Value) */}
//                 <div className="grid grid-cols-3 gap-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 text-xs">
//                   <div>
//                     <span className="text-[10px] uppercase font-bold text-slate-400 block">
//                       Top{" "}
//                       {chartDimension === "vendor" ? "Vendor" : "GL Account"}
//                     </span>
//                     <span className="font-semibold text-slate-800 truncate block">
//                       {(chartDimension === "vendor"
//                         ? overviewStats.vendorBars[0]?.label
//                         : overviewStats.accountBars[0]?.acctDesc) || "—"}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-[10px] uppercase font-bold text-slate-400 block">
//                       Top Concentration
//                     </span>
//                     <span className="font-mono font-bold text-indigo-700">
//                       {formatCompact(
//                         (chartDimension === "vendor"
//                           ? overviewStats.vendorBars[0]?.poTotal
//                           : overviewStats.accountBars[0]?.poTotal) || 0
//                       )}{" "}
//                       AED
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-[10px] uppercase font-bold text-slate-400 block">
//                       Active Dimension Count
//                     </span>
//                     <span className="font-mono font-bold text-teal-700">
//                       {chartDimension === "vendor"
//                         ? `${overviewStats.vendorBars.length} Vendors`
//                         : `${overviewStats.accountBars.length} GL Pools`}
//                     </span>
//                   </div>
//                 </div>

//                 <InteractiveSpendChart
//                   is3D={is3DEnabled}
//                   data={
//                     chartDimension === "vendor"
//                       ? overviewStats.vendorBars
//                       : overviewStats.accountBars
//                   }
//                   selectedKeys={
//                     chartDimension === "vendor"
//                       ? selectedVendors
//                       : selectedAccounts
//                   }
//                   onSelectKey={(key) => {
//                     if (chartDimension === "vendor") {
//                       toggleMultiFilterItem(setSelectedVendors, key);
//                     } else {
//                       toggleMultiFilterItem(setSelectedAccounts, key);
//                     }
//                   }}
//                 />
//               </div>

//               {/* Right 5 Columns: Redesigned Capital Conversion Pipeline & GL Cost Pool Share */}
//               <div className="lg:col-span-5 flex flex-col gap-4">
//                 <div className="bg-white p-5 rounded-2xl border border-sky-100/90 shadow-2xs">
//                   <div className="flex justify-between items-center mb-2.5">
//                     <div className="flex items-center gap-2">
//                       <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
//                       <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
//                         Capital Conversion Pipeline
//                       </h2>
//                     </div>
//                     <span className="text-[10px] font-mono font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/60">
//                       AED · Where the money is
//                     </span>
//                   </div>
//                   <FinancialPipeline3D
//                     is3D={is3DEnabled}
//                     prTotal={overviewStats.pr}
//                     poTotal={overviewStats.po}
//                     invTotal={overviewStats.inv}
//                     paidTotal={overviewStats.paid}
//                   />
//                 </div>

//                 <div className="bg-white p-5 rounded-2xl border border-violet-100/90 shadow-2xs">
//                   <div className="flex justify-between items-center mb-2.5">
//                     <div className="flex items-center gap-2">
//                       <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
//                       <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
//                         GL Cost Pool Share
//                       </h2>
//                     </div>
//                     {selectedAccounts.length > 0 && (
//                       <button
//                         type="button"
//                         onClick={() => setSelectedAccounts([])}
//                         className="text-[11px] text-indigo-600 font-semibold"
//                       >
//                         Clear GL ({selectedAccounts.length})
//                       </button>
//                     )}
//                   </div>
//                   <CostPool3DDonut
//                     is3D={is3DEnabled}
//                     accounts={overviewStats.accountBars}
//                     selectedAccounts={selectedAccounts}
//                     onSelectAccount={(acct) =>
//                       toggleMultiFilterItem(setSelectedAccounts, acct)
//                     }
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Collapsible PO Register (Hidden by Default) */}
//             <div className="bg-white rounded-2xl border border-indigo-100/90 shadow-2xs overflow-hidden">
//               <div
//                 onClick={() => setIsRegisterOpen((prev) => !prev)}
//                 className="px-5 py-4 bg-gradient-to-r from-indigo-50/60 via-white to-sky-50/50 flex items-center justify-between cursor-pointer hover:from-indigo-50/90 transition-colors"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
//                     <Icons.TableRegister className="w-4 h-4" />
//                   </div>
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
//                         Purchase Order Register
//                       </h2>
//                       <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
//                         {filteredPOs.length} Orders
//                       </span>
//                     </div>
//                     <p className="text-[11px] text-slate-500">
//                       {isRegisterOpen
//                         ? "Select any row to open the full 5-stage PO Inspector"
//                         : "Click to expand the Purchase Order Register table"}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-3 py-1.5 rounded-xl">
//                     {isRegisterOpen
//                       ? "Hide Purchase Orders"
//                       : "View Purchase Orders"}
//                   </span>
//                   <div
//                     className={`w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-transform duration-300 ${
//                       isRegisterOpen ? "rotate-180" : "rotate-0"
//                     }`}
//                   >
//                     <Icons.ChevronDown className="w-4 h-4" />
//                   </div>
//                 </div>
//               </div>

//               {isRegisterOpen && (
//                 <div className="border-t border-indigo-100/80">
//                   <div className="px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
//                     <div className="flex items-center gap-2">
//                       <span className="text-[11px] font-semibold text-slate-500">
//                         Sort By:
//                       </span>
//                       <select
//                         value={sortBy}
//                         onChange={(e) => setSortBy(e.target.value)}
//                         className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium"
//                       >
//                         <option value="po_desc">PO Number (Newest)</option>
//                         <option value="val_desc">
//                           Committed Spend (High → Low)
//                         </option>
//                         <option value="val_asc">
//                           Committed Spend (Low → High)
//                         </option>
//                         <option value="date_desc">Created Date</option>
//                       </select>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <span className="text-[11px] font-semibold text-slate-500">
//                         Rows:
//                       </span>
//                       <select
//                         value={pageSize}
//                         onChange={(e) => setPageSize(Number(e.target.value))}
//                         className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono"
//                       >
//                         <option value={15}>15</option>
//                         <option value={30}>30</option>
//                         <option value={50}>50</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse text-xs">
//                       <thead>
//                         <tr className="bg-indigo-50/40 text-slate-500 uppercase tracking-wider font-bold border-b border-indigo-100/70 text-[10px]">
//                           <th className="py-3 px-4">PO #</th>
//                           <th className="py-3 px-4">Vendor</th>
//                           <th className="py-3 px-4">PR & Scope</th>
//                           <th className="py-3 px-4">GL Cost Pool</th>
//                           <th className="py-3 px-4 text-center">GRNs / Invs</th>
//                           <th className="py-3 px-4 text-right">Committed PO</th>
//                           <th className="py-3 px-4 text-right">Settled</th>
//                           <th className="py-3 px-4 text-right w-12"></th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-100 text-slate-700">
//                         {paginatedPOs.map((po) => (
//                           <tr
//                             key={po.po}
//                             onClick={() => inspectPO(po.po)}
//                             className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
//                           >
//                             <td className="py-3 px-4 font-mono">
//                               <div className="font-bold text-indigo-950 group-hover:text-indigo-600">
//                                 #{po.po}
//                               </div>
//                               <div className="text-[10px] text-slate-400">
//                                 {po.date}
//                               </div>
//                             </td>
//                             <td className="py-3 px-4">
//                               <div className="font-semibold text-slate-800">
//                                 {po.vendor}
//                               </div>
//                               <div className="text-[10px] font-mono text-slate-400">
//                                 {po.vcode} {po.entity ? `· ${po.entity}` : ""}
//                               </div>
//                             </td>
//                             <td className="py-3 px-4 max-w-xs">
//                               <span className="bg-sky-50 text-sky-700 border border-sky-200/70 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md">
//                                 PR #{po.prs[0]?.no || "—"}
//                               </span>
//                               <div className="text-[11px] text-slate-500 truncate mt-1">
//                                 {po.desc.replace(/\r?\n|\r/g, " ")}
//                               </div>
//                             </td>
//                             <td className="py-3 px-4 font-mono text-[11px]">
//                               <div className="text-slate-800 font-medium">
//                                 {po.primaryAcctDesc}
//                               </div>
//                               <div className="text-indigo-600/80">
//                                 {po.primaryAcct}
//                               </div>
//                             </td>
//                             <td className="py-3 px-4 text-center font-mono text-[10px]">
//                               <span className="inline-block bg-teal-50 text-teal-700 border border-teal-200/60 px-2 py-0.5 rounded-md mr-1 font-semibold">
//                                 {po.grns.length} GRN
//                               </span>
//                               <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md font-semibold">
//                                 {po.invs.length} INV
//                               </span>
//                             </td>
//                             <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
//                               {formatAED(po.poTotal)}
//                             </td>
//                             <td className="py-3 px-4 text-right">
//                               <div className="flex items-center justify-end gap-2">
//                                 <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden">
//                                   <div
//                                     className="bg-teal-500 h-full rounded-full"
//                                     style={{ width: `${po.paidPct}%` }}
//                                   />
//                                 </div>
//                                 <span className="font-mono text-[11px] font-semibold text-slate-700">
//                                   {po.paidPct}%
//                                 </span>
//                               </div>
//                             </td>
//                             <td className="py-3 px-4 text-right">
//                               <button
//                                 type="button"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   inspectPO(po.po);
//                                 }}
//                                 className="w-7 h-7 rounded-lg bg-indigo-50/70 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white border border-indigo-200/60 inline-flex items-center justify-center transition-all"
//                               >
//                                 <Icons.ArrowUpRight className="w-3.5 h-3.5" />
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   {totalPages > 1 && (
//                     <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
//                       <span>
//                         Page{" "}
//                         <strong className="text-slate-900">{currentPage}</strong>{" "}
//                         of{" "}
//                         <strong className="text-slate-900">{totalPages}</strong>
//                       </span>
//                       <div className="flex items-center gap-1.5">
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setCurrentPage((p) => Math.max(1, p - 1))
//                           }
//                           disabled={currentPage === 1}
//                           className="px-3 py-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40 font-medium"
//                         >
//                           Previous
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setCurrentPage((p) => Math.min(totalPages, p + 1))
//                           }
//                           disabled={currentPage === totalPages}
//                           className="px-3 py-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40 font-medium"
//                         >
//                           Next
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           /* ==================================================================
//               WORKSPACE 2: PO INSPECTOR VIEW
//           ================================================================== */
//           currentRecord && (
//             <div className="space-y-4">
//               {/* Tinted Top Inspector Sub-Header */}
//               <div className="bg-gradient-to-r from-indigo-50/80 via-white to-teal-50/60 px-5 py-3.5 rounded-2xl border border-indigo-200/70 shadow-2xs flex flex-wrap items-center justify-between gap-3">
//                 <div className="flex flex-wrap items-center gap-2.5">
//                   <button
//                     type="button"
//                     onClick={() => setActiveWorkspace("overview")}
//                     className="inline-flex items-center gap-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs transition-colors"
//                   >
//                     <Icons.ArrowLeft className="w-3.5 h-3.5" />
//                     <span>Executive Overview</span>
//                   </button>
//                   <Icons.ChevronRight className="w-3.5 h-3.5 text-indigo-300" />
//                   <span className="bg-indigo-600 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
//                     PO #{currentRecord.po}
//                   </span>
//                   <span className="text-xs font-semibold text-slate-800 truncate max-w-md">
//                     {currentRecord.vendor}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   {isLoadingDetail && (
//                     <span className="text-[11px] text-indigo-600 font-medium animate-pulse">
//                       Syncing PO...
//                     </span>
//                   )}
//                   <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
//                     Status: {currentRecord.st}
//                   </span>
//                   <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
//                     Workflow: {currentRecord.wf}
//                   </span>
//                 </div>
//               </div>

//               {/* 5-Stage Color-Tinted Lifecycle Cards with Hover Pop-Up Effect */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
//                 <div className="bg-gradient-to-b from-sky-50/75 to-white p-4 rounded-2xl border border-sky-200/80 border-t-4 border-t-sky-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg transition-all duration-300">
//                   <div className="flex items-center justify-between">
//                     <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
//                       1 · PR Raised
//                     </span>
//                     <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold">
//                       ✓
//                     </span>
//                   </div>
//                   <div className="text-base font-extrabold font-mono text-slate-900 mt-2">
//                     {formatAED(currentRecord.prTotal)}
//                   </div>
//                   <div className="text-[11px] font-mono text-sky-700 font-medium mt-1">
//                     PR #{currentRecord.prs[0]?.no || "—"}
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-b from-indigo-50/75 to-white p-4 rounded-2xl border border-indigo-200/80 border-t-4 border-t-indigo-600 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg transition-all duration-300">
//                   <div className="flex items-center justify-between">
//                     <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
//                       2 · PO Approved
//                     </span>
//                     <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
//                       ✓
//                     </span>
//                   </div>
//                   <div className="text-base font-extrabold font-mono text-slate-900 mt-2">
//                     {formatAED(currentRecord.poTotal)}
//                   </div>
//                   <div className="text-[11px] font-mono text-indigo-700 font-medium mt-1">
//                     Issued {formatDisplayDate(currentRecord.date)}
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-b from-teal-50/75 to-white p-4 rounded-2xl border border-teal-200/80 border-t-4 border-t-teal-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg transition-all duration-300">
//                   <div className="flex items-center justify-between">
//                     <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
//                       3 · Goods Received
//                     </span>
//                     <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold">
//                       {currentRecord.grns.length}
//                     </span>
//                   </div>
//                   <div className="text-base font-extrabold font-mono text-slate-900 mt-2">
//                     {currentRecord.grns.length} GRNs
//                   </div>
//                   <div className="text-[11px] font-mono text-teal-700 font-medium mt-1">
//                     {currentRecord.poToGrnDays !== null
//                       ? `${currentRecord.poToGrnDays}d from PO`
//                       : "Pending GRN"}
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-b from-amber-50/75 to-white p-4 rounded-2xl border border-amber-200/80 border-t-4 border-t-amber-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg transition-all duration-300">
//                   <div className="flex items-center justify-between">
//                     <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
//                       4 · Invoiced
//                     </span>
//                     <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
//                       {currentRecord.invPct}%
//                     </span>
//                   </div>
//                   <div className="text-base font-extrabold font-mono text-slate-900 mt-2">
//                     {formatAED(currentRecord.invTotal)}
//                   </div>
//                   <div className="text-[11px] font-mono text-amber-800 font-medium mt-1">
//                     {currentRecord.invs.length} invoice(s) logged
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-b from-emerald-50/75 to-white p-4 rounded-2xl border border-emerald-200/80 border-t-4 border-t-emerald-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg transition-all duration-300">
//                   <div className="flex items-center justify-between">
//                     <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
//                       5 · Paid / Settled
//                     </span>
//                     <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
//                       {currentRecord.paidPct}%
//                     </span>
//                   </div>
//                   <div className="text-base font-extrabold font-mono text-slate-900 mt-2">
//                     {formatAED(currentRecord.paidTotal)}
//                   </div>
//                   <div className="text-[11px] font-mono text-emerald-800 font-medium mt-1">
//                     {currentRecord.paidOfInvPct}% of billed settled
//                   </div>
//                 </div>
//               </div>

//               {/* Scope Details + Cycle-Time KPIs + 3D Value Flow */}
//               <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
//                 <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-indigo-100/90 shadow-2xs flex flex-col justify-between">
//                   <div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200/60">
//                         Scope & Cycle-Time Telemetry
//                       </span>
//                       <span className="text-xs font-mono text-slate-400">
//                         {currentRecord.vcode} · {currentRecord.entity}
//                       </span>
//                     </div>

//                     <h3 className="text-base font-bold text-slate-900 mt-3">
//                       {currentRecord.vendor}
//                     </h3>

//                     <div className="mt-2.5 bg-gradient-to-r from-indigo-50/40 via-sky-50/30 to-white p-3.5 rounded-xl border border-indigo-100/80 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
//                       {currentRecord.desc || "No description provided"}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 mt-4 border-t border-slate-100 text-xs">
//                     <div className="bg-teal-50/50 p-2.5 rounded-xl border-l-4 border-l-teal-500 border border-teal-100 hover:-translate-y-0.5 transition-transform">
//                       <div className="text-lg font-extrabold font-mono text-slate-900">
//                         {currentRecord.poToGrnDays ?? "—"}
//                         <small className="text-[11px] font-normal text-slate-400 ml-0.5">
//                           d
//                         </small>
//                       </div>
//                       <span className="text-teal-800/80 block text-[10px] font-semibold">
//                         PO created → first GRN
//                       </span>
//                     </div>

//                     <div className="bg-indigo-50/50 p-2.5 rounded-xl border-l-4 border-l-indigo-500 border border-indigo-100 hover:-translate-y-0.5 transition-transform">
//                       <div className="text-lg font-extrabold font-mono text-slate-900">
//                         {currentRecord.poToInvDays ?? "—"}
//                         <small className="text-[11px] font-normal text-slate-400 ml-0.5">
//                           d
//                         </small>
//                       </div>
//                       <span className="text-indigo-800/80 block text-[10px] font-semibold">
//                         PO created → first invoice
//                       </span>
//                     </div>

//                     <div className="bg-amber-50/50 p-2.5 rounded-xl border-l-4 border-l-amber-500 border border-amber-100 hover:-translate-y-0.5 transition-transform">
//                       <div className="text-lg font-extrabold font-mono text-slate-900">
//                         {currentRecord.grnToInvDays ?? "—"}
//                         <small className="text-[11px] font-normal text-slate-400 ml-0.5">
//                           d
//                         </small>
//                       </div>
//                       <span className="text-amber-800/80 block text-[10px] font-semibold">
//                         Avg GRN → invoice upload
//                       </span>
//                     </div>

//                     <div className="bg-slate-50/90 p-2.5 rounded-xl border-l-4 border-l-slate-400 border border-slate-200/70 hover:-translate-y-0.5 transition-transform">
//                       <div className="text-lg font-extrabold font-mono text-slate-900">
//                         {currentRecord.daysSinceLastActivity ?? "—"}
//                         <small className="text-[11px] font-normal text-slate-400 ml-0.5">
//                           d
//                         </small>
//                       </div>
//                       <span className="text-slate-600 block text-[10px] font-semibold">
//                         Since last activity
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-sky-100/90 shadow-2xs">
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
//                       PO #{currentRecord.po} — Where the money is
//                     </h3>
//                     <span className="text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
//                       AED
//                     </span>
//                   </div>
//                   <FinancialPipeline3D
//                     is3D={is3DEnabled}
//                     prTotal={currentRecord.prTotal}
//                     poTotal={currentRecord.poTotal}
//                     invTotal={currentRecord.invTotal}
//                     paidTotal={currentRecord.paidTotal}
//                   />
//                 </div>
//               </div>

//               {/* 4-Tab Timeline Section (wrapped in an error boundary that resets per PO) */}
//               <TimelineErrorBoundary resetKey={currentRecord.po}>
//                 <DocumentTimelineSection record={currentRecord} />
//               </TimelineErrorBoundary>

//               {/* Color-Tinted Line Items Table */}
//               <div className="bg-white rounded-2xl border border-indigo-100/90 shadow-2xs overflow-hidden">
//                 <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-50/60 via-white to-sky-50/50 border-b border-indigo-100/80 flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
//                     <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
//                       Line Items ({currentRecord.lines.length})
//                     </h3>
//                   </div>
//                   <span className="text-[11px] font-mono font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/60">
//                     {currentRecord.invPct}% Billed
//                   </span>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="w-full text-left border-collapse text-xs">
//                     <thead>
//                       <tr className="bg-indigo-50/35 text-slate-500 uppercase text-[10px] font-bold border-b border-indigo-100/70">
//                         <th className="py-3 px-4">Item & GL Account</th>
//                         <th className="py-3 px-4 text-right">Qty</th>
//                         <th className="py-3 px-4 text-right">Unit Price</th>
//                         <th className="py-3 px-4 text-right">Line Value</th>
//                         <th className="py-3 px-4 text-right">Invoiced</th>
//                         <th className="py-3 px-4 text-right">Paid</th>
//                         <th className="py-3 px-4 text-right">Billed %</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100 text-slate-700">
//                       {currentRecord.lines.map((line, idx) => {
//                         const billedPct =
//                           line.cost > 0
//                             ? Math.round((line.inv / line.cost) * 100)
//                             : 0;
//                         return (
//                           <tr
//                             key={idx}
//                             className="hover:bg-indigo-50/25 transition-colors"
//                           >
//                             <td className="py-3.5 px-4">
//                               <div className="font-semibold text-slate-900">
//                                 {line.item}
//                               </div>
//                               <div className="inline-block mt-1 text-[10px] font-mono font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/60">
//                                 {line.acct} · {line.acctDesc}
//                               </div>
//                             </td>
//                             <td className="py-3.5 px-4 text-right font-mono font-medium">
//                               {Number(line.qty || 0).toLocaleString()}
//                             </td>
//                             <td className="py-3.5 px-4 text-right font-mono">
//                               {Number(line.up || 0).toFixed(2)}
//                             </td>
//                             <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
//                               {formatAED(line.cost)}
//                             </td>
//                             <td className="py-3.5 px-4 text-right font-mono font-semibold text-amber-700 bg-amber-50/25">
//                               {formatAED(line.inv)}
//                             </td>
//                             <td className="py-3.5 px-4 text-right font-mono font-bold text-teal-700 bg-teal-50/25">
//                               {formatAED(line.paid)}
//                             </td>
//                             <td className="py-3.5 px-4 text-right font-mono">
//                               <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-2 py-0.5 rounded-md font-bold text-[11px]">
//                                 {billedPct}%
//                               </span>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                     <tfoot>
//                       <tr className="bg-gradient-to-r from-indigo-50/70 via-slate-50 to-teal-50/50 font-bold text-slate-900 border-t border-indigo-100">
//                         <td colSpan="3" className="py-3.5 px-4">
//                           Total
//                         </td>
//                         <td className="py-3.5 px-4 text-right font-mono text-indigo-950">
//                           {formatAED(currentRecord.poTotal)}
//                         </td>
//                         <td className="py-3.5 px-4 text-right font-mono text-amber-800">
//                           {formatAED(currentRecord.invTotal)}
//                         </td>
//                         <td className="py-3.5 px-4 text-right font-mono text-teal-800">
//                           {formatAED(currentRecord.paidTotal)}
//                         </td>
//                         <td className="py-3.5 px-4 text-right font-mono text-emerald-800">
//                           {currentRecord.invPct}%
//                         </td>
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
//               </div>

//               {/* Goods Receipts & Vendor Invoices Document Lists */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-white p-5 rounded-2xl border border-teal-100/90 shadow-2xs">
//                   <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
//                     <div className="flex items-center gap-2">
//                       <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
//                       <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
//                         Goods Receipts (GRNs)
//                       </h3>
//                     </div>
//                     <span className="bg-teal-50 text-teal-700 border border-teal-200/60 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md">
//                       {currentRecord.grns.length}
//                     </span>
//                   </div>
//                   {currentRecord.grns.length === 0 ? (
//                     <p className="text-xs text-slate-400 italic py-2">
//                       No goods receipts recorded for this PO.
//                     </p>
//                   ) : (
//                     <ul className="divide-y divide-slate-100 text-xs max-h-56 overflow-y-auto pr-1">
//                       {currentRecord.grns.map((g, idx) => (
//                         <li
//                           key={`${g.no}-${idx}`}
//                           className="py-2 flex items-center justify-between gap-2"
//                         >
//                           <span className="font-mono font-bold text-teal-900">
//                             GRN #{g.no}
//                           </span>
//                           <span className="font-mono text-slate-500">
//                             {formatDisplayDate(g.cleanDate)}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>

//                 <div className="bg-white p-5 rounded-2xl border border-amber-100/90 shadow-2xs">
//                   <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
//                     <div className="flex items-center gap-2">
//                       <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
//                       <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
//                         Vendor Invoices
//                       </h3>
//                     </div>
//                     <span className="bg-amber-50 text-amber-800 border border-amber-200/60 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md">
//                       {currentRecord.invs.length}
//                     </span>
//                   </div>
//                   {currentRecord.invs.length === 0 ? (
//                     <p className="text-xs text-slate-400 italic py-2">
//                       No vendor invoices uploaded for this PO.
//                     </p>
//                   ) : (
//                     <ul className="divide-y divide-slate-100 text-xs max-h-56 overflow-y-auto pr-1">
//                       {currentRecord.invs.map((inv, idx) => (
//                         <li
//                           key={`${inv.no}-${idx}`}
//                           className="py-2 flex items-center justify-between gap-2"
//                         >
//                           <span className="font-mono font-bold text-amber-900">
//                             {inv.no}
//                           </span>
//                           <span className="font-mono text-slate-500">
//                             Uploaded {formatDisplayDate(inv.cleanDate)}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// }

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { backendUrl } from "./config";

// ============================================================================
// 1. ENTERPRISE VECTOR ICON SYSTEM
// ============================================================================
const Icons = {
  Dashboard: ({ className = "w-4 h-4" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  TableRegister: ({ className = "w-4 h-4" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
  Inspector: ({ className = "w-4 h-4" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  ArrowUpRight: ({ className = "w-4 h-4" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  ),
  ArrowLeft: ({ className = "w-4 h-4" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  ),
  ChevronDown: ({ className = "w-4 h-4" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  ChevronRight: ({ className = "w-4 h-4" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  Search: ({ className = "w-4 h-4" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  Check: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Refresh: ({ className = "w-4 h-4" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  ),
  Cube3D: ({ className = "w-4 h-4" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
};

// ============================================================================
// 2. ROBUST DATE NORMALIZATION & BUSINESS METRIC FORMULAS
// ============================================================================
const MONTH_NAMES = [
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

const parseCleanDate = (raw) => {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed || trimmed.toLowerCase() === "nan") return null;

  const isoMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const dmyMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const [, p1, p2, y] = dmyMatch;
    const n2 = parseInt(p2, 10);
    const d = n2 > 12 ? p2 : p1;
    const m = n2 > 12 ? p1 : p2;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  const myMatch = trimmed.match(/^(\d{1,2})[-/](\d{4})$/);
  if (myMatch) {
    const [, m, y] = myMatch;
    return `${y}-${m.padStart(2, "0")}-01`;
  }

  const ymMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})$/);
  if (ymMatch) {
    const [, y, m] = ymMatch;
    return `${y}-${m.padStart(2, "0")}-01`;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return null;
};

const toTimestamp = (cleanDate) => {
  if (!cleanDate || cleanDate === "N/A") return null;
  const [y, m, d] = cleanDate.split("-").map(Number);
  if (!y || !m || !d) return null;
  return Date.UTC(y, m - 1, d);
};

const formatDisplayDate = (cleanDate) => {
  if (!cleanDate || cleanDate === "N/A") return "N/A";
  const parts = cleanDate.split("-");
  if (parts.length !== 3) return cleanDate;
  const [y, m, d] = parts;
  const mIdx = parseInt(m, 10) - 1;
  if (Number.isNaN(mIdx) || mIdx < 0 || mIdx > 11) return cleanDate;
  return `${d} ${MONTH_NAMES[mIdx]} ${y}`;
};

const formatShortMonthYear = (year, monthZeroIndexed) =>
  `${MONTH_NAMES[monthZeroIndexed]} '${String(year).slice(-2)}`;

const daysBetween = (startRaw, endRaw) => {
  const c1 = parseCleanDate(startRaw);
  const c2 = parseCleanDate(endRaw);
  const t1 = toTimestamp(c1);
  const t2 = toTimestamp(c2);
  if (t1 === null || t2 === null) return null;
  return Math.round((t2 - t1) / 86400000);
};

const formatAED = (val) =>
  `AED ${Number(val || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatCompact = (val) => {
  const n = Number(val || 0);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toFixed(0);
};

const enrichRecord = (item) => {
  if (!item || typeof item !== "object") return null;
  // FIX: ignore null / non-object entries so a single bad row can't throw
  const onlyObjects = (arr) =>
    (Array.isArray(arr) ? arr : []).filter((x) => x && typeof x === "object");
  const lines = onlyObjects(item.lines);
  const prs = onlyObjects(item.prs);

  // The dashboard API can return multiple document numbers and dates inside
  // one comma-separated string. Expand those into individual documents before
  // creating timeline events or receipt/invoice rows.
  const expandDocumentEntries = (entries) =>
    onlyObjects(entries).flatMap((entry) => {
      const splitValues = (value) =>
        String(value ?? "")
          .split(",")
          .map((part) => part.trim());

      const numbers = splitValues(entry.no).filter(Boolean);
      const dates = splitValues(entry.date);
      const count = Math.max(numbers.length, dates.filter(Boolean).length);

      return Array.from({ length: count }, (_, index) => {
        const no = numbers[index] || "";
        const rawDate = dates[index] || "";
        const cleanDate = parseCleanDate(rawDate);
        return {
          ...entry,
          no,
          date: rawDate,
          cleanDate,
          ts: toTimestamp(cleanDate) ?? Number.MAX_SAFE_INTEGER,
          sourceIndex: index,
        };
      }).filter((doc) => doc.no || doc.cleanDate);
    });

  const grns = expandDocumentEntries(item.grns).sort(
    (a, b) =>
      a.ts - b.ts || a.sourceIndex - b.sourceIndex || a.no.localeCompare(b.no),
  );

  const invs = expandDocumentEntries(item.invs).sort(
    (a, b) =>
      a.ts - b.ts || a.sourceIndex - b.sourceIndex || a.no.localeCompare(b.no),
  );

  const prTotal = prs.reduce((sum, p) => sum + (Number(p.value) || 0), 0);
  const poTotal = lines.reduce((sum, l) => sum + (Number(l.cost) || 0), 0);
  const invTotal = lines.reduce((sum, l) => sum + (Number(l.inv) || 0), 0);
  const paidTotal = lines.reduce((sum, l) => sum + (Number(l.paid) || 0), 0);
  const remainingUnbilled = Math.max(0, poTotal - invTotal);
  const remainingUnpaid = Math.max(0, invTotal - paidTotal);

  const cleanPoDate = parseCleanDate(item.date);
  const firstGrnDate = grns[0]?.cleanDate || null;
  const firstInvDate = invs[0]?.cleanDate || null;

  const allValidDates = [
    cleanPoDate,
    ...grns.map((g) => g.cleanDate),
    ...invs.map((i) => i.cleanDate),
  ]
    .filter(Boolean)
    .sort();

  const lastActivityDate =
    allValidDates.length > 0
      ? allValidDates[allValidDates.length - 1]
      : cleanPoDate;

  const todayIso = new Date().toISOString().slice(0, 10);
  const daysSinceLastActivity = lastActivityDate
    ? Math.max(0, daysBetween(lastActivityDate, todayIso) ?? 0)
    : null;

  let pairDiffSum = 0;
  let pairDiffCount = 0;
  const pairLen = Math.min(grns.length, invs.length);
  for (let idx = 0; idx < pairLen; idx += 1) {
    const d = daysBetween(grns[idx].cleanDate, invs[idx].cleanDate);
    if (d !== null) {
      pairDiffSum += d;
      pairDiffCount += 1;
    }
  }

  return {
    ...item,
    po: String(item.po ?? ""),
    date: cleanPoDate || "N/A",
    poTs: toTimestamp(cleanPoDate),
    vendor: (item.vendor || "Unassigned Vendor").trim(),
    vcode: (item.vcode || "").trim(),
    entity: (item.entity || "").trim(),
    wf: (item.wf || "Pending").trim(),
    st: (item.st || "Open").trim(),
    desc: prs[0]?.desc || item.desc || "",
    primaryAcct: lines[0]?.acct || "N/A",
    primaryAcctDesc: lines[0]?.acctDesc || "General",
    lines,
    prs,
    grns,
    invs,
    prTotal,
    poTotal,
    invTotal,
    paidTotal,
    remainingUnbilled,
    remainingUnpaid,
    invPct: poTotal > 0 ? Math.round((invTotal / poTotal) * 100) : 0,
    paidPct: poTotal > 0 ? Math.round((paidTotal / poTotal) * 100) : 0,
    paidOfInvPct: invTotal > 0 ? Math.round((paidTotal / invTotal) * 100) : 0,
    poToGrnDays:
      firstGrnDate && cleanPoDate
        ? daysBetween(cleanPoDate, firstGrnDate)
        : null,
    poToInvDays:
      firstInvDate && cleanPoDate
        ? daysBetween(cleanPoDate, firstInvDate)
        : null,
    grnToInvDays:
      pairDiffCount > 0
        ? Math.round(pairDiffSum / pairDiffCount)
        : firstGrnDate && firstInvDate
          ? daysBetween(firstGrnDate, firstInvDate)
          : null,
    lastActivityDate,
    daysSinceLastActivity,
  };
};

// ============================================================================
// 3. SEARCHABLE MULTI-SELECT & SINGLE-SELECT DROPDOWNS
// ============================================================================
function SearchableMultiSelect({
  label,
  placeholder = "All Selected",
  options = [],
  selectedValues = [],
  onChange,
  accent = "indigo",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredOptions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        String(o.value).toLowerCase().includes(q) ||
        (o.subLabel && o.subLabel.toLowerCase().includes(q)),
    );
  }, [options, query]);

  const toggleOption = (val) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const selectAllFiltered = () => {
    const merged = Array.from(
      new Set([...selectedValues, ...filteredOptions.map((o) => o.value)]),
    );
    onChange(merged);
  };

  const clearAll = () => {
    onChange([]);
    setQuery("");
  };

  const accentBadgeMap = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    sky: "bg-sky-50 text-sky-700 border-sky-200/80",
    teal: "bg-teal-50 text-teal-700 border-teal-200/80",
    amber: "bg-amber-50 text-amber-700 border-amber-200/80",
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-[10px] font-bold  tracking-wider text-slate-500 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 text-xs rounded-xl px-3 py-2 border transition-all text-left ${
          selectedValues.length > 0
            ? "bg-indigo-50/40 border-indigo-200 text-slate-900 font-semibold"
            : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100/60"
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {selectedValues.length === 0 ? (
            <span className="text-slate-500 truncate">{placeholder}</span>
          ) : selectedValues.length === 1 ? (
            <span className="truncate">
              {options.find((o) => o.value === selectedValues[0])?.label ||
                selectedValues[0]}
            </span>
          ) : (
            <span className="truncate">{selectedValues.length} selected</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedValues.length > 0 && (
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md border ${
                accentBadgeMap[accent] || accentBadgeMap.indigo
              }`}
            >
              {selectedValues.length}
            </span>
          )}
          <Icons.ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 sm:w-72 mt-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-2.5 space-y-2">
          <div className="relative">
            <Icons.Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label || "options"}...`}
              autoFocus
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-1.5 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-between px-1 text-[11px]">
            <button
              type="button"
              onClick={selectAllFiltered}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Select All ({filteredOptions.length})
            </button>
            {selectedValues.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-rose-600 hover:text-rose-700 font-semibold"
              >
                Clear ({selectedValues.length})
              </button>
            )}
          </div>

          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100/70 pr-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isChecked = selectedValues.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => toggleOption(opt.value)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer transition-colors text-xs ${
                      isChecked
                        ? "bg-indigo-50/70 text-indigo-950 font-semibold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-white border-slate-300"
                      }`}
                    >
                      {isChecked && <Icons.Check className="w-3 h-3" />}
                    </div>
                    <div className="truncate flex-1">
                      <div className="truncate">{opt.label}</div>
                      {opt.subLabel && (
                        <div className="text-[10px] font-mono text-slate-400 truncate">
                          {opt.subLabel}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-[11px] text-slate-400">
                No matching options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchablePOPicker({ poList, activePO, onSelectPO }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pickerRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return poList.slice(0, 100);
    return poList
      .filter(
        (p) =>
          p.po.toLowerCase().includes(q) ||
          p.vendor.toLowerCase().includes(q) ||
          (p.prs[0]?.no && String(p.prs[0].no).toLowerCase().includes(q)) ||
          p.primaryAcct.toLowerCase().includes(q),
      )
      .slice(0, 100);
  }, [poList, query]);

  const activeObj = poList.find((p) => p.po === activePO);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl px-3.5 py-2 shadow-2xs transition-colors min-w-[200px]"
      >
        <span className="truncate">
          {activeObj
            ? `PO #${activeObj.po} · ${activeObj.vendor.slice(0, 16)}`
            : "Search & Inspect PO..."}
        </span>
        <Icons.ChevronDown className="w-3.5 h-3.5 text-indigo-200 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2.5 space-y-2">
          <div className="relative">
            <Icons.Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type PO #, PR #, Vendor, or GL..."
              autoFocus
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-1.5 outline-none focus:border-indigo-500 focus:bg-white text-slate-800"
            />
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <div
                  key={p.po}
                  onClick={() => {
                    onSelectPO(p.po);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className={`p-2 rounded-xl cursor-pointer transition-colors text-xs ${
                    activePO === p.po
                      ? "bg-indigo-50 text-indigo-950 font-semibold"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-700">
                      PO #{p.po}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {p.date}
                    </span>
                  </div>
                  <div className="text-slate-800 truncate mt-0.5">
                    {p.vendor}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    PR #{p.prs[0]?.no || "—"} · {p.primaryAcctDesc}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-5 text-center text-xs text-slate-400">
                No matching PO found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 4. SMOOTH ANIMATED METRIC COUNTER
// ============================================================================
function AnimatedMetricValue({ value, formatter = formatAED, duration = 380 }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousRef = useRef(value);

  useEffect(() => {
    const startValue = Number(previousRef.current) || 0;
    const endValue = Number(value) || 0;
    if (Math.abs(endValue - startValue) < 0.01) {
      setDisplayValue(endValue);
      return;
    }

    let rafId;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + (endValue - startValue) * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
        previousRef.current = endValue;
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);

  return <span>{formatter(displayValue)}</span>;
}

// ============================================================================
// 5. EXACT 4-TAB TIMELINE ENGINE (FIXED FOR SAME-DATE & DENSE MULTI-RECORDS)
// ============================================================================

// FIX: Error boundary so any render-time exception inside the timeline can no
// longer take the whole section down silently. It resets whenever the PO changes.
class TimelineErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: (error && error.message) || "Unknown timeline error",
    };
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, message: "" });
    }
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error("Timeline render failed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-200 text-center space-y-2">
          <div className="text-xs font-bold text-rose-700">
            The timeline could not be rendered for this PO.
          </div>
          <div className="text-[11px] font-mono text-rose-600/80">
            {this.state.message}
          </div>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const DocumentTimelineSection = React.memo(function DocumentTimelineSection({
  record,
}) {
  const [tlView, setTlView] = useState("lanes"); // "lanes" | "feed" | "month" | "pairs"
  const [hoveredNode, setHoveredNode] = useState(null);

  const timelineData = useMemo(() => {
    if (!record) return null;

    const rawEvents = [];

    if (record.date && record.date !== "N/A" && record.poTs !== null) {
      const prNos = (record.prs || [])
        .map((p) => p.no)
        .filter((n) => n && String(n).toLowerCase() !== "nan");
      rawEvents.push({
        id: `po-${record.po}`,
        type: "po",
        laneIndex: 0,
        title: `PO ${record.po} created`,
        shortLabel: `PO ${record.po}`,
        docNo: record.po,
        date: record.date,
        ts: record.poTs,
        sub: `${formatAED(record.poTotal)}${
          prNos.length > 0 ? ` · PR ${prNos.join(", ")}` : ""
        } · ${record.wf}`,
        color: "#4f46e5",
        dotClass: "bg-indigo-600",
        pillClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
      });
    }

    (record.grns || []).forEach((g, idx) => {
      if (!g.cleanDate || g.ts === Number.MAX_SAFE_INTEGER) return;
      const diffFromPo =
        record.date !== "N/A" ? daysBetween(record.date, g.cleanDate) : null;
      const relPoText =
        diffFromPo === null
          ? ""
          : diffFromPo > 0
            ? `${diffFromPo}d after PO`
            : diffFromPo < 0
              ? `${Math.abs(diffFromPo)}d before PO`
              : "same day as PO";

      rawEvents.push({
        id: `grn-${g.no}-${idx}`,
        type: "grn",
        laneIndex: 1,
        grnIndex: idx,
        title: `GRN ${g.no}`,
        shortLabel: `GRN ${g.no}`,
        docNo: String(g.no || ""),
        date: g.cleanDate,
        ts: g.ts,
        diffFromPo,
        sub: `Goods receipt #${idx + 1} of ${record.grns.length}${
          relPoText ? ` · ${relPoText}` : ""
        }`,
        color: "#0d9488",
        dotClass: "bg-teal-600",
        pillClass: "bg-teal-50 text-teal-700 border-teal-200",
      });
    });

    (record.invs || []).forEach((inv, idx) => {
      if (!inv.cleanDate || inv.ts === Number.MAX_SAFE_INTEGER) return;
      const diffFromPo =
        record.date !== "N/A" ? daysBetween(record.date, inv.cleanDate) : null;
      const pairedGrn = record.grns?.[idx] || null;
      const diffFromGrn = pairedGrn?.cleanDate
        ? daysBetween(pairedGrn.cleanDate, inv.cleanDate)
        : null;

      const relParts = [`Invoice #${idx + 1} of ${record.invs.length}`];
      if (diffFromPo !== null) {
        relParts.push(
          diffFromPo >= 0
            ? `${diffFromPo}d after PO`
            : `${Math.abs(diffFromPo)}d before PO`,
        );
      }
      if (pairedGrn && diffFromGrn !== null) {
        relParts.push(
          diffFromGrn >= 0
            ? `${diffFromGrn}d after GRN ${pairedGrn.no}`
            : `${Math.abs(diffFromGrn)}d before GRN ${pairedGrn.no}`,
        );
      }

      rawEvents.push({
        id: `inv-${inv.no}-${idx}`,
        type: "inv",
        laneIndex: 2,
        invIndex: idx,
        title: `Invoice ${inv.no}`,
        shortLabel: String(inv.no || ""),
        docNo: String(inv.no || ""),
        date: inv.cleanDate,
        ts: inv.ts,
        diffFromPo,
        diffFromGrn,
        sub: relParts.join(" · "),
        color: "#d97706",
        dotClass: "bg-amber-500",
        pillClass: "bg-amber-50 text-amber-800 border-amber-200",
      });
    });

    // Strict Chronological Sort by Timestamp across all document types
    const typePriority = { po: 1, grn: 2, inv: 3 };
    const events = [...rawEvents].sort((a, b) => {
      if (a.ts !== b.ts) return a.ts - b.ts;
      return (typePriority[a.type] || 9) - (typePriority[b.type] || 9);
    });

    const todayIso = new Date().toISOString().slice(0, 10);
    const todayTs = toTimestamp(todayIso);

    const allTs = events.map((e) => e.ts);
    const minEventTs = allTs.length > 0 ? Math.min(...allTs) : todayTs;
    const maxEventTs = allTs.length > 0 ? Math.max(...allTs) : todayTs;

    const minDateObj = new Date(minEventTs);
    const maxDateObj = new Date(maxEventTs);

    const startMonthDate = new Date(
      Date.UTC(minDateObj.getUTCFullYear(), minDateObj.getUTCMonth(), 1),
    );
    const endMonthDate = new Date(
      Date.UTC(maxDateObj.getUTCFullYear(), maxDateObj.getUTCMonth() + 1, 0),
    );

    // When all events occur in a single day or narrow window, pad domain so nodes sit cleanly inside the track
    const rawSpanMs = endMonthDate.getTime() - startMonthDate.getTime();
    const domainStartMs = startMonthDate.getTime();
    const domainEndMs = Math.max(
      endMonthDate.getTime(),
      domainStartMs + 28 * 86400000,
    );
    const domainSpanMs = Math.max(28 * 86400000, rawSpanMs);

    // FIX: always returns a finite number so SVG coordinates can never become NaN
    const xOfTs = (ts) => {
      if (!Number.isFinite(ts)) return 145;
      if (maxEventTs === minEventTs && events.length > 0 && ts === minEventTs) {
        return 480; // Center perfectly if every single event in the PO shares the exact same timestamp
      }
      const ratio = Math.max(
        0,
        Math.min(1, (ts - domainStartMs) / domainSpanMs),
      );
      const x = 145 + ratio * 695;
      return Number.isFinite(x) ? x : 145;
    };

    const months = [];
    const cursor = new Date(
      Date.UTC(
        startMonthDate.getUTCFullYear(),
        startMonthDate.getUTCMonth(),
        1,
      ),
    );
    let safety = 0;
    while (cursor.getTime() <= endMonthDate.getTime() && safety < 60) {
      const y = cursor.getUTCFullYear();
      const m = cursor.getUTCMonth();
      const ymKey = `${y}-${String(m + 1).padStart(2, "0")}`;
      const mEvents = events.filter((ev) => ev.date.startsWith(ymKey));
      const tickX =
        maxEventTs === minEventTs
          ? 145 + (safety / Math.max(1, 1)) * 695
          : 145 +
            Math.max(
              0,
              Math.min(1, (cursor.getTime() - domainStartMs) / domainSpanMs),
            ) *
              695;

      months.push({
        key: ymKey,
        label: formatShortMonthYear(y, m),
        fullLabel: `${MONTH_NAMES[m]} ${y}`,
        events: mEvents,
        tickX: Number.isFinite(tickX) ? tickX : 145,
      });

      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
      safety += 1;
    }

    // Proximity-Aware Lane Clustering: merges same-date OR ultra-close (< 18px) events in the same lane
    // so circles and text never collide on dense bursts of GRNs/Invoices.
    const buildLaneClusters = (laneType) => {
      const laneEvents = events.filter((e) => e.type === laneType);
      const rawByDate = new Map();
      laneEvents.forEach((ev) => {
        if (!rawByDate.has(ev.date)) {
          rawByDate.set(ev.date, []);
        }
        rawByDate.get(ev.date).push(ev);
      });

      const dateGroups = Array.from(rawByDate.entries())
        .map(([date, list]) => ({
          date,
          endDate: date,
          ts: list[0].ts,
          x: xOfTs(list[0].ts),
          items: list,
        }))
        .sort((a, b) => a.x - b.x);

      // Merge nearby date groups while keeping the cluster position weighted
      // by the number of events already in each group.
      const mergedClusters = [];
      dateGroups.forEach((grp) => {
        const prev = mergedClusters[mergedClusters.length - 1];
        if (prev && Math.abs(grp.x - prev.x) < 24) {
          const previousCount = prev.items.length;
          const incomingCount = grp.items.length;
          const totalCount = previousCount + incomingCount;
          prev.x =
            (prev.x * previousCount + grp.x * incomingCount) / totalCount;
          prev.items.push(...grp.items);
          if (grp.date > prev.endDate) prev.endDate = grp.date;
          prev.ts = Math.min(prev.ts, grp.ts);
        } else {
          mergedClusters.push({ ...grp, items: [...grp.items] });
        }
      });

      // Format cluster metadata and assign 4-level stagger + horizontal anchor nudging
      let lastX = -999;
      let staggerStep = 0;

      return mergedClusters.map((cl, idx) => {
        const count = cl.items.length;
        const firstDoc = String(cl.items[0]?.docNo || "");
        const shortDoc =
          firstDoc.length > 12 ? `${firstDoc.slice(0, 10)}…` : firstDoc;

        if (cl.x - lastX < 88) {
          staggerStep = (staggerStep + 1) % 4;
        } else {
          staggerStep = 0;
        }
        lastX = cl.x;

        const dateRangeLabel =
          cl.date === cl.endDate
            ? formatDisplayDate(cl.date)
            : `${formatDisplayDate(cl.date)} → ${formatDisplayDate(cl.endDate)}`;

        return {
          ...cl,
          clusterId: `${laneType}-cl-${idx}-${cl.date}`,
          count,
          dateRangeLabel,
          stagger: staggerStep,
          primaryLabel: count === 1 ? shortDoc : `${shortDoc} +${count - 1}`,
        };
      });
    };

    const poClusters = buildLaneClusters("po");
    const grnClusters = buildLaneClusters("grn");
    const invClusters = buildLaneClusters("inv");

    // Helper to find the cluster X coordinate for a given timestamp
    const findClusterX = (clusters, ts) => {
      if (!ts || clusters.length === 0) return null;
      const match = clusters.find((cl) =>
        cl.items.some((item) => item.ts === ts),
      );
      return match ? match.x : xOfTs(ts);
    };

    const maxPairs = Math.max(record.grns.length, record.invs.length);
    const pairs = [];
    for (let i = 0; i < maxPairs; i += 1) {
      const g = record.grns[i] || null;
      const inv = record.invs[i] || null;
      const lagDays =
        g?.cleanDate && inv?.cleanDate
          ? daysBetween(g.cleanDate, inv.cleanDate)
          : null;
      const poToGrn =
        g?.cleanDate && record.date !== "N/A"
          ? daysBetween(record.date, g.cleanDate)
          : null;

      const rawGrnX =
        g?.ts && g.ts !== Number.MAX_SAFE_INTEGER ? xOfTs(g.ts) : null;
      const rawInvX =
        inv?.ts && inv.ts !== Number.MAX_SAFE_INTEGER ? xOfTs(inv.ts) : null;

      pairs.push({
        index: i + 1,
        grn: g,
        inv,
        grnX: rawGrnX,
        invX: rawInvX,
        laneGrnX:
          g?.ts && g.ts !== Number.MAX_SAFE_INTEGER
            ? findClusterX(grnClusters, g.ts)
            : null,
        laneInvX:
          inv?.ts && inv.ts !== Number.MAX_SAFE_INTEGER
            ? findClusterX(invClusters, inv.ts)
            : null,
        lagDays,
        poToGrn,
      });
    }

    // Deduplicated Bezier links between GRN clusters and Invoice clusters
    const uniqueBezierMap = new Map();
    pairs.forEach((p) => {
      if (p.laneGrnX !== null && p.laneInvX !== null) {
        const key = `${Math.round(p.laneGrnX)}-${Math.round(p.laneInvX)}`;
        if (!uniqueBezierMap.has(key)) {
          uniqueBezierMap.set(key, {
            key,
            x1: p.laneGrnX,
            x2: p.laneInvX,
            count: 1,
          });
        } else {
          uniqueBezierMap.get(key).count += 1;
        }
      }
    });
    const uniqueBeziers = Array.from(uniqueBezierMap.values());

    const maxPairLag = Math.max(
      ...pairs.map((p) => (p.lagDays !== null ? Math.abs(p.lagDays) : 0)),
      1,
    );

    return {
      events,
      months,
      poClusters,
      grnClusters,
      invClusters,
      pairs,
      uniqueBeziers,
      maxPairLag,
      todayX:
        todayTs >= domainStartMs && todayTs <= domainEndMs
          ? xOfTs(todayTs)
          : null,
      totalDaysSpan: Math.max(
        1,
        Math.round((maxEventTs - minEventTs) / 86400000),
      ),
    };
  }, [record]);

  // Hook MUST be called unconditionally before early return to prevent React Hook violation crashes
  const visibleTickMonths = useMemo(() => {
    const months = timelineData?.months || [];
    if (months.length <= 9) return months;
    const step = Math.ceil(months.length / 8);
    return months.filter(
      (_, idx) => idx % step === 0 || idx === months.length - 1,
    );
  }, [timelineData]);

  if (!record || !timelineData) return null;

  const {
    events,
    months,
    poClusters,
    grnClusters,
    invClusters,
    pairs,
    uniqueBeziers,
    maxPairLag,
    todayX,
    totalDaysSpan,
  } = timelineData;

  const quietMonthsCount = months.filter((m) => m.events.length === 0).length;

  // Dynamic height for Receipt -> Invoice SVG Pair Canvas
  const pairSvgHeight = Math.max(165, 54 + Math.max(1, pairs.length) * 52 + 32);

  return (
    <div className="bg-white p-5 rounded-2xl border border-indigo-100/90 shadow-2xs space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Timeline</h2>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
              {events.length} milestones · {totalDaysSpan}d span
            </span>
          </div>
          {/* <p className="text-[11px] text-slate-500 mt-0.5">
            Chronologically interleaved across PO creation, goods receipts, and
            vendor invoices
          </p> */}
        </div>

        {/* 4 Segmented Sub-Tabs */}
        <div
          className="inline-flex flex-wrap bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 text-xs font-semibold"
          role="group"
          aria-label="Timeline view"
        >
          {[
            { id: "lanes", label: "Swimlane" },
            { id: "feed", label: "Activity feed" },
            { id: "month", label: "Month by month" },
            { id: "pairs", label: "Receipt → invoice" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTlView(tab.id)}
              aria-pressed={tlView === tab.id}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                tlView === tab.id
                  ? "bg-white text-indigo-700 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <i className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block" />
            <span>PO</span>
          </span>
          <span className="flex items-center gap-1.5">
            <i className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
            <span>GRN ({record.grns.length})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <i className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Invoice ({record.invs.length})</span>
          </span>
        </div>
      </div>

      {/* ====================================================================
          SUB-TAB 1: SWIMLANE ("lanes")
      ==================================================================== */}
      {tlView === "lanes" && (
        <div className="space-y-2.5">
          <div className="bg-gradient-to-b from-slate-50/60 via-white to-indigo-50/20 p-4 rounded-xl border border-slate-200/80 overflow-x-auto">
            <svg
              viewBox="0 0 920 240"
              className="w-full min-w-[700px] select-none"
            >
              {visibleTickMonths.map((m) => (
                <g key={m.key}>
                  <line
                    x1={m.tickX}
                    y1="20"
                    x2={m.tickX}
                    y2="205"
                    stroke="#e2e8f0"
                    strokeDasharray="2 3"
                  />
                  <text
                    x={m.tickX}
                    y="224"
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-slate-400"
                  >
                    {m.label}
                  </text>
                </g>
              ))}

              {[
                { label: "PO", sub: "1 order", y: 46, color: "#4f46e5" },
                {
                  label: "GRN",
                  sub: `${record.grns.length} receipt${
                    record.grns.length === 1 ? "" : "s"
                  }`,
                  y: 112,
                  color: "#0d9488",
                },
                {
                  label: "Invoice",
                  sub: `${record.invs.length} billed`,
                  y: 178,
                  color: "#d97706",
                },
              ].map((lane) => (
                <g key={lane.label}>
                  <line
                    x1="120"
                    y1={lane.y}
                    x2="880"
                    y2={lane.y}
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                  />
                  <text
                    x="14"
                    y={lane.y - 2}
                    fill={lane.color}
                    className="text-[11px] font-bold"
                  >
                    {lane.label}
                  </text>
                  <text
                    x="14"
                    y={lane.y + 11}
                    className="text-[9.5px] font-mono fill-slate-400"
                  >
                    {lane.sub}
                  </text>
                </g>
              ))}

              {todayX !== null && (
                <g>
                  <line
                    x1={todayX}
                    y1="18"
                    x2={todayX}
                    y2="205"
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                    strokeDasharray="4 3"
                  />
                  <text
                    x={todayX}
                    y="13"
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-slate-400"
                  >
                    Today
                  </text>
                </g>
              )}

              {/* PO -> First GRN Connector */}
              {poClusters[0] && grnClusters[0] && (
                <path
                  d={`M ${poClusters[0].x} 46 C ${poClusters[0].x} 79, ${grnClusters[0].x} 79, ${grnClusters[0].x} 112`}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1.3"
                  strokeDasharray="3 3"
                />
              )}

              {/* Deduplicated GRN Cluster -> Invoice Cluster Bezier Connectors */}
              {uniqueBeziers.map((bz) => (
                <path
                  key={`bezier-${bz.key}`}
                  d={`M ${bz.x1} 112 C ${bz.x1} 145, ${bz.x2} 145, ${bz.x2} 178`}
                  fill="none"
                  stroke="#5eead4"
                  strokeWidth={bz.count > 1 ? "2.4" : "1.6"}
                  opacity={bz.count > 1 ? "0.9" : "0.75"}
                />
              ))}

              {/* PO Lane Nodes */}
              {poClusters.map((cl) => (
                <g
                  key={cl.clusterId}
                  className="cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredNode({
                      badge: "PO",
                      title: `PO #${record.po}`,
                      date: cl.dateRangeLabel,
                      info: formatAED(record.poTotal),
                    })
                  }
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <rect
                    x={cl.x - 7}
                    y={46 - 7}
                    width="14"
                    height="14"
                    rx="3"
                    fill="#4f46e5"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={Math.max(175, Math.min(835, cl.x))}
                    y={30}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-bold fill-indigo-900"
                  >
                    #{record.po} · {cl.dateRangeLabel}
                  </text>
                </g>
              ))}

              {/* GRN Lane Clusters (4-Tier Staggering + Multi-Count Pill) */}
              {grnClusters.map((cl) => {
                const offsets = [-17, 21, -29, 32];
                const dy = offsets[cl.stagger] || -17;
                const labelY = 112 + dy;
                const isFar = Math.abs(dy) > 22;
                const pillW = cl.count > 1 ? 22 : 14;

                return (
                  <g
                    key={cl.clusterId}
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredNode({
                        badge: `GRN (${cl.count})`,
                        title:
                          cl.count <= 4
                            ? cl.items.map((i) => `GRN #${i.docNo}`).join(", ")
                            : `${cl.items
                                .slice(0, 3)
                                .map((i) => `GRN #${i.docNo}`)
                                .join(", ")} +${cl.count - 3} more`,
                        date: cl.dateRangeLabel,
                        info:
                          cl.count === 1
                            ? cl.items[0]?.sub || ""
                            : `${cl.count} goods receipts logged`,
                      })
                    }
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {isFar && grnClusters.length <= 8 && (
                      <line
                        x1={cl.x}
                        y1={dy < 0 ? 104 : 120}
                        x2={cl.x}
                        y2={dy < 0 ? labelY + 3 : labelY - 8}
                        stroke="#99f6e4"
                        strokeWidth="1"
                      />
                    )}
                    <rect
                      x={cl.x - pillW / 2}
                      y={112 - 7}
                      width={pillW}
                      height="14"
                      rx="7"
                      fill="#0d9488"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    {cl.count > 1 && (
                      <text
                        x={cl.x}
                        y="115"
                        textAnchor="middle"
                        className="text-[8.5px] font-mono font-bold fill-white"
                      >
                        ×{cl.count}
                      </text>
                    )}
                    {grnClusters.length <= 8 && (
                      <text
                        x={Math.max(150, Math.min(860, cl.x))}
                        y={labelY}
                        textAnchor="middle"
                        className="text-[9.5px] font-mono font-semibold fill-teal-800"
                      >
                        {cl.primaryLabel}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Invoice Lane Clusters (4-Tier Staggering + Multi-Count Pill) */}
              {invClusters.map((cl) => {
                const offsets = [20, -16, 31, -28];
                const dy = offsets[cl.stagger] || 20;
                const labelY = 178 + dy;
                const isFar = Math.abs(dy) > 22;
                const pillW = cl.count > 1 ? 22 : 14;

                return (
                  <g
                    key={cl.clusterId}
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredNode({
                        badge: `INV (${cl.count})`,
                        title:
                          cl.count <= 4
                            ? cl.items
                                .map((i) => `Invoice ${i.docNo}`)
                                .join(", ")
                            : `${cl.items
                                .slice(0, 3)
                                .map((i) => `Invoice ${i.docNo}`)
                                .join(", ")} +${cl.count - 3} more`,
                        date: cl.dateRangeLabel,
                        info:
                          cl.count === 1
                            ? cl.items[0]?.sub || ""
                            : `${cl.count} vendor invoices logged`,
                      })
                    }
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {isFar && invClusters.length <= 8 && (
                      <line
                        x1={cl.x}
                        y1={dy < 0 ? 170 : 186}
                        x2={cl.x}
                        y2={dy < 0 ? labelY + 3 : labelY - 8}
                        stroke="#fde68a"
                        strokeWidth="1"
                      />
                    )}
                    <rect
                      x={cl.x - pillW / 2}
                      y={178 - 7}
                      width={pillW}
                      height="14"
                      rx="7"
                      fill="#d97706"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    {cl.count > 1 && (
                      <text
                        x={cl.x}
                        y="181"
                        textAnchor="middle"
                        className="text-[8.5px] font-mono font-bold fill-white"
                      >
                        ×{cl.count}
                      </text>
                    )}
                    {invClusters.length <= 8 && (
                      <text
                        x={Math.max(150, Math.min(860, cl.x))}
                        y={labelY}
                        textAnchor="middle"
                        className="text-[9.5px] font-mono font-semibold fill-amber-800"
                      >
                        {cl.primaryLabel}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 px-1">
            <span>
              Timeline spans{" "}
              <strong className="text-slate-800">{months[0]?.fullLabel}</strong>{" "}
              →{" "}
              <strong className="text-slate-800">
                {months[months.length - 1]?.fullLabel}
              </strong>{" "}
              ({months.length} month{months.length === 1 ? "" : "s"})
            </span>
            {hoveredNode ? (
              <div className="inline-flex flex-wrap items-center gap-2 bg-indigo-50/90 text-indigo-950 border border-indigo-200 px-3 py-1 rounded-lg text-xs font-mono">
                <span className="font-bold text-indigo-700">
                  [{hoveredNode.badge}]
                </span>
                <strong>{hoveredNode.title}</strong>
                <span>· {hoveredNode.date}</span>
                {hoveredNode.info && (
                  <span className="text-slate-600">({hoveredNode.info})</span>
                )}
              </div>
            ) : (
              <span className="text-[11px] text-slate-400">
                Hover over any PO, GRN, or Invoice milestone node for details
              </span>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          SUB-TAB 2: ACTIVITY FEED ("feed")
      ==================================================================== */}
      {tlView === "feed" && (
        <div className="bg-gradient-to-b from-slate-50/60 to-white p-5 rounded-xl border border-slate-200/80 max-h-[540px] overflow-y-auto">
          <ol className="list-none m-0 p-0 max-w-2xl">
            {events.map((ev, idx) => {
              const prevEv = idx > 0 ? events[idx - 1] : null;
              const gapDays =
                prevEv && prevEv.date && ev.date
                  ? Math.max(0, daysBetween(prevEv.date, ev.date) ?? 0)
                  : 0;
              const isSameDateAsPrev = prevEv && prevEv.date === ev.date;

              return (
                <React.Fragment key={ev.id}>
                  {idx > 0 && gapDays > 0 && (
                    <li className="grid grid-cols-[110px_22px_1fr] gap-3 min-h-[26px]">
                      <div />
                      <div className="flex justify-center">
                        <div className="w-0.5 bg-slate-200 h-full" />
                      </div>
                      <span className="self-center font-mono text-[11px] font-medium text-slate-400">
                        +{gapDays}d
                      </span>
                    </li>
                  )}

                  {idx > 0 && isSameDateAsPrev && (
                    <li className="grid grid-cols-[110px_22px_1fr] gap-3 min-h-[10px]">
                      <div />
                      <div className="flex justify-center">
                        <div className="w-0.5 bg-indigo-200/70 h-full" />
                      </div>
                      <div />
                    </li>
                  )}

                  <li className="grid grid-cols-[110px_22px_1fr] gap-3 items-center py-1">
                    <span className="text-right font-mono text-xs text-slate-500 tabular-nums">
                      {isSameDateAsPrev ? (
                        <span className="text-[10px] text-slate-400">
                          Same day
                        </span>
                      ) : (
                        formatDisplayDate(ev.date)
                      )}
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full justify-self-center ${ev.dotClass} ring-4 ring-white shadow-2xs`}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/75 shadow-2xs hover:-translate-y-0.5 hover:shadow-md transition-all">
                      <div className="min-w-0">
                        <b className="block text-xs font-bold text-slate-900 font-mono">
                          {ev.title}
                        </b>
                        <small className="text-[11px] text-slate-500 block truncate">
                          {ev.sub}
                        </small>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border uppercase ${ev.pillClass}`}
                      >
                        {ev.type}
                      </span>
                    </div>
                  </li>
                </React.Fragment>
              );
            })}

            {record.daysSinceLastActivity !== null && (
              <>
                <li className="grid grid-cols-[110px_22px_1fr] gap-3 min-h-[26px]">
                  <div />
                  <div className="flex justify-center">
                    <div className="w-0.5 bg-slate-200 h-full" />
                  </div>
                  <span className="self-center font-mono text-[11px] font-medium text-slate-400">
                    +{record.daysSinceLastActivity}d
                  </span>
                </li>
                <li className="grid grid-cols-[110px_22px_1fr] gap-3 items-center py-1.5">
                  <span className="text-right font-mono text-xs text-slate-400">
                    Today
                  </span>
                  <span className="w-3.5 h-3.5 rounded-full justify-self-center bg-white border-2 border-dashed border-slate-400" />
                  <div className="text-xs text-slate-500">
                    <b className="font-semibold text-slate-700">
                      Status: {record.st}
                    </b>{" "}
                    <small className="text-slate-400 block">
                      {record.daysSinceLastActivity}d since last recorded
                      activity
                    </small>
                  </div>
                </li>
              </>
            )}
          </ol>
        </div>
      )}

      {/* ====================================================================
          SUB-TAB 3: MONTH BY MONTH ("month")
      ==================================================================== */}
      {tlView === "month" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {months.map((m) => {
              const isQuiet = m.events.length === 0;
              return (
                <div
                  key={m.key}
                  className={`rounded-xl p-3 border grid gap-1.5 content-start min-w-0 transition-all duration-200 ${
                    isQuiet
                      ? "bg-slate-50/80 border-dashed border-slate-200 text-slate-400"
                      : "bg-gradient-to-b from-indigo-50/35 to-white border-indigo-300 border-[1.5px] shadow-2xs hover:-translate-y-1 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isQuiet ? "text-slate-400" : "text-slate-900"
                      }`}
                    >
                      {m.fullLabel}
                    </span>
                    {!isQuiet && (
                      <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">
                        {m.events.length}
                      </span>
                    )}
                  </div>

                  {isQuiet ? (
                    <div className="text-[11px] text-slate-400">
                      No activity
                    </div>
                  ) : (
                    <div className="space-y-1 pt-0.5 max-h-44 overflow-y-auto pr-0.5">
                      {m.events.map((ev) => {
                        const dayPart = ev.date.split("-")[2];
                        const mIdx = parseInt(ev.date.split("-")[1], 10) - 1;
                        return (
                          <div
                            key={ev.id}
                            className="flex items-center gap-1.5 text-xs flex-nowrap min-w-0"
                          >
                            <i
                              className={`w-2 h-2 rounded-full shrink-0 ${ev.dotClass}`}
                            />
                            <span className="font-mono text-[11px] text-slate-800 font-medium truncate">
                              {ev.shortLabel}
                            </span>
                            <span className="ml-auto font-mono text-[10px] text-slate-400 shrink-0">
                              {dayPart} {MONTH_NAMES[mIdx]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-500">
            Active in{" "}
            <strong className="text-slate-800">
              {months.length - quietMonthsCount}
            </strong>{" "}
            of <strong className="text-slate-800">{months.length}</strong>{" "}
            months ({quietMonthsCount} quiet month
            {quietMonthsCount === 1 ? "" : "s"}).
          </p>
        </div>
      )}

      {/* ====================================================================
          SUB-TAB 4: RECEIPT -> INVOICE ("pairs" — Collision-Proof SVG Swimlane + Table)
      ==================================================================== */}
      {tlView === "pairs" && (
        <div className="space-y-4">
          {pairs.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
              No Goods Receipts (GRNs) or Invoices have been logged for PO #
              {record.po}.
            </div>
          ) : (
            <>
              {/* Visual SVG Receipt -> Invoice Pair Swimlane (Collision-Proof on Same-Day / Short Frame) */}
              <div className="bg-gradient-to-b from-teal-50/25 via-white to-amber-50/25 p-4 rounded-xl border border-teal-100/80 overflow-x-auto max-h-[440px] overflow-y-auto">
                <svg
                  viewBox={`0 0 920 ${pairSvgHeight}`}
                  className="w-full min-w-[700px] select-none"
                >
                  {/* Month Grid Ticks */}
                  {visibleTickMonths.map((m) => (
                    <g key={`pair-tick-${m.key}`}>
                      <line
                        x1={m.tickX}
                        y1="20"
                        x2={m.tickX}
                        y2={pairSvgHeight - 28}
                        stroke="#e2e8f0"
                        strokeDasharray="2 3"
                      />
                      <text
                        x={m.tickX}
                        y={pairSvgHeight - 10}
                        textAnchor="middle"
                        className="text-[10px] font-mono fill-slate-400"
                      >
                        {m.label}
                      </text>
                    </g>
                  ))}

                  {/* PO Reference Vertical Line */}
                  {poClusters[0] && (
                    <g>
                      <line
                        x1={poClusters[0].x}
                        y1="20"
                        x2={poClusters[0].x}
                        y2={pairSvgHeight - 28}
                        stroke="#6366f1"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={Math.min(780, poClusters[0].x + 6)}
                        y="28"
                        className="text-[10px] font-mono font-bold fill-indigo-600"
                      >
                        PO #{record.po} ({formatDisplayDate(record.date)})
                      </text>
                    </g>
                  )}

                  {/* Paired Rows: GRN Node ---- [ +Xd Lag Bar ] ----> Invoice Node */}
                  {pairs.map((p, idx) => {
                    const rowY = 54 + idx * 52;
                    const rawX1 = p.grnX;
                    const rawX2 = p.invX;

                    // Prevent circle & label collision when GRN and Invoice occur on the same date or within a few days
                    let drawX1 = rawX1;
                    let drawX2 = rawX2;
                    if (rawX1 !== null && rawX2 !== null) {
                      const diff = rawX2 - rawX1;
                      const minSep = 30;
                      if (Math.abs(diff) < minSep) {
                        const center = (rawX1 + rawX2) / 2;
                        const dir = diff < 0 ? -1 : 1;
                        drawX1 = center - (dir * minSep) / 2;
                        drawX2 = center + (dir * minSep) / 2;
                      }
                    }

                    const leftX =
                      drawX1 !== null && drawX2 !== null
                        ? Math.min(drawX1, drawX2)
                        : (drawX1 ?? drawX2);
                    const rightX =
                      drawX1 !== null && drawX2 !== null
                        ? Math.max(drawX1, drawX2)
                        : (drawX1 ?? drawX2);
                    const spanW =
                      drawX1 !== null && drawX2 !== null
                        ? Math.max(8, rightX - leftX)
                        : 0;
                    const midX =
                      drawX1 !== null && drawX2 !== null
                        ? (drawX1 + drawX2) / 2
                        : (drawX1 ?? drawX2);

                    const grnIsLeft =
                      drawX1 !== null && drawX2 !== null
                        ? drawX1 <= drawX2
                        : true;

                    const grnShort = p.grn
                      ? `GRN ${
                          String(p.grn.no).length > 10
                            ? `${String(p.grn.no).slice(0, 9)}…`
                            : p.grn.no
                        }`
                      : "";
                    const invShort = p.inv
                      ? String(p.inv.no).length > 12
                        ? `${String(p.inv.no).slice(0, 10)}…`
                        : String(p.inv.no)
                      : "";

                    return (
                      <g key={`pair-row-${p.index}`}>
                        {/* Horizontal Row Track */}
                        <line
                          x1="120"
                          y1={rowY}
                          x2="880"
                          y2={rowY}
                          stroke="#f1f5f9"
                          strokeWidth="1"
                        />
                        <text
                          x="16"
                          y={rowY + 4}
                          className="text-[10.5px] font-mono font-bold fill-slate-600"
                        >
                          Pair #{p.index}
                        </text>

                        {/* Duration Span Bar between GRN and Invoice */}
                        {drawX1 !== null && drawX2 !== null && (
                          <>
                            <rect
                              x={leftX}
                              y={rowY - 5}
                              width={spanW}
                              height="10"
                              rx="5"
                              fill={p.lagDays < 0 ? "#fde68a" : "#99f6e4"}
                              opacity="0.8"
                            />
                            <line
                              x1={drawX1}
                              y1={rowY}
                              x2={drawX2}
                              y2={rowY}
                              stroke={p.lagDays < 0 ? "#d97706" : "#0d9488"}
                              strokeWidth="2"
                            />
                            <rect
                              x={midX - 21}
                              y={rowY - 21}
                              width="42"
                              height="14"
                              rx="4"
                              fill="#ffffff"
                              stroke="#cbd5e1"
                            />
                            <text
                              x={midX}
                              y={rowY - 11}
                              textAnchor="middle"
                              className="text-[9.5px] font-mono font-bold fill-slate-700"
                            >
                              {p.lagDays >= 0
                                ? `+${p.lagDays}d`
                                : `${p.lagDays}d`}
                            </text>
                          </>
                        )}

                        {/* GRN Circle + Outer Label */}
                        {drawX1 !== null && (
                          <g>
                            <circle
                              cx={drawX1}
                              cy={rowY}
                              r="6"
                              fill="#0d9488"
                              stroke="#ffffff"
                              strokeWidth="1.8"
                            />
                            <text
                              x={grnIsLeft ? drawX1 - 10 : drawX1 + 10}
                              y={rowY + 3.5}
                              textAnchor={grnIsLeft ? "end" : "start"}
                              className="text-[9.5px] font-mono font-semibold fill-teal-800"
                            >
                              {grnShort}
                            </text>
                          </g>
                        )}

                        {/* Invoice Circle + Outer Label */}
                        {drawX2 !== null && (
                          <g>
                            <circle
                              cx={drawX2}
                              cy={rowY}
                              r="6"
                              fill="#d97706"
                              stroke="#ffffff"
                              strokeWidth="1.8"
                            />
                            <text
                              x={grnIsLeft ? drawX2 + 10 : drawX2 - 10}
                              y={rowY + 3.5}
                              textAnchor={grnIsLeft ? "start" : "end"}
                              className="text-[9.5px] font-mono font-semibold fill-amber-900"
                            >
                              {invShort}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Detailed Reconciliation Table */}
              <div className="overflow-x-auto rounded-xl border border-indigo-100/80">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-indigo-50/40 text-slate-500  text-[10px] font-bold border-b border-indigo-100/70">
                      <th className="py-2.5 px-4">#</th>
                      <th className="py-2.5 px-4">Receipt (GRN)</th>
                      <th className="py-2.5 px-4">GRN Date</th>
                      <th className="py-2.5 px-4">Invoice</th>
                      <th className="py-2.5 px-4">Invoice Date</th>
                      <th className="py-2.5 px-4">Receipt → Invoice Lag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {pairs.map((p) => {
                      const barWidthPct =
                        p.lagDays !== null
                          ? Math.max(
                              6,
                              Math.round(
                                (Math.abs(p.lagDays) / maxPairLag) * 100,
                              ),
                            )
                          : 0;

                      return (
                        <tr
                          key={p.index}
                          className="hover:bg-indigo-50/20 transition-colors"
                        >
                          <td className="py-2.5 px-4 font-mono text-slate-400">
                            {p.index}
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-teal-800">
                            {p.grn ? (
                              <span className="inline-flex items-center gap-1.5">
                                <i className="w-2 h-2 rounded-full bg-teal-600" />
                                GRN {p.grn.no}
                              </span>
                            ) : (
                              <span className="text-amber-600 font-normal italic">
                                No receipt
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-slate-600">
                            {p.grn ? formatDisplayDate(p.grn.cleanDate) : "—"}
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-amber-900">
                            {p.inv ? (
                              <span className="inline-flex items-center gap-1.5">
                                <i className="w-2 h-2 rounded-full bg-amber-500" />
                                {p.inv.no}
                              </span>
                            ) : (
                              <span className="text-amber-600 font-normal italic">
                                Awaiting invoice
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-slate-600">
                            {p.inv ? formatDisplayDate(p.inv.cleanDate) : "—"}
                          </td>
                          <td className="py-2.5 px-4">
                            {p.lagDays !== null ? (
                              <div className="flex items-center gap-2.5 min-w-[140px]">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      p.lagDays < 0
                                        ? "bg-amber-500"
                                        : p.lagDays <= 14
                                          ? "bg-teal-500"
                                          : "bg-indigo-500"
                                    }`}
                                    style={{ width: `${barWidthPct}%` }}
                                  />
                                </div>
                                <span className="font-mono text-xs font-bold text-slate-800 w-12 text-right">
                                  {p.lagDays >= 0
                                    ? `+${p.lagDays}d`
                                    : `${p.lagDays}d`}
                                </span>
                              </div>
                            ) : (
                              <span className="text-amber-600 text-[11px] font-medium">
                                Unpaired
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* <p className="text-xs text-slate-500">
            GRNs and invoices are expanded from the API response and shown in
            chronological sequence. The API response does not include an explicit
            GRN-to-invoice reference, so row alignment is a sequence comparison,
            not confirmation of the accounting link between documents.
          </p> */}
        </div>
      )}
    </div>
  );
});

// ============================================================================
// 6. REDESIGNED 3D VISUALIZATION COMPONENTS (ZERO WHITE SPACE & CLEAN 3D)
// ============================================================================

/**
 * 1. Committed vs. Settled Expenditure Chart (No extra top whitespace, fills container)
 */
const InteractiveSpendChart = React.memo(function InteractiveSpendChart({
  data,
  onSelectKey,
  selectedKeys = [],
  is3D = true,
}) {
  const [hoveredKey, setHoveredKey] = useState(null);

  const displayData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    if (data.length <= 8) return data;
    const top = data.slice(0, 7);
    const rest = data.slice(7);
    const others = rest.reduce(
      (acc, item) => {
        acc.poTotal += item.poTotal;
        acc.invTotal += item.invTotal;
        acc.paidTotal += item.paidTotal;
        acc.count += item.count;
        return acc;
      },
      {
        key: "__OTHERS__",
        label: `Others (${rest.length})`,
        poTotal: 0,
        invTotal: 0,
        paidTotal: 0,
        count: 0,
      },
    );
    others.paidPct =
      others.poTotal > 0
        ? Math.round((others.paidTotal / others.poTotal) * 100)
        : 0;
    return [...top, others];
  }, [data]);

  const maxVal = Math.max(...displayData.map((d) => d.poTotal), 1);
  const chartHeight = 205;
  const baseLineY = 250;
  const dx = is3D ? 12 : 0;
  const dy = is3D ? -9 : 0;

  if (displayData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        No expenditure records match the current filter selection.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-gradient-to-b from-indigo-50/30 via-white to-sky-50/25 rounded-xl p-3 border border-indigo-100/70">
      <svg viewBox="0 0 800 305" className="w-full min-w-[540px] select-none">
        <defs>
          <linearGradient id="entCommitFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="entCommitSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4338ca" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>

          <linearGradient id="entSettledFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <linearGradient id="entSettledSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#115e59" />
          </linearGradient>
        </defs>

        {/* Isometric Plinth */}
        <polygon
          points={`58,${baseLineY} 755,${baseLineY} ${755 + dx},${
            baseLineY + dy
          } ${58 + dx},${baseLineY + dy}`}
          fill="#eef2ff"
          stroke="#c7d2fe"
          strokeWidth="1"
        />

        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = baseLineY - ratio * chartHeight;
          return (
            <g key={ratio}>
              {is3D && (
                <line
                  x1="58"
                  y1={y}
                  x2={58 + dx}
                  y2={y + dy}
                  stroke="#e0e7ff"
                  strokeWidth="1"
                />
              )}
              <line
                x1={58 + dx}
                y1={y + dy}
                x2={755 + dx}
                y2={y + dy}
                stroke="#e0e7ff"
                strokeDasharray="4 4"
              />
              <text
                x="50"
                y={y + 3}
                textAnchor="end"
                className="text-[10px] font-mono fill-slate-400"
              >
                {formatCompact(maxVal * ratio)}
              </text>
            </g>
          );
        })}

        {displayData.map((item, idx) => {
          const slotWidth = 685 / Math.max(displayData.length, 1);
          const groupX = 80 + idx * slotWidth;
          const barW = 21;

          const poH = Math.max(5, (item.poTotal / maxVal) * chartHeight);
          const paidH = Math.max(5, (item.paidTotal / maxVal) * chartHeight);

          const poY = baseLineY - poH;
          const paidY = baseLineY - paidH;
          const isSelected = selectedKeys.includes(item.key);
          const isHovered = hoveredKey === item.key;
          const isDimmed =
            selectedKeys.length > 0 && !isSelected && item.key !== "__OTHERS__";

          return (
            <g
              key={item.key}
              onClick={() =>
                item.key !== "__OTHERS__" &&
                onSelectKey &&
                onSelectKey(item.key)
              }
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
              style={{
                cursor: item.key === "__OTHERS__" ? "default" : "pointer",
                transform: isHovered
                  ? "translate3d(0, -6px, 0)"
                  : "translate3d(0, 0, 0)",
                transition:
                  "transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms ease",
                opacity: isDimmed ? 0.35 : 1,
              }}
            >
              {/* Committed Bar */}
              <g>
                <rect
                  x={groupX}
                  y={poY}
                  width={barW}
                  height={poH}
                  rx={is3D ? 0 : 3}
                  fill="url(#entCommitFront)"
                />
                {is3D && (
                  <>
                    <polygon
                      points={`${groupX},${poY} ${groupX + dx},${poY + dy} ${
                        groupX + barW + dx
                      },${poY + dy} ${groupX + barW},${poY}`}
                      fill="#a5b4fc"
                    />
                    <polygon
                      points={`${groupX + barW},${poY} ${groupX + barW + dx},${
                        poY + dy
                      } ${groupX + barW + dx},${baseLineY + dy} ${
                        groupX + barW
                      },${baseLineY}`}
                      fill="url(#entCommitSide)"
                    />
                  </>
                )}
              </g>

              {/* Settled Bar */}
              <g>
                <rect
                  x={groupX + barW + 6}
                  y={paidY}
                  width={barW}
                  height={paidH}
                  rx={is3D ? 0 : 3}
                  fill="url(#entSettledFront)"
                />
                {is3D && (
                  <>
                    <polygon
                      points={`${groupX + barW + 6},${paidY} ${
                        groupX + barW + 6 + dx
                      },${paidY + dy} ${groupX + barW * 2 + 6 + dx},${
                        paidY + dy
                      } ${groupX + barW * 2 + 6},${paidY}`}
                      fill="#5eead4"
                    />
                    <polygon
                      points={`${groupX + barW * 2 + 6},${paidY} ${
                        groupX + barW * 2 + 6 + dx
                      },${paidY + dy} ${groupX + barW * 2 + 6 + dx},${
                        baseLineY + dy
                      } ${groupX + barW * 2 + 6},${baseLineY}`}
                      fill="url(#entSettledSide)"
                    />
                  </>
                )}
              </g>

              {(isHovered || isSelected) && (
                <g>
                  <rect
                    x={groupX - 24}
                    y={Math.min(poY, paidY) - 42}
                    width="110"
                    height="28"
                    rx="6"
                    fill="#1e1b4b"
                  />
                  <text
                    x={groupX + 31}
                    y={Math.min(poY, paidY) - 29}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-semibold fill-white"
                  >
                    PO: {formatCompact(item.poTotal)}
                  </text>
                  <text
                    x={groupX + 31}
                    y={Math.min(poY, paidY) - 18}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-teal-300"
                  >
                    Paid: {formatCompact(item.paidTotal)} ({item.paidPct}%)
                  </text>
                </g>
              )}

              <text
                x={groupX + barW + 3}
                y={baseLineY + 20}
                textAnchor="middle"
                className={`text-[10px] ${
                  isSelected
                    ? "fill-indigo-600 font-bold"
                    : "fill-slate-600 font-medium"
                }`}
              >
                {item.label.length > 13
                  ? `${item.label.slice(0, 12)}…`
                  : item.label}
              </text>
              <text
                x={groupX + barW + 3}
                y={baseLineY + 33}
                textAnchor="middle"
                className="text-[9px] font-mono fill-slate-400"
              >
                {item.count} PO{item.count > 1 ? "s" : ""} · {item.paidPct}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});

/**
 * 2. Redesigned Capital Conversion Pipeline ("Where the money is" 3D Isometric Bars + Variance Footer)
 * Matches the horizontal funnel & gap metrics in `PR to PO Tracker.html` with 3D depth & hover popups.
 */
const FinancialPipeline3D = React.memo(function FinancialPipeline3D({
  prTotal,
  poTotal,
  invTotal,
  paidTotal,
  is3D = true,
}) {
  const maxVal = Math.max(prTotal, poTotal, invTotal, paidTotal, 1);

  const stages = [
    {
      label: "PR value",
      val: prTotal,
      pct: 100,
      front: "from-sky-500 to-sky-600",
      top: "#7dd3fc",
      badge: "bg-sky-50 text-sky-700 border-sky-200",
    },
    {
      label: "PO value",
      val: poTotal,
      pct: prTotal > 0 ? Math.round((poTotal / prTotal) * 100) : 100,
      front: "from-indigo-500 to-indigo-600",
      top: "#a5b4fc",
      badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      label: "Invoiced",
      val: invTotal,
      pct: poTotal > 0 ? Math.round((invTotal / poTotal) * 100) : 0,
      front: "from-amber-500 to-amber-600",
      top: "#fcd34d",
      badge: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      label: "Paid",
      val: paidTotal,
      pct: invTotal > 0 ? Math.round((paidTotal / invTotal) * 100) : 0,
      front: "from-teal-500 to-teal-600",
      top: "#5eead4",
      badge: "bg-teal-50 text-teal-700 border-teal-200",
    },
  ];

  const poVsPrDiff = poTotal - prTotal;
  const unbilledVal = Math.max(0, poTotal - invTotal);
  const unpaidVal = Math.max(0, invTotal - paidTotal);

  return (
    <div className="space-y-3 bg-gradient-to-br from-sky-50/30 via-white to-indigo-50/25 p-3.5 rounded-xl border border-sky-100/80">
      {/* 4 Horizontal 3D Extruded Funnel Rows (.funnel / .frow) */}
      <div className="space-y-2.5">
        {stages.map((st) => {
          const widthPct = Math.max(4, Math.round((st.val / maxVal) * 100));
          return (
            <div
              key={st.label}
              className="group grid grid-cols-[78px_1fr_115px] items-center gap-2.5 p-1.5 rounded-xl hover:bg-white hover:shadow-xs transition-all duration-200"
            >
              <div className="flex items-center justify-between pr-1">
                <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">
                  {st.label}
                </span>
              </div>

              {/* 3D Isometric Extruded Bar Track */}
              <div className="relative h-6 bg-slate-100/90 rounded-lg p-0.5 overflow-hidden border border-slate-200/60">
                <div
                  className={`relative h-full rounded-md bg-gradient-to-r ${st.front} transition-all duration-500 group-hover:brightness-105`}
                  style={{
                    width: `${widthPct}%`,
                    boxShadow: is3D
                      ? `0 -3px 0 ${st.top} inset, 2px 2px 4px rgba(15, 23, 42, 0.12)`
                      : "none",
                  }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-500">
                  {st.pct}%
                </span>
              </div>

              <div className="text-right font-mono text-xs font-bold text-slate-900 tabular-nums">
                {Math.round(st.val).toLocaleString("en-US")}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3 Variance Gap Mini-Cards (.gaps / .gap from PR to PO Tracker.html) */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-200/70 text-xs">
        <div className="bg-white/90 p-2 rounded-lg border border-slate-200/60 hover:-translate-y-0.5 transition-transform">
          <div className="text-[10px] text-slate-400 font-semibold">
            PO vs PR
          </div>
          <div
            className={`font-mono font-bold text-xs mt-0.5 ${
              poVsPrDiff > 0 ? "text-amber-700" : "text-slate-800"
            }`}
          >
            {poVsPrDiff >= 0 ? "+" : ""}
            {formatCompact(poVsPrDiff)}
          </div>
        </div>

        <div className="bg-white/90 p-2 rounded-lg border border-slate-200/60 hover:-translate-y-0.5 transition-transform">
          <div className="text-[10px] text-slate-400 font-semibold">
            Unbilled on PO
          </div>
          <div
            className={`font-mono font-bold text-xs mt-0.5 ${
              unbilledVal > 0 ? "text-amber-700" : "text-teal-700"
            }`}
          >
            {formatCompact(unbilledVal)}
          </div>
        </div>

        <div className="bg-white/90 p-2 rounded-lg border border-slate-200/60 hover:-translate-y-0.5 transition-transform">
          <div className="text-[10px] text-slate-400 font-semibold">
            Unpaid on billed
          </div>
          <div
            className={`font-mono font-bold text-xs mt-0.5 ${
              unpaidVal > 0 ? "text-rose-600" : "text-emerald-700"
            }`}
          >
            {formatCompact(unpaidVal)}
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * 3. Redesigned GL Cost Pool Share (Crisp 3D Isometric Stacked Allocation Bar + Interactive Hover Cards)
 * Replaces the distorted 2.5D sphere/ellipse with an executive 3D segmented bar and interactive tiles.
 */
const CostPool3DDonut = React.memo(function CostPool3DDonut({
  accounts,
  onSelectAccount,
  selectedAccounts = [],
  is3D = true,
}) {
  const displayAccounts = useMemo(() => {
    if (!Array.isArray(accounts) || accounts.length === 0) return [];
    if (accounts.length <= 5) return accounts;
    const top = accounts.slice(0, 4);
    const rest = accounts.slice(4);
    const othersVal = rest.reduce((s, a) => s + a.value, 0);
    const othersCount = rest.reduce((s, a) => s + (a.count || 1), 0);
    return [
      ...top,
      {
        acct: "__OTHERS__",
        acctDesc: `Other Cost Pools (${rest.length})`,
        value: othersVal,
        count: othersCount,
      },
    ];
  }, [accounts]);

  const total = displayAccounts.reduce((s, a) => s + a.value, 0) || 1;
  const palette = [
    {
      bar: "bg-indigo-600",
      top: "#a5b4fc",
      dot: "bg-indigo-600",
      tint: "bg-indigo-50/80 border-indigo-300",
      badge: "bg-indigo-50 text-indigo-700",
    },
    {
      bar: "bg-sky-500",
      top: "#7dd3fc",
      dot: "bg-sky-500",
      tint: "bg-sky-50/80 border-sky-300",
      badge: "bg-sky-50 text-sky-700",
    },
    {
      bar: "bg-teal-500",
      top: "#5eead4",
      dot: "bg-teal-500",
      tint: "bg-teal-50/80 border-teal-300",
      badge: "bg-teal-50 text-teal-700",
    },
    {
      bar: "bg-amber-500",
      top: "#fcd34d",
      dot: "bg-amber-500",
      tint: "bg-amber-50/80 border-amber-300",
      badge: "bg-amber-50 text-amber-800",
    },
    {
      bar: "bg-slate-400",
      top: "#cbd5e1",
      dot: "bg-slate-400",
      tint: "bg-slate-100 border-slate-300",
      badge: "bg-slate-100 text-slate-600",
    },
  ];

  const items = displayAccounts.map((acc, idx) => ({
    ...acc,
    pct: Math.max(1, Math.round((acc.value / total) * 100)),
    theme: palette[idx % palette.length],
  }));

  if (items.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-xs text-slate-400">
        No GL account data available
      </div>
    );
  }

  return (
    <div className="space-y-3 bg-gradient-to-r from-violet-50/25 via-white to-indigo-50/25 p-3.5 rounded-xl border border-indigo-100/70">
      {/* 3D Segmented Master Allocation Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
          <span>Total Distributed Across {accounts.length} GL Accounts</span>
          <span className="font-mono font-bold text-slate-800">
            {formatCompact(total)} AED
          </span>
        </div>
        <div className="h-5 w-full rounded-xl bg-slate-100 p-0.5 flex gap-0.5 overflow-hidden border border-slate-200/80">
          {items.map((s) => (
            <div
              key={`${s.acct}-seg`}
              onClick={() => s.acct !== "__OTHERS__" && onSelectAccount(s.acct)}
              title={`${s.acctDesc}: AED ${Math.round(
                s.value,
              ).toLocaleString()} (${s.pct}%)`}
              className={`h-full ${s.theme.bar} first:rounded-l-lg last:rounded-r-lg transition-all duration-300 hover:brightness-110 ${
                s.acct === "__OTHERS__" ? "cursor-default" : "cursor-pointer"
              }`}
              style={{
                width: `${s.pct}%`,
                boxShadow: is3D ? `0 -3px 0 ${s.theme.top} inset` : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Interactive 3D Hover Cards for Each Cost Pool */}
      <div className="space-y-1.5 text-xs">
        {items.map((s) => {
          const active = selectedAccounts.includes(s.acct);
          return (
            <div
              key={s.acct}
              onClick={() => s.acct !== "__OTHERS__" && onSelectAccount(s.acct)}
              className={`group flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-200 ${
                s.acct === "__OTHERS__"
                  ? "cursor-default"
                  : "cursor-pointer hover:-translate-y-0.5 hover:shadow-sm"
              } ${
                active
                  ? `${s.theme.tint} font-bold text-slate-900 shadow-2xs`
                  : "bg-white/95 border-slate-200/70 hover:border-indigo-200 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span
                  className={`w-3 h-3 rounded-md shrink-0 ${s.theme.dot} shadow-2xs`}
                />
                <div className="truncate">
                  <div className="truncate font-semibold text-slate-800 group-hover:text-indigo-950">
                    {s.acctDesc}
                  </div>
                  {s.acct !== "__OTHERS__" && (
                    <div className="text-[10px] font-mono text-slate-400">
                      GL {s.acct}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 ml-2">
                <span className="font-mono text-xs font-bold text-slate-800">
                  {formatCompact(s.value)}
                </span>
                <span
                  className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md ${s.theme.badge} w-11 text-center`}
                >
                  {s.pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ============================================================================
// 7. MAIN CONTAINER-ADAPTIVE ENTERPRISE APPLICATION
// ============================================================================
export default function POTrackerApp() {
  const [rawList, setRawList] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState("overview");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [is3DEnabled, setIs3DEnabled] = useState(true);

  const [activePO, setActivePO] = useState("");
  const [detailRecord, setDetailRecord] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [apiError, setApiError] = useState(null);

  // --- Multi-Select & Search Filter States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("po_desc");
  const [chartDimension, setChartDimension] = useState("vendor");

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // --- API 1: Fetch Portfolio List ---
  const fetchDashboardList = useCallback(async () => {
    setIsLoadingList(true);
    setApiError(null);
    try {
      const res = await fetch(`${backendUrl}/api/PrPoDashboard/GetDashboardV1`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch dashboard data`);
      }
      const data = await res.json();
      setRawList(Array.isArray(data) ? data : []);
    } catch (err) {
      setApiError(
        err.message || "Unable to connect to /api/PrPoDashboard/GetDashboardV1",
      );
      setRawList([]);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardList();
  }, [fetchDashboardList]);

  const poList = useMemo(
    () => rawList.map(enrichRecord).filter(Boolean),
    [rawList],
  );

  // --- API 2: Fetch Single PO Detail ---
  // FIX: stale responses (from a previously selected PO) are ignored, and a null
  // enrichment result never replaces the current record. This prevents the
  // timeline from flipping to a different PO / disappearing mid-render.
  useEffect(() => {
    if (!activePO) return undefined;
    let cancelled = false;

    const fallbackToList = () => {
      const match = poList.find((p) => p.po === activePO);
      if (match) setDetailRecord(match);
    };

    async function fetchPoDetail() {
      setIsLoadingDetail(true);
      try {
        const res = await fetch(
          `${backendUrl}/api/PrPoDashboard/po/${activePO}`,
        );
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (cancelled) return;
          const enriched = enrichRecord(data);
          if (enriched) {
            setDetailRecord(enriched);
          } else {
            fallbackToList();
          }
        } else {
          fallbackToList();
        }
      } catch {
        if (!cancelled) fallbackToList();
      } finally {
        if (!cancelled) setIsLoadingDetail(false);
      }
    }
    fetchPoDetail();

    return () => {
      cancelled = true;
    };
  }, [activePO, poList]);

  const filterOptions = useMemo(() => {
    const vendorCounts = new Map();
    const statusCounts = new Map();
    const acctMap = new Map();

    poList.forEach((p) => {
      vendorCounts.set(p.vendor, (vendorCounts.get(p.vendor) || 0) + 1);
      statusCounts.set(p.st, (statusCounts.get(p.st) || 0) + 1);
      p.lines.forEach((l) => {
        if (l.acct) {
          acctMap.set(l.acct, {
            value: l.acct,
            label: `${l.acctDesc || "Account"}`,
            subLabel: `GL Code: ${l.acct}`,
          });
        }
      });
    });

    const vendors = Array.from(vendorCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([v, count]) => ({
        value: v,
        label: v,
        subLabel: `${count} Purchase Order${count > 1 ? "s" : ""}`,
      }));

    const statuses = Array.from(statusCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([st, count]) => ({
        value: st,
        label: st,
        subLabel: `${count} Record${count > 1 ? "s" : ""}`,
      }));

    const accounts = Array.from(acctMap.values()).sort((a, b) =>
      a.value.localeCompare(b.value),
    );

    return { vendors, statuses, accounts };
  }, [poList]);

  const filteredPOs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return poList
      .filter((item) => {
        if (
          selectedVendors.length > 0 &&
          !selectedVendors.includes(item.vendor)
        ) {
          return false;
        }
        if (
          selectedStatuses.length > 0 &&
          !selectedStatuses.includes(item.st)
        ) {
          return false;
        }
        if (
          selectedAccounts.length > 0 &&
          !item.lines.some((l) => selectedAccounts.includes(l.acct))
        ) {
          return false;
        }
        if (dateFrom && item.date !== "N/A" && item.date < dateFrom) {
          return false;
        }
        if (dateTo && item.date !== "N/A" && item.date > dateTo) {
          return false;
        }

        if (q) {
          const matchPO = item.po.toLowerCase().includes(q);
          const matchVendor = item.vendor.toLowerCase().includes(q);
          const matchPR = item.prs.some(
            (pr) =>
              String(pr.no).toLowerCase().includes(q) ||
              (pr.desc || "").toLowerCase().includes(q),
          );
          const matchLine = item.lines.some(
            (l) =>
              (l.item || "").toLowerCase().includes(q) ||
              (l.acct || "").toLowerCase().includes(q) ||
              (l.acctDesc || "").toLowerCase().includes(q),
          );
          const matchGRN = item.grns.some((g) =>
            String(g.no).toLowerCase().includes(q),
          );
          const matchINV = item.invs.some((i) =>
            String(i.no).toLowerCase().includes(q),
          );
          return (
            matchPO ||
            matchVendor ||
            matchPR ||
            matchLine ||
            matchGRN ||
            matchINV
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "val_desc") return b.poTotal - a.poTotal;
        if (sortBy === "val_asc") return a.poTotal - b.poTotal;
        if (sortBy === "date_desc") return b.date.localeCompare(a.date);
        return b.po.localeCompare(a.po);
      });
  }, [
    poList,
    searchQuery,
    selectedVendors,
    selectedAccounts,
    selectedStatuses,
    dateFrom,
    dateTo,
    sortBy,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedVendors,
    selectedAccounts,
    selectedStatuses,
    dateFrom,
    dateTo,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredPOs.length / pageSize));
  const paginatedPOs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPOs.slice(start, start + pageSize);
  }, [filteredPOs, currentPage, pageSize]);

  const overviewStats = useMemo(() => {
    const totals = filteredPOs.reduce(
      (acc, p) => {
        acc.pr += p.prTotal;
        acc.po += p.poTotal;
        acc.inv += p.invTotal;
        acc.paid += p.paidTotal;
        acc.unbilled += p.remainingUnbilled;
        acc.unpaid += p.remainingUnpaid;
        acc.grnCount += p.grns.length;
        acc.invCount += p.invs.length;
        if (p.st.toLowerCase() === "open") acc.openPoCount += 1;
        if (p.poToGrnDays !== null && p.poToGrnDays >= 0) {
          acc.grnDaysSum += p.poToGrnDays;
          acc.grnDaysCount += 1;
        }
        if (p.grnToInvDays !== null && p.grnToInvDays >= 0) {
          acc.invDaysSum += p.grnToInvDays;
          acc.invDaysCount += 1;
        }
        return acc;
      },
      {
        pr: 0,
        po: 0,
        inv: 0,
        paid: 0,
        unbilled: 0,
        unpaid: 0,
        grnCount: 0,
        invCount: 0,
        openPoCount: 0,
        grnDaysSum: 0,
        grnDaysCount: 0,
        invDaysSum: 0,
        invDaysCount: 0,
      },
    );

    const vendorMap = new Map();
    const acctMap = new Map();

    filteredPOs.forEach((p) => {
      const vPrev = vendorMap.get(p.vendor) || {
        key: p.vendor,
        label: p.vendor,
        poTotal: 0,
        invTotal: 0,
        paidTotal: 0,
        count: 0,
      };
      vPrev.poTotal += p.poTotal;
      vPrev.invTotal += p.invTotal;
      vPrev.paidTotal += p.paidTotal;
      vPrev.count += 1;
      vPrev.paidPct =
        vPrev.poTotal > 0
          ? Math.round((vPrev.paidTotal / vPrev.poTotal) * 100)
          : 0;
      vendorMap.set(p.vendor, vPrev);

      p.lines.forEach((l) => {
        const key = l.acct || "Unassigned";
        const aPrev = acctMap.get(key) || {
          key,
          acct: key,
          acctDesc: l.acctDesc || "General",
          label: `${key} ${l.acctDesc || ""}`,
          value: 0,
          poTotal: 0,
          invTotal: 0,
          paidTotal: 0,
          count: 0,
        };
        aPrev.value += Number(l.cost) || 0;
        aPrev.poTotal += Number(l.cost) || 0;
        aPrev.invTotal += Number(l.inv) || 0;
        aPrev.paidTotal += Number(l.paid) || 0;
        aPrev.count += 1;
        aPrev.paidPct =
          aPrev.poTotal > 0
            ? Math.round((aPrev.paidTotal / aPrev.poTotal) * 100)
            : 0;
        acctMap.set(key, aPrev);
      });
    });

    return {
      ...totals,
      utilizationPct:
        totals.pr > 0 ? Math.round((totals.po / totals.pr) * 100) : 0,
      billedPct: totals.po > 0 ? Math.round((totals.inv / totals.po) * 100) : 0,
      settlementPct:
        totals.po > 0 ? Math.round((totals.paid / totals.po) * 100) : 0,
      avgPoToGrn:
        totals.grnDaysCount > 0
          ? Math.round(totals.grnDaysSum / totals.grnDaysCount)
          : null,
      avgGrnToInv:
        totals.invDaysCount > 0
          ? Math.round(totals.invDaysSum / totals.invDaysCount)
          : null,
      vendorBars: Array.from(vendorMap.values()).sort(
        (a, b) => b.poTotal - a.poTotal,
      ),
      accountBars: Array.from(acctMap.values()).sort(
        (a, b) => b.poTotal - a.poTotal,
      ),
    };
  }, [filteredPOs]);

  const inspectPO = (poNumber) => {
    setActivePO(poNumber);
    const match = poList.find((p) => p.po === poNumber);
    if (match) setDetailRecord(match);
    setActiveWorkspace("inspector");
  };

  const toggleMultiFilterItem = (setter, key) => {
    setter((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedVendors([]);
    setSelectedAccounts([]);
    setSelectedStatuses([]);
    setDateFrom("");
    setDateTo("");
  };

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    selectedVendors.length +
    selectedAccounts.length +
    selectedStatuses.length +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0);

  const currentRecord = detailRecord || filteredPOs[0] || poList[0] || null;

  return (
    <div className="w-full min-h-full bg-white text-slate-800 font-sans antialiased">
      <div className="w-full max-w-full mx-auto p-3 sm:p-5 space-y-4">
        {/* ====================================================================
            TOP NAVIGATION TAB BAR & COMMAND HEADER
        ==================================================================== */}
        <header className="bg-gradient-to-r from-indigo-50/50 via-white to-sky-50/50 rounded-2xl border border-indigo-100/80 p-4 shadow-2xs space-y-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs shrink-0">
                PO
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900 tracking-tight">
                    Procure-to-Pay Dashboard
                  </h1>
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/70 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full">
                    {filteredPOs.length} of {poList.length} Orders
                  </span>
                </div>
                {/* <p className="text-xs text-slate-500">
                  Interactive capital conversion, vendor spend, and fulfillment
                  telemetry
                </p> */}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex bg-slate-100/90 p-1 rounded-xl border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => {
                    setActiveWorkspace("overview");
                    setIsRegisterOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeWorkspace === "overview" && !isRegisterOpen
                      ? "bg-white text-indigo-700 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icons.Dashboard className="w-3.5 h-3.5" />
                  <span>Executive Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveWorkspace("overview");
                    setIsRegisterOpen((prev) => !prev);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeWorkspace === "overview" && isRegisterOpen
                      ? "bg-white text-indigo-700 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icons.TableRegister className="w-3.5 h-3.5" />
                  <span>PO Register</span>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-mono px-1.5 py-0.2 rounded-md">
                    {filteredPOs.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!activePO && currentRecord)
                      setActivePO(currentRecord.po);
                    setActiveWorkspace("inspector");
                  }}
                  disabled={!currentRecord}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 ${
                    activeWorkspace === "inspector"
                      ? "bg-white text-indigo-700 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icons.Inspector className="w-3.5 h-3.5" />
                  <span>
                    PO Inspector {currentRecord ? `(#${currentRecord.po})` : ""}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIs3DEnabled((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  is3DEnabled
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                <Icons.Cube3D className="w-3.5 h-3.5" />
                <span>{is3DEnabled ? "3D View" : "2D View"}</span>
              </button>

              <SearchablePOPicker
                poList={filteredPOs}
                activePO={activePO || currentRecord?.po || ""}
                onSelectPO={inspectPO}
              />

              <button
                type="button"
                onClick={fetchDashboardList}
                title="Refresh Live API Data"
                className="p-2 rounded-xl bg-white border border-slate-200/90 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              >
                <Icons.Refresh
                  className={`w-4 h-4 ${
                    isLoadingList ? "animate-spin text-indigo-600" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Multi-Select & Searchable Filter Bar */}
          <div className="pt-3 border-t border-indigo-100/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 items-end">
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold  tracking-wider text-slate-500 mb-1">
                Global Search
              </label>
              <div className="relative">
                <Icons.Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search PO #, PR #, vendor, item, GRN, invoice..."
                  className="w-full text-xs bg-slate-50/70 border border-slate-200/80 rounded-xl pl-8 pr-3 py-2 outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <SearchableMultiSelect
              label="Vendors "
              placeholder={`All Vendors (${filterOptions.vendors.length})`}
              options={filterOptions.vendors}
              selectedValues={selectedVendors}
              onChange={setSelectedVendors}
              accent="indigo"
            />

            <SearchableMultiSelect
              label="GL Accounts "
              placeholder={`All GL Accounts (${filterOptions.accounts.length})`}
              options={filterOptions.accounts}
              selectedValues={selectedAccounts}
              onChange={setSelectedAccounts}
              accent="sky"
            />

            <SearchableMultiSelect
              label="PO Status "
              placeholder="All Statuses"
              options={filterOptions.statuses}
              selectedValues={selectedStatuses}
              onChange={setSelectedStatuses}
              accent="teal"
            />

            <div className="flex items-center gap-1.5">
              <div className="flex-1">
                <label className="block text-[10px] font-bold  tracking-wider text-slate-500 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full text-[11px] font-mono bg-slate-50/70 border border-slate-200/80 rounded-xl px-2 py-1.5 text-slate-700 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-bold  tracking-wider text-slate-500 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full text-[11px] font-mono bg-slate-50/70 border border-slate-200/80 rounded-xl px-2 py-1.5 text-slate-700 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">
                  Active Filters:
                </span>
                {selectedVendors.map((v) => (
                  <span
                    key={v}
                    className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1"
                  >
                    Vendor: {v.slice(0, 18)}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedVendors((prev) =>
                          prev.filter((item) => item !== v),
                        )
                      }
                      className="font-bold hover:text-indigo-950"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedAccounts.map((a) => (
                  <span
                    key={a}
                    className="bg-sky-50 text-sky-700 border border-sky-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1"
                  >
                    GL: {a}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAccounts((prev) =>
                          prev.filter((item) => item !== a),
                        )
                      }
                      className="font-bold hover:text-sky-950"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedStatuses.map((s) => (
                  <span
                    key={s}
                    className="bg-teal-50 text-teal-700 border border-teal-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1"
                  >
                    Status: {s}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedStatuses((prev) =>
                          prev.filter((item) => item !== s),
                        )
                      }
                      className="font-bold hover:text-teal-950"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50/70 px-2.5 py-1 rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </header>

        {/* ====================================================================
            MAIN WORKSPACE CONTENT
        ==================================================================== */}
        {isLoadingList ? (
          <div className="h-80 bg-slate-50/50 rounded-2xl border border-slate-200/70 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            {/* <p className="text-xs font-medium text-slate-500">
              Synchronizing live procurement telemetry from API...
            </p> */}
          </div>
        ) : apiError ? (
          <div className="bg-rose-50/50 p-10 rounded-2xl border border-rose-200 text-center space-y-3">
            <div className="text-xs font-bold text-rose-700">
              API Connection Error: {apiError}
            </div>
            <button
              type="button"
              onClick={fetchDashboardList}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs"
            >
              <Icons.Refresh className="w-3.5 h-3.5" />
              <span>Retry API Connection</span>
            </button>
          </div>
        ) : poList.length === 0 ? (
          <div className="bg-slate-50/50 p-12 rounded-2xl border border-slate-200/70 text-center">
            <p className="text-xs text-slate-500">
              No Purchase Order records returned by{" "}
              <code className="font-mono">
                {/* /api/PrPoDashboard/GetDashboardV1 */}
              </code>
              .
            </p>
          </div>
        ) : activeWorkspace === "overview" ? (
          /* ==================================================================
              WORKSPACE 1: EXECUTIVE SUMMARY OVERVIEW
          ================================================================== */
          <div className="space-y-4">
            {/* 5 Interactive Hover Pop-Up KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Card 1: PR Requisitioned */}
              <div className="group relative bg-gradient-to-b from-sky-50/70 to-white p-4 rounded-2xl border border-sky-200/70 border-t-4 border-t-sky-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg hover:border-sky-300 transition-all duration-300 ease-out cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold  tracking-wider text-sky-800">
                    Purchase Requisition
                  </span>
                  <span className="bg-sky-100 text-sky-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                    Budget
                  </span>
                </div>
                <div className="text-lg font-extrabold text-slate-900 font-mono mt-2">
                  <AnimatedMetricValue value={overviewStats.pr} />
                </div>
                <div className="text-[11px] text-sky-700/80 font-medium mt-1">
                  Across {filteredPOs.length} purchase orders
                </div>

                {/* Hover Pop-Up Telemetry Detail */}
                <div className="opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 absolute left-0 right-0 top-full mt-2 z-30 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-[11px] space-y-1">
                  <div className="font-bold text-sky-300">
                    Requisition Breakdown
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Avg PR / Order:</span>
                    <span>
                      {formatCompact(
                        filteredPOs.length > 0
                          ? overviewStats.pr / filteredPOs.length
                          : 0,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Active Vendors:</span>
                    <span>{overviewStats.vendorBars.length}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Committed PO Spend */}
              <div className="group relative bg-gradient-to-b from-indigo-50/70 to-white p-4 rounded-2xl border border-indigo-200/70 border-t-4 border-t-indigo-600 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg hover:border-indigo-300 transition-all duration-300 ease-out cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold  tracking-wider text-indigo-900">
                    Committed PO Spend
                  </span>
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                    {overviewStats.utilizationPct}%
                  </span>
                </div>
                <div className="text-lg font-extrabold text-slate-900 font-mono mt-2">
                  <AnimatedMetricValue value={overviewStats.po} />
                </div>
                <div className="text-[11px] text-indigo-700/80 font-medium mt-1">
                  {overviewStats.utilizationPct}% of PR budget utilized
                </div>

                <div className="opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 absolute left-0 right-0 top-full mt-2 z-30 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-[11px] space-y-1">
                  <div className="font-bold text-indigo-300">
                    Commitment Variance
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">PO vs PR Delta:</span>
                    <span>
                      {formatCompact(overviewStats.po - overviewStats.pr)}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">GL Cost Pools:</span>
                    <span>{overviewStats.accountBars.length}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Invoiced Total */}
              <div className="group relative bg-gradient-to-b from-amber-50/70 to-white p-4 rounded-2xl border border-amber-200/70 border-t-4 border-t-amber-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg hover:border-amber-300 transition-all duration-300 ease-out cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold  tracking-wider text-amber-900">
                    Invoiced Total
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                    {overviewStats.invCount} Invs
                  </span>
                </div>
                <div className="text-lg font-extrabold text-slate-900 font-mono mt-2">
                  <AnimatedMetricValue value={overviewStats.inv} />
                </div>
                <div className="text-[11px] text-amber-800/80 font-medium mt-1">
                  {overviewStats.billedPct}% of PO value billed
                </div>

                <div className="opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 absolute left-0 right-0 top-full mt-2 z-30 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-[11px] space-y-1">
                  <div className="font-bold text-amber-300">
                    Billing Velocity
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Avg GRN → Inv:</span>
                    <span>{overviewStats.avgGrnToInv ?? "—"} days</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Unbilled PO:</span>
                    <span>{formatCompact(overviewStats.unbilled)}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Paid / Settled */}
              <div className="group relative bg-gradient-to-b from-teal-50/70 to-white p-4 rounded-2xl border border-teal-200/70 border-t-4 border-t-teal-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg hover:border-teal-300 transition-all duration-300 ease-out cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold  tracking-wider text-teal-900">
                    Paid / Settled
                  </span>
                  <span className="bg-teal-100 text-teal-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                    {overviewStats.settlementPct}%
                  </span>
                </div>
                <div className="text-lg font-extrabold text-slate-900 font-mono mt-2">
                  <AnimatedMetricValue value={overviewStats.paid} />
                </div>
                <div className="text-[11px] text-teal-800/80 font-medium mt-1">
                  {overviewStats.grnCount} GRNs received
                </div>

                <div className="opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 absolute left-0 right-0 top-full mt-2 z-30 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-[11px] space-y-1">
                  <div className="font-bold text-teal-300">
                    Settlement Telemetry
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Unpaid on Billed:</span>
                    <span>{formatCompact(overviewStats.unpaid)}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Total Receipts:</span>
                    <span>{overviewStats.grnCount} GRNs</span>
                  </div>
                </div>
              </div>

              {/* Card 5: Unbilled Balance */}
              <div className="group relative bg-gradient-to-b from-violet-50/70 to-white p-4 rounded-2xl border border-violet-200/70 border-t-4 border-t-violet-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg hover:border-violet-300 transition-all duration-300 ease-out cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold  tracking-wider text-violet-900">
                    Unbilled Balance
                  </span>
                  <span className="bg-violet-100 text-violet-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                    {overviewStats.openPoCount} Open
                  </span>
                </div>
                <div className="text-lg font-extrabold text-slate-900 font-mono mt-2">
                  <AnimatedMetricValue value={overviewStats.unbilled} />
                </div>
                <div className="text-[11px] text-violet-800/80 font-medium mt-1">
                  Avg cycle: {overviewStats.avgPoToGrn ?? "—"}d PO → GRN
                </div>

                <div className="opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 absolute left-0 right-0 top-full mt-2 z-30 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-[11px] space-y-1">
                  <div className="font-bold text-violet-300">
                    Open Liability Exposure
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Open Status POs:</span>
                    <span>{overviewStats.openPoCount} orders</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Avg Delivery Lead:</span>
                    <span>{overviewStats.avgPoToGrn ?? "—"} days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Analytical Grid (No extra white gap) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Left 7 Columns: Committed vs Settled Expenditure */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-indigo-100/90 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                      <h2 className="text-xs font-bold tracking-wider text-slate-800">
                        Committed vs. Settled Expenditure
                      </h2>
                    </div>
                    {/* <p className="text-[11px] text-slate-500 mt-0.5">
                      Click any bar to toggle multi-select filtering by{" "}
                      {chartDimension === "vendor" ? "Vendor" : "GL Cost Pool"}
                    </p> */}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="hidden sm:flex items-center gap-3 text-[11px] font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <i className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block" />
                        Committed
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="w-2.5 h-2.5 rounded-xs bg-teal-500 inline-block" />
                        Paid
                      </span>
                    </div>

                    <div className="inline-flex bg-indigo-50/80 p-0.5 rounded-xl border border-indigo-100 text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setChartDimension("vendor")}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          chartDimension === "vendor"
                            ? "bg-white text-indigo-700 shadow-2xs"
                            : "text-slate-600"
                        }`}
                      >
                        By Vendor
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartDimension("account")}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          chartDimension === "account"
                            ? "bg-white text-indigo-700 shadow-2xs"
                            : "text-slate-600"
                        }`}
                      >
                        By GL Account
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compact Inline Context Strip (Eliminates Empty White Space & Adds Value) */}
                <div className="grid grid-cols-3 gap-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 text-xs">
                  <div>
                    <span className="text-[10px]  font-bold text-slate-400 block">
                      Top{" "}
                      {chartDimension === "vendor" ? "Vendor" : "GL Account"}
                    </span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {(chartDimension === "vendor"
                        ? overviewStats.vendorBars[0]?.label
                        : overviewStats.accountBars[0]?.acctDesc) || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px]  font-bold text-slate-400 block">
                      Top Concentration
                    </span>
                    <span className="font-mono font-bold text-indigo-700">
                      {formatCompact(
                        (chartDimension === "vendor"
                          ? overviewStats.vendorBars[0]?.poTotal
                          : overviewStats.accountBars[0]?.poTotal) || 0,
                      )}{" "}
                      AED
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px]  font-bold text-slate-400 block">
                      Active Dimension Count
                    </span>
                    <span className="font-mono font-bold text-teal-700">
                      {chartDimension === "vendor"
                        ? `${overviewStats.vendorBars.length} Vendors`
                        : `${overviewStats.accountBars.length} GL Pools`}
                    </span>
                  </div>
                </div>

                <InteractiveSpendChart
                  is3D={is3DEnabled}
                  data={
                    chartDimension === "vendor"
                      ? overviewStats.vendorBars
                      : overviewStats.accountBars
                  }
                  selectedKeys={
                    chartDimension === "vendor"
                      ? selectedVendors
                      : selectedAccounts
                  }
                  onSelectKey={(key) => {
                    if (chartDimension === "vendor") {
                      toggleMultiFilterItem(setSelectedVendors, key);
                    } else {
                      toggleMultiFilterItem(setSelectedAccounts, key);
                    }
                  }}
                />
              </div>

              {/* Right 5 Columns: Redesigned Capital Conversion Pipeline & GL Cost Pool Share */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-white p-5 rounded-2xl border border-sky-100/90 shadow-2xs">
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                      <h2 className="text-xs font-bold  tracking-wider text-slate-800">
                        Capital Conversion Pipeline
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/60">
                      AED · Where the money is
                    </span>
                  </div>
                  <FinancialPipeline3D
                    is3D={is3DEnabled}
                    prTotal={overviewStats.pr}
                    poTotal={overviewStats.po}
                    invTotal={overviewStats.inv}
                    paidTotal={overviewStats.paid}
                  />
                </div>

                <div className="bg-white p-5 rounded-2xl border border-violet-100/90 shadow-2xs">
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                      <h2 className="text-xs font-bold tracking-wider text-slate-800">
                        GL Cost Pool Share
                      </h2>
                    </div>
                    {selectedAccounts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedAccounts([])}
                        className="text-[11px] text-indigo-600 font-semibold"
                      >
                        Clear GL ({selectedAccounts.length})
                      </button>
                    )}
                  </div>
                  <CostPool3DDonut
                    is3D={is3DEnabled}
                    accounts={overviewStats.accountBars}
                    selectedAccounts={selectedAccounts}
                    onSelectAccount={(acct) =>
                      toggleMultiFilterItem(setSelectedAccounts, acct)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Collapsible PO Register (Hidden by Default) */}
            <div className="bg-white rounded-2xl border border-indigo-100/90 shadow-2xs overflow-hidden">
              <div
                onClick={() => setIsRegisterOpen((prev) => !prev)}
                className="px-5 py-4 bg-gradient-to-r from-indigo-50/60 via-white to-sky-50/50 flex items-center justify-between cursor-pointer hover:from-indigo-50/90 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
                    <Icons.TableRegister className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs font-bold  tracking-wider text-slate-900">
                        Purchase Order Register
                      </h2>
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                        {filteredPOs.length} Orders
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isRegisterOpen
                        ? "Select any row to open the full 5-stage PO Inspector"
                        : "Click to expand the Purchase Order Register table"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-3 py-1.5 rounded-xl">
                    {isRegisterOpen
                      ? "Hide Purchase Orders"
                      : "View Purchase Orders"}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-transform duration-300 ${
                      isRegisterOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <Icons.ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {isRegisterOpen && (
                <div className="border-t border-indigo-100/80">
                  <div className="px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Sort By:
                      </span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium"
                      >
                        <option value="po_desc">PO Number (Newest)</option>
                        <option value="val_desc">
                          Committed Spend (High → Low)
                        </option>
                        <option value="val_asc">
                          Committed Spend (Low → High)
                        </option>
                        <option value="date_desc">Created Date</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Rows:
                      </span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono"
                      >
                        <option value={15}>15</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-indigo-50/40 text-slate-500  tracking-wider font-bold border-b border-indigo-100/70 text-[10px]">
                          <th className="py-3 px-4">PO #</th>
                          <th className="py-3 px-4">Vendor</th>
                          <th className="py-3 px-4">PR & Scope</th>
                          <th className="py-3 px-4">GL Cost Pool</th>
                          <th className="py-3 px-4 text-center">GRNs / Invs</th>
                          <th className="py-3 px-4 text-right">Committed PO</th>
                          <th className="py-3 px-4 text-right">Settled</th>
                          <th className="py-3 px-4 text-right w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {paginatedPOs.map((po) => (
                          <tr
                            key={po.po}
                            onClick={() => inspectPO(po.po)}
                            className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                          >
                            <td className="py-3 px-4 font-mono">
                              <div className="font-bold text-indigo-950 group-hover:text-indigo-600">
                                #{po.po}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {po.date}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-800">
                                {po.vendor}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">
                                {po.vcode} {po.entity ? `· ${po.entity}` : ""}
                              </div>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <span className="bg-sky-50 text-sky-700 border border-sky-200/70 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md">
                                PR #{po.prs[0]?.no || "—"}
                              </span>
                              <div className="text-[11px] text-slate-500 truncate mt-1">
                                {po.desc.replace(/\r?\n|\r/g, " ")}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px]">
                              <div className="text-slate-800 font-medium">
                                {po.primaryAcctDesc}
                              </div>
                              <div className="text-indigo-600/80">
                                {po.primaryAcct}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-[10px]">
                              <span className="inline-block bg-teal-50 text-teal-700 border border-teal-200/60 px-2 py-0.5 rounded-md mr-1 font-semibold">
                                {po.grns.length} GRN
                              </span>
                              <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md font-semibold">
                                {po.invs.length} INV
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                              {formatAED(po.poTotal)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-teal-500 h-full rounded-full"
                                    style={{ width: `${po.paidPct}%` }}
                                  />
                                </div>
                                <span className="font-mono text-[11px] font-semibold text-slate-700">
                                  {po.paidPct}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  inspectPO(po.po);
                                }}
                                className="w-7 h-7 rounded-lg bg-indigo-50/70 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white border border-indigo-200/60 inline-flex items-center justify-center transition-all"
                              >
                                <Icons.ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span>
                        Page{" "}
                        <strong className="text-slate-900">
                          {currentPage}
                        </strong>{" "}
                        of{" "}
                        <strong className="text-slate-900">{totalPages}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40 font-medium"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40 font-medium"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ==================================================================
              WORKSPACE 2: PO INSPECTOR VIEW
          ================================================================== */
          currentRecord && (
            <div className="space-y-4">
              {/* Tinted Top Inspector Sub-Header */}
              <div className="bg-gradient-to-r from-indigo-50/80 via-white to-teal-50/60 px-5 py-3.5 rounded-2xl border border-indigo-200/70 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveWorkspace("overview")}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs transition-colors"
                  >
                    <Icons.ArrowLeft className="w-3.5 h-3.5" />
                    <span>Executive Overview</span>
                  </button>
                  <Icons.ChevronRight className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="bg-indigo-600 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
                    PO #{currentRecord.po}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 truncate max-w-md">
                    {currentRecord.vendor}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isLoadingDetail && (
                    <span className="text-[11px] text-indigo-600 font-medium animate-pulse">
                      Syncing PO...
                    </span>
                  )}
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                    Status: {currentRecord.st}
                  </span>
                  <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                    Workflow: {currentRecord.wf}
                  </span>
                </div>
              </div>

              {/* 5-Stage Color-Tinted Lifecycle Cards with Hover Pop-Up Effect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div className="bg-gradient-to-b from-sky-50/75 to-white p-4 rounded-2xl border border-sky-200/80 border-t-4 border-t-sky-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold  tracking-wider text-sky-700">
                      1 · PR Raised
                    </span>
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  </div>
                  <div className="text-base font-extrabold font-mono text-slate-900 mt-2">
                    {formatAED(currentRecord.prTotal)}
                  </div>
                  <div className="text-[11px] font-mono text-sky-700 font-medium mt-1">
                    PR #{currentRecord.prs[0]?.no || "—"}
                  </div>
                </div>

                <div className="bg-gradient-to-b from-indigo-50/75 to-white p-4 rounded-2xl border border-indigo-200/80 border-t-4 border-t-indigo-600 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold  tracking-wider text-indigo-700">
                      2 · PO Approved
                    </span>
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  </div>
                  <div className="text-base font-extrabold font-mono text-slate-900 mt-2">
                    {formatAED(currentRecord.poTotal)}
                  </div>
                  <div className="text-[11px] font-mono text-indigo-700 font-medium mt-1">
                    Issued {formatDisplayDate(currentRecord.date)}
                  </div>
                </div>

                <div className="bg-gradient-to-b from-teal-50/75 to-white p-4 rounded-2xl border border-teal-200/80 border-t-4 border-t-teal-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold  tracking-wider text-teal-700">
                      3 · Goods Received
                    </span>
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold">
                      {currentRecord.grns.length}
                    </span>
                  </div>
                  <div className="text-base font-extrabold font-mono text-slate-900 mt-2">
                    {currentRecord.grns.length} GRNs
                  </div>
                  <div className="text-[11px] font-mono text-teal-700 font-medium mt-1">
                    {currentRecord.poToGrnDays !== null
                      ? `${currentRecord.poToGrnDays}d from PO`
                      : "Pending GRN"}
                  </div>
                </div>

                <div className="bg-gradient-to-b from-amber-50/75 to-white p-4 rounded-2xl border border-amber-200/80 border-t-4 border-t-amber-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold  tracking-wider text-amber-800">
                      4 · Invoiced
                    </span>
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
                      {currentRecord.invPct}%
                    </span>
                  </div>
                  <div className="text-base font-extrabold font-mono text-slate-900 mt-2">
                    {formatAED(currentRecord.invTotal)}
                  </div>
                  <div className="text-[11px] font-mono text-amber-800 font-medium mt-1">
                    {currentRecord.invs.length} invoice(s) logged
                  </div>
                </div>

                <div className="bg-gradient-to-b from-emerald-50/75 to-white p-4 rounded-2xl border border-emerald-200/80 border-t-4 border-t-emerald-500 shadow-2xs hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold  tracking-wider text-emerald-800">
                      5 · Paid / Settled
                    </span>
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
                      {currentRecord.paidPct}%
                    </span>
                  </div>
                  <div className="text-base font-extrabold font-mono text-slate-900 mt-2">
                    {formatAED(currentRecord.paidTotal)}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-800 font-medium mt-1">
                    {currentRecord.paidOfInvPct}% of billed settled
                  </div>
                </div>
              </div>

              {/* Scope Details + Cycle-Time KPIs + 3D Value Flow */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-indigo-100/90 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold  tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200/60">
                        Scope & Cycle-Time Telemetry
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {currentRecord.vcode} · {currentRecord.entity}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-3">
                      {currentRecord.vendor}
                    </h3>

                    <div className="mt-2.5 bg-gradient-to-r from-indigo-50/40 via-sky-50/30 to-white p-3.5 rounded-xl border border-indigo-100/80 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                      {currentRecord.desc || "No description provided"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 mt-4 border-t border-slate-100 text-xs">
                    <div className="bg-teal-50/50 p-2.5 rounded-xl border-l-4 border-l-teal-500 border border-teal-100 hover:-translate-y-0.5 transition-transform">
                      <div className="text-lg font-extrabold font-mono text-slate-900">
                        {currentRecord.poToGrnDays ?? "—"}
                        <small className="text-[11px] font-normal text-slate-400 ml-0.5">
                          d
                        </small>
                      </div>
                      <span className="text-teal-800/80 block text-[10px] font-semibold">
                        PO created → first GRN
                      </span>
                    </div>

                    <div className="bg-indigo-50/50 p-2.5 rounded-xl border-l-4 border-l-indigo-500 border border-indigo-100 hover:-translate-y-0.5 transition-transform">
                      <div className="text-lg font-extrabold font-mono text-slate-900">
                        {currentRecord.poToInvDays ?? "—"}
                        <small className="text-[11px] font-normal text-slate-400 ml-0.5">
                          d
                        </small>
                      </div>
                      <span className="text-indigo-800/80 block text-[10px] font-semibold">
                        PO created → first invoice
                      </span>
                    </div>

                    <div className="bg-amber-50/50 p-2.5 rounded-xl border-l-4 border-l-amber-500 border border-amber-100 hover:-translate-y-0.5 transition-transform">
                      <div className="text-lg font-extrabold font-mono text-slate-900">
                        {currentRecord.grnToInvDays ?? "—"}
                        <small className="text-[11px] font-normal text-slate-400 ml-0.5">
                          d
                        </small>
                      </div>
                      <span className="text-amber-800/80 block text-[10px] font-semibold">
                        Avg GRN → invoice upload
                      </span>
                    </div>

                    <div className="bg-slate-50/90 p-2.5 rounded-xl border-l-4 border-l-slate-400 border border-slate-200/70 hover:-translate-y-0.5 transition-transform">
                      <div className="text-lg font-extrabold font-mono text-slate-900">
                        {currentRecord.daysSinceLastActivity ?? "—"}
                        <small className="text-[11px] font-normal text-slate-400 ml-0.5">
                          d
                        </small>
                      </div>
                      <span className="text-slate-600 block text-[10px] font-semibold">
                        Since last activity
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-sky-100/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      PO #{currentRecord.po} — Where the money is
                    </h3>
                    <span className="text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      AED
                    </span>
                  </div>
                  <FinancialPipeline3D
                    is3D={is3DEnabled}
                    prTotal={currentRecord.prTotal}
                    poTotal={currentRecord.poTotal}
                    invTotal={currentRecord.invTotal}
                    paidTotal={currentRecord.paidTotal}
                  />
                </div>
              </div>

              {/* 4-Tab Timeline Section (wrapped in an error boundary that resets per PO) */}
              <TimelineErrorBoundary resetKey={currentRecord.po}>
                <DocumentTimelineSection record={currentRecord} />
              </TimelineErrorBoundary>

              {/* Color-Tinted Line Items Table */}
              <div className="bg-white rounded-2xl border border-indigo-100/90 shadow-2xs overflow-hidden">
                <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-50/60 via-white to-sky-50/50 border-b border-indigo-100/80 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <h3 className="text-xs font-bold  tracking-wider text-slate-900">
                      Line Items ({currentRecord.lines.length})
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/60">
                    {currentRecord.invPct}% Billed
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-indigo-50/35 text-slate-500  text-[10px] font-bold border-b border-indigo-100/70">
                        <th className="py-3 px-4">Item & GL Account</th>
                        <th className="py-3 px-4 text-right">Qty</th>
                        <th className="py-3 px-4 text-right">Unit Price</th>
                        <th className="py-3 px-4 text-right">Line Value</th>
                        <th className="py-3 px-4 text-right">Invoiced</th>
                        <th className="py-3 px-4 text-right">Paid</th>
                        <th className="py-3 px-4 text-right">Billed %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {currentRecord.lines.map((line, idx) => {
                        const billedPct =
                          line.cost > 0
                            ? Math.round((line.inv / line.cost) * 100)
                            : 0;
                        return (
                          <tr
                            key={idx}
                            className="hover:bg-indigo-50/25 transition-colors"
                          >
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-900">
                                {line.item}
                              </div>
                              <div className="inline-block mt-1 text-[10px] font-mono font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/60">
                                {line.acct} · {line.acctDesc}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-medium">
                              {Number(line.qty || 0).toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono">
                              {Number(line.up || 0).toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                              {formatAED(line.cost)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-semibold text-amber-700 bg-amber-50/25">
                              {formatAED(line.inv)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-teal-700 bg-teal-50/25">
                              {formatAED(line.paid)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-2 py-0.5 rounded-md font-bold text-[11px]">
                                {billedPct}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gradient-to-r from-indigo-50/70 via-slate-50 to-teal-50/50 font-bold text-slate-900 border-t border-indigo-100">
                        <td colSpan="3" className="py-3.5 px-4">
                          Total
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-indigo-950">
                          {formatAED(currentRecord.poTotal)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-amber-800">
                          {formatAED(currentRecord.invTotal)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-teal-800">
                          {formatAED(currentRecord.paidTotal)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-emerald-800">
                          {currentRecord.invPct}%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Goods Receipts & Vendor Invoices Document Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-teal-100/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                      <h3 className="text-xs font-bold  tracking-wider text-slate-800">
                        Goods Receipts (GRNs)
                      </h3>
                    </div>
                    <span className="bg-teal-50 text-teal-700 border border-teal-200/60 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md">
                      {currentRecord.grns.length}
                    </span>
                  </div>
                  {currentRecord.grns.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">
                      No goods receipts recorded for this PO.
                    </p>
                  ) : (
                    <ul className="divide-y divide-slate-100 text-xs max-h-56 overflow-y-auto pr-1">
                      {currentRecord.grns.map((g, idx) => (
                        <li
                          key={`${g.no}-${idx}`}
                          className="py-2 flex items-center justify-between gap-2"
                        >
                          <span className="font-mono font-bold text-teal-900">
                            GRN #{g.no}
                          </span>
                          <span className="font-mono text-slate-500">
                            {formatDisplayDate(g.cleanDate)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-amber-100/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <h3 className="text-xs font-bold  tracking-wider text-slate-800">
                        Vendor Invoices
                      </h3>
                    </div>
                    <span className="bg-amber-50 text-amber-800 border border-amber-200/60 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md">
                      {currentRecord.invs.length}
                    </span>
                  </div>
                  {currentRecord.invs.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">
                      No vendor invoices uploaded for this PO.
                    </p>
                  ) : (
                    <ul className="divide-y divide-slate-100 text-xs max-h-56 overflow-y-auto pr-1">
                      {currentRecord.invs.map((inv, idx) => (
                        <li
                          key={`${inv.no}-${idx}`}
                          className="py-2 flex items-center justify-between gap-2"
                        >
                          <span className="font-mono font-bold text-amber-900">
                            {inv.no}
                          </span>
                          <span className="font-mono text-slate-500">
                            Uploaded {formatDisplayDate(inv.cleanDate)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
