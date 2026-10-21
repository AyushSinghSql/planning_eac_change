// import React, { useEffect, useRef, useState, useMemo } from "react";
// import Chart from "chart.js/auto";
// import "chartjs-adapter-date-fns";
// import { enUS } from "date-fns/locale";
// import { Filter, X } from "lucide-react";
// import { backendUrl } from "./config";

// const DashboardGraphs = () => {
//   const pieChartRef = useRef(null);
//   const lineChartRef = useRef(null);
//   const monthlyVendorBarChartRef = useRef(null);
//   const [invoiceData, setInvoiceData] = useState([]);

//   // Filter states
//   const [selectedVendor, setSelectedVendor] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [selectedPoNumber, setSelectedPoNumber] = useState("");
//   const [selectedPlc, setSelectedPlc] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [dateRangeOption, setDateRangeOption] = useState("all_time");
//   const [selectedMonth, setSelectedMonth] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const chartInstances = useRef({});

//   // Fetch and process data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${backendUrl}/api/Invoices`);
//         if (response.status === 404) {
//           setInvoiceData([]); // Treat 404 as "no data"
//         } else if (!response.ok) {
//           // For all other errors, still throw
//           throw new Error(`API request failed with status ${response.status}`);
//         } else {
//           const data = await response.json();
//           setInvoiceData(data);
//         }
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Handle date range changes
//   useEffect(() => {
//     const today = new Date();
//     let newStartDate = "";
//     let newEndDate = new Date().toISOString().split("T")[0];

//     switch (dateRangeOption) {
//       case "last_7_days":
//         const last7 = new Date();
//         last7.setDate(today.getDate() - 7);
//         newStartDate = last7.toISOString().split("T")[0];
//         break;
//       case "last_30_days":
//         const last30 = new Date();
//         last30.setDate(today.getDate() - 30);
//         newStartDate = last30.toISOString().split("T")[0];
//         break;
//       case "month_to_date":
//         if (selectedMonth) {
//           const [year, month] = selectedMonth.split("-");
//           newStartDate = new Date(year, parseInt(month) - 1, 1)
//             .toISOString()
//             .split("T")[0];
//         } else {
//           newStartDate = new Date(today.getFullYear(), today.getMonth(), 1)
//             .toISOString()
//             .split("T")[0];
//         }
//         break;
//       case "all_time":
//         newStartDate = "";
//         newEndDate = "";
//         break;
//       case "custom":
//         return;
//     }
//     setStartDate(newStartDate);
//     setEndDate(newEndDate);
//   }, [dateRangeOption, selectedMonth]);

//   // Memoized, co-related filter options
//   const {
//     vendorOptions,
//     employeeOptions,
//     poNumberOptions,
//     plcOptions,
//     filteredData,
//   } = useMemo(() => {
//     let filteredInvoices = invoiceData;

//     if (startDate) {
//       filteredInvoices = filteredInvoices.filter(
//         (inv) => new Date(inv.invoiceDate) >= new Date(startDate),
//       );
//     }
//     if (endDate) {
//       filteredInvoices = filteredInvoices.filter(
//         (inv) => new Date(inv.invoiceDate) <= new Date(endDate),
//       );
//     }

//     const newVendorOptions = [
//       ...new Set(
//         filteredInvoices
//           .flatMap((inv) =>
//             inv.invoiceTimesheetLines.map((line) => line.vendor),
//           )
//           .filter(Boolean),
//       ),
//     ].sort();

//     if (selectedVendor) {
//       filteredInvoices = filteredInvoices.filter((inv) =>
//         inv.invoiceTimesheetLines.some(
//           (line) => line.vendor === selectedVendor,
//         ),
//       );
//     }

//     const newEmployeeOptions = [
//       ...new Set(
//         filteredInvoices
//           .flatMap((inv) =>
//             inv.invoiceTimesheetLines.map((line) => line.employee),
//           )
//           .filter((e) => e && e.includes(" - ")),
//       ),
//     ].sort();

//     if (selectedEmployee) {
//       filteredInvoices = filteredInvoices.filter((inv) =>
//         inv.invoiceTimesheetLines.some(
//           (line) => line.employee === selectedEmployee,
//         ),
//       );
//     }

//     const newPoNumberOptions = [
//       ...new Set(filteredInvoices.map((inv) => inv.po_Number).filter(Boolean)),
//     ].sort();

//     if (selectedPoNumber) {
//       filteredInvoices = filteredInvoices.filter(
//         (inv) => inv.po_Number === selectedPoNumber,
//       );
//     }

//     const newPlcOptions = [
//       ...new Set(
//         filteredInvoices
//           .flatMap((inv) => inv.invoiceTimesheetLines.map((line) => line.plc))
//           .filter(Boolean),
//       ),
//     ].sort();

//     if (selectedPlc) {
//       filteredInvoices = filteredInvoices.filter((inv) =>
//         inv.invoiceTimesheetLines.some((line) => line.plc === selectedPlc),
//       );
//     }

