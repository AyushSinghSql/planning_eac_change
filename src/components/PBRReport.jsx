import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import axios from "axios";
// import * as XLSX from "xlsx";
import * as XLSX from "xlsx-js-style";

import DashboardView from "./DashboardView";

import {
  Search,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  Layers,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ArrowUpDown,
  Filter,
  Lock,
  ChevronsRight,
  ChevronsDown,
  Trash2,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { backendUrl } from "./config";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* =======================================================
   API ENDPOINTS & CONSTANTS
======================================================= */
const COMPANY_ID = 1;
const EMPTY_PBR_FILTERS = Object.freeze({});
// const FY_CD = new Date().getFullYear();
const CURRENT_FY = new Date().getFullYear();
const FY_OPTIONS = Array.from({ length: 4 }, (_, i) => CURRENT_FY + i); // Current year + 3 years ahead
//
const DEFAULT_STANDARD_HOURS = 2080;

const MAPPING_API = `${backendUrl}/api/PBR/pbr-acct-grp-map/get-all`;
const POOLS_API = `${backendUrl}/Orgnization/GetAllPools`;
const PSR_DATA_API = `${backendUrl}/api/ForecastReport/GetPSRData`;
const LNL_DATA_API = `${backendUrl}/api/PbrLaborNonLabor`;
const LNL_UPDATE_API = `${backendUrl}/api/PbrLaborNonLabor/bulk-update`;
const LNL_INSERT_API = `${backendUrl}/api/PbrLaborNonLabor/bulk-insert`;

const COA_API = `${backendUrl}/api/ChartOfAccounts`;
const LAB_HS_API = `${backendUrl}/api/ForecastReport/GetLabHSData`;
const EMP_API = `${backendUrl}/api/ForecastReport/GetAllEmployee`;
const VEND_EMP_API = `${backendUrl}/VendorEmployee`;
const ORGS_API = `${backendUrl}/Orgnization/GetAllOrgs`;
const PBR_CONFIG_API = `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`;
const GL_DATA_API = `${backendUrl}/api/ForecastReport/GetGlPostDetail`;

const MAINTENANCE_API = `${backendUrl}/api/PbrMaintenance`;

const MAINTENANCE_CATEGORY = {
  PBR_GROUP: "PBR_GROUP",
  PROJECT_PERFORMANCE: "PROJECT_PERFORMANCE",
};

// SSAI Active Report account mapping. Revenue is sourced only from the Revenue section.
const REPORT_ACCOUNT_GROUPS = {
  "410-009": "Revenue",
  "500-001-110": "Direct Labor",
  "500-001-120": "Direct Labor",
  "500-002-110": "Direct Labor",
  "500-002-120": "Direct Labor",
  "500-003-110": "Direct Labor",
  "500-003-120": "Direct Labor",
  "500-004-120": "Direct Labor",
  "500-006-110": "Direct Labor",
  "500-007-110": "Direct Labor",
  "500-010-110": "Direct Labor",
  "500-010-120": "Direct Labor",
  "500-013-110": "Direct Labor",
  "500-013-120": "Direct Labor",
  "500-017-110": "Direct Labor",
  "642-001-135": "Consultation",
  "643-001-135": "Consultation",
  "643-002-140": "Consultation",
  "643-004-135": "Consultation",
  "643-050-135": "Consultation",
  "643-054-135": "Consultation",
  "653-002-140": "Materials",
  "645-001-135": "Material Handling",
  "645-004-135": "Material Handling",
  "410-004": "Subcontractors",
  "646-001-135": "Subcontractors",
  "646-004-135": "Subcontractors",
  "646-050-135": "Subcontractors",
  "646-054-135": "Subcontractors",
  "647-001-140": "Travel",
  "647-002-140": "Travel",
  "647-003-140": "Travel",
  "647-004-140": "Travel",
  "647-005-140": "Travel",
  "647-006-140": "Travel",
  "647-007-140": "Travel",
  "647-008-140": "Travel",
  "647-009-140": "Travel",
  "648-001-140": "Other Direct Cost",
  "651-001-140": "Other Direct Cost",
  "651-002-140": "Other Direct Cost",
  "653-001-140": "Other Direct Cost",
  "698-001-999": "Other Direct Cost",
  "645-002-135": "Equipment",
  "699-001-140": "Unallowable Direct - ODCs",
  "699-001-199": "Unallowable Direct - ODCs",
  "800-001-105": "Fringe Benefits",
  "800-002-105": "Fringe Benefits",
  "800-005-105": "Fringe Benefits",
  "800-006-105": "Fringe Benefits",
  "800-008-105": "Fringe Benefits",
  "800-009-105": "Fringe Benefits",
  "800-011-105": "Fringe Benefits",
  "800-017-105": "Fringe Benefits",
  "801-001-105": "Fringe Benefits",
  "801-002-105": "Fringe Benefits",
  "801-003-105": "Fringe Benefits",
  "801-004-105": "Fringe Benefits",
  "801-006-105": "Fringe Benefits",
  "801-007-105": "Fringe Benefits",
  "801-013-105": "Fringe Benefits",
  "801-014-105": "Fringe Benefits",
  "801-015-105": "Fringe Benefits",
  "801-018-105": "Fringe Benefits",
  "801-020-105": "Fringe Benefits",
  "801-026-105": "Fringe Benefits",
  "801-027-105": "Fringe Benefits",
  "802-001-105": "Fringe Benefits",
  "802-003-105": "Fringe Benefits",
  "802-004-105": "Fringe Benefits",
  "802-005-105": "Fringe Benefits",
  "802-007-105": "Fringe Benefits",
  "802-008-105": "Fringe Benefits",
  "803-001-100": "Statutory & 401K",
  "803-002-100": "Statutory & 401K",
  "803-003-100": "Statutory & 401K",
  "803-005-100": "Statutory & 401K",
  "804-001-100": "Statutory & 401K",
  "804-002-100": "Statutory & 401K",
  "804-003-100": "Statutory & 401K",
  "804-004-100": "Statutory & 401K",
  "805-001-105": "Fringe Benefits",
  "805-003-105": "Fringe Benefits",
  "805-005-105": "Fringe Benefits",
  "806-001-105": "Fringe Benefits",
  "806-002-105": "Fringe Benefits",
  "806-005-105": "Fringe Benefits",
  "806-008-105": "Fringe Benefits",
  "806-010-105": "Fringe Benefits",
  "806-015-105": "Fringe Benefits",
  "806-016-105": "Fringe Benefits",
  "806-020-105": "Fringe Benefits",
  "998-001-100": "Fringe Benefits",
  "998-001-105": "Fringe Benefits",
  "998-002-105": "Fringe Benefits",
  "700-001-120": "Overhead",
  "810-021-120": "Overhead",
  "810-021-150": "Overhead",
  "810-061-120": "Overhead",
  "810-062-120": "Overhead",
  "810-062-160": "Overhead",
  "810-091-120": "Overhead",
  "890-002-120": "Overhead",
  "998-001-106": "Overhead",
  "998-001-110": "Overhead",
  "998-001-120": "Overhead",
  "998-001-125": "Overhead",
  "998-002-110": "Overhead",
  "998-002-120": "Overhead",
  "998-100-106": "Overhead",
  "998-100-110": "Overhead",
  "998-100-120": "Overhead",
  "998-100-125": "Overhead",
  "998-100-130": "Overhead",
  "998-100-135": "Overhead",
  "998-105-125": "Overhead",
  "998-105-130": "Overhead",
  "998-105-135": "Overhead",
  "998-106-110": "Overhead",
  "998-106-120": "Overhead",
  "998-125-120": "Overhead",
  "700-001-140": "General & Administration Exp",
  "700-002-140": "General & Administration Exp",
  "700-010-140": "General & Administration Exp",
  "807-001-140": "General & Administration Exp",
  "807-003-140": "General & Administration Exp",
  "807-004-140": "General & Administration Exp",
  "807-005-140": "General & Administration Exp",
  "807-006-140": "General & Administration Exp",
  "807-008-140": "General & Administration Exp",
  "807-009-140": "General & Administration Exp",
  "807-010-140": "General & Administration Exp",
  "807-011-140": "General & Administration Exp",
  "807-012-140": "General & Administration Exp",
  "810-001-140": "General & Administration Exp",
  "810-002-140": "General & Administration Exp",
  "810-004-140": "General & Administration Exp",
  "810-005-140": "General & Administration Exp",
  "810-006-140": "General & Administration Exp",
  "810-015-140": "General & Administration Exp",
  "810-016-140": "General & Administration Exp",
  "810-017-140": "General & Administration Exp",
  "810-019-140": "General & Administration Exp",
  "810-021-140": "General & Administration Exp",
  "810-022-140": "General & Administration Exp",
  "810-026-140": "General & Administration Exp",
  "810-027-140": "General & Administration Exp",
  "810-041-140": "General & Administration Exp",
  "810-042-140": "General & Administration Exp",
  "810-049-140": "General & Administration Exp",
  "810-051-140": "General & Administration Exp",
  "810-055-140": "General & Administration Exp",
  "810-056-140": "General & Administration Exp",
  "810-057-140": "General & Administration Exp",
  "810-059-140": "General & Administration Exp",
  "810-061-140": "General & Administration Exp",
  "810-062-140": "General & Administration Exp",
  "810-063-140": "General & Administration Exp",
  "810-065-140": "General & Administration Exp",
  "810-066-140": "General & Administration Exp",
  "810-068-140": "General & Administration Exp",
  "810-069-140": "General & Administration Exp",
  "810-075-140": "General & Administration Exp",
  "810-077-140": "General & Administration Exp",
  "810-084-140": "General & Administration Exp",
  "810-085-140": "General & Administration Exp",
  "810-090-140": "General & Administration Exp",
  "810-091-140": "General & Administration Exp",
  "810-095-140": "General & Administration Exp",
  "810-098-140": "General & Administration Exp",
  "880-001-140": "General & Administration Exp",
  "880-002-140": "General & Administration Exp",
  "880-004-140": "General & Administration Exp",
  "890-001-140": "General & Administration Exp",
  "890-002-140": "General & Administration Exp",
  "890-003-140": "General & Administration Exp",
  "890-004-140": "General & Administration Exp",
  "998-001-140": "General & Administration Exp",
  "998-002-140": "General & Administration Exp",
  "998-100-140": "General & Administration Exp",
  "998-100-14A": "General & Administration Exp",
  "998-100-14B": "General & Administration Exp",
  "998-105-140": "General & Administration Exp",
  "998-105-14A": "General & Administration Exp",
  "998-105-14B": "General & Administration Exp",
  "998-106-140": "General & Administration Exp",
  "998-106-14A": "General & Administration Exp",
  "998-106-14B": "General & Administration Exp",
  "998-125-140": "General & Administration Exp",
  "998-125-14A": "General & Administration Exp",
  "998-125-14B": "General & Administration Exp",
  "700-003-106": "HR/Payroll Allocation",
  "810-017-106": "HR/Payroll Allocation",
  "998-105-106": "HR/Payroll Allocation",
  "700-004-125": "IT/Facilities",
  "810-016-125": "IT/Facilities",
  "810-017-125": "IT/Facilities",
  "810-049-125": "IT/Facilities",
  "998-106-125": "IT/Facilities",
  "700-001-130": "Project Specific Overhead",
  "700-002-130": "Project Specific Overhead",
  "998-001-130": "Project Specific Overhead",
  "998-002-130": "Project Specific Overhead",
  "998-106-130": "Project Specific Overhead",
  "998-125-130": "Project Specific Overhead",
  "700-001-135": "Subcont, Material & Equipment",
  "810-017-135": "Subcont, Material & Equipment",
  "998-001-135": "Subcont, Material & Equipment",
  "998-002-135": "Subcont, Material & Equipment",
  "998-106-135": "Subcont, Material & Equipment",
  "998-125-135": "Subcont, Material & Equipment",
  "900-001": "Unallowables",
  "900-002": "Unallowables",
  "900-005": "Unallowables",
  "900-007": "Unallowables",
  "900-008": "Unallowables",
  "900-011": "Unallowables",
  "900-012": "Unallowables",
  "900-014": "Unallowables",
  "900-016": "Unallowables",
  "900-017": "Unallowables",
  "900-018": "Unallowables",
  "900-019": "Unallowables",
  "900-020": "Unallowables",
  "900-023": "Unallowables",
  "900-026": "Unallowables",
  "900-041": "Unallowables",
  "998-001-999": "Unallowables",
  "998-002-999": "Unallowables",
  "410-001": "Interest Income",
  "410-003": "Interest Income",
  "410-002": "Other Income",
};
const REPORT_DIRECT_COST_GROUPS = new Set([
  "Consultation",
  "Materials",
  "Material Handling",
  "Subcontractors",
  "Travel",
  "Other Direct Cost",
  "Equipment",
  "Unallowable Direct - ODCs",
]);
const REPORT_INDIRECT_COST_GROUPS = new Set([
  "Fringe Benefits",
  "Overhead",
  "General & Administration Exp",
  "HR/Payroll Allocation",
  "IT/Facilities",
  "Project Specific Overhead",
  "Subcont, Material & Equipment",
  "Unallowables",
]);

function getReportAccountGroup(row, isRevenueSection = false) {
  if (isRevenueSection) return "Contracts Revenue";
  const acctId = String(row.acctId ?? "").trim();
  if (acctId === "410-009") return null;
  return REPORT_ACCOUNT_GROUPS[acctId] || "Other Expenses";
}

// Pool definitions are loaded from POOLS_API at runtime.

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

// Presentation filter only: these pools remain in calculations and other tabs.
function isPbrStructurePoolVisible(name) {
  const key = String(name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return !new Set([
    "statutory401k",
    "hrpayrollallocation",
    "indirectlabitfacalloc",
  ]).has(key);
}

function groupPbrStructureAccounts(rows, poolId, section, orgNames = {}) {
  const accounts = new Map();
  rows.forEach((row) => {
    const acctId = String(row.acctId ?? "").trim();
    const orgId = String(row.orgId ?? "").trim();
    if (!accounts.has(acctId)) {
      accounts.set(acctId, {
        id: `${poolId}-${section}-account-${acctId}`,
        name: `${acctId || "Unmapped"} - ${row.accountName || `Account ${acctId}`}`,
        level: "Account",
        amount: 0,
        orgs: new Map(),
      });
    }
    const account = accounts.get(acctId);
    account.amount += Number(row.total || 0);
    if (!account.orgs.has(orgId)) {
      const orgName = orgNames[orgId.toUpperCase()] || row.orgName || "";
      account.orgs.set(orgId, {
        id: `${account.id}-org-${orgId}`,
        name: orgName ? `${orgId} - ${orgName}` : orgId || "Unmapped Org",
        level: "Org",
        amount: 0,
        allocations: new Set(),
      });
    }
    const org = account.orgs.get(orgId);
    org.amount += Number(row.total || 0);
    if (row.allocationAcctId && String(row.allocationAcctId) !== acctId) {
      org.allocations.add(String(row.allocationAcctId));
    }
  });
  return Array.from(accounts.values())
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
    .map(({ orgs, ...account }) => ({
      ...account,
      amount: Number(account.amount.toFixed(2)),
      children: Array.from(orgs.values())
        .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
        .map(({ allocations, ...org }) => ({
          ...org,
          amount: Number(org.amount.toFixed(2)),
          name: allocations.size
            ? `${org.name} ➔ Allocates to [${Array.from(allocations).join(", ")}]`
            : org.name,
        })),
    }));
}

// Combine Non-Labor groups only when all parent fields match exactly.
// splitPbrMonthlyRecords still keeps duplicate records for the same period separate.
function combinePbrNonLaborGroups(groups) {
  const combined = [];
  const byHeader = new Map();
  groups.forEach((group) => {
    if (
      String(group.pbrType ?? "")
        .toUpperCase()
        .replace(/[^A-Z]/g, "") !== "NONLABOR"
    ) {
      combined.push(group);
      return;
    }
    const header = Object.keys(group)
      .filter((key) => key !== "monthlyData")
      .sort()
      .map((key) => [key, group[key]]);
    const key = JSON.stringify(header);
    if (!byHeader.has(key)) {
      const merged = { ...group, monthlyData: [...(group.monthlyData || [])] };
      byHeader.set(key, merged);
      combined.push(merged);
    } else {
      byHeader.get(key).monthlyData.push(...(group.monthlyData || []));
    }
  });
  return combined;
}

// A grouped GET row may contain several persisted records for the same month.
// Keep each occurrence in a separate UI row; never discard or combine record IDs.
function splitPbrMonthlyRecords(group, fiscalYear) {
  const lanes = [];
  const occurrences = new Map();
  (group.monthlyData || []).forEach((period) => {
    const year = Number(period.fyCd ?? fiscalYear);
    const month = Number(period.pdNo);
    if (year !== Number(fiscalYear) || month < 1 || month > 12) return;
    const key = `${year}:${month}`;
    const index = occurrences.get(key) || 0;
    occurrences.set(key, index + 1);
    if (!lanes[index]) lanes[index] = [];
    lanes[index].push({ ...period, fyCd: year, pdNo: month });
  });
  return (lanes.length ? lanes : [[]]).map((monthlyData) => ({
    ...group,
    monthlyData,
  }));
}

function pbrBusinessKey(row, type = row.type) {
  const normalizedType = String(type ?? row.pbrType ?? "")
    .replace(/[^a-z]/gi, "")
    .toUpperCase();
  const norm = (value) =>
    String(value ?? "")
      .trim()
      .toUpperCase();
  const isLabor = normalizedType === "LABOR";
  return JSON.stringify([
    normalizedType,
    norm(getTopLevelProj(row.projId) || "NA"),
    norm(row.acctId),
    norm(row.orgId),
    norm(row.emplRVendId ?? (isLabor ? row.empId : row.vendorId)),
    isLabor ? norm(row.plcCode || row.laborCat || "NA") : "NA",
  ]);
}

// Only a GL detail identifier identifies a source transaction. GL `id` is a person/vendor ID.
function groupPbrActuals(
  sourceRows,
  type,
  fiscalYear,
  closingPeriod,
  lookups = {},
) {
  const grouped = new Map();
  const seenSourceDetails = new Map();
  const norm = (value) =>
    String(value ?? "")
      .trim()
      .toUpperCase();
  sourceRows.forEach((source) => {
    const isLabor = type === "Labor";
    if ((norm(source.sIdType) === "E") !== isLabor) return;
    const year = Number(source.fyCd ?? fiscalYear);
    const period = Number(source.pdNo);
    if (
      year !== Number(fiscalYear) ||
      !Number.isInteger(period) ||
      period < 1 ||
      period > 12
    )
      return;
    if (isExcludedActualAccount(source.acctId)) return;
    const project = getTopLevelProj(source.projId) || "NA";
    const acctId = String(source.acctId ?? "").trim();
    const orgId = String(source.orgId ?? "").trim();
    const personId = String(source.id ?? "").trim();
    const coa = lookups.coaMap?.[acctId] || {};
    const mapped = lookups.mappingData?.find(
      (row) => norm(row.acctId) === norm(acctId),
    );
    const candidate = {
      type,
      projId: project,
      acctId,
      orgId,
      empId: isLabor ? personId : "",
      vendorId: isLabor ? "" : personId,
      laborCat: isLabor ? String(source.billLabCatCd || "NA").trim() : "NA",
    };
    const key = pbrBusinessKey(candidate);
    const detailId =
      source.glPostDetailId ?? source.glDetailId ?? source.transactionLineId;
    if (detailId != null && String(detailId).trim() !== "") {
      const detailKey = JSON.stringify([key, year, period, String(detailId)]);
      const values = JSON.stringify([
        Number(source.hrs1 ?? source.hrs ?? 0),
        Number(source.amt1 ?? source.actAmt ?? source.amt ?? 0),
      ]);
      if (seenSourceDetails.has(detailKey)) {
        if (seenSourceDetails.get(detailKey) !== values)
          throw new Error(
            `Conflicting GL values for detail ${detailId}. Import stopped.`,
          );
        return;
      }
      seenSourceDetails.set(detailKey, values);
    }
    if (!grouped.has(key)) {
      const row = {
        ...candidate,
        uid: `actual_${key}`,
        id: `temp_actual_${key}`,
        projName:
          lookups.allProjects?.find(
            (projectRow) => projectRow.projectId === project,
          )?.name || "NA",
        acctName: coa.name || "",
        orgName: lookups.orgNameMap?.[norm(orgId)] || "",
        empName: isLabor ? source.name || "" : "",
        empStatus: isLabor ? "Active" : "",
        vendorName: isLabor ? "" : source.name || "Unknown Vendor",
        pbrGroup: mapped?.pbrAcctGrp || coa.pbrGroup || "",
        rate: 0,
        inflationRate: 0,
        _isDirty: true,
        _actualImport: true,
        _sourceActuals: true,
        _importedPeriods: [],
        _baseAmounts: {},
      };
      months.forEach((month) => {
        row[`${month}Hours`] = 0;
        row[`${month}Amount`] = 0;
      });
      grouped.set(key, row);
    }
    const target = grouped.get(key);
    const month = months[period - 1];
    target[`${month}Hours`] += isLabor
      ? Number(source.hrs1 ?? source.hrs ?? 0)
      : 0;
    target[`${month}Amount`] += Number(
      source.amt1 ?? source.actAmt ?? source.amt ?? 0,
    );
    if (!target._importedPeriods.includes(period))
      target._importedPeriods.push(period);
  });
  return Array.from(grouped.values(), (row) => {
    months.forEach((month) => {
      row[`${month}Hours`] = Number(row[`${month}Hours`].toFixed(2));
      row[`${month}Amount`] = Number(row[`${month}Amount`].toFixed(2));
      row._baseAmounts[month] = row[`${month}Amount`];
    });
    const total = totalPbrRow(row);
    total.rate =
      total.type === "Labor" && total.totalHours !== 0
        ? Number((total.totalAmount / total.totalHours).toFixed(4))
        : 0;
    return total;
  });
}

function mergePbrActuals(previous, imported, fiscalYear, closingPeriod) {
  // Replace old, unsaved raw-GL snapshots; persisted IDs are always retained.
  const rows = previous.filter(
    (row) => !(String(row.id).startsWith("temp_gl_") && !row._isPersisted),
  );
  let skippedAmbiguousPeriods = 0;
  imported.forEach((incoming) => {
    const key = pbrBusinessKey(incoming);
    incoming._importedPeriods.forEach((period) => {
      const matches = rows
        .map((row, index) => ({ row, index }))
        .filter(({ row }) => pbrBusinessKey(row) === key);
      const savedMatches = matches.filter(({ row }) =>
        row.monthlyRecords?.some(
          (saved) =>
            Number(saved.fyCd ?? fiscalYear) === Number(fiscalYear) &&
            Number(saved.pdNo) === period,
        ),
      );
      if (
        savedMatches.length > 1 ||
        (savedMatches.length === 0 && matches.length > 1)
      ) {
        skippedAmbiguousPeriods += 1;
        return; // Do not pick an arbitrary DB ID or insert another copy.
      }
      // Historical actuals may be loaded initially, but saved closed records stay frozen.
      if (
        isPbrPeriodClosed(fiscalYear, period - 1, closingPeriod) &&
        savedMatches.length > 0
      )
        return;
      const match = savedMatches[0] || matches[0];
      if (!match) {
        const created = {
          ...incoming,
          _importedPeriods: [],
          _baseAmounts: {},
          _baseAmountInputs: {},
        };
        months.forEach((month) => {
          created[`${month}Hours`] = 0;
          created[`${month}Amount`] = 0;
        });
        rows.push(created);
      }
      const index = match ? match.index : rows.length - 1;
      const original = rows[index];
      const month = months[period - 1];
      const hours = Number(incoming[`${month}Hours`] || 0);
      const amount = Number(incoming[`${month}Amount`] || 0);
      const changed =
        Number(original[`${month}Hours`] || 0) !== hours ||
        Number(original[`${month}Amount`] || 0) !== amount;
      const factor = 1 + getPbrPeriodInflation(original, month) / 100;
      rows[index] = totalPbrRow({
        ...original,
        [`${month}Hours`]: hours,
        [`${month}Amount`]: amount,
        _isDirty: Boolean(
          original._isDirty ||
          changed ||
          ((original._isPersisted || original.monthlyRecords?.length > 0) &&
            savedMatches.length === 0),
        ),
        _sourceActuals: true,
        _baseAmounts: {
          ...(original._baseAmounts || {}),
          [month]: amount / factor,
        },
        _baseAmountInputs: {
          ...(original._baseAmountInputs || {}),
          [month]: Number((amount / factor).toFixed(2)),
        },
        _importedPeriods: Array.from(
          new Set([...(original._importedPeriods || []), period]),
        ),
      });
    });
  });
  return { rows, skippedAmbiguousPeriods };
}

// Repeated GET copies of the same persisted ID are one record. Distinct IDs remain visible.
function uniquePbrMonthlyIds(groups) {
  const seen = new Set();
  return groups
    .map((group) => ({
      ...group,
      _hadMonthlyRecords: Boolean(group.monthlyData?.length),
      monthlyData: (group.monthlyData || []).filter((period) => {
        if (period.id == null) return true;
        const key = String(period.id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }),
    }))
    .filter(
      (group) => group.monthlyData.length > 0 || !group._hadMonthlyRecords,
    )
    .map(({ _hadMonthlyRecords, ...group }) => group);
}

function ensurePbrSaveUniqueness(requests, currentRows, fiscalYear) {
  const updates = new Map();
  const inserts = new Map();
  const existing = new Set();
  currentRows.forEach((row) =>
    (row.monthlyRecords || []).forEach((period) => {
      if (
        period.id != null &&
        Number(period.fyCd ?? fiscalYear) === Number(fiscalYear)
      ) {
        existing.add(
          `${pbrBusinessKey(row)}|${Number(fiscalYear)}|${Number(period.pdNo)}`,
        );
      }
    }),
  );
  requests
    .flatMap((request) => request.updates)
    .forEach((record) => {
      const key = String(record.id);
      if (
        updates.has(key) &&
        JSON.stringify(updates.get(key)) !== JSON.stringify(record)
      ) {
        throw new Error(
          `Conflicting updates for monthly record ${key}. Reload before saving.`,
        );
      }
      updates.set(key, record);
    });
  requests
    .flatMap((request) => request.inserts)
    .forEach((record) => {
      const header = { ...record, monthlyData: [] };
      record.monthlyData.forEach((period) => {
        const key = `${pbrBusinessKey(record, record.pbrType)}|${Number(period.fyCd)}|${Number(period.pdNo)}`;
        if (existing.has(key))
          throw new Error(
            `A saved ${record.pbrType} record already exists for period ${period.pdNo}. Edit the existing record instead of inserting another.`,
          );
        const item = { ...header, monthlyData: [period] };
        if (
          inserts.has(key) &&
          JSON.stringify(inserts.get(key)) !== JSON.stringify(item)
        ) {
          throw new Error(
            `Conflicting new ${record.pbrType} records for period ${period.pdNo}. Resolve duplicate rows before saving.`,
          );
        }
        inserts.set(key, item);
      });
    });
  // Recombine validated insert periods by their complete request header.
  const insertGroups = new Map();
  inserts.forEach((record) => {
    const { monthlyData, ...header } = record;
    const key = JSON.stringify(header);
    if (!insertGroups.has(key))
      insertGroups.set(key, { ...header, monthlyData: [] });
    insertGroups.get(key).monthlyData.push(...monthlyData);
  });
  return {
    updates: Array.from(updates.values()),
    inserts: Array.from(insertGroups.values()),
  };
}

function isPbrPeriodClosed(fiscalYear, monthIndex, closingPeriod) {
  if (!closingPeriod) return false;
  const match = /^(\d{4})-(\d{2})/.exec(String(closingPeriod));
  if (!match) throw new Error("Invalid closing_period configuration.");
  return (
    Number(fiscalYear) * 12 + monthIndex <=
    Number(match[1]) * 12 + Number(match[2]) - 1
  );
}

function getPbrPeriodInflation(row, month) {
  const rate = Number(row.inflationRate || 0);
  const saved = row.monthlyRecords?.find(
    (period) => Number(period.pdNo) === months.indexOf(month) + 1,
  );
  return rate === Number(row._savedInflationRate || 0) && saved
    ? Number(saved.infRt || 0)
    : rate;
}

function getPbrBaseAmount(row, month) {
  if (row._baseAmounts?.[month] != null) return Number(row._baseAmounts[month]);
  return (
    Number(row[`${month}Amount`] || 0) /
    (1 + getPbrPeriodInflation(row, month) / 100)
  );
}

function totalPbrRow(row) {
  return {
    ...row,
    totalHours: Number(
      months
        .reduce((sum, month) => sum + Number(row[`${month}Hours`] || 0), 0)
        .toFixed(2),
    ),
    totalAmount: Number(
      months
        .reduce((sum, month) => sum + Number(row[`${month}Amount`] || 0), 0)
        .toFixed(2),
    ),
  };
}

function recalculatePbrInflation(
  row,
  type,
  changes,
  fiscalYear,
  closingPeriod,
) {
  const updated = {
    ...row,
    ...changes,
    _isDirty: true,
    _baseAmounts: { ...(row._baseAmounts || {}) },
  };
  months.forEach((month, index) => {
    if (isPbrPeriodClosed(fiscalYear, index, closingPeriod)) return;
    const factor = 1 + getPbrPeriodInflation(updated, month) / 100;
    if (type === "Labor") {
      updated[`${month}Amount`] = Number(
        (
          Number(updated[`${month}Hours`] || 0) *
          Number(updated.rate || 0) *
          factor
        ).toFixed(2),
      );
    } else if (type === "Non-Labor") {
      const base = getPbrBaseAmount(row, month);
      updated._baseAmounts[month] = base;
      updated[`${month}Amount`] = Number((base * factor).toFixed(2));
    }
  });
  return totalPbrRow(updated);
}

function editPbrMonth(row, month, value, type, fiscalYear, closingPeriod) {
  const index = months.indexOf(month);
  if (index < 0 || isPbrPeriodClosed(fiscalYear, index, closingPeriod))
    return row;
  const amount = Number(value) || 0;
  const updated = { ...row, _isDirty: true };
  if (row._actualImport)
    updated._importedPeriods = Array.from(
      new Set([...(row._importedPeriods || []), index + 1]),
    );
  if (type === "Labor") {
    updated[`${month}Hours`] = value;
    updated[`${month}Amount`] = Number(
      (
        amount *
        Number(row.rate || 0) *
        (1 + getPbrPeriodInflation(row, month) / 100)
      ).toFixed(2),
    );
  } else if (type === "Non-Labor") {
    updated._baseAmounts = { ...(row._baseAmounts || {}), [month]: amount };
    updated._baseAmountInputs = {
      ...(row._baseAmountInputs || {}),
      [month]: value,
    };
    updated[`${month}Amount`] = Number(
      (amount * (1 + getPbrPeriodInflation(row, month) / 100)).toFixed(2),
    );
  } else updated[`${month}Amount`] = value;
  return totalPbrRow(updated);
}

function pbrRowMetadata(row) {
  return JSON.stringify([
    row.projId,
    row.empId || "",
    row.vendorId || "",
    row.acctId || "",
    row.laborCat || "NA",
    row.orgId || "",
    row.pbrGroup || "",
    Number(row.rate || 0),
  ]);
}

function buildPbrSaveRequests(
  rows,
  type,
  fiscalYear,
  version,
  status,
  closingPeriod = "",
) {
  const updates = [];
  const inserts = [];
  rows
    .filter((row) => row._isDirty)
    .forEach((row) => {
      const isLabor = type === "LABOR";
      const fields = {
        version,
        pbrType: type,
        projId: getTopLevelProj(row.projId) || "NA",
        emplRVendId: isLabor ? row.empId || "" : row.vendorId || "",
        acctId: row.acctId || "",
        plcCode:
          isLabor && row.laborCat && row.laborCat !== "- NA"
            ? row.laborCat
            : "NA",
        orgId: row.orgId || "",
        pbrAcctGrp: row.pbrGroup || "",
        hrlyRt: isLabor ? Number(row.rate || 0) : 0,
        status: status.toUpperCase(),
      };
      const savedPeriods = row.monthlyRecords || [];
      const isPersisted = row._isPersisted || savedPeriods.length > 0;
      const metadataChanged = row._savedMetadata !== pbrRowMetadata(row);
      const newPeriods = [];
      months.forEach((month, index) => {
        if (row._actualImport && !row._importedPeriods?.includes(index + 1))
          return;
        const existing = savedPeriods.find(
          (saved) =>
            Number(saved.fyCd ?? fiscalYear) === Number(fiscalYear) &&
            Number(saved.pdNo) === index + 1,
        );
        const isClosed = isPbrPeriodClosed(fiscalYear, index, closingPeriod);
        const isImportedActual = Boolean(
          row._sourceActuals && row._importedPeriods?.includes(index + 1),
        );
        // Permit initial actuals insertion, including history. Never overwrite a saved closed record.
        if (isClosed && (existing || !isImportedActual)) return;
        const period = {
          fyCd: Number(fiscalYear),
          pdNo: index + 1,
          hrs: isLabor ? Number(row[`${month}Hours`] || 0) : 0,
          amt: Number(row[`${month}Amount`] || 0),
          infRt:
            isClosed || type === "REVENUE"
              ? 0
              : getPbrPeriodInflation(row, month),
        };
        if (existing) {
          const id = Number(existing.id);
          if (existing.id == null || !Number.isSafeInteger(id) || id <= 0) {
            throw new Error(
              `Cannot update ${month}: the saved monthly record has no valid ID. Reload the report.`,
            );
          }
          if (
            type !== "REVENUE" &&
            Number(row.inflationRate || 0) ===
              Number(row._savedInflationRate || 0)
          ) {
            period.infRt = Number(existing.infRt || 0);
          }
          const changed =
            metadataChanged ||
            period.hrs !== Number(Number(existing.hrs || 0).toFixed(2)) ||
            period.amt !== Number(Number(existing.amt || 0).toFixed(2)) ||
            period.infRt !== Number(existing.infRt || 0);
          if (!changed) return;
          // Both the update envelope and its monthly record identify the same DB record.
          updates.push({ ...fields, id, monthlyData: [{ ...period, id }] });
        } else if (
          !isPersisted ||
          isImportedActual ||
          period.hrs !== 0 ||
          period.amt !== 0
        ) {
          // Insert missing actual periods, including explicit zeros, or populated manual open periods.
          newPeriods.push(period);
        }
      });
      if (newPeriods.length)
        inserts.push({ ...fields, monthlyData: newPeriods });
    });
  return { updates, inserts };
}

function unwrapApiArray(payload) {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.data)) return data.data;
  return data && typeof data === "object" ? [data] : [];
}

function normalizePsrRevenueRows(
  payload,
  projectId,
  selectedFY,
  projectName = "",
) {
  const rows = unwrapApiArray(payload);
  const byKey = new Map();
  const monthNames = [
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

  rows.forEach((source, rowIndex) => {
    if (!source || typeof source !== "object") return;
    const sourceProject =
      source.projId ??
      source.proj_id ??
      source.projectId ??
      source.project_id ??
      projectId;
    const topProject = getTopLevelProj(sourceProject);

    const sourceAcctId =
      source.acctId ??
      source.acct_id ??
      source.accountId ??
      source.account_id ??
      source.accountNo ??
      source.account_no ??
      source.accountNumber ??
      source.account_number ??
      source.acctNo ??
      source.acct_no ??
      source.accountCode ??
      source.account_code ??
      source.glAccountId ??
      source.gl_account_id ??
      "";
    const sourceAcctName =
      source.acctName ??
      source.acct_name ??
      source.accountName ??
      source.account_name ??
      source.accountDescription ??
      source.account_description ??
      source.name ??
      "";
    // const acctId = String(sourceAcctId ?? "").trim();
    // const orgId = String(source.orgId ?? source.org_id ?? source.organizationId ?? "").trim();
    // const key = `${topProject}_${acctId}_${orgId}`;
    const acctId = "410-009";
    const orgId = String(
      source.orgId ?? source.org_id ?? source.organizationId ?? "",
    ).trim();

    if (!orgId.startsWith("1")) return;

    // const key = `${topProject}_${acctId}_${orgId}`;
    const key = topProject;
    if (!byKey.has(key)) {
      const row = {
        uid: `psr_${topProject}_${acctId}_${orgId}_${rowIndex}`,
        id: null,
        monthlyIds: [],
        type: "Revenue",
        projId: topProject,
        projName:
          source.projName ??
          source.proj_name ??
          source.projectName ??
          projectName ??
          topProject,
        acctId,
        // acctName: sourceAcctName || (acctId ? `Account ${acctId}` : "Revenue"),
        acctName: "Revenue",
        orgId,
        orgName:
          source.orgName ?? source.org_name ?? source.organizationName ?? "",
        pbrGroup:
          source.pbrGroup ?? source.pbrAcctGrp ?? source.budgetSheet ?? "",
        // inflationRate: 0, _isDirty: false, totalAmount: 0,
        inflationRate: 0,
        _isDirty: false,
        totalAmount: 0,
        _actualImport: true,
        _sourceActuals: true,
        _importedPeriods: [],
      };
      monthNames.forEach((m) => {
        row[`${m}Amount`] = 0;
        row[`${m}Hours`] = 0;
      });
      byKey.set(key, row);
    }
    const target = byKey.get(key);
    const periodRows = Array.isArray(source.monthlyData)
      ? source.monthlyData
      : Array.isArray(source.periods)
        ? source.periods
        : null;
    //     if (periodRows) {
    //       periodRows.forEach((period) => {
    //         const year = Number(period.fyCd ?? period.fy_cd ?? period.year ?? selectedFY);
    //         const periodNo = Number(period.pdNo ?? period.pd_no ?? period.period ?? period.month ?? 0);
    //         if (year !== Number(selectedFY) || periodNo < 1 || periodNo > 12) return;
    //         // const amount = Number(period.ptdIncurAmt ?? 0) || 0;
    //         const amount = Number(period.ptdIncurAmt ?? 0) || 0;
    //         target[`${monthNames[periodNo - 1]}Amount`] += amount;
    //       });
    //     } else {
    //       monthNames.forEach((m, index) => {
    //         const value = source[`${m}Amount`] ?? source[`${m.toLowerCase()}Amount`] ?? source[`${m.toLowerCase()}_amount`];
    //         if (value !== undefined && value !== null) target[`${m}Amount`] += Number(value) || 0;
    //         // else {
    //         //   const periodNo = Number(source.pdNo ?? source.pd_no ?? source.period ?? source.month ?? 0);
    //         //   const year = Number(source.fyCd ?? source.fy_cd ?? source.year ?? selectedFY);
    //         //   if (periodNo === index + 1 && year === Number(selectedFY)) {
    //         //     target[`${m}Amount`] += Number(source.pyIncurAmt ?? source.py_incur_amt ?? source.revAmt ?? source.rev_amt ?? source.amount ?? source.amt ?? source.ptdIncurAmt ?? 0) || 0;
    //         //   }
    //         // }
    //         else {
    //   const periodNo = Number(
    //     source.pdNo ?? source.pd_no ?? source.period ?? source.month ?? 0
    //   );

    //   const year = Number(
    //     source.fyCd ?? source.fy_cd ?? source.year ?? selectedFY
    //   );

    //   if (
    //     year === Number(selectedFY) &&
    //     Number.isInteger(periodNo) &&
    //     periodNo >= 1 &&
    //     periodNo <= 12
    //   ) {
    //     target[`${monthNames[periodNo - 1]}Amount`] +=
    //       Number(source.ptdIncurAmt ?? 0) || 0;
    //   }
    // }
    //       });
    //     }
    //   });
    if (periodRows) {
      periodRows.forEach((period) => {
        const year = Number(
          period.fyCd ?? period.fy_cd ?? period.year ?? selectedFY,
        );

        const periodNo = Number(
          period.pdNo ?? period.pd_no ?? period.period ?? period.month ?? 0,
        );

        if (
          year !== Number(selectedFY) ||
          !Number.isInteger(periodNo) ||
          periodNo < 1 ||
          periodNo > 12
        )
          return;

        target[`${monthNames[periodNo - 1]}Amount`] +=
          Number(period.ptdIncurAmt ?? 0) || 0;
        if (!target._importedPeriods.includes(periodNo)) {
          target._importedPeriods.push(periodNo);
        }
      });
    } else {
      const year = Number(
        source.fyCd ?? source.fy_cd ?? source.year ?? selectedFY,
      );

      const periodNo = Number(
        source.pdNo ?? source.pd_no ?? source.period ?? source.month ?? 0,
      );

      if (
        year === Number(selectedFY) &&
        Number.isInteger(periodNo) &&
        periodNo >= 1 &&
        periodNo <= 12
      ) {
        target[`${monthNames[periodNo - 1]}Amount`] +=
          Number(source.ptdIncurAmt ?? 0) || 0;
        if (!target._importedPeriods.includes(periodNo)) {
          target._importedPeriods.push(periodNo);
        }
      }
    }
  });

  return Array.from(byKey.values()).map((row) => {
    row.totalAmount = Number(
      monthNames
        .reduce((sum, m) => sum + Number(row[`${m}Amount`] || 0), 0)
        .toFixed(2),
    );
    monthNames.forEach((m) => {
      row[`${m}Amount`] = Number(Number(row[`${m}Amount`] || 0).toFixed(2));
    });
    return row;
  });
}

/* =======================================================
   FORMATTERS & LOGIC
======================================================= */
function formatCurrency(value) {
  const v = Number(value || 0);
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);
  return (
    sign +
    "$" +
    abs.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function safeString(value) {
  return value === null || value === undefined ? "" : String(value);
}

function getTopLevelProj(id) {
  if (!id || id === "NA") return "NA";
  return String(id).split(".")[0];
}

// const isExcludedActualAccount = (acctId) =>
//   /^[1-4]/.test(String(acctId ?? "").trim());
const isExcludedActualAccount = (acctId) => {
  const account = String(acctId || "").trim();

  return (
    ["1", "2", "3", "4"].some((prefix) => account.startsWith(prefix)) ||
    account.startsWith("998-")
  );
};

function nodeMatchesSearch(node, term) {
  if (!term) return true;
  const t = term.toLowerCase();
  if (
    safeString(node.name).toLowerCase().includes(t) ||
    safeString(node.id).toLowerCase().includes(t)
  )
    return true;
  if (node.children && node.children.length > 0)
    return node.children.some((child) => nodeMatchesSearch(child, t));
  return false;
}

// function getUtilizationTag(hours) {
//   const h = Number(hours || 0);
//   if (h === STANDARD_ANNUAL_HOURS)
function getUtilizationTag(hours, standardHours) {
  const h = Number(hours || 0);
  if (h === standardHours)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        On Budget
      </span>
    );
  if (h > standardHours)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
        Over Budget
      </span>
    );
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
      Under Budget
    </span>
  );
}

