import React, { useEffect, useState } from "react";
import { Signal } from "lucide-react";
import { backendUrl } from "./config";

const POStatusTable = () => {
  // Data and loading states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [filterPurchaseOrder, setFilterPurchaseOrder] = useState("");
  const [filterWACode, setFilterWACode] = useState("");
  const [filterResourceId, setFilterResourceId] = useState("");

  // Grouping controls
  const [groupByPO, setGroupByPO] = useState(false);
  const [groupByWO, setGroupByWO] = useState(false);
  const [groupByResource, setGroupByResource] = useState(false);

  // Fetch PO Status data from API
  useEffect(() => {
    const fetchData = async () => {
      const url = `${backendUrl}/api/SubkTimesheet/GetPOStatus`;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url);
        if (!response.ok) throw new Error("Error fetching data");

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter by PO, Work Order and Resource
  const filteredData = data.filter((item) => {
    const poMatch =
      !filterPurchaseOrder ||
      item.poNumber
        ?.toString()
        .toLowerCase()
        .includes(filterPurchaseOrder.toLowerCase());

    const woMatch =
      !filterWACode ||
      item.workOrder
        ?.toString()
        .toLowerCase()
        .includes(filterWACode.toLowerCase());

    const rIdMatch =
      !filterResourceId ||
      item.resourceId
        ?.toString()
        .toLowerCase()
        .includes(filterResourceId.toLowerCase());

    return poMatch && woMatch && rIdMatch;
  });

  // --- GROUPING LOGIC ---
  const calculateTotals = (rows) => ({
    totHrs: rows.reduce((sum, r) => sum + (+r.totHrs || 0), 0),
    totalCost: rows.reduce((sum, r) => sum + (+r.totalCost || 0), 0),
    timesheetHours: rows.reduce((sum, r) => sum + (+r.timesheetHours || 0), 0),
    timesheetCost: rows.reduce((sum, r) => sum + (+r.timesheetCost || 0), 0),
    voucheredHours: rows.reduce((sum, r) => sum + (+r.voucheredHours || 0), 0),
    voucheredCost: rows.reduce((sum, r) => sum + (+r.voucheredCost || 0), 0),
    unvoucheredCost: rows.reduce(
      (sum, r) => sum + (+r.unvoucheredCost || 0),
      0,
    ),
    utilizationPercent: rows.reduce(
      (sum, r) => sum + (+r.utilizationPercent || 0),
      0,
    ),
    voucheredPercent: rows.reduce(
      (sum, r) => sum + (+r.voucheredPercent || 0),
      0,
    ),
  });

  function flatGroupData(rows, keys, path = []) {
    if (keys.length === 0) {
      return [{ path, rows, totals: calculateTotals(rows) }];
    }

    const key = keys[0];
    const rest = keys.slice(1);

    const groups = rows.reduce((acc, row) => {
      const val = row[key] || "Unknown";
      if (!acc[val]) acc[val] = [];
      acc[val].push(row);
      return acc;
    }, {});

    return Object.entries(groups).flatMap(([val, groupRows]) =>
      flatGroupData(groupRows, rest, [...path, { key, val }]),
    );
  }

  const groupingKeys = [];
  if (groupByPO) groupingKeys.push("poNumber");
  if (groupByWO) groupingKeys.push("workOrder");
  if (groupByResource) groupingKeys.push("resourceDesc");

  const flatGroups =
    groupingKeys.length > 0 ? flatGroupData(filteredData, groupingKeys) : [];

  // Formatting helpers
  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(num) || 0);

  const formatNumber = (num) =>
    Number(num || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const clearFilters = () => {
    setFilterPurchaseOrder("");
    setFilterWACode("");
    setFilterResourceId("");
  };

  const getGroupLabel = (path) =>
    path
      .map((p) => {
        const label =
          p.key === "poNumber"
            ? "PO Number"
            : p.key === "workOrder"
              ? "Work Order"
              : "Resource Description";

        return `${label}: ${p.val}`;
      })
      .join(" | ");

  function renderFlatGroup(group, idx) {
    const label = getGroupLabel(group.path);

    return (
      <React.Fragment key={`${label}-${idx}`}>
        {group.rows.map((row, i) => renderRow(row, i))}

        <tr className="bg-[#f1f1f1] font-semibold text-xs">
          <td className="p-2 border-r border-gray-200" colSpan={3}>
            Totals
          </td>
          <td className="border border-[#d7dce0] px-2 py-1 text-right">
            {formatNumber(group.totals.totHrs)}
          </td>
          <td className="border border-[#d7dce0] px-2 py-1 text-right">
            {formatCurrency(group.totals.totalCost)}
          </td>
          <td className="border border-[#d7dce0] px-2 py-1 text-right">
            {formatNumber(group.totals.timesheetHours)}
          </td>
          <td className="border border-[#d7dce0] px-2 py-1 text-right">
            {formatCurrency(group.totals.timesheetCost)}
          </td>
          <td className="border border-[#d7dce0] px-2 py-1 text-right">
            {formatNumber(group.totals.voucheredHours)}
          </td>
          <td className="border border-[#d7dce0] px-2 py-1 text-right">
            {formatCurrency(group.totals.voucheredCost)}
          </td>
          <td className="border border-[#d7dce0] px-2 py-1 text-right">
            {formatCurrency(group.totals.unvoucheredCost)}
          </td>
          <td className="border border-[#d7dce0] px-2 py-1 text-right">
            {formatNumber(group.totals.utilizationPercent)}
          </td>
          <td className="border border-[#d7dce0] px-2 py-1 text-right">
            {formatNumber(group.totals.voucheredPercent)}
          </td>
        </tr>
      </React.Fragment>
    );
  }

  function renderRow(row, idx) {
    return (
      <tr
        key={`${row.resourceId}-${row.poNumber}-${idx}`}
        className="border-b border-gray-200 transition-colors duration-500 text-xs text-gray-800 hover:bg-gray-50"
      >
        <td className="p-2 border-r border-gray-200 whitespace-nowrap">
          {row.resourceId}
        </td>
        <td className="p-2 border-r border-gray-200 whitespace-nowrap">
          {row.poNumber}
        </td>
        <td className="p-2 border-r border-gray-200">{row.resourceDesc}</td>
        <td className="p-2 border-r border-gray-200 text-right whitespace-nowrap">
          {formatNumber(row.totHrs)}
        </td>
        <td className="p-2 border-r border-gray-200 text-right whitespace-nowrap">
          {formatCurrency(row.totalCost)}
        </td>
        <td className="p-2 border-r border-gray-200 text-right whitespace-nowrap">
          {formatNumber(row.timesheetHours)}
        </td>
        <td className="p-2 border-r border-gray-200 text-right whitespace-nowrap">
          {formatCurrency(row.timesheetCost)}
        </td>
        <td className="p-2 border-r border-gray-200 text-right whitespace-nowrap">
          {formatNumber(row.voucheredHours)}
        </td>
        <td className="p-2 border-r border-gray-200 text-right whitespace-nowrap">
          {formatCurrency(row.voucheredCost)}
        </td>
        <td className="p-2 border-r border-gray-200 text-right whitespace-nowrap">
          {formatCurrency(row.unvoucheredCost)}
        </td>
        <td className="p-2 border-r border-gray-200 text-right whitespace-nowrap">
          {formatNumber(row.utilizationPercent)}
        </td>
        <td className="p-2 border-r border-gray-200 text-right whitespace-nowrap">
          {formatNumber(row.voucheredPercent)}
        </td>
      </tr>
    );
  }

  const inputClass =
    "h-[28px] w-full rounded-[3px] border border-[#cfd6dc] bg-white px-2 text-[12px] text-[#172b3a] outline-none transition focus:border-[#174f5b] focus:ring-1 focus:ring-[#174f5b]/20";

  const buttonBase =
    "h-[26px] rounded-full px-3 text-[11px] font-semibold transition";

  return (
    <div className="min-h-screen bg-[#e7f2f5] text-gray-800">
      <div className="w-full">
        {/* Page heading */}
        <div className="mb-[5px] flex min-h-[44px] items-center rounded-[4px] bg-white px-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <Signal size={17} className="text-[#287cf0]" />
            PO Status
          </h2>
        </div>

        {/* Filter / action panel */}
        <div className="mb-[5px] rounded-[4px] bg-white px-[8px] py-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr]">
            <div className="flex items-center gap-3">
              <label className="w-[90px] shrink-0 text-[12px] font-semibold text-[#102a43]">
                PO Number
              </label>
              <input
                type="text"
                placeholder=""
                className={inputClass}
                value={filterPurchaseOrder}
                onChange={(e) => setFilterPurchaseOrder(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-[90px] shrink-0 text-[12px] font-semibold text-[#102a43]">
                Resource ID
              </label>
              <input
                type="text"
                placeholder=""
                className={inputClass}
                value={filterResourceId}
                onChange={(e) => setFilterResourceId(e.target.value)}
              />
            </div>

            {/* <div className="flex items-center gap-3">
              <label className="w-[90px] shrink-0 text-[12px] font-semibold text-[#102a43]">
                Work Order
              </label>
              <input
                type="text"
                placeholder=""
                className={inputClass}
                value={filterWACode}
                onChange={(e) => setFilterWACode(e.target.value)}
              />
            </div> */}
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
            <label className="flex h-[26px] cursor-pointer items-center gap-1.5 text-[11px] font-medium text-[#102a43]">
              <input
                type="checkbox"
                checked={groupByPO}
                onChange={(e) => setGroupByPO(e.target.checked)}
                className="h-[13px] w-[13px] accent-[#174f5b]"
              />
              PO Number
            </label>

            <label className="flex h-[26px] cursor-pointer items-center gap-1.5 text-[11px] font-medium text-[#102a43]">
              <input
                type="checkbox"
                checked={groupByResource}
                onChange={(e) => setGroupByResource(e.target.checked)}
                className="h-[13px] w-[13px] accent-[#174f5b]"
              />
              Resource Description
            </label>

            {/* <label className="flex h-[26px] cursor-pointer items-center gap-1.5 text-[11px] font-medium text-[#102a43]">
              <input
                type="checkbox"
                checked={groupByWO}
                onChange={(e) => setGroupByWO(e.target.checked)}
                className="h-[13px] w-[13px] accent-[#174f5b]"
              />
              Group by Work Order
            </label> */}
            {/* 
            <button
              type="button"
              onClick={clearFilters}
              className={`${buttonBase} bg-[#91a3aa] text-white hover:bg-[#7f949b]`}
            >
              Clear
            </button> */}
          </div>
        </div>

        {/* Data table */}
        <div className="w-full rounded-[4px] bg-white p-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto overflow-y-auto max-h-[68vh]">
            <table className="w-full text-left border border-gray-300 border-collapse table-fixed">
              <thead className="thead sticky top-0 z-10">
                <tr className="text-[10px] capitalize text-gray-500 border-b">
                  <th className="th-thead">Resource ID</th>
                  <th className="th-thead">PO Number</th>
                  <th className="th-thead text-align:center w-[12%]">
                    Resource Description
                  </th>
                  <th className="th-thead">Total Hours</th>
                  <th className="th-thead">Total Cost</th>
                  <th className="th-thead">Timesheet Hours</th>
                  <th className="th-thead">Timesheet Cost</th>
                  <th className="th-thead">Vouchered Hours</th>
                  <th className="th-thead">Vouchered Cost</th>
                  <th className="th-thead">Unvouchered Cost</th>
                  <th className="th-thead">Utilization</th>
                  <th className="th-thead">Vouchered</th>
                </tr>
              </thead>

              <tbody className="tbody">
                {loading ? (
                  <tr className="text-xs text-gray-800">
                    <td colSpan={12} className="p-2 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr className="text-xs text-gray-800">
                    <td colSpan={12} className="p-2 text-center text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : groupingKeys.length > 0 ? (
                  flatGroups.map(renderFlatGroup)
                ) : filteredData.length === 0 ? (
                  <tr className="text-xs text-gray-800">
                    <td colSpan={12} className="p-2 text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  filteredData.map(renderRow)
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POStatusTable;
