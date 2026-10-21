import React, { useState, useRef, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  Download,
  Loader2,
  TrendingUp,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { backendUrl } from "./config";

// Format helper utility for main metrics and variances
// const formatMetricValue = (val) => {
//   if (val === undefined || val === null || isNaN(val)) return "0.00";
//   // Formats to clear localized string standard with 2 decimals
//   return Number(val).toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
// };
const formatMetricValue = (val) => {
  if (val === undefined || val === null || isNaN(val)) return "0.00";

  const num = Number(val);
  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum >= 1000000) {
    return `${sign}${(absNum / 1000000).toFixed(2)}M`;
  }
  if (absNum >= 1000) {
    return `${sign}${(absNum / 1000).toFixed(2)}k`;
  }

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const VarianceSection = ({ label, value, percentage, trend }) => {
  if (!label) return <div className="w-24" />;

  const isUp = trend === "up";
  const colorHex = isUp ? "#16a34a" : "#dc2626";
  const Icon = isUp ? ArrowUp : ArrowDown;

  return (
    <div className="flex flex-col items-center justify-center min-w-[70px]">
      <span className="text-[10px] text-gray-500 font-medium mb-1 whitespace-nowrap">
        {label}
      </span>
      <span className="text-[11px] font-bold" style={{ color: colorHex }}>
        ({formatMetricValue(value)})
      </span>
      <div className="py-1">
        <Icon
          size={18}
          strokeWidth={3}
          style={{ color: colorHex, fill: colorHex }}
        />
      </div>
      <span className="text-[10px] font-bold" style={{ color: colorHex }}>
        ({Number(percentage || 0).toFixed(2)}%)
      </span>
    </div>
  );
};

export const MetricCard = ({
  title,
  mainValue,
  leftComparison,
  rightComparison,
}) => {
  return (
    <div className="bg-white border border-[#bae6fd] rounded-xl px-2 py-4 shadow-sm flex items-center justify-between h-32 min-w-[280px]">
      <VarianceSection {...leftComparison} />
      <div className="flex flex-col items-center justify-center flex-1 px-2">
        <h3 className="text-[#1e293b] font-bold text-base mb-2 whitespace-nowrap">
          {title}
        </h3>
        <span className="text-xl font-extrabold text-[#0f172a]">
          {formatMetricValue(mainValue)}
        </span>
      </div>
      <VarianceSection {...rightComparison} />
    </div>
  );
};

// const PerformanceGraph = ({ title, data = [] }) => (
//   <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e2e8f0] h-80 flex flex-col">
//     <h3 className="text-center font-bold text-[#334155] mb-2 uppercase tracking-wide">
//       {title}
//     </h3>
//     <ResponsiveContainer width="100%" height="100%">
//       <ComposedChart
//         data={data}
//         margin={{ top: 30, right: 20, bottom: 20, left: 0 }}
//       >
//         <CartesianGrid
//           strokeDasharray="3 3"
//           vertical={false}
//           stroke="#f0f0f0"
//         />
//         <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} />
//         <YAxis
//           domain={[0, "auto"]}
//           axisLine={false}
//           tickLine={false}
//           fontSize={12}
//         />
//         <Tooltip cursor={{ fill: "#f8fafc" }} />
//         <Legend
//           verticalAlign="top"
//           align="center"
//           iconType="circle"
//           wrapperStyle={{ paddingBottom: "20px", fontSize: "12px" }}
//         />

//         {/* PY Revenue Bar */}
//         <Bar dataKey="py" name="PY Revenue" fill="#cbd5e1" barSize={30}>
//           <LabelList
//             dataKey="py"
//             position="top"
//             angle={-90}
//             offset={15}
//             fill="#64748b"
//             style={{ fontSize: "10px", fontWeight: "bold" }}
//           />
//         </Bar>

//         {/* CY Forecast Bar */}
//         <Bar dataKey="cy" name="CY Forecast" fill="#001f3f" barSize={30}>
//           <LabelList
//             dataKey="cy"
//             position="top"
//             angle={-90}
//             offset={15}
//             fill="#0f172a"
//             style={{ fontSize: "10px", fontWeight: "bold" }}
//           />
//         </Bar>

//         {/* Budget Line */}
//         <Line
//           type="monotone"
//           dataKey="budget"
//           name="Budget"
//           stroke="#dc2626"
//           strokeWidth={4}
//           dot={{ r: 4, fill: "#dc2626" }}
//         >
//           <LabelList
//             dataKey="budget"
//             position="top"
//             angle={-90}
//             offset={15}
//             fill="#dc2626"
//             style={{ fontSize: "10px", fontWeight: "bold" }}
//           />
//         </Line>
//       </ComposedChart>
//     </ResponsiveContainer>
//   </div>
// );

const PerformanceGraph = ({ title, data = [] }) => {
  // Custom tooltip formatter to keep things looking sharp and readable
  const formatTooltipValue = (value) => {
    if (value === undefined || value === null) return "0.00";
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Human-friendly abbreviation format for Y-Axis (e.g., 200k, 1.5M)
  const formatYAxis = (tickItem) => {
    if (tickItem === 0) return "0";
    if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(1)}M`;
    if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(0)}k`;
    return tickItem;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          {title}
        </h3>
      </div>

      <div className="flex-1 w-100%">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 5, left: -15 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              domain={[0, "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc", opacity: 0.6 }}
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                fontSize: "12px",
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                paddingBottom: "24px",
                fontSize: "12px",
                color: "#475569",
              }}
            />

            {/* PY Revenue Bar */}
            <Bar
              dataKey="py"
              name="PY Revenue"
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
              maxBarSize={25}
            />

            {/* CY Forecast Bar */}
            <Bar
              dataKey="cy"
              name="CY Forecast"
              fill="#001f3f"
              radius={[4, 4, 0, 0]}
              maxBarSize={25}
            />

            {/* Budget Line */}
            <Line
              type="monotone"
              dataKey="budget"
              name="Budget"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#ef4444", strokeWidth: 1 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const RevenueDashboard = () => {
  const dashboardRef = useRef(null);
  const [timeline, setTimeline] = useState("All");
  const [metric, setMetric] = useState("Vs. Prior Year");
  const [sector, setSector] = useState("All");
  const [bu, setBu] = useState("All");

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  // States handling unique API datasets separately
  const [totalCompanyData, setTotalCompanyData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [graphProjectData, setGraphProjectData] = useState([]);
  const [graphData, setGraphData] = useState([]);

  // UI Processing States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Load active project list on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/Project/MassUtilityGetAllPlans?Role=admin`,
        );
        const data = await response.json();

        const filteredProjects = data.filter(
          (project) =>
            project.finalVersion === true && project.plType === "EAC",
        );

        setProjects(filteredProjects);

        // Auto-select the first project if available to trigger project loading block
        if (filteredProjects.length > 0) {
          setSelectedProject(filteredProjects[0].projId);
        }
      } catch (err) {
        setError("Failed to load filtered projects list");
      }
    };
    fetchProjects();
  }, []);

  // 2. Fetch Total Company Data (Runs once on mount)
  useEffect(() => {
    const fetchDashboardMetricsAll = async () => {
      setIsLoading(true);
      try {
        const endpoint = `${backendUrl}/Forecast/FinancialCardsSummaryWithGraphData`;
        const response = await fetch(endpoint);
        const data = await response.json();

        setTotalCompanyData(data.cards || []);
        setGraphData(data.graphData || []);
        setError(null);
      } catch (err) {
        setError("Failed to load company summary dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardMetricsAll();
  }, []);

  // 3. Fetch Selected Project Data (Fires every time selectedProject dropdown shifts)
  useEffect(() => {
    if (!selectedProject) return;

    const fetchDashboardMetrics = async () => {
      setIsLoading(true);
      try {
        const endpoint = `${backendUrl}/Forecast/FinancialCardsWithGraphData/${selectedProject}`;
        const response = await fetch(endpoint);
        const data = await response.json();

        setProjectData(data.cards || []);
        // Optional: Updates graphs with chosen project graph array metrics if returned by backend
        if (data.graphData) setGraphProjectData(data.graphData);
        setError(null);
      } catch (err) {
        setError("Failed to load selected project dashboard records");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, [selectedProject]);

  const handleExport = async () => {
    const element = dashboardRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f8fafc",
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement("style");
          style.innerHTML = `
            * { 
              --tw-text-opacity: 1 !important;
              --tw-bg-opacity: 1 !important;
              --tw-border-opacity: 1 !important;
              color-scheme: light !important;
            }
          `;
          clonedDoc.head.appendChild(style);

          const all = clonedDoc.getElementsByTagName("*");
          for (let el of all) {
            const computed = window.getComputedStyle(el);
            if (computed.color.includes("oklch")) el.style.color = "#1e293b";
            if (computed.backgroundColor.includes("oklch"))
              el.style.backgroundColor = "#ffffff";
            if (computed.borderColor.includes("oklch"))
              el.style.borderColor = "#cbd5e1";
          }
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`Revenue_Dashboard.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed due to browser color parsing configurations.");
    }
  };

  const StyledDropdown = ({ label, value, options, onChange }) => (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-[#001f3f] text-white pl-3 pr-8 py-1 text-[11px] font-bold rounded cursor-pointer outline-none hover:bg-[#002d5c] transition-colors uppercase"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-white text-slate-900">
            {label} &gt; {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen font-sans">
      <div className="flex justify-between items-center mb-4">
        {/* <div className="flex px-4 py-2 text-[10px] font-bold gap-6 text-[#64748b]">
          <span className="hover:text-[#0369a1] cursor-pointer">
            Executive Summary
          </span>
          <span className="text-[#38bdf8] border-b-2 border-[#38bdf8] pb-0.5">
            Overview : Sector
          </span>
          <span className="hover:text-[#0369a1] cursor-pointer">
            Rev/GM - Bridge
          </span>
        </div> */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">
              Overview - Total Company & Project
            </h1>
            <p className="text-xs text-slate-400">Actuals through Mar - 2026</p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-[#d1d5db] hover:bg-[#f1f5f9] text-[#334155] px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
        >
          <Download size={16} /> Export PDF
        </button>
      </div>

      {/* <div className="flex items-center gap-4 mb-2">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-[#001f3f] text-white px-4 py-2 rounded-lg text-sm font-bold outline-none cursor-pointer"
        >
          <option value="" disabled>
            Select Project Filter
          </option>
          {projects.map((p) => (
            <option key={p.projId} value={p.projId}>
              {p.projId} - {p.projName}
            </option>
          ))}
        </select>
      </div> */}

      {isLoading && totalCompanyData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="animate-spin text-blue-500 mb-2" size={40} />
          <p className="text-slate-500 font-medium">
            Loading summary metrics...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : (
        <div ref={dashboardRef} className="p-4">
          {/* Section 1: Total Company Metrics Dashboard */}
          <div className="mt-4 mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Revenue : Total Company
              </h2>
              {/* <div className="flex gap-2">
                <StyledDropdown
                  label="Timeline"
                  value={timeline}
                  options={["All", "Q1", "Q2", "Q3", "Q4", "Mar"]}
                  onChange={setTimeline}
                />
                <StyledDropdown
                  label="Metric"
                  value={metric}
                  options={["Vs. Prior Year", "Vs. Budget", "Vs. Forecast"]}
                  onChange={setMetric}
                />
              </div> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {totalCompanyData.map((data, index) => (
                <MetricCard key={index} {...data} />
              ))}
            </div>
          </div>

          {/* Section 2: Project-Wise Row Mapping Details */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4 border-t border-slate-200 pt-6">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Revenue
                {/* Revenue : Project-wise ({selectedProject || "None selected"}) */}
              </h2>
              {/* <div className="flex gap-2">
                <StyledDropdown
                  label="SECTOR"
                  value={sector}
                  options={["All", "Defense", "Civil", "Intelligence"]}
                  onChange={setSector}
                />
                <StyledDropdown
                  label="BU"
                  value={bu}
                  options={["All", "Operations", "Strategy", "Logistics"]}
                  onChange={setBu}
                />
              </div> */}
              <div className="flex items-center gap-4 mb-2">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="bg-[#001f3f] text-white px-4 py-2 rounded-lg text-sm font-bold outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select Project Filter
                  </option>
                  {projects.map((p) => (
                    <option key={p.projId} value={p.projId}>
                      {p.projId} - {p.projName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-95">
              {projectData.length > 0 ? (
                projectData.map((data, index) => (
                  <MetricCard key={index} {...data} />
                ))
              ) : (
                <div className="col-span-4 bg-slate-100 p-6 rounded-xl text-center text-slate-500 font-medium">
                  Select a project ID to populate project breakdown cards.
                </div>
              )}
            </div>
          </div>

          {/* Graphs Block Rendering */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
            <PerformanceGraph title="Total Company" data={graphData} />
            <PerformanceGraph title="Project" data={graphProjectData} />
            {/* <PerformanceGraph title="All" data={graphData} /> */}
          </div>
        </div>
      )}
    </div>
  );
};