/* ===== EXCEL STYLING HELPERS ===== */
const THIN = { style: "thin", color: { rgb: "CBD5E1" } };
const XL_BORDER = { top: THIN, bottom: THIN, left: THIN, right: THIN };
const XL_MONEY = '"$"#,##0.00;[Red]-"$"#,##0.00';
const XL_NUM = "#,##0.00";
const XL_PCT = '0.00"%"';
const XL_HEADER = {
  font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
  fill: { patternType: "solid", fgColor: { rgb: "4F46E5" } }, // indigo header
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: XL_BORDER,
};

const safeSheetName = (n) => n.replace(/[\\/?*[\]:]/g, "-").slice(0, 31);

// rowStyles: { [rowIndex]: { bold, bg, color, indent, fmt } }
function buildStyledSheet(
  headers,
  rows,
  { money = [], num = [], pct = [], widths = [], rowStyles = {} } = {},
) {
  const aoa = [headers.map((h) => ({ v: h, t: "s", s: XL_HEADER }))];

  rows.forEach((row, ri) => {
    const rs = rowStyles[ri] || {};
    aoa.push(
      row.map((val, ci) => {
        const isNum = typeof val === "number" && !Number.isNaN(val);
        const font = { sz: 10, bold: !!rs.bold };
        if (rs.color) font.color = { rgb: rs.color };
        const s = {
          font,
          alignment: {
            horizontal: isNum ? "right" : "left",
            vertical: "center",
            ...(ci === 0 && rs.indent ? { indent: rs.indent } : {}),
          },
          border: XL_BORDER,
        };
        if (rs.bg) s.fill = { patternType: "solid", fgColor: { rgb: rs.bg } };

        const cell = { v: isNum ? val : (val ?? ""), t: isNum ? "n" : "s", s };
        if (isNum) {
          if (rs.fmt) cell.z = rs.fmt;
          else if (money.includes(ci)) cell.z = XL_MONEY;
          else if (pct.includes(ci)) cell.z = XL_PCT;
          else if (num.includes(ci)) cell.z = XL_NUM;
        }
        return cell;
      }),
    );
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = headers.map((h, i) => ({
    wch: widths[i] || Math.max(13, String(h).length + 4),
  }));
  ws["!rows"] = [{ hpt: 24 }];
  ws["!autofilter"] = {
    ref: XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: aoa.length - 1, c: Math.max(0, headers.length - 1) },
    }),
  };
  ws["!freeze"] = {
    xSplit: "1",
    ySplit: "1",
    topLeftCell: "B2",
    activePane: "bottomRight",
    state: "frozen",
  };
  return ws;
}

// appends a bold "Total" row summing numeric columns from `fromCol`
function withTotals(rows, fromCol, width) {
  if (rows.length === 0) return { rows, rowStyles: {} };
  const t = Array(width).fill("");
  t[0] = "Total";
  for (let c = fromCol; c < width; c++)
    t[c] = rows.reduce((s, r) => s + (typeof r[c] === "number" ? r[c] : 0), 0);
  return {
    rows: [...rows, t],
    rowStyles: { [rows.length]: { bold: true, bg: "F1F5F9" } },
  };
}