//     return {
//       vendorOptions: newVendorOptions,
//       employeeOptions: newEmployeeOptions,
//       poNumberOptions: newPoNumberOptions,
//       plcOptions: newPlcOptions,
//       filteredData: filteredInvoices,
//     };
//   }, [
//     startDate,
//     endDate,
//     selectedVendor,
//     selectedEmployee,
//     selectedPoNumber,
//     selectedPlc,
//     invoiceData,
//   ]);

//   // Update charts when filtered data changes
//   useEffect(() => {
//     if (loading) return;

//     Object.values(chartInstances.current).forEach((chart) => {
//       if (chart) chart.destroy();
//     });

//     if (!filteredData.length) return;

//     // --- Pie Chart: Invoice Status ---
//     const invoicedCount = filteredData.filter((inv) => inv.isExported).length;
//     const notInvoicedCount = filteredData.length - invoicedCount;

//     const pieCtx = pieChartRef.current.getContext("2d");
//     chartInstances.current.pie = new Chart(pieCtx, {
//       type: "pie",
//       data: {
//         labels: ["Invoiced", "Not Invoiced"],
//         datasets: [
//           {
//             label: "Invoice Status",
//             data: [invoicedCount, notInvoicedCount],
//             backgroundColor: ["#6ee7b7", "#fca5a5"],
//             borderColor: ["#34d399", "#f87171"],
//             borderWidth: 1.5,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: { position: "top" },
//           title: {
//             display: true,
//             text: "Invoice Status",
//             font: { size: 18, weight: "bold" },
//           },
//         },
//       },
//     });

//     // --- Line Chart: Invoice Amount Over Time ---
//     const monthlyData = filteredData.reduce((acc, inv) => {
//       const month = inv.invoiceDate.substring(0, 7);
//       acc[month] = (acc[month] || 0) + inv.invoiceAmount;
//       return acc;
//     }, {});

//     const sortedMonths = Object.keys(monthlyData).sort();
//     const lineChartData = sortedMonths.map((month) => monthlyData[month]);

//     const lineCtx = lineChartRef.current.getContext("2d");
//     chartInstances.current.line = new Chart(lineCtx, {
//       type: "line",
//       data: {
//         labels: sortedMonths,
//         datasets: [
//           {
//             label: "Total Invoice Amount per Month",
//             data: lineChartData,
//             fill: true,
//             backgroundColor: "rgba(96, 165, 250, 0.1)",
//             borderColor: "#60a5fa",
//             tension: 0.1,
//             pointBackgroundColor: "#60a5fa",
//             pointBorderColor: "#fff",
//             pointHoverBackgroundColor: "#fff",
//             pointHoverBorderColor: "#60a5fa",
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: { position: "top" },
//           title: {
//             display: true,
//             text: "Monthly Invoice Totals",
//             font: { size: 18, weight: "bold" },
//           },
//         },
//         scales: {
//           x: {
//             type: "time",
//             time: {
//               unit: "month",
//               parser: "yyyy-MM",
//               tooltipFormat: "MMM yyyy",
//             },
//             title: { display: true, text: "Month" },
//             adapters: { date: { locale: enUS } },
//             grid: { display: false },
//           },
//           y: {
//             beginAtZero: true,
//             title: { display: true, text: "Invoice Amount (USD)" },
//             grid: { color: "#e5e7eb" },
//           },
//         },
//       },
//     });

//     // --- Grouped Bar Chart: Monthly Vendor Totals ---
//     const monthlyVendorData = filteredData.reduce((acc, inv) => {
//       const month = inv.invoiceDate.substring(0, 7);
//       if (!acc[month]) acc[month] = {};

//       inv.invoiceTimesheetLines.forEach((line) => {
//         acc[month][line.vendor] =
//           (acc[month][line.vendor] || 0) + line.mappedAmount;
//       });
//       return acc;
//     }, {});

//     const allChartMonths = Object.keys(monthlyVendorData).sort();
//     const allChartVendors = [
//       ...new Set(
//         filteredData.flatMap((inv) =>
//           inv.invoiceTimesheetLines.map((line) => line.vendor),
//         ),
//       ),
//     ];

//     const lightColors = [
//       "#a5b4fc",
//       "#6ee7b7",
//       "#fcd34d",
//       "#f0abfc",
//       "#93c5fd",
//       "#fda4af",
//       "#fdba74",
//       "#86efac",
//       "#a78bfa",
//       "#fb923c",
//     ];

//     const datasets = allChartVendors.map((vendor, i) => ({
//       label: vendor,
//       data: allChartMonths.map(
//         (month) => monthlyVendorData[month][vendor] || 0,
//       ),
//       backgroundColor: lightColors[i % lightColors.length],
//       borderRadius: 4,
//     }));

