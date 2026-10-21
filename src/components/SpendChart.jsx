// import React, { useMemo, useState, useEffect, useRef } from "react";
// import { Line } from "react-chartjs-2";
// import { backendUrl } from "./config";
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import {
//   Chart as ChartJS, CategoryScale, LinearScale, PointElement,
//   LineElement, Title, Tooltip, Legend, Filler
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// const ProjectSpendChart = () => {
//   const [combinedList, setCombinedList] = useState([]);
//   const [eacMonthlyData, setEacMonthlyData] = useState({});
//   const [budgetMonthlyData, setBudgetMonthlyData] = useState({});
//   const [planClosedPeriod, setPlanClosedPeriod] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProjectId, setSelectedProjectId] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // States for Range (Now populated dynamically)
//   const [rangeStart, setRangeStart] = useState("2025-01");
//   const [rangeEnd, setRangeEnd] = useState("2026-12");
//   const [actualsCutoff, setActualsCutoff] = useState("2025-10");
//   const [loading, setLoading] = useState(true);

//   const dropdownRef = useRef(null);
//   const chartRef = useRef(null);

//   // PDF Export Logic
//   // const handleExportPDF = () => {
//   //   const doc = new jsPDF('p', 'mm', 'a4');
//   //   const targetId = selectedProjectId || "N/A";
//   //   doc.setFontSize(16);
//   //   doc.text("Project Spend Report", 14, 15);
//   //   doc.setFontSize(10);
//   //   doc.setTextColor(100);
//   //   doc.text(`Project ID: ${targetId} | Range: ${rangeStart} to ${rangeEnd}`, 14, 22);
//   //   doc.text(`Closing Period: ${actualsCutoff}`, 14, 27);

//   //   if (chartRef.current) {
//   //     const chartCanvas = chartRef.current.canvas;
//   //     const chartImage = chartCanvas.toDataURL("image/png", 1.0);
//   //     doc.addImage(chartImage, 'PNG', 10, 35, 190, 80);
//   //   }

//   //   const tableRows = data.table.map(row => [
//   //     `${row.month}/${row.year}${row.isActual ? ' (ACT)' : ''}`,
//   //     `$${row.mB.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//   //     `$${row.mE.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//   //     `$${row.bCum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//   //     `$${row.eCum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
//   //   ]);

//   //   autoTable(doc, {
//   //     startY: 120,
//   //     head: [["Period", "Monthly BUD", "Monthly EAC", "Cumul. BUD", "Cumul. EAC"]],
//   //     body: tableRows,
//   //     theme: 'grid',
//   //     headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold', fontSize: 9 },
//   //     styles: { fontSize: 8, cellPadding: 2 },
//   //     didParseCell: function (data) {
//   //       if (data.row.raw && data.row.raw[0].includes('(ACT)')) {
//   //         data.cell.styles.fillColor = [240, 253, 244];
//   //       }
//   //     }
//   //   });
//   //   doc.save(`Project_Spend_${targetId}.pdf`);
//   // };
// const handleExportPDF = () => {
//     const doc = new jsPDF('p', 'mm', 'a4');
//     const targetId = selectedProjectId || "N/A";

//     // Header Section
//     doc.setFontSize(16);
//     doc.text("Project Spend Report", 14, 15);
//     doc.setFontSize(10);
//     doc.setTextColor(100);
//     doc.text(`Project ID: ${targetId} | Range: ${rangeStart} to ${rangeEnd}`, 14, 22);
//     doc.text(`Closing Period: ${actualsCutoff}`, 14, 27);

//     // 1. Capture and Add Chart
//     if (chartRef.current) {
//       const chartCanvas = chartRef.current.canvas;
//       const chartImage = chartCanvas.toDataURL("image/png", 1.0);
//       doc.addImage(chartImage, 'PNG', 10, 35, 190, 80);
//     }

//     // 2. Prepare Table Data
//     // Get the funding amount for the current project
//     const fundingAmount = combinedList.find(p => p.id?.toString() === selectedProjectId.toString())?.funding || 0;

//     const tableRows = data.table.map(row => {
//       // Logic: Actuals is the cumulative EAC if the row is marked as 'isActual'
//       const actualValue = row.isActual
//         ? `$${row.eCum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
//         : "-";

//       return [
//         `${row.month}/${row.year}${row.isActual ? ' (ACT)' : ''}`,
//         `$${row.mB.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//         `$${row.mE.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//         actualValue, // New Column: Actuals
//         `$${fundingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, // New Column: Funding
//         `$${row.bCum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
//         `$${row.eCum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
//       ];
//     });

//     // 3. Generate Table
//     autoTable(doc, {
//       startY: 120,
//       head: [["Period", "Mo. BUD", "Mo. EAC", "Actuals (Cum)", "Funding", "Cum. BUD", "Cum. EAC"]],
//       body: tableRows,
//       theme: 'grid',
//       headStyles: {
//         fillColor: [59, 130, 246],
//         textColor: 255,
//         fontStyle: 'bold',
//         fontSize: 8 // Reduced slightly to fit more columns
//       },
//       styles: { fontSize: 7, cellPadding: 2 },
//       columnStyles: {
//         3: { fontStyle: 'bold', textColor: [16, 185, 129] }, // Actuals column styling
//         4: { textColor: [239, 68, 68] } // Funding column styling
//       },
//       didParseCell: function (data) {
//         if (data.row.raw && data.row.raw[0].includes('(ACT)')) {
//           data.cell.styles.fillColor = [240, 253, 244];
//         }
//       }
//     });

//     doc.save(`Project_Spend_${targetId}.pdf`);
//   };
//   // Initial Projects Fetch
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       setLoading(true);
//       try {
//         const [projectsRes, newBizRes] = await Promise.all([
//           fetch(`${backendUrl}/Project/GetAllProjects`),
//           fetch(`${backendUrl}/GetAllNewBusiness`)
//         ]);
//         const projects = await projectsRes.json();
//         const newBiz = await newBizRes.json();
//         const merged = [
//           ...(projects || []).map(p => ({ id: p.projectId, name: p.name, funding: p.proj_f_tot_amt || 0, type: 'Project' })),
//           ...(newBiz || []).map(nb => ({ id: nb.trf_ProjId, name: nb.description, funding: parseFloat(nb.contractValue) || 0, type: 'New Business' }))
//         ];
//         setCombinedList(merged);
//         if (merged.length > 0) {
//           setSelectedProjectId(merged[0].id);
//           setSearchTerm(merged[0].id);
//         }
//       } catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     };
//     fetchInitialData();
//   }, []);

//   // Fetch Plan Data & Auto-Populate Start/End Dates
//   useEffect(() => {
//     if (!selectedProjectId) return;
//     setEacMonthlyData({});
//     setBudgetMonthlyData({});

//     const fetchPlanData = async () => {
//       try {
//         const plansRes = await fetch(`${backendUrl}/Project/GetAllPlans`);
//         const allPlans = await plansRes.json();

//         const uniqueProjectPlans = Array.from(
//             new Map(
//                 allPlans
//                     .filter(p => p.projId === selectedProjectId && p.status === "Concluded")
//                     .map(item => [item.plId, item])
//             ).values()
//         );

//         // --- DYNAMIC RANGE POPULATION ---
//         // Find a plan that contains the project dates (usually the EAC or BUD plan)
//         const dateRefPlan = uniqueProjectPlans[0];
//         if (dateRefPlan) {
//           if (dateRefPlan.projStartDt) setRangeStart(dateRefPlan.projStartDt.substring(0, 7));
//           if (dateRefPlan.projEndDt) setRangeEnd(dateRefPlan.projEndDt.substring(0, 7));
//           if (dateRefPlan.closedPeriod) setPlanClosedPeriod(dateRefPlan.closedPeriod.substring(0, 7));
//         }

//         const aggregate = async (type) => {
//           const plans = uniqueProjectPlans.filter(p => p.plType === type);
//           const results = await Promise.all(plans.map(p =>
//             fetch(`${backendUrl}/Forecast/GetMonthlyData?planID=${p.plId}&planType=${type}`).then(res => res.json())
//           ));
//           const map = {};
//           results.flat().forEach(item => {
//             const key = `${item.year}-${item.month}`;
//             const val = (Number(item.laborCost) || 0) + (Number(item.nonLaborCost) || 0);
//             map[key] = (map[key] || 0) + val;
//           });
//           return map;
//         };

//         const [eacMap, budMap] = await Promise.all([aggregate("EAC"), aggregate("BUD")]);
//         setEacMonthlyData(eacMap);
//         setBudgetMonthlyData(budMap);
//       } catch (err) { console.error(err); }
//     };
//     fetchPlanData();
//   }, [selectedProjectId]);

//   const data = useMemo(() => {
//     if (!selectedProjectId) return { chart: null, table: [] };
//     const buckets = [];

//     let curr = new Date(rangeStart + "-01T12:00:00");
//     const stop = new Date(rangeEnd + "-01T12:00:00");

//     while (curr <= stop) {
//       buckets.push(`${curr.getFullYear()}-${curr.getMonth() + 1}`);
//       curr.setMonth(curr.getMonth() + 1);
//     }

//     let bCum = 0, eCum = 0;
//     const tableEntries = [];
//     const bPoints = [], aPoints = [], ePoints = [], labels = [];

//     buckets.forEach(key => {
//       const [year, month] = key.split('-').map(Number);
//       const mB = budgetMonthlyData[key] || 0;
//       const mE = eacMonthlyData[key] || 0;
//       bCum += mB; eCum += mE;

//       labels.push(new Date(year, month - 1, 15).toLocaleString('default', { month: 'short', year: '2-digit' }));
//       bPoints.push(bCum); ePoints.push(eCum);

//       const currentBucketDate = new Date(`${year}-${String(month).padStart(2, '0')}-01T12:00:00`);
//       const limitDate = new Date(actualsCutoff + "-01T12:00:00");
//       const isPastActuals = currentBucketDate > limitDate;

//       aPoints.push(isPastActuals ? null : eCum);
//       tableEntries.push({ month, year, mB, mE, bCum, eCum, isActual: !isPastActuals });
//     });

//     const funding = combinedList.find(p => p.id?.toString() === selectedProjectId.toString())?.funding || 0;

//     return {
//       table: tableEntries,
//       chart: {
//         labels,
//         datasets: [
//           { label: 'Cumulative Budget (BUD)', data: bPoints, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.3 },
//           { label: 'Cumulative Forecast (EAC)', data: ePoints, borderColor: '#f59e0b', borderWidth: 2, borderDash: [5, 2], tension: 0.3, fill: false },
//           { label: 'Cumulative Actuals', data: aPoints, borderColor: '#10b981', borderWidth: 4, tension: 0.2, fill: false },
//           { label: 'Funding Limit', data: Array(labels.length).fill(funding), borderColor: '#ef4444', borderDash: [10, 5], pointRadius: 0 }
//         ]
//       }
//     };
//   }, [budgetMonthlyData, eacMonthlyData, selectedProjectId, rangeStart, rangeEnd, actualsCutoff, combinedList]);

//   // Dropdown Filter Logic
//   const filteredProjects = useMemo(() => {
//     const cleanSearch = searchTerm.includes(" - ") ? searchTerm.split(" - ")[0] : searchTerm;
//     return combinedList.filter(p =>
//       (p.id?.toLowerCase() || "").includes(cleanSearch.toLowerCase()) ||
//       (p.name?.toLowerCase() || "").includes(cleanSearch.toLowerCase())
//     );
//   }, [combinedList, searchTerm]);

//   useEffect(() => {
//     const handleClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false); };
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
//       <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border mb-6 gap-4">
//         <h1 className="text-2xl font-bold">Project Spend Chart</h1>
//         <div className="flex items-center gap-4">
//           <div className="relative w-full md:w-80" ref={dropdownRef}>
//             <input type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Search Project..." value={searchTerm} onFocus={() => setIsDropdownOpen(true)} onChange={(e) => {setSearchTerm(e.target.value); setIsDropdownOpen(true);}} />
//             {isDropdownOpen && (
//               <div className="absolute left-0 right-0 z-[999] mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
//                 {filteredProjects.length > 0 ? (
//                   filteredProjects.map(p => (
//                     <div key={p.id} className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0 group" onMouseDown={() => { setSelectedProjectId(p.id); setSearchTerm(`${p.id} - ${p.name}`); setIsDropdownOpen(false); }}>
//                       <div className="flex justify-between items-center"><span className="font-bold text-blue-600 group-hover:text-blue-700">{p.id}</span></div>
//                       <div className="text-xs text-gray-900 mt-1 truncate">{p.name}</div>
//                     </div>
//                   ))
//                 ) : ( <div className="p-4 text-center text-gray-500 text-sm font-medium">No projects found</div> )}
//               </div>
//             )}
//           </div>
//           <button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-md active:scale-95">Download Results</button>
//         </div>
//       </div>

//       {/* Date Controls (Auto-populated from API) */}
//       <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border flex flex-wrap gap-8 items-center">
//         <div className="flex gap-4">
//           <div><label className="text-[10px] font-bold  text-gray-400">Graph Start</label><input type="month" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} className="block border rounded px-2 py-1 text-sm bg-gray-50"/></div>
//           <div><label className="text-[10px] font-bold  text-gray-400">Graph End</label><input type="month" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} className="block border rounded px-2 py-1 text-sm bg-gray-50"/></div>
//         </div>
//         <div className="border-l pl-8">
//           <label className="text-[10px] font-bold  text-green-600">Closing Period</label>
//           <input type="month" value={actualsCutoff} onChange={(e) => setActualsCutoff(e.target.value)} className="block border border-green-200 rounded px-2 py-1 text-sm bg-green-50"/>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
//         <div className="xl:col-span-3 bg-white p-6 rounded-xl shadow border">
//           <div style={{ height: '500px' }}>
//             {data.chart && <Line ref={chartRef} data={data.chart} options={{ responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { position: 'top' } } }} />}
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow border">
//           <h2 className="font-bold text-gray-700 mb-4 text-center text-sm">Monthly Breakdown</h2>
//           <div className="overflow-y-auto max-h-[450px]">
//             <table className="w-full text-[11px] text-left">
//               <thead className="sticky top-0 bg-gray-50 font-bold">
//                 <tr><th className="p-2">PD/FY</th><th className="p-2 text-blue-600">BUD</th><th className="p-2 text-amber-600">EAC</th></tr>
//               </thead>
//               <tbody>
//                 {data.table.map((row, i) => (
//                   <tr key={i} className={`border-b ${row.isActual ? 'bg-green-50/40' : ''}`}>
//                     <td className="p-2">{row.month}/{row.year} {row.isActual && <span className="text-[9px] text-green-600 font-bold">(ACT)</span>}</td>
//                     <td className="p-2">${row.mB.toLocaleString()}</td>
//                     <td className="p-2">${row.mE.toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectSpendChart;

import React, { useMemo, useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { backendUrl } from "./config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const ProjectSpendChart = () => {
  const [combinedList, setCombinedList] = useState([]);
  const [eacMonthlyData, setEacMonthlyData] = useState({});
  const [budgetMonthlyData, setBudgetMonthlyData] = useState({});
  const [planClosedPeriod, setPlanClosedPeriod] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("C1800.C"); // Default to ALL
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [rangeStart, setRangeStart] = useState("2025-01");
  const [rangeEnd, setRangeEnd] = useState("2026-12");
  const [actualsCutoff, setActualsCutoff] = useState("2026-08");
  const [loading, setLoading] = useState(true);

  const [hasUserModifiedRange, setHasUserModifiedRange] = useState(false);

  const dropdownRef = useRef(null);
  const chartRef = useRef(null);

  // PDF Export Logic
  const handleExportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const targetId =
      selectedProjectId === "ALL" ? "All Projects Rollup" : selectedProjectId;

    doc.setFontSize(16);
    doc.text("Project Spend Report", 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Project ID: ${targetId} | Range: ${rangeStart} to ${rangeEnd}`,
      14,
      22,
    );
    doc.text(`Closing Period: ${actualsCutoff}`, 14, 27);

    if (chartRef.current) {
      const chartCanvas = chartRef.current.canvas;
      const chartImage = chartCanvas.toDataURL("image/png", 1.0);
      doc.addImage(chartImage, "PNG", 10, 35, 190, 80);
    }

    const fundingAmount =
      selectedProjectId === "ALL"
        ? combinedList.reduce((acc, curr) => acc + (curr.funding || 0), 0)
        : combinedList.find(
            (p) => p.id?.toString() === selectedProjectId.toString(),
          )?.funding || 0;

    const tableRows = data.table.map((row) => [
      `${row.month}/${row.year}${row.isActual ? " (ACT)" : ""}`,
      `$${row.mB.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      `$${row.mE.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      row.isActual
        ? `$${row.eCum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        : "-",
      `$${fundingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      `$${row.bCum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      `$${row.eCum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    ]);

    autoTable(doc, {
      startY: 120,
      head: [
        [
          "Period",
          "Mo. BUD",
          "Mo. EAC",
          "Actuals (Cum)",
          "Funding",
          "Cum. BUD",
          "Cum. EAC",
        ],
      ],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 8,
      },
      styles: { fontSize: 7, cellPadding: 2 },
    });

    doc.save(`Project_Spend_${targetId}.pdf`);
  };

  // Initial Projects Fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [projectsRes, newBizRes] = await Promise.all([
          fetch(`${backendUrl}/Project/GetAllProjects`),
          fetch(`${backendUrl}/GetAllNewBusiness`),
        ]);
        const projects = await projectsRes.json();
        const newBiz = await newBizRes.json();

        const merged = [
          ...(projects || []).map((p) => ({
            id: p.projectId,
            name: p.name,
            funding: p.proj_f_tot_amt || 0,
            type: "Project",
          })),
          ...(newBiz || []).map((nb) => ({
            id: nb.trf_ProjId,
            name: nb.description,
            funding: parseFloat(nb.contractValue) || 0,
            type: "New Business",
          })),
        ];

        // Add the "All Projects" option at the top
        const listWithAll = [
          { id: "ALL", name: "All ", funding: 0, type: "Summary" },
          ...merged,
        ];

        setCombinedList(listWithAll);
        setSelectedProjectId("C1800.C");
        // setSearchTerm("ALL - All Projects");
        setSearchTerm("C1800.C");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch Plan Data
  useEffect(() => {
    if (!selectedProjectId) return;
    setEacMonthlyData({});
    setBudgetMonthlyData({});

    const fetchPlanData = async () => {
      try {
        const plansRes = await fetch(`${backendUrl}/Project/GetAllPlans`);
        const allPlans = await plansRes.json();

        // Filter plans: if "ALL", take all concluded plans. If specific, filter by ID.
        const relevantPlans = allPlans.filter(
          (p) =>
            p.status === "Concluded" &&
            (selectedProjectId === "ALL" || p.projId === selectedProjectId),
        );

        // Dynamic Range: If ALL, use widest possible dates; if specific, use project dates
        // if (relevantPlans.length > 0) {
        if (relevantPlans.length > 0 && !hasUserModifiedRange) {
          const starts = relevantPlans
            .map((p) => p.projStartDt)
            .filter(Boolean)
            .sort();
          const ends = relevantPlans
            .map((p) => p.projEndDt)
            .filter(Boolean)
            .sort();
          if (starts.length) setRangeStart(starts[0].substring(0, 7));
          if (ends.length) setRangeEnd(ends[ends.length - 1].substring(0, 7));
        }

        const aggregate = async (type) => {
          // const plansOfType = relevantPlans.filter((p) => p.plType === type);
          const plansOfType = [
            ...new Map(
              relevantPlans
                .filter((p) => p.plType === type)
                .map((p) => [p.plId, p]),
            ).values(),
          ];

          // Get monthly data for all identified plans
          const results = await Promise.all(
            plansOfType.map((p) =>
              fetch(
                `${backendUrl}/Forecast/GetMonthlyData?planID=${p.plId}&planType=${type}`,
              ).then((res) => res.json()),
            ),
          );

          // const map = {};
          // results.flat().forEach((item) => {
          //   const key = `${item.year}-${item.month}`;
          //   const val =
          //     (Number(item.laborCost) || 0) + (Number(item.nonLaborCost) || 0);
          //   map[key] = (map[key] || 0) + val;
          // });
          const map = {};
          results.flat().forEach((item) => {
            const key = `${item.year}-${item.month}`;

            const val =
              (Number(item.laborCost) || 0) +
              (Number(item.nonLaborCost) || 0) +
              (Number(item.fringe) || 0) +
              (Number(item.gna) || 0) +
              (Number(item.mnh) || 0) +
              (Number(item.hr) || 0) +
              (Number(item.overhead) || 0);

            map[key] = (map[key] || 0) + val;
          });
          return map;
        };

        const [eacMap, budMap] = await Promise.all([
          aggregate("EAC"),
          aggregate("BUD"),
        ]);
        setEacMonthlyData(eacMap);
        setBudgetMonthlyData(budMap);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlanData();
  }, [selectedProjectId, hasUserModifiedRange]);

  const data = useMemo(() => {
    if (!selectedProjectId) return { chart: null, table: [] };
    const buckets = [];
    let curr = new Date(rangeStart + "-01T12:00:00");
    const stop = new Date(rangeEnd + "-01T12:00:00");

    while (curr <= stop) {
      buckets.push(`${curr.getFullYear()}-${curr.getMonth() + 1}`);
      curr.setMonth(curr.getMonth() + 1);
    }

    let bCum = 0,
      eCum = 0;
    const tableEntries = [];
    const bPoints = [],
      aPoints = [],
      ePoints = [],
      labels = [];

    buckets.forEach((key) => {
      const [year, month] = key.split("-").map(Number);
      const mB = budgetMonthlyData[key] || 0;
      const mE = eacMonthlyData[key] || 0;
      bCum += mB;
      eCum += mE;

      labels.push(
        new Date(year, month - 1, 15).toLocaleString("default", {
          month: "short",
          year: "2-digit",
        }),
      );
      bPoints.push(bCum);
      ePoints.push(eCum);

      const currentBucketDate = new Date(
        `${year}-${String(month).padStart(2, "0")}-01T12:00:00`,
      );
      const limitDate = new Date(actualsCutoff + "-01T12:00:00");
      const isPastActuals = currentBucketDate > limitDate;

      aPoints.push(isPastActuals ? null : eCum);
      tableEntries.push({
        month,
        year,
        mB,
        mE,
        bCum,
        eCum,
        isActual: !isPastActuals,
      });
    });

    // Funding Rollup: Sum all project funding if "ALL" is selected
    const funding =
      selectedProjectId === "ALL"
        ? combinedList.reduce((acc, curr) => acc + (curr.funding || 0), 0)
        : combinedList.find(
            (p) => p.id?.toString() === selectedProjectId.toString(),
          )?.funding || 0;

    const utilizationPercent = funding > 0 ? (eCum / funding) * 100 : 0;

    const fundingColor = utilizationPercent >= 75 ? "#dc2626" : "#5b3a29"; // red : dark brown

    const isFundingCritical = utilizationPercent >= 75;

    return {
      table: tableEntries,
      chart: {
        labels,
        datasets: [
          {
            label: "Cum. Budget",
            data: bPoints,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.3,
          },
          {
            label: "Cum. Forecast",
            data: ePoints,
            borderColor: "#f59e0b",
            borderDash: [5, 2],
            tension: 0.3,
            fill: false,
          },
          {
            label: "Cum. Actuals",
            data: aPoints,
            borderColor: "#10b981",
            borderWidth: 4,
            tension: 0.2,
            fill: false,
          },
          // {
          //   label: "Total Funding Limit",
          //   data: Array(labels.length).fill(funding),
          //   borderColor: "#ef4444",
          //   borderDash: [10, 5],
          //   pointRadius: 0,
          // },

          {
            label:
              utilizationPercent >= 75
                ? "Funding Limit (75%+ Utilized)"
                : "Funding Limit",
            data: Array(labels.length).fill(funding),
            borderColor: fundingColor,
            // backgroundColor: utilizationPercent >= 75 ? "#dc2626" : "#9ca3af",
            backgroundColor: "transparent",
            borderDash: [10, 5],
            borderWidth: 3,
            pointRadius: 0,
          },
        ],
      },
    };
  }, [
    budgetMonthlyData,
    eacMonthlyData,
    selectedProjectId,
    rangeStart,
    rangeEnd,
    actualsCutoff,
    combinedList,
  ]);

  const totalFunding =
    selectedProjectId === "ALL"
      ? combinedList.reduce((acc, curr) => acc + (curr.funding || 0), 0)
      : combinedList.find(
          (p) => p.id?.toString() === selectedProjectId.toString(),
        )?.funding || 0;

  const latestEAC =
    data?.table?.length > 0 ? data.table[data.table.length - 1].eCum : 0;

  const isFundingCritical =
    totalFunding > 0 ? (latestEAC / totalFunding) * 100 >= 75 : false;

  const filteredProjects = useMemo(() => {
    const cleanSearch = searchTerm.includes(" - ")
      ? searchTerm.split(" - ")[0]
      : searchTerm;
    return combinedList.filter(
      (p) =>
        (p.id?.toLowerCase() || "").includes(cleanSearch.toLowerCase()) ||
        (p.name?.toLowerCase() || "").includes(cleanSearch.toLowerCase()),
    );
  }, [combinedList, searchTerm]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Project Spend Chart</h1>
          {/* <p className="text-sm text-gray-500">{selectedProjectId === "ALL" ? "Showing Aggregated  Project Data" : "Showing Individual Project Data"}</p> */}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-80" ref={dropdownRef}>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Search Project..."
              value={searchTerm}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
            />
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 z-[999] mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    className={`p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0 group ${p.id === "ALL" ? "bg-blue-50/50" : ""}`}
                    onMouseDown={() => {
                      setSelectedProjectId(p.id);
                      setSearchTerm(`${p.id} - ${p.name}`);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`font-bold ${p.id === "ALL" ? "text-indigo-600" : "text-blue-600"}`}
                      >
                        {p.id}
                      </span>
                      {p.id === "ALL" && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                          ROLLUP
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-900 mt-1 truncate">
                      {p.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-md active:scale-95"
          >
            Download Results
          </button>
        </div>
      </div>

      {/* Date Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border flex flex-wrap gap-8 items-center">
        <div className="flex gap-4">
          <div>
            <label className="text-[10px] font-bold  text-gray-400">
              Graph Start
            </label>
            <input
              type="month"
              value={rangeStart}
              // onChange={(e) => setRangeStart(e.target.value)}
              onChange={(e) => {
                setRangeStart(e.target.value);
                setHasUserModifiedRange(true);
              }}
              className="block border rounded px-2 py-1 text-sm bg-gray-50"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold  text-gray-400">
              Graph End
            </label>
            <input
              type="month"
              value={rangeEnd}
              // onChange={(e) => setRangeEnd(e.target.value)}
              onChange={(e) => {
                setRangeEnd(e.target.value);
                setHasUserModifiedRange(true);
              }}
              className="block border rounded px-2 py-1 text-sm bg-gray-50"
            />
          </div>
        </div>
        {/* <div className="border-l pl-8">
          <label className="text-[10px] font-bold  text-green-600">
            Closing Period
          </label>
          <input
            type="month"
            value={actualsCutoff}
            onChange={(e) => setActualsCutoff(e.target.value)}
            className="block border border-green-200 rounded px-2 py-1 text-sm bg-green-50"
          />
        </div> */}
        <div className="border-l pl-8 flex gap-8 items-end">
          {/* Closing Period */}
          <div>
            <label className="text-[10px] font-bold  text-green-600">
              Closing Period
            </label>
            <input
              type="month"
              value={actualsCutoff}
              onChange={(e) => setActualsCutoff(e.target.value)}
              className="block border border-green-200 rounded px-2 py-1 text-sm bg-green-50"
            />
          </div>

          {/* Funding Amount */}
          <div>
            {/* <label className="text-[10px] font-bold  text-amber-600">
      Funding Amount
    </label> */}

            <label
              className={`text-[10px] font-bold  ${
                isFundingCritical ? "text-red-600" : "text-amber-900"
              }`}
            >
              {isFundingCritical ? "Funding Amount " : "Funding Amount"}
            </label>

            {/* <div className="border border-red-200 rounded px-3 py-1 text-sm bg-red-50 font-semibold text-red-700 min-w-[180px]"> */}
            <div
              className={`border rounded px-3 py-1 text-sm font-semibold min-w-[180px]
  ${
    isFundingCritical
      ? "border-red-200  text-red-700"
      : "border-amber-900  text-amber-900"
  }`}
            >
              $
              {(selectedProjectId === "ALL"
                ? combinedList.reduce(
                    (acc, curr) => acc + (curr.funding || 0),
                    0,
                  )
                : combinedList.find(
                    (p) => p.id?.toString() === selectedProjectId.toString(),
                  )?.funding || 0
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 bg-white p-6 rounded-xl shadow border">
          <div style={{ height: "500px" }}>
            {data.chart && (
              <Line
                ref={chartRef}
                data={data.chart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: false,
                  plugins: { legend: { position: "top" } },
                }}
              />
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="font-bold text-gray-700 mb-4 text-center text-sm">
            Monthly Breakdown {selectedProjectId === "ALL" && "(All Projects)"}
          </h2>
          <div className="overflow-y-auto max-h-[450px]">
            <table className="w-full text-[11px] text-left">
              <thead className="sticky top-0 bg-gray-50 font-bold">
                <tr>
                  <th className="p-2">PD/FY</th>
                  <th className="p-2 text-blue-600">BUD</th>
                  <th className="p-2 text-amber-600">EAC</th>
                </tr>
              </thead>
              <tbody>
                {data.table.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b ${row.isActual ? "bg-green-50/40" : ""}`}
                  >
                    <td className="p-2">
                      {row.month}/{row.year}{" "}
                      {row.isActual && (
                        <span className="text-[9px] text-green-600 font-bold">
                          (ACT)
                        </span>
                      )}
                    </td>
                    <td className="p-2">${row.mB.toLocaleString()}</td>
                    <td className="p-2">${row.mE.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSpendChart;
