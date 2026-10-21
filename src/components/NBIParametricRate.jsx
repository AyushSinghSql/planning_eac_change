// Version: 1.0

// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { backendUrl } from "./config";

// const NBIParametricRate = () => {
//   // Data States
//   const [loading, setLoading] = useState(true);
//   const [isDataLoading, setIsDataLoading] = useState(false);
//   const [allProjects, setAllProjects] = useState([]);
//   const [perimetricData, setPerimetricData] = useState([]);

//   // Selection States
//   const [selectedContractType, setSelectedContractType] = useState("");
//   const [selectedDriverGroup, setSelectedDriverGroup] = useState("");
//   const [selectedProjectIds, setSelectedProjectIds] = useState([]);
//   const [projectSearch, setProjectSearch] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // Refs
//   const dropdownRef = useRef(null);
//   const hasFetchedProjects = useRef(false);

//   // Business Logic Mapping
//   const typeMapping = {
//     "T&M": "T&M",
//     "FFP": "FIXED PRICE",
//     "Cost Plus": "CPFF"
//   };

//   const contractLogic = {
//     "T&M": ["Internal & External Efforts", "Internal Efforts", "External Efforts"],
//     "FFP": ["Direct Cost Basis"],
//     "Cost Plus": ["Total Cost Basis"]
//   };

//   const columns = [
//     { label: "Labor Onsite", key: "labOnste", readOnly: true },
//     { label: "Labor Offsite", key: "labOffste", readOnly: true },
//     { label: "Non Labor", key: "nonLabTrvl", readOnly: true },
//     { label: "Subcontractor Labor", key: "subLab", readOnly: true },
//     { label: "Subcontractor NonLabor", key: "subNonLab", readOnly: true }
//   ];

//   // 1. Initial Load - Fetches Project list only once
//   useEffect(() => {
//     if (hasFetchedProjects.current) return;
//     const fetchProjects = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${backendUrl}/Project/GetAllProjects`);
//         const data = await res.json();
//         setAllProjects(data);
//         hasFetchedProjects.current = true;
//       } catch (err) { console.error(err); } finally { setLoading(false); }
//     };
//     fetchProjects();
//   }, []);

//   // 2. Fetch Perimetric Data - Triggered by "Calculate Rate"
//   const handleCalculateRate = async () => {
//     if (selectedProjectIds.length === 0) {
//         alert("Please select projects to calculate.");
//         return;
//     }
//     try {
//       setIsDataLoading(true);
//       const response = await fetch(`${backendUrl}/api/ForecastReport/GetPerimetricValuesByProjIdsAsync`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ projIds: selectedProjectIds })
//       });
//       const result = await response.json();
//       setPerimetricData(result);
//     } catch (err) { console.error(err); } finally { setIsDataLoading(false); }
//   };

//   // 3. Calculation Engine
//   const parametricRates = useMemo(() => {
//     if (!perimetricData || perimetricData.length === 0) {
//         return { labOnste: 0, labOffste: 0, nonLabTrvl: 0, subLab: 0, subNonLab: 0 };
//     }

//     // DENOMINATOR (Basis)
//     const totalBasis = perimetricData
//       .filter(item => {
//         if (selectedDriverGroup === "Total Cost Basis") return true;
//         return parseInt(item.subTotTypeNo) !== 4;
//       })
//       .reduce((sum, item) => sum + (item.ytdIncurAmt || 0) + (item.pyIncurAmt || 0), 0);

//     if (totalBasis === 0) return { labOnste: 0, labOffste: 0, nonLabTrvl: 0, subLab: 0, subNonLab: 0 };

//     const getSum = (filterFn) => perimetricData
//       .filter(filterFn)
//       .reduce((sum, item) => sum + (item.ytdIncurAmt || 0) + (item.pyIncurAmt || 0), 0);

//     // --- NUMERATOR (NOMINATOR) LOGIC ---

//     // 1. LABOR ONSITE
//     const onsiteSum = getSum(item =>
//       item.accountType === 'LABOR' &&
//       item.costType === 'DIRECT' &&
//       item.budgetSheet?.trim() === 'Staff Hours' &&
//       item.acctId?.trim() !== '50-000-999' &&
//       [2, 3].includes(parseInt(item.subTotTypeNo))
//     );

//     // 2. LABOR OFFSITE (New Logic)
//     const offsiteSum = getSum(item =>
//       [
//         '50-400-000', '50-400-001', '50-400-002',
//         '50-400-004', '50-400-005', '50-400-006',
//         '50-400-007', '50-400-008'
//       ].includes(item.acctId?.trim()) &&
//       [2, 3].includes(parseInt(item.subTotTypeNo))
//     );

