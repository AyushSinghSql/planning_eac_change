import React, { useMemo, useState } from "react";
import {
  Wallet,
  Clock,
  Users,
  Briefcase,
  TrendingUp,
  Inbox,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

/* Self-contained: nothing here depends on PBRReport.jsx helpers. */
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

function formatCurrency(value) {
  const v = Number(value || 0);
  const sign = v < 0 ? "-" : "";
  return (
    sign +
    "$" +
    Math.abs(v).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function formatCompact(value) {
  const v = Number(value || 0);
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(abs >= 1e5 ? 0 : 1)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

function formatNumber(value, digits = 0) {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function safeString(value) {
  return value === null || value === undefined ? "" : String(value);
}

const DASH_COLORS = [
  "#4f46e5",
  "#0d9488",
  "#d97706",
  "#e11d48",
  "#7c3aed",
  "#0284c7",
  "#65a30d",
];
const DASH_OTHER_COLOR = "#94a3b8";

const DASH_TOOLTIP_STYLE = {
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
  fontSize: "12px",
};

function DashCard({
  title,
  subtitle,
  right,
  flush = false,
  className = "",
  children,
}) {
  return (
    <section
      className={`bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col min-w-0 ${className}`}
    >
      <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-slate-100">
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-slate-800 truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {right}
      </header>
      <div className={`flex-1 min-h-0 ${flush ? "" : "p-5"}`}>{children}</div>
    </section>
  );
}

function KpiCard({ icon, label, value, hint, tone = "indigo" }) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    teal: "bg-teal-50 text-teal-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex items-start gap-3 min-w-0">
      <div
        className={`flex-none w-9 h-9 rounded-lg flex items-center justify-center ${tones[tone]}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] text-slate-500">{label}</p>
        <p
          className="text-[22px] leading-7 font-semibold text-slate-900 tabular-nums truncate"
          title={String(value)}
        >
          {value}
        </p>
        {hint && (
          <p
            className="text-[11px] text-slate-500 mt-0.5 truncate"
            title={hint}
          >
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DashboardView({
  laborData,
  nonLaborData,
  revenueData,
  dashboardTab,
  setDashboardTab,
  versionLabel,
  fiscalYear,
}) {
  const [trendMetric, setTrendMetric] = useState("amount");

  const isLabor = dashboardTab === "Labor";
  const isRevenue = dashboardTab === "Revenue";
  const rows = isLabor ? laborData : isRevenue ? revenueData : nonLaborData;

  const analytics = useMemo(() => {
    const totalAmount = rows.reduce(
      (s, r) => s + Number(r.totalAmount || 0),
      0,
    );
    const totalHours = rows.reduce((s, r) => s + Number(r.totalHours || 0), 0);

    const monthly = months.map((m) => ({
      month: m,
      amount: Number(
        rows.reduce((s, r) => s + Number(r[`${m}Amount`] || 0), 0).toFixed(2),
      ),
      hours: Number(
        rows.reduce((s, r) => s + Number(r[`${m}Hours`] || 0), 0).toFixed(2),
      ),
    }));

    const peak = monthly.reduce(
      (best, cur) => (cur.amount > best.amount ? cur : best),
      { month: "-", amount: 0 },
    );

    const groupMap = {};
    const projMap = {};
    // rows.forEach((r) => {
    //   const grp = r.pbrGroup || "Unmapped";
    rows.forEach((r) => {
      // const rawGrp = safeString(r.pbrGroup).trim() || "Unmapped";
      // // EMPLOYEE is not its own group; it belongs to Direct Labor
      // const grp = rawGrp.toUpperCase() === "EMPLOYEE" ? "Direct Labor" : rawGrp;
      const rawGrp =
        safeString(r.pbrGroup).trim() || (isRevenue ? "Revenue" : "Unmapped");
      let grp = rawGrp;
      if (rawGrp.toUpperCase() === "EMPLOYEE") grp = "Direct Labor";
      // else if (/^other\s+direct\s+costs?$/i.test(rawGrp)) grp = "Other Direct Costs";
      else if (!isLabor && !isRevenue && /other\s*direct|odc/i.test(rawGrp))
        grp = "Other Direct Costs";

      const pid = r.projId || "NA";
      if (!groupMap[grp]) groupMap[grp] = { name: grp, hours: 0, amount: 0 };
      if (!projMap[pid])
        projMap[pid] = {
          label: pid,
          fullName: `${pid} - ${r.projName || "NA"}`,
          hours: 0,
          amount: 0,
        };
      groupMap[grp].hours += Number(r.totalHours || 0);
      groupMap[grp].amount += Number(r.totalAmount || 0);
      projMap[pid].hours += Number(r.totalHours || 0);
      projMap[pid].amount += Number(r.totalAmount || 0);
    });

    const byGroup = Object.values(groupMap).sort((a, b) => b.amount - a.amount);

    // Donut: top 6 groups plus an "Other" bucket
    const donut = byGroup.slice(0, 6).map((g, i) => ({
      ...g,
      color: DASH_COLORS[i % DASH_COLORS.length],
    }));
    const rest = byGroup.slice(6);
    if (rest.length > 0) {
      donut.push({
        name: `Other (${rest.length})`,
        hours: rest.reduce((s, g) => s + g.hours, 0),
        amount: rest.reduce((s, g) => s + g.amount, 0),
        color: DASH_OTHER_COLOR,
      });
    }

    const projMetric = isLabor ? "hours" : "amount";
    const byProj = Object.values(projMap)
      .filter((p) => isRevenue || /^C/i.test(safeString(p.label).trim()))
      .sort((a, b) => b[projMetric] - a[projMetric])
      .slice(0, 8);

    const realIds = (list, key) =>
      new Set(
        list
          .map((r) => safeString(r[key]).trim())
          .filter((v) => v && v !== "TBD" && v !== "NA"),
      );

    const projectCount = realIds(rows, "projId").size;

    const empIds = realIds(rows, "empId");
    const activeEmpIds = new Set(
      rows
        .filter((r) => r.empStatus === "Active")
        .map((r) => safeString(r.empId).trim())
        .filter((v) => v && v !== "TBD"),
    );

    return {
      totalAmount,
      totalHours,
      monthly,
      peak,
      byGroup,
      donut,
      byProj,
      projMetric,
      projectCount,
      employeeCount: empIds.size,
      activeEmployeeCount: activeEmpIds.size,
      vendorCount: realIds(rows, "vendorId").size,
      avgRate: totalHours > 0 ? totalAmount / totalHours : 0,
    };
    // }, [rows, isLabor]);
  }, [rows, isLabor, isRevenue]);

  // const tabs = ["Labor", "Non-Labor", "Revenue"];
  // const amountLabel = isRevenue ? "Revenue" : "Budget";
  // const showHoursTrend = isLabor && trendMetric === "hours";
  const tabs = ["Labor", "Non-Labor", "Revenue"];
  const amountLabel = isRevenue ? "Revenue" : "Budget";
  const tabTag = isLabor ? " (Labor)" : isRevenue ? "" : " (Non-Labor)";
  const showHoursTrend = isLabor && trendMetric === "hours";

  // const kpis = isLabor
  //   ? [
  //       {
  //         icon: <Wallet size={18} />,
  //         label: "Total labor budget",
  //         value: formatCompact(analytics.totalAmount),
  //         hint: formatCurrency(analytics.totalAmount),
  //         tone: "indigo",
  //       },
  //       {
  //         icon: <Clock size={18} />,
  //         label: "Total hours",
  //         value: formatNumber(analytics.totalHours, 0),
  //         hint: `Avg ${formatCurrency(analytics.avgRate)} per hour`,
  //         tone: "amber",
  //       },
  //       {
  //         icon: <Users size={18} />,
  //         label: "Employees",
  //         value: formatNumber(analytics.employeeCount),
  //         hint: `${formatNumber(analytics.activeEmployeeCount)} active`,
  //         tone: "teal",
  //       },
  //       {
  //         icon: <Briefcase size={18} />,
  //         label: "Projects",
  //         value: formatNumber(analytics.projectCount),
  //       //   hint: `${formatNumber(rows.length)} line items`,
  //         tone: "rose",
  //       },
  //     ]
  //   : [
  //       {
  //         icon: <Wallet size={18} />,
  //         label: isRevenue ? "Total revenue" : "Total non-labor budget",
  //         value: formatCompact(analytics.totalAmount),
  //         hint: formatCurrency(analytics.totalAmount),
  //         tone: "indigo",
  //       },
  // isRevenue
  //   ? {
  //       icon: <Inbox size={18} />,
  //       label: "Line items",
  //       value: formatNumber(rows.length),
  //       hint: "Revenue schedule rows",
  //       tone: "amber",
  //     }
  //   : {
  //       icon: <Users size={18} />,
  //       label: "Vendors",
  //       value: formatNumber(analytics.vendorCount),
  //       hint: "Excludes unassigned (TBD)",
  //       tone: "amber",
  //     },

  //   {
  //     icon: <Briefcase size={18} />,
  //     label: "Projects",
  //     value: formatNumber(analytics.projectCount),
  //   //   hint: `${formatNumber(rows.length)} line items`,
  //     tone: "teal",
  //   },
  //   {
  //     icon: <TrendingUp size={18} />,
  //     label: "Peak month",
  //     value: analytics.peak.amount > 0 ? analytics.peak.month : "-",
  //     hint:
  //       analytics.peak.amount > 0
  //         ? formatCurrency(analytics.peak.amount)
  //         : "No monthly values yet",
  //     tone: "rose",
  //   },
  // ];
  const kpis = isLabor
    ? [
        {
          icon: <Wallet size={18} />,
          label: "Total labor budget",
          value: formatCompact(analytics.totalAmount),
          hint: formatCurrency(analytics.totalAmount),
          tone: "indigo",
        },
        {
          icon: <Clock size={18} />,
          label: "Total hours",
          value: formatNumber(analytics.totalHours, 0),
          hint: `Avg ${formatCurrency(analytics.avgRate)} per hour`,
          tone: "amber",
        },
        {
          icon: <Users size={18} />,
          label: "Employees",
          value: formatNumber(analytics.employeeCount),
          hint: `${formatNumber(analytics.activeEmployeeCount)} active`,
          tone: "teal",
        },
        {
          icon: <Briefcase size={18} />,
          label: "Projects",
          value: formatNumber(analytics.projectCount),
          tone: "rose",
        },
      ]
    : [
        {
          icon: <Wallet size={18} />,
          label: isRevenue ? "Total revenue" : "Total non-labor budget",
          value: formatCompact(analytics.totalAmount),
          hint: formatCurrency(analytics.totalAmount),
          tone: "indigo",
        },
        ...(!isRevenue
          ? [
              {
                icon: <Users size={18} />,
                label: "Vendors",
                value: formatNumber(analytics.vendorCount),
                hint: "Excludes unassigned (TBD)",
                tone: "amber",
              },
            ]
          : []),
        {
          icon: <Briefcase size={18} />,
          label: "Projects",
          value: formatNumber(analytics.projectCount),
          tone: "teal",
        },
        {
          icon: <TrendingUp size={18} />,
          label: "Peak month",
          value: analytics.peak.amount > 0 ? analytics.peak.month : "-",
          hint:
            analytics.peak.amount > 0
              ? formatCurrency(analytics.peak.amount)
              : "No monthly values yet",
          tone: "rose",
        },
      ];

  const donutTotal = analytics.donut.reduce((s, g) => s + g.amount, 0);
  // PBR Breakdown table: on the Labor tab, hide the "Other Direct Cost" group
  const breakdownRows = isLabor
    ? analytics.byGroup.filter((g) => !/other\s+direct\s+cost/i.test(g.name))
    : analytics.byGroup;
  const breakdownTotal = breakdownRows.reduce((s, g) => s + g.amount, 0);

  return (
    <div className="flex-1 min-h-0 overflow-auto custom-scrollbar flex flex-col gap-4 pb-6">
      {/* Header + segmented control */}
      <div className="flex-none flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-slate-900">
            Dashboard
          </h2>
          {/* <p className="text-[12px] text-slate-500">
            {versionLabel} · FY {fiscalYear} · {formatNumber(rows.length)}{" "}
            {dashboardTab.toLowerCase()} line items
          </p> */}
        </div>
        <div
          role="tablist"
          aria-label="Dashboard view"
          className="flex bg-slate-100 border border-slate-200 rounded-lg p-1"
        >
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={dashboardTab === t}
              onClick={() => setDashboardTab(t)}
              className={`px-4 py-1.5 text-[12px] font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                dashboardTab === t
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="flex-1 min-h-[320px] bg-white border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-center px-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Inbox size={22} />
          </div>
          <p className="text-[14px] font-semibold text-slate-800">
            No {dashboardTab.toLowerCase()} data in {versionLabel}
          </p>
          <p className="text-[12px] text-slate-500 mt-1 max-w-sm">
            Add rows on the {dashboardTab} tab, or switch to another version,
            and the charts will fill in here.
          </p>
        </div>
      ) : (
        <>
          {/* KPI row */}
          {/* <div className="flex-none grid grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <KpiCard key={k.label} {...k} />
            ))}
          </div> */}
          <div
            className={`flex-none grid grid-cols-2 ${
              isRevenue ? "xl:grid-cols-3" : "xl:grid-cols-4"
            } gap-4`}
          >
            {kpis.map((k) => (
              <KpiCard key={k.label} {...k} />
            ))}
          </div>

          {/* Trend + distribution */}
          <div className="flex-none grid grid-cols-1 xl:grid-cols-3 gap-4">
            <DashCard
              className="xl:col-span-2"
              // title={showHoursTrend ? "Hours by month" : `${amountLabel} by month`}
              title={
                showHoursTrend
                  ? `Hours By Month${tabTag}`
                  : `${amountLabel} By Month${tabTag}`
              }
              subtitle={`Monthly phasing for FY ${fiscalYear}`}
              right={
                isLabor ? (
                  <div className="flex bg-slate-100 border border-slate-200 rounded-md p-0.5">
                    {[
                      ["amount", "Amount"],
                      ["hours", "Hours"],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setTrendMetric(key)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                          trendMetric === key
                            ? "bg-white text-indigo-700 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                ) : null
              }
            >
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analytics.monthly}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="dashAreaFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#4f46e5"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="100%"
                          stopColor="#4f46e5"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                      width={56}
                      tickFormatter={(v) =>
                        showHoursTrend ? formatNumber(v) : formatCompact(v)
                      }
                    />
                    <RechartsTooltip
                      contentStyle={DASH_TOOLTIP_STYLE}
                      formatter={(v) =>
                        showHoursTrend
                          ? [`${formatNumber(v, 2)} hrs`, "Hours"]
                          : [formatCurrency(v), amountLabel]
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey={showHoursTrend ? "hours" : "amount"}
                      stroke="#4f46e5"
                      strokeWidth={2}
                      fill="url(#dashAreaFill)"
                      dot={{ r: 3, fill: "#4f46e5", strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DashCard>

            <DashCard
              title={`${amountLabel} By PBR Group${
                isLabor ? " (Labor)" : isRevenue ? "" : " (Non-Labor)"
              }`}
              subtitle={
                analytics.byGroup.length > 6
                  ? "Top 6 groups, remainder combined"
                  : "Share of total"
              }
            >
              <div className="relative h-[170px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.donut}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {analytics.donut.map((entry, i) => (
                        <Cell key={`slice-${i}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={DASH_TOOLTIP_STYLE}
                      formatter={(v, name) => [formatCurrency(v), name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] text-slate-500">Total</span>
                  <span className="text-[16px] font-semibold text-slate-900 tabular-nums">
                    {formatCompact(donutTotal)}
                  </span>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5 max-h-[110px] overflow-auto custom-scrollbar pr-1">
                {analytics.donut.map((g) => (
                  <li
                    key={g.name}
                    className="flex items-center justify-between gap-2 text-[12px]"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        className="flex-none w-2.5 h-2.5 rounded-sm"
                        style={{ background: g.color }}
                      />
                      <span className="truncate text-slate-700" title={g.name}>
                        {g.name}
                      </span>
                    </span>
                    <span className="flex-none tabular-nums text-slate-500">
                      {donutTotal > 0
                        ? ((g.amount / donutTotal) * 100).toFixed(1)
                        : "0.0"}
                      %
                    </span>
                  </li>
                ))}
              </ul>
            </DashCard>
          </div>

          {/* Ranking table + top projects */}
          {/* <div className="flex-none grid grid-cols-1 xl:grid-cols-2 gap-4"> */}
          <div
            className={`flex-none grid grid-cols-1 gap-4 ${
              isRevenue ? "" : "xl:grid-cols-2"
            }`}
          >
            {!isRevenue && (
              <DashCard
                flush
                // title="PBR group breakdown"
                // subtitle={`${formatNumber(analytics.byGroup.length)} groups, largest first`}
                title={`PBR Breakdown${tabTag}`}
                subtitle={`${formatNumber(breakdownRows.length)} groups, largest first`}
              >
                <div className="overflow-auto custom-scrollbar max-h-[360px]">
                  <table className="w-full text-left border-collapse tabular-nums">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_0_#e2e8f0]">
                      <tr className="text-[11px] font-semibold text-slate-500">
                        <th className="px-5 py-2">Group</th>
                        {isLabor && (
                          <th className="px-3 py-2 text-right">Hours</th>
                        )}
                        <th className="px-3 py-2 text-right">Amount</th>
                        <th className="px-5 py-2 w-[140px]">Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {breakdownRows.map((g) => {
                        const pct =
                          breakdownTotal > 0
                            ? (g.amount / breakdownTotal) * 100
                            : 0;
                        return (
                          <tr
                            key={g.name}
                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                          >
                            <td
                              className="px-5 py-2.5 text-[12px] font-medium text-slate-700 truncate max-w-[220px]"
                              title={g.name}
                            >
                              {g.name}
                            </td>
                            {isLabor && (
                              <td className="px-3 py-2.5 text-[12px] text-slate-600 text-right">
                                {formatNumber(g.hours, 1)}
                              </td>
                            )}
                            <td className="px-3 py-2.5 text-[12px] font-semibold text-slate-900 text-right">
                              {formatCurrency(g.amount)}
                            </td>
                            <td className="px-5 py-2.5">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-indigo-500 rounded-full"
                                    style={{ width: `${Math.min(100, pct)}%` }}
                                  />
                                </div>
                                <span className="w-10 text-right text-[11px] text-slate-500">
                                  {pct.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </DashCard>
            )}

            <DashCard
              title={
                isLabor
                  ? "Top 10 Direct Projects By Hours"
                  : `Top 10 Direct Projects By ${amountLabel.toLowerCase()}`
              }
              subtitle="Top-level project IDs"
            >
              <div
                style={{
                  height: Math.max(220, analytics.byProj.length * 34 + 30),
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.byProj}
                    layout="vertical"
                    margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) =>
                        isLabor ? formatNumber(v) : formatCompact(v)
                      }
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={96}
                      tick={{ fontSize: 11, fill: "#475569" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={DASH_TOOLTIP_STYLE}
                      labelFormatter={(l, payload) =>
                        payload?.[0]?.payload?.fullName || l
                      }
                      formatter={(v) =>
                        isLabor
                          ? [`${formatNumber(v, 2)} hrs`, "Hours"]
                          : [formatCurrency(v), amountLabel]
                      }
                    />
                    <Bar
                      dataKey={analytics.projMetric}
                      fill={isLabor ? "#0d9488" : "#4f46e5"}
                      radius={[0, 4, 4, 0]}
                      barSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashCard>
          </div>
        </>
      )}
    </div>
  );
}
