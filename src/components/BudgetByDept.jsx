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
// const FY_CD = new Date().getFullYear();
const CURRENT_FY = new Date().getFullYear();
const FY_OPTIONS = Array.from({ length: 4 }, (_, i) => CURRENT_FY + i); // 2026..2029
//
const DEFAULT_STANDARD_HOURS = 2080;

const MAPPING_API = `${backendUrl}/api/PBR/pbr-acct-grp-map/get-all`;
const LNL_DATA_API = `${backendUrl}/api/PbrLaborNonLabor`;
const LNL_UPSERT_API = `${backendUrl}/api/PbrLaborNonLabor/bulk-upsert`;

const COA_API = `${backendUrl}/api/ChartOfAccounts`;
const LAB_HS_API = `${backendUrl}/api/ForecastReport/GetLabHSData`;
const EMP_API = `${backendUrl}/api/ForecastReport/GetAllEmployee`;
const VEND_EMP_API = `${backendUrl}/VendorEmployee`;
const ORGS_API = `${backendUrl}/Orgnization/GetAllOrgs`;
const GL_DATA_API = `${backendUrl}/api/ForecastReport/GetGlPostDetail`;

const POOL_TYPES_MAPPING = {
  "AERO Fringe": "AEROFR",
  "NASA/NIH Fringe": "NFRNG",
  "Cust OH": "OVH30",
  // "Columbus OH": "OVH31",
  "Off - site OH": "OVH31",
  "Subk M&H": "SMH50",
  "G&A": "INTG40",
};

const WATERFALL_SEQUENCE = [
  "AERO Fringe",
  "NASA/NIH Fringe",
  "Cust OH",
  // "Columbus OH",
  "Off - site OH",
  "Subk M&H",
  "G&A",
];

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

const INITIAL_PBR_ACCOUNT_GROUPS = [
  // "Contract Labor",
  // "Material / Subcontracts /ODC",
  // // "Direct Kargo Labor",
  // // "Direct Cargo Labor",
  // "KARGO Material / Subcontracts /ODC",
  // // "Overhead Labor",
  // // "Overtime Premium",
  // "Building Rent",
  // "Printing & Office Supplies",
  // "Building Support & Maint",
  // "Heat, Light, Power Etc.",
  // "Telephone",
  // "Equipment and Maint of Equipment",
  // "Trash Removal",
  // "Heliplex Rent",
  // "Computer supplies & software (Exp & Depr)",
  // "Depr of Equipment/Trailer",
  // "Depr of Auto Truck",
  // "Depr of Asset Shop",
  // "Depr of Flights Ops",
  // "Depr of Shop TST Equip",
  // "Dues/Subscriptions/Books",
  // "Professional Services",
  // "OH Misc Company Expense",
  // "Fuel & Maint of Co Vehicles",
  // "Shop Operating Support",
  // "Postage & Freight",
  // "OH Fringe:  Tuition Reimbursement",
  // "Heliplex Operating Expenses",
  // "Shop Equipment",
  // "Insurance",
  // "Property & School Tax",
  // "Travel",
  // "Business Meals",
  // "Conference & Mtg.",
  // "Unallowable",
  // "OH Fringe:  Vacation Pay",
  // "OH Fringe:  Holiday Pay",
  // "OH Fringe:  Sev/Funeral/Mil/Paren",
  // "OH Fringe:  Sick Pay",
  // "OH Fringe:  Bonus Pay",
  // "OH Fringe:  FICA/FUTA/Unemployment Tax - Employer",
  // "OH Fringe:  401K Company Match",
  // "OH Fringe:  Group Insurance",
  // "G&A Indirect Labor",
  // "G&A Overtime Premium",
  // "G&A Building Rent",
  // "G&A Building Supplies & Services",
  // "G&A Heat, Light, Power Etc.",
  // "G&A Telephone",
  // "G&A Heliplex Operating Expenses",
  // "G&A Misc. Company Expense",
  // "G&A Heliplex Rent",
  // "G&A Dues/Subscriptions/Books",
  // "G&A Professional Svcs/Consult",
  // "G&A Computer Supplies & Software (Exp and Depr)",
  // "G&A Postage & Freight",
  // "G&A Printing & Office Supplies",
  // "G&A Fringe:  G&A Tuition Reimbursement",
  // "G&A Insurance",
  // "G&A Property & School Tax",
  // "G&A Travel",
  // "G&A Business Meals",
  // "G&A Conference & Mtg.",
  // "G&A Other Indirect",
  // "G&A Fringe:  Vacation Pay",
  // "G&A Fringe:  Holiday Pay",
  // "G&A Fringe:  Sev/Funeral/Mil/Paren",
  // "G&A Fringe:  Sick Leave",
  // "G&A Fringe:  Bonus Pay",
  // "G&A Fringe:  FICA/FUTA/Unemployment Tax - Employer",
  // "G&A Fringe:  401(K) Company Match",
  // "G&A Fringe:  Group Insurance",
  // "IR&D/B&P Labor",
  // "IR&D/B&P Material & ODC",
  "Revenue",
  "Direct Labor",
  "ODC",
  "Material",
  "Subcontracts",
  "Travel",
  "ESPEC LABOR",
  "NASA/NIH Fringe",
  "AREO Fringe",
  "Cust OH",
  "Off - site OH",
  "Sunk M&H",
  "G&A",
];

const INITIAL_PROJECT_PERFORMANCE_OPTIONS = [
  "Direct Labor",
  "ODC",
  "Material",
  "Subcontracts",
  "Travel",
  "ESPEC LABOR",
];
const USE_DEFAULT_MAPPING = true;
// const DEFAULT_MAPPING_DATA = [
//   { acctId: "40-10-01", acctName: "Contract Revenue",        expensesType: "Revenue",   pbrAcctGrp: "R",                         projPef: "Contract Revenue" },
//   { acctId: "50-00-01", acctName: "Direct Labor",            expensesType: "Employee",  pbrAcctGrp: "Direct Labor",       projPef: "Direct Labor" },
//   { acctId: "50-21-01", acctName: "Material",                expensesType: "Non-Labor", pbrAcctGrp: "Material / Subcontracts /ODC", projPef: "Material" },
//   { acctId: "50-22-01", acctName: "Subcontracts",            expensesType: "Non-Labor", pbrAcctGrp: "Material / Subcontracts /ODC", projPef: "Subcontracts" },
//   { acctId: "50-40-01", acctName: "Travel",                  expensesType: "Non-Labor", pbrAcctGrp: "Travel",                   projPef: "Travel" },
//   { acctId: "60-01-01", acctName: "Overhead Labor",          expensesType: "Employee",  pbrAcctGrp: "",           projPef: "" },
//   { acctId: "60-01-08", acctName: "Overtime Premium",        expensesType: "Employee",  pbrAcctGrp: "",         projPef: "" },
//   { acctId: "70-01-01", acctName: "Building Rent",           expensesType: "Non-Labor", pbrAcctGrp: "",            projPef: "" },
//   { acctId: "80-01-01", acctName: "G&A ",      expensesType: "Employee",  pbrAcctGrp: "G&A Indirect Labor",       projPef: "" },
// ].map((m) => ({ ...m, _isDirty: false }));

const USE_DUMMY_REVENUE = true; // set to false once your APIs are connected

const makeDummyRevenueRow = (
  n,
  projId,
  projName,
  acctId,
  acctName,
  orgId,
  orgName,
  monthly,
) => {
  const row = {
    uid: `dummy_rev_${n}`,
    id: `temp_dummy_rev_${n}`,
    monthlyIds: [],
    type: "Revenue",
    projId,
    projName,
    acctId,
    acctName,
    orgId,
    orgName,
    pbrGroup: "",
    inflationRate: 0,
    _isDirty: false,
  };
  let total = 0;
  months.forEach((m, i) => {
    row[`${m}Amount`] = monthly[i];
    total += monthly[i];
  });
  row.totalAmount = Number(total.toFixed(2));
  return row;
};

const DEFAULT_REVENUE_DATA = [
  makeDummyRevenueRow(
    1,
    "C1426",
    "Phillips-Ernestime",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [12000.0, 25920.0, 0.0, 0.0, 28241.0, 0.0, 0.0, 3555.0, 0, 0, 0, 0],
  ),

  makeDummyRevenueRow(
    2,
    "C1427",
    "JPL EDRN SWO 002",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      38242.81, 37333.62, 46204.14, 43257.28, 31347.65, 49114.66, 61476.54,
      64970.68, 0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    3,
    "C1434",
    "JPL NIST",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      21674.38, 22583.58, 28408.49, 94060.65, 16589.05, 2881.49, 77.85, 3650.06,
      0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    4,
    "C1448",
    "Intuitive Machines",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 783.24, 0.0, 0, 0, 0, 0],
  ),

  makeDummyRevenueRow(
    5,
    "C1389",
    "Raytheon-AWIPS",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      9626.76, 2632.96, 14481.28, 13740.76, 12404.16, 12588.84, 12506.56,
      16291.44, 0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    6,
    "C1450",
    "Earth Science Story Devel",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 338481.38, 0, 0, 0, 0],
  ),

  makeDummyRevenueRow(
    7,
    "C1420",
    "RITS OY4",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      48967.12, 41256.24, 55519.04, 48534.92, 47888.84, 44258.0, 47904.88,
      39488.32, 0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    8,
    "C1425",
    "SOAR-Collins",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      310625.37, 291422.88, 382710.64, 321262.29, 290258.4, 286826.6, 284852.96,
      355441.88, 0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    9,
    "C1799",
    "SSMO Centralized Operatio",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      393330.31, 368449.2, 500025.49, 433416.26, 335611.18, 352376.05,
      387114.65, 500360.94, 0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    10,
    "C1447",
    "SDAC-VSO Support",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [0.0, 0.0, 0.0, 0.0, 0.0, 175507.5, 274906.11, 80669.02, 0, 0, 0, 0],
  ),

  makeDummyRevenueRow(
    11,
    "C1435",
    "TBE MSFC MOSS1 Opt 1",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      46184.24, 47541.95, 52436.71, 34583.77, 28514.48, 27460.63, 34682.28,
      33803.95, 0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    12,
    "C1432",
    "Leidos AEGIS NSSC",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      68234.93, 63140.33, 76240.04, 65081.12, 63073.92, 67273.34, 61311.34,
      77530.89, 0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    13,
    "C1800",
    "ESES IV FEE",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      5333669.72, 5645916.53, 6347287.24, 6134084.27, 5827964.99, 5956560.89,
      6329451.85, 9149415.88, 0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    14,
    "C1449",
    "DigiFlight TO 1",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 12408.48, 0, 0, 0, 0],
  ),

  makeDummyRevenueRow(
    15,
    "C1438",
    "DigiFlight TO 1",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      12540.28, 14190.05, 15077.75, 11578.06, 10591.2, 16990.05, 12771.13,
      2500.7, 0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    16,
    "C1387",
    "Daniel Folse",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      15504.4, 11482.34, 18472.3, 14701.62, 14142.1, 8855.03, 11774.27, 16761.3,
      0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    17,
    "C1424",
    "Raytheon EISOC",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      14957.94, 14957.94, 17170.3, 15745.2, 12107.74, 14895.16, 15663.58,
      22952.32, 0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    18,
    "C1444",
    "Opt Year 1 - Task Order 2",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      52764.8, 52019.82, 63317.76, 44894.12, 51427.43, 43530.96, 27217.57,
      32978.0, 0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    19,
    "C1399",
    "IT Security",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      11225.2, 8862.0, 14179.2, 11816.0, 10492.77, 10794.24, 10794.24, 14392.32,
      0, 0, 0, 0,
    ],
  ),

  makeDummyRevenueRow(
    20,
    "C1390",
    "NEST",
    "40-10-01",
    "Revenue - Government",
    "1.2.01",
    "NASA/NOAA/NIH",
    [
      6403.95, 6885.45, 9630.0, 7126.2, 6692.85, 6572.48, 6452.1, 9437.4, 0, 0,
      0, 0,
    ],
  ),
];

