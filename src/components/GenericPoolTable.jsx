import React, { useState, useEffect } from "react";
import { backendUrl } from "./config";

const monthsHeader = [
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

const GenericPoolTable = ({ poolType, poolData, allPools = [] }) => {
  const [costData, setCostData] = useState([]);
  const [baseData, setBaseData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [closePeriod, setClosePeriod] = useState(null);
  const [closePeriodLabel, setClosePeriodLabel] = useState("");
  const [escPercent, setEscPercent] = useState(""); // escalation %
  const [rate, setRate] = useState(0);
  const [ytdBaseAllocationActual, setYtdBaseAllocationActual] = useState(0);
  const [closePeriodMonth, setClosePeriodMonth] = useState(null); // 1–12
  const [closePeriodYear, setClosePeriodYear] = useState(null);
  const [costTotals, setCostTotals] = useState({
    totalYTDCostActualAmt: 0,
    totalYTDCostBudgetAmt: 0,
    monthTotals: Array(12).fill(0),
    ytdMonthTotals: Array(12).fill(0),
  });

  const [baseTotals, setBaseTotals] = useState({
    ytdBaseTotal: 0,
    ytdAllocTotal: 0,
    ytdBudgetTotal: 0,
    monthBaseTotals: Array(12).fill(0),
    monthAllocTotals: Array(12).fill(0),
    monthYtdCostTotals: Array(12).fill(0), // ✅ NEW
    monthYtdAllocTotals: Array(12).fill(0),
  });

  const [costSortDir, setCostSortDir] = useState("asc"); // for costData
  const [baseSortDir, setBaseSortDir] = useState("asc"); // for baseData

  const [hideZeroRows, setHideZeroRows] = useState(false);

  const [exporting, setExporting] = useState(false);

  const handleExportAll = async () => {
    setExporting(true);
    await exportAllPoolTablesToXlsx({
      selectedYear,
      closePeriodLabel,
      isPeriodClosed,
      poolType,
      allPools,
    });
    setExporting(false);
  };

  const sortedCostData = [...costData].sort((a, b) => {
    if (a.acctId === b.acctId) return 0;
    if (costSortDir === "asc") {
      return a.acctId > b.acctId ? 1 : -1;
    }
    return a.acctId < b.acctId ? 1 : -1;
  });

  const sortedBaseData = [...baseData].sort((a, b) => {
    if (a.acctId === b.acctId) return 0;
    if (baseSortDir === "asc") {
      return a.acctId > b.acctId ? 1 : -1;
    }
    return a.acctId < b.acctId ? 1 : -1;
  });

  const displayedCostData = hideZeroRows
    ? sortedCostData.filter((item) => {
        const hasYtdData =
          item.ytdActual !== 0 || item.ytdBudget !== 0 || item.ytdamt !== 0;
        const hasMonthData = item.months.some(
          (m) => m.actual !== 0 || m.budget !== 0 || m.ytdamt !== 0,
        );
        return hasYtdData || hasMonthData;
      })
    : sortedCostData;

  const displayedBaseData = hideZeroRows
    ? sortedBaseData.filter((item) => {
        const hasYtdData =
          item.ytdBase !== 0 ||
          item.ytdAllocation !== 0 ||
          item.ytdBudget !== 0;
        const hasMonthData = item.months.some(
          (m) =>
            m.base !== 0 ||
            m.ytdcostAmt !== 0 ||
            m.allocation !== 0 ||
            m.ytdAllocationAmt !== 0,
        );
        return hasYtdData || hasMonthData;
      })
    : sortedBaseData;

  const monthNames = monthsHeader;
  // config: closing_period + escallation_percent
  const fetchConfig = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`,
      );
      const cfg = await res.json();

      const closing = cfg.find((c) => c.name === "closing_period");
      if (closing?.value) {
        const d = new Date(closing.value);
        const m = d.getMonth(); // 0–11
        const y = d.getFullYear();
        setClosePeriodMonth(m + 1);
        setClosePeriodYear(y);
        setClosePeriodLabel(`${monthsHeader[m]} ${y}`);
      }

      const esc = cfg.find((c) => c.name === "escallation_percent");
      if (esc?.value) setEscPercent(esc.value);
    } catch {
      setClosePeriod(null);
      setClosePeriodLabel("");
      setEscPercent("");
    }
  };

  const isPeriodClosed = (period, year) => {
    if (!closePeriodMonth || !closePeriodYear) return false;
    if (year < closePeriodYear) return true;
    if (year > closePeriodYear) return false;
    return period <= closePeriodMonth;
  };

  // map cost detail
  const mapCostData = (rows) =>
    rows.map((row) => ({
      orgId: row.orgId,
      acctId: row.acctId,
      accountName: row.accountName,
      ytdActual: Number(row.ytdActualAmt) || 0,
      ytdBudget: Number(row.ytdBudgetedAmt) || 0,
      ytdamt: Number(row.ytdamt) || 0,
      months: monthsHeader.map((_, idx) => {
        const period = idx + 1;
        const p = row.periodDetails?.find((d) => d.period === period) || {};
        return {
          actual: Number(p.actualamt) || 0,
          budget: Number(p.actualamt) || 0,
          ytdamt: Number(p.ytdamt) || 0,
        };
      }),
    }));

  // map base detail
  const mapBaseData = (rows) =>
    rows.map((row) => ({
      orgId: row.orgId,
      acctId: row.acctId,
      allocationOrgId: row.allocationOrgId,
      allocationAcctId: row.allocationAcctId,
      accountName: row.accountName,
      ytdBase: Number(row.ytdActualAmt) || 0, // 22,111,491.57
      ytdAllocation: Number(row.ytdAllocationAmt) || 0, // 3,561,851.73
      ytdBudget: Number(row.ytdBudgetedAmt) || 0, // 0
      months: monthsHeader.map((_, idx) => {
        const period = idx + 1;
        const p = row.periodDetails?.find((d) => d.period === period) || {};
        return {
          base: Number(p.baseAmt) || 0,
          allocation: Number(p.allocationAmt) || 0,
          ytdcostAmt: Number(p.ytdcostAmt) || 0,
          ytdAllocationAmt: Number(p.ytdAllocationAmt) || 0,
        };
      }),
    }));

  const calcCostTotals = (rows) => {
    const totalYTDCostActualAmt = rows.reduce(
      (sum, r) => sum + (Number(r.ytdActual) || 0),
      0,
    );

    const totalYTDCostBudgetAmt = rows.reduce(
      (sum, r) => sum + (Number(r.ytdBudget) || 0),
      0,
    );
    const monthTotals = monthsHeader.map((_, idx) => {
      const period = idx + 1;
      const closed = isPeriodClosed(period, selectedYear);
      return rows.reduce((sum, r) => {
        const val = closed
          ? Number(r.months[idx]?.actual) || 0
          : Number(r.months[idx]?.actual) || 0;
        return sum + val;
      }, 0);
    });

    // NEW: Calculate YTD totals for each period
    const ytdMonthTotals = monthsHeader.map((_, idx) => {
      return rows.reduce((sum, r) => {
        return sum + Number(r.months[idx]?.ytdamt || 0);
      }, 0);
    });

    return {
      totalYTDCostActualAmt,
      monthTotals,
      totalYTDCostBudgetAmt,
      ytdMonthTotals,
    };
  };

  const calcBaseTotals = (rows) => {
    const ytdBaseTotal = rows.reduce(
      (sum, r) => sum + (Number(r.ytdBase) || 0),
      0,
    );
    const ytdAllocTotal = rows.reduce(
      (sum, r) => sum + (Number(r.ytdAllocation) || 0),
      0,
    );
    const ytdBudgetTotal = rows.reduce(
      (sum, r) => sum + (Number(r.ytdBudget) || 0),
      0,
    );

    const monthBaseTotals = monthsHeader.map((_, idx) =>
      rows.reduce((sum, r) => sum + (Number(r.months[idx]?.base) || 0), 0),
    );
    const monthAllocTotals = monthsHeader.map((_, idx) =>
      rows.reduce(
        (sum, r) => sum + (Number(r.months[idx]?.allocation) || 0),
        0,
      ),
    );

    const monthYtdCostTotals = monthsHeader.map(
      (
        _,
        idx, // ✅ NEW
      ) =>
        rows.reduce(
          (sum, r) => sum + (Number(r.months[idx]?.ytdcostAmt) || 0),
          0,
        ),
    );
    const monthYtdAllocTotals = monthsHeader.map(
      (
        _,
        idx, // ✅ NEW
      ) =>
        rows.reduce(
          (sum, r) => sum + (Number(r.months[idx]?.ytdAllocationAmt) || 0),
          0,
        ),
    );

    return {
      ytdBaseTotal,
      ytdAllocTotal,
      ytdBudgetTotal,
      monthBaseTotals,
      monthAllocTotals,
      monthYtdCostTotals, // ✅ NEW
      monthYtdAllocTotals,
    };
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    fetchData(selectedYear);
    // recompute totals after escPercent fetched
  }, [selectedYear, poolType]);

  // Recompute cost totals whenever cost data, selected year, or close period changes
  useEffect(() => {
    setCostTotals(calcCostTotals(costData));
  }, [costData, selectedYear, closePeriodMonth, closePeriodYear]);

  const formatNumber = (n) =>
    n === null || n === undefined || n === ""
      ? ""
      : n.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const fetchData = async (year) => {
    try {
      setLoading(true);
      setError(null);

      // // 1. Map the Display Name (poolType) to the API Code
      // const typeMapping = {
      //   "AERO Fringe": "AEROFR",
      //   "NASA/NIH Fringe": "NFRNG",
      //   "Customer Site Overhead": "OVH30",
      //   "Columbus Site Overhead": "OVH31",
      //   "G&A": "INTG40",
      //   "Subk & Material Handling": "SMH50",
      // };

      // const normalizedPoolType = poolType?.trim().toLowerCase();

      // const normalizedMapping = Object.fromEntries(
      //   Object.entries(typeMapping).map(([key, value]) => [
      //     key.toLowerCase(),
      //     value,
      //   ]),
      // );

      // const apiType = normalizedMapping[normalizedPoolType] || poolType;

      const apiType = encodeURIComponent(poolType ?? "");
      // DYNAMIC API CALL BASED ON poolType
      const res = await fetch(
        `${backendUrl}/Orgnization/GetHR?fycd=${year}&type=${apiType}`,
      );
      // const res = await fetch(`${backendUrl}/Orgnization/GetHR?fycd=${year}&type=${apiType}`);
      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json();
      const costRaw = json.poolOrgCostFinancialDetail || [];
      const baseRaw = json.poolOrgBaseFinancialDetail || [];

      // Use the logic from your Fringe component
      const mappedCost = mapCostData(costRaw);
      const mappedBase = mapBaseData(baseRaw);

      setCostData(mappedCost);
      setRate(json.rate ?? 0);
      setBaseData(mappedBase);

      // Update totals
      setCostTotals(calcCostTotals(mappedCost));
      setBaseTotals(calcBaseTotals(mappedBase));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4">
      {/* Top bar */}
      <div className="flex items-center gap-6">
        {/* Closing period + Year selector keep same as before */}
        <div className="input-label">
          Closing period:&nbsp;
          <span className="input-label">{closePeriodLabel || "—"}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Escalation + rate (same styling) */}
          {/* <div className="flex items-center gap-2">
              <label className="input-label">Rate:</label>
              <input
                type="text"
                className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm w-[70px]"
                value={
                  rate === null || rate === undefined || rate === ""
                    ? ""
                    : `${formatNumber(rate)}%`
                }
                readOnly
              />
            </div> */}

          <div className="flex items-center gap-2">
            <label className="input-label">Year:</label>
            <select
              className="input-style w-[75px]"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from({ length: 12 }).map((_, i) => {
                const y = new Date().getFullYear() - 1 + i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            onClick={() => setHideZeroRows((prev) => !prev)}
            className={`btn1 text-xs px-3 py-1.5 rounded border transition-colors ${
              hideZeroRows
                ? "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {hideZeroRows ? "Show All Rows" : "Hide Empty (0) Rows"}
          </button>
          <button
            onClick={handleExportAll}
            disabled={exporting}
            className="btn1 btn-blue disabled:opacity-50"
          >
            {exporting ? "Compiling All Data..." : "Export"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="table">
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 mt-4">Loading...</span>
          </div>
        </div>
      )}
      {error && <div className="table text-red-600">Error: {error}</div>}

      {/* COST TABLE */}
      {!loading && !error && (
        <div className="mt-2">
          <h3 className="input-label">Cost Account</h3>
          <div className="overflow-x-auto max-h-[40vh] overflow-y-auto relative border border-gray-200 rounded">
            <table className="table w-full border-collapse">
              <thead className="thead bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-30 border-b-2 border-gray-200">
                <tr>
                  <th
                    className="th-thead border border-gray-200 font-semibold text-gray-900 cursor-pointer sticky left-0 top-0 z-40 bg-gray-50 min-w-[100px]"
                    rowSpan={2}
                    onClick={() =>
                      setCostSortDir((prev) =>
                        prev === "asc" ? "desc" : "asc",
                      )
                    }
                  >
                    Account ID {costSortDir === "asc" ? "▲" : "▼"}
                  </th>
                  <th
                    className="th-thead border border-gray-200 font-semibold text-gray-900 sticky left-[100px] top-0 z-40 bg-gray-50 min-w-[180px]"
                    rowSpan={2}
                  >
                    Account Name
                  </th>
                  <th
                    className="th-thead border border-gray-200 font-semibold text-gray-900 sticky top-0 z-30 bg-gray-50"
                    rowSpan={2}
                  >
                    Org ID
                  </th>
                  <th
                    className="th-thead border border-gray-200 font-semibold text-gray-900 sticky top-0 z-30 bg-gray-50"
                    rowSpan={2}
                  >
                    YTD Actual Amt
                  </th>
                  <th
                    className="th-thead border border-gray-200 font-semibold text-gray-900 sticky top-0 z-30 bg-gray-50"
                    rowSpan={2}
                  >
                    YTD Budget Amt
                  </th>
                  {monthsHeader.map((m) => (
                    <th
                      key={m}
                      className="th-thead border border-gray-200 font-semibold text-gray-900 sticky top-0 z-30 bg-gray-50"
                      colSpan={2}
                    >
                      {m}
                    </th>
                  ))}
                </tr>

                <tr>
                  {monthsHeader.map((_, i) => {
                    const period = i + 1;
                    const closed = isPeriodClosed(period, selectedYear);
                    return (
                      <React.Fragment key={period}>
                        <th className="th-thead border border-gray-200 font-semibold text-gray-900 py-2 px-2 text-center bg-gray-50">
                          {closed ? "Actual Amt" : "Budget Amt"}
                        </th>
                        <th className="th-thead border border-gray-200 font-semibold text-gray-900 py-2 px-2 text-center bg-gray-50">
                          YTD Amt
                        </th>
                      </React.Fragment>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="tbody divide-y divide-gray-100">
                {displayedCostData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm sticky left-0 z-10 bg-white">
                      {item.acctId}
                    </td>
                    <td className="tbody-td-l border border-gray-200 py-3 px-4 whitespace-nowrap text-sm sticky left-[100px] z-10 bg-white">
                      {item.accountName}
                    </td>
                    <td className="tbody-td-l border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                      {item.orgId}
                    </td>
                    <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                      {formatNumber(item.ytdActual)}
                    </td>
                    <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                      {formatNumber(item.ytdBudget)}
                    </td>

                    {item.months.map((m, i) => {
                      const period = i + 1;
                      const closed = isPeriodClosed(period, selectedYear);

                      return (
                        <React.Fragment key={period}>
                          <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                            {formatNumber(closed ? m.actual : m.budget)}
                          </td>
                          <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                            {formatNumber(m.ytdamt)}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 z-20 border-t-2 border-gray-200">
                <tr className="bg-gray-50 shadow-[0_-2px_0_rgba(0,0,0,0.05)]">
                  <td
                    className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap font-bold text-sm sticky left-0 z-20 bg-gray-50"
                    colSpan={2}
                  >
                    Totals :
                  </td>
                  <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold sticky left-[280px] z-20 bg-gray-50 hidden">
                    {/* Empty placeholder column to balance left offset since spans can offset positions */}
                  </td>
                  <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50">
                    {/* This column matches up layout position dynamically */}
                  </td>
                  <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50">
                    {formatNumber(costTotals.totalYTDCostActualAmt)}
                  </td>
                  <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50">
                    {formatNumber(costTotals.totalYTDCostBudgetAmt)}
                  </td>
                  {monthsHeader.map((_, i) => (
                    <React.Fragment key={i}>
                      <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50">
                        {formatNumber(costTotals.monthTotals[i] ?? 0)}
                      </td>
                      <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50">
                        {formatNumber(costTotals.ytdMonthTotals[i] ?? 0)}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* BASE TABLE */}
          <h3 className="input-label mt-6">Base Account</h3>
          <div className="mt-1 overflow-x-auto max-h-[40vh] overflow-y-auto relative border border-gray-200 rounded">
            <table className="table w-full border-collapse">
              <thead className="thead bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-30 border-b-2 border-gray-200">
                <tr>
                  <th
                    className="th-thead border border-gray-200 font-semibold text-gray-900 cursor-pointer sticky left-0 top-0 z-40 bg-gray-50 min-w-[100px]"
                    rowSpan={2}
                    onClick={() =>
                      setBaseSortDir((prev) =>
                        prev === "asc" ? "desc" : "asc",
                      )
                    }
                  >
                    Account ID {baseSortDir === "asc" ? "▲" : "▼"}
                  </th>
                  <th
                    className="th-thead border border-gray-200 font-semibold text-gray-900 sticky left-[100px] top-0 z-40 bg-gray-50 min-w-[180px]"
                    rowSpan={2}
                  >
                    Account Name
                  </th>
                  <th
                    className="th-thead border border-gray-200 font-semibold text-gray-900 sticky top-0 z-30 bg-gray-50"
                    rowSpan={2}
                  >
                    Org ID
                  </th>
                  <th
                    className="th-thead border border-gray-200 font-semibold text-gray-900 sticky top-0 z-30 bg-gray-50"
                    rowSpan={2}
                  >
                    YTD Base Amt
                  </th>
                  <th
                    className="th-thead border border-gray-200 font-semibold text-gray-900 sticky top-0 z-30 bg-gray-50"
                    rowSpan={2}
                  >
                    Allocation Org ID
                  </th>
                  <th
                    className="th-thead border border-gray-200 font-semibold text-gray-900 sticky top-0 z-30 bg-gray-50"
                    rowSpan={2}
                  >
                    Allocation Acct ID
                  </th>
                  <th
                    className="th-thead border border-gray-200 font-semibold text-gray-900 sticky top-0 z-30 bg-gray-50"
                    rowSpan={2}
                  >
                    YTD Allocation Amt
                  </th>
                  <th
                    className="th-thead border border-gray-200 font-semibold text-gray-900 sticky top-0 z-30 bg-gray-50"
                    rowSpan={2}
                  >
                    YTD Budget Amt
                  </th>
                  {monthsHeader.map((m) => (
                    <th
                      key={m}
                      className="th-thead border border-gray-200 font-semibold text-gray-900 sticky top-0 z-30 bg-gray-50"
                      colSpan={4}
                    >
                      {m}
                    </th>
                  ))}
                </tr>
                <tr>
                  {monthsHeader.map((_, i) => (
                    <React.Fragment key={i}>
                      <th className="th-thead border border-gray-200 font-semibold text-gray-900 py-2 px-2 text-center bg-gray-50">
                        Base Amt
                      </th>
                      <th className="th-thead border border-gray-200 font-semibold text-gray-900 py-2 px-2 text-center bg-gray-50">
                        YTD Cost
                      </th>
                      <th className="th-thead border border-gray-200 font-semibold text-gray-900 py-2 px-2 text-center bg-gray-50">
                        Allocation Amt
                      </th>
                      <th className="th-thead border border-gray-200 font-semibold text-gray-900 py-2 px-2 text-center bg-gray-50">
                        YTD Alloc
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>

              <tbody className="tbody divide-y divide-gray-100">
                {displayedBaseData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm sticky left-0 z-10 bg-white">
                      {item.acctId}
                    </td>
                    <td className="tbody-td-l border border-gray-200 py-3 px-4 whitespace-nowrap text-sm sticky left-[100px] z-10 bg-white">
                      {item.accountName}
                    </td>
                    <td className="tbody-td-l border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                      {item.orgId}
                    </td>
                    <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                      {formatNumber(item.ytdBase)}
                    </td>
                    <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                      {item.allocationOrgId}
                    </td>
                    <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                      {item.allocationAcctId}
                    </td>
                    <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                      {formatNumber(item.ytdAllocation)}
                    </td>
                    <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                      {formatNumber(item.ytdBudget)}
                    </td>

                    {item.months.map((m, i) => (
                      <React.Fragment key={i}>
                        <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                          {formatNumber(m.base)}
                        </td>
                        <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                          {formatNumber(m.ytdcostAmt)}
                        </td>
                        <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                          {formatNumber(m.allocation)}
                        </td>
                        <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm">
                          {formatNumber(m.ytdAllocationAmt)}
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>

              <tfoot className="sticky bottom-0 z-20 border-t-2 border-gray-200">
                <tr className="bg-gray-50 shadow-[0_-2px_0_rgba(0,0,0,0.05)]">
                  <td
                    className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap font-bold text-sm sticky left-0 z-20 bg-gray-50"
                    colSpan={2}
                  >
                    Totals:
                  </td>
                  <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50"></td>
                  <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50">
                    {formatNumber(baseTotals.ytdBaseTotal)}
                  </td>
                  <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50"></td>
                  <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50"></td>
                  <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50">
                    {formatNumber(baseTotals.ytdAllocTotal)}
                  </td>
                  <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50">
                    {formatNumber(baseTotals.ytdBudgetTotal)}
                  </td>
                  {monthsHeader.map((_, i) => (
                    <React.Fragment key={i}>
                      <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50">
                        {formatNumber(baseTotals.monthBaseTotals[i] ?? 0)}
                      </td>
                      <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50">
                        {formatNumber(baseTotals.monthYtdCostTotals[i] ?? 0)}
                      </td>
                      <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50">
                        {formatNumber(baseTotals.monthAllocTotals[i] ?? 0)}
                      </td>
                      <td className="tbody-td border border-gray-200 py-3 px-4 whitespace-nowrap text-sm font-semibold bg-gray-50">
                        {formatNumber(baseTotals.monthYtdAllocTotals[i] ?? 0)}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericPoolTable;

// import * as XLSX from "xlsx";
import XLSX from "xlsx-js-style";

// const monthsHeader = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Helper data-mappers replicated from your component logic
const mapCostData = (rows) =>
  rows.map((row) => ({
    orgId: row.orgId,
    acctId: row.acctId,
    accountName: row.accountName,
    ytdActual: Number(row.ytdActualAmt) || 0,
    ytdBudget: Number(row.ytdBudgetedAmt) || 0,
    months: monthsHeader.map((_, idx) => {
      const p = row.periodDetails?.find((d) => d.period === idx + 1) || {};
      return {
        actual: Number(p.actualamt) || 0,
        budget: Number(p.actualamt) || 0,
        ytdamt: Number(p.ytdamt) || 0,
      };
    }),
  }));

const mapBaseData = (rows) =>
  rows.map((row) => ({
    orgId: row.orgId,
    acctId: row.acctId,
    allocationOrgId: row.allocationOrgId,
    allocationAcctId: row.allocationAcctId,
    accountName: row.accountName,
    ytdBase: Number(row.ytdActualAmt) || 0,
    ytdAllocation: Number(row.ytdAllocationAmt) || 0,
    ytdBudget: Number(row.ytdBudgetedAmt) || 0,
    months: monthsHeader.map((_, idx) => {
      const p = row.periodDetails?.find((d) => d.period === idx + 1) || {};
      return {
        base: Number(p.baseAmt) || 0,
        allocation: Number(p.allocationAmt) || 0,
        ytdcostAmt: Number(p.ytdcostAmt) || 0,
        ytdAllocationAmt: Number(p.ytdAllocationAmt) || 0,
      };
    }),
  }));

// Multi-Pool Sequential Exporter Execution block
// export const exportAllPoolTablesToXlsx = async ({
//   selectedYear,
//   closePeriodLabel,
//   isPeriodClosed,
// }) => {
//   const sheetData = [];
//   const merges = [];

//   const appendRow = (cellsArray) => {
//     sheetData.push(cellsArray);
//     return sheetData.length - 1;
//   };

//   // --- MASTER DOCUMENT TITLE BLOCK ---
//   appendRow([
//     `MASTER FINANCIAL STATEMENT - ALL POOLS SUMMARY (FY ${selectedYear})`,
//   ]);
//   appendRow([`Closing Period Status: ${closePeriodLabel || "—"}`]);
//   appendRow([]); // Global Spacer

//   // Process and pull data for all 4 pages asynchronously
//   for (const pool of ALL_POOLS) {
//     try {
//       const res = await fetch(
//         `${backendUrl}/Orgnization/GetHR?fycd=${selectedYear}&type=${pool.apiCode}`,
//       );
//       if (!res.ok)
//         throw new Error(`Failed to fetch pool data for ${pool.displayName}`);

//       const json = await res.json();
//       const sortedCostData = mapCostData(
//         json.poolOrgCostFinancialDetail || [],
//       ).sort((a, b) => (a.acctId > b.acctId ? 1 : -1));
//       const sortedBaseData = mapBaseData(
//         json.poolOrgBaseFinancialDetail || [],
//       ).sort((a, b) => (a.acctId > b.acctId ? 1 : -1));

//       // Calculate localized math totals dynamically on-the-fly
//       const totalYTDCostBudgetAmt = sortedCostData.reduce(
//         (sum, r) => sum + r.ytdBudget,
//         0,
//       );
//       const costMonthTotals = monthsHeader.map((_, idx) =>
//         sortedCostData.reduce((sum, r) => sum + r.months[idx].actual, 0),
//       );
//       const costYtdMonthTotals = monthsHeader.map((_, idx) =>
//         sortedCostData.reduce((sum, r) => sum + r.months[idx].ytdamt, 0),
//       );

//       const baseTotals = {
//         ytdBaseTotal: sortedBaseData.reduce((sum, r) => sum + r.ytdBase, 0),
//         ytdAllocTotal: sortedBaseData.reduce(
//           (sum, r) => sum + r.ytdAllocation,
//           0,
//         ),
//         ytdBudgetTotal: sortedBaseData.reduce((sum, r) => sum + r.ytdBudget, 0),
//         monthBaseTotals: monthsHeader.map((_, idx) =>
//           sortedBaseData.reduce((sum, r) => sum + r.months[idx].base, 0),
//         ),
//         monthYtdCostTotals: monthsHeader.map((_, idx) =>
//           sortedBaseData.reduce((sum, r) => sum + r.months[idx].ytdcostAmt, 0),
//         ),
//         monthAllocTotals: monthsHeader.map((_, idx) =>
//           sortedBaseData.reduce((sum, r) => sum + r.months[idx].allocation, 0),
//         ),
//         monthYtdAllocTotals: monthsHeader.map((_, idx) =>
//           sortedBaseData.reduce(
//             (sum, r) => sum + r.months[idx].ytdAllocationAmt,
//             0,
//           ),
//         ),
//       };

//       // ==========================================
//       // SECTION BRANDING CONTAINER
//       // ==========================================
//       appendRow([
//         "========================================================================================",
//       ]);
//       appendRow([`${pool.displayName.toUpperCase()} FINANCIAL DATA`]);
//       appendRow([
//         "========================================================================================",
//       ]);
//       appendRow([]);

//       // --- COST ACCOUNT TABLE ---
//       appendRow([`${pool.displayName} - Cost Account`]);
//       const costH1RowIdx = appendRow([
//         "Account ID",
//         "Account Name",
//         "Org ID",
//         "YTD Actual Amt",
//         "YTD Budget Amt",
//         ...monthsHeader.flatMap((m) => [m, ""]),
//       ]);
//       const costH2RowIdx = appendRow([
//         "",
//         "",
//         "",
//         "",
//         "",
//         ...monthsHeader.flatMap((_, i) => [
//           isPeriodClosed(i + 1, selectedYear) ? "Actual Amt" : "Budget Amt",
//           "YTD Amt",
//         ]),
//       ]);

//       for (let colIdx = 0; colIdx < 5; colIdx++) {
//         merges.push({
//           s: { r: costH1RowIdx, c: colIdx },
//           e: { r: costH2RowIdx, c: colIdx },
//         });
//       }
//       let currentCostCol = 5;
//       monthsHeader.forEach(() => {
//         merges.push({
//           s: { r: costH1RowIdx, c: currentCostCol },
//           e: { r: costH1RowIdx, c: currentCostCol + 1 },
//         });
//         currentCostCol += 2;
//       });

//       sortedCostData.forEach((item) => {
//         const rowData = [
//           item.acctId,
//           item.accountName,
//           item.orgId,
//           item.ytdActual,
//           item.ytdBudget,
//         ];
//         item.months.forEach((m, i) =>
//           rowData.push(
//             isPeriodClosed(i + 1, selectedYear) ? m.actual : m.budget,
//             m.ytdamt,
//           ),
//         );
//         appendRow(rowData);
//       });

//       const costTotalsRowIdx = appendRow([
//         "Totals :",
//         "",
//         "",
//         "",
//         totalYTDCostBudgetAmt,
//         ...monthsHeader.flatMap((_, i) => [
//           costMonthTotals[i],
//           costYtdMonthTotals[i],
//         ]),
//       ]);
//       merges.push({
//         s: { r: costTotalsRowIdx, c: 0 },
//         e: { r: costTotalsRowIdx, c: 2 },
//       });

//       appendRow([]); // Break space

//       // --- BASE ACCOUNT TABLE ---
//       appendRow([`${pool.displayName} - Base Account`]);
//       const baseH1RowIdx = appendRow([
//         "Account ID",
//         "Account Name",
//         "Org ID",
//         "YTD Base Amt",
//         "Allocation Org ID",
//         "Allocation Acct ID",
//         "YTD Allocation Amt",
//         "YTD Budget Amt",
//         ...monthsHeader.flatMap((m) => [m, "", "", ""]),
//       ]);
//       const baseH2RowIdx = appendRow([
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         ...monthsHeader.flatMap(() => [
//           "Base Amt",
//           "YTD Cost",
//           "Allocation Amt",
//           "YTD Alloc",
//         ]),
//       ]);

//       for (let colIdx = 0; colIdx < 8; colIdx++) {
//         merges.push({
//           s: { r: baseH1RowIdx, c: colIdx },
//           e: { r: baseH2RowIdx, c: colIdx },
//         });
//       }
//       let currentBaseCol = 8;
//       monthsHeader.forEach(() => {
//         merges.push({
//           s: { r: baseH1RowIdx, c: currentBaseCol },
//           e: { r: baseH1RowIdx, c: currentBaseCol + 3 },
//         });
//         currentBaseCol += 4;
//       });

//       sortedBaseData.forEach((item) => {
//         const rowData = [
//           item.acctId,
//           item.accountName,
//           item.orgId,
//           item.ytdBase,
//           item.allocationOrgId,
//           item.allocationAcctId,
//           item.ytdAllocation,
//           item.ytdBudget,
//         ];
//         item.months.forEach((m) =>
//           rowData.push(m.base, m.ytdcostAmt, m.allocation, m.ytdAllocationAmt),
//         );
//         appendRow(rowData);
//       });

//       const baseTotalsRowIdx = appendRow([
//         "Totals:",
//         "",
//         "",
//         baseTotals.ytdBaseTotal,
//         "",
//         "",
//         baseTotals.ytdAllocTotal,
//         baseTotals.ytdBudgetTotal,
//         ...monthsHeader.flatMap((_, i) => [
//           baseTotals.monthBaseTotals[i],
//           baseTotals.monthYtdCostTotals[i],
//           baseTotals.monthAllocTotals[i],
//           baseTotals.monthYtdAllocTotals[i],
//         ]),
//       ]);
//       merges.push({
//         s: { r: baseTotalsRowIdx, c: 0 },
//         e: { r: baseTotalsRowIdx, c: 2 },
//       });

//       appendRow([]); // Deep line separators between pools
//       appendRow([]);
//     } catch (err) {
//       console.error(err.message);
//       appendRow([
//         `Error loading down records for Pool Type: ${pool.displayName}`,
//       ]);
//       appendRow([]);
//     }
//   }

//   // --- SHEET BUILD AND DOWNLOAD TRIDGERS ---
//   const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
//   worksheet["!merges"] = merges;
//   const maxCols = Math.max(...sheetData.map((r) => r.length));
//   worksheet["!cols"] = Array.from({ length: maxCols }, () => ({ wch: 14 }));

//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "All Pools Summary");
//   XLSX.writeFile(
//     workbook,
//     `Consolidated_Financial_Export_${selectedYear}.xlsx`,
//   );
// };

export const exportAllPoolTablesToXlsx = async ({
  selectedYear,
  closePeriodLabel,
  isPeriodClosed,
  poolType,
  allPools,
}) => {
  const sheetData = [];
  const merges = [];

  const appendRow = (cellsArray) => {
    sheetData.push(cellsArray);
    return sheetData.length - 1;
  };

  // --- MASTER DOCUMENT TITLE BLOCK ---
  appendRow([
    `MASTER FINANCIAL STATEMENT - ALL POOLS SUMMARY (FY ${selectedYear})`,
  ]);
  appendRow([`Closing Period Status: ${closePeriodLabel || "—"}`]);
  appendRow([]); // Global Spacer

  console.log("Starting export for all pools...", allPools);

  // Process and pull data for all 4 pages asynchronously
  for (const pool of allPools) {
    try {

      const poolTypeCode = pool.code || "";
      const res = await fetch(
        `${backendUrl}/Orgnization/GetHR?fycd=${selectedYear}&type=${poolTypeCode}`,
      );

      const poolName = pool.name || pool.displayName || "Pool";
      if (!res.ok)
        throw new Error(`Failed to fetch pool data for ${pool.poolName}`);

      const json = await res.json();
      const sortedCostData = mapCostData(
        json.poolOrgCostFinancialDetail || [],
      ).sort((a, b) => (a.acctId > b.acctId ? 1 : -1));
      const sortedBaseData = mapBaseData(
        json.poolOrgBaseFinancialDetail || [],
      ).sort((a, b) => (a.acctId > b.acctId ? 1 : -1));

      // Calculate localized math totals dynamically on-the-fly
      const totalYTDCostBudgetAmt = sortedCostData.reduce(
        (sum, r) => sum + r.ytdBudget,
        0,
      );
      const totalYTDCostActualAmt = sortedCostData.reduce(
        (sum, r) => sum + r.ytdActual,
        0,
      );
      const costMonthTotals = monthsHeader.map((_, idx) =>
        sortedCostData.reduce((sum, r) => sum + r.months[idx].actual, 0),
      );
      const costYtdMonthTotals = monthsHeader.map((_, idx) =>
        sortedCostData.reduce((sum, r) => sum + r.months[idx].ytdamt, 0),
      );

      const baseTotals = {
        ytdBaseTotal: sortedBaseData.reduce((sum, r) => sum + r.ytdBase, 0),
        ytdAllocTotal: sortedBaseData.reduce(
          (sum, r) => sum + r.ytdAllocation,
          0,
        ),
        ytdBudgetTotal: sortedBaseData.reduce((sum, r) => sum + r.ytdBudget, 0),
        monthBaseTotals: monthsHeader.map((_, idx) =>
          sortedBaseData.reduce((sum, r) => sum + r.months[idx].base, 0),
        ),
        monthYtdCostTotals: monthsHeader.map((_, idx) =>
          sortedBaseData.reduce((sum, r) => sum + r.months[idx].ytdcostAmt, 0),
        ),
        monthAllocTotals: monthsHeader.map((_, idx) =>
          sortedBaseData.reduce((sum, r) => sum + r.months[idx].allocation, 0),
        ),
        monthYtdAllocTotals: monthsHeader.map((_, idx) =>
          sortedBaseData.reduce(
            (sum, r) => sum + r.months[idx].ytdAllocationAmt,
            0,
          ),
        ),
      };

      // ==========================================
      // SECTION BRANDING CONTAINER
      // ==========================================
      appendRow([
        "========================================================================================",
      ]);
      appendRow([`${poolName.toUpperCase()} FINANCIAL DATA`]);
      appendRow([
        "========================================================================================",
      ]);
      appendRow([]);

      // --- COST ACCOUNT TABLE ---
      appendRow([`${poolName} - Cost Account`]);
      const costH1RowIdx = appendRow([
        "Account ID",
        "Account Name",
        "Org ID",
        "YTD Actual Amt",
        "YTD Budget Amt",
        ...monthsHeader.flatMap((m) => [m, ""]),
      ]);
      const costH2RowIdx = appendRow([
        "",
        "",
        "",
        "",
        "",
        ...monthsHeader.flatMap((_, i) => [
          isPeriodClosed(i + 1, selectedYear) ? "Actual Amt" : "Budget Amt",
          "YTD Amt",
        ]),
      ]);

      for (let colIdx = 0; colIdx < 5; colIdx++) {
        merges.push({
          s: { r: costH1RowIdx, c: colIdx },
          e: { r: costH2RowIdx, c: colIdx },
        });
      }
      let currentCostCol = 5;
      monthsHeader.forEach(() => {
        merges.push({
          s: { r: costH1RowIdx, c: currentCostCol },
          e: { r: costH1RowIdx, c: currentCostCol + 1 },
        });
        currentCostCol += 2;
      });

      sortedCostData.forEach((item) => {
        const rowData = [
          item.acctId,
          item.accountName,
          item.orgId,
          item.ytdActual,
          item.ytdBudget,
        ];
        item.months.forEach((m, i) =>
          rowData.push(
            isPeriodClosed(i + 1, selectedYear) ? m.actual : m.budget,
            m.ytdamt,
          ),
        );
        appendRow(rowData);
      });

      const costTotalsRowIdx = appendRow([
        "Totals :",
        "",
        "",
        totalYTDCostActualAmt,
        totalYTDCostBudgetAmt,
        ...monthsHeader.flatMap((_, i) => [
          costMonthTotals[i],
          costYtdMonthTotals[i],
        ]),
      ]);
      merges.push({
        s: { r: costTotalsRowIdx, c: 0 },
        e: { r: costTotalsRowIdx, c: 2 },
      });

      appendRow([]); // Break space

      // --- BASE ACCOUNT TABLE ---
      appendRow([`${poolName} - Base Account`]);
      const baseH1RowIdx = appendRow([
        "Account ID",
        "Account Name",
        "Org ID",
        "YTD Base Amt",
        "Allocation Org ID",
        "Allocation Acct ID",
        "YTD Allocation Amt",
        "YTD Budget Amt",
        ...monthsHeader.flatMap((m) => [m, "", "", ""]),
      ]);
      const baseH2RowIdx = appendRow([
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ...monthsHeader.flatMap(() => [
          "Base Amt",
          "YTD Cost",
          "Allocation Amt",
          "YTD Alloc",
        ]),
      ]);

      for (let colIdx = 0; colIdx < 8; colIdx++) {
        merges.push({
          s: { r: baseH1RowIdx, c: colIdx },
          e: { r: baseH2RowIdx, c: colIdx },
        });
      }
      let currentBaseCol = 8;
      monthsHeader.forEach(() => {
        merges.push({
          s: { r: baseH1RowIdx, c: currentBaseCol },
          e: { r: baseH1RowIdx, c: currentBaseCol + 3 },
        });
        currentBaseCol += 4;
      });

      sortedBaseData.forEach((item) => {
        const rowData = [
          item.acctId,
          item.accountName,
          item.orgId,
          item.ytdBase,
          item.allocationOrgId,
          item.allocationAcctId,
          item.ytdAllocation,
          item.ytdBudget,
        ];
        item.months.forEach((m) =>
          rowData.push(m.base, m.ytdcostAmt, m.allocation, m.ytdAllocationAmt),
        );
        appendRow(rowData);
      });

      const baseTotalsRowIdx = appendRow([
        "Totals:",
        "",
        "",
        baseTotals.ytdBaseTotal,
        "",
        "",
        baseTotals.ytdAllocTotal,
        baseTotals.ytdBudgetTotal,
        ...monthsHeader.flatMap((_, i) => [
          baseTotals.monthBaseTotals[i],
          baseTotals.monthYtdCostTotals[i],
          baseTotals.monthAllocTotals[i],
          baseTotals.monthYtdAllocTotals[i],
        ]),
      ]);
      merges.push({
        s: { r: baseTotalsRowIdx, c: 0 },
        e: { r: baseTotalsRowIdx, c: 2 },
      });

      appendRow([]); // Deep line separators between pools
      appendRow([]);
    } catch (err) {
      console.error(err.message);
      appendRow([
        `Error loading down records for Pool Type: ${poolName}`,
      ]);
      appendRow([]);
    }
  }

  // Convert array of arrays to raw sheet structure
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet["!merges"] = merges;
  worksheet["!views"] = [{ showGridLines: true }]; // Explicitly preserve gridlines

  // ==========================================
  // 🎯 POST-PROCESSING: APPLY CELL STYLES & NUMBER FORMATS
  // ==========================================
  const maxCols = Math.max(...sheetData.map((r) => r.length));
  const totalRows = sheetData.length;

  for (let R = 0; R < totalRows; R++) {
    const rowCells = sheetData[R] || [];
    if (rowCells.length === 0) continue;

    const firstCellString = String(rowCells[0] || "");

    // 1. Master Title Block formatting
    if (R === 0) {
      const cellRef = XLSX.utils.encode_cell({ c: 0, r: R });
      if (worksheet[cellRef]) {
        worksheet[cellRef].s = {
          font: {
            name: "Arial",
            size: 14,
            bold: true,
            color: { rgb: "0F172A" },
          },
        };
      }
      continue;
    }
    if (R === 1) {
      const cellRef = XLSX.utils.encode_cell({ c: 0, r: R });
      if (worksheet[cellRef]) {
        worksheet[cellRef].s = {
          font: {
            name: "Arial",
            size: 10,
            italic: true,
            color: { rgb: "475569" },
          },
        };
      }
      continue;
    }

    // 2. Structural Border Lines & Sub-Section Titles
    if (firstCellString.startsWith("===") || firstCellString.endsWith("DATA")) {
      for (let C = 0; C < maxCols; C++) {
        const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
        if (!worksheet[cellRef]) continue;
        worksheet[cellRef].s = {
          font: {
            name: "Arial",
            size: 11,
            bold: true,
            color: { rgb: "1E293B" },
          },
          fill: { patternType: "solid", fgColor: { rgb: "F1F5F9" } }, // Cool Light-gray band
        };
      }
      continue;
    }

    // 3. Table Titles (e.g. "HR - Cost Account")
    if (firstCellString.includes("Account") && rowCells.length === 1) {
      const cellRef = XLSX.utils.encode_cell({ c: 0, r: R });
      if (worksheet[cellRef]) {
        worksheet[cellRef].s = {
          font: {
            name: "Arial",
            size: 11,
            bold: true,
            color: { rgb: "0369A1" },
          }, // Dark Sky Blue
        };
      }
      continue;
    }

    // 4. Multi-level Table Headers Styling
    const isHeaderRow =
      firstCellString === "Account ID" ||
      (sheetData[R - 1] && String(sheetData[R - 1][0]) === "Account ID");

    if (isHeaderRow) {
      for (let C = 0; C < maxCols; C++) {
        const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
        if (!worksheet[cellRef]) continue;

        worksheet[cellRef].s = {
          font: {
            name: "Arial",
            size: 10,
            bold: true,
            color: { rgb: "FFFFFF" },
          },
          fill: { patternType: "solid", fgColor: { rgb: "334155" } }, // Slate-700 header
          alignment: {
            vertical: "center",
            horizontal: C >= 3 ? "right" : "left",
            wrapText: true,
          },
          border: {
            top: { style: "thin", color: { rgb: "475569" } },
            bottom: { style: "thin", color: { rgb: "475569" } },
          },
        };
      }
      continue;
    }

    // 5. Totals Row Styling
    if (firstCellString.startsWith("Totals")) {
      for (let C = 0; C < maxCols; C++) {
        const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
        const cell = worksheet[cellRef];
        if (!cell) continue;

        cell.s = {
          font: { name: "Arial", size: 10, bold: true },
          fill: { patternType: "solid", fgColor: { rgb: "F0FDF4" } }, // Soft Green background tint
          alignment: {
            vertical: "center",
            horizontal: typeof cell.v === "number" ? "right" : "left",
          },
          border: {
            top: { style: "thin", color: { rgb: "94A3B8" } },
            bottom: { style: "double", color: { rgb: "334155" } }, // Standard Accounting Underline
          },
        };

        if (typeof cell.v === "number") {
          cell.z = '"$"#,##0.00;("(" \x22$\x22#,##0.00")";"-"'; // Accounting Dollar format
        }
      }
      continue;
    }

    // 6. Standard Data Row Styling
    for (let C = 0; C < maxCols; C++) {
      const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
      const cell = worksheet[cellRef];
      if (!cell) continue;

      cell.s = {
        font: { name: "Arial", size: 10 },
        alignment: {
          vertical: "center",
          horizontal: typeof cell.v === "number" ? "right" : "left",
        },
      };

      if (typeof cell.v === "number") {
        cell.z = '"$"#,##0.00;("(" \x22$\x22#,##0.00")";"-"';
      } else {
        // Uniform string alignments for clean alignment
        cell.z = "@";
      }
    }
  }

  // ==========================================
  // 🎯 DYNAMIC AUTO-FIT COLUMN SIZING
  // ==========================================
  const colWidths = Array.from({ length: maxCols }, () => ({ wch: 12 }));
  colWidths[0] = { wch: 14 }; // Account ID
  colWidths[1] = { wch: 28 }; // Account Name (Wide allocation window)
  colWidths[2] = { wch: 12 }; // Org ID
  colWidths[4] = { wch: 14 }; // Allocation items padding

  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "All Pools Summary");

  XLSX.writeFile(
    workbook,
    `Consolidated_Financial_Export_${selectedYear}.xlsx`,
  );
};