//     // 3. SUBCONTRACTOR LABOR
//     const subLabSum = getSum(item =>
//       ['51-000-000', '51-MJC-097', '51-MJI-097', '51-MJO-097'].includes(item.acctId?.trim())
//     );

//     // 4. SUBCONTRACTOR NON-LABOR
//     const subNonLabSum = getSum(item =>
//       ['50-300-000', '51-300-000', '51-400-000'].includes(item.acctId?.trim())
//     );

//     // 5. NON-LABOR
//     const nonLaborSum = getSum(item => item.accountType === "NON-LABOR");

//     return {
//       labOnste: (onsiteSum / totalBasis) * 100,
//       labOffste: (offsiteSum / totalBasis) * 100,
//       nonLabTrvl: (nonLaborSum / totalBasis) * 100,
//       subLab: (subLabSum / totalBasis) * 100,
//       subNonLab: (subNonLabSum / totalBasis) * 100
//     };
//   }, [perimetricData, selectedDriverGroup]);

//   // UI Handlers
//   useEffect(() => {
//     if (selectedContractType) setSelectedDriverGroup(contractLogic[selectedContractType][0]);
//     setSelectedProjectIds([]);
//     setPerimetricData([]);
//   }, [selectedContractType]);

//   useEffect(() => {
//     const handleClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false); };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   const filteredProjects = allProjects.filter(p => p.type === typeMapping[selectedContractType]);
//   const searchedProjects = filteredProjects.filter(p =>
//     p.projectId.toLowerCase().includes(projectSearch.toLowerCase()) ||
//     p.name.toLowerCase().includes(projectSearch.toLowerCase())
//   );

//   const handleSelectAll = () => {
//     if (selectedProjectIds.length === filteredProjects.length) {
//       setSelectedProjectIds([]);
//     } else {
//       setSelectedProjectIds(filteredProjects.map(p => p.projectId));
//     }
//   };

//   const isColumnActive = (colKey) => {
//     if (selectedDriverGroup === "Internal Efforts") return ["labOnste", "labOffste", "nonLabTrvl"].includes(colKey);
//     if (selectedDriverGroup === "External Efforts") return ["nonLabTrvl", "subLab", "subNonLab"].includes(colKey);
//     return true;
//   };

//   if (loading) return <div className="p-20 text-center  italic">Loading...</div>;

//   return (
//     <div className="max-w-full mx-auto p-6 bg-slate-50 min-h-screen font-sans text-slate-800">

//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-xl  text-slate-900 flex items-center gap-2">Parametric Rate </h1>
//           <button
//             onClick={handleCalculateRate}
//             disabled={isDataLoading || selectedProjectIds.length === 0}
//             className={`px-6 py-2 rounded-lg  transition-all shadow-md ${
//               isDataLoading || selectedProjectIds.length === 0 ? "bg-slate-300 text-slate-500" : "bg-indigo-600 text-white hover:bg-indigo-700"
//             }`}
//           >
//             {isDataLoading ? "Calculating..." : "Calculate Rate"}
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="flex flex-col gap-1.5">
//             <label className="text-[10px] font-black  ">Contract Type</label>
//             <select className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none  text-slate-700" value={selectedContractType} onChange={(e) => setSelectedContractType(e.target.value)}>
//               <option value="">-- Choose Type --</option>
//               {Object.keys(contractLogic).map(t => <option key={t} value={t}>{t}</option>)}
//             </select>
//           </div>

//           <div className="flex flex-col gap-1.5">
//             <label className="text-[10px] font-black  ">Driver Group</label>
//             <select className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none  text-slate-700 disabled:opacity-50" disabled={!selectedContractType} value={selectedDriverGroup} onChange={(e) => setSelectedDriverGroup(e.target.value)}>
//               {selectedContractType && contractLogic[selectedContractType].map(d => <option key={d} value={d}>{d}</option>)}
//             </select>
//           </div>