const DEFAULT_MAPPING_DATA = [
  // ============================================================
  // REVENUE
  // ============================================================
  {
    acctId: "40-10-01",
    acctName: "Contract Revenue",
    expensesType: "Revenue",
    pbrAcctGrp: "Revenue",
    projPef: "Contract Revenue",
  },

  // ============================================================
  // DIRECT LABOR
  // ============================================================
  {
    acctId: "50-00-01",
    acctName: "Direct Labor",
    expensesType: "Employee",
    pbrAcctGrp: "Direct Labor",
    projPef: "Direct Labor",
  },

  // ============================================================
  // MATERIAL / SUBCONTRACTS / ODC
  // ============================================================
  {
    acctId: "50-21-01",
    acctName: "Material",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Material",
    projPef: "Material",
  },
  {
    acctId: "50-22-01",
    acctName: "Subcontracts",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Subcontracts",
    projPef: "Subcontracts",
  },

  // ============================================================
  // TRAVEL
  // ============================================================
  {
    acctId: "50-40-01",
    acctName: "Travel",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Travel",
    projPef: "Travel",
  },

  // ============================================================
  // NASA / NIH FRINGE
  // ============================================================
  {
    acctId: "60-01-01",
    acctName: "PTO Accrual",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-01-02",
    acctName: "Holiday",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-01-05",
    acctName: "Jury Duty",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-01-07",
    acctName: "Admin Leave",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-01-08",
    acctName: "Sick Leave",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-01-13",
    acctName: "NIH PTO NE Payout",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-01-14",
    acctName: "NIH PTO Accrual",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-02-01",
    acctName: "Group Medical Dental",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-02-05",
    acctName: "Flex Benefits Adminis",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-03-01",
    acctName: "Life Disability Insurance",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-03-07",
    acctName: "Workers' Comp Insurance",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-03-08",
    acctName: "HR Benefits Solutions Exp",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-05-02",
    acctName: "401 k Discretionary Contr",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-05-03",
    acctName: "401 k Prevailing Wage",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-05-04",
    acctName: "401 k Plan Expense",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-06-01",
    acctName: "Professional Dev/Tuition",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-06-03",
    acctName: "Cash in Lieu of Benefits",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-06-04",
    acctName: "Health & Welfare",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "60-06-05",
    acctName: "Incentive Compensation",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "61-01-01",
    acctName: "Social Security Taxes",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "61-01-02",
    acctName: "Medicare Taxes",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "61-01-03",
    acctName: "FUTA Taxes",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },
  {
    acctId: "61-02-03",
    acctName: "SUTA Taxes",
    expensesType: "Employee",
    pbrAcctGrp: "NASA/NIH Fringe",
    projPef: "NASA/NIH Fringe",
  },

  // ============================================================
  // CUST OH
  // ============================================================
  {
    acctId: "70-00-01",
    acctName: "Cust Site OH Labor",
    expensesType: "Employee",
    pbrAcctGrp: "Cust OH",
    projPef: "Cust OH",
  },
  {
    acctId: "70-10-01",
    acctName: "Cust Site OH Supplies",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Cust OH",
    projPef: "Cust OH",
  },
  {
    acctId: "70-40-00",
    acctName: "Cust Site Travel Other",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Cust OH",
    projPef: "Cust OH",
  },
  {
    acctId: "70-40-02",
    acctName: "Cust Site Travel Hotel",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Cust OH",
    projPef: "Cust OH",
  },
  {
    acctId: "70-40-04",
    acctName: "Cust Site Per Diem Meals",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Cust OH",
    projPef: "Cust OH",
  },
  {
    acctId: "70-40-06",
    acctName: "Cust Site Ground Transprt",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Cust OH",
    projPef: "Cust OH",
  },
  {
    acctId: "70-50-03",
    acctName: "Cust Site Furnished Meals",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Cust OH",
    projPef: "Cust OH",
  },
  {
    acctId: "70-50-10",
    acctName: "Cust Site Employ Relatns",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Cust OH",
    projPef: "Cust OH",
  },

  // ============================================================
  // CUST OH - 71 SERIES
  // ============================================================
  {
    acctId: "71-10-01",
    acctName: "Col Site OH Supplies",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Cust OH",
    projPef: "Cust OH",
  },
  {
    acctId: "71-30-01",
    acctName: "Col Site OH Rent",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Cust OH",
    projPef: "Cust OH",
  },
  {
    acctId: "71-50-03",
    acctName: "Col Site Furnished Meals",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Cust OH",
    projPef: "Cust OH",
  },
  {
    acctId: "71-50-08",
    acctName: "Col Site Employee Relatns",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Cust OH",
    projPef: "Cust OH",
  },
  {
    acctId: "71-50-17",
    acctName: "Col Site OH Telephones",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Cust OH",
    projPef: "Cust OH",
  },

  // ============================================================
  // Off - site OH
  // ============================================================
  {
    acctId: "84-00-01",
    acctName: "S&MH Labor",
    expensesType: "Employee",
    pbrAcctGrp: "Off - site OH",
    projPef: "Off - site OH",
  },
  {
    acctId: "84-10-01",
    acctName: "S&MH Admin Supplies",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Off - site OH",
    projPef: "Off - site OH",
  },
  {
    acctId: "84-10-06",
    acctName: "S&MH Dues/Publications",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Off - site OH",
    projPef: "Off - site OH",
  },
  {
    acctId: "84-30-01",
    acctName: "S&MH Rent",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Off - site OH",
    projPef: "Off - site OH",
  },
  {
    acctId: "84-50-03",
    acctName: "S&MH Furnished Meals",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Off - site OH",
    projPef: "Off - site OH",
  },
  {
    acctId: "84-50-20",
    acctName: "S&MH Telephone/Internet",
    expensesType: "Non-Labor",
    pbrAcctGrp: "Off - site OH",
    projPef: "Off - site OH",
  },

  // ============================================================
  // G&A
  // ============================================================
  {
    acctId: "80-00-01",
    acctName: "G&A Executive Labor",
    expensesType: "Employee",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-10-01",
    acctName: "G&A Admin Supplies",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-10-02",
    acctName: "G&A Delivery/Courier",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-10-04",
    acctName: "G&A Postage/Shipping",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-10-06",
    acctName: "G&A Dues/Publications",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-20-02",
    acctName: "G&A Consultants",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-30-01",
    acctName: "G&A Rent",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-40-00",
    acctName: "G&A Travel - Other",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-40-01",
    acctName: "G&A Airfare",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-40-02",
    acctName: "G&A Hotel",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-40-04",
    acctName: "G&A Per Diem Meals",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-40-05",
    acctName: "G&A Rental Car",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-40-06",
    acctName: "G&A Ground Transport",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-01",
    acctName: "G&A Miscellaneous Expense",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-03",
    acctName: "G&A Furnished Meals",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-05",
    acctName: "G&A Taxes Licenses Fees",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-06",
    acctName: "G&A Legal Audit",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-07",
    acctName: "G&A Outside PR Services",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-09",
    acctName: "G&A Small Equipment",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-10",
    acctName: "G&A Software",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-11",
    acctName: "G&A Business Conferences",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-12",
    acctName: "G&A Bank Charges",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-14",
    acctName: "G&A Employee Relations",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-16",
    acctName: "G&A Marketing",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-17",
    acctName: "G&A Depreciation Expense",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-18",
    acctName: "GA Auto Expense",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-19",
    acctName: "G&A Parking",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-20",
    acctName: "G&A Telephone/Internet",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-50-21",
    acctName: "G&A Equip Maint/Repairs",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },
  {
    acctId: "80-70-01",
    acctName: "G&A Business Insurance",
    expensesType: "Non-Labor",
    pbrAcctGrp: "G&A",
    projPef: "G&A",
  },

  // ============================================================
  // DEFAULT / EXISTING MAPPING
  // ============================================================
  {
    acctId: "70-01-01",
    acctName: "Building Rent",
    expensesType: "Non-Labor",
    pbrAcctGrp: "",
    projPef: "",
  },
].map((m) => ({ ...m, _isDirty: false }));

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
   GL STRUCTURE ROW COMPONENT
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
   GL BUDGETING COMPONENT
   Dedicated GL-only version of the PBR screen.
   Labor/Non-Labor GL records use Account ID + Organization ID,
   with pbrType = LABOR/NONLABOR and projId = GL.
