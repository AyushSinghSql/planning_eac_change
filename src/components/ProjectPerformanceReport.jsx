import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  DollarSign,
  Percent,
} from "lucide-react";

// Static Data matching the report screenshot
const kpiData = {
  budget: 402.5,
  eac12: 391.6,
  revenueVariance: -10.9,
  gmBudget: 148.6,
  gmEac12: 150.4,
  gmVariance: 1.8,
};

const revenueChartData = [
  { name: "FBI Threat Screening", value: 19.7 },
  { name: "Project ICON", value: 14.6 },
  { name: "MSC IBS", value: 8.1 },
  { name: "ARL ITMS", value: 6.8 },
  { name: "FBI ITSSS-2", value: 6.8 },
  { name: "DHS - USCIS SPEED", value: 6.3 },
  { name: "Comprehen...", value: 4.2 },
  { name: "CAOC 2.5 - 7", value: 4.0 },
  { name: "Intercompany", value: 3.1 },
  { name: "CAOC3.0", value: 3.0 },
  { name: "USCIS RAPID", value: -2.8 },
  { name: "GSD", value: -2.9 },
  { name: "ELIMINATIO...", value: -3.1 },
  { name: "GSA Moderniz...", value: -5.0 },
  { name: "NETCOM GCC", value: -7.4 },
  { name: "Engineering Support", value: -8.0 },
  { name: "CBP ENAESS III", value: -8.3 },
  { name: "GAON", value: -12.9 },
  { name: "NOAA Weather", value: -16.0 },
  { name: "DISA Cloud", value: -26.7 },
];

const gmChartData = [
  { name: "FBI Threat Screening", value: 7.2 },
  { name: "Project ICON", value: 5.8 },
  { name: "MSC IBS", value: 3.3 },
  { name: "DHS - USCIS SPEED", value: 3.1 },
  { name: "ARL ITMS", value: 2.7 },
  { name: "CAOC3.0", value: 2.0 },
  { name: "CAOC 2.5 - 3", value: 1.8 },
  { name: "Intercompany", value: 1.7 },
  { name: "NIMITZ IT", value: 1.6 },
  { name: "USCIS RAPID", value: 1.2 },
  { name: "CAOC 2.5 - 3 (M2)", value: -0.9 },
  { name: "NETCOM GCC", value: -1.1 },
  { name: "GSA Moderniz...", value: -1.3 },
  { name: "GAON", value: -1.9 },
  { name: "Engineering Support", value: -2.0 },
  { name: "CBP ENAESS III", value: -3.2 },
  { name: "NOAA Weather", value: -3.2 },
  { name: "DISA Cloud", value: -3.5 },
  { name: "Project X", value: -6.4 },
  { name: "Project Y", value: -10.7 },
];

// Custom Tooltip to format the values nicely
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-slate-800 text-white p-2 rounded shadow-md text-xs border border-slate-700">
        <p className="font-semibold">{payload[0].payload.name}</p>
        <p className={val >= 0 ? "text-emerald-400" : "text-rose-400"}>
          Variance: {val >= 0 ? `+${val}` : `(${Math.abs(val)})`}
        </p>
      </div>
    );
  }
  return null;
};

export default function ProjectPerformanceReport() {
  const formatVariance = (val) => {
    if (val < 0) return `(${Math.abs(val).toFixed(1)})`;
    return `+${val.toFixed(1)}`;
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 text-slate-800 font-sans">
      {/* Header Controls Block */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">
              Top 10 & Bottom 10 Project Names
            </h1>
            <p className="text-xs text-slate-400">Actuals through Mar - 2026</p>
          </div>
        </div>

        {/* Mock Dropdowns matching the original UI */}
        <div className="flex gap-4 text-xs text-slate-300">
          <div>
            <span className="block text-[10px] text-slate-500 font-semibold uppercase">
              Metric
            </span>
            <div className="bg-slate-800 px-3 py-1.5 rounded mt-0.5 border border-slate-700">
              EAC12
            </div>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 font-semibold uppercase">
              Bridge
            </span>
            <div className="bg-slate-800 px-3 py-1.5 rounded mt-0.5 border border-slate-700">
              Budget
            </div>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 font-semibold uppercase">
              Sector
            </span>
            <div className="bg-slate-800 px-3 py-1.5 rounded mt-0.5 border border-slate-700">
              All
            </div>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 font-semibold uppercase">
              BU
            </span>
            <div className="bg-slate-800 px-3 py-1.5 rounded mt-0.5 border border-slate-700">
              All
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {/* Budget */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" /> Budget
          </p>
          <p className="text-2xl font-bold mt-2 text-slate-900">
            {kpiData.budget}
          </p>
        </div>

        {/* EAC12 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            EAC12
          </p>
          <p className="text-2xl font-bold mt-2 text-slate-900">
            {kpiData.eac12}
          </p>
        </div>

        {/* Revenue Variance */}
        <div
          className={`p-4 rounded-xl border shadow-sm ${kpiData.revenueVariance < 0 ? "bg-rose-50/50 border-rose-200" : "bg-emerald-50/50 border-emerald-200"}`}
        >
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            Revenue Variance
            {kpiData.revenueVariance < 0 ? (
              <ArrowDownRight className="w-4 h-4 text-rose-500" />
            ) : (
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            )}
          </p>
          <p
            className={`text-2xl font-bold mt-2 ${kpiData.revenueVariance < 0 ? "text-rose-600" : "text-emerald-600"}`}
          >
            {formatVariance(kpiData.revenueVariance)}
          </p>
        </div>

        {/* GM Budget */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Percent className="w-3.5 h-3.5" /> GM Budget
          </p>
          <p className="text-2xl font-bold mt-2 text-slate-900">
            {kpiData.gmBudget}
          </p>
        </div>

        {/* GM EAC12 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            GM EAC12
          </p>
          <p className="text-2xl font-bold mt-2 text-slate-900">
            {kpiData.gmEac12}
          </p>
        </div>

        {/* GM Variance */}
        <div
          className={`p-4 rounded-xl border shadow-sm ${kpiData.gmVariance < 0 ? "bg-rose-50/50 border-rose-200" : "bg-emerald-50/50 border-emerald-200"}`}
        >
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            GM Variance
            {kpiData.gmVariance < 0 ? (
              <ArrowDownRight className="w-4 h-4 text-rose-500" />
            ) : (
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            )}
          </p>
          <p
            className={`text-2xl font-bold mt-2 ${kpiData.gmVariance < 0 ? "text-rose-600" : "text-emerald-600"}`}
          >
            {formatVariance(kpiData.gmVariance)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        {/* Chart 1: Revenue Variance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
            Top 10 & Bottom 10 by Contract Names (Revenue)
          </h3>
          <div className="w-full h-64 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueChartData}
                margin={{ top: 15, right: 10, left: -25, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  angle={-35}
                  textAnchor="end"
                  height={50}
                  stroke="#64748b"
                />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1.5} />
                <Bar dataKey="value" maxBarSize={30}>
                  {revenueChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value >= 0 ? "#10b981" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Gross Margin Variance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
            Top 10 & Bottom 10 by Contract Names (Gross Margin)
          </h3>
          <div className="w-full h-64 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gmChartData}
                margin={{ top: 15, right: 10, left: -25, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  angle={-35}
                  textAnchor="end"
                  height={50}
                  stroke="#64748b"
                />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1.5} />
                <Bar dataKey="value" maxBarSize={30}>
                  {gmChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value >= 0 ? "#10b981" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