//           <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
//             <label className="text-[10px] font-black  ">Project Selection</label>
//             <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer flex justify-between items-center" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
//               <span className="text-sm  truncate">{selectedProjectIds.length === 0 ? "Select Projects" : `${selectedProjectIds.length} Selected`}</span>
//               <span className="text-[10px]">▼</span>
//             </div>
//             {isDropdownOpen && (
//               <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-2xl z-50 max-h-64 flex flex-col overflow-hidden">
//                 <input type="text" placeholder="Search..." className="p-3 text-sm border-b outline-none bg-slate-50" value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} />
//                 <div className="overflow-y-auto">
//                    <div
//                     className="p-3 hover:bg-indigo-50 cursor-pointer text-[10px] font-black text-indigo-600 border-b flex items-center gap-2"
//                     onClick={handleSelectAll}
//                    >
//                      <input type="checkbox" checked={selectedProjectIds.length === filteredProjects.length && filteredProjects.length > 0} readOnly />
//                      SELECT ALL PROJECTS
//                    </div>
//                    {searchedProjects.map(p => (
//                     <div key={p.projectId} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50" onClick={() => setSelectedProjectIds(prev => prev.includes(p.projectId) ? prev.filter(i => i !== p.projectId) : [...prev, p.projectId])}>
//                       <input type="checkbox" checked={selectedProjectIds.includes(p.projectId)} readOnly />
//                       <div className="flex flex-col">
//                         <span className="text-xs  text-slate-700">{p.projectId}</span>
//                         <span className="text-[10px] truncate w-48">{p.name}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-900 text-white">
//               <th className="p-5 text-[10px] font-black  border-r border-slate-700 min-w-[200px]">Basis of Estimate</th>
//               {columns.map(col => (
//                 <th key={col.key} className="p-5 text-[10px] font-black  text-center border-r border-slate-700 last:border-0">{col.label}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             <tr className="hover:bg-slate-50/50 transition-colors">
//               <td className="p-5">
//                 <span className="text-sm font-black text-slate-700  tracking-tight">Parametric Rate (%)</span>
//                 <p className="text-[10px] ">{selectedDriverGroup === "Total Cost Basis" ? "(Full Basis)" : "(Direct Basis)"}</p>
//               </td>
//               {columns.map(col => {
//                 const active = isColumnActive(col.key);
//                 const isCalculated = col.readOnly;
//                 const value = isCalculated ? `${parametricRates[col.key]?.toFixed(2) || "0.00"}%` : "";

//                 return (
//                   <td key={col.key} className={`p-4 border-r border-slate-50 last:border-0 ${!active ? 'bg-slate-50/50' : ''}`}>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         disabled={!active || isCalculated}
//                         placeholder={active ? "0.00" : "—"}
//                         value={isCalculated ? value : undefined}
//                         className={`w-full text-center p-3 rounded-lg outline-none  text-sm transition-all
//                           ${isCalculated ? 'bg-indigo-50 text-indigo-700 font-black border border-indigo-200' :
//                             active ? 'bg-white border border-slate-200 text-slate-600  focus:ring-2 focus:ring-indigo-500 shadow-sm' :
//                             'bg-transparent text-slate-300'}`}
//                       />
//                     </div>
//                   </td>
//                 );
//               })}
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default NBIParametricRate;

import React, { useState, useEffect, useRef, useMemo } from "react";
import { backendUrl } from "./config";
import { MdTableChart } from "react-icons/md";