//     const barCtx = monthlyVendorBarChartRef.current.getContext("2d");
//     chartInstances.current.bar = new Chart(barCtx, {
//       type: "bar",
//       data: {
//         labels: allChartMonths,
//         datasets: datasets,
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: { position: "top" },
//           title: {
//             display: true,
//             text: "Monthly Invoice Totals by Vendor",
//             font: { size: 18, weight: "bold" },
//           },
//         },
//         scales: {
//           x: { stacked: false, grid: { display: false } },
//           y: { stacked: false, beginAtZero: true, grid: { color: "#e5e7eb" } },
//         },
//       },
//     });

//     return () => {
//       Object.values(chartInstances.current).forEach((chart) => {
//         if (chart) chart.destroy();
//       });
//     };
//   }, [filteredData, loading]);

//   const handleResetFilters = () => {
//     setSelectedVendor("");
//     setSelectedEmployee("");
//     setSelectedPoNumber("");
//     setSelectedPlc("");
//     setDateRangeOption("all_time");
//     setStartDate("");
//     setEndDate("");
//     setSelectedMonth("");
//   };

//   if (loading)
//     return <div className="ml-48 text-center p-8">Loading dashboard...</div>;
//   if (error)
//     return (
//       <div className="ml-48 text-center p-8 text-red-500">Error: {error}</div>
//     );

//   return (
//     <div className="bg-gray-100 flex-1 overflow-y-auto">
//       {/* <h2 className="text-3xl font-bold text-gray-800 mb-6">Analysis Dashboard</h2> */}
//       {/* <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 
//                bg-clip-text text-transparent mb-4">
//   Analysis Dashboard
// </h2> */}

//       <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-6">
//         <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
//           <div className="flex items-center gap-3">
//             <Filter className="text-gray-500" size={24} />
//             <h3 className="text-xl font-bold text-gray-800">Filter Options</h3>
//           </div>
//           <button
//             onClick={handleResetFilters}
//             className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-500 transition-colors"
//           >
//             <X size={16} />
//             Reset All
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Date Range
//             </label>
//             <select
//               value={dateRangeOption}
//               onChange={(e) => setDateRangeOption(e.target.value)}
//               className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition shadow-sm"
//             >
//               <option value="all_time">All Time</option>
//               <option value="last_7_days">Last 7 Days</option>
//               <option value="last_30_days">Last Month</option>
//               <option value="month_to_date">Month to Date</option>
//               <option value="custom">Custom Range</option>
//             </select>
//           </div>

//           {dateRangeOption === "month_to_date" && (
//             <div className="col-span-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Select Month
//               </label>
//               <input
//                 type="month"
//                 value={selectedMonth}
//                 onChange={(e) => setSelectedMonth(e.target.value)}
//                 className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition shadow-sm"
//               />
//             </div>
//           )}

//           {dateRangeOption === "custom" && (
//             <>
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition shadow-sm"
//                 />
//               </div>
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   End Date
//                 </label>
//                 <input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition shadow-sm"
//                 />
//               </div>
//             </>
//           )}

//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Vendor
//             </label>
//             <select
//               value={selectedVendor}
//               onChange={(e) => setSelectedVendor(e.target.value)}
//               className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition shadow-sm"
//             >
//               <option value="">All Vendors</option>
//               {vendorOptions.map((v) => (
//                 <option key={v} value={v}>
//                   {v}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Employee
//             </label>
//             <select
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition shadow-sm"
//             >
//               <option value="">All Employees</option>
//               {employeeOptions.map((e) => (
//                 <option key={e} value={e}>
//                   {e}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               PO Number
//             </label>
//             <select
//               value={selectedPoNumber}
//               onChange={(e) => setSelectedPoNumber(e.target.value)}
//               className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition shadow-sm"
//             >
//               <option value="">All PO Numbers</option>
//               {poNumberOptions.map((p) => (
//                 <option key={p} value={p}>
//                   {p}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               PLC
//             </label>
//             <select
//               value={selectedPlc}
//               onChange={(e) => setSelectedPlc(e.target.value)}
//               className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition shadow-sm"
//             >
//               <option value="">All PLCs</option>
//               {plcOptions.map((p) => (
//                 <option key={p} value={p}>
//                   {p}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {filteredData.length > 0 ? (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div
//             className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
//             style={{ height: "400px" }}
//           >
//             <canvas ref={lineChartRef}></canvas>
//           </div>
//           <div
//             className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
//             style={{ height: "400px" }}
//           >
//             <canvas ref={pieChartRef}></canvas>
//           </div>
//           <div
//             className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
//             style={{ height: "400px" }}
//           >
//             <canvas ref={monthlyVendorBarChartRef}></canvas>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center p-12 bg-white rounded-2xl shadow-lg border border-gray-200">
//           <h3 className="text-xl font-semibold text-gray-700">No Data Found</h3>
//           <p className="text-gray-500 mt-2">
//             There is no invoice data available for the selected filters. Please
//             adjust your criteria or reset the filters.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardGraphs;



import React from 'react'

const DashboardGraphs = () => {
  return (
    <div>
      Hello Ayush
    </div>
  )
}

export default DashboardGraphs