/* =======================================================
   PBR STRUCTURE ROW COMPONENT
======================================================= */
function Row({ node, depth, expanded, onToggle, searchTerm, hideZeros }) {
  if (hideZeros && (node.amount === 0 || !node.amount)) return null;

  const hasChildren = node.children && node.children.length > 0;
  const key = node.id + "__" + depth;
  const isOpen = expanded.has(key);

  if (!nodeMatchesSearch(node, searchTerm)) return null;

  const rateDisplay =
    node.rate !== undefined && node.rate !== null
      ? `${node.rate.toFixed(2)}%`
      : "";

  let rowBg = "hover:bg-slate-50 even:bg-slate-50/50 bg-white";
  let textStyle = "text-slate-600 font-medium text-[13px]";

  if (depth === 0) {
    rowBg = "bg-slate-100 border-t border-slate-300";
    textStyle = "font-semibold text-[13px] text-slate-800";
  } else if (depth === 1) {
    rowBg =
      "bg-indigo-50/30 hover:bg-indigo-50/60 border-l-2 border-indigo-400";
    textStyle = "font-medium text-indigo-900 text-[13px]";
  } else if (depth === 2) {
    textStyle =
      "font-normal text-slate-600 text-[13px] truncate max-w-[500px] block";
  }

  return (
    <>
      <tr className={`transition-colors border-b border-slate-200 ${rowBg}`}>
        <td className="px-3 py-2 border-r border-slate-200">
          <div
            className="flex items-center gap-1.5 min-h-[20px]"
            style={{ paddingLeft: depth * 24 }}
          >
            {hasChildren ? (
              <button
                type="button"
                onClick={() => onToggle(key)}
                className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors"
              >
                {isOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            ) : (
              <span className="flex-shrink-0 w-5 h-5" />
            )}
            <span className={`truncate ${textStyle}`} title={node.name}>
              {node.name}
            </span>
          </div>
        </td>
        <td className="px-4 py-2 text-[13px] border-r border-slate-200 text-right font-medium text-slate-700">
          {node.level === "Pool" ? "" : formatCurrency(node.amount)}
        </td>
        <td className="px-4 py-2 text-[13px] border-r border-slate-200 text-right font-medium text-emerald-600">
          {rateDisplay}
        </td>
      </tr>
      {hasChildren &&
        isOpen &&
        node.children.map((child, index) => (
          <Row
            key={child.id + "-" + index}
            node={child}
            depth={depth + 1}
            expanded={expanded}
            onToggle={onToggle}
            searchTerm={searchTerm}
            hideZeros={hideZeros}
          />
        ))}
    </>
  );
}

/* =======================================================
   INCOME STATEMENT ROW COMPONENT
======================================================= */
function FinancialRow({
  item,
  depth = 0,
  formatCurrency,
  expandedIds,
  toggleRow,
}) {
  const currentId = item.id;
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedIds.has(currentId);
  const isLevel0 = depth === 0;
  const isLevel1 = depth === 1;

  let rowStyle =
    "border-b border-slate-200 hover:bg-slate-50 transition-colors ";
  let textStyle = "text-[12px] tracking-tight";
  const isSummaryRow = item.type === "summary";

  if (isSummaryRow) {
    rowStyle +=
      " bg-slate-100/90 font-bold border-t-2 border-slate-300 text-slate-900 shadow-sm";
    textStyle = "text-[12px] font-bold tracking-tight";
  } else if (isLevel0) {
    rowStyle += "bg-slate-50 font-semibold text-slate-900";
    textStyle = "text-[12px] tracking-tight";
  } else if (isLevel1) {
    rowStyle += "bg-white text-slate-900 font-medium";
    textStyle = "text-[11px]";
  } else {
    rowStyle += "bg-white text-slate-700";
    textStyle = "text-[11px]";
  }

  let displayDescp = item.name || "";
  const ytdTotal = Object.values(item.monthlyAmts || {}).reduce(
    (acc, val) => acc + (val === "-" ? 0 : val),
    0,
  );

  return (
    <>
      <tr className={rowStyle}>
        <td
          className={`py-2 px-4 sticky left-0 z-30 border-r border-slate-200 bg-inherit ${item.type === "summary" ? "bg-slate-100" : ""}`}
          style={{
            paddingLeft: isSummaryRow ? "16px" : `${depth * 20 + 16}px`,
            minWidth: "240px",
            maxWidth: "240px",
          }}
        >
          <div className="flex items-center">
            {hasChildren && toggleRow ? (
              <button
                onClick={() => toggleRow(currentId)}
                className="mr-2 text-slate-400 cursor-pointer flex items-center justify-center focus:outline-none"
              >
                <div
                  className={`transition-transform duration-150 ${isExpanded ? "" : "-rotate-90"}`}
                >
                  <ChevronDown size={14} />
                </div>
              </button>
            ) : (
              <span className="w-4 mr-2" />
            )}
            <div className="flex flex-col truncate">
              {!isSummaryRow && (
                <span className="text-[9px] text-slate-500 font-mono tracking-normal">
                  {currentId}
                </span>
              )}
              <span className={`truncate capitalize ${textStyle}`}>
                {displayDescp}
              </span>
            </div>
          </div>
        </td>
        {[...Array(12)].map((_, i) => {
          const pd = i + 1;
          const val = item.monthlyAmts?.[pd] ?? "-";
          return (
            <td
              key={pd}
              className={`text-right px-4 tabular-nums border-r border-slate-200/60 w-28 py-2 bg-inherit ${textStyle} ${val < 0 ? "text-red-600" : ""}`}
            >
              {val === "-" ? "-" : formatCurrency(val)}
            </td>
          );
        })}
        <td
          className={`text-right px-6 tabular-nums border-l-2 border-b border-slate-200 bg-slate-50/50 font-bold w-32 ${textStyle} ${ytdTotal < 0 ? "text-red-600" : ""}`}
        >
          {ytdTotal === 0 &&
          Object.values(item.monthlyAmts || {}).every((v) => v === "-")
            ? "-"
            : formatCurrency(ytdTotal)}
        </td>
      </tr>
      {isExpanded &&
        hasChildren &&
        item.children.map((child) => (
          <FinancialRow
            key={child.id}
            item={child}
            depth={depth + 1}
            formatCurrency={formatCurrency}
            expandedIds={expandedIds}
            toggleRow={toggleRow}
          />
        ))}
    </>
  );
}

/* =======================================================
   MAIN COMPONENT
======================================================= */
export default function PBRReport() {
  const [closingPeriod, setClosingPeriod] = useState("");
  const [configurationLoaded, setConfigurationLoaded] = useState(false);
  const [poolDefinitions, setPoolDefinitions] = useState([]);
  const [showEscalationOverride, setShowEscalationOverride] = useState(false);
  const [escalationMode, setEscalationMode] = useState("uniform");
  const [uniformEscalationRate, setUniformEscalationRate] = useState("0");
  const [poolEscalationRates, setPoolEscalationRates] = useState({});
  const ignoredRatesTrendPools = new Set([
    "FRINGEONOVERHEAD",
    "FRINGEONGNA",
    "OVERHEADONGNA",
  ]);
  const normalizePoolIdentifier = (value) =>
    String(value ?? "")
      .replace(/[^a-z0-9]/gi, "")
      .toUpperCase();
  const isRatesTrendPoolAllowed = (pool) => {
    const identifiers = [
      pool.name,
      pool.poolName,
      pool.code,
      pool.poolCode,
      pool.description,
    ].map(normalizePoolIdentifier);
    return !identifiers.some((identifier) =>
      ignoredRatesTrendPools.has(identifier),
    );
  };
  const WATERFALL_SEQUENCE = useMemo(
    () =>
      poolDefinitions
        .filter(
          (pool) => pool.isActive !== false && isRatesTrendPoolAllowed(pool),
        )
        .slice()
        .sort((a, b) => Number(a.sequence ?? 0) - Number(b.sequence ?? 0))
        .map((pool) => pool.name),
    [poolDefinitions],
  );
  const POOL_TYPES_MAPPING = useMemo(
    () =>
      Object.fromEntries(
        poolDefinitions
          .filter(
            (pool) => pool.isActive !== false && isRatesTrendPoolAllowed(pool),
          )
          .slice()
          .sort((a, b) => Number(a.sequence ?? 0) - Number(b.sequence ?? 0))
          .map((pool) => [pool.name, pool.code]),
      ),
    [poolDefinitions],
  );
  const getPoolEscalation = useCallback(
    (poolName, year) => {
      const pool = poolDefinitions.find((item) => item.name === poolName);
      const escalation = (pool?.yearlyEscalations || []).find(
        (item) => Number(item.year) === Number(year),
      );
      return (
        escalation?.escalationPercent ?? escalation?.esclationPercent ?? null
      );
    },
    [poolDefinitions],
  );

  const getEffectivePoolEscalation = useCallback(
    (poolName, year) => {
      const poolOverride = poolEscalationRates[poolName];
      if (
        poolOverride &&
        Object.prototype.hasOwnProperty.call(poolOverride, String(year))
      ) {
        return poolOverride[String(year)];
      }
      return getPoolEscalation(poolName, year);
    },
    [poolEscalationRates, getPoolEscalation],
  );

  const applyEscalationOverrides = () => {
    const yearKey = String(selectedFY);
    const next = { ...poolEscalationRates };

    WATERFALL_SEQUENCE.forEach((poolName) => {
      const rate =
        escalationMode === "uniform"
          ? uniformEscalationRate
          : (poolEscalationRates[poolName]?.[yearKey] ??
            getPoolEscalation(poolName, selectedFY) ??
            0);
      next[poolName] = {
        ...(next[poolName] || {}),
        [yearKey]: Number(rate) || 0,
      };
    });
    setPoolEscalationRates(next);
    setShowEscalationOverride(false);
  };

  const rightPaneRef = useRef(null);
  const leftPaneRef = useRef(null);
  const fileInputRef = useRef(null);
  const savingRecordsRef = useRef(false);
  const importingActualsRef = useRef(false);
  const importingLaborRef = useRef(false);
  const importingNonLaborRef = useRef(false);

  // const selectedYear = String(FY_CD);
  const [selectedFY, setSelectedFY] = useState(CURRENT_FY);
  const selectedYear = String(selectedFY);
  const isMonthLocked = (month) =>
    !configurationLoaded ||
    isPbrPeriodClosed(selectedFY, months.indexOf(month), closingPeriod);
  const hasOpenPeriods =
    configurationLoaded &&
    months.some(
      (_, index) => !isPbrPeriodClosed(selectedFY, index, closingPeriod),
    );
  const hasClosedSavedPeriods = (row) =>
    !configurationLoaded ||
    (row.monthlyRecords || []).some((period) =>
      isPbrPeriodClosed(
        Number(period.fyCd ?? selectedFY),
        Number(period.pdNo) - 1,
        closingPeriod,
      ),
    );

  const handleFYChange = (e) => {
    const hasUnsaved = [...laborData, ...nonLaborData, ...revenueData].some(
      (r) => r._isDirty,
    );
    if (
      hasUnsaved &&
      !window.confirm(
        "You have unsaved changes. Switching year will discard them. Continue?",
      )
    )
      return;
    setSelectedFY(Number(e.target.value));
  };
  // const [activeTab, setActiveTab] = useState("PBR Structure");

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [dashboardTab, setDashboardTab] = useState("Labor");

  const [pbrGroups, setPbrGroups] = useState([]);
  const [perfOptions, setPerfOptions] = useState([]);
  const [mappingActiveTab, setMappingActiveTab] = useState("Account Mapping");
  const [newPbrGroup, setNewPbrGroup] = useState("");
  const [newPerfOption, setNewPerfOption] = useState("");

  // const [mappingData, setMappingData] = useState([]);
  const [mappingData, setMappingData] = useState([]);
  const [laborData, setLaborData] = useState([]);
  const [nonLaborData, setNonLaborData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [savingRecords, setSavingRecords] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [hrDataMap, setHrDataMap] = useState({});

  const [stdHoursInput, setStdHoursInput] = useState(() => {
    try {
      return (
        localStorage.getItem("pbrStdHours") || String(DEFAULT_STANDARD_HOURS)
      );
    } catch {
      return String(DEFAULT_STANDARD_HOURS);
    }
  });
  const standardHours =
    Number(stdHoursInput) > 0 ? Number(stdHoursInput) : DEFAULT_STANDARD_HOURS;

  useEffect(() => {
    try {
      localStorage.setItem("pbrStdHours", stdHoursInput);
    } catch {
      /* ignore */
    }
  }, [stdHoursInput]);

  const [toast, setToast] = useState({ message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 5000);
  };

  const [selectedRowUids, setSelectedRowUids] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filtersByTab, setFiltersByTab] = useState({
    Labor: {},
    "Non-Labor": {},
    Revenue: {},
  });
  const laborColumnFilters = filtersByTab.Labor;
  const nonLaborColumnFilters = filtersByTab["Non-Labor"];
  const revenueColumnFilters = filtersByTab.Revenue;
  const columnFilters = filtersByTab[activeTab] || EMPTY_PBR_FILTERS;
  const setColumnFilters = (filters) =>
    setFiltersByTab((previous) => ({ ...previous, [activeTab]: filters }));

  const [laborLeftCols, setLaborLeftCols] = useState([
    { key: "select", label: "☑", w: 40 },
    { key: "action", label: "Act", w: 40 },
    { key: "empId", label: "Employee ID", w: 110 },
    { key: "empName", label: "Employee Name", w: 160 },
    { key: "empStatus", label: "Status", w: 90 },
    { key: "laborCat", label: "Labor Category", w: 130 },
    { key: "rate", label: "Hourly Rate", w: 100 },
    { key: "projId", label: "Project ID", w: 130 },
    { key: "projName", label: "Project Name", w: 200 },
    { key: "acctId", label: "Account ID", w: 110 },
    { key: "acctName", label: "Account Name", w: 160 },
    { key: "orgId", label: "Organization ID", w: 110 },
    { key: "orgName", label: "Organization Name", w: 180 },
    { key: "pbrGroup", label: "PBR Account Group", w: 180 },
  ]);

  const [nonLaborLeftCols, setNonLaborLeftCols] = useState([
    { key: "select", label: "☑", w: 40 },
    { key: "action", label: "Act", w: 40 },
    { key: "projId", label: "Project ID", w: 130 },
    { key: "projName", label: "Project Name", w: 200 },
    { key: "acctId", label: "Account ID", w: 110 },
    { key: "acctName", label: "Account Name", w: 150 },
    { key: "orgId", label: "Organization ID", w: 110 },
    { key: "orgName", label: "Organization Name", w: 180 },
    { key: "pbrGroup", label: "PBR Account Group", w: 180 },
    { key: "vendorId", label: "Vendor ID", w: 110 },
    { key: "vendorName", label: "Vendor Name", w: 180 },
  ]);

  const [revenueLeftCols, setRevenueLeftCols] = useState([
    { key: "select", label: "☑", w: 40 },
    { key: "action", label: "Act", w: 40 },
    { key: "projId", label: "Project ID", w: 130 },
    { key: "projName", label: "Project Name", w: 200 },
    { key: "acctId", label: "Account ID", w: 110 },
    { key: "acctName", label: "Account Name", w: 150 },
    { key: "orgId", label: "Organization ID", w: 110 },
    { key: "orgName", label: "Organization Name", w: 180 },
    { key: "pbrGroup", label: "PBR Account Group", w: 180 },
  ]);

  const [highlightedRow, setHighlightedRow] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [labHsRawData, setLabHsRawData] = useState([]);
  const [glRawData, setGlRawData] = useState([]);
  const [coaMap, setCoaMap] = useState({});
  const [searchedProjects, setSearchedProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [projectSuggestions, setProjectSuggestions] = useState([]);

  const [orgs, setOrgs] = useState([]);
  const [selectedOrgForAdd, setSelectedOrgForAdd] = useState("");
  const [orgAccounts, setOrgAccounts] = useState([]);
  const [selectedOrgAccounts, setSelectedOrgAccounts] = useState([]);
  const [fetchingAccounts, setFetchingAccounts] = useState(false);
  const [orgSearchTerm, setOrgSearchTerm] = useState("");
  const [accountSearchTerm, setAccountSearchTerm] = useState("");

  const [showAddLabor, setShowAddLabor] = useState(false);
  const [laborAddTab, setLaborAddTab] = useState("Employee");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");

  const [showAddNonLabor, setShowAddNonLabor] = useState(false);
  const [nonLaborAddTab, setNonLaborAddTab] = useState("Vendor");
  const [showAddRevenue, setShowAddRevenue] = useState(false);
  const [showImportActuals, setShowImportActuals] = useState(false);
  const [importActualsLabor, setImportActualsLabor] = useState(true);
  const [importActualsNonLabor, setImportActualsNonLabor] = useState(true);
  const [importActualsRevenue, setImportActualsRevenue] = useState(false);
  const [revenueAddTab, setRevenueAddTab] = useState("Project");

  const [selectedVendors, setSelectedVendors] = useState([]);
  const [vendorSearchTerm, setVendorSearchTerm] = useState("");
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [selectedProjects, setSelectedProjects] = useState([]);

  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(1);
  const selectedVersionObj = versions.find((v) => v.id === selectedVersion);
  const isApproved = selectedVersionObj?.status?.toUpperCase() === "APPROVED";

  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(() => new Set());
  // const [expandedIS, setExpandedIS] = useState(
  //   () =>
  //     new Set(["REV", "DL", "ODC", "INDIRECT", ...WATERFALL_SEQUENCE, "OTHER"]),
  // );
  const [expandedIS, setExpandedIS] = useState(() => new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRateTab, setActiveRateTab] = useState("");
  useEffect(() => {
    if (
      WATERFALL_SEQUENCE.length &&
      !WATERFALL_SEQUENCE.includes(activeRateTab)
    ) {
      setActiveRateTab(WATERFALL_SEQUENCE[0]);
    }
  }, [WATERFALL_SEQUENCE, activeRateTab]);
  const [showMonthlySummary, setShowMonthlySummary] = useState(false);
  const [showMonthlyNonLaborSummary, setShowMonthlyNonLaborSummary] =
    useState(false);
  const [hideZeros, setHideZeros] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // const [perfSelectedProjects, setPerfSelectedProjects] = useState([]);
  // const [isPerfDropdownOpen, setIsPerfDropdownOpen] = useState(false);
  const [perfSelectedProjects, setPerfSelectedProjects] = useState([]);
  const [isPerfDropdownOpen, setIsPerfDropdownOpen] = useState(false);
  const [perfSearchTerm, setPerfSearchTerm] = useState("");
  const [expandedPerfPools, setExpandedPerfPools] = useState(() => new Set());
  const [expandedRateAccounts, setExpandedRateAccounts] = useState(
    () => new Set(),
  );
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const TABS = [
    "Dashboard",
    "PBR Structure",
    "Project Performance",
    "Rates Trend",
    "Labor",
    "Non-Labor",
    "Labor Summary",
    "Non-Labor Summary",
    "Revenue",
    "Income Statement",
    "PBR Income Statement",
    "Mapping & Maintenance",
  ];

  const RATE_TABS = Object.keys(POOL_TYPES_MAPPING);

  useEffect(() => {
    setSelectedRowUids([]);
    setSortConfig({ key: null, direction: "asc" });
    setExpandedRateAccounts(new Set());
  }, [activeTab, activeRateTab]);

  const isVisibleAccount = useCallback(
    (coaItem) => {
      if (!coaItem) return false;
      // Labor and Non-Labor account restrictions intentionally disabled:
      // all COA accounts are available for selection in both tabs.
      if (activeTab === "Revenue") return Boolean(coaItem.isRevenueAcc);
      return true;
    },
    [activeTab],
  );

  const normalizeOrgId = useCallback(
    (value) =>
      String(value ?? "")
        .trim()
        .toUpperCase(),
    [],
  );

  const orgNameMap = useMemo(() => {
    const m = {};
    orgs.forEach((o) => {
      const id = normalizeOrgId(o?.orgId ?? o?.organizationId ?? o?.orgCode);
      const name = o?.orgName ?? o?.organizationName ?? o?.name ?? "";
      if (id) m[id] = String(name).trim();
    });
    return m;
  }, [orgs, normalizeOrgId]);

  // =========================================================================
  // FILTERING LOGIC FOR ROWS
  // =========================================================================
  // const filteredLaborData = useMemo(() => {
  //   return laborData.filter((row) => {
  //     return Object.entries(columnFilters).every(([key, val]) => {
  //       if (!val) return true;
  //       return safeString(row[key]).toLowerCase().includes(val.toLowerCase());
  //     });
  //   });
  // }, [laborData, columnFilters]);

  // const filteredNonLaborData = useMemo(() => {
  //   return nonLaborData.filter((row) => {
  //     return Object.entries(columnFilters).every(([key, val]) => {
  //       if (!val) return true;
  //       return safeString(row[key]).toLowerCase().includes(val.toLowerCase());
  //     });
  //   });
  // }, [nonLaborData, columnFilters]);

  // const filteredRevenueData = useMemo(() => {
  //   return revenueData.filter((row) => {
  //     return Object.entries(columnFilters).every(([key, val]) => {
  //       if (!val) return true;
  //       return safeString(row[key]).toLowerCase().includes(val.toLowerCase());
  //     });
  //   });
  // }, [revenueData, columnFilters]);

  const sortRows = useCallback(
    (rows) => {
      if (!sortConfig.key) return rows;
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      return [...rows].sort((a, b) => {
        const av = a?.[sortConfig.key];
        const bv = b?.[sortConfig.key];
        const an = Number(av);
        const bn = Number(bv);
        const bothNumeric =
          av !== "" && bv !== "" && !Number.isNaN(an) && !Number.isNaN(bn);
        if (bothNumeric) return (an - bn) * direction;
        return (
          safeString(av).localeCompare(safeString(bv), undefined, {
            numeric: true,
            sensitivity: "base",
          }) * direction
        );
      });
    },
    [sortConfig],
  );

  const filteredLaborData = useMemo(() => {
    const filtered = laborData.filter((row) =>
      Object.entries(laborColumnFilters).every(([key, val]) => {
        if (!val) return true;
        return safeString(row[key]).toLowerCase().includes(val.toLowerCase());
      }),
    );
    return sortRows(filtered);
  }, [laborData, laborColumnFilters, sortRows]);

  const filteredNonLaborData = useMemo(() => {
    const filtered = nonLaborData.filter((row) =>
      Object.entries(nonLaborColumnFilters).every(([key, val]) => {
        if (!val) return true;
        return safeString(row[key]).toLowerCase().includes(val.toLowerCase());
      }),
    );
    return sortRows(filtered);
  }, [nonLaborData, nonLaborColumnFilters, sortRows]);

  const filteredRevenueData = useMemo(() => {
    return revenueData.filter((row) =>
      Object.entries(revenueColumnFilters).every(([key, val]) => {
        if (!val) return true;
        return safeString(row[key]).toLowerCase().includes(val.toLowerCase());
      }),
    );
  }, [revenueData, revenueColumnFilters]);

  // =========================================================================
  // PAGINATION LOGIC
  // =========================================================================
  const getActiveDataCount = useCallback(() => {
    if (activeTab === "Labor") return filteredLaborData.length;
    if (activeTab === "Non-Labor") return filteredNonLaborData.length;
    if (activeTab === "Revenue") return filteredRevenueData.length;
    if (activeTab === "Non-Labor Summary") return filteredNonLaborData.length;
    if (activeTab === "Mapping & Maintenance")
      return mappingActiveTab === "Account Mapping" ? mappingData.length : 1;
    if (activeTab === "Project Performance") return 1;
    if (activeTab === "Income Statement") return 1;
    if (activeTab === "PBR Income Statement") return 1;
    return 0;
  }, [
    activeTab,
    mappingActiveTab,
    filteredLaborData.length,
    filteredNonLaborData.length,
    filteredRevenueData.length,
    mappingData.length,
  ]);

  const totalRowsCount = getActiveDataCount();
  const currentTotalPages = Math.max(
    1,
    Math.ceil(totalRowsCount / rowsPerPage),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, columnFilters]);
  useEffect(() => {
    if (currentPage > currentTotalPages) setCurrentPage(1);
  }, [currentTotalPages, currentPage]);

  const paginatedLaborData = useMemo(
    () =>
      filteredLaborData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
      ),
    [filteredLaborData, currentPage, rowsPerPage],
  );
  const paginatedNonLaborData = useMemo(
    () =>
      filteredNonLaborData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
      ),
    [filteredNonLaborData, currentPage, rowsPerPage],
  );
  const paginatedRevenueData = useMemo(
    () =>
      filteredRevenueData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
      ),
    [filteredRevenueData, currentPage, rowsPerPage],
  );
  const paginatedMappingData = useMemo(
    () =>
      mappingData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
      ),
    [mappingData, currentPage, rowsPerPage],
  );

  const getActiveGridData = () => {
    if (activeTab === "Labor") return paginatedLaborData;
    if (activeTab === "Non-Labor") return paginatedNonLaborData;
    if (activeTab === "Revenue") return paginatedRevenueData;
    return [];
  };

  const getActiveFilteredData = () => {
    if (activeTab === "Labor") return filteredLaborData;
    if (activeTab === "Non-Labor") return filteredNonLaborData;
    if (activeTab === "Revenue") return filteredRevenueData;
    return [];
  };

  // =========================================================================
  // PREPARE SELECT-ALL LISTS GLOBALLY TO PREVENT REFERENCE ERRORS
  // =========================================================================
  const filteredEmployees = useMemo(() => {
    return (
      employees?.filter(
        (emp) =>
          // emp?.status === "ACT" &&
          emp?.emplId
            ?.toLowerCase()
            .includes(employeeSearchTerm.toLowerCase()) ||
          emp?.firstName
            ?.toLowerCase()
            .includes(employeeSearchTerm.toLowerCase()),
      ) || []
    );
  }, [employees, employeeSearchTerm]);

  const isAllEmpSelected =
    filteredEmployees.length > 0 &&
    filteredEmployees.every((e) => selectedEmployees.includes(e.emplId));

  const filteredAccounts = useMemo(() => {
    return (
      orgAccounts?.filter((acc) => {
        const coa = coaMap[acc?.acctId];
        if (!coa || !isVisibleAccount(coa)) return false;
        return (
          acc?.acctId
            ?.toLowerCase()
            .includes(accountSearchTerm.toLowerCase()) ||
          coa.name?.toLowerCase().includes(accountSearchTerm.toLowerCase())
        );
      }) || []
    );
  }, [orgAccounts, coaMap, accountSearchTerm, isVisibleAccount]);

  const isAllAccSelected =
    filteredAccounts.length > 0 &&
    filteredAccounts.every((a) => selectedOrgAccounts.includes(a.acctId));

  // const filteredVendors = useMemo(() => {
  //   return (
  //     vendors?.filter(
  //       (v) =>
  //         String(v?.vendEmplStatus || "").toUpperCase() === "A" &&
  //         glVendorIds.has(String(v?.vendId)) &&
  //         (safeString(v?.vendId)
  //           .toLowerCase()
  //           .includes(vendorSearchTerm.toLowerCase()) ||
  //           safeString(v?.vendEmplName)
  //             .toLowerCase()
  //             .includes(vendorSearchTerm.toLowerCase())),
  //     ) || []
  //   );
  // }, [vendors, glVendorIds, vendorSearchTerm]);
  // const filteredVendors = useMemo(() => {
  //   const uniqueVendorsMap = new Map();

  //   glRawData.forEach((row) => {
  //     if (row.sIdType === "V" && row.id) {
  //       const strId = String(row.id);
  const filteredVendors = useMemo(() => {
    const uniqueVendorsMap = new Map();

    // glRawData.forEach((row) => {
    //   if (
    //     row.sIdType === "V" &&
    //     row.id &&
    //     row.projId &&
    //     String(row.projId).trim() !== ""
    //   ) {
    //   glRawData.forEach((row) => {
    // if (
    //   (row.sIdType === "V" || row.sIdType === "N") &&
    //   row.id
    // ) {
    //       const strId = String(row.id);
    glRawData.forEach((row) => {
      if (
        String(row.sIdType ?? "")
          .trim()
          .toUpperCase() !== "E" &&
        row.id
      ) {
        const strId = String(row.id);
        if (!uniqueVendorsMap.has(strId)) {
          uniqueVendorsMap.set(strId, {
            vendId: strId,
            vendName: row.name || "Unknown Vendor",
          });
        }
      }
    });

    const uniqueVendors = Array.from(uniqueVendorsMap.values());
    const term = vendorSearchTerm.toLowerCase();

    return uniqueVendors.filter(
      (v) =>
        safeString(v.vendId).toLowerCase().includes(term) ||
        safeString(v.vendName).toLowerCase().includes(term),
    );
  }, [glRawData, vendorSearchTerm]);

  const isAllVenSelected =
    filteredVendors.length > 0 &&
    filteredVendors.every((v) => selectedVendors.includes(v.vendId));

  const filteredSearchedProjects = useMemo(
    () => searchedProjects || [],
    [searchedProjects],
  );
  const isAllProjSelected =
    filteredSearchedProjects.length > 0 &&
    filteredSearchedProjects.every((p) =>
      selectedProjects.includes(p.projectId),
    );

  // =========================================================================
  // HIGH-PERFORMANCE HASH MAP
  // =========================================================================
  const lnlTotalsMap = useMemo(() => {
    const map = {};
    const processRow = (r) => {
      if (!r.orgId || !r.acctId) return;
      const key = `${r.orgId}_${r.acctId}`;
      if (!map[key]) {
        map[key] = { total: 0 };
        months.forEach((m) => (map[key][`${m}Amount`] = 0));
      }
      map[key].total += Number(r.totalAmount || 0);
      months.forEach((m) => {
        map[key][`${m}Amount`] += Number(r[`${m}Amount`] || 0);
      });
    };
    laborData.forEach(processRow);
    nonLaborData.forEach(processRow);
    // revenueData.forEach(processRow);
    return map;
    // }, [laborData, nonLaborData, revenueData]);
    // }, [laborData, nonLaborData, revenueData, mappingData]);
  }, [laborData, nonLaborData, mappingData]);

  // =========================================================================
  // THE WATERFALL ENGINE (SEQUENTIAL CALCULATION)
  // =========================================================================
  const waterfallEngine = useMemo(() => {
    const ledger = {};
    Object.keys(lnlTotalsMap).forEach((k) => {
      ledger[k] = { ...lnlTotalsMap[k] };
    });

    const results = {};
    const previousPoolAllocations = {};

    // // Original cost entering the PBR model from Labor + Non-Labor.
    // // Wrap Rate = (Original Cost + cumulative indirect burden) / Original Cost.
    // const sourceCostMonths = {};
    // months.forEach((m) => {
    // sourceCostMonths[`${m}Amount`] =
    // laborData.reduce(
    // (sum, row) => sum + Number(row[`${m}Amount`] || 0),
    // 0,
    // ) +
    // nonLaborData.reduce(
    // (sum, row) => sum + Number(row[`${m}Amount`] || 0),
    // 0,
    // );
    // });
    // const sourceCostTotal = months.reduce(
    // (sum, m) => sum + Number(sourceCostMonths[`${m}Amount`] || 0),
    // 0,
    // );
    // const cumulativeIndirectMonths = {};
    // months.forEach((m) => (cumulativeIndirectMonths[`${m}Amount`] = 0));
    // let cumulativeIndirectTotal = 0;
    //

    const lastPoolName = [...WATERFALL_SEQUENCE]
      .reverse()
      .find((p) => hrDataMap[p]);
    WATERFALL_SEQUENCE.forEach((poolName) => {
      const hrD = hrDataMap[poolName];
      if (!hrD) return;

      const costAccounts = hrD.poolOrgCostFinancialDetail || [];
      const baseAccounts = hrD.poolOrgBaseFinancialDetail || [];

      let totalCost = 0;
      let totalBase = 0;
      let totalCostAllocation = 0;
      let totalBaseAllocation = 0;
      const costMonths = {};
      const baseMonths = {};
      months.forEach((m) => {
        costMonths[`${m}Amount`] = 0;
        baseMonths[`${m}Amount`] = 0;
      });

      const evaluatedCosts = costAccounts.map((acc) => {
        // const key = `${acc.orgId}_${acc.acctId}`;
        // const t = ledger[key]?.total || 0;
        // totalCost += t;
        // const mData = {};
        // months.forEach((m) => {
        //   const mAmt = ledger[key]?.[`${m}Amount`] || 0;
        //   mData[`${m}Amount`] = mAmt;
        //   costMonths[`${m}Amount`] += mAmt;
        // });
        const key = `${acc.orgId}_${acc.acctId}`;

        const hasPreviousAllocation = Object.prototype.hasOwnProperty.call(
          previousPoolAllocations,
          key,
        );

        const t = hasPreviousAllocation
          ? previousPoolAllocations[key].total
          : ledger[key]?.total || 0;

        totalCost += t;

        const ytdAllocation = hasPreviousAllocation
          ? previousPoolAllocations[key].total
          : 0;
        totalCostAllocation += ytdAllocation;

        const mData = {};

        months.forEach((m) => {
          const mAmt = hasPreviousAllocation
            ? previousPoolAllocations[key][`${m}Amount`]
            : ledger[key]?.[`${m}Amount`] || 0;

          mData[`${m}Amount`] = mAmt;
          costMonths[`${m}Amount`] += mAmt;
        });

        return {
          ...acc,
          total: t,
          ytdAllocation,
          ...mData,
          accountName: coaMap[acc.acctId]?.name || acc.accountName,
        };
      });

      // const evaluatedBases = baseAccounts.map((acc) => {
      //   const key = `${acc.orgId}_${acc.acctId}`;
      //   const t = ledger[key]?.total || 0;
      //   totalBase += t;
      //   const ytdAllocation = t - (lnlTotalsMap[key]?.total || 0);
      //   totalBaseAllocation += ytdAllocation;
      //   const mData = {};
      //   months.forEach((m) => {
      //     const mAmt = ledger[key]?.[`${m}Amount`] || 0;
      //     mData[`${m}Amount`] = mAmt;
      //     baseMonths[`${m}Amount`] += mAmt;
      //   });
      //   return {
      //     ...acc,
      //     total: t,
      //     ytdAllocation,
      //     ...mData,
      //     accountName: coaMap[acc.acctId]?.name || acc.accountName,
      //   };
      // });
      const isLastPool = poolName === lastPoolName;
      const baseSource = isLastPool ? lnlTotalsMap : ledger;

      const evaluatedBases = baseAccounts.map((acc) => {
        const key = `${acc.orgId}_${acc.acctId}`;
        const t = baseSource[key]?.total || 0;
        totalBase += t;
        const ytdAllocation = isLastPool
          ? 0
          : t - (lnlTotalsMap[key]?.total || 0);
        totalBaseAllocation += ytdAllocation;
        const mData = {};
        months.forEach((m) => {
          const mAmt = baseSource[key]?.[`${m}Amount`] || 0;
          mData[`${m}Amount`] = mAmt;
          baseMonths[`${m}Amount`] += mAmt;
        });

        return {
          ...acc,
          total: t,
          ytdAllocation,
          ...mData,
          accountName: coaMap[acc.acctId]?.name || acc.accountName,
        };
      });

      const rate = totalBase === 0 ? 0 : totalCost / totalBase;
      const rateMonths = {};
      months.forEach((m) => {
        const c = costMonths[`${m}Amount`];
        const b = baseMonths[`${m}Amount`];
        rateMonths[`${m}Rate`] = b === 0 ? 0 : c / b;
      });

      const appliedIndirectMonths = {};
      months.forEach((m) => {
        let applied = 0;
        evaluatedBases.forEach((acc) => {
          applied +=
            Number(acc[`${m}Amount`] || 0) *
            Number(rateMonths[`${m}Rate`] || 0);
        });
        appliedIndirectMonths[`${m}Amount`] = applied;
        // cumulativeIndirectMonths[`${m}Amount`] += applied;
      });
      const appliedIndirectTotal = months.reduce(
        (sum, m) => sum + Number(appliedIndirectMonths[`${m}Amount`] || 0),
        0,
      );
      // cumulativeIndirectTotal += appliedIndirectTotal;

      results[poolName] = {
        evaluatedCosts,
        evaluatedBases,
        totalCost,
        totalBase,
        totalCostAllocation,
        totalBaseAllocation,
        costMonths,
        baseMonths,
        rateMonths,
        rate,
        appliedIndirectMonths,
        appliedIndirectTotal,
      };

      evaluatedBases.forEach((acc) => {
        //         if (acc.allocationAcctId && acc.allocationAcctId !== acc.acctId) {
        //           const targetKey = `${acc.allocationOrgId || acc.orgId}_${acc.allocationAcctId}`;

        //           if (!ledger[targetKey]) {
        //             ledger[targetKey] = { total: 0 };
        //             months.forEach((m) => (ledger[targetKey][`${m}Amount`] = 0));
        //           }

        //           // ledger[targetKey].total += acc.total * rate;
        //           let allocationTotal = 0;

        // months.forEach((m) => {
        //   const allocationAmount =
        //     acc[`${m}Amount`] * rateMonths[`${m}Rate`];
        //     console.log("Monthly Allocation Debug", {
        //   month: m,
        //   account: acc.acctId,
        //   org: acc.orgId,
        //   baseAmount: acc[`${m}Amount`],
        //   monthlyRate: rateMonths[`${m}Rate`],
        //   allocationAmount:
        //     acc[`${m}Amount`] * rateMonths[`${m}Rate`],
        // }
        // );

        //   ledger[targetKey][`${m}Amount`] += allocationAmount;
        //   allocationTotal += allocationAmount;
        // });

        // ledger[targetKey].total += allocationTotal;
        //           if (!previousPoolAllocations[targetKey]) {
        //   previousPoolAllocations[targetKey] = { total: 0 };

        //   months.forEach((m) => {
        //     previousPoolAllocations[targetKey][`${m}Amount`] = 0;
        //   });
        // }

        // previousPoolAllocations[targetKey].total += acc.total * rate;

        //           months.forEach((m) => {
        //             const allocationAmount =
        //     acc[`${m}Amount`] * rateMonths[`${m}Rate`];
        //     const monthIndex = months.indexOf(m);

        // const previousMonths = months.slice(0, monthIndex);

        // const previousYtdCost = previousMonths.reduce(
        //   (sum, pm) => sum + Number(costMonths[`${pm}Amount`] || 0),
        //   0
        // );

        // const previousYtdBase = previousMonths.reduce(
        //   (sum, pm) => sum + Number(baseMonths[`${pm}Amount`] || 0),
        //   0
        // );

        // const previousYtdRate =
        //   previousYtdBase !== 0
        //     ? previousYtdCost / previousYtdBase
        //     : 0;

        // // const allocationAmount =
        //   // Number(acc[`${m}Amount`] || 0) * previousYtdRate;

        //   ledger[targetKey][`${m}Amount`] += allocationAmount;

        //   previousPoolAllocations[targetKey][`${m}Amount`] +=
        //     allocationAmount;

        //             ledger[targetKey][`${m}Amount`] +=
        //               acc[`${m}Amount`] * rateMonths[`${m}Rate`];
        //           });
        //         }
        if (acc.allocationAcctId && acc.allocationAcctId !== acc.acctId) {
          const targetKey = `${acc.allocationOrgId || acc.orgId}_${acc.allocationAcctId}`;

          if (!ledger[targetKey]) {
            ledger[targetKey] = { total: 0 };
            months.forEach((m) => (ledger[targetKey][`${m}Amount`] = 0));
          }
          if (!previousPoolAllocations[targetKey]) {
            previousPoolAllocations[targetKey] = { total: 0 };
            months.forEach(
              (m) => (previousPoolAllocations[targetKey][`${m}Amount`] = 0),
            );
          }

          months.forEach((m) => {
            const allocationAmount =
              Number(acc[`${m}Amount`] || 0) *
              Number(rateMonths[`${m}Rate`] || 0);

            //           console.log("Monthly Allocation Debug", {
            //   month: m,
            //   account: acc.acctId,
            //   org: acc.orgId,
            //   allocationAcctId : acc.allocationAcctId,
            //   baseAmount: acc[`${m}Amount`],
            //   monthlyRate: rateMonths[`${m}Rate`],
            //   allocationAmount:
            //     acc[`${m}Amount`] * rateMonths[`${m}Rate`],
            // }
            // );

            // add ONCE to each
            ledger[targetKey][`${m}Amount`] += allocationAmount;
            ledger[targetKey].total += allocationAmount;

            previousPoolAllocations[targetKey][`${m}Amount`] +=
              allocationAmount;
            previousPoolAllocations[targetKey].total += allocationAmount;
          });
        }
      });
    });

    const tree = WATERFALL_SEQUENCE.map((poolName) => {
      const r = results[poolName];
      if (!r) return null;
      return {
        id: poolName,
        name: poolName,
        level: "Pool",
        amount: Number((r.totalCost + r.totalBase).toFixed(2)),
        rate: r.rate * 100,
        children: [
          {
            id: `${poolName}-Cost`,
            name: "Cost",
            level: "CostBase",
            amount: Number(r.totalCost.toFixed(2)),
            children: r.evaluatedCosts.map((c) => ({
              id: `${c.orgId}_${c.acctId}`,
              name: `${c.orgId} - ${c.acctId} - ${c.accountName}`,
              level: "Account",
              amount: Number(c.total.toFixed(2)),
            })),
          },
          {
            id: `${poolName}-Base`,
            name: "Base",
            level: "CostBase",
            amount: Number(r.totalBase.toFixed(2)),
            children: r.evaluatedBases.map((b) => ({
              id: `${b.orgId}_${b.acctId}`,
              name:
                b.allocationAcctId && b.allocationAcctId !== b.acctId
                  ? `${b.orgId} - ${b.acctId} - ${b.accountName} ➔ Allocates to [${b.allocationAcctId}]`
                  : `${b.orgId} - ${b.acctId} - ${b.accountName}`,
              level: "Account",
              amount: Number(b.total.toFixed(2)),
            })),
          },
        ],
      };
    }).filter(Boolean);

    // const overallWrapRate =
    // sourceCostTotal === 0
    // ? 0
    // : (sourceCostTotal + cumulativeIndirectTotal) / sourceCostTotal;
    //
    // const overallWrapRateMonths = {};
    // months.forEach((m) => {
    // const source = Number(sourceCostMonths[`${m}Amount`] || 0);
    // const loaded =
    // source + Number(cumulativeIndirectMonths[`${m}Amount`] || 0);
    // overallWrapRateMonths[`${m}Rate`] = source === 0 ? 0 : loaded / source;
    // });
    //

    return {
      ledger,
      results,
      tree,
      // sourceCostMonths,
      // sourceCostTotal,
      // cumulativeIndirectMonths,
      // cumulativeIndirectTotal,
      // overallWrapRateMonths,
      // overallWrapRate,
    };
  }, [
    lnlTotalsMap,
    hrDataMap,
    coaMap,
    laborData,
    nonLaborData,
    WATERFALL_SEQUENCE,
  ]);

  // =========================================================================
  // INCOME STATEMENT ENGINE
  // =========================================================================
  const incomeStatementData = useMemo(() => {
    const initMonths = () =>
      Object.fromEntries(months.map((_, i) => [i + 1, 0]));
    const categories = new Map();
    const processRow = (row, isRevenueSection = false) => {
      const group = getReportAccountGroup(row, isRevenueSection);
      if (!group) return;
      if (!categories.has(group)) categories.set(group, new Map());
      const accounts = categories.get(group);
      const acctId = String(row.acctId || "Unmapped").trim();
      if (!accounts.has(acctId)) {
        accounts.set(acctId, {
          id: `${group}-${acctId}`,
          name: `${acctId} - ${row.acctName || `Account ${acctId}`}`,
          monthlyAmts: initMonths(),
          children: [],
        });
      }
      const account = accounts.get(acctId);
      months.forEach((month, index) => {
        account.monthlyAmts[index + 1] += Number(row[`${month}Amount`] || 0);
      });
    };
    laborData.forEach((row) => processRow(row));
    nonLaborData.forEach((row) => processRow(row));
    revenueData.forEach((row) => processRow(row, true));

    const sumMonths = (nodes) => {
      const amounts = initMonths();
      nodes.forEach((node) => {
        for (let i = 1; i <= 12; i++) amounts[i] += node.monthlyAmts[i];
      });
      return amounts;
    };
    const groupNode = (name, id = name) => {
      const children = Array.from(categories.get(name)?.values() || []).sort(
        (a, b) => a.id.localeCompare(b.id),
      );
      return { id, name, monthlyAmts: sumMonths(children), children };
    };
    const revenue = groupNode("Contracts Revenue", "REV");
    const labor = groupNode("Direct Labor", "DL");
    const directChildren = Array.from(REPORT_DIRECT_COST_GROUPS, (name) =>
      groupNode(name),
    );
    const direct = {
      id: "ODC",
      name: "Other Direct Costs",
      monthlyAmts: sumMonths(directChildren),
      children: directChildren,
    };
    const indirectChildren = Array.from(REPORT_INDIRECT_COST_GROUPS, (name) =>
      groupNode(name),
    );
    if (categories.has("Other Expenses"))
      indirectChildren.push(groupNode("Other Expenses", "OTHER"));
    const indirect = {
      id: "INDIRECT",
      name: "Indirect Expenses",
      type: "summary",
      monthlyAmts: sumMonths(indirectChildren),
      children: indirectChildren,
    };
    const interestIncome = groupNode("Interest Income", "INTEREST");
    const otherIncome = groupNode("Other Income", "OTHER_INCOME");
    const grossAmounts = initMonths();
    const netAmounts = initMonths();
    for (let i = 1; i <= 12; i++) {
      grossAmounts[i] =
        revenue.monthlyAmts[i] - labor.monthlyAmts[i] - direct.monthlyAmts[i];
      netAmounts[i] =
        grossAmounts[i] -
        indirect.monthlyAmts[i] +
        interestIncome.monthlyAmts[i] +
        otherIncome.monthlyAmts[i];
    }
    const cleanNode = (node) => ({
      ...node,
      monthlyAmts: Object.fromEntries(
        Object.entries(node.monthlyAmts).map(([key, amount]) => {
          const rounded = Number(amount.toFixed(2));
          return [key, rounded === 0 ? "-" : rounded];
        }),
      ),
      children: (node.children || []).map(cleanNode),
    });
    return [
      revenue,
      labor,
      direct,
      {
        id: "GP",
        name: "Gross Profit / (Loss)",
        type: "summary",
        monthlyAmts: grossAmounts,
      },
      indirect,
      {
        id: "OPEX",
        name: "Total Operating Expenses",
        type: "summary",
        monthlyAmts: { ...indirect.monthlyAmts },
      },
      interestIncome,
      otherIncome,
      {
        id: "NP",
        name: "Net Profit / (Loss)",
        type: "summary",
        monthlyAmts: netAmounts,
      },
    ].map(cleanNode);
  }, [laborData, nonLaborData, revenueData]);

  // =========================================================================
  // PBR INCOME STATEMENT ENGINE
  // Groups accounts directly from the configured PBR Account Group mapping.
  // The display structure matches the Income Statement: section -> account.
  // =========================================================================
  const pbrIncomeStatementData = useMemo(() => {
    const initMonths = () => {
      const values = {};
      for (let i = 1; i <= 12; i++) values[i] = 0;
      return values;
    };

    const groups = {};

    // const ensureGroup = (groupName) => {
    //   const key = String(groupName || "Unmapped").trim() || "Unmapped";

    //   if (!groups[key]) {
    //     groups[key] = {
    //       id: `PBR-${key}`,
    //       name: key,
    //       type: "section",
    //       childrenMap: {},
    //     };
    //   }

    //   return groups[key];
    // };
    const ensureGroup = (groupName) => {
      const rawGroupName = String(groupName || "").trim();

      // EMPLOYEE always belongs to Direct Labor
      // const key =
      //   rawGroupName.toUpperCase() === "EMPLOYEE"
      //     ? "Direct Labor"
      //     : rawGroupName || "Unmapped";
      const key =
        rawGroupName.toUpperCase() === "EMPLOYEE"
          ? "Direct Labor"
          : /other\s*direct|^odc$/i.test(rawGroupName)
            ? "Other Direct Costs"
            : rawGroupName || "Unmapped";

      if (!groups[key]) {
        groups[key] = {
          id: `PBR-${key}`,
          name: key,
          type: "section",
          childrenMap: {},
        };
      }

      return groups[key];
    };

    const processRow = (r) => {
      const accountId = String(r.acctId ?? "").trim() || "Unmapped";
      const mapping = mappingData.find(
        (m) => String(m.acctId ?? "").trim() === accountId,
      );

      // PBR Income Statement is driven by the PBR Account Group configuration.
      const groupName =
        String(mapping?.pbrAcctGrp ?? r.pbrGroup ?? "Unmapped").trim() ||
        "Unmapped";

      // const group = ensureGroup(groupName);
      if (groupName.toLowerCase() === "unmapped") return;
      const group = ensureGroup(groupName);

      if (!group.childrenMap[accountId]) {
        group.childrenMap[accountId] = {
          id: accountId,
          name: r.acctName || `Account ${accountId}`,
          type: "detail",
          monthlyAmts: initMonths(),
        };
      }

      months.forEach((month, index) => {
        group.childrenMap[accountId].monthlyAmts[index + 1] += Number(
          r[`${month}Amount`] || 0,
        );
      });
    };

    laborData.forEach(processRow);
    nonLaborData.forEach(processRow);
    revenueData.forEach(processRow);

    // Follow the configured PBR Account Group order first, then append any
    // mapped groups that are present in the data but not in the configuration list.
    const configuredOrder = Array.isArray(pbrGroups) ? pbrGroups : [];
    const discoveredGroups = Object.keys(groups);
    const orderedNames = [
      ...configuredOrder
        .map((configured) =>
          discoveredGroups.find(
            (name) =>
              String(name).trim().toLowerCase() ===
              String(configured).trim().toLowerCase(),
          ),
        )
        .filter(Boolean),
      ...discoveredGroups.filter(
        (name) =>
          !configuredOrder.some(
            (configured) =>
              String(configured).trim().toLowerCase() === name.toLowerCase(),
          ),
      ),
    ];

    // return orderedNames
    //   .map((groupName) => {
    const sections = orderedNames
      .map((groupName) => {
        const group = groups[groupName];
        const children = Object.values(group.childrenMap || {}).sort((a, b) =>
          String(a.id).localeCompare(String(b.id), undefined, {
            numeric: true,
          }),
        );

        const monthlyAmts = initMonths();
        children.forEach((child) => {
          for (let i = 1; i <= 12; i++) {
            monthlyAmts[i] += Number(child.monthlyAmts[i] || 0);
          }
        });

        return {
          id: group.id,
          name: group.name,
          type: "section",
          monthlyAmts,
          children,
        };
      })
      .filter((group) => group.children.length > 0);

    const isRev = (g) => /revenue/i.test(g.name);
    const np = initMonths();
    sections.forEach((g) => {
      for (let i = 1; i <= 12; i++)
        np[i] += (isRev(g) ? 1 : -1) * g.monthlyAmts[i];
    });
    return [
      ...sections,
      {
        id: "PBR-NP",
        name: "Net Profit / (Loss)",
        type: "summary",
        monthlyAmts: np,
        children: [],
      },
    ];
  }, [laborData, nonLaborData, revenueData, mappingData, pbrGroups]);

  const pbrTreeData = useMemo(
    () =>
      waterfallEngine.tree
        .filter((pool) => isPbrStructurePoolVisible(pool.name))
        .map((pool) => ({
          ...pool,
          children: pool.children.map((section) => ({
            ...section,
            children: groupPbrStructureAccounts(
              section.name === "Cost"
                ? waterfallEngine.results[pool.id]?.evaluatedCosts || []
                : waterfallEngine.results[pool.id]?.evaluatedBases || [],
              pool.id,
              section.name,
              orgNameMap,
            ),
          })),
        })),
    [waterfallEngine, orgNameMap],
  );

  // =========================================================================
  // PROJECT PERFORMANCE ENGINE
  // =========================================================================
  const performanceData = useMemo(() => {
    const matrix = {
      "Contract Revenue": { total: Array(12).fill(0), projects: {} },
      "Direct Labor": { total: Array(12).fill(0), projects: {} },
      "Direct Cost (ODC)": { total: Array(12).fill(0), projects: {} },
      "Total Direct Costs": { total: Array(12).fill(0), projects: {} },
      "Gross Profit": { total: Array(12).fill(0), projects: {} },
      "Indirect Burdens": { total: Array(12).fill(0), projects: {} },
      "Other Income": { total: Array(12).fill(0), projects: {} },
      "Net Profit / Fee": { total: Array(12).fill(0), projects: {} },
    };

    const allActiveProjects = new Set();

    const addAmt = (cat, pId, pName, mIdx, amt) => {
      if (amt === 0) return;
      matrix[cat].total[mIdx] += amt;
      if (!matrix[cat].projects[pId]) {
        matrix[cat].projects[pId] = {
          projName: pName,
          values: Array(12).fill(0),
        };
      }
      matrix[cat].projects[pId].values[mIdx] += amt;
      allActiveProjects.add(pId);
    };

    revenueData.forEach((r) => {
      if (!getReportAccountGroup(r, true)) return;
      const pId = getTopLevelProj(r.projId);
      if (
        perfSelectedProjects.length > 0 &&
        !perfSelectedProjects.includes(pId)
      )
        return;
      months.forEach((m, i) =>
        addAmt(
          "Contract Revenue",
          pId,
          r.projName,
          i,
          Number(r[`${m}Amount`] || 0),
        ),
      );
    });

    const processLNL = (r) => {
      const pId = getTopLevelProj(r.projId);
      if (
        perfSelectedProjects.length > 0 &&
        !perfSelectedProjects.includes(pId)
      )
        return;

      const group = getReportAccountGroup(r);
      if (!group) return;
      const category =
        group === "Direct Labor"
          ? "Direct Labor"
          : REPORT_DIRECT_COST_GROUPS.has(group)
            ? "Direct Cost (ODC)"
            : group === "Interest Income" || group === "Other Income"
              ? "Other Income"
              : "Indirect Burdens";
      months.forEach((month, index) => {
        addAmt(
          category,
          pId,
          r.projName,
          index,
          Number(r[`${month}Amount`] || 0),
        );
      });
    };

    laborData.forEach(processLNL);
    nonLaborData.forEach(processLNL);

    for (let i = 0; i < 12; i++) {
      matrix["Total Direct Costs"].total[i] =
        matrix["Direct Labor"].total[i] + matrix["Direct Cost (ODC)"].total[i];
      matrix["Gross Profit"].total[i] =
        matrix["Contract Revenue"].total[i] -
        matrix["Total Direct Costs"].total[i];
      matrix["Net Profit / Fee"].total[i] =
        matrix["Gross Profit"].total[i] -
        matrix["Indirect Burdens"].total[i] +
        matrix["Other Income"].total[i];
    }

    allActiveProjects.forEach((pId) => {
      const pName =
        matrix["Contract Revenue"].projects[pId]?.projName ||
        matrix["Direct Labor"].projects[pId]?.projName ||
        matrix["Direct Cost (ODC)"].projects[pId]?.projName ||
        matrix["Indirect Burdens"].projects[pId]?.projName ||
        matrix["Other Income"].projects[pId]?.projName ||
        "NA";

      for (const cat of [
        "Total Direct Costs",
        "Gross Profit",
        "Net Profit / Fee",
      ]) {
        if (!matrix[cat].projects[pId])
          matrix[cat].projects[pId] = {
            projName: pName,
            values: Array(12).fill(0),
          };
      }

      for (let i = 0; i < 12; i++) {
        const lab = matrix["Direct Labor"].projects[pId]?.values[i] || 0;
        const odc = matrix["Direct Cost (ODC)"].projects[pId]?.values[i] || 0;
        const rev = matrix["Contract Revenue"].projects[pId]?.values[i] || 0;
        const ind = matrix["Indirect Burdens"].projects[pId]?.values[i] || 0;

        const tdc = lab + odc;
        const gp = rev - tdc;
        const income = matrix["Other Income"].projects[pId]?.values[i] || 0;
        const np = gp - ind + income;

        matrix["Total Direct Costs"].projects[pId].values[i] = tdc;
        matrix["Gross Profit"].projects[pId].values[i] = gp;
        matrix["Net Profit / Fee"].projects[pId].values[i] = np;
      }
    });

    const rows = [
      {
        label: "Contract Revenue",
        isBold: false,
        data: matrix["Contract Revenue"],
      },
      { label: "Direct Labor", isBold: false, data: matrix["Direct Labor"] },
      {
        label: "Direct Cost (ODC)",
        isBold: false,
        data: matrix["Direct Cost (ODC)"],
      },
      {
        label: "Total Direct Costs",
        isBold: true,
        data: matrix["Total Direct Costs"],
      },
      { label: "Gross Profit", isBold: true, data: matrix["Gross Profit"] },
      {
        label: "Indirect Burdens",
        isBold: false,
        data: matrix["Indirect Burdens"],
      },
      { label: "Other Income", isBold: false, data: matrix["Other Income"] },
      {
        label: "Net Profit / Fee",
        isBold: true,
        data: matrix["Net Profit / Fee"],
      },
    ];

    rows.forEach((r) => {
      r.annual = Number(
        r.data.total.reduce((sum, val) => sum + val, 0).toFixed(2),
      );
      r.data.total = r.data.total.map((v) => Number(v.toFixed(2)));
      Object.values(r.data.projects).forEach((p) => {
        p.annual = Number(
          p.values.reduce((sum, val) => sum + val, 0).toFixed(2),
        );
        p.values = p.values.map((v) => Number(v.toFixed(2)));
      });
    });

    return rows;
  }, [laborData, nonLaborData, revenueData, perfSelectedProjects]);

  const trendData = waterfallEngine.results[activeRateTab] || {
    evaluatedCosts: [],
    evaluatedBases: [],
    totalCost: 0,
    totalBase: 0,
    totalCostAllocation: 0,
    totalBaseAllocation: 0,
    costMonths: {},
    baseMonths: {},
    rateMonths: {},
  };

  // =========================================================================
  // MAIN FETCH LOGIC
  // =========================================================================
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setConfigurationLoaded(false);
      const configResponse = await axios.get(PBR_CONFIG_API);
      const closingConfig = unwrapApiArray(configResponse.data).find(
        (config) =>
          String(config.name ?? "")
            .trim()
            .toLowerCase() === "closing_period",
      );
      const fetchedClosingPeriod = String(closingConfig?.value ?? "").trim();
      if (!/^\d{4}-(0[1-9]|1[0-2])-\d{2}$/.test(fetchedClosingPeriod)) {
        throw new Error(
          "Missing or invalid closing_period. Records remain locked until configuration is available.",
        );
      }
      setClosingPeriod(fetchedClosingPeriod);
      setConfigurationLoaded(true);

      const safeExtract = (res) => {
        const d = res?.value?.data || res?.data;
        return (
          Array.isArray(d) ? d : d?.results || d?.result || d?.data || []
        ).filter(Boolean);
      };

      let fetchedPools = [];
      try {
        const poolsResponse = await axios.get(POOLS_API);
        fetchedPools = unwrapApiArray(poolsResponse.data)
          .filter((pool) => pool && pool.isActive !== false)
          .map((pool) => ({
            ...pool,
            code: String(pool.code ?? pool.poolCode ?? "").trim(),
            name: String(
              pool.name ?? pool.poolName ?? pool.code ?? pool.poolCode ?? "",
            ).trim(),
            sequence: Number(pool.sequence ?? 0),
            poolNo: pool.poolNo ?? pool.pool_no ?? null,
            yearlyEscalations: Array.isArray(pool.yearlyEscalations)
              ? pool.yearlyEscalations
              : [],
          }))
          .filter((pool) => pool.name && pool.code)
          .filter(isRatesTrendPoolAllowed)
          .sort((a, b) => a.sequence - b.sequence);
        setPoolDefinitions(fetchedPools);
      } catch (poolError) {
        console.error("Failed to load pool definitions:", poolError);
        setPoolDefinitions([]);
        setError("Could not load pool configuration.");
      }

      const [
        mapRes,
        lnlRes,
        empRes,
        labHsRes,
        coaRes,
        vendRes,
        orgsRes,
        projRes,
        glRes,
      ] = await Promise.allSettled([
        axios.get(MAPPING_API),
        axios.get(LNL_DATA_API),
        axios.get(EMP_API),
        axios.get(LAB_HS_API),
        axios.get(COA_API),
        axios.get(VEND_EMP_API),
        axios.get(ORGS_API),
        axios.get(`${backendUrl}/Project/GetAllProjects`),
        axios.get(GL_DATA_API),
      ]);

      let allGlExtracted = [];
      if (glRes.status === "fulfilled") {
        allGlExtracted = safeExtract(glRes);
        setGlRawData(allGlExtracted);
      }

      const hrPromises = fetchedPools.map(async (pool) => {
        const tabName = pool.name;
        const typeCode = pool.code;
        try {
          const res = await axios.get(
            `${backendUrl}/Orgnization/GetHR?fycd=${selectedFY}&type=${typeCode}`,
          );
          return { tabName, data: res.data };
        } catch (err) {
          console.warn("HR fetch failed for", typeCode, err);
          return {
            tabName,
            data: {
              poolOrgCostFinancialDetail: [],
              poolOrgBaseFinancialDetail: [],
            },
          };
        }
      });
      const hrResults = await Promise.all(hrPromises);
      const newHrMap = {};
      hrResults.forEach((r) => (newHrMap[r.tabName] = r.data));
      setHrDataMap(newHrMap);

      let localCoaMap = {};
      if (coaRes.status === "fulfilled") {
        const coaArray = safeExtract(coaRes);
        coaArray.forEach((acc) => {
          if (acc && acc.accountId) {
            const budgetSheet = (acc.budgetSheet || "").toLowerCase();
            const accType = (acc.accountType || "").toUpperCase();
            const isRev = budgetSheet.includes("revenue");

            localCoaMap[acc.accountId] = {
              name: acc.accountName || "",
              pbrGroup: acc.budgetSheet || "",
              expensesType: acc.budgetSheet || "",
              accountType: accType,
              isLaborAcc:
                accType === "LABOR" || budgetSheet.includes("employee"),
              isRevenueAcc: isRev,
            };
          }
        });
        setCoaMap(localCoaMap);
      }

      let localMappingData = [];
      if (mapRes.status === "fulfilled") {
        localMappingData = safeExtract(mapRes);
      } else {
        setError(
          "Could not load account mappings. Please check the account-mapping API.",
        );
      }

      const combinedMapping = Object.keys(localCoaMap).map((acctId) => {
        const existing = localMappingData.find((m) => m.acctId === acctId);
        return {
          acctId: acctId,
          acctName: localCoaMap[acctId].name,
          expensesType: localCoaMap[acctId].expensesType || "",
          pbrAcctGrp: existing?.pbrAcctGrp || "",
          projPef: existing?.projPef || "",
          _isDirty: false,
        };
      });

      localMappingData.forEach((m) => {
        if (!localCoaMap[m.acctId]) {
          combinedMapping.push({
            acctId: m.acctId,
            acctName: m.acctName || "",
            expensesType: m.expensesType || "",
            pbrAcctGrp: m.pbrAcctGrp || "",
            projPef: m.projPef || "",
            _isDirty: false,
          });
        }
      });
      setMappingData(combinedMapping);
      setPbrGroups([
        ...new Set(
          combinedMapping
            .map((item) => String(item.pbrAcctGrp || "").trim())
            .filter(Boolean),
        ),
      ]);
      setPerfOptions([
        ...new Set(
          combinedMapping
            .map((item) => String(item.projPef || "").trim())
            .filter(Boolean),
        ),
      ]);

      const empDataList = safeExtract(empRes);
      setEmployees(empDataList);
      setLabHsRawData(safeExtract(labHsRes));
      const orgList = safeExtract(orgsRes);
      setOrgs(orgList);

      const localOrgNameMap = {};
      orgList.forEach((org) => {
        const id = String(
          org?.orgId ?? org?.organizationId ?? org?.orgCode ?? "",
        )
          .trim()
          .toUpperCase();
        const name = String(
          org?.orgName ?? org?.organizationName ?? org?.name ?? "",
        ).trim();
        if (id) localOrgNameMap[id] = name;
      });

      let rawProjects = safeExtract(projRes);
      const topLevelMap = new Map();
      rawProjects.forEach((p) => {
        if (p && p.projectId) {
          const topId = getTopLevelProj(p.projectId);
          if (!topLevelMap.has(topId)) {
            topLevelMap.set(topId, { ...p, projectId: topId });
          }
        }
      });
      let masterProjList = Array.from(topLevelMap.values());
      const projNameMap = {};
      masterProjList.forEach((p) => {
        projNameMap[p.projectId] = p.name;
      });
      setAllProjects([...masterProjList]);

      if (lnlRes.status !== "fulfilled") {
        throw new Error(
          "Could not reload saved PBR records. Reload before editing or saving.",
        );
      }
      if (lnlRes.status === "fulfilled") {
        const allData = safeExtract(lnlRes);
        console.log(
          "GET counts",
          allData.reduce(
            (a, d) => ({ ...a, [d.pbrType]: (a[d.pbrType] || 0) + 1 }),
            {},
          ),
        );

        const versionMap = new Map();
        allData.forEach((d) => {
          const v = d.version || 0;
          if (!versionMap.has(v)) {
            versionMap.set(v, {
              id: v,
              name: `Version ${v}`,
              status: d.status || "DRAFT",
            });
          }
        });

        let extractedVersions = Array.from(versionMap.values());
        if (extractedVersions.length === 0)
          extractedVersions = [{ id: 1, name: "Version 1", status: "DRAFT" }];

        if (
          selectedVersion &&
          !extractedVersions.find((v) => v.id === selectedVersion)
        ) {
          extractedVersions.push({
            id: selectedVersion,
            name: `Version ${selectedVersion}`,
            status: "DRAFT",
          });
        }

        setVersions(extractedVersions);

        let activeVersion = selectedVersion;
        if (!extractedVersions.find((v) => v.id === activeVersion)) {
          activeVersion = Math.max(...extractedVersions.map((v) => v.id));
          setSelectedVersion(activeVersion);
        }

        // const versionData = allData.filter((d) => d.version === activeVersion);
        const versionData = allData
          .filter((d) => d.version === activeVersion)
          .filter(
            (d) =>
              !Array.isArray(d.monthlyData) ||
              d.monthlyData.length === 0 ||
              d.monthlyData.some(
                (md) => Number(md.fyCd ?? selectedFY) === selectedFY,
              ),
          );
        const vendDataList = safeExtract(vendRes);

        const uniqueProjIds = Array.from(
          new Set(
            versionData.map((d) => getTopLevelProj(d.projId)).filter(Boolean),
          ),
        );

        await Promise.all(
          uniqueProjIds.map(async (pid) => {
            if (!masterProjList.find((p) => p.projectId === pid)) {
              try {
                const res = await axios.get(
                  `${backendUrl}/Project/GetAllProjectsForSearch/${pid}`,
                );
                const fetchedData = Array.isArray(res.data)
                  ? res.data
                  : res.data.results || [res.data];
                const match = fetchedData.find(
                  (p) => p && getTopLevelProj(p.projectId) === pid,
                );
                if (match) {
                  projNameMap[pid] = match.name || "NA";
                  masterProjList.push({ ...match, projectId: pid });
                }
              } catch {
                console.warn("Project fetch map fallback for", pid);
                projNameMap[pid] = "NA";
              }
            }
          }),
        );

        setAllProjects([...masterProjList]);

        const parsedData = combinePbrNonLaborGroups(
          uniquePbrMonthlyIds(versionData),
        )
          .flatMap((group) => splitPbrMonthlyRecords(group, selectedFY))
          .map((dbRow) => {
            const monthlyCols = {};
            let totalHours = 0;
            let totalAmount = 0;

            const isLabor = dbRow.pbrType?.toUpperCase() === "LABOR";
            const isRevenue =
              String(dbRow.pbrType ?? "")
                .trim()
                .toUpperCase() === "REVENUE";
            const rowType = isLabor
              ? "Labor"
              : isRevenue
                ? "Revenue"
                : "Non-Labor";

            months.forEach((m, idx) => {
              const pdNo = idx + 1;
              const monthData = dbRow.monthlyData?.find(
                (md) =>
                  Number(md.pdNo) === pdNo &&
                  Number(md.fyCd ?? selectedFY) === selectedFY,
              ) || { hrs: 0, amt: 0, infRt: 0 };
              monthlyCols[`${m}Hours`] = Number(
                Number(monthData.hrs || 0).toFixed(2),
              );
              monthlyCols[`${m}Amount`] = Number(
                Number(monthData.amt || 0).toFixed(2),
              );
              totalHours += Number(monthData.hrs || 0);
              totalAmount += Number(monthData.amt || 0);
            });

            const empMatch = isLabor
              ? empDataList.find(
                  (e) => String(e.emplId) === String(dbRow.emplRVendId),
                )
              : null;
            // const empStatusRaw = empMatch ? empMatch.status : "";
            // const empStatusDisplay =
            //   empStatusRaw === "ACT"
            //     ? "Active"
            //     : empStatusRaw === "IN"
            //       ? "Inactive"
            //       : empStatusRaw;

            const vendMatch =
              !isLabor && !isRevenue
                ? vendDataList.find(
                    (v) => String(v.vendId) === String(dbRow.emplRVendId),
                  )
                : null;

            const glVendMatch =
              !isLabor && !isRevenue
                ? allGlExtracted.find(
                    (g) =>
                      g.sIdType === "V" &&
                      String(g.id) === String(dbRow.emplRVendId),
                  )
                : null;

            const topId = getTopLevelProj(dbRow.projId);
            const normalizedOrgId = String(dbRow.orgId ?? "")
              .trim()
              .toUpperCase();
            const resolvedOrgName = localOrgNameMap[normalizedOrgId] || "";
            const mappedAccount = combinedMapping.find(
              (m) => String(m.acctId) === String(dbRow.acctId),
            );
            const resolvedPbrGroup =
              dbRow.pbrAcctGrp ||
              mappedAccount?.pbrAcctGrp ||
              localCoaMap[dbRow.acctId]?.pbrGroup ||
              "";

            const savedRow = {
              uid: `ui_${Math.random().toString(36).substring(2, 9)}`,
              // GET IDs belong to monthlyData, not to the grouped parent row.
              id: null,
              _isPersisted: true,
              monthlyRecords: (dbRow.monthlyData || []).map((period) => ({
                ...period,
              })),
              monthlyIds: (dbRow.monthlyData || [])
                .map((period) => period.id)
                .filter((id) => id != null),
              type: rowType,
              projId: topId || "NA",
              projName: projNameMap[topId] || "NA",
              acctId: dbRow.acctId || "",
              acctName: localCoaMap[dbRow.acctId]?.name || "",
              orgId: dbRow.orgId || "",
              orgName: resolvedOrgName,
              pbrGroup: resolvedPbrGroup,
              empId: isLabor ? dbRow.emplRVendId : "",
              empName: empMatch ? empMatch.firstName : "",
              empStatus: isLabor,
              laborCat: dbRow.plcCode || "",
              rate: dbRow.hrlyRt || 0,
              vendorId: !isLabor && !isRevenue ? dbRow.emplRVendId : "",
              vendorName: glVendMatch
                ? glVendMatch.name || "Unknown Vendor"
                : vendMatch
                  ? vendMatch.vendEmplName ||
                    `${vendMatch.firstName || ""} ${vendMatch.lastName || ""}`.trim()
                  : "",
              inflationRate: Number(
                (dbRow.monthlyData || []).find(
                  (period) =>
                    !isPbrPeriodClosed(
                      selectedFY,
                      Number(period.pdNo) - 1,
                      fetchedClosingPeriod,
                    ),
                )?.infRt ??
                  dbRow.monthlyData?.[0]?.infRt ??
                  0,
              ),
              totalHours: Number(totalHours.toFixed(2)),
              totalAmount: Number(totalAmount.toFixed(2)),
              _isDirty: false,
              ...monthlyCols,
            };
            savedRow._savedMetadata = pbrRowMetadata(savedRow);
            savedRow._savedInflationRate = Number(savedRow.inflationRate || 0);
            return savedRow;
          });

        setLaborData(parsedData.filter((d) => d.type === "Labor"));
        setNonLaborData(parsedData.filter((d) => d.type === "Non-Labor"));
        setRevenueData(parsedData.filter((d) => d.type === "Revenue"));
        // Revenue PSR data is loaded only when Import Actuals is requested.
      }
      //   } catch (err) {
      //     console.error("PBR API Error:", err);
      //     setError("Failed to load report sections. Please try again.");
      //   } finally {
      //     setLoading(false);
      //   }
      // }, [selectedVersion]);

      // useEffect(() => {
      //   fetchData();
      // }, [fetchData]);
      return true;
    } catch (err) {
      console.error("PBR API Error:", err);
      setConfigurationLoaded(false);
      setError(
        err.message || "Failed to load report sections. Please try again.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedVersion, selectedFY]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!selectedOrgForAdd) {
      setOrgAccounts([]);
      setSelectedOrgAccounts([]);
      return;
    }
    setFetchingAccounts(true);
    axios
      .get(`${backendUrl}/Orgnization/GetAllOrgAccounts/${selectedOrgForAdd}`)
      .then((res) => {
        setOrgAccounts(res.data || []);
        setSelectedOrgAccounts([]);
      })
      .catch((err) => console.error("Error fetching Org Accounts", err))
      .finally(() => setFetchingAccounts(false));
  }, [selectedOrgForAdd]);

  const laborSummaryData = useMemo(() => {
    const summary = {};
    laborData.forEach((row) => {
      if (!summary[row.empId]) {
        summary[row.empId] = {
          empId: row.empId,
          empName: row.empName,
          totalHours: 0,
          totalAmount: 0,
          monthly: months.reduce(
            (acc, m) => ({ ...acc, [`${m}Hours`]: 0, [`${m}Amount`]: 0 }),
            {},
          ),
        };
      }
      summary[row.empId].totalHours += Number(row.totalHours || 0);
      summary[row.empId].totalAmount += Number(row.totalAmount || 0);
      months.forEach((m) => {
        summary[row.empId].monthly[`${m}Hours`] += Number(
          row[`${m}Hours`] || 0,
        );
        summary[row.empId].monthly[`${m}Amount`] += Number(
          row[`${m}Amount`] || 0,
        );
      });
    });

    return Object.values(summary).map((item) => {
      const cleanedMonthly = {};
      months.forEach((m) => {
        cleanedMonthly[`${m}Hours`] = Number(
          item.monthly[`${m}Hours`].toFixed(2),
        );
        cleanedMonthly[`${m}Amount`] = Number(
          item.monthly[`${m}Amount`].toFixed(2),
        );
      });
      return {
        ...item,
        totalHours: Number(item.totalHours.toFixed(2)),
        totalAmount: Number(item.totalAmount.toFixed(2)),
        monthly: cleanedMonthly,
      };
    });
  }, [laborData]);

  const paginatedLaborSummary = useMemo(
    () =>
      laborSummaryData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
      ),
    [laborSummaryData, currentPage, rowsPerPage],
  );

  // =========================================================================
  // HANDLERS
  // =========================================================================
  const handleSort = (key) => {
    if (activeTab !== "Labor" && activeTab !== "Non-Labor") return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleMouseDownResize = (e, index) => {
    const startX = e.clientX;
    const cols =
      activeTab === "Labor"
        ? laborLeftCols
        : activeTab === "Revenue"
          ? revenueLeftCols
          : nonLaborLeftCols;
    const startWidth = cols[index].w;

    const handleMouseMove = (moveEvent) => {
      const newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
      if (activeTab === "Labor") {
        setLaborLeftCols((prev) =>
          prev.map((c, i) => (i === index ? { ...c, w: newWidth } : c)),
        );
      } else if (activeTab === "Revenue") {
        setRevenueLeftCols((prev) =>
          prev.map((c, i) => (i === index ? { ...c, w: newWidth } : c)),
        );
      } else {
        setNonLaborLeftCols((prev) =>
          prev.map((c, i) => (i === index ? { ...c, w: newWidth } : c)),
        );
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const toggleEmployeeSelection = (emplId) =>
    setSelectedEmployees((prev) =>
      prev.includes(emplId)
        ? prev.filter((id) => id !== emplId)
        : [...prev, emplId],
    );
  const toggleVendorSelection = (vendId) =>
    setSelectedVendors((prev) =>
      prev.includes(vendId)
        ? prev.filter((id) => id !== vendId)
        : [...prev, vendId],
    );
  const toggleProjectSelection = (projId) =>
    setSelectedProjects((prev) =>
      prev.includes(projId)
        ? prev.filter((id) => id !== projId)
        : [...prev, projId],
    );
  const toggleOrgAccount = (acctId) =>
    setSelectedOrgAccounts((prev) =>
      prev.includes(acctId)
        ? prev.filter((id) => id !== acctId)
        : [...prev, acctId],
    );

  // const handleBulkDelete = async () => {
  //   if (isApproved) return;
  //   if (!window.confirm(`Are you sure you want to completely delete these ${selectedRowUids.length} rows?`)) return;

  //   const dataToFilter = activeTab === "Labor" ? laborData : activeTab === "Revenue" ? revenueData : nonLaborData;
  //   const rowsToDelete = dataToFilter.filter(r => selectedRowUids.includes(r.uid));

  //   if (activeTab === "Labor") {
  //       setLaborData(prev => prev.filter(r => !selectedRowUids.includes(r.uid)));
  //   } else if (activeTab === "Revenue") {
  //       setRevenueData(prev => prev.filter(r => !selectedRowUids.includes(r.uid)));
  //   } else {
  //       setNonLaborData(prev => prev.filter(r => !selectedRowUids.includes(r.uid)));
  //   }

  //   showToast(`Successfully deleted ${selectedRowUids.length} rows.`, "success");
  //   setSelectedRowUids([]);

  //   const deletePromises = [];
  //   rowsToDelete.forEach(row => {
  //       if (row.id != null && !String(row.id).startsWith("temp_") && row.id !== 0) {
  //           deletePromises.push(axios.delete(`${backendUrl}/api/PbrLaborNonLabor/${row.id}`));
  //       }
  //       if (row.monthlyIds && row.monthlyIds.length > 0) {
  //           row.monthlyIds.forEach(childId => {
  //               if (childId && childId !== 0) {
  //                   deletePromises.push(axios.delete(`${backendUrl}/api/PbrLaborNonLabor/${childId}`));
  //               }
  //           });
  //       }
  //   });

  //   if (deletePromises.length > 0) {
  //       Promise.allSettled(deletePromises).catch(err => console.error("Background API Delete Error:", err));
  //   }
  // };

  const handleBulkDelete = async () => {
    if (isApproved || selectedRowUids.length === 0) return;
    const selectedData =
      activeTab === "Labor"
        ? laborData
        : activeTab === "Revenue"
          ? revenueData
          : nonLaborData;
    if (
      selectedData.some(
        (row) =>
          selectedRowUids.includes(row.uid) && hasClosedSavedPeriods(row),
      )
    ) {
      showToast(
        "Rows containing closed-period records cannot be deleted.",
        "error",
      );
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to completely delete these ${selectedRowUids.length} rows?`,
      )
    ) {
      return;
    }

    setIsDeleting(true);

    const dataToFilter =
      activeTab === "Labor"
        ? laborData
        : activeTab === "Revenue"
          ? revenueData
          : nonLaborData;

    const rowsToDelete = dataToFilter.filter((row) =>
      selectedRowUids.includes(row.uid),
    );

    try {
      const idsToDelete = [
        ...new Set(
          rowsToDelete.flatMap((row) => [
            row.id,
            ...(Array.isArray(row.monthlyIds) ? row.monthlyIds : []),
          ]),
        ),
      ].filter(
        (id) =>
          id !== null && id !== undefined && !String(id).startsWith("temp_"),
      );

      console.log("Bulk delete IDs:", idsToDelete);

      if (idsToDelete.length > 0) {
        await axios.delete(`${backendUrl}/api/PbrLaborNonLabor/bulk`, {
          data: idsToDelete,
        });
      }

      if (activeTab === "Labor") {
        setLaborData((prev) =>
          prev.filter((row) => !selectedRowUids.includes(row.uid)),
        );
      } else if (activeTab === "Revenue") {
        setRevenueData((prev) =>
          prev.filter((row) => !selectedRowUids.includes(row.uid)),
        );
      } else {
        setNonLaborData((prev) =>
          prev.filter((row) => !selectedRowUids.includes(row.uid)),
        );
      }

      setSelectedRowUids([]);

      showToast(`Successfully deleted ${rowsToDelete.length} rows.`, "success");

      await fetchData();
    } catch (error) {
      console.error("Bulk Delete Error:", error);

      const apiMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        "Failed to delete selected rows. Please try again.";

      showToast(String(apiMessage), "error");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleBulkAccountApply = (e) => {
    const val = e.target.value;
    if (!val) return;

    const setter =
      activeTab === "Labor"
        ? setLaborData
        : activeTab === "Revenue"
          ? setRevenueData
          : setNonLaborData;
    const acct = coaMap[val];
    const mapped = mappingData.find((m) => m.acctId === val);

    setter((prev) =>
      prev.map((row) => {
        if (selectedRowUids.includes(row.uid)) {
          return {
            ...row,
            acctId: val,
            acctName: acct ? acct.name || "" : "",
            pbrGroup: mapped?.pbrAcctGrp || acct?.pbrGroup || "",
            _isDirty: true,
          };
        }
        return row;
      }),
    );
    e.target.value = "";
    showToast(`Account applied to ${selectedRowUids.length} rows.`, "success");
  };

  const handleDeleteRow = async (targetRow) => {
    if (isApproved) return;
    if (hasClosedSavedPeriods(targetRow)) {
      showToast(
        "Rows containing closed-period records cannot be deleted.",
        "error",
      );
      return;
    }
    if (
      !window.confirm("Are you sure you want to permanently delete this row?")
    )
      return;

    if (activeTab === "Labor") {
      setLaborData((prev) => prev.filter((r) => r.uid !== targetRow.uid));
    } else if (activeTab === "Revenue") {
      setRevenueData((prev) => prev.filter((r) => r.uid !== targetRow.uid));
    } else {
      setNonLaborData((prev) => prev.filter((r) => r.uid !== targetRow.uid));
    }
    setSelectedRowUids((prev) => prev.filter((id) => id !== targetRow.uid));
    showToast("Row deleted successfully.", "success");

    const deletePromises = [];
    if (
      targetRow.id != null &&
      !String(targetRow.id).startsWith("temp_") &&
      targetRow.id !== 0
    ) {
      deletePromises.push(
        axios.delete(`${backendUrl}/api/PbrLaborNonLabor/${targetRow.id}`),
      );
    }

    if (targetRow.monthlyIds && targetRow.monthlyIds.length > 0) {
      targetRow.monthlyIds.forEach((childId) => {
        if (childId && childId !== 0) {
          deletePromises.push(
            axios.delete(`${backendUrl}/api/PbrLaborNonLabor/${childId}`),
          );
        }
      });
    }

    if (deletePromises.length > 0) {
      Promise.allSettled(deletePromises).catch((err) =>
        console.error("Background Delete Error:", err),
      );
    }
  };

  const handleLeftPaneChange = (rowUid, field, value) => {
    if (isApproved || !hasOpenPeriods) return;
    const setter =
      activeTab === "Labor"
        ? setLaborData
        : activeTab === "Revenue"
          ? setRevenueData
          : setNonLaborData;
    setter((prev) =>
      prev.map((row) => {
        if (row.uid !== rowUid) return row;
        if (field === "inflationRate" || field === "rate") {
          if (
            value !== "" &&
            (!Number.isFinite(Number(value)) || Number(value) < 0)
          )
            return row;
          return recalculatePbrInflation(
            row,
            activeTab,
            { [field]: value },
            selectedFY,
            closingPeriod,
          );
        }
        let updated = { ...row, [field]: value, _isDirty: true };

        if (field === "acctId") {
          const acct = coaMap[value];
          const mapped = mappingData.find((m) => m.acctId === value);
          if (acct) {
            updated.acctName = acct.name || "";
            updated.pbrGroup = mapped?.pbrAcctGrp || acct.pbrGroup || "";
          }
        } else if (field === "orgId") {
          updated.orgName = resolveOrgName(value);
        } else if (field === "acctName") {
          const matchedId = Object.keys(coaMap).find(
            (k) => coaMap[k]?.name === value,
          );
          const mapped = mappingData.find((m) => m.acctId === matchedId);
          if (matchedId) {
            updated.acctId = matchedId;
            updated.pbrGroup =
              mapped?.pbrAcctGrp || coaMap[matchedId]?.pbrGroup || "";
          }
        }

        return updated;
      }),
    );
  };

  const handleMappingChange = useCallback((acctId, field, value) => {
    setMappingData((prev) =>
      prev.map((row) =>
        row.acctId === acctId
          ? { ...row, [field]: value, _isDirty: true }
          : row,
      ),
    );
  }, []);

  const handleAddPbrGroup = () => {
    if (newPbrGroup.trim() && !pbrGroups.includes(newPbrGroup.trim())) {
      setPbrGroups([...pbrGroups, newPbrGroup.trim()].sort());
      setNewPbrGroup("");
      showToast("PBR Group added successfully.", "success");
    } else {
      showToast("Group is empty or already exists.", "error");
    }
  };

  const handleDeletePbrGroup = (grp) => {
    if (window.confirm(`Are you sure you want to delete PBR Group "${grp}"?`)) {
      setPbrGroups(pbrGroups.filter((g) => g !== grp));
      showToast("PBR Group deleted.", "success");
    }
  };

  const handleAddPerfOption = () => {
    if (newPerfOption.trim() && !perfOptions.includes(newPerfOption.trim())) {
      setPerfOptions([...perfOptions, newPerfOption.trim()].sort());
      setNewPerfOption("");
      showToast("Performance Option added successfully.", "success");
    } else {
      showToast("Option is empty or already exists.", "error");
    }
  };

  const handleDeletePerfOption = (opt) => {
    if (
      window.confirm(
        `Are you sure you want to delete Performance Option "${opt}"?`,
      )
    ) {
      setPerfOptions(perfOptions.filter((o) => o !== opt));
      showToast("Performance Option deleted.", "success");
    }
  };

  //   const handleAddSelectedEmployees = async (employeeIds) => {
  //     const ids = Array.isArray(employeeIds) ? employeeIds : selectedEmployees;
  //     if (ids.length === 0) return;
  //     setShowAddLabor(false);
  //     setLoading(true);
  //     // try {
  //     //   const allEmpHsData = ids.flatMap((emplId) =>
  //     //     labHsRawData.filter((d) => d.emplId === emplId),
  //     //   );
  //     //   const uniqueProjIds = Array.from(
  //     //     new Set(
  //     //       allEmpHsData.map((r) => getTopLevelProj(r.projId)).filter(Boolean),
  //     //     ),
  //     //   );

  //     try {
  //   // const glResponse = await axios.get(GL_DATA_API, {
  //   //   params: { sIdType: "E" },
  //   // });

  //   // const employeeGlData = unwrapApiArray(glResponse.data).filter(
  //   //   (record) =>
  //   //     record.sIdType === "E" &&
  //   //     ids.includes(String(record.id)) &&
  //   //     record.projId &&
  //   //     !isExcludedActualAccount(record.acctId),
  //   // );
  //   const glResponse = await axios.get(GL_DATA_API, {
  //   params: { sIdType: "E" },
  // });

  // const employeeGlData = unwrapApiArray(glResponse.data).filter(
  //   (record) =>
  //     record.sIdType === "E"
  //     //  &&
  //     // ids.includes(String(record.id)) &&
  //     // record.projId &&
  //     // !isExcludedActualAccount(record.acctId)
  // );

  // const allEmpHsData = employeeGlData;

  // const uniqueProjIds = Array.from(
  //   new Set(
  //     allEmpHsData
  //       .map((r) => getTopLevelProj(r.projId))
  //       .filter(Boolean)
  //   )
  // );

  //   // const allEmpHsData = employeeGlData;

  //   // const uniqueProjIds = Array.from(
  //   //   new Set(
  //   //     allEmpHsData.map((r) => getTopLevelProj(r.projId)).filter(Boolean),
  //   //   ),
  //   // );

  //       const projNameMap = {};
  //       await Promise.all(
  //         uniqueProjIds.map(async (pid) => {
  //           try {
  //             const res = await axios.get(
  //               `${backendUrl}/Project/GetAllProjectsForSearch/${pid}`,
  //             );
  //             const fetchedData = Array.isArray(res.data)
  //               ? res.data
  //               : res.data.results || [res.data];
  //             const match = fetchedData.find(
  //               (p) => p && getTopLevelProj(p.projectId) === pid,
  //             );
  //             if (match) projNameMap[pid] = match.name || "NA";
  //           } catch {
  //             projNameMap[pid] = "NA";
  //           }
  //         }),
  //       );

  //       const uniqueCombos = new Set();
  //       const existingLaborCombos = new Set(
  //         laborData.map(
  //           (r) =>
  //             `${getTopLevelProj(r.projId) || "NA"}_${r.acctId}_${r.orgId}_${r.empId}`,
  //         ),
  //       );
  //       const newRows = [];

  //       ids.forEach((emplId) => {
  //         const emp = employees.find((e) => e?.emplId === emplId);
  //         if (!emp) return;

  //         const empStatusDisplay =
  //           emp.status === "ACT"
  //             ? "Active"
  //             : emp.status === "IN"
  //               ? "Inactive"
  //               : emp.status || "";
  //         // const empHsData = labHsRawData.filter((d) => d?.emplId === emplId);
  //         const empHsData = employeeGlData.filter(
  //   (d) => String(d.id) === String(emplId)
  // );

  //         empHsData.forEach((record) => {
  //           if (isExcludedActualAccount(record.acctId)) return;
  //           const topId = getTopLevelProj(record.projId) || "NA";
  //           const comboKey = `${topId}_${record.acctId}_${record.orgId}_${emplId}`;

  //           if (
  //             !uniqueCombos.has(comboKey) &&
  //             !existingLaborCombos.has(comboKey)
  //           ) {
  //             uniqueCombos.add(comboKey);

  //             // Keep the source account ID. Client-specific legacy account aliases
  //             // should be supplied by backend configuration rather than hardcoded here.
  //             const mappedAcctId = record.acctId;

  //             const acctInfo = coaMap[mappedAcctId] || {};
  //             const mapped = mappingData.find((m) => m.acctId === mappedAcctId);

  //             newRows.push({
  //               uid: `ui_${Math.random().toString(36).substring(2, 9)}`,
  //               id: `temp_${Date.now()}_${comboKey}`,
  //               type: "Labor",
  //               empId: emplId,
  //               empName: emp.firstName || "",
  //               empStatus: empStatusDisplay,
  //               laborCat: emp.plcGlcCode || record.billLabCatCd || "",
  //               projId: topId,
  //               projName: projNameMap[topId] || "NA",
  //               acctId: mappedAcctId || "",
  //               acctName: acctInfo.name || "",
  //               orgId: record.orgId || "",
  //               orgName: orgNameMap[normalizeOrgId(record.orgId)] || "",
  //               pbrGroup: mapped?.pbrAcctGrp || acctInfo.pbrGroup || "",
  //               // rate: emp.perHourRate || 0,
  //               // totalHours: 0,
  //               // totalAmount: 0,
  //               // _isDirty: true,
  //               // ...months.reduce(
  //               //   (acc, m) => ({ ...acc, [`${m}Hours`]: 0, [`${m}Amount`]: 0 }),
  //               //   {},
  //               // ),
  //               rate: emp.perHourRate || 0,
  //               _isDirty: true,
  //               ...(() => {
  //                 const matchingRecords = empHsData.filter(
  //                   (r) =>
  //                     (getTopLevelProj(r.projId) || "NA") === topId &&
  //                     r.acctId === record.acctId &&
  //                     r.orgId === record.orgId,
  //                 );

  //                 let tHrs = 0,
  //                   tAmt = 0;
  //                 const monthlyValues = months.reduce((acc, m, idx) => {
  //                   const pdNo = idx + 1;
  //                   const pdRecords = matchingRecords.filter(
  //                     (r) => r.pdNo === pdNo,
  //                   );

  //                   const hrs = pdRecords.reduce(
  //                     (sum, r) => sum + Number(r.hrs1 || 0),
  //                     0
  //                   );

  //                   const amt = pdRecords.reduce(
  //                     (sum, r) => sum + Number(r.amt1 || 0),
  //                     0
  //                   );

  //                   tHrs += hrs;
  //                   tAmt += amt;
  //                   return {
  //                     ...acc,
  //                     [`${m}Hours`]: Number(hrs.toFixed(2)),
  //                     [`${m}Amount`]: Number(amt.toFixed(2)),
  //                   };
  //                 }, {});

  //                 return {
  //                   totalHours: Number(tHrs.toFixed(2)),
  //                   totalAmount: Number(tAmt.toFixed(2)),
  //                   ...monthlyValues,
  //                 };
  //               })(),
  //             });
  //           }
  //         });
  //       });

  //       if (newRows.length > 0) {
  //         setLaborData((prev) => [...prev, ...newRows]);
  //         showToast("Employees added successfully.", "success");
  //       } else {
  //         showToast(
  //           "Selected employees are already in the table or have no historical data.",
  //           "error",
  //         );
  //       }
  //     } catch (err) {
  //       console.error("Error adding employees:", err);
  //       showToast("Error processing employee selection.", "error");
  //     } finally {
  //       setSelectedEmployees([]);
  //       setEmployeeSearchTerm("");
  //       setLoading(false);
  //     }
  //   };

  // const handleAddSelectedEmployees = async (employeeIds, importAll = false) => {
  //   // Manual "Add Selected" -> restrict to the ticked employees.
  //   // Import Actuals -> importAll = true -> take every employee found in GL.
  //   const selectedIds = Array.isArray(employeeIds) ? employeeIds : selectedEmployees;
  //   if (!importAll && selectedIds.length === 0) {
  //     showToast("Select at least one employee.", "error");
  //     return;
  //   }

  //   setShowAddLabor(false);
  //   setLoading(true);

  //   try {
  //     const normId = (v) => String(v ?? "").trim().toUpperCase();
  //     const allowed = new Set(selectedIds.map(normId));

  //     // 1. GL is the source of truth
  //     const glResponse = await axios.get(GL_DATA_API, {
  //       params: { sIdType: "E" },
  //     });

  //     // const employeeGlData = unwrapApiArray(glResponse.data).filter((r) => {
  //     //   if (r.sIdType !== "E") return false;
  //     //   const key = normId(r.id);
  //     //   if (!key) return false;
  //     //   if (!importAll && !allowed.has(key)) return false;
  //     //   if (isExcludedActualAccount(r.acctId)) return false;
  //     //   // Only filters if the GL row actually carries a fiscal year
  //     //   if (r.fyCd != null && Number(r.fyCd) !== Number(selectedFY)) return false;
  //     //   return true;
  //     // });
  //     const rawGl = unwrapApiArray(glResponse.data);
  // const dbg = { total: rawGl.length };

  // const byType = rawGl.filter((r) => String(r.sIdType ?? "").trim().toUpperCase() === "E");
  // dbg.typeE = byType.length;

  // const byId = byType.filter((r) => normId(r.id));
  // dbg.hasId = byId.length;

  // const bySel = byId.filter((r) => importAll || allowed.has(normId(r.id)));
  // dbg.selected = bySel.length;

  // const byAcct = bySel.filter((r) => !isExcludedActualAccount(r.acctId));
  // dbg.notExcludedAcct = byAcct.length;

  // const employeeGlData = byAcct.filter(
  //   (r) => r.fyCd == null || Number(r.fyCd) === Number(selectedFY),
  // );
  // dbg.fyMatch = employeeGlData.length;

  // console.log("LABOR FUNNEL", dbg);
  // console.log("excluded accts (id: rows):",
  //   Object.entries(
  //     bySel.filter((r) => isExcludedActualAccount(r.acctId))
  //       .reduce((a, r) => ({ ...a, [r.acctId]: (a[r.acctId] || 0) + 1 }), {})
  //   ).sort((a, b) => b[1] - a[1]).slice(0, 25));
  // console.log("fyCd values:", [...new Set(rawGl.map((r) => r.fyCd))]);
  // console.log("keys of an E row:", Object.keys(rawGl.find((r) => r.sIdType === "E") || {}));
  // console.log("E rows with no id (sample):", byType.filter((r) => !normId(r.id)).slice(0, 3));

  // console.log("sIdType values:", [...new Set(rawGl.map((r) => r.sIdType))]);
  // console.log("fyCd values:", [...new Set(rawGl.map((r) => r.fyCd))]);
  // console.log("excluded acct sample:", [...new Set(
  //   bySel.filter((r) => isExcludedActualAccount(r.acctId)).map((r) => r.acctId)
  // )].slice(0, 20));
  // console.log("sample row:", rawGl.find((r) => r.sIdType === "E"));

  //     // 2. Employee master is only used to enrich rows (optional)
  //     const empByNorm = new Map(employees.map((e) => [normId(e?.emplId), e]));

  //     // 3. Project names
  //     const uniqueProjIds = Array.from(
  //       new Set(employeeGlData.map((r) => getTopLevelProj(r.projId)).filter(Boolean)),
  //     );
  //     const projNameMap = {};
  //     await Promise.all(
  //       uniqueProjIds.map(async (pid) => {
  //         if (pid === "NA") return;
  //         try {
  //           const res = await axios.get(
  //             `${backendUrl}/Project/GetAllProjectsForSearch/${pid}`,
  //           );
  //           const fetched = Array.isArray(res.data)
  //             ? res.data
  //             : res.data?.results || [res.data];
  //           const match = fetched.find(
  //             (p) => p && getTopLevelProj(p.projectId) === pid,
  //           );
  //           if (match) projNameMap[pid] = match.name || "";
  //         } catch {
  //           /* fall back to allProjects below */
  //         }
  //       }),
  //     );

  //     // 4. Group GL rows: top-level project + account + org + employee
  //     const existingKeys = new Set(
  //       laborData.map(
  //         (r) =>
  //           `${getTopLevelProj(r.projId) || "NA"}_${r.acctId}_${r.orgId}_${normId(r.empId)}`,
  //       ),
  //     );

  //     const groups = new Map();
  //     employeeGlData.forEach((r) => {
  //       const topId = getTopLevelProj(r.projId) || "NA";
  //       const key = `${topId}_${r.acctId}_${r.orgId}_${normId(r.id)}`;
  //       if (existingKeys.has(key)) return;
  //       if (!groups.has(key)) groups.set(key, { topId, first: r, rows: [] });
  //       groups.get(key).rows.push(r);
  //     });

  //     console.log("GROUPS", {
  //   glRows: employeeGlData.length,
  //   uniqueEmployees: new Set(employeeGlData.map((r) => normId(r.id))).size,
  //   newGroups: groups.size,
  //   skippedAsExisting: employeeGlData.filter((r) =>
  //     existingKeys.has(`${getTopLevelProj(r.projId) || "NA"}_${r.acctId}_${r.orgId}_${normId(r.id)}`)
  //   ).length,
  // });

  //     // 5. Build table rows
  //     const newRows = [];
  //     groups.forEach(({ topId, first, rows }, key) => {
  //       const emp = empByNorm.get(normId(first.id));
  //       const emplId = emp?.emplId ?? String(first.id).trim();
  //       const acctInfo = coaMap[first.acctId] || {};
  //       const mapped = mappingData.find((m) => m.acctId === first.acctId);

  //       let tHrs = 0;
  //       let tAmt = 0;
  //       const monthly = {};
  //       months.forEach((m, idx) => {
  //         const pd = idx + 1;
  //         const pdRows = rows.filter((r) => Number(r.pdNo) === pd);
  //         const hrs = pdRows.reduce((s, r) => s + Number(r.hrs1 || 0), 0);
  //         const amt = pdRows.reduce((s, r) => s + Number(r.amt1 || 0), 0);
  //         tHrs += hrs;
  //         tAmt += amt;
  //         monthly[`${m}Hours`] = Number(hrs.toFixed(2));
  //         monthly[`${m}Amount`] = Number(amt.toFixed(2));
  //       });

  //       newRows.push({
  //         uid: `ui_${Math.random().toString(36).substring(2, 9)}`,
  //         id: `temp_${Date.now()}_${key}`,
  //         type: "Labor",
  //         empId: emplId,
  //         empName: emp?.firstName || first.name || "",
  //         empStatus:
  //           emp?.status === "ACT"
  //             ? "Active"
  //             : emp?.status === "IN"
  //               ? "Inactive"
  //               : emp?.status || "",
  //         laborCat: emp?.plcGlcCode || first.billLabCatCd || "",
  //         projId: topId,
  //         projName:
  //           projNameMap[topId] ||
  //           allProjects.find((p) => p.projectId === topId)?.name ||
  //           "NA",
  //         acctId: first.acctId || "",
  //         acctName: acctInfo.name || "",
  //         orgId: first.orgId || "",
  //         orgName: orgNameMap[normalizeOrgId(first.orgId)] || resolveOrgName(first.orgId),
  //         pbrGroup: mapped?.pbrAcctGrp || acctInfo.pbrGroup || "",
  //         rate: emp?.perHourRate || 0,
  //         _isDirty: true,
  //         totalHours: Number(tHrs.toFixed(2)),
  //         totalAmount: Number(tAmt.toFixed(2)),
  //         ...monthly,
  //       });
  //     });

  //     console.log("Labor import (GL driven)", {
  //       glRowsAfterFilters: employeeGlData.length,
  //       newRows: newRows.length,
  //       withoutEmployeeRecord: newRows.filter((r) => !empByNorm.has(normId(r.empId))).length,
  //     });

  //     if (newRows.length > 0) {
  //       setLaborData((prev) => [...prev, ...newRows]);
  //       showToast(`${newRows.length} labor rows imported from GL.`, "success");
  //     } else {
  //       showToast("No new labor records found in GL data.", "error");
  //     }
  //   } catch (err) {
  //     console.error("Error adding employees:", err);
  //     showToast("Error processing employee selection.", "error");
  //   } finally {
  //     setSelectedEmployees([]);
  //     setEmployeeSearchTerm("");
  //     setLoading(false);
  //   }
  // };
  const handleAddSelectedEmployees = async (
    selectedIds,
    importAll = false,
    providedSource = null,
  ) => {
    if (
      isApproved ||
      !configurationLoaded ||
      savingRecordsRef.current ||
      importingLaborRef.current
    )
      return;
    const ids = Array.isArray(selectedIds) ? selectedIds : selectedEmployees;
    if (!importAll && ids.length === 0) {
      showToast("Select at least one employee.", "error");
      return;
    }
    importingLaborRef.current = true;
    setShowAddLabor(false);
    setLoading(true);
    try {
      const source =
        providedSource || unwrapApiArray((await axios.get(GL_DATA_API)).data);
      const allowed = new Set(
        ids.map((id) =>
          String(id ?? "")
            .trim()
            .toUpperCase(),
        ),
      );
      const selectedSource = importAll
        ? source
        : source.filter((row) =>
            allowed.has(
              String(row.id ?? "")
                .trim()
                .toUpperCase(),
            ),
          );
      const imported = groupPbrActuals(
        selectedSource,
        "Labor",
        selectedFY,
        closingPeriod,
        { coaMap, mappingData, allProjects, orgNameMap },
      );
      if (imported.length === 0) {
        showToast(
          "No eligible labor actuals for the selected fiscal year.",
          "success",
        );
        return;
      }
      const preview = mergePbrActuals(
        laborData,
        imported,
        selectedFY,
        closingPeriod,
      );
      setLaborData(
        (previous) =>
          mergePbrActuals(previous, imported, selectedFY, closingPeriod).rows,
      );
      const skipped = preview.skippedAmbiguousPeriods;
      showToast(
        skipped
          ? `${skipped} period(s) skipped because multiple saved records match. No duplicate rows were inserted.`
          : `Labor actuals reconciled into ${imported.length} unique row(s).`,
        skipped ? "error" : "success",
      );
      return { skippedAmbiguousPeriods: skipped };
    } catch (error) {
      console.error("Labor actuals import failed:", error);
      showToast(error.message || "Failed to import labor actuals.", "error");
      if (importAll) throw error;
    } finally {
      importingLaborRef.current = false;
      setSelectedEmployees([]);
      setEmployeeSearchTerm("");
      if (!importingActualsRef.current) setLoading(false);
    }
  };

  const getRecordOrgId = (r) =>
    String(
      r?.orgId ?? r?.orgID ?? r?.organizationId ?? r?.orgCode ?? r?.org ?? "",
    ).trim();

  const resolveOrgName = (orgId) => {
    const id = normalizeOrgId(orgId);
    if (!id) return "";
    if (orgNameMap[id]) return orgNameMap[id];
    // fallback: GL org may be a shorter or longer variant of the master org ID
    const key = Object.keys(orgNameMap).find(
      (k) => k.startsWith(id) || id.startsWith(k),
    );
    return key ? orgNameMap[key] : "";
  };
  //   const handleAddSelectedVendors = async (vendorIds) => {
  //     const ids = Array.isArray(vendorIds) ? vendorIds : selectedVendors;
  //     if (ids.length === 0) return;
  //     setShowAddNonLabor(false);
  //     setLoading(true);

  //     try {
  //       // const vendorGlData = glRawData.filter(
  //       //   (d) =>
  //       //     d.sIdType === "V" &&
  //       //     ids.includes(String(d.id)) &&
  //       //     d.projId &&
  //       //     String(d.projId).trim() !== "",
  //       // );
  // //       const vendorGlData = glRawData.filter(
  // //   (d) =>
  // //     (d.sIdType === "V" || d.sIdType === "N") &&
  // //     ids.includes(String(d.id)),
  // // );

  // const vendorGlData = glRawData.filter(
  //   (d) => d.sIdType === "V" || d.sIdType === "N",
  // );
  //       const uniqueProjIds = Array.from(
  //         new Set(
  //           vendorGlData.map((r) => getTopLevelProj(r.projId)).filter(Boolean),
  //         ),
  //       );
  //       const projNameMap = {};
  //       await Promise.all(
  //         uniqueProjIds.map(async (pid) => {
  //           try {
  //             const res = await axios.get(
  //               `${backendUrl}/Project/GetAllProjectsForSearch/${pid}`,
  //             );
  //             const fetchedData = Array.isArray(res.data)
  //               ? res.data
  //               : res.data.results || [res.data];
  //             const match = fetchedData.find(
  //               (p) => p && getTopLevelProj(p.projectId) === pid,
  //             );
  //             if (match) projNameMap[pid] = match.name || "NA";
  //           } catch {
  //             projNameMap[pid] = "NA";
  //           }
  //         }),
  //       );

  //       const uniqueCombos = new Set();
  //       const existingVendorCombos = new Set(
  //         nonLaborData.map(
  //           (r) =>
  //             `${getTopLevelProj(r.projId) || "NA"}_${r.acctId}_${r.orgId}_${r.vendorId}`,
  //         ),
  //       );
  //       const newRows = [];

  //       // selectedVendors.forEach((vendId) => {
  //       //   const v = vendors.find(
  //       //     (vend) => String(vend?.vendId) === String(vendId),
  //       //   );
  //       //   if (!v) return;

  //       //   const vGlData = vendorGlData.filter(
  //       //     (d) => String(d.id) === String(vendId),
  //       //   );

  //       //   if (vGlData.length === 0) return;

  //       //   vGlData.forEach((record) => {
  //       //     const mappedAcctId = record.acctId || "";
  //       //     const topId = getTopLevelProj(record.projId) || "NA";
  //       //     const comboKey = `${topId}_${record.acctId}_${record.orgId}_${vendId}`;

  //       //     if (
  //       //       !uniqueCombos.has(comboKey) &&
  //       //       !existingVendorCombos.has(comboKey)
  //       //     ) {
  //       //       uniqueCombos.add(comboKey);

  //       //       const mappedAcctId = record.acctId || "";
  //       //       const acctInfo = coaMap[mappedAcctId] || {};
  //       //       // const mapped = mappingData.find(m => m.acctId === mappedAcctId);

  //       //       newRows.push({
  //       //         uid: `ui_${Math.random().toString(36).substring(2, 9)}`,
  //       //         id: `temp_${Date.now()}_${comboKey}`,
  //       //         type: "Non-Labor",
  //       //         vendorId: vendId,
  //       //         vendorName:
  //       //           v.vendEmplName ||
  //       //           `${v.firstName || ""} ${v.lastName || ""}`.trim(),
  //       // ids.forEach((vendId) => {
  //       //   const vGlData = vendorGlData.filter(
  //       //     (d) => String(d.id) === String(vendId),
  //       //   );

  //       const uniqueIds = [...new Set(vendorGlData.map((d) => String(d.id)))];

  //       uniqueIds.forEach((vendId) => {
  //         const vGlData = vendorGlData.filter(
  //           (d) => String(d.id) === vendId,
  //         );

  //         if (vGlData.length === 0) return;
  //         const vName = vGlData[0].name || "Unknown Vendor";

  //         vGlData.forEach((record) => {
  //           const mappedAcctId = record.acctId || "";
  //           if (isExcludedActualAccount(mappedAcctId)) return;
  //           // ... (keep the topId, comboKey logic exactly as is) ...
  //           // const topId = getTopLevelProj(record.projId) || "NA";
  //           const topId = getTopLevelProj(record.projId) || "NA";
  //           const comboKey = `${topId}_${record.acctId}_${record.orgId}_${vendId}`;

  //           // if (
  //           //   !uniqueCombos.has(comboKey) &&
  //           //   !existingVendorCombos.has(comboKey)
  //           // ) {
  //           //   uniqueCombos.add(comboKey);
  //           //   const acctInfo = coaMap[mappedAcctId] || {};

  //           //   newRows.push({
  //           if (
  //             !uniqueCombos.has(comboKey) &&
  //             !existingVendorCombos.has(comboKey)
  //           ) {
  //             uniqueCombos.add(comboKey);
  //             const acctInfo = coaMap[mappedAcctId] || {};
  //             const mapped = mappingData.find((m) => m.acctId === mappedAcctId);

  //             newRows.push({
  //               uid: `ui_${Math.random().toString(36).substring(2, 9)}`,
  //               id: `temp_${Date.now()}_${comboKey}`,
  //               type: "Non-Labor",
  //               vendorId: vendId,
  //               vendorName: vName,
  //               projId: topId,
  //               projName: projNameMap[topId] || "NA",
  //               acctId: mappedAcctId,
  //               acctName: acctInfo.name || "",
  //               orgId: record.orgId || "",
  //               // pbrGroup: mapped?.pbrAcctGrp || acctInfo.pbrGroup || "",
  //               // inflationRate: 0,
  //               // totalAmount: 0,
  //               // _isDirty: true,
  //               // ...months.reduce((acc, m) => ({ ...acc, [`${m}Amount`]: 0 }), {}),
  //               pbrGroup: mapped?.pbrAcctGrp || acctInfo.pbrGroup || "",
  //               inflationRate: 0,
  //               _isDirty: true,
  //               ...(() => {
  //                 const matchingRecords = vGlData.filter(
  //                   (r) =>
  //                     (getTopLevelProj(r.projId) || "NA") === topId &&
  //                     r.acctId === record.acctId &&
  //                     r.orgId === record.orgId,
  //                 );

  //                 let tAmt = 0;
  //                 const monthlyValues = months.reduce((acc, m, idx) => {
  //                   const pdNo = idx + 1;
  //                   const pdRecords = matchingRecords.filter(
  //                     (r) => r.pdNo === pdNo,
  //                   );

  //                   // Using amt1 from your sample (falling back to actAmt just in case)
  //                   const amt = pdRecords.reduce(
  //                     (sum, r) => sum + Number(r.amt1 || r.actAmt || 0),
  //                     0,
  //                   );

  //                   tAmt += amt;
  //                   return { ...acc, [`${m}Amount`]: Number(amt.toFixed(2)) };
  //                 }, {});

  //                 return {
  //                   totalAmount: Number(tAmt.toFixed(2)),
  //                   ...monthlyValues,
  //                 };
  //               })(),
  //             });
  //           }
  //         });
  //       });

  //       if (newRows.length > 0) {
  //         setNonLaborData((prev) => [...prev, ...newRows]);
  //         showToast("Vendors added successfully.", "success");
  //       } else {
  //         showToast(
  //           "Vendors are already in the table or have no historical data.",
  //           "error",
  //         );
  //       }
  //     } catch (err) {
  //       console.error("Error adding vendors:", err);
  //       showToast("Error processing vendor selection.", "error");
  //     } finally {
  //       setSelectedVendors([]);
  //       setVendorSearchTerm("");
  //       setLoading(false);
  //     }
  //   };

  const handleAddSelectedVendors = async (
    selectedIds,
    importAll = false,
    providedSource = null,
  ) => {
    if (
      isApproved ||
      !configurationLoaded ||
      savingRecordsRef.current ||
      importingNonLaborRef.current
    )
      return;
    const ids = Array.isArray(selectedIds) ? selectedIds : selectedVendors;
    if (!importAll && ids.length === 0) {
      showToast("Select at least one vendor.", "error");
      return;
    }
    importingNonLaborRef.current = true;
    setShowAddNonLabor(false);
    setLoading(true);
    try {
      const source =
        providedSource || unwrapApiArray((await axios.get(GL_DATA_API)).data);
      const allowed = new Set(
        ids.map((id) =>
          String(id ?? "")
            .trim()
            .toUpperCase(),
        ),
      );
      const selectedSource = importAll
        ? source
        : source.filter((row) =>
            allowed.has(
              String(row.id ?? "")
                .trim()
                .toUpperCase(),
            ),
          );
      const imported = groupPbrActuals(
        selectedSource,
        "Non-Labor",
        selectedFY,
        closingPeriod,
        { coaMap, mappingData, allProjects, orgNameMap },
      );
      if (imported.length === 0) {
        showToast(
          "No eligible non-labor actuals for the selected fiscal year.",
          "success",
        );
        return;
      }
      const preview = mergePbrActuals(
        nonLaborData,
        imported,
        selectedFY,
        closingPeriod,
      );
      setNonLaborData(
        (previous) =>
          mergePbrActuals(previous, imported, selectedFY, closingPeriod).rows,
      );
      const skipped = preview.skippedAmbiguousPeriods;
      showToast(
        skipped
          ? `${skipped} period(s) skipped because multiple saved records match. No duplicate rows were inserted.`
          : `Non-Labor actuals reconciled into ${imported.length} unique row(s).`,
        skipped ? "error" : "success",
      );
      return { skippedAmbiguousPeriods: skipped };
    } catch (error) {
      console.error("Non-Labor actuals import failed:", error);
      showToast(
        error.message || "Failed to import non-labor actuals.",
        "error",
      );
      if (importAll) throw error;
    } finally {
      importingNonLaborRef.current = false;
      setSelectedVendors([]);
      setVendorSearchTerm("");
      if (!importingActualsRef.current) setLoading(false);
    }
  };

  const handleImportActuals = async () => {
    if (
      isApproved ||
      !configurationLoaded ||
      savingRecordsRef.current ||
      importingActualsRef.current ||
      importingLaborRef.current ||
      importingNonLaborRef.current
    )
      return;
    if (
      !importActualsLabor &&
      !importActualsNonLabor &&
      !importActualsRevenue
    ) {
      showToast(
        "Select Labor, Non-Labor, Revenue, or any combination before importing actuals.",
        "error",
      );
      return;
    }

    importingActualsRef.current = true;
    setShowImportActuals(false);
    setLoading(true);
    try {
      const source =
        importActualsLabor || importActualsNonLabor
          ? unwrapApiArray((await axios.get(GL_DATA_API)).data)
          : [];
      let skipped = 0;
      if (importActualsLabor)
        skipped +=
          (await handleAddSelectedEmployees([], true, source))
            ?.skippedAmbiguousPeriods || 0;
      if (importActualsNonLabor)
        skipped +=
          (await handleAddSelectedVendors([], true, source))
            ?.skippedAmbiguousPeriods || 0;

      if (importActualsRevenue) {
        const response = await axios.get(PSR_DATA_API, {
          params: {
            rate_type: "T",
            subTotTypeNumber: 1,
          },
        });

        const importedRevenue = normalizePsrRevenueRows(
          response.data,
          "",
          selectedFY,
        )
          // .filter((row) => !isExcludedActualAccount(row.acctId))
          .map((row) => {
            const account = coaMap[row.acctId];
            const proj = allProjects.find((p) => p.projectId === row.projId);
            const mapped = mappingData.find((m) => m.acctId === row.acctId);

            return {
              ...row,
              projName: proj?.name || row.projName,
              acctName: account?.name || row.acctName,
              orgName:
                orgNameMap[normalizeOrgId(row.orgId)] ||
                resolveOrgName(row.orgId) ||
                row.orgName,
              pbrGroup:
                mapped?.pbrAcctGrp || account?.pbrGroup || row.pbrGroup || "",
              _isDirty: true,
            };
          });

        if (importedRevenue.length === 0) {
          throw new Error(
            "No PSR data was returned for the selected fiscal year.",
          );
        }

        setRevenueData((prev) => {
          const keys = new Set(
            prev.map((r) => `${r.projId}|${r.acctId}|${r.orgId}`),
          );

          return [
            ...prev,
            ...importedRevenue.filter(
              (r) => !keys.has(`${r.projId}|${r.acctId}|${r.orgId}`),
            ),
          ];
        });
      }

      if (!skipped)
        showToast(
          "Actuals reconciled without adding duplicate rows.",
          "success",
        );
    } catch (err) {
      console.error("Automated actuals import failed:", err);
      showToast("Failed to import actuals. Please try again.", "error");
    } finally {
      importingActualsRef.current = false;
      setLoading(false);
      setSelectedEmployees([]);
      setSelectedVendors([]);
      setEmployeeSearchTerm("");
      setVendorSearchTerm("");
    }
  };

  const handleSearchProjectsFromApi = async () => {
    if (!projectSearchTerm) return;
    try {
      const res = await axios.get(
        `${backendUrl}/Project/GetAllProjectsForSearch/${projectSearchTerm}`,
      );
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [res.data];

      const topLevelMap = new Map();
      data.filter(Boolean).forEach((p) => {
        const topId = getTopLevelProj(p.projectId);
        if (!topLevelMap.has(topId)) {
          topLevelMap.set(topId, { ...p, projectId: topId });
        }
      });

      const mappedData = Array.from(topLevelMap.values());
      setSearchedProjects(mappedData);
      if (mappedData.length === 0)
        showToast("No projects found matching that search.", "error");
    } catch (err) {
      console.error("Project search failed", err);
      setSearchedProjects([]);
      showToast("Error searching for projects.", "error");
    }
  };

  const handleAddSelectedProjects = (type) => {
    if (selectedProjects.length === 0) return;
    const newRows = selectedProjects.map((pId) => {
      const proj = searchedProjects.find((p) => p?.projectId === pId);
      const comboKey = `PROJ_${pId}_${Date.now()}`;
      return {
        uid: `ui_${Math.random().toString(36).substring(2, 9)}`,
        id: `temp_${comboKey}`,
        type: type,
        vendorId: type === "Non-Labor" ? "TBD" : "",
        vendorName: type === "Non-Labor" ? "TBD" : "",
        projId: pId || "NA",
        projName: proj?.name || "NA",
        acctId: "",
        acctName: "",
        orgId: "",
        pbrGroup: "",
        inflationRate: 0,
        totalAmount: 0,
        _isDirty: true,
        ...months.reduce((acc, m) => ({ ...acc, [`${m}Amount`]: 0 }), {}),
      };
    });

    if (type === "Revenue") {
      setRevenueData((prev) => [...prev, ...newRows]);
      setShowAddRevenue(false);
    } else {
      setNonLaborData((prev) => [...prev, ...newRows]);
      setShowAddNonLabor(false);
    }

    setSelectedProjects([]);
    setProjectSearchTerm("");
    showToast("Projects added successfully.", "success");
  };

  const handleAddOther = (type) => {
    const newRow = {
      uid: `ui_${Math.random().toString(36).substring(2, 9)}`,
      id: `temp_${Date.now()}_OTHER`,
      type: type,
      vendorId: type === "Non-Labor" ? "TBD" : "",
      vendorName: type === "Non-Labor" ? "TBD" : "",
      projId: "NA",
      projName: "NA",
      acctId: "",
      acctName: "",
      orgId: "",
      pbrGroup: "",
      inflationRate: 0,
      totalAmount: 0,
      _isDirty: true,
      ...months.reduce((acc, m) => ({ ...acc, [`${m}Amount`]: 0 }), {}),
    };
    if (type === "Revenue") {
      setRevenueData((prev) => [...prev, newRow]);
      setShowAddRevenue(false);
    } else {
      setNonLaborData((prev) => [...prev, newRow]);
      setShowAddNonLabor(false);
    }
    showToast("Blank row added.", "success");
  };

  const handleAddByAccount = (type) => {
    if (selectedOrgAccounts.length === 0) return;

    const newRows = selectedOrgAccounts.map((acctId) => {
      const acctInfo = coaMap[acctId] || {};
      const mapped = mappingData.find((m) => m.acctId === acctId);
      const comboKey = `TBD_${acctId}_${selectedOrgForAdd}_TBD`;

      const baseRow = {
        uid: `ui_${Math.random().toString(36).substring(2, 9)}`,
        id: `temp_${Date.now()}_${comboKey}_${Math.random()}`,
        projId: "NA",
        projName: "NA",
        acctId: acctId || "",
        acctName: acctInfo.name || "",
        orgId: selectedOrgForAdd || "",
        pbrGroup: mapped?.pbrAcctGrp || acctInfo.pbrGroup || "",
        _isDirty: true,
      };

      if (type === "Labor") {
        return {
          ...baseRow,
          type: "Labor",
          empId: "TBD",
          empName: "TBD",
          laborCat: "NA",
          rate: 0,
          totalHours: 0,
          totalAmount: 0,
          ...months.reduce(
            (acc, m) => ({ ...acc, [`${m}Hours`]: 0, [`${m}Amount`]: 0 }),
            {},
          ),
        };
      } else {
        return {
          ...baseRow,
          type: type,
          vendorId: type === "Non-Labor" ? "TBD" : "",
          vendorName: type === "Non-Labor" ? "TBD" : "",
          inflationRate: 0,
          totalAmount: 0,
          ...months.reduce((acc, m) => ({ ...acc, [`${m}Amount`]: 0 }), {}),
        };
      }
    });

    if (type === "Labor") {
      setLaborData((prev) => [...prev, ...newRows]);
      setShowAddLabor(false);
    } else if (type === "Revenue") {
      setRevenueData((prev) => [...prev, ...newRows]);
      setShowAddRevenue(false);
    } else {
      setNonLaborData((prev) => [...prev, ...newRows]);
      setShowAddNonLabor(false);
    }

    setSelectedOrgForAdd("");
    setOrgAccounts([]);
    setSelectedOrgAccounts([]);
    setOrgSearchTerm("");
    setAccountSearchTerm("");
    showToast("Accounts added successfully.", "success");
  };

  // const handleAmountChange = (rowUid, month, value) => {
  //   const setter = activeTab === "Labor" ? setLaborData : activeTab === "Revenue" ? setRevenueData : setNonLaborData;

  const handleAmountChange = (rowUid, month, value) => {
    if (isApproved || isMonthLocked(month)) return;
    if (value !== "" && !/^\d*\.?\d{0,2}$/.test(value)) return;
    const setter =
      activeTab === "Labor"
        ? setLaborData
        : activeTab === "Revenue"
          ? setRevenueData
          : setNonLaborData;
    setter((prev) =>
      prev.map((row) =>
        row.uid === rowUid
          ? editPbrMonth(
              row,
              month,
              value,
              activeTab,
              selectedFY,
              closingPeriod,
            )
          : row,
      ),
    );
  };

  const handleFillRowForward = (rowUid, startMonth, value) => {
    if (isApproved || !configurationLoaded) return;
    const startIndex = months.indexOf(startMonth);
    if (startIndex < 0) return;
    const setter =
      activeTab === "Labor"
        ? setLaborData
        : activeTab === "Revenue"
          ? setRevenueData
          : setNonLaborData;
    setter((prev) =>
      prev.map((row) => {
        if (row.uid !== rowUid) return row;
        return months
          .slice(startIndex)
          .reduce(
            (updated, month) =>
              editPbrMonth(
                updated,
                month,
                value,
                activeTab,
                selectedFY,
                closingPeriod,
              ),
            row,
          );
      }),
    );
    setHighlightedRow(rowUid);
    setTimeout(() => setHighlightedRow(null), 1200);
  };

  const handleFillColumnDown = (rowUid, month, value) => {
    if (isApproved || isMonthLocked(month)) return;
    const rows =
      activeTab === "Labor"
        ? filteredLaborData
        : activeTab === "Revenue"
          ? filteredRevenueData
          : filteredNonLaborData;
    const index = rows.findIndex((row) => row.uid === rowUid);
    if (index < 0) return;
    const targets = new Set(rows.slice(index).map((row) => row.uid));
    const setter =
      activeTab === "Labor"
        ? setLaborData
        : activeTab === "Revenue"
          ? setRevenueData
          : setNonLaborData;
    setter((prev) =>
      prev.map((row) =>
        targets.has(row.uid)
          ? editPbrMonth(
              row,
              month,
              value,
              activeTab,
              selectedFY,
              closingPeriod,
            )
          : row,
      ),
    );
    setHighlightedRow("column_flash");
    setTimeout(() => setHighlightedRow(null), 1200);
  };

  const handleSaveRecords = async () => {
    if (
      savingRecordsRef.current ||
      importingActualsRef.current ||
      importingLaborRef.current ||
      importingNonLaborRef.current
    )
      return;
    if (!configurationLoaded) {
      showToast(
        "Closing-period configuration is unavailable. Reload before saving.",
        "error",
      );
      return;
    }
    savingRecordsRef.current = true;
    try {
      // const laborSet = new Set();
      // for (let row of laborData) {
      //   if (!row.empId || row.empId === "TBD") continue;
      //   const combo = `${getTopLevelProj(row.projId) || "NA"}_${row.acctId}_${row.orgId}_${row.empId}`;
      //   if (laborSet.has(combo)) {
      //     showToast(
      //       `Duplicate Row Error in Labor: Proj [${row.projId}] | Acct [${row.acctId}] | Org [${row.orgId}] | Emp [${row.empId}]`,
      //       "error",
      //     );
      //     return;
      //   }
      //   laborSet.add(combo);
      // }
      const laborSet = new Set();
      for (let row of laborData) {
        if (!row.empId || row.empId === "TBD") continue;
        const combo = `${getTopLevelProj(row.projId) || "NA"}_${row.acctId}_${row.orgId}_${row.empId}`;

        // if (laborSet.has(combo)) {
        //   showToast(
        //     `Duplicate Row Error in Labor: ...`,
        //     "error",
        //   );
        //   return;
        // }
        laborSet.add(combo);
      }

      const nlSet = new Set();
      for (let row of nonLaborData) {
        if (!row.vendorId || row.vendorId === "TBD") continue;
        const combo = `${getTopLevelProj(row.projId) || "NA"}_${row.acctId}_${row.orgId}_${row.vendorId}`;
        // if (nlSet.has(combo)) {
        //   showToast(
        //     `Duplicate Row Error in Non-Labor: Proj [${row.projId}] | Acct [${row.acctId}] | Org [${row.orgId}] | Vendor [${row.vendorId}]`,
        //     "error",
        //   );
        //   return;
        // }
        nlSet.add(combo);
      }

      setSavingRecords(true);
      const currentVersionStatus =
        versions.find((v) => v.id === selectedVersion)?.status || "DRAFT";

      const requests = [
        buildPbrSaveRequests(
          laborData,
          "LABOR",
          selectedFY,
          selectedVersion,
          currentVersionStatus,
          closingPeriod,
        ),
        buildPbrSaveRequests(
          nonLaborData,
          "NONLABOR",
          selectedFY,
          selectedVersion,
          currentVersionStatus,
          closingPeriod,
        ),
        buildPbrSaveRequests(
          revenueData,
          "REVENUE",
          selectedFY,
          selectedVersion,
          currentVersionStatus,
          closingPeriod,
        ),
      ];
      const uniqueRequests = ensurePbrSaveUniqueness(
        requests,
        [...laborData, ...nonLaborData, ...revenueData],
        selectedFY,
      );
      const recordsToUpdate = uniqueRequests.updates;
      const recordsToInsert = uniqueRequests.inserts;
      const combinedRequests = [...recordsToUpdate, ...recordsToInsert];

      const dirtyMapping = mappingData.filter((m) => m._isDirty);

      if (combinedRequests.length === 0 && dirtyMapping.length === 0) {
        showToast("No changes detected to save.", "success");
        setSavingRecords(false);
        return;
      }

      if (recordsToUpdate.length > 0) {
        await axios.post(LNL_UPDATE_API, recordsToUpdate);
      }
      if (recordsToInsert.length > 0) {
        await axios.post(LNL_INSERT_API, recordsToInsert);
      }

      if (dirtyMapping.length > 0) {
        const mappingPayload = dirtyMapping.map((m) => ({
          acctId: m.acctId,
          acctName: m.acctName,
          pbrAcctGrp: m.pbrAcctGrp || "",
          projPef: m.projPef || "",
        }));
        await axios.post(MAPPING_API, mappingPayload);
      }

      showToast("Records saved successfully.", "success");
      const refreshed = await fetchData();
      if (refreshed === false) {
        setConfigurationLoaded(false);
        showToast(
          "Records saved, but refresh failed. Reload before saving again.",
          "error",
        );
      }
    } catch (err) {
      console.error("Save failed:", err);
      let errorMsg = err.message || "Failed to save records. Please try again.";

      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "string") {
          errorMsg = data;
        } else if (data.message) {
          errorMsg = data.message;
        }
        if (data.errors) {
          if (Array.isArray(data.errors)) {
            errorMsg = data.errors.join(" | ");
          } else if (typeof data.errors === "object") {
            errorMsg = Object.values(data.errors).flat().join(" | ");
          }
        }
      }
      showToast(errorMsg, "error");
    } finally {
      savingRecordsRef.current = false;
      setSavingRecords(false);
    }
  };

  const onToggle = useCallback((key) => {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleRowIS = useCallback((id) => {
    setExpandedIS((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAllIS = useCallback(() => {
    const data =
      activeTab === "PBR Income Statement"
        ? pbrIncomeStatementData
        : incomeStatementData;
    const ids = [];
    const walk = (node) => {
      if (node.children && node.children.length > 0) {
        ids.push(node.id);
        node.children.forEach(walk);
      }
    };
    data.forEach(walk);
    setExpandedIS(new Set(ids));
  }, [activeTab, incomeStatementData, pbrIncomeStatementData]);

  const collapseAllIS = useCallback(() => setExpandedIS(new Set()), []);

  const expandAll = useCallback(() => {
    const ids = [];
    const walk = (node, depth) => {
      if (node.children && node.children.length > 0) {
        ids.push(node.id + "__" + depth);
        node.children.forEach((child) => walk(child, depth + 1));
      }
    };
    pbrTreeData.forEach((pool) => walk(pool, 0));
    setExpanded(new Set(ids));
  }, [pbrTreeData]);

  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  const handleExportTemplate = (format = "excel") => {
    let templateDataSet = [];
    let filename = `PBR_Template_${activeTab.replace(/\s+/g, "_")}_V${selectedVersion}`;

    if (activeTab === "Labor") {
      templateDataSet = laborData.map((item) => ({
        Version: selectedVersion,
        "Employee ID": item.empId,
        "Employee Name": item.empName,
        "Labor Cat": item.laborCat,
        "Project ID": item.projId,
        "Project Name": item.projName,
        "Account ID": item.acctId,
        "Account Name": item.acctName,
        "Org ID": item.orgId,
        "PBR Group": item.pbrGroup,
        ...months.reduce(
          (acc, m) => ({
            ...acc,
            [`${m} Hrs`]: item[`${m}Hours`] || 0,
          }),
          {},
        ),
      }));
    } else if (activeTab === "Non-Labor") {
      templateDataSet = nonLaborData.map((item) => ({
        Version: selectedVersion,
        "Vendor ID": item.vendorId,
        "Vendor Name": item.vendorName,
        "Project ID": item.projId,
        "Project Name": item.projName,
        "Account ID": item.acctId,
        "Account Name": item.acctName,
        "Org ID": item.orgId,
        "PBR Group": item.pbrGroup,
        ...months.reduce(
          (acc, m) => ({
            ...acc,
            [`${m} Amt`]: item[`${m}Amount`] || 0,
          }),
          {},
        ),
      }));
    } else {
      showToast(
        "Template export is only available for Labor and Non-Labor tabs.",
        "error",
      );
      return;
    }

    if (templateDataSet.length === 0) {
      showToast("No records available to generate template.", "error");
      return;
    }

    if (format === "csv") {
      const headers = Object.keys(templateDataSet[0]).join(",");
      const rows = templateDataSet.map((row) =>
        Object.values(row)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(","),
      );
      const csvContent =
        "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Template CSV downloaded successfully!", "success");
    } else if (format === "excel") {
      const worksheet = XLSX.utils.json_to_sheet(templateDataSet);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `${activeTab} Template`.slice(0, 31),
      );
      XLSX.writeFile(workbook, `${filename}.xlsx`);
      showToast("Template Excel file downloaded successfully!", "success");
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isConfirmed = window.confirm(
      `Are you sure you want to upload "${file.name}" for the ${activeTab} tab?`,
    );

    if (!isConfirmed) {
      console.log("Upload cancelled by user.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("activeTab", activeTab);
    formData.append("selectedVersion", selectedVersion);

    try {
      console.log(`Starting upload for file: ${file.name}...`);
      showToast("Uploading file...", "info");

      const response = await fetch(
        `${backendUrl}/api/PbrLaborNonLabor/import?fyCd=${selectedFY}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      showToast("File imported and mapped successfully!", "success");
      fetchData();
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast("Failed to upload file. Please try again.", "error");
    } finally {
      event.target.value = "";
    }
  };

  const exportAllTabs = () => {
    try {
      const wb = XLSX.utils.book_new();
      const add = (name, ws) =>
        XLSX.utils.book_append_sheet(wb, ws, safeSheetName(name));
      const n2 = (v) => Number(v || 0);
      const monthIdx = (start, step) => months.map((_, i) => start + i * step);

      /* ---- Dashboard Summary ---- */
      {
        const sums = (d) =>
          months.map((m) => d.reduce((s, r) => s + n2(r[`${m}Amount`]), 0));
        const rows = [
          ["Labor", laborData],
          ["Non-Labor", nonLaborData],
          ["Revenue", revenueData],
        ].map(([label, d]) => {
          const mv = sums(d);
          return [label, mv.reduce((a, b) => a + b, 0), ...mv];
        });
        add(
          "Dashboard",
          buildStyledSheet(["Category", "FY Total", ...months], rows, {
            money: Array.from({ length: 13 }, (_, i) => i + 1),
            widths: [18],
          }),
        );
      }

      /* ---- PBR Structure ---- */
      {
        const rows = [],
          styles = {};
        const walk = (node, depth) => {
          styles[rows.length] =
            depth === 0
              ? { bold: true, bg: "E2E8F0" }
              : depth === 1
                ? { bold: true, bg: "E0E7FF", indent: 1 }
                : { indent: depth };
          rows.push([
            node.name,
            node.level,
            node.level === "Pool" ? "" : n2(node.amount),
            node.rate !== undefined ? n2(node.rate) : "",
          ]);
          (node.children || []).forEach((c) => walk(c, depth + 1));
        };
        pbrTreeData.forEach((p) => walk(p, 0));
        // styles[rows.length] = { bold: true, bg: "C7D2FE" };
        // rows.push([
        // "Overall Wrap Rate",
        // "Summary",
        // n2(
        // waterfallEngine.sourceCostTotal +
        // waterfallEngine.cumulativeIndirectTotal,
        // ),
        // n2(waterfallEngine.overallWrapRate),
        // ]);
        add(
          "PBR Structure",
          buildStyledSheet(
            ["PBR Structure", "Level", "Loaded Cost", "PBR Rate %"],
            rows,
            {
              money: [2],
              pct: [3],
              widths: [70, 14, 18, 20],
              rowStyles: styles,
            },
          ),
        );
      }

      /* ---- Project Performance ---- */
      {
        const rows = [],
          styles = {};
        const block = (title, getter) => {
          if (title) {
            styles[rows.length] = { bold: true, bg: "CBD5E1" };
            rows.push([title, ...Array(13).fill("")]);
          }
          performanceData.forEach((r) => {
            const { vals, annual } = getter(r);
            styles[rows.length] = r.isBold
              ? { bold: true, bg: "E0E7FF" }
              : { bg: "F1F5F9" };
            rows.push([r.label, ...vals, annual]);
          });
        };
        block("", (r) => ({ vals: r.data.total, annual: r.annual }));
        const ids = new Set();
        performanceData.forEach((r) =>
          Object.keys(r.data.projects).forEach((p) => ids.add(p)),
        );
        [...ids].sort().forEach((pId) => {
          const name =
            allProjects.find((p) => p.projectId === pId)?.name ||
            performanceData.find((r) => r.data.projects[pId])?.data.projects[
              pId
            ]?.projName ||
            "";
          block(`Project: ${pId} - ${name}`, (r) => ({
            vals: r.data.projects[pId]?.values || Array(12).fill(0),
            annual: r.data.projects[pId]?.annual || 0,
          }));
        });
        add(
          "Project Performance",
          buildStyledSheet(["Line Items", ...months, "Annual Total"], rows, {
            money: Array.from({ length: 13 }, (_, i) => i + 1),
            widths: [34],
            rowStyles: styles,
          }),
        );
      }

      /* ---- Rates Trend (one sheet per pool) ---- */
      WATERFALL_SEQUENCE.forEach((pool) => {
        const r = waterfallEngine.results[pool];
        if (!r) return;
        const rows = [],
          styles = {};
        const section = (t) => {
          styles[rows.length] = { bold: true, bg: "CBD5E1" };
          rows.push([t, ...Array(14).fill("")]);
        };
        const acct = (a) =>
          rows.push([
            `${a.orgId} - ${a.acctId} - ${a.accountName}${a.allocationAcctId && a.allocationAcctId !== a.acctId ? ` -> Allocates to [${a.allocationAcctId}]` : ""}`,
            n2(a.total),
            n2(a.ytdAllocation),
            ...months.map((m) => n2(a[`${m}Amount`])),
          ]);
        const total = (label, tot, mm, alloc = 0) => {
          styles[rows.length] = { bold: true, bg: "F1F5F9" };
          rows.push([
            label,
            n2(tot),
            n2(alloc),
            ...months.map((m) => n2(mm[`${m}Amount`])),
          ]);
        };

        section("Cost");
        r.evaluatedCosts.forEach(acct);
        total("Total Cost", r.totalCost, r.costMonths, r.totalCostAllocation);
        section("Base");
        r.evaluatedBases.forEach(acct);
        total("Total Base", r.totalBase, r.baseMonths, r.totalBaseAllocation);

        styles[rows.length] = { bold: true, bg: "E0E7FF", fmt: XL_PCT };
        rows.push([
          `${pool} Rate`,
          // n2(r.rate * 100),
          // "",
          // ...months.map((m) => n2((r.rateMonths[`${m}Rate`] || 0) * 100)),
          Number((r.rate * 100).toFixed(2)),
          ...months.map((m) =>
            Number(((r.rateMonths[`${m}Rate`] || 0) * 100).toFixed(2)),
          ),
        ]);

        let rc = 0,
          rb = 0;
        styles[rows.length] = { bold: true, bg: "C7D2FE", fmt: XL_PCT };
        rows.push([
          `${pool} YTD Rate`,
          // n2(r.rate * 100),
          Number((r.rate * 100).toFixed(2)),
          "",
          ...months.map((m) => {
            rc += n2(r.costMonths[`${m}Amount`]);
            rb += n2(r.baseMonths[`${m}Amount`]);
            // return rb === 0 ? 0 : (rc / rb) * 100;
            return rb === 0 ? 0 : Number(((rc / rb) * 100).toFixed(2));
          }),
        ]);

        add(
          `Rates - ${pool}`,
          buildStyledSheet(
            [
              "PBR Overhead Group",
              "YTD Amount",
              "YTD Allocation",
              ...months.map((m) => `${m} Amt`),
            ],
            rows,
            {
              money: Array.from({ length: 14 }, (_, i) => i + 1),
              widths: [60],
              rowStyles: styles,
            },
          ),
        );
      });

      /* ---- Labor ---- */
      {
        const headers = [
          "Employee ID",
          "Employee Name",
          "Status",
          "Labor Category",
          "Base Hourly Rate",
          "Project ID",
          "Project Name",
          "Account ID",
          "Account Name",
          "Organization ID",
          "Organization Name",
          "PBR Account Group",
          "Inflation Rate %",
          "Inflated Hourly Rate",
          "Total Hours",
          "Total Amount",
          ...months.flatMap((m) => [`${m} Hrs`, `${m} Amt`]),
        ];
        const base = laborData.map((r) => [
          r.empId,
          r.empName,
          r.empStatus,
          r.laborCat,
          n2(r.rate),
          r.projId,
          r.projName,
          r.acctId,
          r.acctName,
          r.orgId,
          orgNameMap[normalizeOrgId(r.orgId)] || "",
          r.pbrGroup,
          n2(r.inflationRate),
          n2(Number(r.rate || 0) * (1 + Number(r.inflationRate || 0) / 100)),
          n2(r.totalHours),
          n2(r.totalAmount),
          ...months.flatMap((m) => [n2(r[`${m}Hours`]), n2(r[`${m}Amount`])]),
        ]);
        const { rows, rowStyles } = withTotals(base, 14, headers.length);
        add(
          "Labor",
          buildStyledSheet(headers, rows, {
            money: [4, 13, 15, ...monthIdx(17, 2)],
            num: [12, 14, ...monthIdx(16, 2)],
            rowStyles,
            widths: [14, 22, 10, 16, 12, 16, 30, 14, 26, 14, 26, 30],
          }),
        );
      }

      /* ---- Non-Labor ---- */
      {
        const headers = [
          "Vendor ID",
          "Vendor Name",
          "Project ID",
          "Project Name",
          "Account ID",
          "Account Name",
          "Organization ID",
          "Organization Name",
          "PBR Account Group",
          "Inflation Rate %",
          "Total Amount",
          ...months.map((m) => `${m} Amt`),
        ];
        const base = nonLaborData.map((r) => [
          r.vendorId,
          r.vendorName,
          r.projId,
          r.projName,
          r.acctId,
          r.acctName,
          r.orgId,
          orgNameMap[normalizeOrgId(r.orgId)] || "",
          r.pbrGroup,
          n2(r.inflationRate),
          n2(r.totalAmount),
          ...months.map((m) => n2(r[`${m}Amount`])),
        ]);
        const { rows, rowStyles } = withTotals(base, 10, headers.length);
        add(
          "Non-Labor",
          buildStyledSheet(headers, rows, {
            // money: Array.from({ length: 13 }, (_, i) => i + 10 + 1 - 1 + (i === 0 ? 0 : 0)).filter((i) => i >= 10),
            money: Array.from({ length: 13 }, (_, i) => i + 10),
            num: [9],
            rowStyles,
            widths: [14, 28, 16, 30, 14, 26, 14, 26, 30],
          }),
        );
      }

      /* ---- Labor Summary ---- */
      {
        const headers = [
          "Employee ID",
          "Employee Name",
          "Utilization",
          "Labor Utilization %",
          `FY ${selectedYear} Hours`,
          `FY ${selectedYear} Amount`,
          ...months.flatMap((m) => [`${m} Hrs`, `${m} Amt`]),
        ];
        const base = laborSummaryData.map((r) => [
          r.empId,
          r.empName,
          r.totalHours === standardHours
            ? "On Budget"
            : r.totalHours > standardHours
              ? "Over Budget"
              : "Under Budget",
          r.totalHours > 0 ? (r.totalHours / standardHours) * 100 : 0,
          n2(r.totalHours),
          n2(r.totalAmount),
          ...months.flatMap((m) => [
            n2(r.monthly[`${m}Hours`]),
            n2(r.monthly[`${m}Amount`]),
          ]),
        ]);
        const { rows, rowStyles } = withTotals(base, 4, headers.length);
        add(
          "Labor Summary",
          buildStyledSheet(headers, rows, {
            pct: [3],
            num: [4, ...monthIdx(6, 2)],
            money: [5, ...monthIdx(7, 2)],
            rowStyles,
            widths: [14, 26, 16],
          }),
        );
      }

      /* ---- Non-Labor Summary (with Account ID) ---- */
      {
        const headers = [
          "Project ID",
          "Project Name",
          "Account ID",
          "Account Name",
          "PBR Account Group",
          "FY Amount",
          ...months.map((month) => `${month} Amt`),
        ];
        const base = nonLaborData.map((r) => [
          r.projId,
          r.projName,
          r.acctId,
          r.acctName,
          r.pbrGroup,
          n2(r.totalAmount),
          ...months.map((month) => n2(r[`${month}Amount`])),
        ]);
        const { rows, rowStyles } = withTotals(base, 5, headers.length);
        add(
          "Non-Labor Summary",
          buildStyledSheet(headers, rows, {
            money: [5, ...months.map((_, index) => index + 6)],
            rowStyles,
            widths: [16, 34, 14, 30, 34, 18],
          }),
        );
      }

      /* ---- Revenue ---- */
      {
        const headers = [
          "Project ID",
          "Project Name",
          "Account ID",
          "Account Name",
          "Organization ID",
          "Organization Name",
          "PBR Account Group",
          "Total Amount",
          ...months.map((m) => `${m} Amt`),
        ];
        const base = revenueData.map((r) => [
          r.projId,
          r.projName,
          r.acctId,
          r.acctName,
          r.orgId,
          orgNameMap[normalizeOrgId(r.orgId)] || "",
          r.pbrGroup,
          n2(r.totalAmount),
          ...months.map((m) => n2(r[`${m}Amount`])),
        ]);
        const { rows, rowStyles } = withTotals(base, 7, headers.length);
        add(
          "Revenue",
          buildStyledSheet(headers, rows, {
            money: Array.from({ length: 13 }, (_, i) => i + 7),
            rowStyles,
            widths: [16, 34, 14, 28, 14, 26, 30],
          }),
        );
      }

      /* ---- Income Statement ---- */
      {
        const rows = [],
          styles = {};
        const val = (v) => (v === "-" ? 0 : Number(v));
        const appendIncomeNode = (item, depth = 0) => {
          const mv = Array.from({ length: 12 }, (_, i) =>
            val(item.monthlyAmts?.[i + 1] ?? 0),
          );
          styles[rows.length] =
            depth === 0
              ? {
                  bold: true,
                  bg: item.type === "summary" ? "E2E8F0" : "F1F5F9",
                }
              : { indent: depth * 2 };
          rows.push([
            depth ? `${item.id} - ${item.name}` : item.name,
            ...mv,
            mv.reduce((a, b) => a + b, 0),
          ]);
          (item.children || []).forEach((child) =>
            appendIncomeNode(child, depth + 1),
          );
        };
        incomeStatementData.forEach((item) => appendIncomeNode(item));
        add(
          "Income Statement",
          buildStyledSheet(["Line Item", ...months, "YTD"], rows, {
            money: Array.from({ length: 13 }, (_, i) => i + 1),
            widths: [48],
            rowStyles: styles,
          }),
        );
      }

      /* ---- PBR Income Statement ---- */
      {
        const rows = [],
          styles = {};
        const val = (v) => (v === "-" ? 0 : Number(v));
        pbrIncomeStatementData.forEach((item) => {
          const mv = Array.from({ length: 12 }, (_, i) =>
            val(item.monthlyAmts?.[i + 1] ?? 0),
          );
          styles[rows.length] = { bold: true, bg: "F1F5F9" };
          rows.push([item.name, ...mv, mv.reduce((a, b) => a + b, 0)]);

          (item.children || []).forEach((c) => {
            const cv = Array.from({ length: 12 }, (_, i) =>
              val(c.monthlyAmts?.[i + 1] ?? 0),
            );
            styles[rows.length] = { indent: 2 };
            rows.push([
              `${c.id} - ${c.name}`,
              ...cv,
              cv.reduce((a, b) => a + b, 0),
            ]);
          });
        });

        add(
          "PBR Income Statement",
          buildStyledSheet(["Line Item", ...months, "YTD"], rows, {
            money: Array.from({ length: 13 }, (_, i) => i + 1),
            widths: [48],
            rowStyles: styles,
          }),
        );
      }

      /* ---- Mapping & Maintenance ---- */
      add(
        "Mapping & Maintenance",
        buildStyledSheet(
          [
            "Account ID",
            "Account Name",
            "Expenses Type",
            "PBR Account Group",
            "Project Performance",
          ],
          mappingData.map((m) => [
            m.acctId,
            m.acctName,
            m.expensesType || "",
            m.pbrAcctGrp,
            m.projPef,
          ]),
          { widths: [16, 44, 30, 44, 26] },
        ),
      );

      XLSX.writeFile(
        wb,
        `PBR_Report_FY${selectedYear}_V${selectedVersion}.xlsx`,
      );
      showToast("All tabs exported successfully!", "success");
    } catch (err) {
      console.error("Export All failed:", err);
      showToast("Failed to export workbook.", "error");
    }
  };

  const getPerformancePoolBreakdown = (projectId) => {
    const indirectBurden = performanceData.find(
      (r) => r.label === "Indirect Burdens",
    );

    const targetValues =
      projectId === "ALL"
        ? indirectBurden?.data?.total || Array(12).fill(0)
        : indirectBurden?.data?.projects?.[projectId]?.values ||
          Array(12).fill(0);

    const rawPools = WATERFALL_SEQUENCE.map((poolName) => {
      const pool = waterfallEngine.results[poolName];

      const values = months.map((m, index) =>
        Number(
          (
            Number(
              projectId === "ALL"
                ? performanceData.find((r) => r.label === "Direct Labor")?.data
                    .total[index] || 0
                : performanceData.find((r) => r.label === "Direct Labor")?.data
                    .projects?.[projectId]?.values?.[index] || 0,
            ) * Number(pool?.rateMonths?.[`${m}Rate`] || 0)
          ).toFixed(2),
        ),
      );

      return { poolName, values };
    });

    // Scale pool breakup so it EXACTLY reconciles with Indirect Burdens
    const adjustedPools = rawPools.map((pool, poolIndex) => ({
      ...pool,
      values: pool.values.map((value, monthIndex) => {
        const rawTotal = rawPools.reduce(
          (sum, p) => sum + Number(p.values[monthIndex] || 0),
          0,
        );

        const targetTotal = Number(targetValues[monthIndex] || 0);

        if (rawTotal === 0) {
          return poolIndex === rawPools.length - 1 ? targetTotal : 0;
        }

        return Number(((value / rawTotal) * targetTotal).toFixed(2));
      }),
    }));

    // Correct rounding difference so monthly breakup = Indirect Burdens exactly
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const target = Number(targetValues[monthIndex] || 0);

      const current = adjustedPools.reduce(
        (sum, pool) => sum + Number(pool.values[monthIndex] || 0),
        0,
      );

      const difference = Number((target - current).toFixed(2));

      if (difference !== 0 && adjustedPools.length > 0) {
        const lastPool = adjustedPools[adjustedPools.length - 1];
        lastPool.values[monthIndex] = Number(
          (lastPool.values[monthIndex] + difference).toFixed(2),
        );
      }
    }

    return adjustedPools
      .map((pool) => ({
        ...pool,
        annual: Number(
          pool.values.reduce((sum, value) => sum + value, 0).toFixed(2),
        ),
      }))
      .filter(
        (pool) => pool.annual !== 0 || pool.values.some((value) => value !== 0),
      );
  };

  const togglePerformancePool = (projectId) => {
    const key = projectId || "ALL";
    setExpandedPerfPools((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="bg-slate-50 h-screen font-sans text-[13px] text-slate-800 flex flex-col overflow-hidden relative">
      {isDeleting && (
        <div className="absolute inset-0 z-[10000] bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center cursor-not-allowed">
          <div className="bg-white rounded-lg shadow-xl px-8 py-6 flex flex-col items-center gap-3">
            <RefreshCw className="animate-spin text-indigo-600" size={28} />
            <span className="text-[14px] font-semibold text-slate-700">
              Deleting Records...
            </span>
            <span className="text-[12px] text-slate-500">
              Please do not close or refresh the page.
            </span>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* TOAST NOTIFICATION BANNER */}
      {toast.message && (
        <div
          className={`absolute top-4 right-4 z-[9999] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-[13px] font-medium transition-all animate-bounce ${
            toast.type === "error"
              ? "bg-red-50 text-red-700 border-red-100"
              : "bg-emerald-50 text-emerald-700 border-emerald-100"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="text-red-500" size={18} />
          ) : (
            <CheckCircle2 className="text-emerald-500" size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar, 
        .scrollbar-spacer::-webkit-scrollbar { height: 12px; width: 12px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-top: 1px solid #e2e8f0; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; border: 2px solid #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .scrollbar-spacer::-webkit-scrollbar-track { background: transparent; border-top: 1px solid #e2e8f0; }
        .scrollbar-spacer::-webkit-scrollbar-thumb { background: transparent; }
      `}</style>

      {/* Ribbon */}
      <div className="flex-none flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center px-6 py-3 bg-white border-b border-slate-200 gap-4 2xl:gap-2 shadow-sm z-20">
        <div className="flex items-center gap-2">
          <Layers className="text-indigo-600 h-5 w-5" />
          <h1 className="text-[15px] font-semibold text-slate-800 flex items-center gap-2">
            PBR Package
            <span className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
              FY {selectedYear}
            </span>
          </h1>
        </div>

        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-md text-[12px]">
            <span className="font-medium text-slate-500">Fiscal Year</span>
            <select
              value={selectedFY}
              onChange={handleFYChange}
              className="border border-slate-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700 bg-white"
            >
              {FY_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <span className="w-px h-4 bg-slate-200 mx-1" />
            <span className="font-medium text-slate-500">Version</span>
            <select
              value={selectedVersion}
              onChange={(e) => {
                if (e.target.value === "NEW") {
                  const maxId =
                    versions.length > 0
                      ? Math.max(...versions.map((v) => v.id))
                      : 0;
                  const newVersion = {
                    id: maxId + 1,
                    name: `Version ${maxId + 1}`,
                    status: "DRAFT",
                  };
                  setVersions([...versions, newVersion]);
                  setSelectedVersion(newVersion.id);
                  setLaborData([]);
                  setNonLaborData([]);
                  setRevenueData([]);
                } else {
                  setSelectedVersion(Number(e.target.value));
                }
              }}
              className="border border-slate-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700 bg-white"
            >
              {versions.map((v) => (
                <option key={v?.id} value={v?.id}>
                  {v?.name}
                </option>
              ))}
              <option value="NEW" className="font-medium text-indigo-600">
                + Add New Version
              </option>
            </select>

            {isApproved ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 ml-1">
                <Lock size={12} /> Approved
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 ml-1">
                Draft
              </span>
            )}

            <label className="flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isApproved}
                disabled={isApproved}
                onChange={() => {
                  if (
                    window.confirm(
                      "Approve this version? It cannot be changed or edited after this.",
                    )
                  ) {
                    setVersions((prev) =>
                      prev.map((v) =>
                        v.id === selectedVersion
                          ? { ...v, status: "APPROVED" }
                          : v,
                      ),
                    );
                  }
                }}
                className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
              />
              <span
                className={`text-[12px] font-medium ${isApproved ? "text-emerald-700" : "text-slate-500"}`}
              >
                Mark Approved
              </span>
            </label>
            <button
              type="button"
              onClick={() => showToast("Email notification sent.", "success")}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 text-[12px] font-medium text-slate-600 transition-colors"
            >
              Notify Email
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchData}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 text-[12px] font-medium text-slate-600 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={14} /> Refresh
            </button>

            {(activeTab === "PBR Structure" ||
              activeTab === "Income Statement" ||
              activeTab === "PBR Income Statement") && (
              <>
                <button
                  type="button"
                  onClick={
                    activeTab === "PBR Structure" ? expandAll : expandAllIS
                  }
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 text-[12px] font-medium text-slate-600 flex items-center gap-1.5 transition-colors"
                >
                  <Maximize2 size={14} /> Expand
                </button>
                <button
                  type="button"
                  // onClick={collapseAll}
                  onClick={
                    activeTab === "PBR Structure" ? collapseAll : collapseAllIS
                  }
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 text-[12px] font-medium text-slate-600 flex items-center gap-1.5 transition-colors"
                >
                  <Minimize2 size={14} /> Collapse
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* {configurationLoaded && ["Labor", "Non-Labor", "Revenue"].includes(activeTab) && (
        <div className="px-6 py-2 text-xs text-slate-600 bg-slate-50 border-b border-slate-200">
          Closed through {closingPeriod.slice(0, 7)}. Saved closed-period values are read-only. New historical actuals can be imported and saved.
          {activeTab === "Non-Labor" && " Enter base amounts; inflated amounts appear beside them."}
        </div>
      )} */}

      {/* Tabs */}
      <div className="flex-none flex justify-between items-end border-b border-slate-200 bg-white px-6 pt-2 z-10">
        <div className="flex gap-6 overflow-x-auto w-full max-w-[78%]">
          {TABS.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => {
                setActiveTab(t);
                setCurrentPage(1);
              }}
              className={`pb-2 text-[13px] font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === t
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 mb-2">
          {(activeTab === "Labor Summary" ||
            activeTab === "Non-Labor Summary") && (
            <label className="flex items-center gap-1.5 cursor-pointer text-[12px] font-medium text-slate-600 select-none bg-slate-50 px-2 py-1 rounded border border-slate-200">
              <input
                type="checkbox"
                checked={
                  activeTab === "Labor Summary"
                    ? showMonthlySummary
                    : showMonthlyNonLaborSummary
                }
                onChange={(e) =>
                  activeTab === "Labor Summary"
                    ? setShowMonthlySummary(e.target.checked)
                    : setShowMonthlyNonLaborSummary(e.target.checked)
                }
                className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              Show Monthly
            </label>
          )}
          {activeTab === "Labor Summary" && (
            <label className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
              Standard Hours
              <input
                type="number"
                min="1"
                value={stdHoursInput}
                onChange={(e) => setStdHoursInput(e.target.value)}
                className="w-20 px-1.5 py-0.5 border border-slate-300 rounded text-right outline-none focus:border-indigo-500"
              />
            </label>
          )}
          {(activeTab === "PBR Structure" || activeTab === "Rates Trend") && (
            <label className="flex items-center gap-1.5 cursor-pointer text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded shadow-sm hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={hideZeros}
                onChange={(e) => setHideZeros(e.target.checked)}
                className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <EyeOff className="text-slate-500" size={14} /> Hide Zeros
            </label>
          )}
          {(activeTab === "Labor" || activeTab === "Non-Labor") && (
            <>
              <button
                type="button"
                onClick={handleImportClick}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-[12px] font-medium rounded shadow-sm transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportTemplate("excel")}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-[12px] font-medium rounded shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Template</span>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={exportAllTabs}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 text-[12px] font-medium rounded shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {activeTab === "Rates Trend" && (
        <div className="flex-none flex items-center bg-slate-50 border-b border-slate-200 px-6 pt-3 gap-6 overflow-x-auto w-full">
          {RATE_TABS.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveRateTab(tab)}
              className={`pb-2 text-[12px] font-medium whitespace-nowrap transition-colors border-b-2 ${activeRateTab === tab ? "border-indigo-500 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"}`}
            >
              <span>{tab}</span>
              <span className="ml-2 inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                Yearly Escalation:{" "}
                {getEffectivePoolEscalation(tab, selectedFY) == null
                  ? "—"
                  : `${Number(getEffectivePoolEscalation(tab, selectedFY)).toFixed(2)}%`}
              </span>
            </button>
          ))}
          {/* <button
            type="button"
            onClick={() => {
              setUniformEscalationRate(String(getEffectivePoolEscalation(activeRateTab, selectedFY) ?? 0));
              setShowEscalationOverride(true);
            }}
            className="ml-auto mb-2 shrink-0 rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Override Escalations
          </button> */}
        </div>
      )}

      {showEscalationOverride && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Override Escalations
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Selected year: {selectedFY}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEscalationOverride(false)}
                className="text-xl leading-none text-slate-400 hover:text-slate-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="border-b border-slate-200 px-5 py-3">
              <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setEscalationMode("uniform")}
                  className={`rounded-md px-3 py-2 ${escalationMode === "uniform" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"}`}
                >
                  Uniform Rate (Apply to All)
                </button>
                <button
                  type="button"
                  onClick={() => setEscalationMode("custom")}
                  className={`rounded-md px-3 py-2 ${escalationMode === "custom" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"}`}
                >
                  Custom Rates per Pool
                </button>
              </div>
            </div>
            <div className="max-h-[55vh] overflow-y-auto px-5 py-4">
              {escalationMode === "uniform" ? (
                <div className="grid grid-cols-[1fr_140px] items-center gap-4 rounded-lg bg-slate-50 p-4">
                  <label
                    htmlFor="uniformEscalationRate"
                    className="text-sm font-medium text-slate-700"
                  >
                    Uniform escalation rate for all pools (%)
                  </label>
                  <input
                    id="uniformEscalationRate"
                    type="number"
                    step="0.01"
                    value={uniformEscalationRate}
                    onChange={(e) => setUniformEscalationRate(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-right text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  {WATERFALL_SEQUENCE.map((poolName) => (
                    <div
                      key={poolName}
                      className="grid grid-cols-[1fr_140px] items-center gap-4 border-b border-slate-100 py-2"
                    >
                      <label
                        htmlFor={`escalation-${poolName}`}
                        className="text-sm text-slate-700"
                      >
                        {poolName}
                      </label>
                      <input
                        id={`escalation-${poolName}`}
                        type="number"
                        step="0.01"
                        value={
                          poolEscalationRates[poolName]?.[String(selectedFY)] ??
                          getPoolEscalation(poolName, selectedFY) ??
                          0
                        }
                        onChange={(e) =>
                          setPoolEscalationRates((prev) => ({
                            ...prev,
                            [poolName]: {
                              ...(prev[poolName] || {}),
                              [String(selectedFY)]: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-right text-sm outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setShowEscalationOverride(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setPoolEscalationRates({});
                  setUniformEscalationRate("0");
                }}
                className="rounded-md border border-emerald-600 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Reset Rates
              </button>
              <button
                type="button"
                onClick={applyEscalationOverrides}
                className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Apply Escalations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden bg-slate-50 p-4 relative flex flex-col">
        {loading && (
          <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center text-slate-600 font-medium">
            <RefreshCw
              className="animate-spin mr-2 text-indigo-600"
              size={20}
            />{" "}
            Loading Data...
          </div>
        )}

        {/* PBR STRUCTURE - MONTHLY RATE GRAPH */}
        {activeTab === "PBR Structure" && !loading && (
          <div className="relative z-[60] overflow-visible flex-none bg-white border border-slate-200 shadow-sm p-5 rounded-xl mb-4">
            <h3 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Layers size={16} className="text-indigo-500" />
              PBR Pool Rates {/* &amp; Overall Wrap Rate */}
            </h3>

            {/* <div className="flex items-end gap-3 h-52 w-full px-2"> */}
            <div className="flex items-end gap-3 h-52 w-full px-2 overflow-visible">
              {months.map((month, monthIndex) => {
                const pools = WATERFALL_SEQUENCE.filter(
                  isPbrStructurePoolVisible,
                )
                  .map((poolName) => ({
                    name: poolName,
                    rate:
                      Number(
                        waterfallEngine.results[poolName]?.rateMonths?.[
                          `${month}Rate`
                        ] || 0,
                      ) * 100,
                  }))
                  .filter((p) => waterfallEngine.results[p.name]);

                // const overallWrapRate = Number(
                // waterfallEngine.overallWrapRateMonths?.[`${month}Rate`] || 0,
                // );
                //
                //
                const values = pools.map((p) => p.rate);
                const maxRate = Math.max(1, ...values);

                return (
                  <div
                    key={month}
                    className="flex-1 flex flex-col justify-end items-center gap-2 group relative hover:z-[110] min-w-0"
                  >
                    <div className="w-full flex justify-center items-end gap-1 h-[150px] bg-slate-50/50 rounded-t-md border-b border-slate-200 pt-2 px-1">
                      {pools.map(({ name, rate }) => {
                        const height = Math.max(2, (rate / maxRate) * 100);
                        return (
                          <div
                            key={name}
                            style={{ height: `${height}%` }}
                            className="flex-1 bg-indigo-400 rounded-t-md hover:bg-indigo-500 transition-all cursor-pointer shadow-sm min-w-[3px]"
                            title={`${name} - ${rate.toFixed(2)}%`}
                          />
                        );
                      })}

                      {/* Wrap rate bar disabled.
                      <div
                        style={{
                          height: `${Math.max(2, (overallWrapRate / maxRate) * 100)}%`,
                        }}
                        className="flex-1 bg-violet-500 rounded-t-md hover:bg-violet-600 transition-all cursor-pointer shadow-sm min-w-[4px]"
                        title={`Overall Wrap Rate - ${overallWrapRate.toFixed(2)}x`}
                      />
                      */}
                    </div>

                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {month}
                    </span>

                    <div
                      className={`absolute top-full hidden group-hover:block bg-slate-800 text-white text-[11px] p-3 rounded-lg shadow-xl z-[100] min-w-[220px] max-w-[calc(100vw-2rem)] max-h-64 overflow-y-auto ${monthIndex < 2 ? "left-0" : monthIndex > 9 ? "right-0" : "left-1/2 -translate-x-1/2"}`}
                    >
                      <div className="font-bold border-b border-slate-600 pb-1.5 mb-2 text-center text-slate-200">
                        {month} FY{selectedYear}
                      </div>

                      {pools.map(({ name, rate }) => (
                        <div key={name} className="flex justify-between gap-4">
                          <span>{name}:</span>
                          <span>{rate.toFixed(2)}%</span>
                        </div>
                      ))}

                      {/* Wrap rate tooltip entry disabled.
                      <div className="flex justify-between gap-4 mt-2 pt-2 border-t border-slate-600 font-semibold">
                        <span className="text-violet-300">
                          Overall Wrap Rate:
                        </span>
                        <span>{overallWrapRate.toFixed(2)}x</span>
                      </div>

                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                      */}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-8 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-400 rounded-sm shadow-sm" />
                <span className="text-[12px] font-medium text-slate-600">
                  PBR Pool Rate
                </span>
              </div>

              {/* Wrap rate legend disabled.
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-violet-500 rounded-sm shadow-sm" />
                <span className="text-[12px] font-medium text-slate-600">
                  Overall Wrap Rate
                </span>
              </div>
              */}
            </div>
          </div>
        )}

        {/* Dynamic Grid Layout
        {activeTab === "Labor" ||
        activeTab === "Non-Labor" ||
        activeTab === "Revenue" ? ( */}
        {/* EXECUTIVE DASHBOARD */}
        {activeTab === "Dashboard" ? (
          loading ? null : (
            <DashboardView
              laborData={laborData}
              nonLaborData={nonLaborData}
              revenueData={revenueData}
              dashboardTab={dashboardTab}
              setDashboardTab={setDashboardTab}
              versionLabel={
                selectedVersionObj?.name || `Version ${selectedVersion}`
              }
              fiscalYear={selectedYear}
            />
          )
        ) : activeTab === "Labor" ||
          activeTab === "Non-Labor" ||
          activeTab === "Revenue" ? (
          <div className="flex flex-col w-full h-full bg-white shadow-sm border border-slate-200 rounded-lg min-h-0 overflow-hidden">
            {/* Toolbar */}
            <div className="flex-none flex justify-between items-center bg-slate-50 px-4 py-2 border-b border-slate-200 z-40 relative">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "Labor") setShowAddLabor(!showAddLabor);
                      else if (activeTab === "Revenue")
                        setShowAddRevenue(!showAddRevenue);
                      else setShowAddNonLabor(!showAddNonLabor);
                    }}
                    disabled={isApproved}
                    className="px-3 py-1.5 bg-white text-slate-700 font-medium text-[12px] border border-slate-200 shadow-sm rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    + Add Record
                  </button>
                  {(activeTab === "Labor" ||
                    activeTab === "Non-Labor" ||
                    activeTab === "Revenue") && (
                    <button
                      type="button"
                      onClick={() => setShowImportActuals(true)}
                      disabled={isApproved || loading}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-medium text-[12px] border border-indigo-200 shadow-sm rounded-md hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Import Actuals
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-2 py-1.5 border border-slate-200 rounded-md shadow-sm transition-colors ${showFilters ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                    title="Toggle Filter Row"
                  >
                    <Search size={14} />
                  </button>
                </div>

                {selectedRowUids.length > 0 && !isApproved && (
                  <div className="flex items-center gap-2 border-l border-slate-300 pl-3">
                    <button
                      type="button"
                      onClick={handleBulkDelete}
                      className="px-3 py-1.5 bg-red-50 text-red-600 font-medium text-[12px] border border-red-200 rounded-md hover:bg-red-100 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Trash2 size={14} /> Delete ({selectedRowUids.length})
                    </button>
                    <select
                      onChange={handleBulkAccountApply}
                      className="min-w-[200px] border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-md px-2 py-1.5 text-[12px] font-medium outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm cursor-pointer"
                    >
                      <option value="">
                        Apply Account to ({selectedRowUids.length}) rows...
                      </option>
                      {Object.keys(coaMap)
                        // Account-type restriction intentionally disabled for Labor/Non-Labor.
                        // .filter((k) => isVisibleAccount(coaMap[k]))
                        .map((k) => (
                          <option key={`bulk-acc-${k}`} value={k}>
                            {k} - {coaMap[k]?.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* LABOR ADD DROPDOWN */}
                {activeTab === "Labor" && showAddLabor && !isApproved && (
                  <div className="absolute top-12 left-4 bg-white border border-slate-200 rounded-lg shadow-xl z-50 w-[360px] flex flex-col overflow-hidden">
                    <div className="flex bg-slate-50 border-b border-slate-200">
                      <button
                        type="button"
                        onClick={() => setLaborAddTab("Employee")}
                        className={`flex-1 py-2.5 text-[12px] font-medium ${laborAddTab === "Employee" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        By Employee
                      </button>
                      <button
                        type="button"
                        onClick={() => setLaborAddTab("Org/Account")}
                        className={`flex-1 py-2.5 text-[12px] font-medium ${laborAddTab === "Org/Account" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        Org/Account
                      </button>
                    </div>
                    <div className="p-4">
                      {laborAddTab === "Employee" ? (
                        <>
                          <div className="mb-3 relative">
                            <Search
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                              size={14}
                            />
                            <input
                              type="text"
                              placeholder="Search employee..."
                              value={employeeSearchTerm}
                              onChange={(e) =>
                                setEmployeeSearchTerm(e.target.value)
                              }
                              className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div className="max-h-56 overflow-y-auto mb-4 border border-slate-100 rounded-md">
                            {filteredEmployees.length > 0 && (
                              <label className="flex items-center gap-2.5 px-3 py-2 bg-slate-100 cursor-pointer text-[13px] border-b border-slate-200 font-semibold sticky top-0 z-10">
                                <input
                                  type="checkbox"
                                  checked={isAllEmpSelected}
                                  onChange={() => {
                                    if (isAllEmpSelected) {
                                      setSelectedEmployees((prev) =>
                                        prev.filter(
                                          (id) =>
                                            !filteredEmployees.find(
                                              (e) => e.emplId === id,
                                            ),
                                        ),
                                      );
                                    } else {
                                      const newIds = filteredEmployees.map(
                                        (e) => e.emplId,
                                      );
                                      setSelectedEmployees((prev) => [
                                        ...new Set([...prev, ...newIds]),
                                      ]);
                                    }
                                  }}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                />
                                <span className="text-slate-800">
                                  Select All ({filteredEmployees.length})
                                </span>
                              </label>
                            )}
                            {filteredEmployees.map((emp) => (
                              <label
                                key={emp.id || emp.emplId}
                                className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedEmployees.includes(
                                    emp.emplId,
                                  )}
                                  onChange={() =>
                                    toggleEmployeeSelection(emp.emplId)
                                  }
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                />
                                <span className="truncate text-slate-700">
                                  {emp.emplId} - {emp.firstName}{" "}
                                  <span className="text-slate-400 text-[11px]">
                                    (
                                    {emp.status === "ACT"
                                      ? "Active"
                                      : emp.status === "IN"
                                        ? "Inactive"
                                        : emp.status}
                                    )
                                  </span>
                                </span>
                              </label>
                            ))}
                          </div>
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddLabor(false);
                                setSelectedEmployees([]);
                                setEmployeeSearchTerm("");
                              }}
                              className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-medium hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddSelectedEmployees}
                              disabled={selectedEmployees.length === 0}
                              className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                              Add Selected
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col gap-4 mb-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] font-medium text-slate-700">
                                Organization
                              </label>
                              <div className="relative">
                                <Search
                                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                  size={14}
                                />
                                <input
                                  type="text"
                                  placeholder="Search org..."
                                  value={orgSearchTerm}
                                  onChange={(e) =>
                                    setOrgSearchTerm(e.target.value)
                                  }
                                  className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="max-h-32 overflow-y-auto border border-slate-100 rounded-md mt-1">
                                {orgs
                                  ?.filter(
                                    (org) =>
                                      org?.orgId
                                        ?.toLowerCase()
                                        .includes(
                                          orgSearchTerm.toLowerCase(),
                                        ) ||
                                      org?.orgName
                                        ?.toLowerCase()
                                        .includes(orgSearchTerm.toLowerCase()),
                                  )
                                  .map((org) => (
                                    <label
                                      key={`lab-org-${org.orgId}`}
                                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0"
                                    >
                                      <input
                                        type="radio"
                                        name="laborOrgSelect"
                                        checked={
                                          selectedOrgForAdd === org.orgId
                                        }
                                        onChange={() => {
                                          setSelectedOrgForAdd(org.orgId);
                                          setAccountSearchTerm("");
                                        }}
                                        className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                      />
                                      <span className="truncate text-slate-700">
                                        {org.orgId} - {org.orgName}
                                      </span>
                                    </label>
                                  ))}
                              </div>
                            </div>
                            {selectedOrgForAdd && (
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[12px] font-medium text-slate-700">
                                  Select Accounts
                                </label>
                                <div className="relative">
                                  <Search
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={14}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Search account..."
                                    value={accountSearchTerm}
                                    onChange={(e) =>
                                      setAccountSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <div className="max-h-32 overflow-y-auto border border-slate-100 rounded-md mt-1">
                                  {fetchingAccounts ? (
                                    <div className="px-3 py-2 text-[12px] text-slate-400">
                                      Loading...
                                    </div>
                                  ) : filteredAccounts.length === 0 ? (
                                    <div className="px-3 py-2 text-[12px] text-slate-400">
                                      No matching accounts found.
                                    </div>
                                  ) : (
                                    <>
                                      <label className="flex items-center gap-2.5 px-3 py-2 bg-slate-100 cursor-pointer text-[13px] border-b border-slate-200 font-semibold sticky top-0 z-10">
                                        <input
                                          type="checkbox"
                                          checked={isAllAccSelected}
                                          onChange={() => {
                                            if (isAllAccSelected) {
                                              setSelectedOrgAccounts((prev) =>
                                                prev.filter(
                                                  (id) =>
                                                    !filteredAccounts.find(
                                                      (a) => a.acctId === id,
                                                    ),
                                                ),
                                              );
                                            } else {
                                              const newIds =
                                                filteredAccounts.map(
                                                  (a) => a.acctId,
                                                );
                                              setSelectedOrgAccounts((prev) => [
                                                ...new Set([
                                                  ...prev,
                                                  ...newIds,
                                                ]),
                                              ]);
                                            }
                                          }}
                                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <span className="text-slate-800">
                                          Select All ({filteredAccounts.length})
                                        </span>
                                      </label>
                                      {filteredAccounts.map((acct) => (
                                        <label
                                          key={`lab-acc-${acct.acctId}`}
                                          className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={selectedOrgAccounts.includes(
                                              acct.acctId,
                                            )}
                                            onChange={() =>
                                              toggleOrgAccount(acct.acctId)
                                            }
                                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                          />
                                          <span className="truncate text-slate-700">
                                            {acct.acctId} -{" "}
                                            {coaMap[acct.acctId]?.name}
                                          </span>
                                        </label>
                                      ))}
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddLabor(false);
                                setSelectedOrgForAdd("");
                                setOrgAccounts([]);
                                setSelectedOrgAccounts([]);
                                setOrgSearchTerm("");
                                setAccountSearchTerm("");
                              }}
                              className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-medium hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddByAccount("Labor")}
                              disabled={selectedOrgAccounts.length === 0}
                              className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                              Add Selected
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* NON-LABOR ADD DROPDOWN */}
                {activeTab === "Non-Labor" &&
                  showAddNonLabor &&
                  !isApproved && (
                    <div className="absolute top-12 left-4 bg-white border border-slate-200 rounded-lg shadow-xl z-50 w-[380px] flex flex-col overflow-hidden">
                      <div className="flex bg-slate-50 border-b border-slate-200">
                        <button
                          type="button"
                          onClick={() => setNonLaborAddTab("Vendor")}
                          className={`flex-1 py-2.5 text-[12px] font-medium ${nonLaborAddTab === "Vendor" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                        >
                          Vendor
                        </button>
                        <button
                          type="button"
                          onClick={() => setNonLaborAddTab("Project")}
                          className={`flex-1 py-2.5 text-[12px] font-medium ${nonLaborAddTab === "Project" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                        >
                          Project
                        </button>
                        <button
                          type="button"
                          onClick={() => setNonLaborAddTab("Org/Account")}
                          className={`flex-1 py-2.5 text-[12px] font-medium ${nonLaborAddTab === "Org/Account" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                        >
                          Org/Account
                        </button>
                        <button
                          type="button"
                          onClick={() => setNonLaborAddTab("Other")}
                          className={`flex-1 py-2.5 text-[12px] font-medium ${nonLaborAddTab === "Other" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                        >
                          Custom
                        </button>
                      </div>
                      {/* <div className="p-4">
                        {nonLaborAddTab === "Vendor" && (
                          <>
                            {/* <div className="mb-3 relative">
                              <Search
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                size={14}
                              />
                              <input
                                type="text"
                                placeholder="Search vendor..."
                                value={vendorSearchTerm}
                                onChange={(e) =>
                                  setVendorSearchTerm(e.target.value)
                                }
                                className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500"
                              /> */}
                      {/* </div> */}
                      {/* <div className="max-h-56 overflow-y-auto mb-4 border border-slate-100 rounded-md">
                              {filteredVendors.length > 0 && (
                                <label className="flex items-center gap-2.5 px-3 py-2 bg-slate-100 cursor-pointer text-[13px] border-b border-slate-200 font-semibold sticky top-0 z-10">
                                  <input
                                    type="checkbox"
                                    checked={isAllVenSelected}
                                    onChange={() => {
                                      if (isAllVenSelected) {
                                        setSelectedVendors((prev) =>
                                          prev.filter(
                                            (id) =>
                                              !filteredVendors.find(
                                                (v) => v.vendId === id,
                                              ),
                                          ),
                                        );
                                      } else {
                                        const newIds = filteredVendors.map(
                                          (v) => v.vendId,
                                        );
                                        setSelectedVendors((prev) => [
                                          ...new Set([...prev, ...newIds]),
                                        ]);
                                      }
                                    }}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                  />
                                  <span className="text-slate-800">
                                    Select All ({filteredVendors.length})
                                  </span>
                                </label>
                              )}
                              {filteredVendors.map((v) => (
                                <label
                                  key={v.vendId}
                                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedVendors.includes(v.vendId)}
                                    onChange={() =>
                                      toggleVendorSelection(v.vendId)
                                    }
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                  />
                                  <span className="truncate text-slate-700">
                                    {v.vendId} -{" "}
                                    {v.vendEmplName ||
                                      `${v.firstName || ""} ${v.lastName || ""}`.trim()}
                                  </span>
                                </label>
                              ))}
                            </div> */}
                      {/* <div className="flex justify-end gap-2 mt-2"> */}
                      {/* <button */}
                      {/* type="button" */}
                      {/* onClick={() => { */}
                      <div className="p-4">
                        {nonLaborAddTab === "Vendor" && (
                          <>
                            <div className="mb-3 relative">
                              <Search
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                size={14}
                              />
                              <input
                                type="text"
                                placeholder="Search vendor..."
                                value={vendorSearchTerm}
                                onChange={(e) =>
                                  setVendorSearchTerm(e.target.value)
                                }
                                className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="max-h-56 overflow-y-auto mb-4 border border-slate-100 rounded-md">
                              {filteredVendors.length > 0 && (
                                <label className="flex items-center gap-2.5 px-3 py-2 bg-slate-100 cursor-pointer text-[13px] border-b border-slate-200 font-semibold sticky top-0 z-10">
                                  <input
                                    type="checkbox"
                                    checked={isAllVenSelected}
                                    onChange={() => {
                                      if (isAllVenSelected) {
                                        setSelectedVendors((prev) =>
                                          prev.filter(
                                            (id) =>
                                              !filteredVendors.find(
                                                (v) =>
                                                  String(v.vendId) ===
                                                  String(id),
                                              ),
                                          ),
                                        );
                                      } else {
                                        const newIds = filteredVendors.map(
                                          (v) => String(v.vendId),
                                        );
                                        setSelectedVendors((prev) => [
                                          ...new Set([...prev, ...newIds]),
                                        ]);
                                      }
                                    }}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                  />
                                  <span className="text-slate-800">
                                    Select All ({filteredVendors.length})
                                  </span>
                                </label>
                              )}
                              {/* {filteredVendors.map((v) => (
                                <label key={v.vendId} className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0">
                                  <input
                                    type="checkbox"
                                    checked={selectedVendors.includes(String(v.vendId))}
                                    onChange={() => toggleVendorSelection(String(v.vendId))}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                  />
                                  <span className="truncate text-slate-700">
                                    {v.vendId} - {v.vendEmplName || `${v.firstName || ""} ${v.lastName || ""}`.trim()}
                                  </span>
                                </label> */}
                              {/* ))} */}
                              {filteredVendors.map((v) => (
                                <label
                                  key={v.vendId}
                                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedVendors.includes(
                                      String(v.vendId),
                                    )}
                                    onChange={() =>
                                      toggleVendorSelection(String(v.vendId))
                                    }
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                  />
                                  <span className="truncate text-slate-700">
                                    {v.vendId} - {v.vendName}
                                  </span>
                                </label>
                              ))}
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddNonLabor(false);
                                  setSelectedVendors([]);
                                  setVendorSearchTerm("");
                                }}
                                className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-medium hover:bg-slate-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleAddSelectedVendors}
                                disabled={selectedVendors.length === 0}
                                className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                              >
                                Add Selected
                              </button>
                            </div>
                          </>
                        )}
                        {nonLaborAddTab === "Project" && (
                          <>
                            <div className="flex gap-2 mb-3">
                              <div className="relative flex-1">
                                <Search
                                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                  size={14}
                                />
                                <input
                                  type="text"
                                  placeholder="Search project ID..."
                                  value={projectSearchTerm}
                                  onChange={(e) =>
                                    setProjectSearchTerm(e.target.value)
                                  }
                                  onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    handleSearchProjectsFromApi()
                                  }
                                  className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={handleSearchProjectsFromApi}
                                className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md text-[12px] font-medium hover:bg-indigo-100 transition-colors shadow-sm"
                              >
                                Search
                              </button>
                            </div>
                            <div className="max-h-56 overflow-y-auto mb-4 border border-slate-100 rounded-md">
                              {filteredSearchedProjects.length > 0 && (
                                <label className="flex items-center gap-2.5 px-3 py-2 bg-slate-100 cursor-pointer text-[13px] border-b border-slate-200 font-semibold sticky top-0 z-10">
                                  <input
                                    type="checkbox"
                                    checked={isAllProjSelected}
                                    onChange={() => {
                                      if (isAllProjSelected) {
                                        setSelectedProjects((prev) =>
                                          prev.filter(
                                            (id) =>
                                              !filteredSearchedProjects.find(
                                                (p) => p.projectId === id,
                                              ),
                                          ),
                                        );
                                      } else {
                                        const newIds =
                                          filteredSearchedProjects.map(
                                            (p) => p.projectId,
                                          );
                                        setSelectedProjects((prev) => [
                                          ...new Set([...prev, ...newIds]),
                                        ]);
                                      }
                                    }}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                  />
                                  <span className="text-slate-800">
                                    Select All (
                                    {filteredSearchedProjects.length})
                                  </span>
                                </label>
                              )}
                              {filteredSearchedProjects.map((p) => (
                                <label
                                  key={p.projectId}
                                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedProjects.includes(
                                      p.projectId,
                                    )}
                                    onChange={() =>
                                      toggleProjectSelection(p.projectId)
                                    }
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                  />
                                  <span className="truncate text-slate-700">
                                    {p.projectId} - {p.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddNonLabor(false);
                                  setSelectedProjects([]);
                                  setSearchedProjects([]);
                                  setProjectSearchTerm("");
                                }}
                                className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-medium hover:bg-slate-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleAddSelectedProjects("Non-Labor")
                                }
                                disabled={selectedProjects.length === 0}
                                className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                              >
                                Add Selected
                              </button>
                            </div>
                          </>
                        )}
                        {nonLaborAddTab === "Org/Account" && (
                          <>
                            <div className="flex flex-col gap-4 mb-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[12px] font-medium text-slate-700">
                                  Organization
                                </label>
                                <div className="relative">
                                  <Search
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={14}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Search org..."
                                    value={orgSearchTerm}
                                    onChange={(e) =>
                                      setOrgSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <div className="max-h-32 overflow-y-auto border border-slate-100 rounded-md mt-1">
                                  {orgs
                                    ?.filter(
                                      (org) =>
                                        org?.orgId
                                          ?.toLowerCase()
                                          .includes(
                                            orgSearchTerm.toLowerCase(),
                                          ) ||
                                        org?.orgName
                                          ?.toLowerCase()
                                          .includes(
                                            orgSearchTerm.toLowerCase(),
                                          ),
                                    )
                                    .map((org) => (
                                      <label
                                        key={`nl-org-${org.orgId}`}
                                        className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0"
                                      >
                                        <input
                                          type="radio"
                                          name="nonLaborOrgSelect"
                                          checked={
                                            selectedOrgForAdd === org.orgId
                                          }
                                          onChange={() => {
                                            setSelectedOrgForAdd(org.orgId);
                                            setAccountSearchTerm("");
                                          }}
                                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <span className="truncate text-slate-700">
                                          {org.orgId} - {org.orgName}
                                        </span>
                                      </label>
                                    ))}
                                </div>
                              </div>
                              {selectedOrgForAdd && (
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[12px] font-medium text-slate-700">
                                    Select Accounts
                                  </label>
                                  <div className="relative">
                                    <Search
                                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                      size={14}
                                    />
                                    <input
                                      type="text"
                                      placeholder="Search account..."
                                      value={accountSearchTerm}
                                      onChange={(e) =>
                                        setAccountSearchTerm(e.target.value)
                                      }
                                      className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                  </div>
                                  <div className="max-h-32 overflow-y-auto border border-slate-100 rounded-md mt-1">
                                    {fetchingAccounts ? (
                                      <div className="px-3 py-2 text-[12px] text-slate-400">
                                        Loading...
                                      </div>
                                    ) : filteredAccounts.length === 0 ? (
                                      <div className="px-3 py-2 text-[12px] text-slate-400">
                                        No matching accounts found.
                                      </div>
                                    ) : (
                                      <>
                                        <label className="flex items-center gap-2.5 px-3 py-2 bg-slate-100 cursor-pointer text-[13px] border-b border-slate-200 font-semibold sticky top-0 z-10">
                                          <input
                                            type="checkbox"
                                            checked={isAllAccSelected}
                                            onChange={() => {
                                              if (isAllAccSelected) {
                                                setSelectedOrgAccounts((prev) =>
                                                  prev.filter(
                                                    (id) =>
                                                      !filteredAccounts.find(
                                                        (a) => a.acctId === id,
                                                      ),
                                                  ),
                                                );
                                              } else {
                                                const newIds =
                                                  filteredAccounts.map(
                                                    (a) => a.acctId,
                                                  );
                                                setSelectedOrgAccounts(
                                                  (prev) => [
                                                    ...new Set([
                                                      ...prev,
                                                      ...newIds,
                                                    ]),
                                                  ],
                                                );
                                              }
                                            }}
                                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                          />
                                          <span className="text-slate-800">
                                            Select All (
                                            {filteredAccounts.length})
                                          </span>
                                        </label>
                                        {filteredAccounts.map((acct) => (
                                          <label
                                            key={`nl-acc-${acct.acctId}`}
                                            className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={selectedOrgAccounts.includes(
                                                acct.acctId,
                                              )}
                                              onChange={() =>
                                                toggleOrgAccount(acct.acctId)
                                              }
                                              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                            />
                                            <span className="truncate text-slate-700">
                                              {acct.acctId} -{" "}
                                              {coaMap[acct.acctId]?.name}
                                            </span>
                                          </label>
                                        ))}
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddNonLabor(false);
                                  setSelectedOrgForAdd("");
                                  setOrgAccounts([]);
                                  setSelectedOrgAccounts([]);
                                  setOrgSearchTerm("");
                                  setAccountSearchTerm("");
                                }}
                                className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-medium hover:bg-slate-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddByAccount("Non-Labor")}
                                disabled={selectedOrgAccounts.length === 0}
                                className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                              >
                                Add Selected
                              </button>
                            </div>
                          </>
                        )}
                        {nonLaborAddTab === "Other" && (
                          <>
                            <div className="mb-6 text-[13px] text-slate-600">
                              Click below to insert a blank custom row into the
                              schedule.
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setShowAddNonLabor(false)}
                                className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-medium hover:bg-slate-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddOther("Non-Labor")}
                                className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                              >
                                Add Blank Row
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                {/* REVENUE ADD DROPDOWN */}
                {activeTab === "Revenue" && showAddRevenue && !isApproved && (
                  <div className="absolute top-12 left-4 bg-white border border-slate-200 rounded-lg shadow-xl z-50 w-[380px] flex flex-col overflow-hidden">
                    <div className="flex bg-slate-50 border-b border-slate-200">
                      <button
                        type="button"
                        onClick={() => setRevenueAddTab("Project")}
                        className={`flex-1 py-2.5 text-[12px] font-medium ${revenueAddTab === "Project" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        Project
                      </button>
                      <button
                        type="button"
                        onClick={() => setRevenueAddTab("Org/Account")}
                        className={`flex-1 py-2.5 text-[12px] font-medium ${revenueAddTab === "Org/Account" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        Org/Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setRevenueAddTab("Other")}
                        className={`flex-1 py-2.5 text-[12px] font-medium ${revenueAddTab === "Other" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        Custom
                      </button>
                    </div>
                    <div className="p-4">
                      {revenueAddTab === "Project" && (
                        <>
                          <div className="flex gap-2 mb-3">
                            <div className="relative flex-1">
                              <Search
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                size={14}
                              />
                              <input
                                type="text"
                                placeholder="Search project ID..."
                                value={projectSearchTerm}
                                onChange={(e) =>
                                  setProjectSearchTerm(e.target.value)
                                }
                                onKeyDown={(e) =>
                                  e.key === "Enter" &&
                                  handleSearchProjectsFromApi()
                                }
                                className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleSearchProjectsFromApi}
                              className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md text-[12px] font-medium hover:bg-indigo-100 transition-colors shadow-sm"
                            >
                              Search
                            </button>
                          </div>
                          <div className="max-h-56 overflow-y-auto mb-4 border border-slate-100 rounded-md">
                            {filteredSearchedProjects.length > 0 && (
                              <label className="flex items-center gap-2.5 px-3 py-2 bg-slate-100 cursor-pointer text-[13px] border-b border-slate-200 font-semibold sticky top-0 z-10">
                                <input
                                  type="checkbox"
                                  checked={isAllProjSelected}
                                  onChange={() => {
                                    if (isAllProjSelected) {
                                      setSelectedProjects((prev) =>
                                        prev.filter(
                                          (id) =>
                                            !filteredSearchedProjects.find(
                                              (p) => p.projectId === id,
                                            ),
                                        ),
                                      );
                                    } else {
                                      const newIds =
                                        filteredSearchedProjects.map(
                                          (p) => p.projectId,
                                        );
                                      setSelectedProjects((prev) => [
                                        ...new Set([...prev, ...newIds]),
                                      ]);
                                    }
                                  }}
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                />
                                <span className="text-slate-800">
                                  Select All ({filteredSearchedProjects.length})
                                </span>
                              </label>
                            )}
                            {filteredSearchedProjects.map((p) => (
                              <label
                                key={p.projectId}
                                className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedProjects.includes(
                                    p.projectId,
                                  )}
                                  onChange={() =>
                                    toggleProjectSelection(p.projectId)
                                  }
                                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                />
                                <span className="truncate text-slate-700">
                                  {p.projectId} - {p.name}
                                </span>
                              </label>
                            ))}
                          </div>
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddRevenue(false);
                                setSelectedProjects([]);
                                setSearchedProjects([]);
                                setProjectSearchTerm("");
                              }}
                              className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-medium hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleAddSelectedProjects("Revenue")
                              }
                              disabled={selectedProjects.length === 0}
                              className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                              Add Selected
                            </button>
                          </div>
                        </>
                      )}
                      {revenueAddTab === "Org/Account" && (
                        <>
                          <div className="flex flex-col gap-4 mb-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[12px] font-medium text-slate-700">
                                Organization
                              </label>
                              <div className="relative">
                                <Search
                                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                  size={14}
                                />
                                <input
                                  type="text"
                                  placeholder="Search org..."
                                  value={orgSearchTerm}
                                  onChange={(e) =>
                                    setOrgSearchTerm(e.target.value)
                                  }
                                  className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="max-h-32 overflow-y-auto border border-slate-100 rounded-md mt-1">
                                {orgs
                                  ?.filter(
                                    (org) =>
                                      org?.orgId
                                        ?.toLowerCase()
                                        .includes(
                                          orgSearchTerm.toLowerCase(),
                                        ) ||
                                      org?.orgName
                                        ?.toLowerCase()
                                        .includes(orgSearchTerm.toLowerCase()),
                                  )
                                  .map((org) => (
                                    <label
                                      key={`rev-org-${org.orgId}`}
                                      className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0"
                                    >
                                      <input
                                        type="radio"
                                        name="revenueOrgSelect"
                                        checked={
                                          selectedOrgForAdd === org.orgId
                                        }
                                        onChange={() => {
                                          setSelectedOrgForAdd(org.orgId);
                                          setAccountSearchTerm("");
                                        }}
                                        className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                      />
                                      <span className="truncate text-slate-700">
                                        {org.orgId} - {org.orgName}
                                      </span>
                                    </label>
                                  ))}
                              </div>
                            </div>
                            {selectedOrgForAdd && (
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[12px] font-medium text-slate-700">
                                  Select Accounts
                                </label>
                                <div className="relative">
                                  <Search
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={14}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Search account..."
                                    value={accountSearchTerm}
                                    onChange={(e) =>
                                      setAccountSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <div className="max-h-32 overflow-y-auto border border-slate-100 rounded-md mt-1">
                                  {fetchingAccounts ? (
                                    <div className="px-3 py-2 text-[12px] text-slate-400">
                                      Loading...
                                    </div>
                                  ) : filteredAccounts.length === 0 ? (
                                    <div className="px-3 py-2 text-[12px] text-slate-400">
                                      No matching accounts found.
                                    </div>
                                  ) : (
                                    <>
                                      <label className="flex items-center gap-2.5 px-3 py-2 bg-slate-100 cursor-pointer text-[13px] border-b border-slate-200 font-semibold sticky top-0 z-10">
                                        <input
                                          type="checkbox"
                                          checked={isAllAccSelected}
                                          onChange={() => {
                                            if (isAllAccSelected) {
                                              setSelectedOrgAccounts((prev) =>
                                                prev.filter(
                                                  (id) =>
                                                    !filteredAccounts.find(
                                                      (a) => a.acctId === id,
                                                    ),
                                                ),
                                              );
                                            } else {
                                              const newIds =
                                                filteredAccounts.map(
                                                  (a) => a.acctId,
                                                );
                                              setSelectedOrgAccounts((prev) => [
                                                ...new Set([
                                                  ...prev,
                                                  ...newIds,
                                                ]),
                                              ]);
                                            }
                                          }}
                                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <span className="text-slate-800">
                                          Select All ({filteredAccounts.length})
                                        </span>
                                      </label>
                                      {filteredAccounts.map((acct) => (
                                        <label
                                          key={`rev-acc-${acct.acctId}`}
                                          className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={selectedOrgAccounts.includes(
                                              acct.acctId,
                                            )}
                                            onChange={() =>
                                              toggleOrgAccount(acct.acctId)
                                            }
                                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                          />
                                          <span className="truncate text-slate-700">
                                            {acct.acctId} -{" "}
                                            {coaMap[acct.acctId]?.name}
                                          </span>
                                        </label>
                                      ))}
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddRevenue(false);
                                setSelectedOrgForAdd("");
                                setOrgAccounts([]);
                                setSelectedOrgAccounts([]);
                                setOrgSearchTerm("");
                                setAccountSearchTerm("");
                              }}
                              className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-medium hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddByAccount("Revenue")}
                              disabled={selectedOrgAccounts.length === 0}
                              className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                              Add Selected
                            </button>
                          </div>
                        </>
                      )}
                      {revenueAddTab === "Other" && (
                        <>
                          <div className="mb-6 text-[13px] text-slate-600">
                            Click below to insert a blank custom row into the
                            schedule.
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAddRevenue(false)}
                              className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-medium hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddOther("Revenue")}
                              className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                              Add Blank Row
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      rightPaneRef.current?.scrollBy({
                        left: -500,
                        behavior: "smooth",
                      })
                    }
                    className="px-2 py-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none"
                    title="Slide Left"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 py-1.5 text-[11px] font-medium text-slate-500 border-x border-slate-200">
                    Slide Months
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      rightPaneRef.current?.scrollBy({
                        left: 500,
                        behavior: "smooth",
                      })
                    }
                    className="px-2 py-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none"
                    title="Slide Right"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleSaveRecords}
                  disabled={
                    savingRecords ||
                    isApproved ||
                    loading ||
                    !configurationLoaded
                  }
                  className="px-5 py-2 bg-indigo-600 text-white font-medium text-[13px] rounded-md hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingRecords ? "Saving..." : "Save Records"}
                </button>
              </div>
            </div>

            {showImportActuals &&
              (activeTab === "Labor" ||
                activeTab === "Non-Labor" ||
                activeTab === "Revenue") &&
              !isApproved && (
                <div className="absolute inset-0 z-[80] bg-slate-900/30 flex items-start justify-center pt-20">
                  <div className="w-[390px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                      <h3 className="text-[14px] font-bold text-slate-800">
                        Import Actuals
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Automatically Populate Actual Records
                        {/* using all active
                        employees and all available vendors. */}
                      </p>
                    </div>
                    <div className="p-5 space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={importActualsLabor}
                          onChange={(e) =>
                            setImportActualsLabor(e.target.checked)
                          }
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <div>
                          <div className="text-[13px] font-semibold text-slate-800">
                            Labor
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {/* Uses Select All Employees and imports available
                            actual hours. */}
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={importActualsNonLabor}
                          onChange={(e) =>
                            setImportActualsNonLabor(e.target.checked)
                          }
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <div>
                          <div className="text-[13px] font-semibold text-slate-800">
                            Non-Labor
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {/* Uses Select All Vendors and populates available
                            actual vendor data. */}
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={importActualsRevenue}
                          onChange={(e) =>
                            setImportActualsRevenue(e.target.checked)
                          }
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <div>
                          <div className="text-[13px] font-semibold text-slate-800">
                            Revenue
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Import revenue accounts from PSR actuals.
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowImportActuals(false)}
                        className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-medium hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleImportActuals}
                        disabled={
                          loading ||
                          savingRecords ||
                          !configurationLoaded ||
                          (!importActualsLabor &&
                            !importActualsNonLabor &&
                            !importActualsRevenue)
                        }
                        className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] font-medium hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Import Actuals
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* Split Panes */}
            <div className="flex flex-1 w-full min-h-0 bg-slate-50 border-b border-slate-200">
              {/* LEFT PANE - FIXED COLUMNS */}
              <div
                ref={leftPaneRef}
                className="flex-none shadow-[4px_0_12px_rgba(0,0,0,0.05)] z-20 bg-white border-r border-slate-200 overflow-y-hidden overflow-x-auto custom-scrollbar"
                style={{
                  resize: "horizontal",
                  width: "50%",
                  minWidth: "30%",
                  maxWidth: "80%",
                }}
              >
                <table className="border-collapse tabular-nums whitespace-nowrap text-[13px] table-fixed w-max">
                  <thead className="bg-slate-50 sticky top-0 z-50 shadow-[0_1px_0_0_#e2e8f0]">
                    <tr className="text-slate-500 text-[11px] font-semibold tracking-wider">
                      {(activeTab === "Labor"
                        ? laborLeftCols
                        : activeTab === "Revenue"
                          ? revenueLeftCols
                          : nonLaborLeftCols
                      ).map((col, index) => (
                        <th
                          key={`left-th-${col.key}`}
                          className={`px-3 py-2 text-left border-r border-slate-200 relative group select-none ${col.key === "select" ? "text-center" : ""}`}
                          style={{ minWidth: col.w, maxWidth: col.w }}
                        >
                          <div
                            className={`flex items-center ${col.key === "select" ? "justify-center" : "justify-between"} gap-1`}
                          >
                            {col.key === "select" ? (
                              <input
                                type="checkbox"
                                className="cursor-pointer w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                disabled={
                                  isApproved ||
                                  getActiveFilteredData().length === 0
                                }
                                checked={
                                  getActiveFilteredData().length > 0 &&
                                  getActiveFilteredData().every((r) =>
                                    selectedRowUids.includes(r.uid),
                                  )
                                }
                                onChange={(e) => {
                                  const filteredUids =
                                    getActiveFilteredData().map((r) => r.uid);
                                  if (e.target.checked) {
                                    setSelectedRowUids((prev) => [
                                      ...new Set([...prev, ...filteredUids]),
                                    ]);
                                  } else {
                                    setSelectedRowUids((prev) =>
                                      prev.filter(
                                        (uid) => !filteredUids.includes(uid),
                                      ),
                                    );
                                  }
                                }}
                              />
                            ) : (
                              <span className="truncate">{col.label}</span>
                            )}

                            {col.key !== "action" &&
                            col.key !== "select" &&
                            (activeTab === "Labor" ||
                              activeTab === "Non-Labor") ? (
                              <button
                                type="button"
                                onClick={() => handleSort(col.key)}
                                className="flex-shrink-0 p-0.5 rounded hover:bg-slate-200"
                                title={`Sort by ${col.label}`}
                              >
                                <ArrowUpDown
                                  className={
                                    sortConfig.key === col.key
                                      ? "text-indigo-600"
                                      : "text-slate-300 hover:text-slate-500"
                                  }
                                  size={12}
                                />
                              </button>
                            ) : col.key !== "action" && col.key !== "select" ? (
                              <Filter
                                className="text-slate-300 hover:text-slate-500 cursor-pointer flex-shrink-0"
                                size={12}
                              />
                            ) : null}
                          </div>
                          {col.key !== "action" && col.key !== "select" && (
                            <div
                              className="absolute right-0 top-0 h-full w-[3px] cursor-col-resize hover:bg-indigo-300 z-50 transition-colors"
                              onMouseDown={(e) =>
                                handleMouseDownResize(e, index)
                              }
                            />
                          )}
                        </th>
                      ))}
                    </tr>

                    {/* FILTER ROW */}
                    {showFilters && (
                      <tr className="bg-slate-100 border-b border-slate-200">
                        {(activeTab === "Labor"
                          ? laborLeftCols
                          : activeTab === "Revenue"
                            ? revenueLeftCols
                            : nonLaborLeftCols
                        ).map((col) => (
                          <th
                            key={`filter-${col.key}`}
                            className="px-2 py-1.5 border-r border-slate-200 font-normal"
                          >
                            {col.key !== "select" && col.key !== "action" ? (
                              <input
                                type="text"
                                value={columnFilters[col.key] || ""}
                                onChange={(e) =>
                                  setColumnFilters({
                                    ...columnFilters,
                                    [col.key]: e.target.value,
                                  })
                                }
                                className="w-full text-[11px] px-1.5 py-1 border border-slate-300 rounded outline-none focus:border-indigo-500 text-slate-700"
                                placeholder="Filter..."
                              />
                            ) : (
                              <div className="h-[26px]"></div>
                            )}
                          </th>
                        ))}
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {getActiveGridData().length > 0 ? (
                      getActiveGridData().map((row, idx) => {
                        const isFlashing =
                          highlightedRow === row.uid ||
                          highlightedRow === "column_flash";
                        const activeCols =
                          activeTab === "Labor"
                            ? laborLeftCols
                            : activeTab === "Revenue"
                              ? revenueLeftCols
                              : nonLaborLeftCols;
                        return (
                          <tr
                            key={row.uid || idx}
                            className={`transition-colors border-b border-slate-100 ${isFlashing ? "bg-emerald-50" : "hover:bg-slate-50"}`}
                          >
                            {activeCols.map((col) => {
                              if (col.key === "select") {
                                return (
                                  <td
                                    key={`left-td-${col.key}-${idx}`}
                                    className="border-r border-slate-100 text-center p-0 h-[36px]"
                                    style={{ minWidth: col.w, maxWidth: col.w }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedRowUids.includes(
                                        row.uid,
                                      )}
                                      onChange={() => {
                                        setSelectedRowUids((prev) =>
                                          prev.includes(row.uid)
                                            ? prev.filter(
                                                (id) => id !== row.uid,
                                              )
                                            : [...prev, row.uid],
                                        );
                                      }}
                                      className="cursor-pointer w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                      disabled={isApproved}
                                    />
                                  </td>
                                );
                              }

                              if (col.key === "action") {
                                return (
                                  <td
                                    key={`left-td-${col.key}-${idx}`}
                                    className="border-r border-slate-100 text-center p-0 h-[36px]"
                                    style={{ minWidth: col.w, maxWidth: col.w }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteRow(row)}
                                      disabled={isApproved}
                                      className="w-full h-full text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </td>
                                );
                              }

                              let inputElement = (
                                <input
                                  type="text"
                                  disabled={isApproved}
                                  value={row[col.key] || ""}
                                  onChange={(e) =>
                                    handleLeftPaneChange(
                                      row.uid,
                                      col.key,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full h-full min-h-[34px] outline-none focus:ring-inset focus:ring-1 focus:ring-indigo-500 px-3 disabled:text-slate-400 text-[12px] transition-colors bg-transparent hover:bg-white text-slate-700 focus:bg-white rounded-sm"
                                  title={row[col.key] || ""}
                                />
                              );

                              // Strictly non-editable columns
                              if (
                                col.key === "pbrGroup" ||
                                col.key === "orgName" ||
                                col.key === "empName" ||
                                col.key === "empStatus" ||
                                col.key === "vendorName" ||
                                col.key === "projName"
                              ) {
                                // const displayValue =
                                //   col.key === "orgName"
                                //     ? row.orgName || resolveOrgName(row.orgId)
                                //     : row[col.key];
                                // inputElement = (
                                //   <div className="px-3 py-2 text-[12px] truncate text-slate-500 select-none bg-slate-50/50 h-full w-full border-b border-transparent">
                                //     {displayValue || "-"}
                                //   </div>
                                // );
                                const displayValue =
                                  col.key === "orgName"
                                    ? row.orgName || resolveOrgName(row.orgId)
                                    : col.key === "projName"
                                      ? row.projName && row.projName !== "NA"
                                        ? row.projName
                                        : allProjects.find(
                                            (p) =>
                                              p.projectId ===
                                              getTopLevelProj(row.projId),
                                          )?.name || row.projName
                                      : row[col.key];
                                inputElement = (
                                  <div className="px-3 py-2 text-[12px] truncate text-slate-500 select-none bg-slate-50/50 h-full w-full border-b border-transparent">
                                    {displayValue || "-"}
                                  </div>
                                );
                              } else if (col.key === "rate" && !isApproved) {
                                inputElement = (
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={row.rate === 0 ? "" : row.rate}
                                    disabled={!hasOpenPeriods}
                                    onChange={(e) =>
                                      handleLeftPaneChange(
                                        row.uid,
                                        "rate",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="0.00"
                                    className="w-full h-full min-h-[34px] outline-none focus:ring-inset focus:ring-1 focus:ring-indigo-500 px-3 text-[12px] truncate transition-colors bg-transparent hover:bg-white text-slate-700 focus:bg-white rounded-sm"
                                  />
                                );
                              } else if (col.key === "projId" && !isApproved) {
                                inputElement = (
                                  <>
                                    <input
                                      type="text"
                                      list={`suggestions-${row.uid}`}
                                      value={
                                        row.projId === "NA" ? "" : row.projId
                                      }
                                      onChange={async (e) => {
                                        const val =
                                          e.target.value.toUpperCase();
                                        handleLeftPaneChange(
                                          row.uid,
                                          "projId",
                                          val,
                                        );
                                        if (val.length >= 4) {
                                          try {
                                            const res = await axios.get(
                                              `${backendUrl}/Project/GetAllProjectsForSearch/${val}`,
                                            );
                                            const data = Array.isArray(res.data)
                                              ? res.data
                                              : res.data?.results || [res.data];
                                            const topMap = new Map();
                                            data
                                              .filter(Boolean)
                                              .forEach((p) => {
                                                const topId = getTopLevelProj(
                                                  p.projectId,
                                                );
                                                if (!topMap.has(topId))
                                                  topMap.set(topId, {
                                                    id: topId,
                                                    name: p.name,
                                                  });
                                              });
                                            setProjectSuggestions(
                                              Array.from(topMap.values()),
                                            );
                                          } catch (err) {
                                            console.warn(
                                              "Project suggestion fetch failed",
                                              err,
                                            );
                                          }
                                        } else {
                                          setProjectSuggestions([]);
                                        }
                                      }}
                                      onBlur={(e) => {
                                        const val = getTopLevelProj(
                                          e.target.value,
                                        );
                                        if (!val || val.trim() === "") {
                                          handleLeftPaneChange(
                                            row.uid,
                                            "projId",
                                            "NA",
                                          );
                                          handleLeftPaneChange(
                                            row.uid,
                                            "projName",
                                            "NA",
                                          );
                                        } else {
                                          handleLeftPaneChange(
                                            row.uid,
                                            "projId",
                                            val,
                                          );
                                          const match =
                                            projectSuggestions.find(
                                              (p) => p.id === val,
                                            ) ||
                                            allProjects.find(
                                              (p) => p.projectId === val,
                                            );
                                          if (match)
                                            handleLeftPaneChange(
                                              row.uid,
                                              "projName",
                                              match.name,
                                            );
                                        }
                                      }}
                                      placeholder="NA"
                                      className="w-full h-full min-h-[34px] outline-none focus:ring-inset focus:ring-1 focus:ring-indigo-500 px-3 text-[12px] truncate transition-colors bg-transparent hover:bg-white text-slate-700 focus:bg-white rounded-sm"
                                    />
                                    <datalist id={`suggestions-${row.uid}`}>
                                      {projectSuggestions.map((p) => (
                                        <option key={p.id} value={p.id}>
                                          {p.name}
                                        </option>
                                      ))}
                                    </datalist>
                                  </>
                                );
                              } else if (col.key === "acctId" && !isApproved) {
                                inputElement = (
                                  <select
                                    value={row.acctId || ""}
                                    onChange={(e) =>
                                      handleLeftPaneChange(
                                        row.uid,
                                        "acctId",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full h-full min-h-[34px] outline-none focus:ring-inset focus:ring-1 focus:ring-indigo-500 px-2 text-[12px] truncate transition-colors cursor-pointer bg-transparent hover:bg-white text-slate-700 focus:bg-white rounded-sm"
                                  >
                                    <option value="" className="text-slate-400">
                                      Select...
                                    </option>
                                    {Object.keys(coaMap)
                                      // Account-type restriction intentionally disabled for Labor/Non-Labor.
                                      // .filter((k) => isVisibleAccount(coaMap[k]))
                                      .map((k) => (
                                        <option
                                          key={`sel-accid-${k}-${idx}`}
                                          value={k}
                                        >
                                          {k}
                                        </option>
                                      ))}
                                  </select>
                                );
                              }

                              return (
                                <td
                                  key={`left-td-${col.key}-${idx}`}
                                  className="border-r border-slate-100 h-[36px] truncate p-0"
                                  style={{ minWidth: col.w, maxWidth: col.w }}
                                >
                                  {inputElement}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={15}
                          className="px-4 py-8 text-center text-slate-400 text-[13px]"
                        >
                          No records found.
                        </td>
                      </tr>
                    )}
                    {/* Sticky Footer */}
                    <tr className="bg-slate-50 border-t border-slate-200 font-semibold text-[13px] sticky bottom-0 z-40 shadow-[0_-1px_0_0_#e2e8f0]">
                      <td
                        colSpan={
                          activeTab === "Labor"
                            ? laborLeftCols.length
                            : activeTab === "Revenue"
                              ? revenueLeftCols.length
                              : nonLaborLeftCols.length
                        }
                        className="px-4 py-2 text-right text-slate-800"
                      >
                        Total
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* RIGHT PANE - SCROLLABLE COLUMNS */}
              <div
                ref={rightPaneRef}
                onScroll={(e) => {
                  if (leftPaneRef.current)
                    leftPaneRef.current.scrollTop = e.currentTarget.scrollTop;
                }}
                className="flex-1 min-w-0 overflow-auto bg-white scroll-smooth custom-scrollbar"
              >
                <table
                  className="border-collapse tabular-nums whitespace-nowrap text-[13px]"
                  style={{ width: "max-content" }}
                >
                  <thead className="bg-slate-50 sticky top-0 z-50 shadow-[0_1px_0_0_#e2e8f0]">
                    <tr className="text-slate-500 text-[11px] font-semibold tracking-wider">
                      {activeTab === "Labor" ? (
                        <>
                          <th className="px-3 py-2 text-right border-r border-slate-200 min-w-[120px]">
                            Inflation Rate %
                          </th>
                          <th className="px-3 py-2 text-right border-r border-slate-200 min-w-[140px]">
                            Inflated Hourly Rate
                          </th>
                          <th className="px-3 py-2 text-right border-r border-slate-200 min-w-[100px]">
                            Total Hours
                          </th>
                          <th className="px-3 py-2 text-right border-r border-slate-200 min-w-[120px]">
                            Total Amount
                          </th>
                          {months.map((m) => (
                            <React.Fragment key={m}>
                              <th className="px-3 py-2 text-right border-r border-slate-200 min-w-[100px]">
                                {m} Hrs
                              </th>
                              <th className="px-3 py-2 text-right border-r border-slate-200 min-w-[100px]">
                                {m} Amt
                              </th>
                            </React.Fragment>
                          ))}
                        </>
                      ) : (
                        <>
                          {activeTab !== "Revenue" && (
                            <th className="px-3 py-2 text-right border-r border-slate-200 min-w-[120px]">
                              Inflation Rate %
                            </th>
                          )}
                          <th className="px-3 py-2 text-right border-r border-slate-200 min-w-[120px]">
                            Total Amount
                          </th>
                          {months.map((m) => (
                            <th
                              key={m}
                              className="px-3 py-2 text-right border-r border-slate-200 min-w-[100px]"
                            >
                              {activeTab === "Non-Labor"
                                ? `${m}  Amt / Inflated Amt`
                                : `${m} Amt`}
                            </th>
                          ))}
                        </>
                      )}
                    </tr>

                    {/* FILTER ROW (EMPTY SPACE FOR SCROLL PANE) */}
                    {showFilters && (
                      <tr className="bg-slate-100 border-b border-slate-200">
                        {activeTab === "Labor" ? (
                          <>
                            <th className="px-2 py-1.5 border-r border-slate-200"></th>
                            <th className="px-2 py-1.5 border-r border-slate-200"></th>
                            <th className="px-2 py-1.5 border-r border-slate-200">
                              <div className="h-[26px]"></div>
                            </th>
                            <th className="px-2 py-1.5 border-r border-slate-200"></th>
                            {months.map((m) => (
                              <React.Fragment key={`f-rt-${m}`}>
                                <th className="px-2 py-1.5 border-r border-slate-200"></th>
                                <th className="px-2 py-1.5 border-r border-slate-200"></th>
                              </React.Fragment>
                            ))}
                          </>
                        ) : (
                          <>
                            {activeTab !== "Revenue" && (
                              <th className="px-2 py-1.5 border-r border-slate-200">
                                <div className="h-[26px]"></div>
                              </th>
                            )}
                            <th className="px-2 py-1.5 border-r border-slate-200">
                              <div className="h-[26px]"></div>
                            </th>
                            {months.map((m) => (
                              <th
                                key={`f-rt-${m}`}
                                className="px-2 py-1.5 border-r border-slate-200"
                              ></th>
                            ))}
                          </>
                        )}
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {getActiveGridData().length > 0 ? (
                      getActiveGridData().map((row, idx) => {
                        const isFlashing =
                          highlightedRow === row.uid ||
                          highlightedRow === "column_flash";
                        return (
                          <tr
                            key={row.uid || idx}
                            className={`transition-colors border-b border-slate-100 ${isFlashing ? "bg-emerald-50" : "hover:bg-slate-50 group"}`}
                          >
                            {activeTab === "Labor" ? (
                              <>
                                <td className="border-r border-slate-100 h-[36px] p-0">
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={row.inflationRate ?? 0}
                                    disabled={isApproved || !hasOpenPeriods}
                                    onChange={(e) =>
                                      handleLeftPaneChange(
                                        row.uid,
                                        "inflationRate",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full min-h-[34px] px-3 text-right text-[12px] bg-transparent outline-none focus:ring-1 focus:ring-indigo-500 disabled:text-slate-400"
                                  />
                                </td>
                                <td className="px-3 py-1.5 border-r border-slate-100 text-right text-slate-600">
                                  {formatCurrency(
                                    Number(row.rate || 0) *
                                      (1 +
                                        Number(row.inflationRate || 0) / 100),
                                  )}
                                </td>
                                {/* <td className="px-3 py-1.5 border-r border-slate-100 text-right font-medium text-slate-800 h-[36px]">{row.totalHours || "0.00"}</td> */}
                                <td className="px-3 py-1.5 border-r border-slate-100 text-right font-medium text-slate-800 h-[36px]">
                                  {" "}
                                  {Number(row.totalHours || 0).toFixed(2)}
                                </td>
                                <td className="px-3 py-1.5 border-r border-slate-100 text-right font-semibold text-indigo-700 h-[36px]">
                                  {formatCurrency(row.totalAmount)}
                                </td>
                                {months.map((m) => (
                                  <React.Fragment key={`td-${m}-${idx}`}>
                                    <td className="border-r border-slate-100 h-[36px] relative p-0">
                                      <div className="flex items-center justify-end h-full w-full">
                                        <input
                                          type="number"
                                          step="0.01"
                                          disabled={
                                            isApproved || isMonthLocked(m)
                                          }
                                          value={
                                            row[`${m}Hours`] === undefined ||
                                            row[`${m}Hours`] === null
                                              ? ""
                                              : row[`${m}Hours`]
                                          }
                                          onChange={(e) =>
                                            handleAmountChange(
                                              row.uid,
                                              m,
                                              e.target.value,
                                            )
                                          }
                                          className="w-full h-full min-h-[34px] border-none px-3 text-right text-[12px] text-slate-700 outline-none focus:ring-inset focus:ring-1 focus:ring-indigo-500 bg-transparent hover:bg-white focus:bg-white disabled:text-slate-400 rounded-sm"
                                        />
                                        {!isApproved && !isMonthLocked(m) && (
                                          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity absolute left-1">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleFillRowForward(
                                                  row.uid,
                                                  m,
                                                  row[`${m}Hours`],
                                                )
                                              }
                                              className="text-slate-400 hover:text-indigo-600 focus:outline-none"
                                            >
                                              <ChevronsRight size={12} />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleFillColumnDown(
                                                  row.uid,
                                                  m,
                                                  row[`${m}Hours`],
                                                )
                                              }
                                              className="text-slate-400 hover:text-indigo-600 focus:outline-none"
                                            >
                                              <ChevronsDown size={12} />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-3 py-1.5 border-r border-slate-100 text-right h-[36px] text-slate-600">
                                      {formatCurrency(row[`${m}Amount`])}
                                    </td>
                                  </React.Fragment>
                                ))}
                              </>
                            ) : (
                              <>
                                {activeTab !== "Revenue" && (
                                  <td className="border-r border-slate-100 h-[36px] p-0">
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={row.inflationRate ?? 0}
                                      disabled={isApproved || !hasOpenPeriods}
                                      onChange={(e) =>
                                        handleLeftPaneChange(
                                          row.uid,
                                          "inflationRate",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full min-h-[34px] px-3 text-right text-[12px] bg-transparent outline-none focus:ring-1 focus:ring-indigo-500 disabled:text-slate-400"
                                    />
                                  </td>
                                )}
                                <td className="px-3 py-1.5 border-r border-slate-100 text-right font-semibold text-indigo-700 h-[36px]">
                                  {formatCurrency(row.totalAmount)}
                                </td>
                                {months.map((m) => (
                                  <React.Fragment key={`td-nl-${m}-${idx}`}>
                                    <td className="border-r border-slate-100 h-[36px] relative p-0">
                                      <div className="flex items-center justify-end h-full w-full">
                                        <input
                                          type="number"
                                          step="0.01"
                                          disabled={
                                            isApproved || isMonthLocked(m)
                                          }
                                          value={
                                            activeTab === "Non-Labor"
                                              ? isMonthLocked(m)
                                                ? Number(row[`${m}Amount`] || 0)
                                                : (row._baseAmountInputs?.[m] ??
                                                  Number(
                                                    getPbrBaseAmount(
                                                      row,
                                                      m,
                                                    ).toFixed(2),
                                                  ))
                                              : (row[`${m}Amount`] ?? "")
                                          }
                                          onChange={(e) =>
                                            handleAmountChange(
                                              row.uid,
                                              m,
                                              e.target.value,
                                            )
                                          }
                                          className="w-full h-full min-h-[34px] border-none px-3 text-right text-[12px] text-slate-700 outline-none focus:ring-inset focus:ring-1 focus:ring-indigo-500 bg-transparent hover:bg-white focus:bg-white disabled:text-slate-400 rounded-sm"
                                        />
                                        {activeTab === "Non-Labor" &&
                                          !isMonthLocked(m) && (
                                            <span
                                              className="px-2 text-[12px] font-medium text-indigo-700"
                                              title="Amount after inflation"
                                            >
                                              {formatCurrency(
                                                row[`${m}Amount`],
                                              )}
                                            </span>
                                          )}
                                        {!isApproved && !isMonthLocked(m) && (
                                          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity absolute left-1">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleFillRowForward(
                                                  row.uid,
                                                  m,
                                                  activeTab === "Non-Labor"
                                                    ? getPbrBaseAmount(row, m)
                                                    : row[`${m}Amount`],
                                                )
                                              }
                                              className="text-slate-400 hover:text-indigo-600 focus:outline-none"
                                            >
                                              <ChevronsRight size={12} />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleFillColumnDown(
                                                  row.uid,
                                                  m,
                                                  activeTab === "Non-Labor"
                                                    ? getPbrBaseAmount(row, m)
                                                    : row[`${m}Amount`],
                                                )
                                              }
                                              className="text-slate-400 hover:text-indigo-600 focus:outline-none"
                                            >
                                              <ChevronsDown size={12} />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </React.Fragment>
                                ))}
                              </>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={30} className="px-4 py-8"></td>
                      </tr>
                    )}
                    {/* Sticky Footer */}
                    <tr className="bg-slate-50 border-t border-slate-200 font-semibold text-[13px] sticky bottom-0 z-40 shadow-[0_-1px_0_0_#e2e8f0]">
                      {activeTab === "Labor" ? (
                        <>
                          <td className="px-3 py-2 border-r border-slate-200 text-right">
                            -
                          </td>
                          <td className="px-3 py-2 border-r border-slate-200 text-right">
                            -
                          </td>
                          <td className="px-3 py-2 border-r border-slate-200 text-right text-slate-800">
                            {getActiveFilteredData()
                              .reduce(
                                (sum, row) => sum + Number(row.totalHours || 0),
                                0,
                              )
                              .toFixed(2)}
                          </td>
                          <td className="px-3 py-2 border-r border-slate-200 text-right text-indigo-700">
                            {formatCurrency(
                              getActiveFilteredData().reduce(
                                (sum, row) =>
                                  sum + Number(row.totalAmount || 0),
                                0,
                              ),
                            )}
                          </td>
                          {months.map((m) => (
                            <React.Fragment key={`ft-${m}`}>
                              <td className="px-3 py-2 border-r border-slate-200 text-right text-slate-700">
                                {getActiveFilteredData()
                                  .reduce(
                                    (sum, row) =>
                                      sum + Number(row[`${m}Hours`] || 0),
                                    0,
                                  )
                                  .toFixed(2)}
                              </td>
                              <td className="px-3 py-2 border-r border-slate-200 text-right text-slate-700">
                                {formatCurrency(
                                  getActiveFilteredData().reduce(
                                    (sum, row) =>
                                      sum + Number(row[`${m}Amount`] || 0),
                                    0,
                                  ),
                                )}
                              </td>
                            </React.Fragment>
                          ))}
                        </>
                      ) : (
                        <>
                          {activeTab !== "Revenue" && (
                            <td className="px-3 py-2 border-r border-slate-200 text-right">
                              -
                            </td>
                          )}
                          <td className="px-3 py-2 border-r border-slate-200 text-right text-indigo-700">
                            {formatCurrency(
                              getActiveFilteredData().reduce(
                                (sum, row) =>
                                  sum + Number(row.totalAmount || 0),
                                0,
                              ),
                            )}
                          </td>
                          {months.map((m) => (
                            <td
                              key={`ft-nl-${m}`}
                              className="px-3 py-2 border-r border-slate-200 text-right text-slate-700"
                            >
                              {formatCurrency(
                                getActiveFilteredData().reduce(
                                  (sum, row) =>
                                    sum + Number(row[`${m}Amount`] || 0),
                                  0,
                                ),
                              )}
                            </td>
                          ))}
                        </>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === "Mapping & Maintenance" ? (
          /* MAPPING LAYOUT WITH SUBTABS */
          <div className="flex flex-col w-full h-full bg-white shadow-sm border border-slate-200 rounded-lg min-h-0 overflow-hidden relative">
            <div className="flex-none flex bg-slate-50 border-b border-slate-200 px-6 pt-3 gap-6">
              {["Account Mapping", "Dropdown Maintenance"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMappingActiveTab(tab)}
                  className={`pb-2 text-[12px] font-medium whitespace-nowrap transition-colors border-b-2 ${mappingActiveTab === tab ? "border-indigo-500 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto bg-slate-50 custom-scrollbar p-0">
              {mappingActiveTab === "Account Mapping" ? (
                <table
                  className="border-collapse tabular-nums whitespace-nowrap bg-white"
                  style={{ minWidth: "100%", width: "max-content" }}
                >
                  <thead className="bg-slate-50 sticky top-0 z-50 shadow-[0_1px_0_0_#e2e8f0]">
                    <tr className="text-slate-500 text-[11px] font-semibold tracking-wider">
                      <th className="px-4 py-2.5 text-left border-r border-slate-200">
                        Account ID
                      </th>
                      <th className="px-4 py-2.5 text-left border-r border-slate-200">
                        Account Name
                      </th>
                      <th className="px-4 py-2.5 text-left border-r border-slate-200">
                        Expenses Type
                      </th>
                      <th className="px-4 py-2.5 text-left border-r border-slate-200">
                        PBR Account Group
                      </th>
                      <th className="px-4 py-2.5 text-left border-r border-slate-200">
                        Project Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMappingData.length > 0 ? (
                      paginatedMappingData.map((row, idx) => (
                        <tr
                          key={row.acctId || idx}
                          className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                        >
                          <td className="px-4 py-2 border-r border-slate-100 text-[13px] text-slate-700 font-medium">
                            {row.acctId || "-"}
                          </td>
                          <td className="px-4 py-2 border-r border-slate-100 text-[13px] text-slate-600">
                            {row.acctName || "-"}
                          </td>
                          <td className="px-4 py-2 border-r border-slate-100 text-[13px] text-slate-600">
                            {row.expensesType || "-"}
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-100 text-[13px]">
                            <select
                              value={row.pbrAcctGrp || ""}
                              onChange={(e) =>
                                handleMappingChange(
                                  row.acctId,
                                  "pbrAcctGrp",
                                  e.target.value,
                                )
                              }
                              className="w-full h-full min-h-[32px] outline-none focus:ring-1 focus:ring-indigo-500 border border-transparent hover:border-slate-200 rounded-sm px-2 cursor-pointer bg-transparent text-slate-700"
                            >
                              <option value="">-- Select Group --</option>
                              {pbrGroups.map((grp) => (
                                <option key={grp} value={grp}>
                                  {grp}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-100 text-[13px]">
                            <select
                              value={row.projPef || ""}
                              onChange={(e) =>
                                handleMappingChange(
                                  row.acctId,
                                  "projPef",
                                  e.target.value,
                                )
                              }
                              className="w-full h-full min-h-[32px] outline-none focus:ring-1 focus:ring-indigo-500 border border-transparent hover:border-slate-200 rounded-sm px-2 cursor-pointer bg-transparent text-slate-700"
                            >
                              <option value="">-- Select Performance --</option>
                              {perfOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-8 text-center text-slate-400 text-[13px] bg-white"
                        >
                          No mapping data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-row gap-6 p-6 h-full items-start">
                  {/* PBR Group Maintenance Pane */}
                  <div className="flex-1 flex flex-col gap-4 bg-white border border-slate-200 shadow-sm rounded-xl p-5">
                    <h3 className="font-bold text-slate-800 text-[14px] border-b border-slate-100 pb-3">
                      PBR Account Group Maintenance
                    </h3>
                    <div className="flex gap-3 items-center bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
                      <input
                        type="text"
                        value={newPbrGroup}
                        onChange={(e) => setNewPbrGroup(e.target.value)}
                        placeholder="Enter new PBR Group..."
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md text-[13px] focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        onClick={handleAddPbrGroup}
                        className="px-4 py-1.5 bg-indigo-600 text-white font-medium text-[12px] rounded-md hover:bg-indigo-700 shadow-sm transition-colors"
                      >
                        Add Group
                      </button>
                    </div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm max-h-[50vh] overflow-y-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                          <tr>
                            <th className="px-4 py-2.5 text-[12px] font-semibold text-slate-600">
                              PBR Account Group Name
                            </th>
                            <th className="px-4 py-2.5 text-[12px] font-semibold text-slate-600 w-24 text-center">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {pbrGroups.map((grp) => (
                            <tr
                              key={grp}
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-white"
                            >
                              <td className="px-4 py-2.5 text-[13px] text-slate-800 font-medium">
                                {grp}
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <button
                                  onClick={() => handleDeletePbrGroup(grp)}
                                  className="text-slate-400 hover:text-red-600 transition-colors"
                                  title="Delete Group"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {pbrGroups.length === 0 && (
                            <tr>
                              <td
                                colSpan={2}
                                className="p-4 text-center text-slate-500 text-[13px] bg-white"
                              >
                                No groups available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Project Performance Maintenance Pane */}
                  <div className="flex-1 flex flex-col gap-4 bg-white border border-slate-200 shadow-sm rounded-xl p-5">
                    <h3 className="font-bold text-slate-800 text-[14px] border-b border-slate-100 pb-3">
                      Project Performance Maintenance
                    </h3>
                    <div className="flex gap-3 items-center bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
                      <input
                        type="text"
                        value={newPerfOption}
                        onChange={(e) => setNewPerfOption(e.target.value)}
                        placeholder="Enter new Performance Option..."
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md text-[13px] focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        onClick={handleAddPerfOption}
                        className="px-4 py-1.5 bg-indigo-600 text-white font-medium text-[12px] rounded-md hover:bg-indigo-700 shadow-sm transition-colors"
                      >
                        Add Option
                      </button>
                    </div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm max-h-[50vh] overflow-y-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                          <tr>
                            <th className="px-4 py-2.5 text-[12px] font-semibold text-slate-600">
                              Project Performance Name
                            </th>
                            <th className="px-4 py-2.5 text-[12px] font-semibold text-slate-600 w-24 text-center">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {perfOptions.map((opt) => (
                            <tr
                              key={opt}
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-white"
                            >
                              <td className="px-4 py-2.5 text-[13px] text-slate-800 font-medium">
                                {opt}
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <button
                                  onClick={() => handleDeletePerfOption(opt)}
                                  className="text-slate-400 hover:text-red-600 transition-colors"
                                  title="Delete Option"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {perfOptions.length === 0 && (
                            <tr>
                              <td
                                colSpan={2}
                                className="p-4 text-center text-slate-500 text-[13px] bg-white"
                              >
                                No options available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SINGLE TABLE LAYOUT for All Other Tabs */
          <div className="bg-white shadow-sm border border-slate-200 rounded-lg flex-1 min-h-0 overflow-auto custom-scrollbar relative">
            <table
              className="border-collapse tabular-nums whitespace-nowrap"
              style={{ minWidth: "100%", width: "max-content" }}
            >
              {activeTab === "PBR Structure" && (
                <thead className="bg-slate-50 sticky top-0 z-50 shadow-[0_1px_0_0_#e2e8f0]">
                  <tr className="text-slate-500 text-[11px] font-semibold tracking-wider">
                    <th className="px-4 py-2.5 text-left border-r border-slate-200 w-3/5">
                      <div className="flex items-center gap-3">
                        PBR Structure
                        <div className="relative">
                          <Search
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                            size={12}
                          />
                          <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="pl-8 pr-3 py-1 text-[12px] font-normal rounded-md border border-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none w-48 bg-white text-slate-700"
                          />
                        </div>
                      </div>
                    </th>
                    <th className="px-4 py-2.5 text-right border-r border-slate-200 w-1/5">
                      Value
                    </th>
                    <th className="px-4 py-2.5 text-right border-r border-slate-200 w-1/5">
                      PBR Rate % (Total Year)
                    </th>
                  </tr>
                </thead>
              )}

              {activeTab === "Labor Summary" && (
                <thead className="bg-slate-50 sticky top-0 z-50 shadow-[0_1px_0_0_#e2e8f0]">
                  <tr className="text-slate-500 text-[11px] font-semibold tracking-wider">
                    <th className="px-4 py-2.5 text-left border-r border-slate-200 sticky left-0 z-40 bg-slate-50 min-w-[120px]">
                      Employee ID
                    </th>
                    <th className="px-4 py-2.5 text-left border-r border-slate-200 sticky left-[120px] z-40 bg-slate-50 min-w-[180px]">
                      Employee Name
                    </th>
                    <th className="px-4 py-2.5 text-center border-r border-slate-200 min-w-[100px]">
                      Utilization
                    </th>
                    <th className="px-4 py-2.5 text-right border-r border-slate-200 min-w-[140px]">
                      Labor Utilization %
                    </th>
                    <th className="px-4 py-2.5 text-right border-r border-slate-200 min-w-[120px]">
                      FY {selectedYear} Hours
                    </th>
                    <th className="px-4 py-2.5 text-right border-r border-slate-200 min-w-[120px]">
                      FY {selectedYear} Amount
                    </th>
                    {showMonthlySummary &&
                      months.map((m) => (
                        <React.Fragment key={m}>
                          <th className="px-4 py-2.5 text-right border-r border-slate-200 min-w-[100px]">
                            {m} Hrs
                          </th>
                          <th className="px-4 py-2.5 text-right border-r border-slate-200 min-w-[100px]">
                            {m} Amt
                          </th>
                        </React.Fragment>
                      ))}
                  </tr>
                </thead>
              )}

              {activeTab === "Non-Labor Summary" && (
                <thead className="bg-slate-50 sticky top-0 z-50 shadow-[0_1px_0_0_#e2e8f0]">
                  <tr className="text-slate-500 text-[11px] font-semibold tracking-wider">
                    <th className="px-4 py-2.5 text-left border-r border-slate-200">
                      Project ID
                    </th>
                    <th className="px-4 py-2.5 text-left border-r border-slate-200">
                      Project Name
                    </th>
                    <th className="px-4 py-2.5 text-left border-r border-slate-200">
                      Account ID
                    </th>
                    <th className="px-4 py-2.5 text-left border-r border-slate-200">
                      Account Name
                    </th>
                    <th className="px-4 py-2.5 text-left border-r border-slate-200">
                      PBR Account Group
                    </th>
                    <th className="px-4 py-2.5 text-right border-r border-slate-200">
                      FY Amount
                    </th>
                    {showMonthlyNonLaborSummary &&
                      months.map((month) => (
                        <th
                          key={month}
                          className="px-4 py-2.5 text-right border-r border-slate-200 min-w-[100px]"
                        >
                          {month} Amt
                        </th>
                      ))}
                  </tr>
                </thead>
              )}

              {activeTab === "Rates Trend" && (
                <thead className="bg-slate-50 sticky top-0 z-50 shadow-[0_1px_0_0_#e2e8f0]">
                  <tr className="text-slate-500 text-[11px] font-semibold tracking-wider">
                    <th className="px-4 py-2.5 text-left border-r border-slate-200 w-72 sticky left-0 z-50 bg-slate-50">
                      PBR Overhead Group
                    </th>
                    <th className="px-4 py-2.5 text-right border-r border-slate-200">
                      YTD Amount
                    </th>
                    <th className="px-4 py-2.5 text-right border-r border-slate-200">
                      YTD Allocation
                    </th>
                    {months.map((m) => (
                      <th
                        key={m}
                        className="px-4 py-2.5 text-right border-r border-slate-200 min-w-[100px]"
                      >
                        {m} Amt
                      </th>
                    ))}
                  </tr>
                </thead>
              )}

              {(activeTab === "Income Statement" ||
                activeTab === "PBR Income Statement") && (
                <thead className="bg-slate-50 sticky top-0 z-50 shadow-[0_1px_0_0_#e2e8f0]">
                  <tr className="text-slate-500 text-[11px] font-semibold tracking-wider">
                    <th className="px-4 py-2.5 text-left border-r border-slate-200 sticky left-0 z-50 bg-slate-50 min-w-[240px]">
                      Line Item
                    </th>
                    {months.map((m) => (
                      <th
                        key={m}
                        className="px-4 py-2.5 text-right border-r border-slate-200 min-w-[112px]"
                      >
                        {m}
                      </th>
                    ))}
                    <th className="px-4 py-2.5 text-right min-w-[128px]">
                      YTD
                    </th>
                  </tr>
                </thead>
              )}

              <tbody className="bg-white">
                {error ? (
                  <tr>
                    <td
                      colSpan={30}
                      className="p-8 text-center text-red-500 font-medium"
                    >
                      {error}
                    </td>
                  </tr>
                ) : activeTab === "PBR Structure" ? (
                  pbrTreeData.length === 0 && !loading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-8 text-center text-slate-400 text-[13px]"
                      >
                        No PBR data found.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {pbrTreeData.map((pool, index) => (
                        <Row
                          key={pool.id + "-" + index}
                          node={pool}
                          depth={0}
                          expanded={expanded}
                          onToggle={onToggle}
                          searchTerm={searchTerm}
                          hideZeros={hideZeros}
                        />
                      ))}
                      {/* Overall Wrap Rate summary disabled.
                      <tr className="bg-indigo-50 border-t-2 border-indigo-300">
                        <td className="px-3 py-2 border-r border-indigo-200 font-bold text-[13px] text-indigo-900">
                          Overall Wrap Rate
                        </td>
                        <td className="px-4 py-2 border-r border-indigo-200 text-right text-[13px] font-bold text-indigo-900">
                          -
                        </td>
                        <td className="px-4 py-2 text-right text-[13px] font-bold text-indigo-900">
                          {waterfallEngine.overallWrapRate.toFixed(2)}x
                        </td>
                      </tr>
                      */}
                    </>
                  )
                ) : activeTab === "Income Statement" ? (
                  incomeStatementData.map((item) => (
                    <FinancialRow
                      key={item.id}
                      item={item}
                      depth={0}
                      formatCurrency={formatCurrency}
                      expandedIds={expandedIS}
                      toggleRow={toggleRowIS}
                    />
                  ))
                ) : activeTab === "PBR Income Statement" ? (
                  pbrIncomeStatementData.map((item) => (
                    <FinancialRow
                      key={item.id}
                      item={item}
                      depth={0}
                      formatCurrency={formatCurrency}
                      expandedIds={expandedIS}
                      toggleRow={toggleRowIS}
                    />
                  ))
                ) : activeTab === "Rates Trend" ? (
                  (() => {
                    const costs = hideZeros
                      ? trendData.evaluatedCosts.filter((g) => g.total !== 0)
                      : trendData.evaluatedCosts;
                    const bases = hideZeros
                      ? trendData.evaluatedBases.filter((g) => g.total !== 0)
                      : trendData.evaluatedBases;

                    const groupByAccount = (rows) => {
                      const accountMap = new Map();

                      rows.forEach((row) => {
                        const acctId = String(row.acctId ?? "");
                        const orgId = String(row.orgId ?? "");
                        const key = acctId || `__UNMAPPED__${orgId}`;

                        if (!accountMap.has(key)) {
                          accountMap.set(key, {
                            acctId,
                            accountName: row.accountName || `Account ${acctId}`,
                            total: 0,
                            ytdAllocation: 0,
                            monthly: Object.fromEntries(
                              months.map((m) => [`${m}Amount`, 0]),
                            ),
                            orgs: new Map(),
                          });
                        }

                        const account = accountMap.get(key);
                        account.total += Number(row.total || 0);
                        account.ytdAllocation += Number(row.ytdAllocation || 0);

                        months.forEach((m) => {
                          account.monthly[`${m}Amount`] += Number(
                            row[`${m}Amount`] || 0,
                          );
                        });

                        if (!account.orgs.has(orgId)) {
                          account.orgs.set(orgId, {
                            orgId,
                            total: 0,
                            ytdAllocation: 0,
                            monthly: Object.fromEntries(
                              months.map((m) => [`${m}Amount`, 0]),
                            ),
                            allocations: [],
                          });
                        }

                        const org = account.orgs.get(orgId);
                        org.total += Number(row.total || 0);
                        org.ytdAllocation += Number(row.ytdAllocation || 0);

                        months.forEach((m) => {
                          org.monthly[`${m}Amount`] += Number(
                            row[`${m}Amount`] || 0,
                          );
                        });

                        if (
                          row.allocationAcctId &&
                          row.allocationAcctId !== row.acctId
                        ) {
                          org.allocations.push(row.allocationAcctId);
                        }
                      });

                      return Array.from(accountMap.values()).sort((a, b) =>
                        String(a.acctId).localeCompare(
                          String(b.acctId),
                          undefined,
                          {
                            numeric: true,
                            sensitivity: "base",
                          },
                        ),
                      );
                    };

                    const groupedCosts = groupByAccount(costs);
                    const groupedBases = groupByAccount(bases);

                    const renderGroupedSection = (sectionKey, groups) =>
                      groups.length === 0 ? (
                        <tr
                          className="bg-slate-50/50"
                          key={`empty-${sectionKey}`}
                        >
                          <td className="px-4 py-2 text-[13px] text-slate-400 italic sticky left-0 bg-slate-50/50 border-r border-slate-200 z-20">
                            No {sectionKey.toLowerCase()} data found.
                          </td>
                          <td className="px-4 py-2 border-r border-slate-100 text-right text-[13px]">
                            -
                          </td>
                          <td className="px-4 py-2 border-r border-slate-100 text-right text-[13px]">
                            -
                          </td>
                          {months.map((m) => (
                            <td
                              key={`empty-${sectionKey}-${m}`}
                              className="px-4 py-2 border-r border-slate-100 text-right text-[13px]"
                            >
                              -
                            </td>
                          ))}
                        </tr>
                      ) : (
                        groups.flatMap((account) => {
                          const accountKey = `${activeRateTab}-${sectionKey}-${account.acctId}`;
                          const isOpen = expandedRateAccounts.has(accountKey);
                          const orgs = Array.from(account.orgs.values()).sort(
                            (a, b) =>
                              String(a.orgId).localeCompare(
                                String(b.orgId),
                                undefined,
                                {
                                  numeric: true,
                                  sensitivity: "base",
                                },
                              ),
                          );

                          const accountRow = (
                            <tr
                              key={`account-${sectionKey}-${account.acctId}`}
                              className="bg-white hover:bg-slate-50 transition-colors border-b border-slate-200"
                            >
                              <td className="px-4 py-2 text-[13px] font-semibold text-slate-800 sticky left-0 bg-white border-r border-slate-200 z-20">
                                <div className="flex items-center gap-1.5 pl-1">
                                  {orgs.length > 0 ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedRateAccounts((prev) => {
                                          const next = new Set(prev);
                                          if (next.has(accountKey))
                                            next.delete(accountKey);
                                          else next.add(accountKey);
                                          return next;
                                        })
                                      }
                                      className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-indigo-600 focus:outline-none"
                                    >
                                      {isOpen ? (
                                        <ChevronDown size={14} />
                                      ) : (
                                        <ChevronRight size={14} />
                                      )}
                                    </button>
                                  ) : (
                                    <span className="w-5" />
                                  )}
                                  <span
                                    className="truncate"
                                    title={`${account.acctId} - ${account.accountName}`}
                                  >
                                    {account.acctId} - {account.accountName}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-2 border-r border-slate-100 text-right text-[13px] font-semibold text-slate-800">
                                {formatCurrency(account.total)}
                              </td>
                              <td className="px-4 py-2 border-r border-slate-100 text-right text-[13px] text-slate-700">
                                {formatCurrency(account.ytdAllocation)}
                              </td>
                              {months.map((m) => (
                                <td
                                  key={`account-${sectionKey}-${account.acctId}-${m}`}
                                  className="px-4 py-2 border-r border-slate-100 text-right text-[13px] text-slate-700"
                                >
                                  {formatCurrency(
                                    account.monthly[`${m}Amount`],
                                  )}
                                </td>
                              ))}
                            </tr>
                          );

                          const orgRows = isOpen
                            ? orgs.map((org) => (
                                <tr
                                  key={`org-${sectionKey}-${account.acctId}-${org.orgId}`}
                                  className="bg-slate-50/60 hover:bg-indigo-50/40 transition-colors border-b border-slate-100"
                                >
                                  <td
                                    className="px-4 py-2 text-[13px] text-slate-600 sticky left-0 bg-slate-50/60 border-r border-slate-200 z-20"
                                    title={
                                      org.allocations.length > 0
                                        ? `${org.orgId} - Allocates to [${[...new Set(org.allocations)].join(", ")}]`
                                        : org.orgId
                                    }
                                  >
                                    <div className="pl-8 flex items-center gap-2">
                                      <span className="text-indigo-500">↳</span>
                                      <span>
                                        {org.orgId}
                                        {org.allocations.length > 0 && (
                                          <span className="ml-2 text-[11px] text-indigo-500 font-medium">
                                            → Allocates to [
                                            {[...new Set(org.allocations)].join(
                                              ", ",
                                            )}
                                            ]
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2 border-r border-slate-100 text-right text-[13px] text-slate-700">
                                    {formatCurrency(org.total)}
                                  </td>
                                  <td className="px-4 py-2 border-r border-slate-100 text-right text-[13px] text-slate-600">
                                    {formatCurrency(org.ytdAllocation)}
                                  </td>
                                  {months.map((m) => (
                                    <td
                                      key={`org-${sectionKey}-${account.acctId}-${org.orgId}-${m}`}
                                      className="px-4 py-2 border-r border-slate-100 text-right text-[13px] text-slate-600"
                                    >
                                      {formatCurrency(
                                        org.monthly[`${m}Amount`],
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              ))
                            : [];

                          return [accountRow, ...orgRows];
                        })
                      );

                    return (
                      <>
                        <tr>
                          <td
                            colSpan={15}
                            className="px-4 py-2 font-semibold text-[12px] text-slate-800 sticky top-[39px] left-0 z-40 bg-slate-100 border-y border-slate-200 shadow-sm tracking-wide"
                          >
                            Cost — Account → Organization
                          </td>
                        </tr>
                        {renderGroupedSection("Cost", groupedCosts)}

                        <tr className="bg-slate-50 border-t border-slate-200">
                          <td className="px-4 py-2 text-[13px] font-semibold text-slate-800 sticky left-0 bg-slate-50 border-r border-slate-200 z-20">
                            Total Cost
                          </td>
                          <td className="px-4 py-2 border-r border-slate-200 text-right text-[13px] font-semibold text-slate-800">
                            {formatCurrency(trendData.totalCost)}
                          </td>
                          <td className="px-4 py-2 border-r border-slate-200 text-right text-[13px] font-semibold text-slate-800">
                            {formatCurrency(trendData.totalCostAllocation)}
                          </td>
                          {months.map((m) => (
                            <td
                              key={`tc-${m}`}
                              className="px-4 py-2 border-r border-slate-200 text-right text-[13px] font-semibold text-slate-700"
                            >
                              {formatCurrency(
                                trendData.costMonths[`${m}Amount`],
                              )}
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td
                            colSpan={15}
                            className="px-4 py-2 font-semibold text-[12px] text-slate-800 sticky top-[39px] left-0 z-40 bg-slate-100 border-y border-slate-200 shadow-sm tracking-wide"
                          >
                            Base — Account → Organization
                          </td>
                        </tr>
                        {renderGroupedSection("Base", groupedBases)}

                        <tr className="bg-slate-50 border-t border-slate-200">
                          <td className="px-4 py-2 text-[13px] font-semibold text-slate-800 sticky left-0 bg-slate-50 border-r border-slate-200 z-20">
                            Total Base
                          </td>
                          <td className="px-4 py-2 border-r border-slate-200 text-right text-[13px] font-semibold text-slate-800">
                            {formatCurrency(trendData.totalBase)}
                          </td>
                          <td className="px-4 py-2 border-r border-slate-200 text-right text-[13px] font-semibold text-slate-800">
                            {formatCurrency(trendData.totalBaseAllocation)}
                          </td>
                          {months.map((m) => (
                            <td
                              key={`tb-${m}`}
                              className="px-4 py-2 border-r border-slate-200 text-right text-[13px] font-semibold text-slate-700"
                            >
                              {formatCurrency(
                                trendData.baseMonths[`${m}Amount`],
                              )}
                            </td>
                          ))}
                        </tr>

                        <tr className="bg-indigo-50 border-t-2 border-indigo-400 shadow-sm">
                          <td className="px-4 py-2 border-r border-indigo-100 text-[13px] font-bold text-indigo-900 sticky left-0 bg-indigo-50 z-20">
                            {activeRateTab} Rate
                          </td>
                          <td className="px-4 py-2 border-r border-indigo-100 text-right text-[13px] font-bold text-indigo-900">
                            {trendData.totalBase === 0
                              ? "0.00%"
                              : (
                                  (trendData.totalCost / trendData.totalBase) *
                                  100
                                ).toFixed(2) + "%"}
                          </td>
                          <td className="px-4 py-2 border-r border-indigo-100"></td>
                          {months.map((m) => (
                            <td
                              key={`tr-${m}`}
                              className="px-4 py-2 border-r border-indigo-100 text-right text-[13px] font-semibold text-indigo-700"
                            >
                              {(
                                (trendData.rateMonths[`${m}Rate`] || 0) * 100
                              ).toFixed(2)}
                              %
                            </td>
                          ))}
                        </tr>

                        <tr className="bg-indigo-100 border-t border-indigo-300 shadow-sm">
                          <td className="px-4 py-2 border-r border-indigo-300 text-[13px] font-bold text-indigo-900 sticky left-0 bg-indigo-100 z-20">
                            {activeRateTab} YTD Rate
                          </td>
                          <td className="px-4 py-2 border-r border-indigo-300 text-right text-[13px] font-bold text-indigo-900">
                            {trendData.totalBase === 0
                              ? "0.00%"
                              : (
                                  (trendData.totalCost / trendData.totalBase) *
                                  100
                                ).toFixed(2) + "%"}
                          </td>
                          <td className="px-4 py-2 border-r border-indigo-300"></td>
                          {months.map((m, idx) => {
                            const monthsToDate = months.slice(0, idx + 1);
                            let runningCost = 0;
                            let runningBase = 0;
                            monthsToDate.forEach((mtd) => {
                              runningCost +=
                                trendData.costMonths[`${mtd}Amount`] || 0;
                              runningBase +=
                                trendData.baseMonths[`${mtd}Amount`] || 0;
                            });
                            return (
                              <td
                                key={`ytd-cum-${m}`}
                                className="px-4 py-2 border-r border-indigo-300 text-right text-[13px] font-bold text-indigo-900"
                              >
                                {runningBase === 0
                                  ? "0.00%"
                                  : ((runningCost / runningBase) * 100).toFixed(
                                      2,
                                    ) + "%"}
                              </td>
                            );
                          })}
                        </tr>
                      </>
                    );
                  })()
                ) : activeTab === "Labor Summary" ? (
                  paginatedLaborSummary.length > 0 ? (
                    paginatedLaborSummary.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                      >
                        <td className="px-4 py-2 border-r border-slate-100 text-[13px] text-slate-700 font-medium sticky left-0 z-20 bg-white">
                          {row.empId}
                        </td>
                        <td className="px-4 py-2 border-r border-slate-200 text-[13px] text-slate-600 sticky left-[120px] z-20 bg-white">
                          {row.empName}
                        </td>
                        <td className="px-4 py-2 border-r border-slate-100 text-center">
                          {/* {getUtilizationTag(row.totalHours)} */}
                          {getUtilizationTag(row.totalHours, standardHours)}
                        </td>
                        <td className="px-4 py-2 border-r border-slate-100 text-right text-[13px] font-semibold text-slate-800">
                          {row.totalHours > 0
                            ? ((row.totalHours / standardHours) * 100).toFixed(
                                2,
                              )
                            : "0.00"}
                          %
                        </td>
                        <td className="px-4 py-2 border-r border-slate-100 text-right text-[13px] text-slate-600">
                          {row.totalHours.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 border-r border-slate-100 text-right text-[13px] font-semibold text-indigo-700">
                          {formatCurrency(row.totalAmount)}
                        </td>
                        {showMonthlySummary &&
                          months.map((m) => (
                            <React.Fragment key={`td-${m}-${idx}`}>
                              <td className="px-4 py-2 border-r border-slate-100 text-right text-[13px] text-slate-600">
                                {row.monthly[`${m}Hours`].toFixed(2)}
                              </td>
                              <td className="px-4 py-2 border-r border-slate-100 text-right text-[13px] text-slate-600">
                                {formatCurrency(row.monthly[`${m}Amount`])}
                              </td>
                            </React.Fragment>
                          ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={30}
                        className="p-8 text-center text-slate-400 text-[13px]"
                      >
                        No labor data available for summary.
                      </td>
                    </tr>
                  )
                ) : activeTab === "Non-Labor Summary" ? (
                  paginatedNonLaborData.length > 0 ? (
                    paginatedNonLaborData.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                      >
                        <td className="px-4 py-2 border-r border-slate-100 text-[13px] text-slate-700 font-medium">
                          {row.projId || "-"}
                        </td>

                        <td className="px-4 py-2 border-r border-slate-100 text-[13px] text-slate-600">
                          {row.projName || "-"}
                        </td>

                        <td className="px-4 py-2 border-r border-slate-100 text-[13px] text-slate-600">
                          {row.acctId || row.accountId || "-"}
                        </td>

                        <td className="px-4 py-2 border-r border-slate-100 text-[13px] text-slate-600">
                          {row.acctName || "-"}
                        </td>

                        <td className="px-4 py-2 border-r border-slate-100 text-[13px] text-slate-600">
                          {row.pbrGroup || "-"}
                        </td>

                        <td className="px-4 py-2 border-r border-slate-100 text-right text-[13px] font-semibold text-indigo-700">
                          {formatCurrency(row.totalAmount)}
                        </td>
                        {showMonthlyNonLaborSummary &&
                          months.map((month) => (
                            <td
                              key={month}
                              className="px-4 py-2 border-r border-slate-100 text-right text-[13px] text-slate-600"
                            >
                              {formatCurrency(
                                Number(row[`${month}Amount`] || 0),
                              )}
                            </td>
                          ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={showMonthlyNonLaborSummary ? 18 : 6}
                        className="p-8 text-center text-slate-400 text-[13px]"
                      >
                        No non-labor data available for summary.
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={30}
                      className="p-8 text-center text-slate-400 text-[13px]"
                    >
                      Data for {activeTab} will be populated here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Overlay Full-Screen Render for Project Performance */}
            {activeTab === "Project Performance" && (
              <div className="absolute inset-0 flex flex-col bg-slate-50 z-50">
                {/* Filter Header */}
                <div className="bg-white px-6 py-4 border-b border-slate-200 flex gap-6 items-end relative z-30">
                  <div className="w-[350px]">
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
                      Top Level Project
                    </label>
                    <div className="relative">
                      <div
                        className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-[13px] flex items-center justify-between cursor-pointer shadow-sm"
                        onClick={() =>
                          setIsPerfDropdownOpen(!isPerfDropdownOpen)
                        }
                      >
                        <span className="truncate text-slate-700 font-medium">
                          {perfSelectedProjects.length === 0
                            ? "All Projects"
                            : `${perfSelectedProjects.length} Projects Selected`}
                        </span>
                        <ChevronDown size={14} className="text-slate-400" />
                      </div>

                      {/* {isPerfDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                          <label className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-100 sticky top-0 bg-slate-50 font-semibold">
                            <input
                              type="checkbox"
                              checked={perfSelectedProjects.length === 0}
                              onChange={() => setPerfSelectedProjects([])}
                              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                            />
                            <span>All Projects</span>
                          </label>
                          {allProjects.map((p) => (
                            <label
                              key={p.projectId}
                              className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0"
                            >
                              <input
                                type="checkbox"
                                checked={perfSelectedProjects.includes(
                                  p.projectId,
                                )}
                                onChange={() => {
                                  setPerfSelectedProjects((prev) =>
                                    prev.includes(p.projectId)
                                      ? prev.filter((id) => id !== p.projectId)
                                      : [...prev, p.projectId],
                                  );
                                }}
                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                              />
                              <span className="truncate text-slate-700">
                                {p.projectId} - {p.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      )} */}
                      {isPerfDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-80 overflow-hidden flex flex-col z-50">
                          <div className="p-2 border-b border-slate-200 bg-slate-50">
                            <div className="relative">
                              <Search
                                size={14}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                              />
                              <input
                                type="text"
                                value={perfSearchTerm}
                                onChange={(e) =>
                                  setPerfSearchTerm(e.target.value)
                                }
                                placeholder="Search project..."
                                className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-slate-200 rounded outline-none focus:border-indigo-500"
                              />
                            </div>
                          </div>
                          <div className="overflow-y-auto custom-scrollbar flex-1">
                            <label className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-100 bg-white font-semibold">
                              <input
                                type="checkbox"
                                checked={perfSelectedProjects.length === 0}
                                onChange={() => setPerfSelectedProjects([])}
                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                              />
                              <span>All Projects</span>
                            </label>
                            {allProjects
                              .filter((p) =>
                                (p.projectId + p.name)
                                  .toLowerCase()
                                  .includes(perfSearchTerm.toLowerCase()),
                              )
                              .map((p) => (
                                <label
                                  key={p.projectId}
                                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] border-b border-slate-50 last:border-0 bg-white"
                                >
                                  <input
                                    type="checkbox"
                                    checked={perfSelectedProjects.includes(
                                      p.projectId,
                                    )}
                                    onChange={() => {
                                      setPerfSelectedProjects((prev) =>
                                        prev.includes(p.projectId)
                                          ? prev.filter(
                                              (id) => id !== p.projectId,
                                            )
                                          : [...prev, p.projectId],
                                      );
                                    }}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                  />
                                  <span className="truncate text-slate-700">
                                    {p.projectId} - {p.name}
                                  </span>
                                </label>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Financial Table */}
                <div className="flex-1 overflow-auto bg-white m-6 rounded-lg border border-slate-200 shadow-sm custom-scrollbar">
                  <table className="w-full border-collapse tabular-nums whitespace-nowrap text-[13px]">
                    <thead className="bg-slate-50 sticky top-0 z-20 shadow-[0_1px_0_0_#e2e8f0]">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-slate-800 border-r border-slate-200 sticky left-0 bg-slate-50 z-30">
                          Line Items
                        </th>
                        {months.map((m) => (
                          <th
                            key={m}
                            className="px-4 py-4 text-right font-semibold text-slate-800 border-r border-slate-200 min-w-[110px]"
                          >
                            {m}
                          </th>
                        ))}
                        <th className="px-6 py-4 text-right font-semibold text-slate-900 bg-slate-100 min-w-[130px]">
                          Annual Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(perfSelectedProjects.length > 0
                        ? perfSelectedProjects
                        : ["ALL"]
                      ).map((pId) => {
                        const isAll = pId === "ALL";
                        const projName = !isAll
                          ? allProjects.find((p) => p.projectId === pId)
                              ?.name || "Unknown"
                          : "";

                        return (
                          <React.Fragment key={`perf-group-${pId}`}>
                            {!isAll && (
                              <tr className="bg-slate-200/70 border-y border-slate-300">
                                <td
                                  colSpan={14}
                                  className="px-6 py-2.5 font-bold text-slate-800 text-[13px] sticky left-0 z-20 shadow-sm"
                                >
                                  Project: {pId} - {projName}
                                </td>
                              </tr>
                            )}
                            {performanceData.map((row, idx) => {
                              const rowData = isAll
                                ? row.data.total
                                : row.data.projects[pId]?.values ||
                                  Array(12).fill(0);
                              const rowAnnual = isAll
                                ? row.annual
                                : row.data.projects[pId]?.annual || 0;
                              const poolKey = isAll ? "ALL" : pId;
                              const poolExpanded =
                                expandedPerfPools.has(poolKey);
                              const poolBreakdown =
                                row.label === "Indirect Burdens"
                                  ? getPerformancePoolBreakdown(poolKey)
                                  : [];

                              return (
                                <React.Fragment key={`${pId}-${idx}`}>
                                  <tr
                                    className={`border-b border-slate-200 transition-colors ${row.isBold ? "bg-indigo-50/50" : "bg-slate-100/50 hover:bg-slate-50"}`}
                                  >
                                    <td
                                      className={`px-6 py-3.5 border-r border-slate-200 sticky left-0 z-20 ${row.isBold ? "font-bold text-indigo-900 bg-indigo-50/90" : "font-semibold text-slate-800 bg-slate-100/90"}`}
                                    >
                                      <div className="flex items-center gap-2">
                                        {row.label === "Indirect Burdens" && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              togglePerformancePool(poolKey)
                                            }
                                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-indigo-100 text-indigo-500"
                                            title="Expand pool values"
                                          >
                                            {poolExpanded ? (
                                              <ChevronDown size={14} />
                                            ) : (
                                              <ChevronRight size={14} />
                                            )}
                                          </button>
                                        )}
                                        {row.label !== "Indirect Burdens" && (
                                          <span className="w-5" />
                                        )}
                                        <span>{row.label}</span>
                                      </div>
                                    </td>
                                    {rowData.map((val, mIdx) => (
                                      <td
                                        key={mIdx}
                                        className={`px-4 py-3.5 border-r border-slate-200 text-right ${row.isBold ? "font-bold text-indigo-900" : "font-semibold text-slate-800"}`}
                                      >
                                        {val !== 0 ? formatCurrency(val) : "—"}
                                      </td>
                                    ))}
                                    <td
                                      className={`px-6 py-3.5 text-right border-l-2 border-slate-300 ${row.isBold ? "font-black text-indigo-700 bg-indigo-100/50" : "font-bold text-indigo-600 bg-blue-50/30"}`}
                                    >
                                      {rowAnnual !== 0
                                        ? formatCurrency(rowAnnual)
                                        : "—"}
                                    </td>
                                  </tr>
                                  {row.label === "Indirect Burdens" &&
                                    poolExpanded &&
                                    poolBreakdown.map((pool) => (
                                      <tr
                                        key={`${pId}-${idx}-${pool.poolName}`}
                                        className="bg-white border-b border-slate-100"
                                      >
                                        <td className="px-6 py-2.5 pl-14 border-r border-slate-200 sticky left-0 z-20 bg-white text-[12px] text-slate-600 font-medium">
                                          <span className="text-indigo-500">
                                            ↳
                                          </span>{" "}
                                          {pool.poolName}
                                        </td>
                                        {pool.values.map((val, mIdx) => (
                                          <td
                                            key={mIdx}
                                            className="px-4 py-2.5 border-r border-slate-100 text-right text-[12px] text-slate-600"
                                          >
                                            {val !== 0
                                              ? formatCurrency(val)
                                              : "—"}
                                          </td>
                                        ))}
                                        <td className="px-6 py-2.5 text-right border-l-2 border-slate-200 text-[12px] font-semibold text-indigo-600">
                                          {pool.annual !== 0
                                            ? formatCurrency(pool.annual)
                                            : "—"}
                                        </td>
                                      </tr>
                                    ))}
                                </React.Fragment>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination / Status Bar */}
      <div className="flex-none flex justify-between items-center px-6 py-3 bg-white border-t border-slate-200 text-[12px] text-slate-500 font-medium z-10 shadow-[0_-1px_2px_rgba(0,0,0,0.02)]">
        <span>
          {activeTab === "PBR Structure"
            ? `Ready - Viewing PBR Structure - ${pbrTreeData.length} Pools`
            : activeTab === "Rates Trend"
              ? `Ready - Viewing ${activeRateTab}`
              : activeTab === "Project Performance"
                ? `Ready - Viewing Project Performance`
                : activeTab === "Income Statement"
                  ? `Ready - Viewing Income Statement`
                  : activeTab === "PBR Income Statement"
                    ? `Ready - Viewing PBR Income Statement`
                    : activeTab === "Labor" ||
                        activeTab === "Non-Labor" ||
                        activeTab === "Revenue"
                      ? `Ready - Viewing ${activeTab} Schedule - Total Rows: ${totalRowsCount}`
                      : `Showing total rows: ${totalRowsCount}`}
        </span>

        <div className="flex items-center gap-5 ml-auto">
          {activeTab !== "PBR Structure" &&
            activeTab !== "Rates Trend" &&
            activeTab !== "Project Performance" &&
            activeTab !== "Income Statement" &&
            activeTab !== "PBR Income Statement" &&
            mappingActiveTab === "Account Mapping" && (
              <>
                <div className="flex items-center gap-2.5">
                  <label
                    htmlFor="rowsPerPage"
                    className="font-medium text-slate-400"
                  >
                    Rows per page:
                  </label>
                  <select
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-slate-200 rounded-md bg-white px-2 py-1 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500 text-slate-700"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 disabled:bg-transparent transition-colors text-slate-600"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 font-medium text-slate-700">
                    Page {currentPage} of {currentTotalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(currentTotalPages, p + 1))
                    }
                    disabled={currentPage === currentTotalPages}
                    className="p-1 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 disabled:bg-transparent transition-colors text-slate-600"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