const NBIParametricRate = () => {
  // ── Page Tab ──
  const [activeTab, setActiveTab] = useState("calculate"); // "calculate" | "rates"

  // ── Shared Data ──
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const hasFetchedProjects = useRef(false);

  // ── Calculate Tab State ──
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [perimetricData, setPerimetricData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [selectedContractType, setSelectedContractType] = useState("");
  const [selectedDriverGroup, setSelectedDriverGroup] = useState("");
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [projectSearch, setProjectSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const calcDropdownRef = useRef(null);

  // ── Rates Tab State ──
  const [ratesData, setRatesData] = useState([]);
  const [isRatesLoading, setIsRatesLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // "success" | "error" | null
  const [ratesProjectSearch, setRatesProjectSearch] = useState("");
  const [ratesSelectedIds, setRatesSelectedIds] = useState([]);
  const [isRatesDropdownOpen, setIsRatesDropdownOpen] = useState(false);
  const ratesDropdownRef = useRef(null);
  const hasFetchedRates = useRef(false);
  // const [closingPeriod, setClosingPeriod] = useState(null); // fetched once from config
  const [closingPeriod, setClosingPeriod] = useState(null);
  const closingPeriodRef = useRef(null);

  // ── Business Logic ──
  const typeMapping = { "T&M": "T&M", FFP: "FIXED PRICE", "Cost Plus": "CPFF" };
  const contractLogic = {
    "T&M": [
      "Internal & External Efforts",
      "Internal Efforts",
      "External Efforts",
    ],
    FFP: ["Direct Cost Basis"],
    "Cost Plus": ["Total Cost Basis"],
  };
  const columns = [
    { label: "Labor Onsite", key: "labOnste" },
    { label: "Labor Offsite", key: "labOffste" },
    { label: "Non Labor", key: "nonLabTrvl" },
    { label: "Subcontractor Labor", key: "subLab" },
    { label: "Subcontractor NonLabor", key: "subNonLab" },
  ];

  const ratesColumns = [
    { label: "Contract Type", key: "contractType", type: "text" },
    { label: "Driver Group", key: "driverGrp", type: "text" },
    { label: "Labor Onsite", key: "labOnste", type: "rate" },
    { label: "Labor Offsite", key: "labOffste", type: "rate" },
    { label: "Non Labor", key: "nonLab", type: "rate" },
    { label: "Sub Labor", key: "subLab", type: "rate" },
    { label: "Sub Non Labor", key: "subNonLab", type: "rate" },
    { label: "Closed Period", key: "clsPd", type: "date" },
  ];

  // ── 1. Fetch All Projects + Closing Period (once) ──
  useEffect(() => {
    if (hasFetchedProjects.current) return;
    hasFetchedProjects.current = true;
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/Project/GetAllProjects`);
        const data = await res.json();
        setAllProjects(data);

        // Fetch closing period once using first available project
        // const firstProjId = Array.isArray(data) && data.length > 0 ? data[0].projectId : null;
        // const firstProjId = Array.isArray(data) && data.length > 0 ? data[0].projectId : null;
        // const firstProjId = Array.isArray(data) && data.length > 0
        //   ? (data[0].projectId ?? data[0].projId ?? data[0].ProjectId ?? null)
        //   : null;
        // console.log("firstProjId resolved:", firstProjId);
        //       console.log("firstProjId:", firstProjId);
        //       console.log("first project object:", data[0]);
        // if (firstProjId) {
        //   try {
        //     const cfgRes = await fetch(`${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`);
        //     if (cfgRes.ok) {
        //       const cfgData = await cfgRes.json();
        //       const entry = (Array.isArray(cfgData) ? cfgData : [cfgData])
        //         .find(c => c.name === "closing_period");
        //       // if (entry?.value) setClosingPeriod(entry.value);
        //       if (entry?.value) {
        //     setClosingPeriod(entry.value);
        //     closingPeriodRef.current = entry.value;
        //   }
        //   }
        //   } catch (e) {
        //     console.warn("Could not fetch closing period:", e);
        //   }
        // }

        const firstProjId =
          Array.isArray(data) && data.length > 0 ? data[0].projectId : null;
        if (firstProjId) {
          try {
            const cfgRes = await fetch(
              `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/${firstProjId}`,
            );
            if (cfgRes.ok) {
              const cfgData = await cfgRes.json();
              const entry = (Array.isArray(cfgData) ? cfgData : [cfgData]).find(
                (c) => c.name === "closing_period",
              );
              console.log("closing_period entry:", entry);
              if (entry?.value) setClosingPeriod(entry.value);
            }
          } catch (e) {
            console.warn("Could not fetch closing period:", e);
          }
        }
      } catch (err) {
        console.error(err);
        hasFetchedProjects.current = false;
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ── 2. Fetch Rates when Rates tab is opened ──
  const fetchRates = async () => {
    try {
      setIsRatesLoading(true);
      const res = await fetch(`${backendUrl}/api/NbiPrmtrcRt`);
      const data = await res.json();
      setRatesData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Rates fetch error:", err);
      setRatesData([]);
    } finally {
      setIsRatesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "rates") return;
    if (hasFetchedRates.current) return;
    hasFetchedRates.current = true;
    fetchRates();
  }, [activeTab]);

  const handleRefreshRates = () => {
    hasFetchedRates.current = false;
    fetchRates();
  };

  // ── Save Rates (uses pre-fetched closingPeriod) ──
  const handleSaveRates = async () => {
    if (selectedProjectIds.length === 0) {
      toast.info("Please select projects and calculate rates first.");
      return;
    }
    try {
      setIsSaving(true);
      setSaveStatus(null);

      // const savePayloads = selectedProjectIds.map(projId => ({
      //   contractType: selectedContractType,
      //   driverGrp:    selectedDriverGroup,
      //   projId,
      //   labOnste:  parseFloat(parametricRates.labOnste.toFixed(4)),
      //   labOffste: parseFloat(parametricRates.labOffste.toFixed(4)),
      //   nonLab:    parseFloat(parametricRates.nonLabTrvl.toFixed(4)),
      //   subLab:    parseFloat(parametricRates.subLab.toFixed(4)),
      //   subNonLab: parseFloat(parametricRates.subNonLab.toFixed(4)),
      //   clsPd:     closingPeriod ?? null,
      // }));

      const now = new Date().toISOString();
      const fyCode = closingPeriod
        ? new Date(closingPeriod).getFullYear().toString()
        : new Date().getFullYear().toString();

      const savePayloads = selectedProjectIds.map((projId) => ({
        // paraId:       0,
        contractType: selectedContractType,
        driverGrp: selectedDriverGroup,
        projId,
        labOnste: parseFloat(parametricRates.labOnste.toFixed(4)),
        labOffste: parseFloat(parametricRates.labOffste.toFixed(4)),
        nonLab: parseFloat(parametricRates.nonLabTrvl.toFixed(4)),
        subLab: parseFloat(parametricRates.subLab.toFixed(4)),
        subNonLab: parseFloat(parametricRates.subNonLab.toFixed(4)),
        // clsPd:        closingPeriod ?? null,
        clsPd: closingPeriodRef.current ?? closingPeriod ?? null,
        fyCd: fyCode,
        modifiedBy: "current_user",
        timeStamp: now,
      }));

      // const saveRes = await fetch(`${backendUrl}/api/NbiPrmtrcRt`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(savePayloads[0])
      // });

      // if (saveRes.ok) {
      //   setSaveStatus("success");
      //   hasFetchedRates.current = false; // invalidate rates cache
      // } else {
      //   setSaveStatus("error");
      // }
      const results = await Promise.all(
        savePayloads.map((payload) =>
          fetch(`${backendUrl}/api/NbiPrmtrcRt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }),
        ),
      );

      if (results.every((r) => r.ok)) {
        setSaveStatus("success");
        hasFetchedRates.current = false;
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      console.error("Save Rates error:", err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  // ── 3. Calculate Rate ──
  const handleCalculateRate = async () => {
    if (selectedProjectIds.length === 0) {
      toast.info("Please select projects to calculate.");
      return;
    }
    try {
      setIsDataLoading(true);
      const perimetricRes = await fetch(
        `${backendUrl}/api/ForecastReport/GetPerimetricValuesByProjIdsAsync`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projIds: selectedProjectIds }),
        },
      );
      const perimetricResult = await perimetricRes.json();
      setPerimetricData(perimetricResult || []);

      if (selectedDriverGroup === "Direct Cost Basis") {
        const headerRes = await fetch(
          `${backendUrl}/api/ForecastReport/GetPSRHeaderData`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        if (headerRes.ok) {
          const headerResult = await headerRes.json();
          setHeaderData(
            Array.isArray(headerResult) ? headerResult : [headerResult],
          );
        } else {
          setHeaderData([]);
        }
      }
    } catch (err) {
      console.error("Calculation Error:", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  // ── 4. Calculation Engine ──
  const parametricRates = useMemo(() => {
    const zero = {
      labOnste: 0,
      labOffste: 0,
      nonLabTrvl: 0,
      subLab: 0,
      subNonLab: 0,
    };
    if (!perimetricData || perimetricData.length === 0) return zero;

    let totalBasis = 0;
    if (selectedDriverGroup === "Direct Cost Basis") {
      totalBasis = headerData
        .filter((item) => selectedProjectIds.includes(item.projId))
        .reduce((sum, item) => sum + (parseFloat(item.billedAmt) || 0), 0);
    } else {
      totalBasis = perimetricData
        .filter((item) =>
          selectedDriverGroup === "Total Cost Basis"
            ? true
            : parseInt(item.subTotTypeNo) !== 4,
        )
        .reduce(
          (sum, item) =>
            sum +
            (parseFloat(item.ytdIncurAmt) || 0) +
            (parseFloat(item.pyIncurAmt) || 0),
          0,
        );
    }
    if (totalBasis === 0) return zero;

    const getSum = (fn) =>
      perimetricData
        .filter(fn)
        .reduce(
          (sum, item) =>
            sum +
            (parseFloat(item.ytdIncurAmt) || 0) +
            (parseFloat(item.pyIncurAmt) || 0),
          0,
        );

    const onsiteSum = getSum(
      (item) =>
        String(item.accountType || "")
          .trim()
          .toUpperCase() === "LABOR" &&
        String(item.costType || "")
          .trim()
          .toUpperCase() === "DIRECT" &&
        String(item.budgetSheet || "").trim() === "Staff Hours" &&
        String(item.acctId || "").trim() !== "50-000-999" &&
        [2, 3].includes(parseInt(item.subTotTypeNo)),
    );
    const offsiteSum = getSum(
      (item) =>
        [
          "50-400-000",
          "50-400-001",
          "50-400-002",
          "50-400-004",
          "50-400-005",
          "50-400-006",
          "50-400-007",
          "50-400-008",
        ].includes(String(item.acctId || "").trim()) &&
        [2, 3].includes(parseInt(item.subTotTypeNo)),
    );
    const subLabSum = getSum((item) =>
      ["51-000-000", "51-MJC-097", "51-MJI-097", "51-MJO-097"].includes(
        String(item.acctId || "").trim(),
      ),
    );
    const subNonLabSum = getSum((item) =>
      ["50-300-000", "51-300-000", "51-400-000"].includes(
        String(item.acctId || "").trim(),
      ),
    );
    const nonLaborSum = getSum(
      (item) =>
        String(item.accountType || "")
          .trim()
          .toUpperCase() === "NON-LABOR",
    );

    return {
      labOnste: (onsiteSum / totalBasis) * 100,
      labOffste: (offsiteSum / totalBasis) * 100,
      nonLabTrvl: (nonLaborSum / totalBasis) * 100,
      subLab: (subLabSum / totalBasis) * 100,
      subNonLab: (subNonLabSum / totalBasis) * 100,
    };
  }, [perimetricData, headerData, selectedProjectIds, selectedDriverGroup]);

  // ── UI Lifecycle ──
  useEffect(() => {
    if (selectedContractType)
      setSelectedDriverGroup(contractLogic[selectedContractType][0]);
    setSelectedProjectIds([]);
    setPerimetricData([]);
    setHeaderData([]);
  }, [selectedContractType]);

  useEffect(() => {
    const handler = (e) => {
      if (
        calcDropdownRef.current &&
        !calcDropdownRef.current.contains(e.target)
      )
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (
        ratesDropdownRef.current &&
        !ratesDropdownRef.current.contains(e.target)
      )
        setIsRatesDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Helpers ──
  const filteredProjects = allProjects.filter(
    (p) => p.type === typeMapping[selectedContractType],
  );
  const searchedProjects = filteredProjects.filter(
    (p) =>
      p.projectId.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.name.toLowerCase().includes(projectSearch.toLowerCase()),
  );
  const searchedRatesProjects = allProjects.filter(
    (p) =>
      p.projectId.toLowerCase().includes(ratesProjectSearch.toLowerCase()) ||
      p.name.toLowerCase().includes(ratesProjectSearch.toLowerCase()),
  );

  const isColumnActive = (colKey) => {
    if (selectedDriverGroup === "Internal Efforts")
      return ["labOnste", "labOffste", "nonLabTrvl"].includes(colKey);
    if (selectedDriverGroup === "External Efforts")
      return ["nonLabTrvl", "subLab", "subNonLab"].includes(colKey);
    return true;
  };

  const formatRate = (val) => {
    if (val === null || val === undefined || val === "") return "—";
    const num = parseFloat(val);
    return isNaN(num) ? "—" : `${num.toFixed(2)}%`;
  };
  const getProjId = (row) => row.projectId ?? row.projId ?? row.ProjectId ?? "";
  const getProjName = (row) => {
    const id = getProjId(row);
    const match = allProjects.find((p) => p.projectId === id);
    return match
      ? match.name
      : (row.projectName ?? row.projName ?? row.name ?? row.Name ?? "—");
  };

  const displayedRates =
    ratesSelectedIds.length > 0
      ? ratesData.filter((r) => ratesSelectedIds.includes(getProjId(r)))
      : ratesData;

  if (loading)
    return (
      <div className="p-20 text-center  italic">Loading Application...</div>
    );

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 bg-white rounded-sm  p-4">
        <MdTableChart size={20} className="text-blue-500" />
        <h2 className="text-lg font-bold text-gray-800">NBI Parametric Rate</h2>
      </div>

      <div className="max-w-full mx-auto bg-slate-50 mt-2 min-h-screen text-slate-800">
        {/* ══ Page-Level Tab Bar ══ */}
        <div className="bg-white border-b border-slate-200 px-6 pt-5">
          <div className="flex items-end gap-0">
            {[
              { id: "calculate", label: "Calculate Rate" },
              { id: "rates", label: "Rates" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-md captialize transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "text-indigo-600 border-indigo-600 bg-white"
                    : "border-transparent hover:text-slate-600 hover:border-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════
          TAB: CALCULATE RATE
      ════════════════════════════════════════ */}
        {activeTab === "calculate" && (
          <div className="p-6 space-y-6">
            {/* Controls Card */}
            {/* <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4"> */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
              <div className="flex justify-end items-center mb-2">
                {/* <h1 className="text-xl  text-slate-900">Parametric Rate</h1> */}
                <button
                  onClick={handleCalculateRate}
                  disabled={isDataLoading || selectedProjectIds.length === 0}
                  className={`px-6 py-2 rounded-lg transition-all shadow-md ${
                    isDataLoading || selectedProjectIds.length === 0
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isDataLoading ? "Calculating..." : "Calculate Rate"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contract Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px]   captialize">
                    Contract Type
                  </label>
                  <select
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none  text-slate-700"
                    value={selectedContractType}
                    onChange={(e) => setSelectedContractType(e.target.value)}
                  >
                    <option value="">-- Choose Type --</option>
                    {Object.keys(contractLogic).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Driver Group */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px]   captialize">
                    Driver Group
                  </label>
                  <select
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none  text-slate-700 disabled:opacity-50"
                    disabled={!selectedContractType}
                    value={selectedDriverGroup}
                    onChange={(e) => setSelectedDriverGroup(e.target.value)}
                  >
                    {selectedContractType &&
                      contractLogic[selectedContractType].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Project Dropdown */}
                <div
                  className="flex flex-col gap-1.5 relative"
                  ref={calcDropdownRef}
                >
                  <label className="text-[10px]   captialize">
                    Project Selection
                  </label>
                  <div
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer flex justify-between items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="text-sm  truncate text-slate-700">
                      {selectedProjectIds.length === 0
                        ? "Select Projects"
                        : `${selectedProjectIds.length} Selected`}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isDropdownOpen ? "▲" : "▼"}
                    </span>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
                      <input
                        type="text"
                        placeholder="Search by ID or name..."
                        className="p-3 text-sm border-b border-slate-100 outline-none bg-white"
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="overflow-y-auto max-h-60">
                        <div
                          className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 flex items-center gap-2"
                          onClick={() =>
                            setSelectedProjectIds(
                              selectedProjectIds.length ===
                                filteredProjects.length
                                ? []
                                : filteredProjects.map((p) => p.projectId),
                            )
                          }
                        >
                          <input
                            type="checkbox"
                            className="accent-indigo-600"
                            checked={
                              selectedProjectIds.length ===
                                filteredProjects.length &&
                              filteredProjects.length > 0
                            }
                            readOnly
                          />
                          <span className="text-[10px] text-indigo-600  captialize">
                            Select All
                          </span>
                        </div>
                        {searchedProjects.length === 0 ? (
                          <div className="p-4 text-center text-xs italic">
                            {selectedContractType
                              ? "No matching projects"
                              : "Choose a contract type first"}
                          </div>
                        ) : (
                          searchedProjects.map((p) => (
                            <div
                              key={p.projectId}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50"
                              onClick={() =>
                                setSelectedProjectIds((prev) =>
                                  prev.includes(p.projectId)
                                    ? prev.filter((i) => i !== p.projectId)
                                    : [...prev, p.projectId],
                                )
                              }
                            >
                              <input
                                type="checkbox"
                                className="accent-indigo-600 shrink-0"
                                checked={selectedProjectIds.includes(
                                  p.projectId,
                                )}
                                readOnly
                              />
                              <span className="text-[10px]  text-white bg-slate-700 px-2 py-0.5 rounded shrink-0 tracking-wide">
                                {p.projectId}
                              </span>
                              <span className="text-xs text-slate-500 truncate">
                                {p.name}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save Rates Button + Status */}
            <div className="flex items-center justify-end gap-4">
              {saveStatus === "success" && (
                <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  ✓ Rates saved successfully
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-xs  text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                  ✗ Save failed — please try again
                </span>
              )}
              <button
                onClick={handleSaveRates}
                disabled={
                  isSaving ||
                  perimetricData.length === 0 ||
                  selectedProjectIds.length === 0
                }
                className={`flex items-center gap-2 px-6 py-2 rounded-lg  text-sm transition-all shadow-md ${
                  isSaving ||
                  perimetricData.length === 0 ||
                  selectedProjectIds.length === 0
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h3m4-2h4l3 3v10a2 2 0 01-2 2h-1M9 12l2 2 4-4"
                  />
                </svg>
                {isSaving ? "Saving..." : "Save Rates"}
              </button>
            </div>

            {/* Results Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-5 text-[10px]  border-r border-slate-700 min-w-[200px] tracking-wider captialize">
                      Basis of Estimate
                    </th>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="p-5 text-[10px]  text-center border-r border-slate-700 last:border-0 tracking-wider captialize"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors border-r border-black-700 last:border-0 ">
                    <td className="p-5 border-r border-slate-700">
                      <span className="text-sm  text-slate-700 tracking-tight">
                        Parametric Rate (%)
                      </span>
                    </td>
                    {columns.map((col) => {
                      const active = isColumnActive(col.key);
                      const value = `${parametricRates[col.key]?.toFixed(2) || "0.00"}%`;
                      return (
                        <td
                          key={col.key}
                          className={`p-4 border-r border-slate-700 last:border-0 ${!active ? "bg-slate-50/50" : ""}`}
                        >
                          <input
                            type="text"
                            readOnly
                            disabled={!active}
                            placeholder={active ? "0.00" : "—"}
                            value={active ? value : ""}
                            className={`w-full text-center p-3 rounded-lg outline-none  text-sm transition-all
                            ${
                              active
                                ? "bg-indigo-50 text-indigo-700  border border-indigo-200"
                                : "bg-transparent text-slate-300 border border-transparent"
                            }`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
          TAB: RATES
      ════════════════════════════════════════ */}
        {activeTab === "rates" && (
          <div className="p-6 space-y-6">
            {/* Rates Controls */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-end gap-6">
                {/* Project filter dropdown */}
                <div
                  className="flex flex-col gap-1.5 relative w-80"
                  ref={ratesDropdownRef}
                >
                  <label className="text-[10px]   captialize">
                    Filter by Project
                  </label>
                  <div
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer flex justify-between items-center"
                    onClick={() => setIsRatesDropdownOpen(!isRatesDropdownOpen)}
                  >
                    <span className="text-sm  truncate text-slate-700">
                      {ratesSelectedIds.length === 0
                        ? "All Projects"
                        : `${ratesSelectedIds.length} Selected`}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isRatesDropdownOpen ? "▲" : "▼"}
                    </span>
                  </div>

                  {isRatesDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden w-80">
                      <input
                        type="text"
                        placeholder="Search by ID or name..."
                        className="p-3 text-sm border-b border-slate-100 outline-none bg-white"
                        value={ratesProjectSearch}
                        onChange={(e) => setRatesProjectSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="overflow-y-auto max-h-64">
                        <div
                          className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 flex items-center gap-2"
                          onClick={() => {
                            setRatesSelectedIds([]);
                            setIsRatesDropdownOpen(false);
                          }}
                        >
                          <span className="text-[10px]  text-indigo-600  captialize">
                            Show All Projects
                          </span>
                        </div>
                        {searchedRatesProjects.map((p) => (
                          <div
                            key={p.projectId}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50"
                            onClick={() =>
                              setRatesSelectedIds((prev) =>
                                prev.includes(p.projectId)
                                  ? prev.filter((i) => i !== p.projectId)
                                  : [...prev, p.projectId],
                              )
                            }
                          >
                            <input
                              type="checkbox"
                              className="accent-indigo-600 shrink-0"
                              checked={ratesSelectedIds.includes(p.projectId)}
                              readOnly
                            />
                            <span className="text-[10px]  text-white bg-slate-700 px-2 py-0.5 rounded shrink-0 tracking-wide">
                              {p.projectId}
                            </span>
                            <span className="text-xs text-slate-500 truncate">
                              {p.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Record count badge */}
                {!isRatesLoading && (
                  <p className="text-xs pb-0.5">
                    Showing{" "}
                    <span className=" text-slate-700">
                      {displayedRates.length}
                    </span>
                    {ratesSelectedIds.length > 0 && (
                      <>
                        {" "}
                        of{" "}
                        <span className=" text-slate-700">
                          {ratesData.length}
                        </span>
                      </>
                    )}{" "}
                    records
                  </p>
                )}

                {/* Refresh button — pushed to far right */}
                <div className="ml-auto">
                  <button
                    onClick={handleRefreshRates}
                    disabled={isRatesLoading}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg  text-sm transition-all shadow-md ${
                      isRatesLoading
                        ? "bg-blue-300 text-white cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 ${isRatesLoading ? "animate-spin" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    {isRatesLoading ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </div>
            </div>

            {/* Rates Data Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {isRatesLoading ? (
                <div className="p-16 text-center  italic text-sm">
                  Loading rates data...
                </div>
              ) : displayedRates.length === 0 ? (
                <div className="p-16 text-center italic text-sm">
                  No rate records found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="p-4 text-[10px]  captialize border-r border-slate-700 whitespace-nowrap">
                          Project ID
                        </th>
                        <th className="p-4 text-[10px]   captialize border-r border-slate-700 whitespace-nowrap min-w-[180px]">
                          Project Name
                        </th>
                        {ratesColumns.map((col) => (
                          <th
                            key={col.key}
                            className="p-4 text-[10px]   captialize text-center border-r border-slate-700 last:border-0 whitespace-nowrap"
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayedRates.map((row, idx) => {
                        const projId = getProjId(row);
                        const projName = getProjName(row);
                        return (
                          <tr
                            key={idx}
                            className="hover:bg-slate-50/50 transition-colors border-r border-black-700 last:border-0 "
                          >
                            <td className="p-4 border-r border-slate-700">
                              <span className="text-[10px]  text-white bg-slate-700 px-2 py-0.5 rounded tracking-wide whitespace-nowrap">
                                {projId}
                              </span>
                            </td>
                            <td className="p-4 border-r border-slate-700">
                              <span className="text-xs text-slate-600 ">
                                {projName}
                              </span>
                            </td>
                            {ratesColumns.map((col) => {
                              const val = row[col.key];
                              let display;
                              if (col.type === "rate") {
                                display = (
                                  <span className="text-xs   text-indigo-700">
                                    {formatRate(val)}
                                  </span>
                                );
                              } else if (col.type === "date") {
                                const d = val ? new Date(val) : null;
                                display = (
                                  <span className="text-xs  text-slate-600">
                                    {d && !isNaN(d)
                                      ? d.toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "2-digit",
                                        })
                                      : "—"}
                                  </span>
                                );
                              } else {
                                display = (
                                  <span className="text-xs text-slate-700 ">
                                    {val ?? "—"}
                                  </span>
                                );
                              }
                              return (
                                <td
                                  key={col.key}
                                  className="p-4 text-center border-r border-slate-700 last:border-0"
                                >
                                  {display}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NBIParametricRate;