======================================================= */
export default function BudgetByDept() {
  const rightPaneRef = useRef(null);
  const leftPaneRef = useRef(null);
  const fileInputRef = useRef(null);

  // const selectedYear = String(FY_CD);
  const [selectedFY, setSelectedFY] = useState(CURRENT_FY);
  const selectedYear = String(selectedFY);

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
  // const [activeTab, setActiveTab] = useState("Department/Organization Structure");

  const [activeTab, setActiveTab] = useState(
    "Department/Organization Structure",
  );
  const [dashboardTab, setDashboardTab] = useState("Labor");

  const [pbrGroups, setPbrGroups] = useState(INITIAL_PBR_ACCOUNT_GROUPS);
  const [perfOptions, setPerfOptions] = useState(
    INITIAL_PROJECT_PERFORMANCE_OPTIONS,
  );
  const [mappingActiveTab, setMappingActiveTab] = useState("Account Mapping");
  const [newPbrGroup, setNewPbrGroup] = useState("");
  const [newPerfOption, setNewPerfOption] = useState("");

  // const [mappingData, setMappingData] = useState([]);
  const [mappingData, setMappingData] = useState(DEFAULT_MAPPING_DATA);
  const [laborData, setLaborData] = useState([]);
  const [nonLaborData, setNonLaborData] = useState([]);
  // const [revenueData, setRevenueData] = useState([]);
  const [revenueData, setRevenueData] = useState(
    USE_DUMMY_REVENUE ? DEFAULT_REVENUE_DATA : [],
  );
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
  const [laborColumnFilters, setLaborColumnFilters] = useState({});
  const [nonLaborColumnFilters, setNonLaborColumnFilters] = useState({});
  const [revenueColumnFilters, setRevenueColumnFilters] = useState({});

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
    { key: "pbrGroup", label: "GL Account Group", w: 180 },
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
    { key: "pbrGroup", label: "GL Account Group", w: 180 },
    { key: "vendorId", label: "Vendor ID", w: 110 },
    { key: "vendorName", label: "Vendor Name", w: 180 },
  ]);

  const [revenueLeftCols, setRevenueLeftCols] = useState([
    { key: "select", label: "☑", w: 40 },
    { key: "action", label: "Act", w: 40 },
    { key: "acctId", label: "Account ID", w: 110 },
    { key: "acctName", label: "Account Name", w: 150 },
    { key: "orgId", label: "Organization ID", w: 110 },
    { key: "orgName", label: "Organization Name", w: 180 },
    // { key: "pbrGroup", label: "GL Account Group", w: 180 },
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
  const [revenueAddTab, setRevenueAddTab] = useState("Org/Account");

  const [selectedVendors, setSelectedVendors] = useState([]);
  const [vendorSearchTerm, setVendorSearchTerm] = useState("");
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [selectedProjects, setSelectedProjects] = useState([]);

  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(1);

  // GL Budgeting Mode:
  // Normal mode remains unchanged. GL mode stores Labor/Non-Labor budget
  // entries as pbrType = "LABOR" / "NONLABOR" with projId = "GL" and keys them only by Account ID + Org ID.
  // This is a dedicated GL Budgeting component, so GL mode is always enabled.
  const glBudgetingMode = true;

  // GL mode hides Employee/Vendor/Project fields from the entry grid.
  // The stored record still remains in the same Labor / Non-Labor arrays.
  const glLaborLeftCols = useMemo(
    () =>
      glBudgetingMode
        ? laborLeftCols.filter(
            (c) =>
              ![
                "empId",
                "empName",
                "empStatus",
                "laborCat",
                "rate",
                "projId",
                "projName",
              ].includes(c.key),
          )
        : laborLeftCols,
    [glBudgetingMode, laborLeftCols],
  );

  const glNonLaborLeftCols = useMemo(
    () =>
      glBudgetingMode
        ? nonLaborLeftCols.filter(
            (c) =>
              !["projId", "projName", "vendorId", "vendorName"].includes(c.key),
          )
        : nonLaborLeftCols,
    [glBudgetingMode, nonLaborLeftCols],
  );

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
  const [activeRateTab, setActiveRateTab] = useState(
    WATERFALL_SEQUENCE[0] || "",
  );
  const [showMonthlySummary, setShowMonthlySummary] = useState(false);
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
    // "Dashboard",
    "Department/Organization Structure",
    "Rates Trend",
    "Labor",
    "Non-Labor",
    "Revenue",
    "Income Statement",
    "Custom IS",
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
      if (activeTab === "Labor")
        return coaItem.isLaborAcc && !coaItem.isRevenueAcc;
      if (activeTab === "Revenue") return coaItem.isRevenueAcc;
      return !coaItem.isLaborAcc && !coaItem.isRevenueAcc;
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

  const activeColumnFilters =
    activeTab === "Labor"
      ? laborColumnFilters
      : activeTab === "Non-Labor"
        ? nonLaborColumnFilters
        : revenueColumnFilters;

  const setActiveColumnFilter = (key, value) => {
    if (activeTab === "Labor") {
      setLaborColumnFilters((prev) => ({ ...prev, [key]: value }));
    } else if (activeTab === "Non-Labor") {
      setNonLaborColumnFilters((prev) => ({ ...prev, [key]: value }));
    } else if (activeTab === "Revenue") {
      setRevenueColumnFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

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
    if (activeTab === "Custom IS") return 1;
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
  }, [
    activeTab,
    laborColumnFilters,
    nonLaborColumnFilters,
    revenueColumnFilters,
  ]);
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
          emp?.status === "ACT" &&
          (emp?.emplId
            ?.toLowerCase()
            .includes(employeeSearchTerm.toLowerCase()) ||
            emp?.firstName
              ?.toLowerCase()
              .includes(employeeSearchTerm.toLowerCase())),
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

    glRawData.forEach((row) => {
      if (
        row.sIdType === "V" &&
        row.id &&
        row.projId &&
        String(row.projId).trim() !== ""
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
    revenueData.forEach(processRow);
    return map;
    // }, [laborData, nonLaborData, revenueData]);
  }, [laborData, nonLaborData, revenueData, mappingData]);

  // =========================================================================
  // THE WATERFALL ENGINE (SEQUENTIAL CALCULATION)
  // =========================================================================
  const waterfallEngine = useMemo(() => {
    const ledger = {};
    Object.keys(lnlTotalsMap).forEach((k) => {
      ledger[k] = { ...lnlTotalsMap[k] };
    });

    const results = {};

    // Original cost entering the PBR model from Labor + Non-Labor.
    // Wrap Rate = (Original Cost + cumulative indirect burden) / Original Cost.
    const sourceCostMonths = {};
    months.forEach((m) => {
      sourceCostMonths[`${m}Amount`] =
        laborData.reduce(
          (sum, row) => sum + Number(row[`${m}Amount`] || 0),
          0,
        ) +
        nonLaborData.reduce(
          (sum, row) => sum + Number(row[`${m}Amount`] || 0),
          0,
        );
    });
    const sourceCostTotal = months.reduce(
      (sum, m) => sum + Number(sourceCostMonths[`${m}Amount`] || 0),
      0,
    );
    const cumulativeIndirectMonths = {};
    months.forEach((m) => (cumulativeIndirectMonths[`${m}Amount`] = 0));
    let cumulativeIndirectTotal = 0;

    WATERFALL_SEQUENCE.forEach((poolName) => {
      const hrD = hrDataMap[poolName];
      if (!hrD) return;

      const costAccounts = hrD.poolOrgCostFinancialDetail || [];
      const baseAccounts = hrD.poolOrgBaseFinancialDetail || [];

      let totalCost = 0;
      let totalBase = 0;
      const costMonths = {};
      const baseMonths = {};
      months.forEach((m) => {
        costMonths[`${m}Amount`] = 0;
        baseMonths[`${m}Amount`] = 0;
      });

      const evaluatedCosts = costAccounts.map((acc) => {
        const key = `${acc.orgId}_${acc.acctId}`;
        const t = ledger[key]?.total || 0;
        totalCost += t;
        const mData = {};
        months.forEach((m) => {
          const mAmt = ledger[key]?.[`${m}Amount`] || 0;
          mData[`${m}Amount`] = mAmt;
          costMonths[`${m}Amount`] += mAmt;
        });
        return {
          ...acc,
          total: t,
          ...mData,
          accountName: coaMap[acc.acctId]?.name || acc.accountName,
        };
      });

      const evaluatedBases = baseAccounts.map((acc) => {
        const key = `${acc.orgId}_${acc.acctId}`;
        const t = ledger[key]?.total || 0;
        totalBase += t;
        const mData = {};
        months.forEach((m) => {
          const mAmt = ledger[key]?.[`${m}Amount`] || 0;
          mData[`${m}Amount`] = mAmt;
          baseMonths[`${m}Amount`] += mAmt;
        });
        return {
          ...acc,
          total: t,
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
        cumulativeIndirectMonths[`${m}Amount`] += applied;
      });
      const appliedIndirectTotal = months.reduce(
        (sum, m) => sum + Number(appliedIndirectMonths[`${m}Amount`] || 0),
        0,
      );
      cumulativeIndirectTotal += appliedIndirectTotal;

      results[poolName] = {
        evaluatedCosts,
        evaluatedBases,
        totalCost,
        totalBase,
        costMonths,
        baseMonths,
        rateMonths,
        rate,
        appliedIndirectMonths,
        appliedIndirectTotal,
      };

      evaluatedBases.forEach((acc) => {
        if (acc.allocationAcctId && acc.allocationAcctId !== acc.acctId) {
          const targetKey = `${acc.allocationOrgId || acc.orgId}_${acc.allocationAcctId}`;

          if (!ledger[targetKey]) {
            ledger[targetKey] = { total: 0 };
            months.forEach((m) => (ledger[targetKey][`${m}Amount`] = 0));
          }

          ledger[targetKey].total += acc.total * rate;

          months.forEach((m) => {
            ledger[targetKey][`${m}Amount`] +=
              acc[`${m}Amount`] * rateMonths[`${m}Rate`];
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

    const overallWrapRate =
      sourceCostTotal === 0
        ? 0
        : (sourceCostTotal + cumulativeIndirectTotal) / sourceCostTotal;

    const overallWrapRateMonths = {};
    months.forEach((m) => {
      const source = Number(sourceCostMonths[`${m}Amount`] || 0);
      const loaded =
        source + Number(cumulativeIndirectMonths[`${m}Amount`] || 0);
      overallWrapRateMonths[`${m}Rate`] = source === 0 ? 0 : loaded / source;
    });

    return {
      ledger,
      results,
      tree,
      sourceCostMonths,
      sourceCostTotal,
      cumulativeIndirectMonths,
      cumulativeIndirectTotal,
      overallWrapRateMonths,
      overallWrapRate,
    };
  }, [lnlTotalsMap, hrDataMap, coaMap, laborData, nonLaborData]);

  // =========================================================================
  // INCOME STATEMENT ENGINE
  // =========================================================================
  const incomeStatementData = useMemo(() => {
    const categories = {
      "Contracts Revenue": {
        id: "REV",
        name: "Contracts Revenue",
        childrenMap: {},
      },
      "Direct Labor": { id: "DL", name: "Direct Labor", childrenMap: {} },
      "Other Direct Costs": {
        id: "ODC",
        name: "Other Direct Costs",
        childrenMap: {},
      },
      "Fringe Benefits": {
        id: "FRINGE",
        name: "Fringe Benefits",
        childrenMap: {},
      },
      Overhead: { id: "OH", name: "Overhead", childrenMap: {} },
      "General & Administrative": {
        id: "GA",
        name: "General & Administrative",
        childrenMap: {},
      },
      "Other Expenses": {
        id: "OTHER",
        name: "Other Expenses",
        childrenMap: {},
      },
    };

    const initMonths = () => {
      let m = {};
      for (let i = 1; i <= 12; i++) m[i] = 0;
      return m;
    };

    const processRow = (r) => {
      const amtStr = (m) => Number(r[`${m}Amount`] || 0);

      // Use the Mapping tab when the row itself does not have GL Group
      const mapping = mappingData.find(
        (m) => String(m.acctId).trim() === String(r.acctId).trim(),
      );

      const grp = String(r.pbrGroup || mapping?.pbrAcctGrp || "")
        .trim()
        .toLowerCase();

      const pef = String(mapping?.projPef || "")
        .trim()
        .toLowerCase();

      const acct = String(r.acctId || "")
        .trim()
        .toLowerCase();

      let cat = "Other Expenses";

      // Revenue
      if (
        r.type === "Revenue" ||
        acct.startsWith("40") ||
        grp.includes("revenue") ||
        pef.includes("revenue")
      ) {
        cat = "Contracts Revenue";
      }

      // Direct Labor
      else if (
        grp.includes("direct labor") ||
        grp.includes("contract labor") ||
        grp.includes("direct kargo labor") ||
        grp.includes("direct cargo labor") ||
        pef.includes("direct labor") ||
        acct.startsWith("50-00") ||
        acct.startsWith("50.00")
      ) {
        cat = "Direct Labor";
      }

      // Other Direct Costs
      else if (
        grp.includes("odc") ||
        grp.includes("material") ||
        grp.includes("subcontract") ||
        grp.includes("travel") ||
        pef.includes("odc") ||
        pef.includes("material") ||
        pef.includes("subcontract") ||
        pef.includes("travel") ||
        acct.startsWith("50-21") ||
        acct.startsWith("50.21") ||
        acct.startsWith("50-22") ||
        acct.startsWith("50.22") ||
        acct.startsWith("50-40") ||
        acct.startsWith("50.40")
      ) {
        cat = "Other Direct Costs";
      }

      // Fringe Benefits
      else if (grp.includes("fringe") || pef.includes("fringe")) {
        cat = "Fringe Benefits";
      }

      // General & Administrative
      else if (
        grp.includes("g&a") ||
        grp.includes("g & a") ||
        grp.includes("general & administrative") ||
        grp.includes("general administrative") ||
        pef.includes("g&a")
      ) {
        cat = "General & Administrative";
      }

      // Overhead
      else if (
        grp.includes("overhead") ||
        grp.startsWith("oh ") ||
        grp.startsWith("oh:") ||
        pef.includes("overhead")
      ) {
        cat = "Overhead";
      }

      const acctKey = r.acctId || "Unmapped";

      if (!categories[cat].childrenMap[acctKey]) {
        categories[cat].childrenMap[acctKey] = {
          id: acctKey,
          name: r.acctName || `Account ${acctKey}`,
          monthlyAmts: initMonths(),
        };
      }

      months.forEach((mName, idx) => {
        categories[cat].childrenMap[acctKey].monthlyAmts[idx + 1] +=
          amtStr(mName);
      });
    };

    laborData.forEach(processRow);
    nonLaborData.forEach(processRow);
    revenueData.forEach(processRow);

    const formatNode = (node) => {
      const children = Object.values(node.childrenMap || {}).sort((a, b) =>
        a.id.localeCompare(b.id),
      );
      const monthlyAmts = initMonths();
      children.forEach((c) => {
        for (let i = 1; i <= 12; i++) monthlyAmts[i] += c.monthlyAmts[i];
      });
      return { ...node, children, monthlyAmts };
    };

    const revNode = formatNode(categories["Contracts Revenue"]);
    const dlNode = formatNode(categories["Direct Labor"]);
    const odcNode = formatNode(categories["Other Direct Costs"]);
    const fringeNode = formatNode(categories["Fringe Benefits"]);
    const ohNode = formatNode(categories["Overhead"]);
    const gaNode = formatNode(categories["General & Administrative"]);
    const otherNode = formatNode(categories["Other Expenses"]);

    const sumMonths = (nodes) => {
      const res = initMonths();
      nodes.forEach((n) => {
        for (let i = 1; i <= 12; i++) res[i] += n.monthlyAmts[i];
      });
      return res;
    };

    const totalDirect = sumMonths([dlNode, odcNode]);
    const gpAmts = initMonths();
    for (let i = 1; i <= 12; i++)
      gpAmts[i] = revNode.monthlyAmts[i] - totalDirect[i];
    const gpNode = {
      id: "GP",
      name: "Gross Profit / (Loss)",
      type: "summary",
      monthlyAmts: gpAmts,
      children: [],
    };

    const indirectChildren = WATERFALL_SEQUENCE.map((poolName) => {
      const pool = waterfallEngine.results[poolName];

      if (!pool) return null;

      const monthlyAmts = initMonths();

      months.forEach((m, i) => {
        monthlyAmts[i + 1] = Number(pool.costMonths?.[`${m}Amount`] || 0);
      });

      const accountChildren = (pool.evaluatedCosts || [])
        .map((account) => {
          const accountMonthlyAmts = initMonths();

          months.forEach((m, i) => {
            accountMonthlyAmts[i + 1] = Number(account[`${m}Amount`] || 0);
          });

          return {
            id: `${poolName}-${account.orgId}-${account.acctId}`,
            name: `${account.orgId} - ${account.acctId} - ${account.accountName}`,
            type: "detail",
            monthlyAmts: accountMonthlyAmts,
          };
        })
        .filter((account) =>
          Object.values(account.monthlyAmts).some(
            (value) => Number(value || 0) !== 0,
          ),
        );

      return {
        id: poolName,
        name: poolName,
        type: "detail",
        monthlyAmts,
        children: accountChildren,
      };
    }).filter(Boolean);

    const indirectAmts = initMonths();

    indirectChildren.forEach((child) => {
      for (let i = 1; i <= 12; i++) {
        indirectAmts[i] += Number(child.monthlyAmts[i] || 0);
      }
    });

    const indirectNode = {
      id: "INDIRECT",
      name: "Indirect Expenses",
      type: "summary",
      monthlyAmts: indirectAmts,
      children: indirectChildren,
    };

    // const totalIndirect = sumMonths([fringeNode, ohNode, gaNode, otherNode]);
    const totalIndirect = sumMonths([indirectNode, otherNode]);
    const opexNode = {
      id: "OPEX",
      name: "Total Operating Expenses",
      type: "summary",
      monthlyAmts: totalIndirect,
      children: [],
    };

    const npAmts = initMonths();
    for (let i = 1; i <= 12; i++) npAmts[i] = gpAmts[i] - totalIndirect[i];
    const npNode = {
      id: "NP",
      name: "Net Profit / (Loss)",
      type: "summary",
      monthlyAmts: npAmts,
      children: [],
    };

    return [
      revNode,
      dlNode,
      odcNode,
      gpNode,
      indirectNode,
      // otherNode,
      opexNode,
      npNode,
    ].map((n) => {
      const cleanAmts = {};
      for (let i = 1; i <= 12; i++) {
        cleanAmts[i] =
          Math.round((n.monthlyAmts[i] + Number.EPSILON) * 100) / 100 === 0
            ? "-"
            : Number(n.monthlyAmts[i].toFixed(2));
      }
      if (n.children) {
        n.children.forEach((c) => {
          const cClean = {};
          for (let i = 1; i <= 12; i++) {
            cClean[i] =
              Math.round((c.monthlyAmts[i] + Number.EPSILON) * 100) / 100 === 0
                ? "-"
                : Number(c.monthlyAmts[i].toFixed(2));
          }
          c.monthlyAmts = cClean;
        });
      }
      return { ...n, monthlyAmts: cleanAmts };
    });
    // }, [laborData, nonLaborData, revenueData]);
  }, [laborData, nonLaborData, revenueData, mappingData, waterfallEngine]);

  // =========================================================================
  // PBR INCOME STATEMENT ENGINE
  // Groups accounts directly from the configured GL Account Group mapping.
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

      // Custom IS is driven by the GL Account Group configuration.
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

    // Follow the configured GL Account Group order first, then append any
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

  const pbrTreeData = waterfallEngine.tree;

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

      const mapping = mappingData.find((m) => m.acctId === r.acctId);
      const pef = mapping?.projPef || "";
      const group = (r.pbrGroup || "").toLowerCase();
      const acct = String(r.acctId || "");

      const isRev =
        acct.startsWith("40") ||
        r.type === "Revenue" ||
        pef.includes("revenue") ||
        group.includes("revenue");
      const isDirLab =
        acct.startsWith("50-00") ||
        acct.startsWith("50.00") ||
        (r.type === "Labor" &&
          (!group ||
            pef.includes("direct labor") ||
            group.includes("direct labor") ||
            group.includes("contract labor")));
      const isODC =
        acct.startsWith("50-21") ||
        acct.startsWith("50.21") ||
        acct.startsWith("50-22") ||
        acct.startsWith("50.22") ||
        acct.startsWith("50-40") ||
        acct.startsWith("50.40") ||
        pef.includes("odc") ||
        pef.includes("material") ||
        pef.includes("subcontract") ||
        pef.includes("travel") ||
        group.includes("material") ||
        group.includes("odc") ||
        group.includes("subcontract");

      months.forEach((m, i) => {
        const amt = Number(r[`${m}Amount`] || 0);

        if (isRev) addAmt("Contract Revenue", pId, r.projName, i, amt);
        else if (isDirLab) addAmt("Direct Labor", pId, r.projName, i, amt);
        else if (isODC) addAmt("Direct Cost (ODC)", pId, r.projName, i, amt);
        else if (
          group.includes("overhead") ||
          group.includes("fringe") ||
          group.includes("g&a") ||
          group.includes("indirect") ||
          group.includes("unallowable")
        ) {
          addAmt("Indirect Burdens", pId, r.projName, i, amt);
        } else {
          if (pef.includes("direct labor"))
            addAmt("Direct Labor", pId, r.projName, i, amt);
          else if (
            ["ODC", "Material", "Subcontracts", "Travel", "ESPEC LABOR"].some(
              (v) => pef.includes(v.toLowerCase()),
            )
          )
            addAmt("Direct Cost (ODC)", pId, r.projName, i, amt);
          else if (pef.includes("contract revenue"))
            addAmt("Contract Revenue", pId, r.projName, i, amt);
          else addAmt("Indirect Burdens", pId, r.projName, i, amt);
        }
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
        matrix["Gross Profit"].total[i] - matrix["Indirect Burdens"].total[i];
    }

    allActiveProjects.forEach((pId) => {
      const pName =
        matrix["Contract Revenue"].projects[pId]?.projName ||
        matrix["Direct Labor"].projects[pId]?.projName ||
        matrix["Direct Cost (ODC)"].projects[pId]?.projName ||
        matrix["Indirect Burdens"].projects[pId]?.projName ||
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
        const np = gp - ind;

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
  }, [laborData, nonLaborData, revenueData, mappingData, perfSelectedProjects]);

  const trendData = waterfallEngine.results[activeRateTab] || {
    evaluatedCosts: [],
    evaluatedBases: [],
    totalCost: 0,
    totalBase: 0,
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

      const safeExtract = (res) => {
        const d = res?.value?.data || res?.data;
        return (
          Array.isArray(d) ? d : d?.results || d?.result || d?.data || []
        ).filter(Boolean);
      };

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

      const hrPromises = Object.entries(POOL_TYPES_MAPPING).map(
        async ([tabName, typeCode]) => {
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
        },
      );
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
        localMappingData = mapRes.value.data || [];
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
      // setMappingData(combinedMapping);
      if (!USE_DEFAULT_MAPPING) {
        setMappingData(combinedMapping);
      }

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

      if (lnlRes.status === "fulfilled") {
        const allData = safeExtract(lnlRes);

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
          .filter((d) => {
            // Dedicated GL Budgeting records are identified ONLY by projId = GL.
            // pbrType remains LABOR or NONLABOR as required by the API contract.
            const isGLRecord =
              String(d.projId || "")
                .trim()
                .toUpperCase() === "GL";
            return glBudgetingMode ? isGLRecord : !isGLRecord;
          })
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

        const parsedData = versionData.map((dbRow) => {
          const monthlyCols = {};
          let totalHours = 0;
          let totalAmount = 0;

          const normalizedPbrType = String(dbRow.pbrType || "").toUpperCase();
          const isGL =
            String(dbRow.projId || "")
              .trim()
              .toUpperCase() === "GL";
          const isRevenue = normalizedPbrType === "REVENUE";
          const isLabor =
            normalizedPbrType === "LABOR" ||
            (normalizedPbrType === "GL" &&
              Boolean((localCoaMap[dbRow.acctId] || {}).isLaborAcc));
          const rowType = isLabor
            ? "Labor"
            : isRevenue
              ? "Revenue"
              : "Non-Labor";

          months.forEach((m, idx) => {
            const pdNo = idx + 1;
            const monthData = dbRow.monthlyData?.find(
              (md) =>
                md.pdNo === pdNo &&
                Number(md.fyCd ?? selectedFY) === selectedFY,
            ) || { hrs: 0, amt: 0, infRt: 0 };
            monthlyCols[`${m}Hours`] = isGL
              ? 0
              : Number((monthData.hrs || 0).toFixed(2));
            monthlyCols[`${m}Amount`] = Number((monthData.amt || 0).toFixed(2));
            if (!isGL) totalHours += monthData.hrs || 0;
            totalAmount += monthData.amt || 0;
          });

          const empMatch = isLabor
            ? empDataList.find(
                (e) => String(e.emplId) === String(dbRow.emplRVendId),
              )
            : null;
          const empStatusRaw = empMatch ? empMatch.status : "";
          const empStatusDisplay =
            empStatusRaw === "ACT"
              ? "Active"
              : empStatusRaw === "IN"
                ? "Inactive"
                : empStatusRaw;

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

          return {
            uid: `ui_${Math.random().toString(36).substring(2, 9)}`,
            id: dbRow.id || null,
            // monthlyIds:
            //   dbRow.monthlyData?.map((md) => md.id).filter(Boolean) || [],
            monthlyIds:
              dbRow.monthlyData
                ?.filter((md) => Number(md.fyCd ?? selectedFY) === selectedFY)
                .map((md) => md.id)
                .filter(Boolean) || [],
            type: rowType,
            projId: isGL ? "GL" : topId || "NA",
            projName: isGL ? "GL Budgeting" : projNameMap[topId] || "NA",
            acctId: dbRow.acctId || "",
            acctName: localCoaMap[dbRow.acctId]?.name || "",
            orgId: dbRow.orgId || "",
            orgName: resolvedOrgName,
            pbrGroup: resolvedPbrGroup,
            empId: isLabor ? dbRow.emplRVendId : "",
            empName: empMatch ? empMatch.firstName : "",
            empStatus: isLabor ? empStatusDisplay : "",
            laborCat: dbRow.plcCode || "",
            rate: dbRow.hrlyRt || 0,
            vendorId: !isLabor && !isRevenue ? dbRow.emplRVendId : "",
            vendorName: glVendMatch
              ? glVendMatch.name || "Unknown Vendor"
              : vendMatch
                ? vendMatch.vendEmplName ||
                  `${vendMatch.firstName || ""} ${vendMatch.lastName || ""}`.trim()
                : "",
            inflationRate: dbRow.monthlyData?.[0]?.infRt || 0,
            totalHours: Number(totalHours.toFixed(2)),
            totalAmount: Number(totalAmount.toFixed(2)),
            isGL,
            _isDirty: false,
            ...monthlyCols,
          };
        });

        setLaborData(parsedData.filter((d) => d.type === "Labor"));
        setNonLaborData(parsedData.filter((d) => d.type === "Non-Labor"));
        // setRevenueData(parsedData.filter((d) => d.type === "Revenue"));
        if (!USE_DUMMY_REVENUE) {
          setRevenueData(parsedData.filter((d) => d.type === "Revenue"));
        }
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
    } catch (err) {
      console.error("PBR API Error:", err);
      setError("Failed to load report sections. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedVersion, selectedFY, glBudgetingMode]);

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
        console.error("Background API Delete Error:", err),
      );
    }
  };

  const handleLeftPaneChange = (rowUid, field, value) => {
    const setter =
      activeTab === "Labor"
        ? setLaborData
        : activeTab === "Revenue"
          ? setRevenueData
          : setNonLaborData;
    setter((prev) =>
      prev.map((row) => {
        if (row.uid !== rowUid) return row;
        let updated = { ...row, [field]: value, _isDirty: true };

        if (field === "acctId") {
          const acct = coaMap[value];
          const mapped = mappingData.find((m) => m.acctId === value);
          if (acct) {
            updated.acctName = acct.name || "";
            updated.pbrGroup = mapped?.pbrAcctGrp || acct.pbrGroup || "";
          }
          if (field === "orgId") {
            updated.orgName = orgNameMap[normalizeOrgId(value)] || "";
          }
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
      showToast("GL Group added successfully.", "success");
    } else {
      showToast("Group is empty or already exists.", "error");
    }
  };

  const handleDeletePbrGroup = (grp) => {
    if (window.confirm(`Are you sure you want to delete GL Group "${grp}"?`)) {
      setPbrGroups(pbrGroups.filter((g) => g !== grp));
      showToast("GL Group deleted.", "success");
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

  const handleAddSelectedEmployees = async (employeeIds) => {
    const ids = Array.isArray(employeeIds) ? employeeIds : selectedEmployees;
    if (ids.length === 0) return;
    setShowAddLabor(false);
    setLoading(true);
    try {
      const allEmpHsData = ids.flatMap((emplId) =>
        labHsRawData.filter((d) => d.emplId === emplId),
      );
      const uniqueProjIds = Array.from(
        new Set(
          allEmpHsData.map((r) => getTopLevelProj(r.projId)).filter(Boolean),
        ),
      );

      const projNameMap = {};
      await Promise.all(
        uniqueProjIds.map(async (pid) => {
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
            if (match) projNameMap[pid] = match.name || "NA";
          } catch {
            projNameMap[pid] = "NA";
          }
        }),
      );

      const uniqueCombos = new Set();
      const existingLaborCombos = new Set(
        laborData.map(
          (r) =>
            `${getTopLevelProj(r.projId) || "NA"}_${r.acctId}_${r.orgId}_${r.empId}`,
        ),
      );
      const newRows = [];

      ids.forEach((emplId) => {
        const emp = employees.find((e) => e?.emplId === emplId);
        if (!emp) return;

        const empStatusDisplay =
          emp.status === "ACT"
            ? "Active"
            : emp.status === "IN"
              ? "Inactive"
              : emp.status || "";
        const empHsData = labHsRawData.filter((d) => d?.emplId === emplId);

        empHsData.forEach((record) => {
          const topId = getTopLevelProj(record.projId) || "NA";
          const comboKey = `${topId}_${record.acctId}_${record.orgId}_${emplId}`;

          if (
            !uniqueCombos.has(comboKey) &&
            !existingLaborCombos.has(comboKey)
          ) {
            uniqueCombos.add(comboKey);

            let mappedAcctId = record.acctId;
            // Native mapping fallback for specific legacy accounts
            if (mappedAcctId === "23-00-12") mappedAcctId = "60-01-08";
            else if (mappedAcctId === "23-00-11") mappedAcctId = "60-01-01";
            else if (mappedAcctId === "23-00-15") mappedAcctId = "60-01-14";

            const acctInfo = coaMap[mappedAcctId] || {};
            const mapped = mappingData.find((m) => m.acctId === mappedAcctId);

            newRows.push({
              uid: `ui_${Math.random().toString(36).substring(2, 9)}`,
              id: `temp_${Date.now()}_${comboKey}`,
              type: "Labor",
              empId: emplId,
              empName: emp.firstName || "",
              empStatus: empStatusDisplay,
              laborCat: emp.plcGlcCode || record.billLabCatCd || "",
              projId: topId,
              projName: projNameMap[topId] || "NA",
              acctId: mappedAcctId || "",
              acctName: acctInfo.name || "",
              orgId: record.orgId || "",
              orgName: orgNameMap[normalizeOrgId(record.orgId)] || "",
              pbrGroup: mapped?.pbrAcctGrp || acctInfo.pbrGroup || "",
              // rate: emp.perHourRate || 0,
              // totalHours: 0,
              // totalAmount: 0,
              // _isDirty: true,
              // ...months.reduce(
              //   (acc, m) => ({ ...acc, [`${m}Hours`]: 0, [`${m}Amount`]: 0 }),
              //   {},
              // ),
              rate: emp.perHourRate || 0,
              _isDirty: true,
              ...(() => {
                const matchingRecords = empHsData.filter(
                  (r) =>
                    (getTopLevelProj(r.projId) || "NA") === topId &&
                    r.acctId === record.acctId &&
                    r.orgId === record.orgId,
                );

                let tHrs = 0,
                  tAmt = 0;
                const monthlyValues = months.reduce((acc, m, idx) => {
                  const pdNo = idx + 1;
                  const pdRecords = matchingRecords.filter(
                    (r) => r.pdNo === pdNo,
                  );

                  const hrs = pdRecords.reduce(
                    (sum, r) => sum + Number(r.actHrs || 0),
                    0,
                  );
                  const amt = pdRecords.reduce(
                    (sum, r) => sum + Number(r.actAmt || 0),
                    0,
                  );

                  tHrs += hrs;
                  tAmt += amt;
                  return {
                    ...acc,
                    [`${m}Hours`]: Number(hrs.toFixed(2)),
                    [`${m}Amount`]: Number(amt.toFixed(2)),
                  };
                }, {});

                return {
                  totalHours: Number(tHrs.toFixed(2)),
                  totalAmount: Number(tAmt.toFixed(2)),
                  ...monthlyValues,
                };
              })(),
            });
          }
        });
      });

      if (newRows.length > 0) {
        setLaborData((prev) => [...prev, ...newRows]);
        showToast("Employees added successfully.", "success");
      } else {
        showToast(
          "Selected employees are already in the table or have no historical data.",
          "error",
        );
      }
    } catch (err) {
      console.error("Error adding employees:", err);
      showToast("Error processing employee selection.", "error");
    } finally {
      setSelectedEmployees([]);
      setEmployeeSearchTerm("");
      setLoading(false);
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
  const handleAddSelectedVendors = async (vendorIds) => {
    const ids = Array.isArray(vendorIds) ? vendorIds : selectedVendors;
    if (ids.length === 0) return;
    setShowAddNonLabor(false);
    setLoading(true);

    try {
      const vendorGlData = glRawData.filter(
        (d) =>
          d.sIdType === "V" &&
          ids.includes(String(d.id)) &&
          d.projId &&
          String(d.projId).trim() !== "",
      );

      const uniqueProjIds = Array.from(
        new Set(
          vendorGlData.map((r) => getTopLevelProj(r.projId)).filter(Boolean),
        ),
      );
      const projNameMap = {};
      await Promise.all(
        uniqueProjIds.map(async (pid) => {
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
            if (match) projNameMap[pid] = match.name || "NA";
          } catch {
            projNameMap[pid] = "NA";
          }
        }),
      );

      const uniqueCombos = new Set();
      const existingVendorCombos = new Set(
        nonLaborData.map(
          (r) =>
            `${getTopLevelProj(r.projId) || "NA"}_${r.acctId}_${r.orgId}_${r.vendorId}`,
        ),
      );
      const newRows = [];

      // selectedVendors.forEach((vendId) => {
      //   const v = vendors.find(
      //     (vend) => String(vend?.vendId) === String(vendId),
      //   );
      //   if (!v) return;

      //   const vGlData = vendorGlData.filter(
      //     (d) => String(d.id) === String(vendId),
      //   );

      //   if (vGlData.length === 0) return;

      //   vGlData.forEach((record) => {
      //     const mappedAcctId = record.acctId || "";
      //     const topId = getTopLevelProj(record.projId) || "NA";
      //     const comboKey = `${topId}_${record.acctId}_${record.orgId}_${vendId}`;

      //     if (
      //       !uniqueCombos.has(comboKey) &&
      //       !existingVendorCombos.has(comboKey)
      //     ) {
      //       uniqueCombos.add(comboKey);

      //       const mappedAcctId = record.acctId || "";
      //       const acctInfo = coaMap[mappedAcctId] || {};
      //       // const mapped = mappingData.find(m => m.acctId === mappedAcctId);

      //       newRows.push({
      //         uid: `ui_${Math.random().toString(36).substring(2, 9)}`,
      //         id: `temp_${Date.now()}_${comboKey}`,
      //         type: "Non-Labor",
      //         vendorId: vendId,
      //         vendorName:
      //           v.vendEmplName ||
      //           `${v.firstName || ""} ${v.lastName || ""}`.trim(),
      ids.forEach((vendId) => {
        const vGlData = vendorGlData.filter(
          (d) => String(d.id) === String(vendId),
        );

        if (vGlData.length === 0) return;
        const vName = vGlData[0].name || "Unknown Vendor";

        vGlData.forEach((record) => {
          const mappedAcctId = record.acctId || "";
          // ... (keep the topId, comboKey logic exactly as is) ...
          const topId = getTopLevelProj(record.projId) || "NA";
          const comboKey = `${topId}_${record.acctId}_${record.orgId}_${vendId}`;

          // if (
          //   !uniqueCombos.has(comboKey) &&
          //   !existingVendorCombos.has(comboKey)
          // ) {
          //   uniqueCombos.add(comboKey);
          //   const acctInfo = coaMap[mappedAcctId] || {};

          //   newRows.push({
          if (
            !uniqueCombos.has(comboKey) &&
            !existingVendorCombos.has(comboKey)
          ) {
            uniqueCombos.add(comboKey);
            const acctInfo = coaMap[mappedAcctId] || {};
            const mapped = mappingData.find((m) => m.acctId === mappedAcctId);

            newRows.push({
              uid: `ui_${Math.random().toString(36).substring(2, 9)}`,
              id: `temp_${Date.now()}_${comboKey}`,
              type: "Non-Labor",
              vendorId: vendId,
              vendorName: vName,
              projId: topId,
              projName: projNameMap[topId] || "NA",
              acctId: mappedAcctId,
              acctName: acctInfo.name || "",
              orgId: record.orgId || "",
              // pbrGroup: mapped?.pbrAcctGrp || acctInfo.pbrGroup || "",
              // inflationRate: 0,
              // totalAmount: 0,
              // _isDirty: true,
              // ...months.reduce((acc, m) => ({ ...acc, [`${m}Amount`]: 0 }), {}),
              pbrGroup: mapped?.pbrAcctGrp || acctInfo.pbrGroup || "",
              inflationRate: 0,
              _isDirty: true,
              ...(() => {
                const matchingRecords = vGlData.filter(
                  (r) =>
                    (getTopLevelProj(r.projId) || "NA") === topId &&
                    r.acctId === record.acctId &&
                    r.orgId === record.orgId,
                );

                let tAmt = 0;
                const monthlyValues = months.reduce((acc, m, idx) => {
                  const pdNo = idx + 1;
                  const pdRecords = matchingRecords.filter(
                    (r) => r.pdNo === pdNo,
                  );

                  // Using amt1 from your sample (falling back to actAmt just in case)
                  const amt = pdRecords.reduce(
                    (sum, r) => sum + Number(r.amt1 || r.actAmt || 0),
                    0,
                  );

                  tAmt += amt;
                  return { ...acc, [`${m}Amount`]: Number(amt.toFixed(2)) };
                }, {});

                return {
                  totalAmount: Number(tAmt.toFixed(2)),
                  ...monthlyValues,
                };
              })(),
            });
          }
        });
      });

      if (newRows.length > 0) {
        setNonLaborData((prev) => [...prev, ...newRows]);
        showToast("Vendors added successfully.", "success");
      } else {
        showToast(
          "Vendors are already in the table or have no historical data.",
          "error",
        );
      }
    } catch (err) {
      console.error("Error adding vendors:", err);
      showToast("Error processing vendor selection.", "error");
    } finally {
      setSelectedVendors([]);
      setVendorSearchTerm("");
      setLoading(false);
    }
  };

  const handleImportActuals = async () => {
    if (isApproved) return;
    if (!importActualsLabor && !importActualsNonLabor) {
      showToast(
        "Select Labor, Non-Labor, or both before importing actuals.",
        "error",
      );
      return;
    }

    setShowImportActuals(false);
    setLoading(true);
    try {
      if (importActualsLabor) {
        const allEmployeeIds = filteredEmployees.map((emp) => emp.emplId);
        await handleAddSelectedEmployees(allEmployeeIds);
      }

      if (importActualsNonLabor) {
        const allVendorIds = filteredVendors.map((vendor) =>
          String(vendor.vendId),
        );
        await handleAddSelectedVendors(allVendorIds);
      }

      showToast(
        "Actuals imported successfully for the selected record types.",
        "success",
      );
    } catch (err) {
      console.error("Automated actuals import failed:", err);
      showToast("Failed to import actuals. Please try again.", "error");
    } finally {
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
        projId: glBudgetingMode ? "GL" : pId || "NA",
        projName: glBudgetingMode ? "GL Budgeting" : proj?.name || "NA",
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
      projId: glBudgetingMode ? "GL" : "NA",
      projName: glBudgetingMode ? "GL Budgeting" : "NA",
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

    const isGLRow =
      glBudgetingMode &&
      (type === "Labor" || type === "Non-Labor" || type === "Revenue");

    const newRows = selectedOrgAccounts.map((acctId) => {
      const acctInfo = coaMap[acctId] || {};
      const mapped = mappingData.find((m) => m.acctId === acctId);
      const comboKey = isGLRow
        ? `GL_${acctId}_${selectedOrgForAdd}`
        : `TBD_${acctId}_${selectedOrgForAdd}_TBD`;

      const baseRow = {
        uid: `ui_${Math.random().toString(36).substring(2, 9)}`,
        id: `temp_${Date.now()}_${comboKey}_${Math.random()}`,
        projId: isGLRow ? "GL" : "NA",
        projName: isGLRow ? "GL Budgeting" : "NA",
        acctId: acctId || "",
        acctName: acctInfo.name || "",
        orgId: selectedOrgForAdd || "",
        pbrGroup: mapped?.pbrAcctGrp || acctInfo.pbrGroup || "",
        isGL: isGLRow,
        _isDirty: true,
      };

      if (type === "Labor") {
        return {
          ...baseRow,
          type: "Labor",
          empId: isGLRow ? "" : "TBD",
          empName: isGLRow ? "" : "TBD",
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
          vendorId: isGLRow ? "" : type === "Non-Labor" ? "TBD" : "",
          vendorName: isGLRow ? "" : type === "Non-Labor" ? "TBD" : "",
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
    // Allow empty value while typing, otherwise max 2 decimal places
    if (value !== "" && !/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }

    const setter =
      activeTab === "Labor"
        ? setLaborData
        : activeTab === "Revenue"
          ? setRevenueData
          : setNonLaborData;

    setter((prev) =>
      prev.map((row) => {
        if (row.uid !== rowUid) return row;

        let updatedRow;
        if (activeTab === "Labor") {
          if (glBudgetingMode) {
            updatedRow = {
              ...row,
              [`${month}Amount`]: value,
              [`${month}Hours`]: 0,
              _isDirty: true,
            };
          } else {
            const numVal = Number(value) || 0;
            const newMonthAmount = (numVal * (row.rate || 0)).toFixed(2);
            updatedRow = {
              ...row,
              [`${month}Hours`]: value,
              [`${month}Amount`]: newMonthAmount,
              _isDirty: true,
            };
          }
        } else {
          updatedRow = { ...row, [`${month}Amount`]: value, _isDirty: true };
        }

        let newTotalHours = 0;
        let newTotalAmount = 0;
        months.forEach((m) => {
          if (activeTab === "Labor" && !glBudgetingMode)
            newTotalHours += Number(updatedRow[`${m}Hours`] || 0);
          newTotalAmount += Number(updatedRow[`${m}Amount`] || 0);
        });

        return activeTab === "Labor" && !glBudgetingMode
          ? {
              ...updatedRow,
              totalHours: newTotalHours.toFixed(2),
              totalAmount: newTotalAmount.toFixed(2),
            }
          : {
              ...updatedRow,
              totalAmount: newTotalAmount.toFixed(2),
              ...(activeTab === "Labor" ? { totalHours: 0 } : {}),
            };
      }),
    );
  };

  const handleFillRowForward = (rowUid, startMonth, value) => {
    const val = Number(value) || 0;
    const startIndex = months.indexOf(startMonth);
    const setter =
      activeTab === "Labor"
        ? setLaborData
        : activeTab === "Revenue"
          ? setRevenueData
          : setNonLaborData;

    setter((prev) =>
      prev.map((row) => {
        if (row.uid !== rowUid) return row;
        let newTotalHours = 0;
        let newTotalAmount = 0;
        const newMonthly = {};
        months.forEach((m, idx) => {
          if (activeTab === "Labor") {
            if (glBudgetingMode) {
              const amt =
                idx >= startIndex ? val : Number(row[`${m}Amount`] || 0);
              newMonthly[`${m}Hours`] = 0;
              newMonthly[`${m}Amount`] = amt;
              newTotalAmount += amt;
            } else {
              const mVal =
                idx >= startIndex ? val : Number(row[`${m}Hours`] || 0);
              newMonthly[`${m}Hours`] = mVal;
              const amt = mVal * (row.rate || 0);
              newMonthly[`${m}Amount`] = amt;
              newTotalHours += mVal;
              newTotalAmount += amt;
            }
          } else {
            const mVal =
              idx >= startIndex ? val : Number(row[`${m}Amount`] || 0);
            newMonthly[`${m}Amount`] = mVal;
            newTotalAmount += mVal;
          }
        });
        return activeTab === "Labor" && !glBudgetingMode
          ? {
              ...row,
              ...newMonthly,
              totalHours: newTotalHours.toFixed(2),
              totalAmount: newTotalAmount.toFixed(2),
              _isDirty: true,
            }
          : {
              ...row,
              ...newMonthly,
              ...(activeTab === "Labor" ? { totalHours: 0 } : {}),
              totalAmount: newTotalAmount.toFixed(2),
              _isDirty: true,
            };
      }),
    );
    setHighlightedRow(rowUid);
    setTimeout(() => setHighlightedRow(null), 1200);
  };

  const handleFillColumnDown = (rowUid, month, value) => {
    const val = Number(value) || 0;
    const isLabor = activeTab === "Labor";
    const dataToFilter = isLabor
      ? filteredLaborData
      : activeTab === "Revenue"
        ? filteredRevenueData
        : filteredNonLaborData;
    const setter = isLabor
      ? setLaborData
      : activeTab === "Revenue"
        ? setRevenueData
        : setNonLaborData;

    const currentIndex = dataToFilter.findIndex((r) => r.uid === rowUid);
    if (currentIndex === -1) return;
    const targetUids = new Set(
      dataToFilter.slice(currentIndex).map((r) => r.uid),
    );

    setter((prev) =>
      prev.map((row) => {
        if (targetUids.has(row.uid)) {
          if (isLabor) {
            const oldMonthHours = Number(row[`${month}Hours`] || 0);
            const oldMonthAmount = Number(row[`${month}Amount`] || 0);
            if (glBudgetingMode) {
              const newTotalAmount =
                Number(row.totalAmount || 0) - oldMonthAmount + val;
              return {
                ...row,
                [`${month}Hours`]: 0,
                [`${month}Amount`]: value,
                totalHours: 0,
                totalAmount: newTotalAmount.toFixed(2),
                _isDirty: true,
              };
            }
            const newMonthAmount = val * (row.rate || 0);
            const newTotalHours =
              Number(row.totalHours || 0) - oldMonthHours + val;
            const newTotalAmount =
              Number(row.totalAmount || 0) - oldMonthAmount + newMonthAmount;
            return {
              ...row,
              [`${month}Hours`]: value,
              [`${month}Amount`]: newMonthAmount.toFixed(2),
              totalHours: newTotalHours.toFixed(2),
              totalAmount: newTotalAmount.toFixed(2),
              _isDirty: true,
            };
          } else {
            const oldMonthAmount = Number(row[`${month}Amount`] || 0);
            const newTotalAmount =
              Number(row.totalAmount || 0) - oldMonthAmount + val;
            return {
              ...row,
              [`${month}Amount`]: value,
              totalAmount: newTotalAmount.toFixed(2),
              _isDirty: true,
            };
          }
        }
        return row;
      }),
    );
    setHighlightedRow("column_flash");
    setTimeout(() => setHighlightedRow(null), 1200);
  };

  const handleSaveRecords = async () => {
    try {
      const laborSet = new Set();
      for (let row of laborData) {
        if (glBudgetingMode) {
          if (!row.acctId || !row.orgId) continue;
          const combo = `GL_${row.acctId}_${row.orgId}`;
          if (laborSet.has(combo)) {
            showToast(
              `Duplicate Row Error in GL Labor: Acct [${row.acctId}] | Org [${row.orgId}]`,
              "error",
            );
            return;
          }
          laborSet.add(combo);
        } else {
          if (!row.empId || row.empId === "TBD") continue;
          const combo = `${getTopLevelProj(row.projId) || "NA"}_${row.acctId}_${row.orgId}_${row.empId}`;
          if (laborSet.has(combo)) {
            showToast(
              `Duplicate Row Error in Labor: Proj [${row.projId}] | Acct [${row.acctId}] | Org [${row.orgId}] | Emp [${row.empId}]`,
              "error",
            );
            return;
          }
          laborSet.add(combo);
        }
      }

      const nlSet = new Set();
      for (let row of nonLaborData) {
        if (glBudgetingMode) {
          if (!row.acctId || !row.orgId) continue;
          const combo = `GL_${row.acctId}_${row.orgId}`;
          if (nlSet.has(combo)) {
            showToast(
              `Duplicate Row Error in GL Non-Labor: Acct [${row.acctId}] | Org [${row.orgId}]`,
              "error",
            );
            return;
          }
          nlSet.add(combo);
        } else {
          if (!row.vendorId || row.vendorId === "TBD") continue;
          const combo = `${getTopLevelProj(row.projId) || "NA"}_${row.acctId}_${row.orgId}_${row.vendorId}`;
          if (nlSet.has(combo)) {
            showToast(
              `Duplicate Row Error in Non-Labor: Proj [${row.projId}] | Acct [${row.acctId}] | Org [${row.orgId}] | Vendor [${row.vendorId}]`,
              "error",
            );
            return;
          }
          nlSet.add(combo);
        }
      }

      setSavingRecords(true);
      const currentVersionStatus =
        versions.find((v) => v.id === selectedVersion)?.status || "DRAFT";

      // const buildPayload = (rows, typeStr) => {
      //   return rows
      //     .filter(
      //       (row) =>
      //         row._isDirty || String(row.id).startsWith("temp_") || !row.id,
      //     )
      //     .map((row) => {
      const buildPayload = (rows, typeStr) => {
        return rows
          .filter((row) => row._isDirty)
          .map((row) => {
            const isNew = String(row.id).startsWith("temp_") || !row.id;
            const isLabor = typeStr === "LABOR";

            const monthlyData = months.map((m, idx) => ({
              fyCd: selectedFY,
              pdNo: idx + 1,
              hrs:
                isLabor && !glBudgetingMode ? Number(row[`${m}Hours`] || 0) : 0,
              amt: Number(row[`${m}Amount`] || 0),
              infRt: isLabor ? 0 : Number(row.inflationRate || 0),
            }));

            const isGLPayload =
              glBudgetingMode &&
              (typeStr === "LABOR" ||
                typeStr === "NONLABOR" ||
                typeStr === "REVENUE");

            const payloadRow = {
              version: selectedVersion,
              pbrType: typeStr,
              projId: glBudgetingMode
                ? "GL"
                : getTopLevelProj(row.projId) || "NA",
              emplRVendId: isGLPayload
                ? ""
                : isLabor
                  ? row.empId || ""
                  : row.vendorId || "",
              acctId: row.acctId || "",
              plcCode: isGLPayload
                ? "NA"
                : isLabor
                  ? row.laborCat === "- NA" || !row.laborCat
                    ? "NA"
                    : row.laborCat
                  : "NA",
              orgId: row.orgId || "",
              pbrAcctGrp: row.pbrGroup || "",
              hrlyRt: isGLPayload ? 0 : isLabor ? Number(row.rate || 0) : 0,
              status: currentVersionStatus.toUpperCase(),
              monthlyData: monthlyData,
            };

            if (!isNew && row.id != null && !isNaN(row.id)) {
              payloadRow.id = Number(row.id);
            }

            return payloadRow;
          });
      };

      const combinedRequests = [
        ...buildPayload(laborData, "LABOR"),
        ...buildPayload(nonLaborData, "NONLABOR"),
        ...buildPayload(revenueData, "REVENUE"),
      ];

      const dirtyMapping = mappingData.filter((m) => m._isDirty);

      if (combinedRequests.length === 0 && dirtyMapping.length === 0) {
        showToast("No changes detected to save.", "success");
        setSavingRecords(false);
        return;
      }

      if (combinedRequests.length > 0) {
        await axios.post(LNL_UPSERT_API, combinedRequests);
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
      await fetchData();
    } catch (err) {
      console.error("Save failed:", err);
      let errorMsg = "Failed to save records. Please try again.";

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
      activeTab === "Custom IS" ? pbrIncomeStatementData : incomeStatementData;
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
    let filename = `GL_Template_${activeTab.replace(/\s+/g, "_")}_V${selectedVersion}`;

    if (activeTab === "Labor") {
      templateDataSet = laborData.map((item) => ({
        Version: selectedVersion,
        ...(glBudgetingMode
          ? {}
          : {
              "Employee ID": item.empId,
              "Employee Name": item.empName,
              "Labor Cat": item.laborCat,
              "Project ID": item.projId,
              "Project Name": item.projName,
            }),
        "Account ID": item.acctId,
        "Account Name": item.acctName,
        "Org ID": item.orgId,
        "GL Account Group": item.pbrGroup,
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
        ...(glBudgetingMode
          ? {}
          : {
              "Vendor ID": item.vendorId,
              "Vendor Name": item.vendorName,
              "Project ID": item.projId,
              "Project Name": item.projName,
            }),
        "Account ID": item.acctId,
        "Account Name": item.acctName,
        "Org ID": item.orgId,
        "GL Account Group": item.pbrGroup,
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
    const file = event.target.files?.[0];
    if (!file) return;

    if (isApproved) {
      event.target.value = "";
      return;
    }

    if (activeTab !== "Labor" && activeTab !== "Non-Labor") {
      showToast("Import is available only for Labor and Non-Labor.", "error");
      event.target.value = "";
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to import "${file.name}" into GL ${activeTab}?`,
    );

    if (!isConfirmed) {
      event.target.value = "";
      return;
    }

    try {
      showToast("Reading GL template...", "info");

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      if (!firstSheet) {
        throw new Error("The Excel file does not contain a worksheet.");
      }

      const rows = XLSX.utils.sheet_to_json(firstSheet, {
        defval: "",
        raw: false,
      });

      if (!rows.length) {
        throw new Error("The Excel file does not contain any data rows.");
      }

      const normalizeHeader = (value) =>
        String(value ?? "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, " ");

      const firstRowHeaders = Object.keys(rows[0]).map(normalizeHeader);
      const hasHeader = (name) =>
        firstRowHeaders.includes(normalizeHeader(name));

      const accountIdHeader = hasHeader("Account ID")
        ? "Account ID"
        : Object.keys(rows[0]).find(
            (h) => normalizeHeader(h) === normalizeHeader("Acct ID"),
          );
      const accountNameHeader = hasHeader("Account Name")
        ? "Account Name"
        : Object.keys(rows[0]).find(
            (h) => normalizeHeader(h) === normalizeHeader("Acct Name"),
          );
      const orgIdHeader = hasHeader("Org ID")
        ? "Org ID"
        : Object.keys(rows[0]).find(
            (h) => normalizeHeader(h) === normalizeHeader("Organization ID"),
          );
      const glGroupHeader = Object.keys(rows[0]).find((h) =>
        [
          "gl account group",
          "gl group",
          "pbr account group",
          "pbr group",
        ].includes(normalizeHeader(h)),
      );

      if (!accountIdHeader || !orgIdHeader) {
        throw new Error(
          `Invalid GL ${activeTab} template. Required columns are Account ID and Org ID.`,
        );
      }

      const getCell = (row, header) =>
        header && Object.prototype.hasOwnProperty.call(row, header)
          ? row[header]
          : "";

      const numericValue = (value) => {
        if (value === null || value === undefined || value === "") return 0;
        const cleaned = String(value).replace(/[$,]/g, "").trim();
        const n = Number(cleaned);
        return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
      };

      // Keep the last occurrence of an Account ID + Org ID combination from
      // the Excel file. Importing the same combination again should update
      // the value instead of being treated as a duplicate error.
      const importedRowsByKey = new Map();

      rows.forEach((sourceRow, rowIndex) => {
        const acctId = String(getCell(sourceRow, accountIdHeader) || "").trim();
        const orgId = String(getCell(sourceRow, orgIdHeader) || "").trim();

        // Ignore completely blank rows.
        if (!acctId && !orgId) return;

        if (!acctId || !orgId) {
          throw new Error(
            `Row ${rowIndex + 2} is missing Account ID or Org ID.`,
          );
        }

        const acctInfo = coaMap[acctId] || {};
        const importedGroup = glGroupHeader
          ? String(getCell(sourceRow, glGroupHeader) || "").trim()
          : "";
        const mapped = mappingData.find(
          (m) => String(m.acctId).trim() === acctId,
        );
        const glGroup =
          importedGroup || mapped?.pbrAcctGrp || acctInfo.pbrGroup || "";

        const duplicateKey = `GL_${acctId}_${orgId}`;

        const monthlyValues = {};
        let totalAmount = 0;

        months.forEach((month) => {
          // GL Labor is amount-only. Accept both the new "Amt" template and
          // an older "Hrs" template so existing files can still be imported.
          const amountHeader = Object.keys(sourceRow).find(
            (h) =>
              normalizeHeader(h) === normalizeHeader(`${month} Amt`) ||
              normalizeHeader(h) === normalizeHeader(`${month} Amount`),
          );
          const hoursHeader = Object.keys(sourceRow).find(
            (h) => normalizeHeader(h) === normalizeHeader(`${month} Hrs`),
          );

          const amount = amountHeader
            ? numericValue(sourceRow[amountHeader])
            : hoursHeader
              ? numericValue(sourceRow[hoursHeader])
              : 0;

          monthlyValues[`${month}Amount`] = amount;
          monthlyValues[`${month}Hours`] = 0;
          totalAmount += amount;
        });

        const baseRow = {
          uid: `import_${Date.now()}_${rowIndex}_${Math.random()
            .toString(36)
            .slice(2, 8)}`,
          id: `temp_import_${Date.now()}_${rowIndex}_${Math.random()
            .toString(36)
            .slice(2, 8)}`,
          type: activeTab,
          projId: "GL",
          projName: "GL Budgeting",
          acctId,
          acctName:
            String(getCell(sourceRow, accountNameHeader) || "").trim() ||
            acctInfo.name ||
            "",
          orgId,
          orgName: resolveOrgName(orgId),
          pbrGroup: glGroup,
          isGL: true,
          inflationRate: 0,
          totalHours: 0,
          totalAmount: Number(totalAmount.toFixed(2)),
          _isDirty: true,
          ...monthlyValues,
        };

        const importedRow =
          activeTab === "Labor"
            ? {
                ...baseRow,
                empId: "",
                empName: "",
                empStatus: "",
                laborCat: "NA",
                rate: 0,
              }
            : {
                ...baseRow,
                vendorId: "",
                vendorName: "",
              };

        // If the Excel file itself contains the same Account ID + Org ID more
        // than once, the later row is treated as an update to the earlier row.
        importedRowsByKey.set(duplicateKey, importedRow);
      });

      const importedRows = Array.from(importedRowsByKey.values());

      if (importedRows.length === 0) {
        throw new Error("No valid GL records were found in the Excel file.");
      }

      const existingData = activeTab === "Labor" ? laborData : nonLaborData;

      let addedCount = 0;
      let updatedCount = 0;

      const mergeImportedRows = (prev) => {
        const importedByKey = new Map(
          importedRows.map((row) => [
            `GL_${String(row.acctId).trim()}_${String(row.orgId).trim()}`,
            row,
          ]),
        );

        const existingKeys = new Set();
        const next = prev.map((existingRow) => {
          const isGL =
            String(existingRow.projId || "")
              .trim()
              .toUpperCase() === "GL";
          const key = `GL_${String(existingRow.acctId || "").trim()}_${String(existingRow.orgId || "").trim()}`;

          if (!isGL || !importedByKey.has(key)) return existingRow;

          const importedRow = importedByKey.get(key);
          importedByKey.delete(key);
          existingKeys.add(key);
          updatedCount += 1;

          // Preserve the database/UI identity so the Save Records call sends
          // the existing record ID and performs an update rather than insert.
          return {
            ...existingRow,
            ...importedRow,
            id: existingRow.id,
            uid: existingRow.uid || importedRow.uid,
            _isDirty: true,
          };
        });

        // Any remaining imported rows are genuinely new records.
        importedByKey.forEach((row) => {
          next.push(row);
          addedCount += 1;
        });

        return next;
      };

      const nextData = mergeImportedRows(existingData);

      if (activeTab === "Labor") {
        setLaborData(nextData);
      } else {
        setNonLaborData(nextData);
      }

      const actionParts = [];
      if (addedCount > 0) actionParts.push(`${addedCount} added`);
      if (updatedCount > 0) actionParts.push(`${updatedCount} updated`);

      showToast(
        `GL ${activeTab} import completed: ${actionParts.join(", ")}. Click Save Records to save the changes.`,
        "success",
      );
    } catch (error) {
      console.error("Error importing GL Excel:", error);
      showToast(error?.message || "Failed to import GL Excel file.", "error");
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

      /* ---- Department/Organization Structure ---- */
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
        styles[rows.length] = { bold: true, bg: "C7D2FE" };
        rows.push([
          "Overall Wrap Rate",
          "Summary",
          n2(
            waterfallEngine.sourceCostTotal +
              waterfallEngine.cumulativeIndirectTotal,
          ),
          n2(waterfallEngine.overallWrapRate),
        ]);
        add(
          "Department/Organization Structure",
          buildStyledSheet(
            [
              "Department/Organization Structure",
              "Level",
              "Loaded Cost",
              "Overall Wrap Rate %",
            ],
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
          rows.push([t, ...Array(13).fill("")]);
        };
        const acct = (a) =>
          rows.push([
            `${a.orgId} - ${a.acctId} - ${a.accountName}${a.allocationAcctId && a.allocationAcctId !== a.acctId ? ` -> Allocates to [${a.allocationAcctId}]` : ""}`,
            n2(a.total),
            ...months.map((m) => n2(a[`${m}Amount`])),
          ]);
        const total = (label, tot, mm) => {
          styles[rows.length] = { bold: true, bg: "F1F5F9" };
          rows.push([
            label,
            n2(tot),
            ...months.map((m) => n2(mm[`${m}Amount`])),
          ]);
        };

        section("Cost");
        r.evaluatedCosts.forEach(acct);
        total("Total Cost", r.totalCost, r.costMonths);
        section("Base");
        r.evaluatedBases.forEach(acct);
        total("Total Base", r.totalBase, r.baseMonths);

        styles[rows.length] = { bold: true, bg: "E0E7FF", fmt: XL_PCT };
        rows.push([
          `${pool} Rate`,
          n2(r.rate * 100),
          ...months.map((m) => n2((r.rateMonths[`${m}Rate`] || 0) * 100)),
        ]);

        let rc = 0,
          rb = 0;
        styles[rows.length] = { bold: true, bg: "C7D2FE", fmt: XL_PCT };
        rows.push([
          `${pool} YTD Rate`,
          n2(r.rate * 100),
          ...months.map((m) => {
            rc += n2(r.costMonths[`${m}Amount`]);
            rb += n2(r.baseMonths[`${m}Amount`]);
            return rb === 0 ? 0 : (rc / rb) * 100;
          }),
        ]);

        add(
          `Rates - ${pool}`,
          buildStyledSheet(
            [
              "GL Overhead Group",
              "YTD Amount",
              ...months.map((m) => `${m} Amt`),
            ],
            rows,
            {
              money: Array.from({ length: 13 }, (_, i) => i + 1),
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
          "Hourly Rate",
          "Project ID",
          "Project Name",
          "Account ID",
          "Account Name",
          "Organization ID",
          "Organization Name",
          "GL Account Group",
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
          n2(r.totalHours),
          n2(r.totalAmount),
          ...months.flatMap((m) => [n2(r[`${m}Hours`]), n2(r[`${m}Amount`])]),
        ]);
        const { rows, rowStyles } = withTotals(base, 12, headers.length);
        add(
          "Labor",
          buildStyledSheet(headers, rows, {
            money: [4, 13, ...monthIdx(15, 2)],
            num: [12, ...monthIdx(14, 2)],
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
          "GL Account Group",
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
          "GL Account Group",
          "FY Amount",
        ];
        const base = nonLaborData.map((r) => [
          r.projId,
          r.projName,
          r.acctId,
          r.acctName,
          r.pbrGroup,
          n2(r.totalAmount),
        ]);
        const { rows, rowStyles } = withTotals(base, 5, headers.length);
        add(
          "Non-Labor Summary",
          buildStyledSheet(headers, rows, {
            money: [5],
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
          "GL Account Group",
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
        incomeStatementData.forEach((item) => {
          const mv = Array.from({ length: 12 }, (_, i) =>
            val(item.monthlyAmts?.[i + 1] ?? 0),
          );
          styles[rows.length] =
            item.type === "summary"
              ? { bold: true, bg: "E2E8F0" }
              : { bold: true, bg: "F1F5F9" };
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
          "Income Statement",
          buildStyledSheet(["Line Item", ...months, "YTD"], rows, {
            money: Array.from({ length: 13 }, (_, i) => i + 1),
            widths: [48],
            rowStyles: styles,
          }),
        );
      }

      /* ---- Custom IS ---- */
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
          "Custom IS",
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
            "GL Account Group",
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
            Corporate Budget By Department / Organization
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

            {(activeTab === "Department/Organization Structure" ||
              activeTab === "Income Statement" ||
              activeTab === "Custom IS") && (
              <>
                <button
                  type="button"
                  onClick={
                    activeTab === "Department/Organization Structure"
                      ? expandAll
                      : expandAllIS
                  }
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 text-[12px] font-medium text-slate-600 flex items-center gap-1.5 transition-colors"
                >
                  <Maximize2 size={14} /> Expand
                </button>
                <button
                  type="button"
                  // onClick={collapseAll}
                  onClick={
                    activeTab === "Department/Organization Structure"
                      ? collapseAll
                      : collapseAllIS
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
          {activeTab === "Labor Summary" && (
            <label className="flex items-center gap-1.5 cursor-pointer text-[12px] font-medium text-slate-600 select-none bg-slate-50 px-2 py-1 rounded border border-slate-200">
              <input
                type="checkbox"
                checked={showMonthlySummary}
                onChange={(e) => setShowMonthlySummary(e.target.checked)}
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
          {(activeTab === "Department/Organization Structure" ||
            activeTab === "Rates Trend") && (
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
        <div className="flex-none flex bg-slate-50 border-b border-slate-200 px-6 pt-3 gap-6 overflow-x-auto w-full">
          {RATE_TABS.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveRateTab(tab)}
              className={`pb-2 text-[12px] font-medium whitespace-nowrap transition-colors border-b-2 ${activeRateTab === tab ? "border-indigo-500 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"}`}
            >
              {tab}
            </button>
          ))}
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

        {/* GL STRUCTURE - MONTHLY RATE GRAPH */}
        {activeTab === "Department/Organization Structure" && !loading && (
          <div className="flex-none bg-white border border-slate-200 shadow-sm p-5 rounded-xl mb-4">
            <h3 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Layers size={16} className="text-indigo-500" />
              Department / Organization Pool Rates&amp; Overall Wrap Rate
            </h3>

            {/* <div className="flex items-end gap-3 h-52 w-full px-2"> */}
            <div className="flex items-end gap-3 h-52 w-full px-2 overflow-visible">
              {months.map((month) => {
                const pools = WATERFALL_SEQUENCE.map((poolName) => ({
                  name: poolName,
                  rate:
                    Number(
                      waterfallEngine.results[poolName]?.rateMonths?.[
                        `${month}Rate`
                      ] || 0,
                    ) * 100,
                })).filter((p) => waterfallEngine.results[p.name]);

                const overallWrapRate = Number(
                  waterfallEngine.overallWrapRateMonths?.[`${month}Rate`] || 0,
                );

                const values = [...pools.map((p) => p.rate), overallWrapRate];
                const maxRate = Math.max(1, ...values);

                return (
                  <div
                    key={month}
                    className="flex-1 flex flex-col justify-end items-center gap-2 group relative min-w-0"
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

                      <div
                        style={{
                          height: `${Math.max(2, (overallWrapRate / maxRate) * 100)}%`,
                        }}
                        className="flex-1 bg-violet-500 rounded-t-md hover:bg-violet-600 transition-all cursor-pointer shadow-sm min-w-[4px]"
                        title={`Overall Wrap Rate - ${overallWrapRate.toFixed(2)}x`}
                      />
                    </div>

                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {month}
                    </span>

                    {/* <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-slate-800 text-white text-[11px] p-3 rounded-lg shadow-xl whitespace-nowrap z-50 min-w-[190px]"> */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-slate-800 text-white text-[11px] p-3 rounded-lg shadow-xl whitespace-nowrap z-[100] min-w-[220px]">
                      <div className="font-bold border-b border-slate-600 pb-1.5 mb-2 text-center text-slate-200">
                        {month} FY{selectedYear}
                      </div>

                      {pools.map(({ name, rate }) => (
                        <div key={name} className="flex justify-between gap-4">
                          <span>{name}:</span>
                          <span>{rate.toFixed(2)}%</span>
                        </div>
                      ))}

                      <div className="flex justify-between gap-4 mt-2 pt-2 border-t border-slate-600 font-semibold">
                        <span className="text-violet-300">
                          Overall Wrap Rate:
                        </span>
                        <span>{overallWrapRate.toFixed(2)}x</span>
                      </div>

                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-8 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-400 rounded-sm shadow-sm" />
                <span className="text-[12px] font-medium text-slate-600">
                  GL Pool Rate
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-violet-500 rounded-sm shadow-sm" />
                <span className="text-[12px] font-medium text-slate-600">
                  Overall Wrap Rate
                </span>
              </div>
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
                      if (activeTab === "Labor") {
                        if (glBudgetingMode) setLaborAddTab("Org/Account");
                        setShowAddLabor(!showAddLabor);
                      } else if (activeTab === "Revenue") {
                        setShowAddRevenue(!showAddRevenue);
                      } else {
                        if (glBudgetingMode) setNonLaborAddTab("Org/Account");
                        setShowAddNonLabor(!showAddNonLabor);
                      }
                    }}
                    disabled={isApproved}
                    className="px-3 py-1.5 bg-white text-slate-700 font-medium text-[12px] border border-slate-200 shadow-sm rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    + Add Record
                  </button>
                  {/* {(activeTab === "Labor" || activeTab === "Non-Labor") && (
                    <button
                      type="button"
                      onClick={() => setShowImportActuals(true)}
                      disabled={isApproved || loading || glBudgetingMode}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-medium text-[12px] border border-indigo-200 shadow-sm rounded-md hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Import Actuals
                    </button>
                  )} */}
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-2 py-1.5 border border-slate-200 rounded-md shadow-sm transition-colors ${showFilters ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                    title="Toggle Filter Row"
                  >
                    <Search size={14} />
                  </button>
                </div>

                {/* {glBudgetingMode && (activeTab === "Labor" || activeTab === "Non-Labor") && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-md text-[11px] font-semibold text-indigo-700">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    GL Budgeting Mode — Account ID + Organization ID only
                  </div>
                )} */}

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
                        .filter((k) => isVisibleAccount(coaMap[k]))
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
                      {!glBudgetingMode && (
                        <button
                          type="button"
                          onClick={() => setLaborAddTab("Employee")}
                          className={`flex-1 py-2.5 text-[12px] font-medium ${laborAddTab === "Employee" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                        >
                          By Employee
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setLaborAddTab("Org/Account")}
                        className={`flex-1 py-2.5 text-[12px] font-medium ${laborAddTab === "Org/Account" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        Org/Account
                      </button>
                    </div>
                    <div className="p-4">
                      {!glBudgetingMode && laborAddTab === "Employee" ? (
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
                        {!glBudgetingMode && (
                          <button
                            type="button"
                            onClick={() => setNonLaborAddTab("Vendor")}
                            className={`flex-1 py-2.5 text-[12px] font-medium ${nonLaborAddTab === "Vendor" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                          >
                            Vendor
                          </button>
                        )}
                        {!glBudgetingMode && (
                          <button
                            type="button"
                            onClick={() => setNonLaborAddTab("Project")}
                            className={`flex-1 py-2.5 text-[12px] font-medium ${nonLaborAddTab === "Project" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                          >
                            Project
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setNonLaborAddTab("Org/Account")}
                          className={`flex-1 py-2.5 text-[12px] font-medium ${nonLaborAddTab === "Org/Account" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                        >
                          Org/Account
                        </button>
                        {!glBudgetingMode && (
                          <button
                            type="button"
                            onClick={() => setNonLaborAddTab("Other")}
                            className={`flex-1 py-2.5 text-[12px] font-medium ${nonLaborAddTab === "Other" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-800"}`}
                          >
                            Custom
                          </button>
                        )}
                      </div>
                      {/* <div className="p-4">
                        {!glBudgetingMode && nonLaborAddTab === "Vendor" && (
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
                        {!glBudgetingMode && nonLaborAddTab === "Project" && (
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
                        {(glBudgetingMode ||
                          nonLaborAddTab === "Org/Account") && (
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
                  disabled={savingRecords || isApproved}
                  className="px-5 py-2 bg-indigo-600 text-white font-medium text-[13px] rounded-md hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingRecords ? "Saving..." : "Save Records"}
                </button>
              </div>
            </div>

            {showImportActuals &&
              (activeTab === "Labor" || activeTab === "Non-Labor") &&
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
                    </div>
                    <div className="px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowImportActuals(false)}
                        className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-medium hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      {/* <button
                        type="button"
                        onClick={handleImportActuals}
                        disabled={!importActualsLabor && !importActualsNonLabor}
                        className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-[12px] font-medium hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Import Actuals
                      </button> */}
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
                  width: glBudgetingMode
                    ? `${(activeTab === "Labor"
                        ? glLaborLeftCols
                        : activeTab === "Revenue"
                          ? revenueLeftCols
                          : glNonLaborLeftCols
                      ).reduce((sum, c) => sum + Number(c.w || 0), 0)}px`
                    : "50%",
                  minWidth: glBudgetingMode ? "0px" : "30%",
                  maxWidth: glBudgetingMode ? "none" : "80%",
                }}
              >
                <table className="border-collapse tabular-nums whitespace-nowrap text-[13px] table-fixed w-max">
                  <thead className="bg-slate-50 sticky top-0 z-50 shadow-[0_1px_0_0_#e2e8f0]">
                    <tr className="text-slate-500 text-[11px] font-semibold tracking-wider">
                      {(activeTab === "Labor"
                        ? glLaborLeftCols
                        : activeTab === "Revenue"
                          ? revenueLeftCols
                          : glNonLaborLeftCols
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
                          ? glLaborLeftCols
                          : activeTab === "Revenue"
                            ? revenueLeftCols
                            : glNonLaborLeftCols
                        ).map((col) => (
                          <th
                            key={`filter-${col.key}`}
                            className="px-2 py-1.5 border-r border-slate-200 font-normal"
                          >
                            {col.key !== "select" && col.key !== "action" ? (
                              <input
                                type="text"
                                value={activeColumnFilters[col.key] || ""}
                                onChange={(e) =>
                                  setActiveColumnFilter(col.key, e.target.value)
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
                            ? glLaborLeftCols
                            : activeTab === "Revenue"
                              ? revenueLeftCols
                              : glNonLaborLeftCols;
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
                                const displayValue =
                                  col.key === "orgName"
                                    ? row.orgName || resolveOrgName(row.orgId)
                                    : row[col.key];
                                inputElement = (
                                  <div className="px-3 py-2 text-[12px] truncate text-slate-500 select-none bg-slate-50/50 h-full w-full border-b border-transparent">
                                    {row[col.key] || "-"}
                                  </div>
                                );
                              } else if (col.key === "rate" && !isApproved) {
                                inputElement = (
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={row.rate === 0 ? "" : row.rate}
                                    onChange={(e) => {
                                      const newRate =
                                        Number(e.target.value) || 0;
                                      setLaborData((prev) =>
                                        prev.map((r) => {
                                          if (r.uid !== row.uid) return r;
                                          let newTotalAmount = 0;
                                          const newMonthly = {};
                                          months.forEach((m) => {
                                            const hrs = Number(
                                              r[`${m}Hours`] || 0,
                                            );
                                            const amt = Number(
                                              (hrs * newRate).toFixed(2),
                                            );
                                            newMonthly[`${m}Amount`] = amt;
                                            newTotalAmount += amt;
                                          });
                                          return {
                                            ...r,
                                            rate: e.target.value,
                                            totalAmount: Number(
                                              newTotalAmount.toFixed(2),
                                            ),
                                            _isDirty: true,
                                            ...newMonthly,
                                          };
                                        }),
                                      );
                                    }}
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
                                      .filter((k) =>
                                        isVisibleAccount(coaMap[k]),
                                      )
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
                          colSpan={
                            activeTab === "Labor"
                              ? glLaborLeftCols.length
                              : activeTab === "Revenue"
                                ? revenueLeftCols.length
                                : glNonLaborLeftCols.length
                          }
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
                            ? glLaborLeftCols.length
                            : activeTab === "Revenue"
                              ? revenueLeftCols.length
                              : glNonLaborLeftCols.length
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
                          {!glBudgetingMode && (
                            <th className="px-3 py-2 text-right border-r border-slate-200 min-w-[100px]">
                              Total Hours
                            </th>
                          )}
                          <th className="px-3 py-2 text-right border-r border-slate-200 min-w-[120px]">
                            Total Amount
                          </th>
                          {months.map((m) => (
                            <React.Fragment key={m}>
                              {!glBudgetingMode && (
                                <th className="px-3 py-2 text-right border-r border-slate-200 min-w-[100px]">
                                  {m} Hrs
                                </th>
                              )}
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
                              Inflation Rate
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
                              {m} Amt
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
                            {!glBudgetingMode && (
                              <th className="px-2 py-1.5 border-r border-slate-200">
                                <div className="h-[26px]"></div>
                              </th>
                            )}
                            <th className="px-2 py-1.5 border-r border-slate-200"></th>
                            {months.map((m) => (
                              <React.Fragment key={`f-rt-${m}`}>
                                {!glBudgetingMode && (
                                  <th className="px-2 py-1.5 border-r border-slate-200"></th>
                                )}
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
                                {!glBudgetingMode && (
                                  <td className="px-3 py-1.5 border-r border-slate-100 text-right font-medium text-slate-800 h-[36px]">
                                    {Number(row.totalHours || 0).toFixed(2)}
                                  </td>
                                )}
                                <td className="px-3 py-1.5 border-r border-slate-100 text-right font-semibold text-indigo-700 h-[36px]">
                                  {formatCurrency(row.totalAmount)}
                                </td>
                                {months.map((m) => (
                                  <React.Fragment key={`td-${m}-${idx}`}>
                                    {!glBudgetingMode && (
                                      <td className="border-r border-slate-100 h-[36px] relative p-0">
                                        <div className="flex items-center justify-end h-full w-full">
                                          <input
                                            type="number"
                                            step="0.01"
                                            disabled={isApproved}
                                            value={row[`${m}Hours`] ?? ""}
                                            onChange={(e) =>
                                              handleAmountChange(
                                                row.uid,
                                                m,
                                                e.target.value,
                                              )
                                            }
                                            className="w-full h-full min-h-[34px] border-none px-3 text-right text-[12px] text-slate-700 outline-none focus:ring-inset focus:ring-1 focus:ring-indigo-500 bg-transparent hover:bg-white focus:bg-white disabled:text-slate-400 rounded-sm"
                                          />
                                          {!isApproved && (
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
                                    )}
                                    <td className="border-r border-slate-100 h-[36px] relative p-0">
                                      <div className="flex items-center justify-end h-full w-full">
                                        {glBudgetingMode ? (
                                          <>
                                            <input
                                              type="number"
                                              step="0.01"
                                              disabled={isApproved}
                                              value={row[`${m}Amount`] ?? ""}
                                              onChange={(e) =>
                                                handleAmountChange(
                                                  row.uid,
                                                  m,
                                                  e.target.value,
                                                )
                                              }
                                              className="w-full h-full min-h-[34px] border-none px-3 text-right text-[12px] text-slate-700 outline-none focus:ring-inset focus:ring-1 focus:ring-indigo-500 bg-transparent hover:bg-white focus:bg-white disabled:text-slate-400 rounded-sm"
                                            />
                                            {!isApproved && (
                                              <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity absolute left-1">
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleFillRowForward(
                                                      row.uid,
                                                      m,
                                                      row[`${m}Amount`],
                                                    )
                                                  }
                                                  className="text-slate-400 hover:text-indigo-600 focus:outline-none"
                                                  title="Copy this amount to the remaining months"
                                                >
                                                  <ChevronsRight size={12} />
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleFillColumnDown(
                                                      row.uid,
                                                      m,
                                                      row[`${m}Amount`],
                                                    )
                                                  }
                                                  className="text-slate-400 hover:text-indigo-600 focus:outline-none"
                                                  title="Copy this amount down"
                                                >
                                                  <ChevronsDown size={12} />
                                                </button>
                                              </div>
                                            )}
                                          </>
                                        ) : (
                                          <span className="px-3 text-slate-600">
                                            {formatCurrency(row[`${m}Amount`])}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  </React.Fragment>
                                ))}
                              </>
                            ) : (
                              <>
                                {activeTab !== "Revenue" && (
                                  <td className="px-3 py-1.5 border-r border-slate-100 text-right font-medium text-slate-600 h-[36px]">
                                    {row.inflationRate || "0.00"}%
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
                                          disabled={isApproved}
                                          value={
                                            row[`${m}Amount`] === undefined ||
                                            row[`${m}Amount`] === null
                                              ? ""
                                              : row[`${m}Amount`]
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
                                        {!isApproved && (
                                          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity absolute left-1">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleFillRowForward(
                                                  row.uid,
                                                  m,
                                                  row[`${m}Amount`],
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
                                                  row[`${m}Amount`],
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
                          {!glBudgetingMode && (
                            <td className="px-3 py-2 border-r border-slate-200 text-right text-slate-800">
                              {getActiveFilteredData()
                                .reduce(
                                  (sum, row) =>
                                    sum + Number(row.totalHours || 0),
                                  0,
                                )
                                .toFixed(2)}
                            </td>
                          )}
                          <td className="px-3 py-2 border-r border-slate-200 text-right text-indigo-700">
                            {formatCurrency(
                              getActiveFilteredData().reduce(
                                (sum, row) =>
                                  sum +
                                  months.reduce(
                                    (monthSum, m) =>
                                      monthSum + Number(row[`${m}Amount`] || 0),
                                    0,
                                  ),
                                0,
                              ),
                            )}
                          </td>
                          {months.map((m) => (
                            <React.Fragment key={`ft-${m}`}>
                              {!glBudgetingMode && (
                                <td className="px-3 py-2 border-r border-slate-200 text-right text-slate-700">
                                  {getActiveFilteredData()
                                    .reduce(
                                      (sum, row) =>
                                        sum + Number(row[`${m}Hours`] || 0),
                                      0,
                                    )
                                    .toFixed(2)}
                                </td>
                              )}
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
                        GL Account Group
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
                  {/* GL Group Maintenance Pane */}
                  <div className="flex-1 flex flex-col gap-4 bg-white border border-slate-200 shadow-sm rounded-xl p-5">
                    <h3 className="font-bold text-slate-800 text-[14px] border-b border-slate-100 pb-3">
                      GL Account Group Maintenance
                    </h3>
                    <div className="flex gap-3 items-center bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
                      <input
                        type="text"
                        value={newPbrGroup}
                        onChange={(e) => setNewPbrGroup(e.target.value)}
                        placeholder="Enter new GL Group..."
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
                              GL Account Group Name
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
              {activeTab === "Department/Organization Structure" && (
                <thead className="bg-slate-50 sticky top-0 z-50 shadow-[0_1px_0_0_#e2e8f0]">
                  <tr className="text-slate-500 text-[11px] font-semibold tracking-wider">
                    <th className="px-4 py-2.5 text-left border-r border-slate-200 w-3/5">
                      <div className="flex items-center gap-3">
                        Department/Organization Structure
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
                      Department / Organization Rate % (Total Year)
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
                      GL Account Group
                    </th>
                    <th className="px-4 py-2.5 text-right border-r border-slate-200">
                      FY Amount
                    </th>
                  </tr>
                </thead>
              )}

              {activeTab === "Rates Trend" && (
                <thead className="bg-slate-50 sticky top-0 z-50 shadow-[0_1px_0_0_#e2e8f0]">
                  <tr className="text-slate-500 text-[11px] font-semibold tracking-wider">
                    <th className="px-4 py-2.5 text-left border-r border-slate-200 w-72 sticky left-0 z-50 bg-slate-50">
                      GL Overhead Group
                    </th>
                    <th className="px-4 py-2.5 text-right border-r border-slate-200">
                      YTD Amount
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
                activeTab === "Custom IS") && (
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
                ) : activeTab === "Department/Organization Structure" ? (
                  pbrTreeData.length === 0 && !loading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-8 text-center text-slate-400 text-[13px]"
                      >
                        No GL data found.
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
                ) : activeTab === "Custom IS" ? (
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
                            monthly: Object.fromEntries(
                              months.map((m) => [`${m}Amount`, 0]),
                            ),
                            orgs: new Map(),
                          });
                        }

                        const account = accountMap.get(key);
                        account.total += Number(row.total || 0);

                        months.forEach((m) => {
                          account.monthly[`${m}Amount`] += Number(
                            row[`${m}Amount`] || 0,
                          );
                        });

                        if (!account.orgs.has(orgId)) {
                          account.orgs.set(orgId, {
                            orgId,
                            total: 0,
                            monthly: Object.fromEntries(
                              months.map((m) => [`${m}Amount`, 0]),
                            ),
                            allocations: [],
                          });
                        }

                        const org = account.orgs.get(orgId);
                        org.total += Number(row.total || 0);

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
                            colSpan={14}
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
                            colSpan={14}
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={30}
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
          {activeTab === "Department/Organization Structure"
            ? `Ready - Viewing Department/Organization Structure - ${pbrTreeData.length} Pools`
            : activeTab === "Rates Trend"
              ? `Ready - Viewing ${activeRateTab}`
              : activeTab === "Project Performance"
                ? `Ready - Viewing Project Performance`
                : activeTab === "Income Statement"
                  ? `Ready - Viewing Income Statement`
                  : activeTab === "Custom IS"
                    ? `Ready - Viewing Custom IS`
                    : activeTab === "Labor" ||
                        activeTab === "Non-Labor" ||
                        activeTab === "Revenue"
                      ? `Ready - Viewing ${activeTab} Schedule - Total Rows: ${totalRowsCount}`
                      : `Showing total rows: ${totalRowsCount}`}
        </span>

        <div className="flex items-center gap-5 ml-auto">
          {activeTab !== "Department/Organization Structure" &&
            activeTab !== "Rates Trend" &&
            activeTab !== "Project Performance" &&
            activeTab !== "Income Statement" &&
            activeTab !== "Custom IS" &&
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
